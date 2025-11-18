// Gestion des workspaces Firestore
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { Workspace } from '@/types/firestore';

/**
 * Créer un nouveau workspace
 * Cette fonction crée le workspace ET ajoute le créateur comme premier admin
 */
export async function createWorkspace(
  userId: string,
  workspaceData: {
    name: string;
    description?: string;
    type?: 'club' | 'athlete' | 'personal' | 'other';
    logoURL?: string;
  }
): Promise<string> {
  try {
    const batch = writeBatch(db);
    
    // Créer le workspace
    const workspaceRef = doc(collection(db, 'workspaces'));
    const workspaceId = workspaceRef.id;
    
    const workspace: Omit<Workspace, 'id'> = {
      name: workspaceData.name,
      description: workspaceData.description,
      type: workspaceData.type || 'personal',
      ownerId: userId,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      settings: {
        allowMemberInvite: false,
        visibility: 'private'
      },
      memberCount: 1,
      logoURL: workspaceData.logoURL
    };
    
    batch.set(workspaceRef, workspace);
    
    // Ajouter le créateur comme admin
    const memberRef = doc(db, 'workspaceMembers', `${workspaceId}_${userId}`);
    batch.set(memberRef, {
      id: `${workspaceId}_${userId}`,
      workspaceId: workspaceId,
      userId: userId,
      role: 'admin',
      joinedAt: serverTimestamp()
    });
    
    await batch.commit();
    
    return workspaceId;
  } catch (error) {
    console.error('Erreur lors de la création du workspace:', error);
    throw error;
  }
}

/**
 * Récupérer un workspace par son ID
 */
export async function getWorkspace(workspaceId: string): Promise<Workspace | null> {
  try {
    const workspaceDoc = await getDoc(doc(db, 'workspaces', workspaceId));
    
    if (!workspaceDoc.exists()) {
      return null;
    }
    
    return {
      id: workspaceDoc.id,
      ...workspaceDoc.data()
    } as Workspace;
  } catch (error) {
    console.error('Erreur lors de la récupération du workspace:', error);
    throw error;
  }
}

/**
 * Récupérer tous les workspaces d'un utilisateur
 * (via la collection workspaceMembers)
 */
export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  try {
    // Récupérer les IDs des workspaces où l'utilisateur est membre
    const membersQuery = query(
      collection(db, 'workspaceMembers'),
      where('userId', '==', userId),
      orderBy('joinedAt', 'desc')
    );
    
    const membersSnapshot = await getDocs(membersQuery);
    const workspaceIds = membersSnapshot.docs.map(doc => doc.data().workspaceId);
    
    if (workspaceIds.length === 0) {
      return [];
    }
    
    // Récupérer les détails de chaque workspace
    const workspaces: Workspace[] = [];
    for (const workspaceId of workspaceIds) {
      const workspace = await getWorkspace(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }
    
    return workspaces;
  } catch (error) {
    console.error('Erreur lors de la récupération des workspaces de l\'utilisateur:', error);
    throw error;
  }
}

/**
 * Récupérer les workspaces créés par un utilisateur
 */
export async function getOwnedWorkspaces(userId: string): Promise<Workspace[]> {
  try {
    const q = query(
      collection(db, 'workspaces'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Workspace[];
  } catch (error) {
    console.error('Erreur lors de la récupération des workspaces possédés:', error);
    throw error;
  }
}

/**
 * Mettre à jour un workspace
 */
export async function updateWorkspace(
  workspaceId: string,
  updates: Partial<Omit<Workspace, 'id' | 'ownerId' | 'createdAt'>>
): Promise<void> {
  try {
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    
    await updateDoc(workspaceRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du workspace:', error);
    throw error;
  }
}

/**
 * Supprimer un workspace
 * Note: Cette fonction doit aussi nettoyer toutes les données associées
 */
export async function deleteWorkspace(workspaceId: string): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    // Supprimer le workspace
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    batch.delete(workspaceRef);
    
    // Supprimer tous les membres
    const membersQuery = query(
      collection(db, 'workspaceMembers'),
      where('workspaceId', '==', workspaceId)
    );
    const membersSnapshot = await getDocs(membersQuery);
    membersSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Supprimer toutes les invitations
    const invitationsQuery = query(
      collection(db, 'workspaceInvitations'),
      where('workspaceId', '==', workspaceId)
    );
    const invitationsSnapshot = await getDocs(invitationsQuery);
    invitationsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    // Note: Les subscriptions et userData doivent être gérées séparément
    // car elles peuvent avoir des implications de facturation
    console.warn('N\'oubliez pas de gérer les subscriptions et userData associées');
  } catch (error) {
    console.error('Erreur lors de la suppression du workspace:', error);
    throw error;
  }
}

/**
 * Mettre à jour le nombre de membres d'un workspace
 */
export async function updateMemberCount(workspaceId: string): Promise<void> {
  try {
    const membersQuery = query(
      collection(db, 'workspaceMembers'),
      where('workspaceId', '==', workspaceId)
    );
    
    const snapshot = await getDocs(membersQuery);
    const count = snapshot.size;
    
    await updateDoc(doc(db, 'workspaces', workspaceId), {
      memberCount: count,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du nombre de membres:', error);
    throw error;
  }
}

/**
 * Vérifier si un utilisateur est admin d'un workspace
 */
export async function isWorkspaceAdmin(workspaceId: string, userId: string): Promise<boolean> {
  try {
    const memberDoc = await getDoc(doc(db, 'workspaceMembers', `${workspaceId}_${userId}`));
    
    if (!memberDoc.exists()) {
      return false;
    }
    
    return memberDoc.data().role === 'admin';
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle admin:', error);
    return false;
  }
}

/**
 * Vérifier si un utilisateur est membre d'un workspace
 */
export async function isWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
  try {
    const memberDoc = await getDoc(doc(db, 'workspaceMembers', `${workspaceId}_${userId}`));
    return memberDoc.exists();
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'appartenance au workspace:', error);
    return false;
  }
}

