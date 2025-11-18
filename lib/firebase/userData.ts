// Services Firestore pour la gestion des données utilisateur
// Modifié pour supporter les workspaces
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { UserData } from '@/types/firestore';

/**
 * Créer de nouvelles données dans un workspace
 */
export const createUserData = async (
  workspaceId: string,
  createdBy: string,
  data: Record<string, any>,
  category?: string,
  tags?: string[]
): Promise<string> => {
  try {
    const userDataRef = collection(db, 'userData');
    const docRef = await addDoc(userDataRef, {
      workspaceId,
      createdBy,
      dataCollected: data,
      category: category || undefined,
      tags: tags || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: createdBy,
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création des données:', error);
    throw error;
  }
};

/**
 * Récupérer une donnée spécifique par son ID
 */
export const getUserDataById = async (dataId: string): Promise<UserData | null> => {
  try {
    const dataRef = doc(db, 'userData', dataId);
    const dataSnap = await getDoc(dataRef);

    if (dataSnap.exists()) {
      return { id: dataSnap.id, ...dataSnap.data() } as UserData;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les données d'un workspace
 */
export const getWorkspaceData = async (
  workspaceId: string,
  limitCount?: number
): Promise<UserData[]> => {
  try {
    const userDataRef = collection(db, 'userData');
    let q = query(
      userDataRef,
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UserData[];
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les données du workspace:', error);
    throw error;
  }
};

/**
 * Récupérer les données d'un workspace par catégorie
 */
export const getWorkspaceDataByCategory = async (
  workspaceId: string,
  category: string,
  limitCount?: number
): Promise<UserData[]> => {
  try {
    const userDataRef = collection(db, 'userData');
    let q = query(
      userDataRef,
      where('workspaceId', '==', workspaceId),
      where('category', '==', category),
      orderBy('updatedAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UserData[];
  } catch (error) {
    console.error('Erreur lors de la récupération des données par catégorie:', error);
    throw error;
  }
};

/**
 * Récupérer les données créées par un utilisateur spécifique dans un workspace
 */
export const getDataCreatedByUser = async (
  workspaceId: string,
  userId: string,
  limitCount?: number
): Promise<UserData[]> => {
  try {
    const userDataRef = collection(db, 'userData');
    let q = query(
      userDataRef,
      where('workspaceId', '==', workspaceId),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UserData[];
  } catch (error) {
    console.error('Erreur lors de la récupération des données créées par l\'utilisateur:', error);
    throw error;
  }
};

/**
 * Mettre à jour des données
 */
export const updateUserData = async (
  dataId: string,
  userId: string,
  updates: Partial<Omit<UserData, 'id' | 'workspaceId' | 'createdBy' | 'createdAt'>>
): Promise<void> => {
  try {
    const dataRef = doc(db, 'userData', dataId);
    await updateDoc(dataRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    throw error;
  }
};

/**
 * Supprimer des données
 */
export const deleteUserData = async (dataId: string): Promise<void> => {
  try {
    const dataRef = doc(db, 'userData', dataId);
    await deleteDoc(dataRef);
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
    throw error;
  }
};

/**
 * Rechercher des données par tags dans un workspace
 */
export const searchDataByTags = async (
  workspaceId: string,
  tags: string[]
): Promise<UserData[]> => {
  try {
    const userDataRef = collection(db, 'userData');
    const q = query(
      userDataRef,
      where('workspaceId', '==', workspaceId),
      where('tags', 'array-contains-any', tags),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UserData[];
  } catch (error) {
    console.error('Erreur lors de la recherche par tags:', error);
    throw error;
  }
};

/**
 * Compter le nombre de données dans un workspace
 */
export const countWorkspaceData = async (workspaceId: string): Promise<number> => {
  try {
    const data = await getWorkspaceData(workspaceId);
    return data.length;
  } catch (error) {
    console.error('Erreur lors du comptage des données:', error);
    throw error;
  }
};

/**
 * Récupérer les données récemment modifiées dans un workspace
 */
export const getRecentlyUpdatedData = async (
  workspaceId: string,
  limitCount: number = 10
): Promise<UserData[]> => {
  try {
    const userDataRef = collection(db, 'userData');
    const q = query(
      userDataRef,
      where('workspaceId', '==', workspaceId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UserData[];
  } catch (error) {
    console.error('Erreur lors de la récupération des données récentes:', error);
    throw error;
  }
};

/**
 * Supprimer toutes les données d'un workspace
 * Attention: à utiliser avec précaution
 */
export const deleteAllWorkspaceData = async (workspaceId: string): Promise<number> => {
  try {
    const data = await getWorkspaceData(workspaceId);
    
    for (const item of data) {
      await deleteUserData(item.id);
    }
    
    return data.length;
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les données:', error);
    throw error;
  }
};
