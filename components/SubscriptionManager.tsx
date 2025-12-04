import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Subscription } from '@/types/firestore';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CreditCard, Calendar, Users, Database, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SubscriptionManagerProps {
  workspaceId: string;
  isAdmin: boolean;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  workspaceId,
  isAdmin,
}) => {
  const { firebaseUser } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Écouter les changements d'abonnement en temps réel
  useEffect(() => {
    if (!workspaceId) return;

    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('workspaceId', '==', workspaceId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const subData = snapshot.docs[0].data() as Subscription;
          setSubscription({
            ...subData,
            id: snapshot.docs[0].id,
          });
        } else {
          setSubscription(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Erreur lors de la récupération de l\'abonnement:', err);
        setError('Erreur lors du chargement de l\'abonnement');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [workspaceId]);

  const handleManageSubscription = async () => {
    if (!firebaseUser || !isAdmin) {
      setError('Vous devez être administrateur pour gérer l\'abonnement');
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-billing-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          userId: firebaseUser.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session');
      }

      // Rediriger vers le portail de facturation Stripe
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">
              Aucun abonnement actif
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              Votre workspace n'a pas d'abonnement actif. Choisissez un plan pour débloquer toutes les fonctionnalités.
            </p>
            {isAdmin && (
              <a
                href="#pricing"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Voir les plans
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isTrialing = subscription.status === 'trialing';
  const isActive = subscription.status === 'active' || isTrialing;
  const isPastDue = subscription.status === 'past_due';

  const getStatusBadge = () => {
    if (isTrialing) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          🎉 Période d'essai
        </span>
      );
    }
    if (isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          ✓ Actif
        </span>
      );
    }
    if (isPastDue) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          ⚠️ Paiement en retard
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        {subscription.status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {isPastDue && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">
                Paiement en retard
              </h3>
              <p className="text-red-700 text-sm mb-4">
                Le dernier paiement a échoué. Veuillez mettre à jour votre méthode de paiement pour continuer à utiliser les services.
              </p>
              {isAdmin && (
                <button
                  onClick={handleManageSubscription}
                  disabled={actionLoading}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Mettre à jour le paiement
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Plan {subscription.planName}
            </h2>
            <div className="flex items-center gap-3">
              {getStatusBadge()}
              {subscription.cancelAtPeriodEnd && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  Annulation prévue
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {(subscription.amount / 100).toFixed(2)}€
            </div>
            <div className="text-sm text-gray-500">
              par {subscription.planInterval === 'month' ? 'mois' : 'an'}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-500">
                {isTrialing ? 'Fin de l\'essai' : 'Prochaine facturation'}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {format(
                  isTrialing && subscription.trialEnd 
                    ? subscription.trialEnd.toDate() 
                    : subscription.currentPeriodEnd.toDate(),
                  'dd MMMM yyyy',
                  { locale: fr }
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-500">
                Limite d'utilisateurs
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {subscription.maxMembers || 'Illimité'}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <Database className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-500">
                Limite de contacts
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {subscription.planName === 'Basic' ? '10' : '50'} contacts
              </div>
            </div>
          </div>

          {subscription.paymentMethodLast4 && (
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Méthode de paiement
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  •••• {subscription.paymentMethodLast4}
                </div>
              </div>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleManageSubscription}
              disabled={actionLoading}
              className="w-full md:w-auto bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Chargement...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Gérer mon abonnement
                </>
              )}
            </button>
            <p className="mt-3 text-sm text-gray-500">
              Modifiez votre plan, mettez à jour votre carte ou annulez votre abonnement
            </p>
          </div>
        )}

        {!isAdmin && (
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Seuls les administrateurs du workspace peuvent gérer l'abonnement.
            </p>
          </div>
        )}
      </div>

      {isTrialing && subscription.trialEnd && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            💡 Vous profitez actuellement de{' '}
            <strong>14 jours d'essai gratuit</strong>. Votre première facturation
            aura lieu le{' '}
            <strong>
              {format(subscription.trialEnd.toDate(), 'dd MMMM yyyy', { locale: fr })}
            </strong>
            .
          </p>
        </div>
      )}
    </div>
  );
};

