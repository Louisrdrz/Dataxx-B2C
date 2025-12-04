import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe/client';
import { stripeConfig } from '@/lib/stripe/config';
import { adminDb } from '@/lib/firebase/admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { userId } = req.body;

    // Validation des paramètres
    if (!userId) {
      return res.status(400).json({ 
        error: 'Paramètre manquant: userId est requis' 
      });
    }

    // Récupérer l'abonnement actif de l'utilisateur
    const subscriptionSnapshot = await adminDb
      .collection('userSubscriptions')
      .where('userId', '==', userId)
      .where('status', 'in', ['active', 'trialing', 'past_due'])
      .limit(1)
      .get();

    if (subscriptionSnapshot.empty) {
      return res.status(404).json({ 
        error: 'Aucun abonnement actif trouvé pour cet utilisateur' 
      });
    }

    const subscription = subscriptionSnapshot.docs[0].data();
    const customerId = subscription.stripeCustomerId;

    if (!customerId) {
      return res.status(400).json({ 
        error: 'Customer Stripe non trouvé' 
      });
    }

    // Créer une session du portail de facturation
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${stripeConfig.appUrl}/subscription`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Erreur lors de la création du portail de facturation:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la création du portail de facturation',
      details: error.message 
    });
  }
}

