// Services Firestore pour la gestion des abonnements Stripe
// Modifié pour supporter les workspaces
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
 * Récupérer l'abonnement actif d'un workspace
 */
export const getActiveSubscription = async (
  workspaceId: string
): Promise<Subscription | null> => {
  try {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('workspaceId', '==', workspaceId),
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
 * Récupérer tous les abonnements d'un workspace
 */
export const getWorkspaceSubscriptions = async (
  workspaceId: string
): Promise<Subscription[]> => {
  try {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('workspaceId', '==', workspaceId),
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
 * Vérifier si un workspace a un abonnement actif
 */
export const hasActiveSubscription = async (workspaceId: string): Promise<boolean> => {
  try {
    const subscription = await getActiveSubscription(workspaceId);
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

/**
 * Vérifier si un utilisateur peut gérer l'abonnement d'un workspace
 * (Utile pour vérifier si l'utilisateur est l'admin qui gère la facturation)
 */
export const canManageSubscription = async (
  workspaceId: string,
  userId: string
): Promise<boolean> => {
  try {
    const subscription = await getActiveSubscription(workspaceId);
    
    if (!subscription) {
      return false;
    }
    
    // Vérifier si l'utilisateur est l'admin qui gère la facturation
    return subscription.managedBy === userId;
  } catch (error) {
    console.error('Erreur lors de la vérification des droits de gestion:', error);
    return false;
  }
};

/**
 * Récupérer tous les abonnements gérés par un utilisateur
 * (Pour voir tous les workspaces où cet utilisateur paie l'abonnement)
 */
export const getSubscriptionsManagedByUser = async (
  userId: string
): Promise<Subscription[]> => {
  try {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('managedBy', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Subscription[];
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements gérés:', error);
    throw error;
  }
};

/**
 * Vérifier si un workspace a atteint la limite de membres
 */
export const hasReachedMemberLimit = async (
  workspaceId: string,
  currentMemberCount: number
): Promise<boolean> => {
  try {
    const subscription = await getActiveSubscription(workspaceId);
    
    if (!subscription) {
      // Si pas d'abonnement, limite par défaut (ex: 1 seul membre)
      return currentMemberCount >= 1;
    }
    
    if (!subscription.maxMembers) {
      // Pas de limite définie = illimité
      return false;
    }
    
    return currentMemberCount >= subscription.maxMembers;
  } catch (error) {
    console.error('Erreur lors de la vérification de la limite de membres:', error);
    return true; // En cas d'erreur, on bloque par sécurité
  }
};

/**
 * Récupérer le nombre de membres autorisés pour un workspace
 */
export const getMaxMembersAllowed = async (workspaceId: string): Promise<number> => {
  try {
    const subscription = await getActiveSubscription(workspaceId);
    
    if (!subscription) {
      return 1; // Limite par défaut sans abonnement
    }
    
    return subscription.maxMembers || Infinity;
  } catch (error) {
    console.error('Erreur lors de la récupération de la limite de membres:', error);
    return 1; // Valeur par défaut en cas d'erreur
  }
};
