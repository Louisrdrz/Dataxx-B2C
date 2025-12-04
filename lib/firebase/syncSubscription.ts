// Fonction pour synchroniser l'abonnement depuis Stripe côté client
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './config';

interface SyncSubscriptionResult {
  success: boolean;
  error?: string;
  subscriptionId?: string;
}

/**
 * Synchroniser l'abonnement depuis Stripe
 * Récupère les données depuis Stripe via l'API et crée l'abonnement dans Firestore côté client
 */
export async function syncSubscriptionFromStripe(
  userId: string
): Promise<SyncSubscriptionResult> {
  try {
    // 1. Récupérer les données depuis Stripe via l'API
    const response = await fetch('/api/get-stripe-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Erreur lors de la récupération depuis Stripe' };
    }

    if (!data.subscription) {
      return { success: false, error: 'Aucune donnée d\'abonnement retournée' };
    }

    const subscriptionData = data.subscription;

    // 2. Créer ou mettre à jour dans Firestore côté client
    const subscriptionsRef = collection(db, 'userSubscriptions');
    
    // Chercher un abonnement existant
    const existingQuery = query(
      subscriptionsRef,
      where('userId', '==', userId),
      where('stripeSubscriptionId', '==', subscriptionData.stripeSubscriptionId)
    );
    const existingSnapshot = await getDocs(existingQuery);

    // Convertir les dates ISO en Timestamp
    const firestoreData = {
      ...subscriptionData,
      currentPeriodStart: Timestamp.fromDate(new Date(subscriptionData.currentPeriodStart)),
      currentPeriodEnd: Timestamp.fromDate(new Date(subscriptionData.currentPeriodEnd)),
      ...(subscriptionData.canceledAt && {
        canceledAt: Timestamp.fromDate(new Date(subscriptionData.canceledAt)),
      }),
      ...(subscriptionData.trialStart && {
        trialStart: Timestamp.fromDate(new Date(subscriptionData.trialStart)),
      }),
      ...(subscriptionData.trialEnd && {
        trialEnd: Timestamp.fromDate(new Date(subscriptionData.trialEnd)),
      }),
      updatedAt: Timestamp.now(),
    };

    if (existingSnapshot.empty) {
      // Chercher si l'utilisateur a déjà un abonnement actif
      const userActiveQuery = query(
        subscriptionsRef,
        where('userId', '==', userId),
        where('status', 'in', ['active', 'trialing'])
      );
      const userActiveSnapshot = await getDocs(userActiveQuery);

      if (!userActiveSnapshot.empty) {
        // Mettre à jour l'abonnement existant
        const docId = userActiveSnapshot.docs[0].id;
        const existingData = userActiveSnapshot.docs[0].data();
        await updateDoc(doc(db, 'userSubscriptions', docId), {
          ...firestoreData,
          searchesUsedThisMonth: existingData.searchesUsedThisMonth || 0,
        });
        return { success: true, subscriptionId: docId };
      } else {
        // Créer un nouvel abonnement
        const docRef = await addDoc(subscriptionsRef, {
          ...firestoreData,
          createdAt: Timestamp.now(),
        });
        return { success: true, subscriptionId: docRef.id };
      }
    } else {
      // Mettre à jour l'abonnement existant
      const docId = existingSnapshot.docs[0].id;
      await updateDoc(doc(db, 'userSubscriptions', docId), firestoreData);
      return { success: true, subscriptionId: docId };
    }
  } catch (error: any) {
    console.error('Erreur lors de la synchronisation:', error);
    return { success: false, error: error.message || 'Erreur inconnue' };
  }
}
