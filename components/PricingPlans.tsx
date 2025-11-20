import React, { useState } from 'react';
import { stripeConfig } from '@/lib/stripe/config';
import { useAuth } from '@/hooks/useAuth';
import { Check, Loader2 } from 'lucide-react';

interface PricingPlansProps {
  workspaceId: string;
  currentPlan?: string;
  onSubscribe?: () => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({
  workspaceId,
  currentPlan,
  onSubscribe,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planName: 'basic' | 'pro') => {
    if (!user) {
      setError('Vous devez être connecté pour souscrire à un abonnement');
      return;
    }

    setLoading(planName);
    setError(null);

    try {
      // Appeler l'API pour créer une session Checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          planName,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session');
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }

      onSubscribe?.();
    } catch (err: any) {
      console.error('Erreur lors de la souscription:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-12">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Plan Basic */}
        <div className={`relative rounded-2xl border-2 p-8 bg-white shadow-lg ${
          currentPlan?.toLowerCase() === 'basic' 
            ? 'border-blue-500 ring-2 ring-blue-200' 
            : 'border-gray-200'
        }`}>
          {currentPlan?.toLowerCase() === 'basic' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Plan actuel
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {stripeConfig.plans.basic.name}
            </h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-extrabold text-gray-900">
                {stripeConfig.plans.basic.price}€
              </span>
              <span className="ml-2 text-gray-500">/mois</span>
            </div>
            <p className="mt-2 text-sm text-green-600 font-medium">
              🎉 14 jours d'essai gratuit
            </p>
          </div>

          <ul className="space-y-4 mb-8">
            {stripeConfig.plans.basic.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe('basic')}
            disabled={loading !== null || currentPlan?.toLowerCase() === 'basic'}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              currentPlan?.toLowerCase() === 'basic'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
            }`}
          >
            {loading === 'basic' ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Chargement...
              </span>
            ) : currentPlan?.toLowerCase() === 'basic' ? (
              'Plan actuel'
            ) : (
              'Commencer l\'essai gratuit'
            )}
          </button>
        </div>

        {/* Plan Pro */}
        <div className={`relative rounded-2xl border-2 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ${
          currentPlan?.toLowerCase() === 'pro' 
            ? 'border-blue-500 ring-2 ring-blue-200' 
            : 'border-blue-200'
        }`}>
          {currentPlan?.toLowerCase() === 'pro' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Plan actuel
            </div>
          )}

          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            ⭐ Populaire
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {stripeConfig.plans.pro.name}
            </h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-extrabold text-gray-900">
                {stripeConfig.plans.pro.price}€
              </span>
              <span className="ml-2 text-gray-500">/mois</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            {stripeConfig.plans.pro.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe('pro')}
            disabled={loading !== null || currentPlan?.toLowerCase() === 'pro'}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              currentPlan?.toLowerCase() === 'pro'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loading === 'pro' ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Chargement...
              </span>
            ) : currentPlan?.toLowerCase() === 'pro' ? (
              'Plan actuel'
            ) : (
              'Passer au Pro'
            )}
          </button>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>💳 Paiement sécurisé par Stripe • 🔒 Annulation à tout moment</p>
        <p className="mt-2">
          Des questions ? Contactez-nous à{' '}
          <a href="mailto:support@dataxx.fr" className="text-blue-500 hover:underline">
            support@dataxx.fr
          </a>
        </p>
      </div>
    </div>
  );
};

