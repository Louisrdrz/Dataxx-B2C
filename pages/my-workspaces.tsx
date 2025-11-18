import { useAuth } from '@/hooks/useAuth';
import { useUserWorkspaces } from '@/hooks/useWorkspace';
import { getUserWorkspaceRole } from '@/lib/firebase/workspaceMembers';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function MyWorkspacesPage() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { workspaces, loading: workspacesLoading } = useUserWorkspaces(firebaseUser?.uid || '');
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!firebaseUser || !workspaces.length) return;
      
      setLoadingRoles(true);
      const rolesData: Record<string, string> = {};
      
      for (const workspace of workspaces) {
        try {
          const role = await getUserWorkspaceRole(workspace.id, firebaseUser.uid);
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

  if (authLoading || workspacesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos workspaces...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-700 mb-4">Veuillez vous connecter pour voir vos workspaces</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Mes Workspaces</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/create-workspace')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Créer un workspace
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Retour
            </button>
          </div>
        </div>

        {/* Info utilisateur */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3">
            {firebaseUser.photoURL && (
              <img src={firebaseUser.photoURL} alt="Profile" className="w-12 h-12 rounded-full" />
            )}
            <div>
              <p className="font-semibold">{firebaseUser.displayName || firebaseUser.email}</p>
              <p className="text-sm text-gray-600">User ID: {firebaseUser.uid}</p>
            </div>
          </div>
        </div>
        
        {workspaces.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun workspace pour le moment
            </h2>
            <p className="text-gray-600 mb-6">
              Créez votre premier workspace pour commencer à organiser vos données
            </p>
            <button
              onClick={() => router.push('/create-workspace')}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Créer mon premier workspace
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Vous êtes membre de <strong>{workspaces.length}</strong> workspace{workspaces.length > 1 ? 's' : ''}
            </p>
            
            {workspaces.map((workspace) => {
              const role = roles[workspace.id];
              const isAdmin = role === 'admin';
              
              return (
                <div 
                  key={workspace.id} 
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold">{workspace.name}</h2>
                        {loadingRoles ? (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                            ⏳ Chargement...
                          </span>
                        ) : isAdmin ? (
                          <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-semibold text-sm">
                            👑 Admin
                          </span>
                        ) : role === 'member' ? (
                          <span className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm">
                            👤 Membre
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            ❓ {role}
                          </span>
                        )}
                      </div>
                      
                      {workspace.description && (
                        <p className="text-gray-600 mb-3">{workspace.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Type:</span> {workspace.type}
                        </div>
                        <div>
                          <span className="font-medium">Créé le:</span>{' '}
                          {workspace.createdAt?.toDate?.().toLocaleDateString('fr-FR') || 'N/A'}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">ID:</span>{' '}
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {workspace.id}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                    <button
                      onClick={() => router.push(`/google-data`)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      📊 Importer des données Google
                    </button>
                    {isAdmin && (
                      <button
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
                        onClick={() => alert('Page de gestion des membres à venir')}
                      >
                        👥 Gérer les membres
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 À savoir :</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Les <strong>admins</strong> peuvent inviter des membres et gérer le workspace</li>
            <li>• Les <strong>membres</strong> peuvent consulter et ajouter des données</li>
            <li>• Vous pouvez importer vos données Google dans n'importe quel workspace</li>
            <li>• Tous les membres d'un workspace peuvent voir les données partagées</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

