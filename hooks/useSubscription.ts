// Hook React pour gérer les abonnements
import { useEffect, useState } from 'react';
import { Subscription } from '@/types/firestore';
import { getActiveSubscription, getWorkspaceSubscriptions } from '@/lib/firebase/subscriptions';

/**
 * Hook pour gérer l'abonnement d'un workspace
 * @param workspaceId - ID du workspace pour lequel récupérer l'abonnement
 */
export const useSubscription = (workspaceId: string | undefined) => {
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setActiveSubscription(null);
      setAllSubscriptions([]);
      setLoading(false);
      return;
    }

    const fetchSubscriptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const [active, all] = await Promise.all([
          getActiveSubscription(workspaceId),
          getWorkspaceSubscriptions(workspaceId),
        ]);

        setActiveSubscription(active);
        setAllSubscriptions(all);
      } catch (err) {
        console.error('Erreur lors de la récupération des abonnements:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [workspaceId]);

  return {
    activeSubscription,
    allSubscriptions,
    loading,
    error,
    hasActiveSubscription: !!activeSubscription && 
      (activeSubscription.status === 'active' || activeSubscription.status === 'trialing'),
    isBasic: activeSubscription?.planName === 'Basic',
    isPro: activeSubscription?.planName === 'Pro',
    isTrialing: activeSubscription?.status === 'trialing',
    maxMembers: activeSubscription?.maxMembers || 1,
  };
};
