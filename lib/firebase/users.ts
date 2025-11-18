// Services Firestore pour la gestion des utilisateurs
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { User } from '@/types/firestore';
import { User as FirebaseUser } from 'firebase/auth';

/**
 * Créer ou mettre à jour le document utilisateur dans Firestore
 */
export const createOrUpdateUserDocument = async (
  firebaseUser: FirebaseUser,
  additionalData?: Partial<User>
): Promise<void> => {
  if (!firebaseUser) return;

  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  // Si l'utilisateur existe déjà, mettre à jour lastLoginAt
  if (userSnap.exists()) {
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  // Créer un nouveau document utilisateur
  const userData: any = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    emailVerified: firebaseUser.emailVerified,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    lastLoginAt: Timestamp.now(),
    language: 'fr',
    notifications: {
      email: true,
      push: true,
    },
  };

  // Ajouter les champs optionnels seulement s'ils existent
  if (firebaseUser.displayName) {
    userData.displayName = firebaseUser.displayName;
  }
  if (firebaseUser.photoURL) {
    userData.photoURL = firebaseUser.photoURL;
  }
  if (firebaseUser.phoneNumber) {
    userData.phoneNumber = firebaseUser.phoneNumber;
  }

  // Fusionner avec les données additionnelles (en filtrant les undefined)
  if (additionalData) {
    Object.keys(additionalData).forEach(key => {
      const value = additionalData[key as keyof typeof additionalData];
      if (value !== undefined) {
        userData[key] = value;
      }
    });
  }

  await setDoc(userRef, userData);
};

/**
 * Récupérer les données d'un utilisateur
 */
export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    throw error;
  }
};

/**
 * Mettre à jour les données d'un utilisateur
 */
export const updateUserData = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données utilisateur:', error);
    throw error;
  }
};

/**
 * Mettre à jour les préférences utilisateur
 */
export const updateUserPreferences = async (
  userId: string,
  preferences: {
    language?: 'fr' | 'en';
    notifications?: {
      email: boolean;
      push: boolean;
    };
  }
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...preferences,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des préférences:', error);
    throw error;
  }
};

/**
 * Définir le workspace par défaut d'un utilisateur
 */
export const setDefaultWorkspace = async (
  userId: string,
  workspaceId: string | null
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };
    
    if (workspaceId === null) {
      // Supprimer le workspace par défaut
      updateData.defaultWorkspaceId = null;
    } else {
      updateData.defaultWorkspaceId = workspaceId;
    }
    
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Erreur lors de la définition du workspace par défaut:', error);
    throw error;
  }
};
