// Types pour Firestore
import { Timestamp } from 'firebase/firestore';

// Type pour les rôles dans les workspaces
export type WorkspaceRole = 'admin' | 'member';

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
  
  // Informations sportives (optionnelles - à remplir dans le profil)
  sport?: string; // Sport pratiqué
  sportDuration?: string; // Depuis combien de temps
  achievements?: string; // Palmarès
  links?: string; // Liens utiles (réseaux sociaux, site web, etc.)
  nextEvent?: string; // Prochaine échéance sportive
  sponsorType?: string; // Type de sponsors recherchés
  targetAmount?: string; // Montant cible recherché
  
  // Workspace par défaut (le dernier workspace utilisé)
  defaultWorkspaceId?: string;
}

// Type pour les workspaces
export interface Workspace {
  id: string; // ID unique du workspace
  name: string; // Nom du workspace (ex: "TFC Masculin", "Mbappé")
  description?: string; // Description optionnelle
  
  // Propriétaire initial (le créateur)
  ownerId: string; // UID du créateur
  
  // Type de workspace
  type?: 'club' | 'athlete' | 'personal' | 'other';
  
  // Métadonnées
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Paramètres du workspace
  settings?: {
    allowMemberInvite?: boolean; // Les membres peuvent-ils inviter d'autres membres
    visibility?: 'private' | 'public'; // Visibilité du workspace
  };
  
  // Statistiques
  memberCount?: number; // Nombre de membres
  
  // Image du workspace
  logoURL?: string;
  
  // Données enrichies extraites du deck commercial
  enrichedData?: {
    // Palmarès (titres, récompenses, victoires)
    achievements?: string[];
    
    // Sponsors et partenaires
    sponsors?: Array<{
      name: string;
      type?: 'title' | 'official' | 'technical' | 'media' | 'other';
      logo?: string;
    }>;
    
    // Statistiques clés
    statistics?: {
      [key: string]: string | number; // Ex: "founded": 1970, "members": 50000
    };
    
    // Historique important
    history?: string[];
    
    // Valeurs et mission
    values?: string[];
    mission?: string;
    
    // Informations athlète spécifiques
    athleteInfo?: {
      sport?: string;
      position?: string;
      birthDate?: string;
      nationality?: string;
      height?: string;
      weight?: string;
      currentTeam?: string;
    };
    
    // Informations club spécifiques
    clubInfo?: {
      sport?: string;
      founded?: number;
      stadium?: string;
      capacity?: number;
      league?: string;
      colors?: string[];
    };
    
    // Autres informations extraites
    customData?: {
      [key: string]: any;
    };
  };
  
  // Document uploadé
  deckDocument?: {
    url: string; // URL du fichier dans Firebase Storage
    fileName: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: Timestamp;
    uploadedBy: string; // UID de l'utilisateur qui a uploadé
  };
}

// Type pour les membres d'un workspace
export interface WorkspaceMember {
  id: string; // Format: {workspaceId}_{userId}
  workspaceId: string; // Référence au workspace
  userId: string; // Référence à l'utilisateur
  
  // Rôle dans le workspace
  role: WorkspaceRole; // 'admin' ou 'member'
  
  // Métadonnées
  joinedAt: Timestamp; // Date d'adhésion au workspace
  invitedBy?: string; // UID de l'utilisateur qui a invité
  
  // Informations utilisateur dénormalisées (pour performance)
  userEmail?: string;
  userDisplayName?: string;
  userPhotoURL?: string;
}

// Type pour les invitations à un workspace
export interface WorkspaceInvitation {
  id: string; // ID unique de l'invitation
  workspaceId: string; // Référence au workspace
  
  // Destinataire
  email: string; // Email de la personne invitée
  
  // Inviteur
  invitedBy: string; // UID de l'utilisateur qui a invité
  invitedByName?: string; // Nom de l'inviteur (dénormalisé)
  
  // Rôle proposé
  role: WorkspaceRole; // 'admin' ou 'member'
  
  // Statut de l'invitation
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  
  // Dates
  createdAt: Timestamp;
  expiresAt: Timestamp; // L'invitation expire après 7 jours
  respondedAt?: Timestamp; // Date de réponse (accepté/refusé)
  
  // Informations du workspace (dénormalisées)
  workspaceName?: string;
  workspaceLogoURL?: string;
}

// Type pour les abonnements Stripe (modifié pour workspaces)
export interface Subscription {
  id: string; // ID de la souscription
  workspaceId: string; // Référence au workspace (modifié: anciennement userId)
  managedBy: string; // UID de l'admin qui gère la facturation
  
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
  
  // Limites du plan
  maxMembers?: number; // Nombre maximum de membres dans le workspace
  
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
// Modifié: maintenant lié au workspace au lieu de l'utilisateur individuel
export interface UserData {
  id: string;
  workspaceId: string; // Référence au workspace (modifié: anciennement userId)
  createdBy: string; // UID de l'utilisateur qui a créé cette donnée
  
  // Données métier - adaptez selon vos besoins
  dataCollected: {
    [key: string]: any; // Structure flexible pour stocker diverses données
  };
  
  // Métadonnées
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy?: string; // UID de l'utilisateur qui a fait la dernière modification
  
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

// =============================================
// TYPES POUR L'ABONNEMENT UTILISATEUR
// =============================================

// Type pour les plans d'abonnement
export type SubscriptionPlanType = 'one_shot' | 'basic' | 'pro';

// Type pour l'abonnement utilisateur (niveau utilisateur, pas workspace)
export interface UserSubscription {
  id: string;
  userId: string; // UID de l'utilisateur qui a l'abonnement
  
  // Type de plan
  planType: SubscriptionPlanType;
  planName: string; // "One Shot", "Basic", "Pro"
  
  // Informations Stripe
  stripeCustomerId: string;
  stripeSubscriptionId?: string; // Null pour one_shot (paiement unique)
  stripePriceId: string;
  stripeProductId?: string;
  stripePaymentIntentId?: string; // Pour les paiements one_shot
  
  // Statut de l'abonnement
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'one_time_used' | 'one_time_available';
  
  // Limites du plan
  searchesPerMonth: number; // Nombre de recherches autorisées par mois
  searchesUsedThisMonth: number; // Nombre de recherches utilisées ce mois
  searchesResetDate?: Timestamp; // Date de remise à zéro du compteur
  
  // Prix
  amount: number; // Montant en centimes
  currency: string; // "eur"
  isRecurring: boolean; // true pour basic/pro, false pour one_shot
  
  // Dates importantes (pour abonnements récurrents)
  currentPeriodStart?: Timestamp;
  currentPeriodEnd?: Timestamp;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Timestamp;
  
  // Métadonnées
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Méthode de paiement
  paymentMethodLast4?: string;
  paymentMethodBrand?: string;
}

// Type pour l'historique des recherches de sponsors
export interface SponsorSearchUsage {
  id: string;
  userId: string;
  workspaceId: string;
  subscriptionId: string; // Référence à l'abonnement utilisé
  searchId: string; // Référence à la recherche SponsorSearch
  
  // Détails
  eventName: string;
  recommendationsCount: number;
  
  // Date
  usedAt: Timestamp;
  
  // Mois de facturation (format: "2024-01")
  billingMonth: string;
}

// Type pour une recommandation de sponsor
export interface SponsorRecommendation {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  matchScore: number; // 0-100
  matchReasons: string[];
  estimatedBudget: string;
  contactStrategy: string;
  website?: string;
  linkedIn?: string;
  keyContacts?: string[];
  pastSponsorships?: string[];
  valuesAlignment: string[];
  potentialActivations: string[];
  priority: 'high' | 'medium' | 'low';
  category: 'title' | 'official' | 'technical' | 'media' | 'local' | 'startup';
  
  // Suivi du contact
  contactStatus?: 'not_contacted' | 'contacted' | 'in_discussion' | 'accepted' | 'rejected';
  contactedAt?: Timestamp;
  notes?: string;
}

// Type pour les insights globaux
export interface SponsorSearchInsights {
  marketAnalysis: string;
  bestApproachTiming: string;
  negotiationTips: string[];
  redFlags: string[];
}

// Type pour une recherche de sponsors
export interface SponsorSearch {
  id: string;
  workspaceId: string;
  createdBy: string; // UID de l'utilisateur
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Détails de l'événement
  eventName: string;
  eventDate?: string;
  eventDescription: string;
  
  // Critères de recherche
  targetBudget: string;
  sponsorTypes: string[];
  industries?: string[];
  values?: string[];
  audienceSize?: string;
  mediaExposure?: string;
  specificNeeds?: string;
  
  // Résultats
  recommendations: SponsorRecommendation[];
  globalInsights?: SponsorSearchInsights;
  
  // Statistiques
  totalRecommendations: number;
  highPriorityCount: number;
  averageMatchScore: number;
  
  // Statut
  status: 'completed' | 'in_progress' | 'archived';
}
