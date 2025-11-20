// Firebase Admin SDK pour les API routes côté serveur
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

// Initialiser Firebase Admin
if (!getApps().length) {
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
    } else {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      console.log('✅ Firebase Admin initialisé avec succès');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Firebase Admin:', error);
  }
} else {
  adminApp = getApps()[0];
}

// Exports
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

// Configuration Firestore
if (adminDb) {
  adminDb.settings({ ignoreUndefinedProperties: true });
}

