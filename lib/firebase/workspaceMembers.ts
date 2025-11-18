// Gestion des membres des workspaces
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { WorkspaceMember, WorkspaceRole } from '@/types/firestore';

/**
 * Ajouter un membre à un workspace
 */
export async function addWorkspaceMember(
  workspaceId: string,
  userId: string,
  role: WorkspaceRole,
  invitedBy?: string,
  userInfo?: {
    email?: string;
    displayName?: string;
    photoURL?: string;
  }
): Promise<void> {
  try {
    const memberId = `${workspaceId}_${userId}`;
    const memberRef = doc(db, 'workspaceMembers', memberId);
    
    const memberData: Omit<WorkspaceMember, 'id'> = {
      workspaceId,
      userId,
      role,
      joinedAt: serverTimestamp() as Timestamp,
      invitedBy,
      userEmail: userInfo?.email,
      userDisplayName: userInfo?.displayName,
      userPhotoURL: userInfo?.photoURL
    };
    
    await setDoc(memberRef, {
      id: memberId,
      ...memberData
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    throw error;
  }
}

/**
 * Récupérer tous les membres d'un workspace
 */
export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  try {
    const q = query(
      collection(db, 'workspaceMembers'),
      where('workspaceId', '==', workspaceId),
      orderBy('joinedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WorkspaceMember[];
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    throw error;
  }
}

/**
 * Récupérer uniquement les admins d'un workspace
 */
export async function getWorkspaceAdmins(workspaceId: string): Promise<WorkspaceMember[]> {
  try {
    const q = query(
      collection(db, 'workspaceMembers'),
      where('workspaceId', '==', workspaceId),
      where('role', '==', 'admin'),
      orderBy('joinedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WorkspaceMember[];
  } catch (error) {
    console.error('Erreur lors de la récupération des admins:', error);
    throw error;
  }
}

/**
 * Compter le nombre d'admins dans un workspace
 */
export async function countWorkspaceAdmins(workspaceId: string): Promise<number> {
  try {
    const admins = await getWorkspaceAdmins(workspaceId);
    return admins.length;
  } catch (error) {
    console.error('Erreur lors du comptage des admins:', error);
    throw error;
  }
}

/**
 * Récupérer un membre spécifique
 */
export async function getWorkspaceMember(
  workspaceId: string, 
  userId: string
): Promise<WorkspaceMember | null> {
  try {
    const memberId = `${workspaceId}_${userId}`;
    const memberDoc = await getDoc(doc(db, 'workspaceMembers', memberId));
    
    if (!memberDoc.exists()) {
      return null;
    }
    
    return {
      id: memberDoc.id,
      ...memberDoc.data()
    } as WorkspaceMember;
  } catch (error) {
    console.error('Erreur lors de la récupération du membre:', error);
    throw error;
  }
}

/**
 * Mettre à jour le rôle d'un membre
 */
export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  newRole: WorkspaceRole
): Promise<void> {
  try {
    // Vérifier qu'on ne retire pas le dernier admin
    if (newRole === 'member') {
      const adminCount = await countWorkspaceAdmins(workspaceId);
      const currentMember = await getWorkspaceMember(workspaceId, userId);
      
      if (currentMember?.role === 'admin' && adminCount <= 1) {
        throw new Error('Impossible de retirer le dernier administrateur du workspace');
      }
    }
    
    const memberId = `${workspaceId}_${userId}`;
    const memberRef = doc(db, 'workspaceMembers', memberId);
    
    await updateDoc(memberRef, {
      role: newRole
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    throw error;
  }
}

/**
 * Promouvoir un membre en admin
 */
export async function promoteToAdmin(workspaceId: string, userId: string): Promise<void> {
  return updateMemberRole(workspaceId, userId, 'admin');
}

/**
 * Rétrograder un admin en membre
 */
export async function demoteToMember(workspaceId: string, userId: string): Promise<void> {
  return updateMemberRole(workspaceId, userId, 'member');
}

/**
 * Retirer un membre d'un workspace
 */
export async function removeWorkspaceMember(
  workspaceId: string,
  userId: string
): Promise<void> {
  try {
    // Vérifier qu'on ne retire pas le dernier admin
    const member = await getWorkspaceMember(workspaceId, userId);
    
    if (member?.role === 'admin') {
      const adminCount = await countWorkspaceAdmins(workspaceId);
      
      if (adminCount <= 1) {
        throw new Error('Impossible de retirer le dernier administrateur du workspace');
      }
    }
    
    const memberId = `${workspaceId}_${userId}`;
    const memberRef = doc(db, 'workspaceMembers', memberId);
    
    await deleteDoc(memberRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    throw error;
  }
}

/**
 * Quitter un workspace (utilisateur lui-même)
 */
export async function leaveWorkspace(workspaceId: string, userId: string): Promise<void> {
  try {
    // Vérifier qu'on n'est pas le dernier admin
    const member = await getWorkspaceMember(workspaceId, userId);
    
    if (member?.role === 'admin') {
      const adminCount = await countWorkspaceAdmins(workspaceId);
      
      if (adminCount <= 1) {
        throw new Error('Vous êtes le dernier administrateur. Promouvez un autre membre avant de quitter.');
      }
    }
    
    await removeWorkspaceMember(workspaceId, userId);
  } catch (error) {
    console.error('Erreur lors de la sortie du workspace:', error);
    throw error;
  }
}

/**
 * Mettre à jour les informations dénormalisées d'un membre
 * Utile quand l'utilisateur met à jour son profil
 */
export async function updateMemberInfo(
  workspaceId: string,
  userId: string,
  userInfo: {
    email?: string;
    displayName?: string;
    photoURL?: string;
  }
): Promise<void> {
  try {
    const memberId = `${workspaceId}_${userId}`;
    const memberRef = doc(db, 'workspaceMembers', memberId);
    
    const updates: any = {};
    if (userInfo.email) updates.userEmail = userInfo.email;
    if (userInfo.displayName) updates.userDisplayName = userInfo.displayName;
    if (userInfo.photoURL) updates.userPhotoURL = userInfo.photoURL;
    
    if (Object.keys(updates).length > 0) {
      await updateDoc(memberRef, updates);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des infos du membre:', error);
    throw error;
  }
}

/**
 * Récupérer tous les workspaces où un utilisateur est membre
 */
export async function getUserMemberships(userId: string): Promise<WorkspaceMember[]> {
  try {
    const q = query(
      collection(db, 'workspaceMembers'),
      where('userId', '==', userId),
      orderBy('joinedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WorkspaceMember[];
  } catch (error) {
    console.error('Erreur lors de la récupération des appartenances:', error);
    throw error;
  }
}

/**
 * Vérifier si un utilisateur est admin d'un workspace
 */
export async function isUserWorkspaceAdmin(
  workspaceId: string,
  userId: string
): Promise<boolean> {
  try {
    const member = await getWorkspaceMember(workspaceId, userId);
    return member?.role === 'admin';
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle admin:', error);
    return false;
  }
}

/**
 * Vérifier si un utilisateur est membre d'un workspace
 */
export async function isUserWorkspaceMember(
  workspaceId: string,
  userId: string
): Promise<boolean> {
  try {
    const member = await getWorkspaceMember(workspaceId, userId);
    return member !== null;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'appartenance:', error);
    return false;
  }
}

/**
 * Obtenir le rôle d'un utilisateur dans un workspace
 */
export async function getUserRoleInWorkspace(
  workspaceId: string,
  userId: string
): Promise<WorkspaceRole | null> {
  try {
    const member = await getWorkspaceMember(workspaceId, userId);
    return member?.role || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle:', error);
    return null;
  }
}

