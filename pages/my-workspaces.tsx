import { useAuth } from '@/hooks/useAuth';
import { useUserWorkspaces } from '@/hooks/useWorkspace';
import { getUserRoleInWorkspace } from '@/lib/firebase/workspaceMembers';
import { setDefaultWorkspace } from '@/lib/firebase/users';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';

export default function MyWorkspacesPage() {
  const { firebaseUser, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { workspaces, isLoading: workspacesLoading } = useUserWorkspaces(firebaseUser?.uid || '');
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [settingDefault, setSettingDefault] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoles = async () => {
      if (!firebaseUser || !workspaces.length) return;
      
      setLoadingRoles(true);
      const rolesData: Record<string, string> = {};
      
      for (const workspace of workspaces) {
        try {
          const role = await getUserRoleInWorkspace(workspace.id, firebaseUser.uid);
          rolesData[workspace.id] = role || 'unknown';
        } catch (error) {
          console.error(`Erreur role pour ${workspace.id}:`, error);
          rolesData[workspace.id] = 'error';
        }
      }
      
      setRoles(rolesData);
      setLoadingRoles(false);
    };
    
    fetchRoles();
  }, [firebaseUser, workspaces]);

  const handleSetDefaultWorkspace = async (workspaceId: string) => {
    if (!firebaseUser) return;
    
    setSettingDefault(workspaceId);
    try {
      await setDefaultWorkspace(firebaseUser.uid, workspaceId);
      toast({
        title: "✅ Workspace par défaut défini",
        description: "Ce workspace sera chargé automatiquement à votre prochaine connexion.",
      });
      // Rafraîchir la page pour mettre à jour l'affichage
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la définition du workspace par défaut:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de définir le workspace par défaut.",
        variant: "destructive",
      });
    } finally {
      setSettingDefault(null);
    }
  };

  const handleAccessWorkspace = (workspaceId: string) => {
    // Rediriger vers la page du workspace avec toutes les infos
    router.push(`/workspace/${workspaceId}`);
  };

  if (authLoading || workspacesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 blur-xl"></div>
          </div>
          <p className="mt-6 text-slate-600 text-lg font-medium">Chargement de vos workspaces...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-200 text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Authentification requise</h3>
            <p className="text-slate-600">Veuillez vous connecter pour accéder à vos workspaces</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Mes Workspaces</h1>
              <p className="text-slate-600">Gérez vos espaces de travail et vos collaborations</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/create-workspace')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer un workspace
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-white text-slate-700 px-5 py-3 rounded-xl hover:bg-slate-50 border border-slate-300 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </button>
            </div>
          </div>
        </div>

        {/* Info utilisateur */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            {firebaseUser.photoURL ? (
              <img src={firebaseUser.photoURL} alt="Profile" className="w-16 h-16 rounded-full ring-4 ring-indigo-100" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-indigo-100">
                {firebaseUser.displayName?.[0]?.toUpperCase() || firebaseUser.email?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="font-bold text-lg text-slate-800">{firebaseUser.displayName || firebaseUser.email}</p>
              <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                User ID: <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">{firebaseUser.uid}</code>
              </p>
            </div>
          </div>
        </div>
        
        {workspaces.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              Aucun workspace pour le moment
            </h2>
            <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
              Créez votre premier workspace pour commencer à organiser vos données et collaborer avec votre équipe
            </p>
            <button
              onClick={() => router.push('/create-workspace')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-200 font-bold text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer mon premier workspace
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
              <p className="text-slate-700 text-center font-medium">
                Vous êtes membre de <span className="text-2xl font-bold text-indigo-600 mx-1">{workspaces.length}</span> workspace{workspaces.length > 1 ? 's' : ''}
              </p>
            </div>
            
            {workspaces.map((workspace) => {
              const role = roles[workspace.id];
              const isAdmin = role === 'admin';
              const isDefault = userData?.defaultWorkspaceId === workspace.id;
              
              return (
                <div 
                  key={workspace.id} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">{workspace.name}</h2>
                        {loadingRoles ? (
                          <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Chargement...
                          </span>
                        ) : isAdmin ? (
                          <span className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-4 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1 border border-amber-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Admin
                          </span>
                        ) : role === 'member' ? (
                          <span className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-xl text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Membre
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-4 py-1.5 rounded-xl text-sm font-medium">
                            ❓ {role}
                          </span>
                        )}
                        {isDefault && (
                          <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-1.5 rounded-xl font-bold text-sm flex items-center gap-1 border border-green-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Par défaut
                          </span>
                        )}
                      </div>
                      
                      {workspace.description && (
                        <p className="text-slate-600 mb-4 text-lg">{workspace.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Type</p>
                            <p className="text-slate-800 font-semibold">{workspace.type}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Créé le</p>
                            <p className="text-slate-800 font-semibold">
                              {workspace.createdAt?.toDate?.().toLocaleDateString('fr-FR') || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 bg-slate-50 rounded-xl p-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-xs text-slate-500 font-medium">ID</p>
                            <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-700 font-mono">
                              {workspace.id}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleAccessWorkspace(workspace.id)}
                      className="flex-1 min-w-[200px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-bold flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Accéder au workspace
                    </button>
                    {!isDefault && (
                      <button
                        onClick={() => handleSetDefaultWorkspace(workspace.id)}
                        disabled={settingDefault === workspace.id}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {settingDefault === workspace.id ? (
                          <>
                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            En cours...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Définir par défaut
                          </>
                        )}
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        className="bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl hover:bg-slate-100 hover:shadow-md transition-all duration-200 font-semibold flex items-center gap-2"
                        onClick={() => alert('Page de gestion des membres à venir')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Gérer les membres
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-200 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-indigo-900 text-lg mb-4">À savoir sur les workspaces</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-indigo-800">
                    Les <strong>admins</strong> peuvent inviter des membres et gérer le workspace
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-indigo-800">
                    Les <strong>membres</strong> peuvent consulter et ajouter des données
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-indigo-800">
                    Définissez un workspace <strong>par défaut</strong> pour un accès rapide
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-indigo-800">
                    Changez de workspace à tout moment depuis cette page
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-indigo-800">
                    Tous les membres voient les données partagées du workspace
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

