// Composant HOC pour protéger les pages nécessitant une authentification
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface WithAuthProps {
  redirectTo?: string;
  requireEmailVerified?: boolean;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthProps = {}
) {
  const { redirectTo = '/login', requireEmailVerified = false } = options;

  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const { firebaseUser, userData, loading } = useAuth();

    useEffect(() => {
      if (!loading) {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        if (!firebaseUser) {
          router.replace(redirectTo);
          return;
        }

        // Si l'email doit être vérifié et ne l'est pas
        if (requireEmailVerified && !firebaseUser.emailVerified) {
          router.replace('/verify-email');
          return;
        }
      }
    }, [firebaseUser, loading, router]);

    // Afficher un loader pendant la vérification
    if (loading || !firebaseUser) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      );
    }

    // Afficher le composant si l'utilisateur est authentifié
    return <Component {...props} user={firebaseUser} userData={userData} />;
  };
}

// Hook pour vérifier si l'utilisateur a un abonnement actif
export function withSubscription<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthProps & { requirePlan?: string } = {}
) {
  const { redirectTo = '/pricing', requirePlan } = options;

  return withAuth((props: any) => {
    const router = useRouter();
    const { hasActiveSubscription, activeSubscription, loading } = require('@/hooks/useSubscription')(props.user?.uid);

    useEffect(() => {
      if (!loading) {
        // Si aucun abonnement actif, rediriger vers la page de pricing
        if (!hasActiveSubscription) {
          router.replace(redirectTo);
          return;
        }

        // Si un plan spécifique est requis
        if (requirePlan && activeSubscription?.planName !== requirePlan) {
          router.replace(redirectTo);
          return;
        }
      }
    }, [hasActiveSubscription, activeSubscription, loading, router]);

    if (loading || !hasActiveSubscription) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification de l'abonnement...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} subscription={activeSubscription} />;
  }, options);
}
