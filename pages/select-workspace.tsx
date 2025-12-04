import { useAuth } from '@/hooks/useAuth';
import { useUserWorkspaces } from '@/hooks/useWorkspace';
import { setDefaultWorkspace } from '@/lib/firebase/users';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function SelectWorkspacePage() {
  const { firebaseUser, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { workspaces, loading: workspacesLoading } = useUserWorkspaces(firebaseUser?.uid || '');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [rememberChoice, setRememberChoice] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Si l'utilisateur a un workspace par défaut et qu'il n'y a pas de paramètre "force" dans l'URL
  useEffect(() => {
    const forceSelection = router.query.force === 'true';
    
    if (!authLoading && !workspacesLoading && userData && !forceSelection) {
      if (userData.defaultWorkspaceId && workspaces.some(w => w.id === userData.defaultWorkspaceId)) {
        // Rediriger automatiquement vers le dashboard avec le workspace par défaut
        setIsRedirecting(true);
        router.push('/dashboard');
      }
    }
  }, [authLoading, workspacesLoading, userData, workspaces, router]);

  const handleSelectWorkspace = async () => {
    if (!selectedWorkspace || !firebaseUser) return;

    setIsRedirecting(true);

    try {
      // Si l'utilisateur veut se souvenir de son choix, sauvegarder comme workspace par défaut
      if (rememberChoice) {
        await setDefaultWorkspace(firebaseUser.uid, selectedWorkspace);
      }

      // Rediriger vers le dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la sélection du workspace:', error);
      setIsRedirecting(false);
    }
  };

  const handleCreateNewWorkspace = () => {
    router.push('/create-workspace');
  };

  if (authLoading || workspacesLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 blur-xl animate-pulse"></div>
          </div>
          <p className="text-slate-600 text-xl font-semibold">
            {isRedirecting ? '✨ Redirection vers votre workspace...' : '🔍 Chargement de vos workspaces...'}
          </p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    router.push('/login');
    return null;
  }

  // Si l'utilisateur n'a aucun workspace, rediriger vers la création
  if (workspaces.length === 0) {
    router.push('/create-workspace');
    return null;
  }

  return (
    <>
      <Head>
        <title>Choisir un workspace - Dataxx</title>
        <meta name="description" content="Sélectionnez votre workspace" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="w-full px-4 sm:px-6 py-5 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center group">
              <Image src="/logo.png" alt="Dataxx" width={36} height={36} className="w-9 h-9 mr-3 rounded-xl group-hover:scale-110 transition-transform duration-200" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dataxx</span>
            </Link>
            <Link href="/profile" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Welcome Section */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl -z-10"></div>
            <div className="inline-block p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl mb-6 animate-bounce">
              <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Bienvenue, {userData?.displayName || firebaseUser.displayName || 'Utilisateur'} !
            </h1>
            <p className="text-slate-600 text-xl font-medium">
              Sélectionnez le workspace que vous souhaitez utiliser
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-indigo-900 text-lg mb-2">À propos des workspaces</h3>
                <p className="text-indigo-800">
                  Vous êtes membre de <span className="text-xl font-extrabold text-indigo-600 mx-1">{workspaces.length}</span> workspace{workspaces.length > 1 ? 's' : ''}.
                  Chaque workspace contient ses propres données, membres et paramètres. Vous pouvez changer de workspace
                  à tout moment depuis le dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Workspace Selection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Mes workspaces</h2>
            
            <div className="space-y-4 mb-6">
              {workspaces.map((workspace) => {
                const isSelected = selectedWorkspace === workspace.id;
                const isDefault = userData?.defaultWorkspaceId === workspace.id;
                
                return (
                  <div
                    key={workspace.id}
                    onClick={() => setSelectedWorkspace(workspace.id)}
                    className={`
                      relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                      ${isSelected 
                        ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-2xl scale-[1.02]' 
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 hover:shadow-xl'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-xl transition-all duration-300 ${isSelected ? 'bg-white shadow-md' : 'bg-slate-100'}`}>
                            <svg className={`w-6 h-6 transition-colors duration-300 ${isSelected ? 'text-indigo-600' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-slate-800">
                            {workspace.name}
                          </h3>
                          {isDefault && (
                            <span className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border border-amber-200 shadow-sm">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Par défaut
                            </span>
                          )}
                          {isSelected && (
                            <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border border-indigo-200 shadow-sm animate-pulse">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Sélectionné
                            </span>
                          )}
                        </div>
                        
                        {workspace.description && (
                          <p className="text-slate-600 mb-4 text-lg">{workspace.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="text-slate-700 font-medium">{workspace.type}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-slate-700 font-medium">{workspace.memberCount || 0} membre{(workspace.memberCount || 0) > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-slate-700 font-medium">{workspace.createdAt?.toDate?.().toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`
                        w-8 h-8 rounded-full border-3 flex items-center justify-center transition-all duration-300 flex-shrink-0
                        ${isSelected 
                          ? 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg scale-110' 
                          : 'border-slate-300 bg-white'
                        }
                      `}>
                        {isSelected && (
                          <svg className="w-5 h-5 text-white animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Remember Choice */}
            <div className="border-t border-slate-200 pt-6 mb-6">
              <label className="flex items-center gap-4 cursor-pointer group p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={rememberChoice}
                  onChange={(e) => setRememberChoice(e.target.checked)}
                  className="w-6 h-6 text-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-slate-800 font-medium text-lg block group-hover:text-indigo-600 transition-colors duration-200">
                    Se souvenir de mon choix
                  </span>
                  <span className="text-slate-500 text-sm">
                    Charger automatiquement ce workspace à la prochaine connexion
                  </span>
                </div>
                <svg className="w-5 h-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSelectWorkspace}
                disabled={!selectedWorkspace}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
              >
                {rememberChoice ? (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Accéder à ce workspace
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Accéder à ce workspace
                  </>
                )}
              </button>
              
              <button
                onClick={handleCreateNewWorkspace}
                className="px-8 py-5 border-2 border-slate-300 bg-white text-slate-700 font-bold rounded-2xl hover:border-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer un nouveau
              </button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="text-center">
            <Link href="/my-workspaces" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium px-6 py-3 rounded-xl hover:bg-white hover:shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Gérer mes workspaces
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}

