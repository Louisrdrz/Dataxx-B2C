import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe/client';
import { getSearchesPerMonth, PlanName } from '@/lib/stripe/config';

/**
 * API pour récupérer les données d'abonnement depuis Stripe
 * Retourne les données nécessaires pour créer l'abonnement dans Firestore côté client
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { userId, userEmail } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId est requis' });
    }

    // Récupérer le customer Stripe par userId dans les métadonnées
    const customers = await stripe.customers.list({
      limit: 100,
    });
    let customer = customers.data.find(
      (c) => c.metadata?.userId === userId
    );
    
    // Si non trouvé par metadata, chercher par email (pour les anciens customers)
    if (!customer && userEmail) {
      const customersByEmail = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });
      if (customersByEmail.data.length > 0) {
        customer = customersByEmail.data[0];
        // Mettre à jour les métadonnées pour les prochaines fois
        await stripe.customers.update(customer.id, {
          metadata: { userId },
        });
      }
    }
    
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

    const priceId = stripeSubscription.items.data[0].price.id;
    const amount = stripeSubscription.items.data[0].price.unit_amount || 0;
    const currency = stripeSubscription.items.data[0].price.currency;

    // Helper pour convertir timestamp en ISO string de manière sécurisée
    const safeTimestampToISO = (timestamp: number | null | undefined): string | null => {
      if (!timestamp || typeof timestamp !== 'number') return null;
      try {
        return new Date(timestamp * 1000).toISOString();
      } catch {
        return null;
      }
    };

    // Retourner les données formatées pour Firestore
    return res.status(200).json({
      success: true,
      subscription: {
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
        currentPeriodStart: safeTimestampToISO(stripeSubscription.current_period_start) || new Date().toISOString(),
        currentPeriodEnd: safeTimestampToISO(stripeSubscription.current_period_end) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end || false,
        ...(stripeSubscription.canceled_at && {
          canceledAt: safeTimestampToISO(stripeSubscription.canceled_at),
        }),
        ...(stripeSubscription.trial_start && {
          trialStart: safeTimestampToISO(stripeSubscription.trial_start),
        }),
        ...(stripeSubscription.trial_end && {
          trialEnd: safeTimestampToISO(stripeSubscription.trial_end),
        }),
      }
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la récupération',
      details: error.message 
    });
  }
}

