# Structure des Données Firestore

## 📊 Collections Firestore

Cette documentation décrit la structure complète des collections Firestore utilisées dans l'application Dataxx B2C.

---

## 1. Collection `users`

**Path**: `/users/{userId}`

Stocke les informations de base de chaque utilisateur.

### Schéma

```typescript
interface User {
  uid: string;                      // ID unique de l'utilisateur (Firebase Auth UID)
  email: string;                    // Email de l'utilisateur
  displayName?: string;             // Nom d'affichage
  photoURL?: string;                // URL de la photo de profil
  phoneNumber?: string;             // Numéro de téléphone
  emailVerified: boolean;           // Email vérifié ou non
  
  // Informations personnelles
  firstName?: string;               // Prénom
  lastName?: string;                // Nom
  company?: string;                 // Entreprise
  jobTitle?: string;                // Poste
  
  // Métadonnées
  createdAt: Timestamp;             // Date de création du compte
  updatedAt: Timestamp;             // Date de dernière mise à jour
  lastLoginAt?: Timestamp;          // Date de dernière connexion
  
  // Préférences
  language?: 'fr' | 'en';          // Langue préférée
  notifications?: {
    email: boolean;                 // Notifications par email activées
    push: boolean;                  // Notifications push activées
  };
  
  // Relations
  activeSubscriptionId?: string;    // ID de l'abonnement actif
}
```

### Exemple

```json
{
  "uid": "abc123xyz789",
  "email": "user@example.com",
  "displayName": "Jean Dupont",
  "emailVerified": true,
  "firstName": "Jean",
  "lastName": "Dupont",
  "company": "Dataxx",
  "jobTitle": "Développeur",
  "createdAt": "2025-11-06T10:00:00Z",
  "updatedAt": "2025-11-06T14:30:00Z",
  "lastLoginAt": "2025-11-06T14:30:00Z",
  "language": "fr",
  "notifications": {
    "email": true,
    "push": true
  }
}
```

---

## 2. Sous-collection `users/{userId}/profile`

**Path**: `/users/{userId}/profile/{profileId}`

Stocke des informations de profil détaillées (extensions futures).

### Schéma

```typescript
interface UserProfile {
  userId: string;                   // Référence à l'utilisateur parent
  bio?: string;                     // Biographie
  website?: string;                 // Site web
  location?: string;                // Localisation
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark';
    timezone?: string;
    dateFormat?: string;
  };
  updatedAt: Timestamp;
}
```

---

## 3. Collection `subscriptions`

**Path**: `/subscriptions/{subscriptionId}`

Gère les abonnements Stripe des utilisateurs.

### Schéma

```typescript
interface Subscription {
  id: string;                       // ID de la souscription
  userId: string;                   // Référence à l'utilisateur
  
  // Informations Stripe
  stripeCustomerId: string;         // ID client Stripe
  stripeSubscriptionId: string;     // ID abonnement Stripe
  stripePriceId: string;            // ID prix Stripe
  stripeProductId: string;          // ID produit Stripe
  
  // Statut de l'abonnement
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'incomplete' | 'incomplete_expired';
  
  // Plan
  planName: string;                 // Ex: "Basic", "Pro", "Enterprise"
  planInterval: 'month' | 'year';   // Fréquence de facturation
  amount: number;                   // Montant en centimes
  currency: string;                 // Ex: "eur"
  
  // Dates importantes
  currentPeriodStart: Timestamp;    // Début de la période actuelle
  currentPeriodEnd: Timestamp;      // Fin de la période actuelle
  cancelAtPeriodEnd: boolean;       // Annulation à la fin de la période
  canceledAt?: Timestamp;           // Date d'annulation
  trialStart?: Timestamp;           // Début de la période d'essai
  trialEnd?: Timestamp;             // Fin de la période d'essai
  
  // Métadonnées
  createdAt: Timestamp;             // Date de création
  updatedAt: Timestamp;             // Date de mise à jour
  
  // Méthode de paiement
  paymentMethodLast4?: string;      // 4 derniers chiffres de la carte
  paymentMethodBrand?: string;      // Marque de la carte (Visa, Mastercard, etc.)
}
```

### Exemple

```json
{
  "id": "sub_abc123",
  "userId": "abc123xyz789",
  "stripeCustomerId": "cus_abc123",
  "stripeSubscriptionId": "sub_abc123",
  "stripePriceId": "price_abc123",
  "stripeProductId": "prod_abc123",
  "status": "active",
  "planName": "Pro",
  "planInterval": "month",
  "amount": 2999,
  "currency": "eur",
  "currentPeriodStart": "2025-11-01T00:00:00Z",
  "currentPeriodEnd": "2025-12-01T00:00:00Z",
  "cancelAtPeriodEnd": false,
  "createdAt": "2025-11-01T00:00:00Z",
  "updatedAt": "2025-11-06T14:30:00Z",
  "paymentMethodLast4": "4242",
  "paymentMethodBrand": "Visa"
}
```

---

## 4. Collection `userData`

**Path**: `/userData/{dataId}`

Stocke les données collectées par les utilisateurs (personnalisable selon les besoins).

### Schéma

```typescript
interface UserData {
  id: string;                       // ID unique du document
  userId: string;                   // Référence à l'utilisateur
  
  // Données métier (structure flexible)
  dataCollected: {
    [key: string]: any;             // Structure flexible pour diverses données
  };
  
  // Métadonnées
  createdAt: Timestamp;             // Date de création
  updatedAt: Timestamp;             // Date de mise à jour
  
  // Catégorisation (optionnel)
  category?: string;                // Catégorie de données
  tags?: string[];                  // Tags pour classification
}
```

### Exemple

```json
{
  "id": "data_abc123",
  "userId": "abc123xyz789",
  "dataCollected": {
    "type": "contact",
    "name": "Marie Martin",
    "email": "marie@example.com",
    "phone": "+33612345678"
  },
  "category": "leads",
  "tags": ["prospect", "urgent"],
  "createdAt": "2025-11-06T10:00:00Z",
  "updatedAt": "2025-11-06T14:30:00Z"
}
```

---

## 5. Collection `auditLogs`

**Path**: `/auditLogs/{logId}`

Enregistre toutes les actions importantes pour l'audit et la traçabilité.

### Schéma

```typescript
interface AuditLog {
  id: string;                       // ID unique du log
  userId: string;                   // Utilisateur qui a effectué l'action
  action: string;                   // Type d'action (create, update, delete, login, logout, etc.)
  resourceType: string;             // Type de ressource (user, subscription, userData, etc.)
  resourceId?: string;              // ID de la ressource concernée
  details?: Record<string, any>;    // Détails supplémentaires
  ipAddress?: string;               // Adresse IP
  userAgent?: string;               // User agent
  timestamp: Timestamp;             // Date et heure de l'action
}
```

### Exemple

```json
{
  "id": "log_abc123",
  "userId": "abc123xyz789",
  "action": "update",
  "resourceType": "user",
  "resourceId": "abc123xyz789",
  "details": {
    "fields": ["firstName", "lastName"],
    "previousValues": {
      "firstName": "Jean",
      "lastName": "Dupont"
    },
    "newValues": {
      "firstName": "Jean-Pierre",
      "lastName": "Dupont"
    }
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2025-11-06T14:30:00Z"
}
```

---

## 6. Collection `userSessions`

**Path**: `/userSessions/{sessionId}`

Suit les sessions utilisateur pour le monitoring et la sécurité.

### Schéma

```typescript
interface UserSession {
  id: string;                       // ID unique de la session
  userId: string;                   // Référence à l'utilisateur
  startedAt: Timestamp;             // Date de début de session
  endedAt?: Timestamp;              // Date de fin de session
  ipAddress?: string;               // Adresse IP
  userAgent?: string;               // User agent
  deviceType?: 'mobile' | 'tablet' | 'desktop'; // Type d'appareil
}
```

### Exemple

```json
{
  "id": "session_abc123",
  "userId": "abc123xyz789",
  "startedAt": "2025-11-06T14:00:00Z",
  "endedAt": "2025-11-06T16:30:00Z",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "deviceType": "desktop"
}
```

---

## 7. Collection `appSettings`

**Path**: `/appSettings/{settingId}`

Stocke les paramètres globaux de l'application (lecture seule pour les utilisateurs).

### Schéma

```typescript
interface AppSettings {
  id: string;                       // ID unique du paramètre
  key: string;                      // Clé du paramètre
  value: any;                       // Valeur du paramètre
  description?: string;             // Description du paramètre
  updatedAt: Timestamp;             // Date de mise à jour
  updatedBy: string;                // ID de l'admin qui a fait la modification
}
```

### Exemple

```json
{
  "id": "setting_abc123",
  "key": "maintenance_mode",
  "value": false,
  "description": "Mode maintenance activé ou non",
  "updatedAt": "2025-11-06T10:00:00Z",
  "updatedBy": "admin_xyz789"
}
```

---

## 📝 Règles de Nommage

### Collections
- Utiliser le camelCase : `userData`, `auditLogs`, `userSessions`
- Éviter les caractères spéciaux
- Utiliser des noms au pluriel pour les collections

### Documents
- Utiliser des IDs auto-générés par Firestore quand possible
- Pour les IDs personnalisés, utiliser un format cohérent : `prefix_randomId`
- Éviter les caractères spéciaux dans les IDs

### Champs
- Utiliser le camelCase : `firstName`, `createdAt`
- Utiliser des noms descriptifs et en anglais
- Préfixer les timestamps avec le type d'action : `createdAt`, `updatedAt`, `deletedAt`

---

## 🔍 Index Requis

Tous les index nécessaires sont définis dans `firestore.indexes.json` et ont été déployés.

### Requêtes Optimisées

```typescript
// Obtenir tous les utilisateurs créés récemment
db.collection('users')
  .orderBy('createdAt', 'desc')
  .limit(10);

// Obtenir l'abonnement actif d'un utilisateur
db.collection('subscriptions')
  .where('userId', '==', userId)
  .where('status', '==', 'active')
  .orderBy('currentPeriodEnd', 'desc')
  .limit(1);

// Obtenir les données utilisateur par catégorie
db.collection('userData')
  .where('userId', '==', userId)
  .where('category', '==', 'leads')
  .orderBy('updatedAt', 'desc');

// Obtenir les logs d'audit d'un utilisateur
db.collection('auditLogs')
  .where('userId', '==', userId)
  .orderBy('timestamp', 'desc')
  .limit(50);
```

---

## 🚀 Bonnes Pratiques

1. **Toujours utiliser des Timestamps** pour les dates (créatedAt, updatedAt)
2. **Éviter les modifications en place** : utiliser `serverTimestamp()` pour les dates
3. **Valider les données côté client ET serveur** (règles Firestore)
4. **Utiliser des transactions** pour les modifications critiques
5. **Limiter le nombre de documents retournés** avec `.limit()`
6. **Paginer les résultats** pour les grandes collections
7. **Indexer les champs fréquemment utilisés** dans les requêtes
8. **Logger toutes les actions importantes** dans auditLogs

---

**Dernière mise à jour** : 6 novembre 2025  
**Version** : 1.0.0  
**Projet** : dataxxb2c-1bc3f
