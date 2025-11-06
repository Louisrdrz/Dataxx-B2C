// Services d'authentification Firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

// Provider Google avec scopes pour calendrier et contacts
const googleProvider = new GoogleAuthProvider();

// Ajouter les scopes pour accéder aux calendriers et contacts
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Forcer la demande de consentement à chaque connexion pour afficher les permissions
googleProvider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline'
});

/**
 * Inscription avec email et mot de passe
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Mettre à jour le profil si un nom est fourni
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Envoyer l'email de vérification (en mode silencieux, ne pas bloquer l'inscription)
    if (userCredential.user) {
      try {
        await sendEmailVerification(userCredential.user);
      } catch (emailError) {
        console.warn('Impossible d\'envoyer l\'email de vérification:', emailError);
        // Ne pas bloquer l'inscription si l'envoi d'email échoue
      }
    }
    
    return userCredential;
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

/**
 * Connexion avec email et mot de passe
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Connexion avec Google (avec accès calendrier et contacts)
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Récupérer le token d'accès Google
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      const accessToken = credential.accessToken;
      
      // Stocker le token pour une utilisation ultérieure
      if (accessToken) {
        localStorage.setItem('google_access_token', accessToken);
        console.log('Token d\'accès Google stocké');
      }
    }
    
    return result;
  } catch (error: any) {
    console.error('Erreur lors de la connexion Google:', error);
    throw error;
  }
};

/**
 * Récupérer le token d'accès Google stocké
 */
export const getGoogleAccessToken = (): string | null => {
  return localStorage.getItem('google_access_token');
};

/**
 * Déconnexion
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};

/**
 * Réinitialisation du mot de passe
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    throw error;
  }
};

/**
 * Renvoyer l'email de vérification
 */
export const resendVerificationEmail = async (user: FirebaseUser): Promise<void> => {
  try {
    await sendEmailVerification(user);
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    throw error;
  }
};

/**
 * Mettre à jour le profil utilisateur
 */
export const updateUserProfile = async (
  user: FirebaseUser,
  profile: { displayName?: string; photoURL?: string }
): Promise<void> => {
  try {
    await updateProfile(user, profile);
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

/**
 * Obtenir l'utilisateur actuel
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Écouter les changements d'état d'authentification
 */
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback);
};
