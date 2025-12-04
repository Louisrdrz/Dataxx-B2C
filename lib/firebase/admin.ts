// Firebase Admin SDK pour les API routes côté serveur
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | undefined;
let adminDbInstance: Firestore | undefined;
let adminAuthInstance: Auth | undefined;

// Initialiser Firebase Admin
function initializeAdminApp(): App | undefined {
  if (adminApp) {
    return adminApp;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  try {
    // Récupérer les credentials depuis les variables d'environnement
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!privateKey || !clientEmail || !projectId) {
      console.warn(
        'Firebase Admin credentials manquantes. Certaines fonctionnalités peuvent ne pas fonctionner.'
      );
      console.warn('Variables requises: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, NEXT_PUBLIC_FIREBASE_PROJECT_ID');
      return undefined;
    }

    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log('✅ Firebase Admin initialisé avec succès');
    
    return adminApp;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Firebase Admin:', error);
    return undefined;
  }
}

// Fonction getter pour adminDb
export function getAdminDb(): Firestore {
  if (!adminDbInstance) {
    const app = initializeAdminApp();
    if (!app) {
      throw new Error(
        'Firebase Admin n\'est pas initialisé. Vérifiez vos variables d\'environnement: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, NEXT_PUBLIC_FIREBASE_PROJECT_ID'
      );
    }
    adminDbInstance = getFirestore(app);
    adminDbInstance.settings({ ignoreUndefinedProperties: true });
  }
  return adminDbInstance;
}

// Fonction getter pour adminAuth
export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    const app = initializeAdminApp();
    if (!app) {
      throw new Error(
        'Firebase Admin n\'est pas initialisé. Vérifiez vos variables d\'environnement: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, NEXT_PUBLIC_FIREBASE_PROJECT_ID'
      );
    }
    adminAuthInstance = getAuth(app);
  }
  return adminAuthInstance;
}

// Exports pour compatibilité avec le code existant
// Utiliser des getters pour éviter l'initialisation immédiate
export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop) {
    return (getAdminDb() as any)[prop];
  }
}) as Firestore;

export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getAdminAuth() as any)[prop];
  }
}) as Auth;
