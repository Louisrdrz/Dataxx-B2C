import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserWorkspaces } from '@/hooks/useWorkspace';
import { createWorkspace } from '@/lib/firebase/workspaces';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function OnboardingPage() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { workspaces, loading: workspacesLoading } = useUserWorkspaces(firebaseUser?.uid || '');
  
  const [step, setStep] = useState<'check' | 'create' | 'complete'>('check');
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceType, setWorkspaceType] = useState<'personal' | 'club' | 'athlete' | 'other'>('personal');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Vérifier si l'utilisateur a déjà un workspace
  useEffect(() => {
    if (!authLoading && !workspacesLoading && firebaseUser) {
      if (workspaces.length > 0) {
        // L'utilisateur a déjà un workspace, rediriger vers le dashboard
        router.push('/dashboard');
      } else {
        // Aucun workspace, montrer le formulaire de création
        setStep('create');
        // Suggérer un nom par défaut
        setWorkspaceName(`Workspace de ${firebaseUser.displayName || 'Utilisateur'}`);
      }
    }
  }, [authLoading, workspacesLoading, firebaseUser, workspaces, router]);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseUser || !workspaceName.trim()) {
      setError('Veuillez entrer un nom pour votre workspace');
      return;
    }

    setCreating(true);
    setError('');

    try {
      await createWorkspace(firebaseUser.uid, {
        name: workspaceName.trim(),
        type: workspaceType,
        description: 'Mon premier workspace Dataxx'
      });

      setStep('complete');
      
      // Rediriger vers le dashboard après 2 secondes avec rechargement complet
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err: any) {
      console.error('Erreur création workspace:', err);
      setError(err.message || 'Erreur lors de la création du workspace');
    } finally {
      setCreating(false);
    }
  };

  if (authLoading || workspacesLoading || step === 'check') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Configuration de votre compte...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    router.push('/login');
    return null;
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Félicitations !
          </h1>
          <p className="text-gray-600 mb-6">
            Votre workspace <strong>{workspaceName}</strong> a été créé avec succès.
          </p>
          <p className="text-sm text-gray-500">
            Redirection vers le dashboard...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Configuration de votre compte - Dataxx</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👋</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Bienvenue, {firebaseUser.displayName || 'Utilisateur'} !
            </h1>
            <p className="text-gray-600 text-lg">
              Créons votre premier workspace pour commencer
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Qu'est-ce qu'un workspace ?
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Un <strong>espace de travail</strong> pour organiser vos données</li>
              <li>• Vous pouvez <strong>inviter des membres</strong> et collaborer</li>
              <li>• Importer et partager des <strong>données Google</strong> (calendrier, contacts)</li>
              <li>• En tant que <strong>créateur</strong>, vous serez automatiquement <strong>admin</strong></li>
            </ul>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Créer mon workspace
            </h2>

            <form onSubmit={handleCreateWorkspace} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de votre workspace *
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Ex: Mon équipe, Mon club..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Vous pourrez le modifier plus tard
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de workspace *
                </label>
                <select
                  value={workspaceType}
                  onChange={(e) => setWorkspaceType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="personal">Personnel</option>
                  <option value="club">Club sportif</option>
                  <option value="athlete">Athlète</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none text-lg"
              >
                {creating ? '⏳ Création en cours...' : '🚀 Créer mon workspace'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>En créant ce workspace, vous serez :</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ <strong>Administrateur</strong> du workspace</li>
                <li>✅ Capable d'inviter d'autres membres</li>
                <li>✅ Prêt à importer vos données Google</li>
              </ul>
            </div>
          </div>

          {/* Skip Option */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Je préfère créer mon workspace plus tard →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

