// Hook pour gérer le workspace actif
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Workspace } from '@/types/firestore';
import { getUserWorkspaces, getWorkspace } from '@/lib/firebase/workspaces';
import { getUserRoleInWorkspace } from '@/lib/firebase/workspaceMembers';
import { useAuth } from './useAuth';
import { collection, query, where, orderBy, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  userWorkspaces: Workspace[];
  userRole: 'admin' | 'member' | null;
  isLoading: boolean;
  error: string | null;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
  refreshCurrentWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

/**
 * Provider pour le contexte workspace
 */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { firebaseUser: user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [userWorkspaces, setUserWorkspaces] = useState<Workspace[]>([]);
  const [userRole, setUserRole] = useState<'admin' | 'member' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger tous les workspaces de l'utilisateur
   */
  const loadUserWorkspaces = useCallback(async () => {
    if (!user) {
      setUserWorkspaces([]);
      setCurrentWorkspace(null);
      setUserRole(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const workspaces = await getUserWorkspaces(user.uid);
      setUserWorkspaces(workspaces);

      // Si l'utilisateur a un workspace par défaut, le charger
      if (user.defaultWorkspaceId) {
        const defaultWorkspace = workspaces.find(w => w.id === user.defaultWorkspaceId);
        if (defaultWorkspace) {
          setCurrentWorkspace(defaultWorkspace);
          const role = await getUserRoleInWorkspace(defaultWorkspace.id, user.uid);
          setUserRole(role);
        } else if (workspaces.length > 0) {
          // Sinon, charger le premier workspace
          setCurrentWorkspace(workspaces[0]);
          const role = await getUserRoleInWorkspace(workspaces[0].id, user.uid);
          setUserRole(role);
        }
      } else if (workspaces.length > 0) {
        // Si pas de workspace par défaut, charger le premier
        setCurrentWorkspace(workspaces[0]);
        const role = await getUserRoleInWorkspace(workspaces[0].id, user.uid);
        setUserRole(role);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des workspaces:', err);
      setError('Impossible de charger les workspaces');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Changer de workspace actif
   */
  const switchWorkspace = useCallback(async (workspaceId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const workspace = await getWorkspace(workspaceId);
      if (!workspace) {
        throw new Error('Workspace introuvable');
      }

      setCurrentWorkspace(workspace);
      
      const role = await getUserRoleInWorkspace(workspaceId, user.uid);
      setUserRole(role);

      // TODO: Sauvegarder le workspace par défaut dans le profil utilisateur
      // await updateUserProfile(user.uid, { defaultWorkspaceId: workspaceId });
    } catch (err) {
      console.error('Erreur lors du changement de workspace:', err);
      setError('Impossible de changer de workspace');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Rafraîchir la liste des workspaces
   */
  const refreshWorkspaces = useCallback(async () => {
    await loadUserWorkspaces();
  }, [loadUserWorkspaces]);

  /**
   * Rafraîchir le workspace actuel
   */
  const refreshCurrentWorkspace = useCallback(async () => {
    if (!currentWorkspace || !user) return;

    try {
      const workspace = await getWorkspace(currentWorkspace.id);
      if (workspace) {
        setCurrentWorkspace(workspace);
      }

      const role = await getUserRoleInWorkspace(currentWorkspace.id, user.uid);
      setUserRole(role);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement du workspace:', err);
      setError('Impossible de rafraîchir le workspace');
    }
  }, [currentWorkspace, user]);

  // Charger les workspaces au montage et quand l'utilisateur change
  useEffect(() => {
    loadUserWorkspaces();
  }, [loadUserWorkspaces]);

  const value: WorkspaceContextType = {
    currentWorkspace,
    userWorkspaces,
    userRole,
    isLoading,
    error,
    switchWorkspace,
    refreshWorkspaces,
    refreshCurrentWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

/**
 * Hook pour accéder au contexte workspace
 */
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  
  if (context === undefined) {
    throw new Error('useWorkspace doit être utilisé dans un WorkspaceProvider');
  }
  
  return context;
}

/**
 * Hook simple pour récupérer les workspaces d'un utilisateur EN TEMPS RÉEL
 * (Sans utiliser le contexte)
 * 
 * ⚡ Ce hook utilise des listeners Firestore pour des mises à jour automatiques
 */
export function useUserWorkspaces(userId: string | undefined) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setWorkspaces([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    let workspaceUnsubscribers: (() => void)[] = [];

    // ⚡ ÉCOUTE EN TEMPS RÉEL des changements dans workspaceMembers
    const unsubscribeMembers = onSnapshot(
      query(
        collection(db, 'workspaceMembers'),
        where('userId', '==', userId),
        orderBy('joinedAt', 'desc')
      ),
      (membersSnapshot) => {
        // Nettoyer les anciens listeners de workspaces
        workspaceUnsubscribers.forEach(unsub => unsub());
        workspaceUnsubscribers = [];

        const workspaceIds = membersSnapshot.docs.map(doc => doc.data().workspaceId);
        
        console.log('useUserWorkspaces - IDs trouvés:', workspaceIds);
        
        if (workspaceIds.length === 0) {
          setWorkspaces([]);
          setIsLoading(false);
          return;
        }

        const workspacesMap = new Map<string, Workspace>();
        let loadedCount = 0;

        // Fonction pour mettre à jour l'état avec les workspaces actuels
        const updateWorkspaces = () => {
          const sortedWorkspaces = Array.from(workspacesMap.values())
            .sort((a, b) => {
              const aIndex = workspaceIds.indexOf(a.id);
              const bIndex = workspaceIds.indexOf(b.id);
              return aIndex - bIndex;
            });
          console.log('useUserWorkspaces - Mise à jour:', sortedWorkspaces.length, 'workspaces');
          setWorkspaces(sortedWorkspaces);
          
          // Marquer comme chargé une fois qu'on a au moins récupéré le premier workspace
          if (loadedCount >= workspaceIds.length) {
            setIsLoading(false);
          }
        };

        // ⚡ Écouter chaque workspace individuellement
        for (const workspaceId of workspaceIds) {
          const workspaceRef = doc(db, 'workspaces', workspaceId);
          const unsubWorkspace = onSnapshot(
            workspaceRef,
            (workspaceDoc) => {
              if (workspaceDoc.exists()) {
                workspacesMap.set(workspaceId, {
                  id: workspaceDoc.id,
                  ...workspaceDoc.data()
                } as Workspace);
                loadedCount++;
              } else {
                workspacesMap.delete(workspaceId);
              }
              updateWorkspaces();
            },
            (err) => {
              console.error(`Erreur listener workspace ${workspaceId}:`, err);
              loadedCount++;
              updateWorkspaces();
            }
          );
          workspaceUnsubscribers.push(unsubWorkspace);
        }
      },
      (err) => {
        console.error('Erreur listener workspaceMembers:', err);
        setError('Erreur de connexion aux workspaces');
        setIsLoading(false);
      }
    );

    // Cleanup de tous les listeners
    return () => {
      unsubscribeMembers();
      workspaceUnsubscribers.forEach(unsub => unsub());
    };
  }, [userId]);

  return { workspaces, isLoading, error };
}

/**
 * Hook pour récupérer un workspace spécifique EN TEMPS RÉEL
 * 
 * ⚡ Ce hook utilise un listener Firestore pour des mises à jour automatiques
 */
export function useWorkspaceById(workspaceId: string | undefined) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setWorkspace(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // ⚡ ÉCOUTE EN TEMPS RÉEL du workspace
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    const unsubscribe = onSnapshot(
      workspaceRef,
      (workspaceDoc) => {
        if (workspaceDoc.exists()) {
          setWorkspace({
            id: workspaceDoc.id,
            ...workspaceDoc.data()
          } as Workspace);
        } else {
          setWorkspace(null);
          setError('Workspace introuvable');
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Erreur listener workspace:', err);
        setError('Erreur de connexion au workspace');
        setIsLoading(false);
      }
    );

    // Cleanup du listener
    return () => {
      unsubscribe();
    };
  }, [workspaceId]);

  return { workspace, isLoading, error };
}

