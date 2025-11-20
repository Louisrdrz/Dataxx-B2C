import { withAuth } from '@/lib/firebase/withAuth';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types/firestore';
import { useUserWorkspaces } from '@/hooks/useWorkspace';
import { useState, useEffect } from 'react';

interface DashboardProps {
  user: FirebaseUser;
  userData: User | null;
}

const DashboardPage = ({ user, userData }: DashboardProps) => {
  const router = useRouter();
  const { workspaces, isLoading: workspacesLoading } = useUserWorkspaces(user?.uid);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  
  // Debug: afficher les workspaces chargés
  useEffect(() => {
    console.log('Dashboard - workspaces chargés:', workspaces.length, workspaces);
  }, [workspaces]);
  
  // Trouver le workspace actif (celui par défaut ou le premier)
  const currentWorkspace = workspaces.find(w => w.id === userData?.defaultWorkspaceId) || workspaces[0];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard - Dataxx</title>
        <meta name="description" content="Votre tableau de bord Dataxx" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
                
                {/* Workspace Selector */}
                {!workspacesLoading && workspaces.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                      className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all duration-200"
                    >
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-slate-700">
                        {currentWorkspace?.name || 'Sélectionner un workspace'}
                      </span>
                      <svg className={`w-4 h-4 text-indigo-600 transition-transform duration-200 ${showWorkspaceMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showWorkspaceMenu && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                          <p className="text-xs font-semibold text-slate-600 px-2 py-1 uppercase tracking-wide">Vos workspaces</p>
                        </div>
                        <div className="p-2 max-h-64 overflow-y-auto">
                          {workspaces.map((workspace) => (
                            <button
                              key={workspace.id}
                              onClick={() => {
                                router.push('/my-workspaces');
                                setShowWorkspaceMenu(false);
                              }}
                              className={`
                                w-full text-left px-4 py-3 rounded-xl transition-all duration-150 group
                                ${workspace.id === currentWorkspace?.id 
                                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900 font-semibold shadow-sm border border-indigo-100' 
                                  : 'hover:bg-slate-50 text-slate-700 hover:shadow-sm'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                  </svg>
                                  <span className="text-sm">{workspace.name}</span>
                                </div>
                                {workspace.id === userData?.defaultWorkspaceId && (
                                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="p-2 border-t border-slate-200 bg-slate-50/50">
                          <button
                            onClick={() => {
                              router.push('/create-workspace');
                              setShowWorkspaceMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md mb-1 flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Créer un nouveau workspace
                          </button>
                          <button
                            onClick={() => {
                              router.push('/my-workspaces');
                              setShowWorkspaceMenu(false);
                            }}
                            className="w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Gérer mes workspaces
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSignOut}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Welcome Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    Bienvenue, {userData?.displayName || user.email} !
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Voici votre tableau de bord Dataxx. Gérez vos données et votre profil en toute simplicité.
                  </p>
                </div>
                <div className="text-6xl">👋</div>
              </div>
              
              {!user.emailVerified && (
                <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-amber-900 font-medium">Email non vérifié</p>
                    <p className="text-amber-700 text-sm mt-1">Veuillez consulter votre boîte mail pour vérifier votre adresse email.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Statut du compte</h3>
                <div className="p-2 bg-green-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-700">Actif</p>
            </div>

            <div className={`rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 group ${user.emailVerified ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email vérifié</h3>
                <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform duration-200 ${user.emailVerified ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {user.emailVerified ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
              </div>
              <p className={`text-2xl font-bold ${user.emailVerified ? 'text-green-700' : 'text-amber-700'}`}>
                {user.emailVerified ? 'Oui' : 'Non'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Langue</h3>
                <div className="p-2 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {userData?.language === 'fr' ? 'Français' : 'English'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Actions rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/my-workspaces')}
                className="group relative overflow-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="p-3 bg-blue-100 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-800 text-lg">Mes Workspaces</span>
                  <p className="text-sm text-slate-600 mt-2">Gérer mes espaces</p>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/profile')}
                className="group relative overflow-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-200 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="p-3 bg-purple-100 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-800 text-lg">Mon Profil</span>
                  <p className="text-sm text-slate-600 mt-2">Gérer mes informations</p>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/subscription')}
                className="group relative overflow-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="p-3 bg-amber-100 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-800 text-lg">Abonnement</span>
                  <p className="text-sm text-slate-600 mt-2">Gérer mon plan</p>
                </div>
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Informations du compte</h3>
              <button
                onClick={() => router.push('/profile')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2 group"
              >
                <span>Modifier</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </span>
                <span className="text-slate-800 font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Nom d'affichage
                </span>
                <span className="text-slate-800 font-medium">{userData?.displayName || 'Non défini'}</span>
              </div>
              <div className="flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Prénom
                </span>
                <span className="text-slate-800 font-medium">{userData?.firstName || 'Non défini'}</span>
              </div>
              <div className="flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Nom
                </span>
                <span className="text-slate-800 font-medium">{userData?.lastName || 'Non défini'}</span>
              </div>
              <div className="flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Compte créé le
                </span>
                <span className="text-slate-800 font-medium">
                  {userData?.createdAt 
                    ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString('fr-FR')
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dernière connexion
                </span>
                <span className="text-slate-800 font-medium">
                  {userData?.lastLoginAt 
                    ? new Date(userData.lastLoginAt.seconds * 1000).toLocaleString('fr-FR')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

// Protéger la page avec l'authentification
export default withAuth(DashboardPage);
