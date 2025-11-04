// Types pour Firestore
import { Timestamp } from 'firebase/firestore';

// Type pour les informations utilisateur
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  
  // Informations d'inscription
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  
  // Métadonnées
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  
  // Préférences utilisateur
  language?: 'fr' | 'en';
  notifications?: {
    email: boolean;
    push: boolean;
  };
  
  // Lien vers l'abonnement actif
  activeSubscriptionId?: string;
}

// Type pour les abonnements Stripe
export interface Subscription {
  id: string; // ID de la souscription
  userId: string; // Référence à l'utilisateur
  
  // Informations Stripe
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeProductId: string;
  
  // Statut de l'abonnement
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'incomplete' | 'incomplete_expired';
  
  // Plan
  planName: string; // Ex: "Basic", "Pro", "Enterprise"
  planInterval: 'month' | 'year';
  amount: number; // Montant en centimes
  currency: string; // Ex: "eur"
  
  // Dates importantes
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Timestamp;
  trialStart?: Timestamp;
  trialEnd?: Timestamp;
  
  // Métadonnées
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Méthode de paiement
  paymentMethodLast4?: string;
  paymentMethodBrand?: string;
}

// Type pour les données utilisateur (informations collectées au fil de l'utilisation)
export interface UserData {
  id: string;
  userId: string; // Référence à l'utilisateur
  
  // Données métier - adaptez selon vos besoins
  dataCollected: {
    [key: string]: any; // Structure flexible pour stocker diverses données
  };
  
  // Métadonnées
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Catégorisation des données (optionnel)
  category?: string;
  tags?: string[];
}

// Type pour les événements d'audit
export interface AuditLog {
  id: string;
  userId: string;
  action: string; // Ex: "create", "update", "delete", "login", "logout"
  resourceType: string; // Ex: "user", "subscription", "userData"
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
}

// Type pour les sessions utilisateur (optionnel, pour tracking)
export interface UserSession {
  id: string;
  userId: string;
  startedAt: Timestamp;
  endedAt?: Timestamp;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
}

// Type pour les paramètres de l'application
export interface AppSettings {
  id: string;
  key: string;
  value: any;
  description?: string;
  updatedAt: Timestamp;
  updatedBy: string; // userId de l'admin qui a fait la modification
}
