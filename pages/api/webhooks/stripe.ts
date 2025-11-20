import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { stripeConfig } from '@/lib/stripe/config';
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
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
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

// Gérer la session de checkout complétée
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session complétée:', session.id);

  const workspaceId = session.metadata?.workspaceId;
  const userId = session.metadata?.userId;
  const planName = session.metadata?.planName;

  if (!workspaceId || !userId || !planName) {
    throw new Error('Métadonnées manquantes dans la session checkout');
  }

  // Récupérer l'abonnement complet
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Créer ou mettre à jour l'abonnement dans Firestore
  await updateSubscriptionInFirestore(subscription, workspaceId, userId, planName);
}

// Gérer la mise à jour d'un abonnement
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Abonnement mis à jour:', subscription.id);

  const workspaceId = subscription.metadata?.workspaceId;
  const userId = subscription.metadata?.userId;
  const planName = subscription.metadata?.planName;

  if (!workspaceId || !userId) {
    console.error('Métadonnées manquantes dans l\'abonnement');
    return;
  }

  await updateSubscriptionInFirestore(subscription, workspaceId, userId, planName || 'basic');
}

// Gérer la suppression d'un abonnement
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Abonnement supprimé:', subscription.id);

  // Trouver l'abonnement dans Firestore
  const subscriptionsRef = adminDb.collection('subscriptions');
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

  // Si c'est un abonnement, mettre à jour les dates
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const workspaceId = subscription.metadata?.workspaceId;
    const userId = subscription.metadata?.userId;
    const planName = subscription.metadata?.planName;

    if (workspaceId && userId) {
      await updateSubscriptionInFirestore(subscription, workspaceId, userId, planName || 'basic');
    }
  }
}

// Gérer le paiement d'une facture échoué
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Paiement de facture échoué:', invoice.id);

  // Trouver l'abonnement dans Firestore
  if (invoice.subscription) {
    const subscriptionsRef = adminDb.collection('subscriptions');
    const snapshot = await subscriptionsRef
      .where('stripeSubscriptionId', '==', invoice.subscription)
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

      // Ici, vous pourriez envoyer un email à l'admin du workspace
      // pour l'informer du problème de paiement
    }
  }
}

// Fonction helper pour mettre à jour l'abonnement dans Firestore
async function updateSubscriptionInFirestore(
  subscription: Stripe.Subscription,
  workspaceId: string,
  userId: string,
  planName: string
) {
  const subscriptionsRef = adminDb.collection('subscriptions');

  // Chercher si un abonnement existe déjà pour ce workspace
  const existingSnapshot = await subscriptionsRef
    .where('workspaceId', '==', workspaceId)
    .limit(1)
    .get();

  const priceId = subscription.items.data[0].price.id;
  const amount = subscription.items.data[0].price.unit_amount || 0;
  const currency = subscription.items.data[0].price.currency;
  const interval = subscription.items.data[0].price.recurring?.interval || 'month';

  // Déterminer les limites en fonction du plan
  const planDetails = stripeConfig.plans[planName as 'basic' | 'pro'];
  const maxMembers = planDetails?.limits.maxMembers || 3;

  const subscriptionData = {
    workspaceId,
    managedBy: userId,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    stripeProductId: subscription.items.data[0].price.product as string,
    status: subscription.status,
    planName: planName.charAt(0).toUpperCase() + planName.slice(1),
    planInterval: interval,
    amount,
    currency,
    maxMembers,
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
    // Créer un nouvel abonnement
    await subscriptionsRef.add({
      ...subscriptionData,
      createdAt: Timestamp.now(),
    });
    console.log('Nouvel abonnement créé dans Firestore');
  } else {
    // Mettre à jour l'abonnement existant
    const docId = existingSnapshot.docs[0].id;
    await subscriptionsRef.doc(docId).update(subscriptionData);
    console.log('Abonnement mis à jour dans Firestore');
  }
}

