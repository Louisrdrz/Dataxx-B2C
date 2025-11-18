// Hook pour gérer les membres des workspaces
import { useState, useEffect, useCallback } from 'react';
import { WorkspaceMember } from '@/types/firestore';
import {
  getWorkspaceMembers,
  getWorkspaceAdmins,
  getWorkspaceMember,
  addWorkspaceMember,
  updateMemberRole,
  removeWorkspaceMember,
  isUserWorkspaceAdmin,
  isUserWorkspaceMember,
  getUserRoleInWorkspace
} from '@/lib/firebase/workspaceMembers';
import { collection, query, where, orderBy, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

/**
 * Hook pour récupérer tous les membres d'un workspace EN TEMPS RÉEL
 * 
 * ⚡ Ce hook utilise un listener Firestore pour des mises à jour automatiques
 * Les changements (ajout, suppression, modification de rôle) sont reflétés instantanément
 */
export function useWorkspaceMembers(workspaceId: string | undefined) {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setMembers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // ⚡ ÉCOUTE EN TEMPS RÉEL des membres du workspace
    const membersQuery = query(
      collection(db, 'workspaceMembers'),
      where('workspaceId', '==', workspaceId),
      orderBy('joinedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      membersQuery,
      (snapshot) => {
        const membersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WorkspaceMember[];
        
        setMembers(membersData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Erreur listener membres:', err);
        setError('Erreur de connexion aux membres');
        setIsLoading(false);
      }
    );

    // Cleanup du listener
    return () => {
      unsubscribe();
    };
  }, [workspaceId]);

  // Note: refresh n'est plus nécessaire car le listener se met à jour automatiquement
  // On le garde pour la compatibilité avec le code existant
  const refresh = useCallback(() => {
    // Le listener se met à jour automatiquement, donc on ne fait rien
    console.log('⚡ Refresh non nécessaire: les données se mettent à jour automatiquement');
  }, []);

  return { members, isLoading, error, refresh };
}

/**
 * Hook pour récupérer uniquement les admins d'un workspace
 */
export function useWorkspaceAdmins(workspaceId: string | undefined) {
  const [admins, setAdmins] = useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdmins = useCallback(async () => {
    if (!workspaceId) {
      setAdmins([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getWorkspaceAdmins(workspaceId);
      setAdmins(data);
    } catch (err) {
      console.error('Erreur lors du chargement des admins:', err);
      setError('Impossible de charger les admins');
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const refresh = useCallback(() => {
    loadAdmins();
  }, [loadAdmins]);

  return { admins, isLoading, error, refresh };
}

/**
 * Hook pour récupérer un membre spécifique
 */
export function useWorkspaceMember(workspaceId: string | undefined, userId: string | undefined) {
  const [member, setMember] = useState<WorkspaceMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId || !userId) {
      setMember(null);
      setIsLoading(false);
      return;
    }

    const loadMember = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getWorkspaceMember(workspaceId, userId);
        setMember(data);
      } catch (err) {
        console.error('Erreur lors du chargement du membre:', err);
        setError('Impossible de charger le membre');
      } finally {
        setIsLoading(false);
      }
    };

    loadMember();
  }, [workspaceId, userId]);

  return { member, isLoading, error };
}

/**
 * Hook pour vérifier si un utilisateur est admin d'un workspace
 */
export function useIsWorkspaceAdmin(workspaceId: string | undefined, userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || !userId) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        setIsLoading(true);
        const result = await isUserWorkspaceAdmin(workspaceId, userId);
        setIsAdmin(result);
      } catch (err) {
        console.error('Erreur lors de la vérification du rôle admin:', err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [workspaceId, userId]);

  return { isAdmin, isLoading };
}

/**
 * Hook pour vérifier si un utilisateur est membre d'un workspace
 */
export function useIsWorkspaceMember(workspaceId: string | undefined, userId: string | undefined) {
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || !userId) {
      setIsMember(false);
      setIsLoading(false);
      return;
    }

    const checkMember = async () => {
      try {
        setIsLoading(true);
        const result = await isUserWorkspaceMember(workspaceId, userId);
        setIsMember(result);
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'appartenance:', err);
        setIsMember(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMember();
  }, [workspaceId, userId]);

  return { isMember, isLoading };
}

/**
 * Hook pour gérer les actions sur les membres (ajouter, modifier, supprimer)
 */
export function useWorkspaceMemberActions(workspaceId: string | undefined) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMember = useCallback(async (
    userId: string,
    role: 'admin' | 'member',
    invitedBy?: string,
    userInfo?: {
      email?: string;
      displayName?: string;
      photoURL?: string;
    }
  ) => {
    if (!workspaceId) {
      throw new Error('Workspace ID manquant');
    }

    try {
      setIsProcessing(true);
      setError(null);
      await addWorkspaceMember(workspaceId, userId, role, invitedBy, userInfo);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du membre:', err);
      setError('Impossible d\'ajouter le membre');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [workspaceId]);

  const changeMemberRole = useCallback(async (
    userId: string,
    newRole: 'admin' | 'member'
  ) => {
    if (!workspaceId) {
      throw new Error('Workspace ID manquant');
    }

    try {
      setIsProcessing(true);
      setError(null);
      await updateMemberRole(workspaceId, userId, newRole);
    } catch (err) {
      console.error('Erreur lors du changement de rôle:', err);
      setError('Impossible de changer le rôle');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [workspaceId]);

  const removeMember = useCallback(async (userId: string) => {
    if (!workspaceId) {
      throw new Error('Workspace ID manquant');
    }

    try {
      setIsProcessing(true);
      setError(null);
      await removeWorkspaceMember(workspaceId, userId);
    } catch (err) {
      console.error('Erreur lors de la suppression du membre:', err);
      setError('Impossible de supprimer le membre');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [workspaceId]);

  return {
    addMember,
    changeMemberRole,
    removeMember,
    isProcessing,
    error
  };
}

/**
 * Hook pour obtenir le rôle d'un utilisateur dans un workspace
 */
export function useUserRole(workspaceId: string | undefined, userId: string | undefined) {
  const [role, setRole] = useState<'admin' | 'member' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || !userId) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    const loadRole = async () => {
      try {
        setIsLoading(true);
        const userRole = await getUserRoleInWorkspace(workspaceId, userId);
        setRole(userRole);
      } catch (err) {
        console.error('Erreur lors de la récupération du rôle:', err);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadRole();
  }, [workspaceId, userId]);

  return { role, isLoading };
}

/**
 * Hook combiné pour obtenir toutes les informations pertinentes sur le rôle de l'utilisateur
 */
export function useCurrentUserWorkspaceRole(workspaceId: string | undefined, userId: string | undefined) {
  const { role, isLoading: roleLoading } = useUserRole(workspaceId, userId);
  const { isAdmin, isLoading: adminLoading } = useIsWorkspaceAdmin(workspaceId, userId);
  const { isMember, isLoading: memberLoading } = useIsWorkspaceMember(workspaceId, userId);

  return {
    role,
    isAdmin,
    isMember,
    isLoading: roleLoading || adminLoading || memberLoading,
    canManageMembers: isAdmin,
    canManageWorkspace: isAdmin,
    canViewData: isMember,
    canEditData: isMember,
    canDeleteData: isAdmin
  };
}

