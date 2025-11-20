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
    const { workspaceId, userId } = req.body;

    // Validation des paramètres
    if (!workspaceId || !userId) {
      return res.status(400).json({ 
        error: 'Paramètres manquants: workspaceId et userId sont requis' 
      });
    }

    // Vérifier que l'utilisateur est admin du workspace
    const memberRef = adminDb
      .collection('workspaceMembers')
      .doc(`${workspaceId}_${userId}`);
    const memberDoc = await memberRef.get();

    if (!memberDoc.exists || memberDoc.data()?.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Vous devez être administrateur du workspace pour gérer l\'abonnement' 
      });
    }

    // Récupérer l'abonnement actif du workspace
    const subscriptionSnapshot = await adminDb
      .collection('subscriptions')
      .where('workspaceId', '==', workspaceId)
      .where('status', 'in', ['active', 'trialing'])
      .limit(1)
      .get();

    if (subscriptionSnapshot.empty) {
      return res.status(404).json({ 
        error: 'Aucun abonnement actif trouvé pour ce workspace' 
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
      return_url: `${stripeConfig.appUrl}/workspace/${workspaceId}/settings`,
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

