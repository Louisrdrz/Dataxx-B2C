// Services Firestore pour la gestion des abonnements Stripe
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './config';
import { Subscription } from '@/types/firestore';

/**
 * Récupérer l'abonnement actif d'un utilisateur
 */
export const getActiveSubscription = async (
  userId: string
): Promise<Subscription | null> => {
  try {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('currentPeriodEnd', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Subscription;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement actif:', error);
    throw error;
  }
};

/**
 * Récupérer tous les abonnements d'un utilisateur
 */
export const getUserSubscriptions = async (
  userId: string
): Promise<Subscription[]> => {
  try {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Subscription[];
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error);
    throw error;
  }
};

/**
 * Récupérer un abonnement spécifique
 */
export const getSubscriptionById = async (
  subscriptionId: string
): Promise<Subscription | null> => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    const subscriptionSnap = await getDoc(subscriptionRef);

    if (subscriptionSnap.exists()) {
      return { id: subscriptionSnap.id, ...subscriptionSnap.data() } as Subscription;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    throw error;
  }
};

/**
 * Vérifier si un utilisateur a un abonnement actif
 */
export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  try {
    const subscription = await getActiveSubscription(userId);
    return subscription !== null && subscription.status === 'active';
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'abonnement:', error);
    return false;
  }
};

/**
 * Récupérer l'abonnement par Stripe Customer ID
 */
export const getSubscriptionByStripeCustomerId = async (
  stripeCustomerId: string
): Promise<Subscription | null> => {
  try {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('stripeCustomerId', '==', stripeCustomerId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Subscription;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement par Stripe ID:', error);
    throw error;
  }
};
