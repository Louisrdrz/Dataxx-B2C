// Hook React pour gérer les abonnements
import { useEffect, useState } from 'react';
import { Subscription } from '@/types/firestore';
import { getActiveSubscription, getUserSubscriptions } from '@/lib/firebase/subscriptions';

export const useSubscription = (userId: string | undefined) => {
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
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
          getActiveSubscription(userId),
          getUserSubscriptions(userId),
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
  }, [userId]);

  return {
    activeSubscription,
    allSubscriptions,
    loading,
    error,
    hasActiveSubscription: !!activeSubscription,
    isPro: activeSubscription?.planName === 'Pro',
    isEnterprise: activeSubscription?.planName === 'Enterprise',
  };
};
