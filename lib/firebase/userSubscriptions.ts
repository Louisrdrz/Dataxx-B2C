// Services Firestore pour la gestion des abonnements utilisateur
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  addDoc,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from './config';
import { UserSubscription, SponsorSearchUsage } from '@/types/firestore';

/**
 * Récupérer l'abonnement actif d'un utilisateur
 */
export const getUserActiveSubscription = async (
  userId: string
): Promise<UserSubscription | null> => {
  try {
    const subscriptionsRef = collection(db, 'userSubscriptions');
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      where('status', 'in', ['active', 'trialing', 'one_time_available']),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserSubscription;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement utilisateur:', error);
    throw error;
  }
};

/**
 * Récupérer tous les abonnements d'un utilisateur
 */
export const getUserSubscriptions = async (
  userId: string
): Promise<UserSubscription[]> => {
  try {
    const subscriptionsRef = collection(db, 'userSubscriptions');
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UserSubscription[];
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error);
    throw error;
  }
};

/**
 * Vérifier si un utilisateur a un abonnement actif
 */
export const hasActiveUserSubscription = async (userId: string): Promise<boolean> => {
  try {
    const subscription = await getUserActiveSubscription(userId);
    return subscription !== null;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'abonnement:', error);
    return false;
  }
};

/**
 * Vérifier si l'utilisateur peut effectuer une recherche de sponsors
 */
export const canPerformSponsorSearch = async (userId: string): Promise<{
  canSearch: boolean;
  reason?: string;
  subscription?: UserSubscription | null;
  remainingSearches?: number;
}> => {
  try {
    const subscription = await getUserActiveSubscription(userId);
    
    if (!subscription) {
      return {
        canSearch: false,
        reason: 'Aucun abonnement actif. Veuillez souscrire à un plan.',
        subscription: null,
        remainingSearches: 0,
      };
    }

    // Pour les abonnements one_shot
    if (subscription.planType === 'one_shot') {
      if (subscription.status === 'one_time_used') {
        return {
          canSearch: false,
          reason: 'Votre crédit One Shot a déjà été utilisé.',
          subscription,
          remainingSearches: 0,
        };
      }
      return {
        canSearch: true,
        subscription,
        remainingSearches: 1,
      };
    }

    // Pour les abonnements récurrents (basic, pro)
    const remainingSearches = subscription.searchesPerMonth - subscription.searchesUsedThisMonth;
    
    if (remainingSearches <= 0) {
      return {
        canSearch: false,
        reason: `Vous avez atteint votre limite de ${subscription.searchesPerMonth} recherches ce mois-ci.`,
        subscription,
        remainingSearches: 0,
      };
    }

    return {
      canSearch: true,
      subscription,
      remainingSearches,
    };
  } catch (error) {
    console.error('Erreur lors de la vérification des droits de recherche:', error);
    return {
      canSearch: false,
      reason: 'Erreur lors de la vérification de votre abonnement.',
      remainingSearches: 0,
    };
  }
};

/**
 * Utiliser un crédit de recherche
 */
export const useSearchCredit = async (
  userId: string,
  workspaceId: string,
  searchId: string,
  eventName: string,
  recommendationsCount: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const subscription = await getUserActiveSubscription(userId);
    
    if (!subscription) {
      return { success: false, error: 'Aucun abonnement actif.' };
    }

    const subscriptionRef = doc(db, 'userSubscriptions', subscription.id);
    const now = Timestamp.now();
    const currentMonth = new Date().toISOString().slice(0, 7); // "2024-01"

    // Enregistrer l'utilisation
    const usageRef = collection(db, 'sponsorSearchUsage');
    await addDoc(usageRef, {
      userId,
      workspaceId,
      subscriptionId: subscription.id,
      searchId,
      eventName,
      recommendationsCount,
      usedAt: now,
      billingMonth: currentMonth,
    } as Omit<SponsorSearchUsage, 'id'>);

    // Mettre à jour le compteur
    if (subscription.planType === 'one_shot') {
      // Pour one_shot, marquer comme utilisé
      await updateDoc(subscriptionRef, {
        status: 'one_time_used',
        searchesUsedThisMonth: 1,
        updatedAt: now,
      });
    } else {
      // Pour les abonnements récurrents, incrémenter le compteur
      await updateDoc(subscriptionRef, {
        searchesUsedThisMonth: increment(1),
        updatedAt: now,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'utilisation du crédit de recherche:', error);
    return { success: false, error: 'Erreur lors de la mise à jour du compteur.' };
  }
};

/**
 * Récupérer l'historique d'utilisation des recherches d'un utilisateur
 */
export const getUserSearchUsageHistory = async (
  userId: string,
  limitCount: number = 50
): Promise<SponsorSearchUsage[]> => {
  try {
    const usageRef = collection(db, 'sponsorSearchUsage');
    const q = query(
      usageRef,
      where('userId', '==', userId),
      orderBy('usedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SponsorSearchUsage[];
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    throw error;
  }
};

/**
 * Récupérer l'abonnement par Stripe Customer ID
 */
export const getSubscriptionByStripeCustomerId = async (
  stripeCustomerId: string
): Promise<UserSubscription | null> => {
  try {
    const subscriptionsRef = collection(db, 'userSubscriptions');
    const q = query(
      subscriptionsRef,
      where('stripeCustomerId', '==', stripeCustomerId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserSubscription;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement par Stripe ID:', error);
    throw error;
  }
};

/**
 * Récupérer le nombre de recherches restantes pour le mois
 */
export const getRemainingSearches = async (userId: string): Promise<number> => {
  try {
    const subscription = await getUserActiveSubscription(userId);
    
    if (!subscription) {
      return 0;
    }

    if (subscription.planType === 'one_shot') {
      return subscription.status === 'one_time_available' ? 1 : 0;
    }

    return Math.max(0, subscription.searchesPerMonth - subscription.searchesUsedThisMonth);
  } catch (error) {
    console.error('Erreur lors du calcul des recherches restantes:', error);
    return 0;
  }
};

/**
 * Réinitialiser le compteur de recherches mensuelles (appelé par un cron job ou le webhook)
 */
export const resetMonthlySearchCount = async (subscriptionId: string): Promise<void> => {
  try {
    const subscriptionRef = doc(db, 'userSubscriptions', subscriptionId);
    await updateDoc(subscriptionRef, {
      searchesUsedThisMonth: 0,
      searchesResetDate: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du compteur:', error);
    throw error;
  }
};

