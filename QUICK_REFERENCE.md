# 📝 Référence Rapide Firebase

## 🔥 Commandes Essentielles

```bash
# Développement
npm run dev

# Déployer les règles Firestore
npx firebase deploy --only firestore:rules --project dataxxb2c

# Déployer les indexes
npx firebase deploy --only firestore:indexes --project dataxxb2c

# Ouvrir la console Firebase
open https://console.firebase.google.com/project/dataxxb2c

# Aide du script
./firebase-commands.sh help
```

## 🔑 Variables d'environnement (.env.local)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_clé
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dataxxb2c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dataxxb2c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dataxxb2c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```

## 🔐 Services d'Authentification

```typescript
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  signOut,
  resetPassword 
} from '@/lib/firebase/auth';

// Inscription
await signUpWithEmail(email, password, displayName);

// Connexion email
await signInWithEmail(email, password);

// Connexion Google
await signInWithGoogle();

// Déconnexion
await signOut();

// Reset password
await resetPassword(email);
```

## 👤 Services Utilisateurs

```typescript
import { 
  createOrUpdateUserDocument,
  getUserData,
  updateUserData,
  updateUserPreferences
} from '@/lib/firebase/users';

// Créer/mettre à jour utilisateur
await createOrUpdateUserDocument(firebaseUser, { firstName: 'John' });

// Récupérer données utilisateur
const userData = await getUserData(userId);

// Mettre à jour utilisateur
await updateUserData(userId, { lastName: 'Doe' });

// Mettre à jour préférences
await updateUserPreferences(userId, { 
  language: 'fr',
  notifications: { email: true, push: false }
});
```

## 📊 Services Données Utilisateur

```typescript
import { 
  createUserData,
  getUserDataById,
  getAllUserData,
  getUserDataByCategory,
  updateUserData,
  deleteUserData,
  searchUserDataByTags
} from '@/lib/firebase/userData';

// Créer des données
const dataId = await createUserData(
  userId,
  { field: 'value' },
  'category',
  ['tag1', 'tag2']
);

// Récupérer une donnée
const data = await getUserDataById(dataId);

// Récupérer toutes les données
const allData = await getAllUserData(userId);

// Par catégorie
const categoryData = await getUserDataByCategory(userId, 'category');

// Par tags
const taggedData = await searchUserDataByTags(userId, ['tag1']);

// Mettre à jour
await updateUserData(dataId, { newField: 'newValue' });

// Supprimer
await deleteUserData(dataId);
```

## 💳 Services Abonnements

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

## 🪝 Hooks React

### useAuth

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    firebaseUser,      // Firebase User object
    userData,          // Firestore user document
    loading,           // Loading state
    error,             // Error if any
    isAuthenticated    // Boolean
  } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return <div>Hello {userData?.displayName}</div>;
}
```

### useSubscription

```typescript
import { useSubscription } from '@/hooks/useSubscription';

function MyComponent() {
  const { 
    activeSubscription,      // Current subscription
    allSubscriptions,        // All subscriptions
    loading,                 // Loading state
    error,                   // Error if any
    hasActiveSubscription,   // Boolean
    isPro,                   // Boolean (plan === 'Pro')
    isEnterprise            // Boolean (plan === 'Enterprise')
  } = useSubscription(userId);
  
  return <div>Plan: {activeSubscription?.planName}</div>;
}
```

## 🛡️ Protection de Pages

### withAuth HOC

```typescript
import { withAuth } from '@/lib/firebase/withAuth';

function ProtectedPage({ user, userData }) {
  return <div>Protected content for {user.email}</div>;
}

export default withAuth(ProtectedPage);

// Avec options
export default withAuth(ProtectedPage, {
  redirectTo: '/custom-login',
  requireEmailVerified: true
});
```

### withSubscription HOC

```typescript
import { withSubscription } from '@/lib/firebase/withAuth';

function PremiumPage({ user, userData, subscription }) {
  return <div>Premium content</div>;
}

export default withSubscription(PremiumPage, {
  redirectTo: '/pricing',
  requirePlan: 'Pro'
});
```

## 📦 Collections Firestore

### users

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
  lastLoginAt?: Timestamp,
  language?: 'fr' | 'en',
  notifications?: { email: boolean, push: boolean },
  activeSubscriptionId?: string
}
```

### userData

```typescript
{
  id: string,
  userId: string,
  dataCollected: { [key: string]: any },
  category?: string,
  tags?: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### subscriptions

```typescript
{
  id: string,
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  stripePriceId: string,
  stripeProductId: string,
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

## 🔗 Liens Utiles

| Lien | Description |
|------|-------------|
| [Console Firebase](https://console.firebase.google.com/project/dataxxb2c) | Dashboard principal |
| [Authentication](https://console.firebase.google.com/project/dataxxb2c/authentication/users) | Gérer les utilisateurs |
| [Firestore Data](https://console.firebase.google.com/project/dataxxb2c/firestore/data) | Voir les données |
| [Firestore Rules](https://console.firebase.google.com/project/dataxxb2c/firestore/rules) | Gérer les règles |
| [Settings](https://console.firebase.google.com/project/dataxxb2c/settings/general) | Paramètres & credentials |

## 📚 Documentation

| Fichier | Contenu |
|---------|---------|
| `README_FIREBASE.md` | Guide de démarrage rapide |
| `FIREBASE_SETUP.md` | Documentation complète des services |
| `FIREBASE_COMPLETE.md` | Résumé de tout ce qui a été fait |
| `FIREBASE_CREDENTIALS.md` | Comment obtenir les credentials |
| `TROUBLESHOOTING.md` | Solutions aux problèmes courants |
| `ARCHITECTURE.md` | Architecture et flux de données |
| `QUICK_REFERENCE.md` | Cette référence rapide |

## 🐛 Debug Rapide

```typescript
// Activer les logs Firebase
import { setLogLevel } from 'firebase/app';
setLogLevel('debug');

// Vérifier l'auth dans la console
console.log(auth.currentUser);

// Vérifier une collection
import { collection, getDocs } from 'firebase/firestore';
const snapshot = await getDocs(collection(db, 'users'));
console.log(snapshot.docs.map(doc => doc.data()));
```

## ✅ Checklist de Démarrage

- [ ] `.env.local` configuré avec les vraies credentials
- [ ] Google OAuth activé dans Firebase Console
- [ ] Test inscription sur `/register`
- [ ] Test connexion sur `/login`
- [ ] Test Google OAuth
- [ ] Vérification document user dans Firestore
- [ ] Test dashboard protégé `/dashboard`
- [ ] Règles Firestore déployées

## 🎯 Prochaine Étape : Stripe

```bash
npm install stripe @stripe/stripe-js
```

Structure déjà prête :
- ✅ Types dans `types/firestore.ts`
- ✅ Services dans `lib/firebase/subscriptions.ts`
- ✅ Hook `useSubscription`
- ✅ Collection `subscriptions` dans les règles
- ✅ Indexes configurés

---

**💡 Conseil** : Gardez ce fichier ouvert pendant le développement pour une référence rapide !
