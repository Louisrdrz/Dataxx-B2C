// Hook React pour gérer les abonnements utilisateur
import { useEffect, useState, useCallback } from 'react';
import { UserSubscription } from '@/types/firestore';
import { 
  getUserActiveSubscription, 
  getUserSubscriptions,
  canPerformSponsorSearch,
  getRemainingSearches,
} from '@/lib/firebase/userSubscriptions';

interface UseUserSubscriptionReturn {
  // État de l'abonnement
  activeSubscription: UserSubscription | null;
  allSubscriptions: UserSubscription[];
  loading: boolean;
  error: Error | null;
  
  // Helpers
  hasActiveSubscription: boolean;
  isOneShot: boolean;
  isBasic: boolean;
  isPro: boolean;
  
  // Limites et usage
  searchesPerMonth: number;
  searchesUsed: number;
  remainingSearches: number;
  
  // Méthodes
  canSearch: () => Promise<{ canSearch: boolean; reason?: string }>;
  refresh: () => Promise<void>;
}

/**
 * Hook pour gérer l'abonnement d'un utilisateur
 * @param userId - ID de l'utilisateur pour lequel récupérer l'abonnement
 */
export const useUserSubscription = (userId: string | undefined): UseUserSubscriptionReturn => {
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [allSubscriptions, setAllSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [remainingSearches, setRemainingSearches] = useState(0);

  const fetchSubscriptions = useCallback(async () => {
    if (!userId) {
      setActiveSubscription(null);
      setAllSubscriptions([]);
      setRemainingSearches(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [active, all, remaining] = await Promise.all([
        getUserActiveSubscription(userId),
        getUserSubscriptions(userId),
        getRemainingSearches(userId),
      ]);

      setActiveSubscription(active);
      setAllSubscriptions(all);
      setRemainingSearches(remaining);
    } catch (err) {
      console.error('Erreur lors de la récupération des abonnements:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const canSearch = useCallback(async () => {
    if (!userId) {
      return { canSearch: false, reason: 'Utilisateur non connecté' };
    }
    const result = await canPerformSponsorSearch(userId);
    // Mettre à jour le nombre de recherches restantes
    if (result.remainingSearches !== undefined) {
      setRemainingSearches(result.remainingSearches);
    }
    return { canSearch: result.canSearch, reason: result.reason };
  }, [userId]);

  const refresh = useCallback(async () => {
    await fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Calculs dérivés
  const hasActiveSubscription = !!activeSubscription && 
    ['active', 'trialing', 'one_time_available'].includes(activeSubscription.status);
  
  const isOneShot = activeSubscription?.planType === 'one_shot';
  const isBasic = activeSubscription?.planType === 'basic';
  const isPro = activeSubscription?.planType === 'pro';
  
  const searchesPerMonth = activeSubscription?.searchesPerMonth || 0;
  const searchesUsed = activeSubscription?.searchesUsedThisMonth || 0;

  return {
    activeSubscription,
    allSubscriptions,
    loading,
    error,
    hasActiveSubscription,
    isOneShot,
    isBasic,
    isPro,
    searchesPerMonth,
    searchesUsed,
    remainingSearches,
    canSearch,
    refresh,
  };
};

