import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe/client';
import { getSearchesPerMonth, PlanName } from '@/lib/stripe/config';
import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * API pour synchroniser manuellement un abonnement depuis Stripe
 * Version utilisant le SDK client Firebase (nécessite que les règles permettent la création)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId est requis' });
    }

    // Récupérer le customer Stripe par userId dans les métadonnées
    const customers = await stripe.customers.list({
      limit: 100,
    });
    const customer = customers.data.find(
      (c) => c.metadata?.userId === userId
    );
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer Stripe non trouvé pour cet utilisateur' });
    }

    // Récupérer les abonnements actifs du customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ error: 'Aucun abonnement trouvé pour ce customer' });
    }

    // Prendre le plus récent
    const stripeSubscription = subscriptions.data[0] as any;
    const planName = stripeSubscription.metadata?.planName as PlanName || 
                     (stripeSubscription.items.data[0].price.id.includes('basic') ? 'basic' : 
                      stripeSubscription.items.data[0].price.id.includes('pro') ? 'pro' : 'basic');
    const searchesPerMonth = getSearchesPerMonth(planName);

    // Créer ou mettre à jour dans Firestore via Firebase Admin
    const adminDb = getAdminDb();
    const subscriptionsRef = adminDb.collection('userSubscriptions');
    
    // Chercher un abonnement existant
    const existingSnapshot = await subscriptionsRef
      .where('userId', '==', userId)
      .where('stripeSubscriptionId', '==', stripeSubscription.id)
      .limit(1)
      .get();

    const priceId = stripeSubscription.items.data[0].price.id;
    const amount = stripeSubscription.items.data[0].price.unit_amount || 0;
    const currency = stripeSubscription.items.data[0].price.currency;

    const subscriptionData = {
      userId,
      planType: planName,
      planName: planName === 'basic' ? 'Basic' : planName === 'pro' ? 'Pro' : 'One Shot',
      stripeCustomerId: customer.id,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: priceId,
      stripeProductId: stripeSubscription.items.data[0].price.product as string,
      status: stripeSubscription.status,
      searchesPerMonth,
      searchesUsedThisMonth: 0,
      amount,
      currency,
      isRecurring: true,
      currentPeriodStart: Timestamp.fromDate(new Date(stripeSubscription.current_period_start * 1000)),
      currentPeriodEnd: Timestamp.fromDate(new Date(stripeSubscription.current_period_end * 1000)),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      ...(stripeSubscription.canceled_at && {
        canceledAt: Timestamp.fromDate(new Date(stripeSubscription.canceled_at * 1000)),
      }),
      ...(stripeSubscription.trial_start && {
        trialStart: Timestamp.fromDate(new Date(stripeSubscription.trial_start * 1000)),
      }),
      ...(stripeSubscription.trial_end && {
        trialEnd: Timestamp.fromDate(new Date(stripeSubscription.trial_end * 1000)),
      }),
      updatedAt: Timestamp.now(),
    };

    if (existingSnapshot.empty) {
      // Chercher si l'utilisateur a déjà un abonnement actif
      const userActiveSnapshot = await subscriptionsRef
        .where('userId', '==', userId)
        .where('status', 'in', ['active', 'trialing'])
        .limit(1)
        .get();

      if (!userActiveSnapshot.empty) {
        // Mettre à jour l'abonnement existant
        const docId = userActiveSnapshot.docs[0].id;
        const existingData = userActiveSnapshot.docs[0].data();
        await subscriptionsRef.doc(docId).update({
          ...subscriptionData,
          searchesUsedThisMonth: existingData.searchesUsedThisMonth || 0,
        });
        return res.status(200).json({ 
          success: true, 
          message: 'Abonnement mis à jour avec succès',
          subscriptionId: docId
        });
      } else {
        // Créer un nouvel abonnement
        const docRef = await subscriptionsRef.add({
          ...subscriptionData,
          createdAt: Timestamp.now(),
        });
        return res.status(200).json({ 
          success: true, 
          message: 'Abonnement créé avec succès',
          subscriptionId: docRef.id
        });
      }
    } else {
      // Mettre à jour l'abonnement existant
      const docId = existingSnapshot.docs[0].id;
      await subscriptionsRef.doc(docId).update(subscriptionData);
      return res.status(200).json({ 
        success: true, 
        message: 'Abonnement mis à jour avec succès',
        subscriptionId: docId
      });
    }
  } catch (error: any) {
    console.error('Erreur lors de la synchronisation:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la synchronisation',
      details: error.message 
    });
  }
}

