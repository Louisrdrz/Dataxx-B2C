import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe/client';
import { stripeConfig, getPlanDetails, PlanName, isRecurringPlan } from '@/lib/stripe/config';
import { getAdminDb } from '@/lib/firebase/admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { planName, userId, userEmail } = req.body;

    // Validation des paramètres
    if (!planName || !userId || !userEmail) {
      return res.status(400).json({ 
        error: 'Paramètres manquants: planName, userId et userEmail sont requis' 
      });
    }

    // Vérifier que le plan existe
    if (!['one_shot', 'basic', 'pro'].includes(planName)) {
      return res.status(400).json({ 
        error: 'Plan invalide. Utilisez "one_shot", "basic" ou "pro"' 
      });
    }

    // Récupérer les détails du plan
    const planDetails = getPlanDetails(planName as PlanName);
    
    if (!planDetails.priceId) {
      return res.status(400).json({ 
        error: 'Configuration Stripe incomplète. Price ID manquant pour ce plan.' 
      });
    }

    const customerEmail = userEmail;

    // Vérifier s'il existe déjà un customer Stripe pour cet utilisateur
    // (optionnel - seulement si Firebase Admin est configuré)
    let customerId: string | undefined;
    try {
      const adminDb = getAdminDb();
      const existingSubscription = await adminDb
        .collection('userSubscriptions')
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (!existingSubscription.empty) {
        customerId = existingSubscription.docs[0].data().stripeCustomerId;
      }
    } catch (error) {
      // Firebase Admin non configuré - on continue sans vérifier les abonnements existants
      console.log('Firebase Admin non disponible, création d\'un nouveau customer Stripe');
    }

    // Créer ou récupérer le customer Stripe
    if (!customerId) {
      // Chercher un customer existant par email (Stripe gère la déduplication)
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        // Créer un nouveau customer
        const customer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            userId,
          },
        });
        customerId = customer.id;
      }
    }

    // Déterminer le mode de paiement
    const isRecurring = isRecurringPlan(planName as PlanName);
    const mode = isRecurring ? 'subscription' : 'payment';

    // Configuration de la session Stripe Checkout
    const sessionConfig: any = {
      customer: customerId,
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: planDetails.priceId,
          quantity: 1,
        },
      ],
      success_url: `${stripeConfig.appUrl}/subscription?success=true`,
      cancel_url: `${stripeConfig.appUrl}/subscription?canceled=true`,
      metadata: {
        userId,
        planName,
        planType: planName,
      },
    };

    // Ajouter les métadonnées spécifiques selon le mode
    if (isRecurring) {
      sessionConfig.subscription_data = {
        metadata: {
          userId,
          planName,
          planType: planName,
        },
      };
    } else {
      // Pour les paiements uniques (one_shot)
      sessionConfig.payment_intent_data = {
        metadata: {
          userId,
          planName,
          planType: planName,
        },
      };
    }

    // Créer la session de paiement Stripe Checkout
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Erreur lors de la création de la session Checkout:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la création de la session de paiement',
      details: error.message 
    });
  }
}

