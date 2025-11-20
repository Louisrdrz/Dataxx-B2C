import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe/client';
import { stripeConfig, getPlanDetails } from '@/lib/stripe/config';
import { adminDb } from '@/lib/firebase/admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { workspaceId, planName, userId } = req.body;

    // Validation des paramètres
    if (!workspaceId || !planName || !userId) {
      return res.status(400).json({ 
        error: 'Paramètres manquants: workspaceId, planName et userId sont requis' 
      });
    }

    // Vérifier que le plan existe
    if (planName !== 'basic' && planName !== 'pro') {
      return res.status(400).json({ 
        error: 'Plan invalide. Utilisez "basic" ou "pro"' 
      });
    }

    // Récupérer les détails du plan
    const planDetails = getPlanDetails(planName);

    // Vérifier que l'utilisateur est admin du workspace
    const workspaceRef = adminDb.collection('workspaces').doc(workspaceId);
    const workspaceDoc = await workspaceRef.get();

    if (!workspaceDoc.exists) {
      return res.status(404).json({ error: 'Workspace non trouvé' });
    }

    const workspaceData = workspaceDoc.data();

    // Vérifier que l'utilisateur est membre et admin
    const memberRef = adminDb
      .collection('workspaceMembers')
      .doc(`${workspaceId}_${userId}`);
    const memberDoc = await memberRef.get();

    if (!memberDoc.exists || memberDoc.data()?.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Vous devez être administrateur du workspace pour gérer l\'abonnement' 
      });
    }

    // Récupérer l'utilisateur pour avoir son email
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const userData = userDoc.data();
    const customerEmail = userData?.email;

    // Vérifier s'il existe déjà un customer Stripe pour ce workspace
    let customerId: string | undefined;
    const existingSubscription = await adminDb
      .collection('subscriptions')
      .where('workspaceId', '==', workspaceId)
      .limit(1)
      .get();

    if (!existingSubscription.empty) {
      customerId = existingSubscription.docs[0].data().stripeCustomerId;
    }

    // Créer ou récupérer le customer Stripe
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          workspaceId,
          userId,
          workspaceName: workspaceData?.name || '',
        },
      });
      customerId = customer.id;
    }

    // Créer la session de paiement Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: planDetails.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          workspaceId,
          userId,
          planName,
        },
        // Période d'essai pour le plan Basic
        ...(planDetails.trialDays > 0 && {
          trial_period_days: planDetails.trialDays,
        }),
      },
      success_url: `${stripeConfig.appUrl}/workspace/${workspaceId}/settings?success=true`,
      cancel_url: `${stripeConfig.appUrl}/workspace/${workspaceId}/settings?canceled=true`,
      metadata: {
        workspaceId,
        userId,
        planName,
      },
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Erreur lors de la création de la session Checkout:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la création de la session de paiement',
      details: error.message 
    });
  }
}

