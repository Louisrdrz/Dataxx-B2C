import { withAuth } from '@/lib/firebase/withAuth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types/firestore';
import { useUserSubscription } from '@/hooks/useUserSubscription';
import { stripeConfig, PlanName } from '@/lib/stripe/config';
import { useState, useEffect, useRef } from 'react';
import { Check, Loader2, Zap, Crown, Sparkles, ArrowLeft, CreditCard, Calendar, Search } from 'lucide-react';

interface SubscriptionPageProps {
  user: FirebaseUser;
  userData: User | null;
}

const SubscriptionPage = ({ user, userData }: SubscriptionPageProps) => {
  const router = useRouter();
  const { success, canceled } = router.query;
  const {
    activeSubscription,
    loading: subscriptionLoading,
    hasActiveSubscription,
    isOneShot,
    isBasic,
    isPro,
    searchesPerMonth,
    searchesUsed,
    remainingSearches,
    refresh,
  } = useUserSubscription(user?.uid);

  const [loadingPlan, setLoadingPlan] = useState<PlanName | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const hasSyncedRef = useRef(false);

  // Synchroniser automatiquement l'abonnement au retour de Stripe (une seule fois)
  useEffect(() => {
    if (success === 'true' && user?.uid && !syncing && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      setSyncing(true);
      setShowSuccessMessage(true);
      
      // Synchroniser l'abonnement depuis Stripe
      const syncSubscription = async () => {
        try {
          const { syncSubscriptionFromStripe } = await import('@/lib/firebase/syncSubscription');
          const result = await syncSubscriptionFromStripe(user.uid);
          
          if (result.success) {
            console.log('✅ Abonnement synchronisé automatiquement');
            // Attendre un peu avant de rafraîchir pour laisser Firestore se mettre à jour
            setTimeout(async () => {
              await refresh();
            }, 1000);
          } else {
            console.warn('⚠️ Synchronisation automatique échouée:', result.error);
            // On rafraîchit quand même au cas où le webhook aurait fonctionné
            setTimeout(async () => {
              await refresh();
            }, 1000);
          }
        } catch (err) {
          console.error('Erreur lors de la synchronisation automatique:', err);
          // On rafraîchit quand même
          setTimeout(async () => {
            await refresh();
          }, 1000);
        } finally {
          setSyncing(false);
        }
      };

      syncSubscription();
      
      // Cacher le message après 5 secondes
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, user?.uid, refresh]);

  const handleSubscribe = async (planName: PlanName) => {
    if (!user) {
      setError('Vous devez être connecté pour souscrire à un abonnement');
      return;
    }

    if (!user.email) {
      setError('Votre compte doit avoir une adresse email pour souscrire à un abonnement');
      return;
    }

    setLoadingPlan(planName);
    setError(null);

    try {
      const response = await fetch('/api/create-user-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          userId: user.uid,
          userEmail: user.email,
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
    } catch (err: any) {
      console.error('Erreur lors de la souscription:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/create-user-billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'accès au portail');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const getCurrentPlanName = (): string | null => {
    if (isOneShot) return 'one_shot';
    if (isBasic) return 'basic';
    if (isPro) return 'pro';
    return null;
  };

  const planIcons: Record<PlanName, React.ReactNode> = {
    one_shot: <Zap className="w-8 h-8" />,
    basic: <Sparkles className="w-8 h-8" />,
    pro: <Crown className="w-8 h-8" />,
  };

  const planColors: Record<PlanName, { bg: string; border: string; text: string; button: string; icon: string }> = {
    one_shot: {
      bg: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      icon: 'text-emerald-600',
    },
    basic: {
      bg: 'from-violet-50 to-purple-50',
      border: 'border-violet-200',
      text: 'text-violet-700',
      button: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
      icon: 'text-violet-600',
    },
    pro: {
      bg: 'from-amber-50 to-orange-50',
      border: 'border-amber-300',
      text: 'text-amber-700',
      button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
      icon: 'text-amber-600',
    },
  };

  return (
    <>
      <Head>
        <title>Abonnement - Dataxx</title>
        <meta name="description" content="Gérez votre abonnement Dataxx" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Abonnement
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Message de succès */}
          {showSuccessMessage && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 animate-fade-in-up">
              <div className="p-2 bg-green-100 rounded-full">
                {syncing ? (
                  <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                ) : (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-green-800">
                  {syncing ? 'Synchronisation en cours...' : 'Paiement réussi !'}
                </p>
                <p className="text-green-700 text-sm">
                  {syncing 
                    ? 'Votre abonnement est en cours de synchronisation depuis Stripe...'
                    : 'Votre abonnement est maintenant actif.'}
                </p>
              </div>
            </div>
          )}

          {/* Message d'annulation */}
          {canceled === 'true' && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <CreditCard className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-amber-800">Le paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.</p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
              {error}
            </div>
          )}

          {/* Abonnement actuel */}
          {subscriptionLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : hasActiveSubscription && activeSubscription ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Votre abonnement actuel</h2>
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${
                      isOneShot ? 'bg-emerald-100 text-emerald-600' :
                      isBasic ? 'bg-violet-100 text-violet-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {isOneShot ? <Zap className="w-8 h-8" /> :
                       isBasic ? <Sparkles className="w-8 h-8" /> :
                       <Crown className="w-8 h-8" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{activeSubscription.planName}</h3>
                      <p className="text-slate-600">
                        {activeSubscription.isRecurring 
                          ? `${activeSubscription.amount / 100}€/mois` 
                          : 'Paiement unique'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats d'utilisation */}
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-slate-50 rounded-xl px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                        <Search className="w-4 h-4" />
                        <span className="text-sm font-medium">Recherches restantes</span>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">
                        {remainingSearches}
                        {activeSubscription.isRecurring && (
                          <span className="text-lg text-slate-500">/{searchesPerMonth}</span>
                        )}
                      </p>
                    </div>
                    
                    {activeSubscription.currentPeriodEnd && (
                      <div className="bg-slate-50 rounded-xl px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">Prochaine facturation</span>
                        </div>
                        <p className="text-xl font-bold text-slate-900">
                          {new Date(activeSubscription.currentPeriodEnd.seconds * 1000).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Barre de progression */}
                {activeSubscription.isRecurring && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>Utilisation ce mois</span>
                      <span>{searchesUsed}/{searchesPerMonth} recherches</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBasic ? 'bg-gradient-to-r from-violet-500 to-purple-500' :
                          'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                        style={{ width: `${Math.min((searchesUsed / searchesPerMonth) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Bouton gérer */}
                {activeSubscription.isRecurring && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleManageBilling}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Gérer mon abonnement
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Section Plans */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {hasActiveSubscription ? 'Changer de plan' : 'Choisissez votre plan'}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Trouvez les sponsors parfaits pour vos événements grâce à notre IA
            </p>
          </div>

          {/* Grille des plans */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {(Object.keys(stripeConfig.plans) as PlanName[]).map((planKey) => {
              const plan = stripeConfig.plans[planKey];
              const colors = planColors[planKey];
              const isCurrentPlan = getCurrentPlanName() === planKey;
              const isDisabled = isCurrentPlan || (planKey === 'one_shot' && hasActiveSubscription);

              return (
                <div
                  key={planKey}
                  className={`relative rounded-3xl border-2 p-8 bg-gradient-to-br ${colors.bg} ${
                    isCurrentPlan ? `${colors.border} ring-2 ring-offset-2 ring-violet-300` : 'border-slate-200'
                  } shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4 bg-violet-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      ✓ Actuel
                    </div>
                  )}

                  {/* Icône et nom */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl bg-white/80 ${colors.icon}`}>
                      {planIcons[planKey]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                      <p className="text-slate-600 text-sm">{plan.description}</p>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold text-slate-900">{plan.price}€</span>
                      {plan.isRecurring && (
                        <span className="text-slate-500 text-lg">/mois</span>
                      )}
                    </div>
                    {!plan.isRecurring && (
                      <p className="text-emerald-600 font-medium mt-1">Paiement unique</p>
                    )}
                  </div>

                  {/* Recherches */}
                  <div className={`mb-6 p-4 rounded-xl bg-white/60 border ${colors.border}`}>
                    <div className="flex items-center gap-2">
                      <Search className={`w-5 h-5 ${colors.icon}`} />
                      <span className="font-bold text-slate-900">
                        {plan.searchesPerMonth} recherche{plan.searchesPerMonth > 1 ? 's' : ''}
                        {plan.isRecurring ? ' / mois' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Bouton */}
                  <button
                    onClick={() => handleSubscribe(planKey)}
                    disabled={loadingPlan !== null || isDisabled}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                      isDisabled
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : `${colors.button} text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5`
                    }`}
                  >
                    {loadingPlan === planKey ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-5 h-5" />
                        Chargement...
                      </span>
                    ) : isCurrentPlan ? (
                      'Plan actuel'
                    ) : planKey === 'one_shot' && hasActiveSubscription ? (
                      'Déjà un abonnement'
                    ) : planKey === 'one_shot' ? (
                      'Acheter maintenant'
                    ) : (
                      'Souscrire'
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-6 text-slate-600">
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-400" />
                Paiement sécurisé par Stripe
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Annulation à tout moment
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Satisfaction garantie
              </span>
            </div>
            <p className="mt-4 text-slate-500">
              Des questions ?{' '}
              <a href="mailto:support@dataxx.fr" className="text-violet-600 hover:underline font-medium">
                Contactez-nous
              </a>
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default withAuth(SubscriptionPage);

