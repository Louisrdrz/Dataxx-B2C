import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { stripeConfig, getSearchesPerMonth, PlanName } from '@/lib/stripe/config';
import { adminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

// Désactiver le parsing du body par Next.js car nous avons besoin du raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Signature Stripe manquante' });
  }

  let event: Stripe.Event;

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      stripeConfig.webhookSecret
    );
  } catch (err: any) {
    console.error('Erreur de vérification du webhook:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('Webhook Stripe reçu:', event.type);

  try {
    // Gérer les différents types d'événements
    switch (event.type) {
      // === ÉVÉNEMENTS CHECKOUT ===
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      // === ÉVÉNEMENTS ABONNEMENT ===
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleUserSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleUserSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      // === ÉVÉNEMENTS PAIEMENT ===
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Erreur lors du traitement du webhook:', error);
    return res.status(500).json({ 
      error: 'Erreur lors du traitement du webhook',
      details: error.message 
    });
  }
}

// === HANDLERS ===

// Gérer la session de checkout complétée
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session complétée:', session.id);

  const userId = session.metadata?.userId;
  const planName = session.metadata?.planName as PlanName;
  const planType = session.metadata?.planType;

  if (!userId || !planName) {
    throw new Error('Métadonnées manquantes dans la session checkout');
  }

  // Si c'est un abonnement récurrent
  if (session.mode === 'subscription' && session.subscription) {
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await createOrUpdateUserSubscription(subscription, userId, planName);
  }
  
  // Si c'est un paiement unique (one_shot)
  if (session.mode === 'payment' && session.payment_intent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
    await createOneShotSubscription(paymentIntent, userId, session.customer as string);
  }
}

// Gérer le paiement unique réussi (pour one_shot)
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment Intent succeeded:', paymentIntent.id);

  const userId = paymentIntent.metadata?.userId;
  const planType = paymentIntent.metadata?.planType;

  // On ne traite que les paiements one_shot ici
  // Les abonnements sont gérés par handleCheckoutSessionCompleted
  if (planType === 'one_shot' && userId) {
    // Vérifier si l'abonnement existe déjà (créé par checkout.session.completed)
    const existingSnapshot = await adminDb
      .collection('userSubscriptions')
      .where('stripePaymentIntentId', '==', paymentIntent.id)
      .limit(1)
      .get();

    if (existingSnapshot.empty) {
      await createOneShotSubscription(paymentIntent, userId, paymentIntent.customer as string);
    }
  }
}

// Créer un abonnement one_shot
async function createOneShotSubscription(
  paymentIntent: Stripe.PaymentIntent,
  userId: string,
  customerId: string
) {
  const subscriptionsRef = adminDb.collection('userSubscriptions');
  const now = Timestamp.now();

  const planDetails = stripeConfig.plans.one_shot;

  const subscriptionData = {
    userId,
    planType: 'one_shot',
    planName: 'One Shot',
    stripeCustomerId: customerId,
    stripePaymentIntentId: paymentIntent.id,
    stripePriceId: planDetails.priceId || '',
    status: 'one_time_available',
    searchesPerMonth: 1,
    searchesUsedThisMonth: 0,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    isRecurring: false,
    createdAt: now,
    updatedAt: now,
  };

  await subscriptionsRef.add(subscriptionData);
  console.log('Abonnement One Shot créé dans Firestore');
}

// Gérer la mise à jour d'un abonnement utilisateur
async function handleUserSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Abonnement utilisateur mis à jour:', subscription.id);

  const userId = subscription.metadata?.userId;
  const planName = subscription.metadata?.planName as PlanName;

  if (!userId) {
    console.error('UserId manquant dans les métadonnées de l\'abonnement');
    return;
  }

  await createOrUpdateUserSubscription(subscription, userId, planName || 'basic');
}

// Gérer la suppression d'un abonnement utilisateur
async function handleUserSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Abonnement supprimé:', subscription.id);

  // Trouver l'abonnement dans Firestore
  const subscriptionsRef = adminDb.collection('userSubscriptions');
  const snapshot = await subscriptionsRef
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.error('Abonnement non trouvé dans Firestore');
    return;
  }

  const docId = snapshot.docs[0].id;

  // Mettre à jour le statut à "canceled"
  await subscriptionsRef.doc(docId).update({
    status: 'canceled',
    canceledAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  console.log('Abonnement marqué comme annulé dans Firestore');
}

// Gérer le paiement d'une facture réussi
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Paiement de facture réussi:', invoice.id);

  // Si c'est un abonnement, mettre à jour et réinitialiser le compteur mensuel
  const invoiceData = invoice as any;
  if (invoiceData.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoiceData.subscription as string) as any;
    const userId = subscription.metadata?.userId;
    const planName = subscription.metadata?.planName as PlanName;

    if (userId) {
      // Mettre à jour l'abonnement
      await createOrUpdateUserSubscription(subscription, userId, planName || 'basic');

      // Réinitialiser le compteur de recherches si c'est un renouvellement
      if (invoiceData.billing_reason === 'subscription_cycle') {
        const subscriptionsRef = adminDb.collection('userSubscriptions');
        const snapshot = await subscriptionsRef
          .where('stripeSubscriptionId', '==', subscription.id)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          await subscriptionsRef.doc(snapshot.docs[0].id).update({
            searchesUsedThisMonth: 0,
            searchesResetDate: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          console.log('Compteur de recherches réinitialisé');
        }
      }
    }
  }
}

// Gérer le paiement d'une facture échoué
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Paiement de facture échoué:', invoice.id);

  const invoiceData = invoice as any;
  if (invoiceData.subscription) {
    const subscriptionsRef = adminDb.collection('userSubscriptions');
    const snapshot = await subscriptionsRef
      .where('stripeSubscriptionId', '==', invoiceData.subscription)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;

      // Mettre à jour le statut
      await subscriptionsRef.doc(docId).update({
        status: 'past_due',
        updatedAt: Timestamp.now(),
      });

      console.log('Abonnement marqué comme en retard de paiement');
    }
  }
}

// === HELPER FUNCTIONS ===

// Fonction helper pour créer ou mettre à jour l'abonnement dans Firestore
async function createOrUpdateUserSubscription(
  subscriptionParam: Stripe.Subscription,
  userId: string,
  planName: PlanName
) {
  const subscription = subscriptionParam as any;
  const subscriptionsRef = adminDb.collection('userSubscriptions');

  // Chercher si un abonnement existe déjà pour cet utilisateur avec ce stripeSubscriptionId
  const existingSnapshot = await subscriptionsRef
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  const priceId = subscription.items.data[0].price.id;
  const amount = subscription.items.data[0].price.unit_amount || 0;
  const currency = subscription.items.data[0].price.currency;

  // Déterminer les limites en fonction du plan
  const searchesPerMonth = getSearchesPerMonth(planName);

  const subscriptionData = {
    userId,
    planType: planName,
    planName: planName === 'basic' ? 'Basic' : planName === 'pro' ? 'Pro' : 'One Shot',
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    stripeProductId: subscription.items.data[0].price.product as string,
    status: subscription.status,
    searchesPerMonth,
    amount,
    currency,
    isRecurring: true,
    currentPeriodStart: Timestamp.fromDate(new Date(subscription.current_period_start * 1000)),
    currentPeriodEnd: Timestamp.fromDate(new Date(subscription.current_period_end * 1000)),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    ...(subscription.canceled_at && {
      canceledAt: Timestamp.fromDate(new Date(subscription.canceled_at * 1000)),
    }),
    ...(subscription.trial_start && {
      trialStart: Timestamp.fromDate(new Date(subscription.trial_start * 1000)),
    }),
    ...(subscription.trial_end && {
      trialEnd: Timestamp.fromDate(new Date(subscription.trial_end * 1000)),
    }),
    updatedAt: Timestamp.now(),
  };

  if (existingSnapshot.empty) {
    // Chercher si l'utilisateur a déjà un abonnement actif pour le mettre à jour
    const userSubscriptionSnapshot = await subscriptionsRef
      .where('userId', '==', userId)
      .where('status', 'in', ['active', 'trialing'])
      .limit(1)
      .get();

    if (!userSubscriptionSnapshot.empty) {
      // Mettre à jour l'abonnement existant
      const docId = userSubscriptionSnapshot.docs[0].id;
      const existingData = userSubscriptionSnapshot.docs[0].data();
      await subscriptionsRef.doc(docId).update({
        ...subscriptionData,
        // Conserver le compteur de recherches si on change de plan dans le même mois
        searchesUsedThisMonth: existingData.searchesUsedThisMonth || 0,
      });
      console.log('Abonnement utilisateur mis à jour dans Firestore');
    } else {
      // Créer un nouvel abonnement
      await subscriptionsRef.add({
        ...subscriptionData,
        searchesUsedThisMonth: 0,
        createdAt: Timestamp.now(),
      });
      console.log('Nouvel abonnement utilisateur créé dans Firestore');
    }
  } else {
    // Mettre à jour l'abonnement existant
    const docId = existingSnapshot.docs[0].id;
    await subscriptionsRef.doc(docId).update(subscriptionData);
    console.log('Abonnement utilisateur mis à jour dans Firestore');
  }
}
