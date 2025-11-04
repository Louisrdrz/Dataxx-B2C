# Configuration Firebase & Firestore

## 📋 Vue d'ensemble

Ce projet utilise Firebase pour l'authentification et Firestore pour la base de données. La structure est prête pour intégrer Stripe pour les abonnements mensuels.

## 🔧 Configuration initiale

### 1. Récupérer les credentials Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/project/dataxxb2c/settings/general)
2. Dans les paramètres du projet, trouvez "Vos applications"
3. Si vous n'avez pas d'application web, cliquez sur "Ajouter une application" > "Web"
4. Copiez les valeurs de configuration

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.local.example .env.local
```

Remplissez les valeurs avec vos credentials Firebase.

## 🗃️ Structure de la base de données

### Collections Firestore

#### `users`
Stocke les informations de profil des utilisateurs.

```typescript
{
  uid: string,
  email: string,
  displayName?: string,
  firstName?: string,
  lastName?: string,
  company?: string,
  jobTitle?: string,
  emailVerified: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLoginAt: Timestamp,
  language: 'fr' | 'en',
  notifications: { email: boolean, push: boolean },
  activeSubscriptionId?: string
}
```

#### `subscriptions`
Gère les abonnements Stripe des utilisateurs.

```typescript
{
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripePriceId: string,
  status: 'active' | 'canceled' | 'past_due' | ...,
  planName: string,
  planInterval: 'month' | 'year',
  amount: number,
  currency: string,
  currentPeriodStart: Timestamp,
  currentPeriodEnd: Timestamp,
  cancelAtPeriodEnd: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `userData`
Stocke les données collectées par les utilisateurs pendant l'utilisation de la plateforme.

```typescript
{
  userId: string,
  dataCollected: { [key: string]: any },
  category?: string,
  tags?: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `auditLogs`
Logs d'audit pour tracer les actions importantes.

#### `userSessions`
Tracking des sessions utilisateur (optionnel).

## 🔐 Authentification

### Méthodes supportées

- **Email/Mot de passe** : Configuré ✅
- **Google OAuth** : Configuré ✅

### Utilisation dans les composants

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { firebaseUser, userData, loading, isAuthenticated } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  if (!isAuthenticated) return <div>Non connecté</div>;
  
  return <div>Bienvenue {userData?.displayName}</div>;
}
```

### Fonctions d'authentification disponibles

```typescript
// Inscription
import { signUpWithEmail } from '@/lib/firebase/auth';
await signUpWithEmail(email, password, displayName);

// Connexion email
import { signInWithEmail } from '@/lib/firebase/auth';
await signInWithEmail(email, password);

// Connexion Google
import { signInWithGoogle } from '@/lib/firebase/auth';
await signInWithGoogle();

// Déconnexion
import { signOut } from '@/lib/firebase/auth';
await signOut();

// Reset password
import { resetPassword } from '@/lib/firebase/auth';
await resetPassword(email);
```

## 📊 Gestion des données utilisateur

### Créer des données

```typescript
import { createUserData } from '@/lib/firebase/userData';

const dataId = await createUserData(
  userId,
  { 
    // Vos données personnalisées
    field1: 'value1',
    field2: 'value2'
  },
  'categoryName', // optionnel
  ['tag1', 'tag2'] // optionnel
);
```

### Récupérer des données

```typescript
import { 
  getAllUserData,
  getUserDataById,
  getUserDataByCategory,
  searchUserDataByTags
} from '@/lib/firebase/userData';

// Toutes les données d'un utilisateur
const allData = await getAllUserData(userId);

// Une donnée spécifique
const data = await getUserDataById(dataId);

// Par catégorie
const categoryData = await getUserDataByCategory(userId, 'categoryName');

// Par tags
const taggedData = await searchUserDataByTags(userId, ['tag1', 'tag2']);
```

### Mettre à jour des données

```typescript
import { updateUserData } from '@/lib/firebase/userData';

await updateUserData(dataId, {
  dataCollected: { /* nouvelles données */ },
  category: 'newCategory',
  tags: ['newTag']
});
```

### Supprimer des données

```typescript
import { deleteUserData } from '@/lib/firebase/userData';

await deleteUserData(dataId);
```

## 💳 Gestion des abonnements

### Hook useSubscription

```typescript
import { useSubscription } from '@/hooks/useSubscription';

function MyComponent() {
  const { 
    activeSubscription, 
    allSubscriptions,
    hasActiveSubscription,
    isPro,
    isEnterprise,
    loading 
  } = useSubscription(userId);
  
  if (loading) return <div>Chargement...</div>;
  
  if (!hasActiveSubscription) {
    return <div>Aucun abonnement actif</div>;
  }
  
  return <div>Plan: {activeSubscription.planName}</div>;
}
```

### Fonctions de gestion des abonnements

```typescript
import { 
  getActiveSubscription,
  getUserSubscriptions,
  hasActiveSubscription 
} from '@/lib/firebase/subscriptions';

// Abonnement actif
const subscription = await getActiveSubscription(userId);

// Tous les abonnements
const subscriptions = await getUserSubscriptions(userId);

// Vérifier si actif
const isActive = await hasActiveSubscription(userId);
```

## 🔒 Règles de sécurité

Les règles Firestore sont configurées pour :

- ✅ Chaque utilisateur peut uniquement lire/modifier ses propres données
- ✅ Les abonnements sont en lecture seule (gérés par les webhooks Stripe)
- ✅ Les données utilisateur sont protégées par userId
- ✅ Les logs d'audit sont en lecture seule
- ✅ Protection contre les modifications non autorisées

## 📈 Indexes

Les indexes suivants sont configurés pour optimiser les requêtes :

- Users : email + createdAt
- Subscriptions : userId + status + currentPeriodEnd
- UserData : userId + createdAt, userId + category + updatedAt
- AuditLogs : userId + timestamp, resourceType + action + timestamp
- UserSessions : userId + startedAt

## 🚀 Prochaines étapes

### Intégration Stripe

1. Installer Stripe SDK :
```bash
npm install stripe @stripe/stripe-js
```

2. Créer les webhooks Stripe pour gérer les événements d'abonnement

3. Implémenter les Cloud Functions pour :
   - Créer/mettre à jour les documents `subscriptions`
   - Synchroniser avec Stripe
   - Gérer les webhooks

### Exemple de structure pour Stripe :

```typescript
// pages/api/stripe/webhook.ts
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Gérer les événements
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      // Mettre à jour Firestore
      break;
    case 'customer.subscription.deleted':
      // Annuler l'abonnement
      break;
  }
  
  res.json({ received: true });
}
```

## 📝 Commandes Firebase utiles

```bash
# Déployer les règles
npx firebase deploy --only firestore:rules --project dataxxb2c

# Déployer les indexes
npx firebase deploy --only firestore:indexes --project dataxxb2c

# Déployer tout
npx firebase deploy --project dataxxb2c

# Lancer l'émulateur local
npx firebase emulators:start --project dataxxb2c
```

## 🐛 Debugging

### Voir les logs Firestore
```bash
npx firebase firestore:indexes --project dataxxb2c
```

### Tester les règles de sécurité
Utilisez le [Simulateur de règles](https://console.firebase.google.com/project/dataxxb2c/firestore/rules) dans la console Firebase.

## 📚 Ressources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Stripe Integration](https://stripe.com/docs/billing/subscriptions/overview)
