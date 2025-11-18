// Gestion des invitations aux workspaces
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
import { WorkspaceInvitation, WorkspaceRole } from '@/types/firestore';
import { addWorkspaceMember } from './workspaceMembers';
import { updateMemberCount } from './workspaces';

// Durée de validité d'une invitation (7 jours)
const INVITATION_EXPIRY_DAYS = 7;

/**
 * Créer une invitation pour rejoindre un workspace
 */
export async function createInvitation(
  workspaceId: string,
  email: string,
  role: WorkspaceRole,
  invitedBy: string,
  workspaceInfo?: {
    name?: string;
    logoURL?: string;
  },
  inviterName?: string
): Promise<string> {
  try {
    // Vérifier si une invitation pending existe déjà pour cet email
    const existingInvitations = await getPendingInvitationsForEmail(workspaceId, email);
    
    if (existingInvitations.length > 0) {
      throw new Error('Une invitation est déjà en attente pour cet email');
    }
    
    // Calculer la date d'expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);
    
    const invitation: Omit<WorkspaceInvitation, 'id'> = {
      workspaceId,
      email: email.toLowerCase(),
      invitedBy,
      invitedByName: inviterName,
      role,
      status: 'pending',
      createdAt: serverTimestamp() as Timestamp,
      expiresAt: Timestamp.fromDate(expiresAt),
      workspaceName: workspaceInfo?.name,
      workspaceLogoURL: workspaceInfo?.logoURL
    };
    
    const docRef = await addDoc(collection(db, 'workspaceInvitations'), invitation);
    
    // TODO: Envoyer un email d'invitation
    console.log('TODO: Envoyer email d\'invitation à', email);
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de l\'invitation:', error);
    throw error;
  }
}

/**
 * Récupérer une invitation par son ID
 */
export async function getInvitation(invitationId: string): Promise<WorkspaceInvitation | null> {
  try {
    const invitationDoc = await getDoc(doc(db, 'workspaceInvitations', invitationId));
    
    if (!invitationDoc.exists()) {
      return null;
    }
    
    return {
      id: invitationDoc.id,
      ...invitationDoc.data()
    } as WorkspaceInvitation;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'invitation:', error);
    throw error;
  }
}

/**
 * Récupérer toutes les invitations d'un workspace
 */
export async function getWorkspaceInvitations(
  workspaceId: string,
  status?: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled'
): Promise<WorkspaceInvitation[]> {
  try {
    let q = query(
      collection(db, 'workspaceInvitations'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );
    
    if (status) {
      q = query(
        collection(db, 'workspaceInvitations'),
        where('workspaceId', '==', workspaceId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WorkspaceInvitation[];
  } catch (error) {
    console.error('Erreur lors de la récupération des invitations du workspace:', error);
    throw error;
  }
}

/**
 * Récupérer les invitations pour un email donné
 */
export async function getInvitationsForEmail(
  email: string,
  status?: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled'
): Promise<WorkspaceInvitation[]> {
  try {
    let q = query(
      collection(db, 'workspaceInvitations'),
      where('email', '==', email.toLowerCase()),
      orderBy('createdAt', 'desc')
    );
    
    if (status) {
      q = query(
        collection(db, 'workspaceInvitations'),
        where('email', '==', email.toLowerCase()),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WorkspaceInvitation[];
  } catch (error) {
    console.error('Erreur lors de la récupération des invitations pour l\'email:', error);
    throw error;
  }
}

/**
 * Récupérer les invitations en attente pour un email dans un workspace spécifique
 */
export async function getPendingInvitationsForEmail(
  workspaceId: string,
  email: string
): Promise<WorkspaceInvitation[]> {
  try {
    const q = query(
      collection(db, 'workspaceInvitations'),
      where('workspaceId', '==', workspaceId),
      where('email', '==', email.toLowerCase()),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WorkspaceInvitation[];
  } catch (error) {
    console.error('Erreur lors de la récupération des invitations en attente:', error);
    throw error;
  }
}

/**
 * Accepter une invitation
 */
export async function acceptInvitation(
  invitationId: string,
  userId: string,
  userInfo: {
    email: string;
    displayName?: string;
    photoURL?: string;
  }
): Promise<void> {
  try {
    const invitation = await getInvitation(invitationId);
    
    if (!invitation) {
      throw new Error('Invitation introuvable');
    }
    
    if (invitation.status !== 'pending') {
      throw new Error('Cette invitation n\'est plus valide');
    }
    
    // Vérifier que l'email correspond
    if (invitation.email.toLowerCase() !== userInfo.email.toLowerCase()) {
      throw new Error('Cette invitation n\'est pas pour votre email');
    }
    
    // Vérifier que l'invitation n'a pas expiré
    const now = new Date();
    const expiresAt = invitation.expiresAt.toDate();
    
    if (now > expiresAt) {
      // Marquer comme expirée
      await updateDoc(doc(db, 'workspaceInvitations', invitationId), {
        status: 'expired'
      });
      throw new Error('Cette invitation a expiré');
    }
    
    // Utiliser une transaction pour atomicité
    const batch = writeBatch(db);
    
    // Mettre à jour l'invitation
    const invitationRef = doc(db, 'workspaceInvitations', invitationId);
    batch.update(invitationRef, {
      status: 'accepted',
      respondedAt: serverTimestamp()
    });
    
    // Ajouter l'utilisateur au workspace
    await addWorkspaceMember(
      invitation.workspaceId,
      userId,
      invitation.role,
      invitation.invitedBy,
      userInfo
    );
    
    await batch.commit();
    
    // Mettre à jour le nombre de membres
    await updateMemberCount(invitation.workspaceId);
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de l\'invitation:', error);
    throw error;
  }
}

/**
 * Refuser une invitation
 */
export async function declineInvitation(invitationId: string): Promise<void> {
  try {
    const invitation = await getInvitation(invitationId);
    
    if (!invitation) {
      throw new Error('Invitation introuvable');
    }
    
    if (invitation.status !== 'pending') {
      throw new Error('Cette invitation n\'est plus valide');
    }
    
    await updateDoc(doc(db, 'workspaceInvitations', invitationId), {
      status: 'declined',
      respondedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors du refus de l\'invitation:', error);
    throw error;
  }
}

/**
 * Annuler une invitation (par un admin)
 */
export async function cancelInvitation(invitationId: string): Promise<void> {
  try {
    const invitation = await getInvitation(invitationId);
    
    if (!invitation) {
      throw new Error('Invitation introuvable');
    }
    
    if (invitation.status !== 'pending') {
      throw new Error('Seules les invitations en attente peuvent être annulées');
    }
    
    await updateDoc(doc(db, 'workspaceInvitations', invitationId), {
      status: 'cancelled'
    });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'invitation:', error);
    throw error;
  }
}

/**
 * Supprimer une invitation
 */
export async function deleteInvitation(invitationId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'workspaceInvitations', invitationId));
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'invitation:', error);
    throw error;
  }
}

/**
 * Renvoyer une invitation (créer une nouvelle invitation pour le même email)
 */
export async function resendInvitation(invitationId: string): Promise<string> {
  try {
    const invitation = await getInvitation(invitationId);
    
    if (!invitation) {
      throw new Error('Invitation introuvable');
    }
    
    // Annuler l'ancienne invitation
    if (invitation.status === 'pending') {
      await cancelInvitation(invitationId);
    }
    
    // Créer une nouvelle invitation
    return await createInvitation(
      invitation.workspaceId,
      invitation.email,
      invitation.role,
      invitation.invitedBy,
      {
        name: invitation.workspaceName,
        logoURL: invitation.workspaceLogoURL
      },
      invitation.invitedByName
    );
  } catch (error) {
    console.error('Erreur lors du renvoi de l\'invitation:', error);
    throw error;
  }
}

/**
 * Marquer les invitations expirées
 * Cette fonction devrait être appelée périodiquement (par exemple via Cloud Function)
 */
export async function markExpiredInvitations(): Promise<number> {
  try {
    const now = new Date();
    
    const q = query(
      collection(db, 'workspaceInvitations'),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    let count = 0;
    
    snapshot.docs.forEach(doc => {
      const invitation = doc.data() as WorkspaceInvitation;
      const expiresAt = invitation.expiresAt.toDate();
      
      if (now > expiresAt) {
        batch.update(doc.ref, {
          status: 'expired'
        });
        count++;
      }
    });
    
    if (count > 0) {
      await batch.commit();
    }
    
    return count;
  } catch (error) {
    console.error('Erreur lors du marquage des invitations expirées:', error);
    throw error;
  }
}

/**
 * Nettoyer les anciennes invitations (plus de 30 jours)
 */
export async function cleanupOldInvitations(): Promise<number> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const q = query(
      collection(db, 'workspaceInvitations'),
      where('status', 'in', ['declined', 'expired', 'cancelled']),
      where('createdAt', '<', Timestamp.fromDate(thirtyDaysAgo))
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    if (snapshot.size > 0) {
      await batch.commit();
    }
    
    return snapshot.size;
  } catch (error) {
    console.error('Erreur lors du nettoyage des anciennes invitations:', error);
    throw error;
  }
}

