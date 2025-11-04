// Services Firestore pour la gestion des données utilisateur
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
 * Créer de nouvelles données utilisateur
 */
export const createUserData = async (
  userId: string,
  data: Record<string, any>,
  category?: string,
  tags?: string[]
): Promise<string> => {
  try {
    const userDataRef = collection(db, 'userData');
    const docRef = await addDoc(userDataRef, {
      userId,
      dataCollected: data,
      category: category || undefined,
      tags: tags || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création des données:', error);
    throw error;
  }
};

/**
 * Récupérer une donnée utilisateur spécifique
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
 * Récupérer toutes les données d'un utilisateur
 */
export const getAllUserData = async (
  userId: string,
  limitCount?: number
): Promise<UserData[]> => {
  try {
    const userDataRef = collection(db, 'userData');
    let q = query(
      userDataRef,
      where('userId', '==', userId),
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
    console.error('Erreur lors de la récupération de toutes les données:', error);
    throw error;
  }
};

/**
 * Récupérer les données d'un utilisateur par catégorie
 */
export const getUserDataByCategory = async (
  userId: string,
  category: string,
  limitCount?: number
): Promise<UserData[]> => {
  try {
    const userDataRef = collection(db, 'userData');
    let q = query(
      userDataRef,
      where('userId', '==', userId),
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
 * Mettre à jour des données utilisateur
 */
export const updateUserData = async (
  dataId: string,
  updates: Partial<UserData>
): Promise<void> => {
  try {
    const dataRef = doc(db, 'userData', dataId);
    await updateDoc(dataRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    throw error;
  }
};

/**
 * Supprimer des données utilisateur
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
 * Rechercher des données par tags
 */
export const searchUserDataByTags = async (
  userId: string,
  tags: string[]
): Promise<UserData[]> => {
  try {
    const userDataRef = collection(db, 'userData');
    const q = query(
      userDataRef,
      where('userId', '==', userId),
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
