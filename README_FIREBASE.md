# 🔥 Firebase & Firestore - Configuration Complète

## 📦 Ce qui a été installé et configuré

Votre projet Dataxx dispose maintenant d'une infrastructure Firebase complète avec :

### ✅ Authentification
- Email/Mot de passe ✓
- Google OAuth ✓
- Réinitialisation de mot de passe ✓
- Vérification d'email ✓

### ✅ Base de données Firestore
Collections prêtes à l'emploi :
- **`users`** - Profils utilisateurs avec métadonnées
- **`userData`** - Données collectées pendant l'utilisation
- **`subscriptions`** - Abonnements Stripe (prêt pour l'intégration)
- **`auditLogs`** - Historique des actions
- **`userSessions`** - Tracking des sessions
- **`appSettings`** - Configuration de l'app

### ✅ Sécurité
- Règles Firestore déployées
- Isolation des données par utilisateur
- Protection contre les modifications non autorisées
- Indexes optimisés déployés

---

## 🚀 Démarrage rapide

### 1️⃣ Obtenir vos credentials Firebase

Allez sur : https://console.firebase.google.com/project/dataxxb2c/settings/general

1. Dans "Vos applications", cliquez sur l'icône Web (`</>`)
2. Copiez la configuration Firebase
3. Remplissez les valeurs dans `.env.local`

**📖 Guide détaillé : `FIREBASE_CREDENTIALS.md`**

### 2️⃣ Configurer .env.local

Modifiez le fichier `.env.local` et remplacez les valeurs :

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=votre_vraie_clé_ici
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dataxxb2c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dataxxb2c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dataxxb2c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```

### 3️⃣ Activer Google OAuth dans Firebase

1. Allez sur https://console.firebase.google.com/project/dataxxb2c/authentication/providers
2. Cliquez sur "Google"
3. Activez le fournisseur
4. Enregistrez

### 4️⃣ Lancer le projet

```bash
npm run dev
```

Ouvrez http://localhost:3000

---

## 📁 Structure des fichiers créés

```
Dataxx-B2C/
├── lib/firebase/
│   ├── config.ts              # Configuration Firebase
│   ├── auth.ts                # Services d'authentification
│   ├── users.ts               # Gestion des utilisateurs
│   ├── userData.ts            # Gestion des données utilisateur
│   ├── subscriptions.ts       # Gestion des abonnements
│   └── withAuth.tsx           # HOC pour protéger les pages
│
├── hooks/
│   ├── useAuth.ts             # Hook authentification
│   └── useSubscription.ts     # Hook abonnements
│
├── types/
│   └── firestore.ts           # Types TypeScript
│
├── pages/
│   ├── login.tsx              # Page de connexion (intégrée)
│   ├── register.tsx           # Page d'inscription (intégrée)
│   └── dashboard.tsx          # Dashboard protégé (exemple)
│
├── firestore.rules            # Règles de sécurité (déployées)
├── firestore.indexes.json     # Indexes (déployés)
├── firebase.json              # Configuration Firebase
├── .firebaserc                # Projet Firebase
├── firebase-commands.sh       # Script d'aide CLI
│
├── FIREBASE_COMPLETE.md       # 🎉 Résumé complet
├── FIREBASE_SETUP.md          # 📚 Guide d'utilisation
├── FIREBASE_CREDENTIALS.md    # 🔑 Comment obtenir les credentials
└── .env.local                 # Variables d'environnement
```

---

## 🧪 Tester l'installation

### Test 1 : Inscription
1. Allez sur http://localhost:3000/register
2. Remplissez le formulaire
3. Cliquez sur "Créer mon compte"
4. ✅ Vérifiez dans [Firebase Console](https://console.firebase.google.com/project/dataxxb2c/authentication/users)

### Test 2 : Connexion Google
1. Sur /login, cliquez sur "Se connecter avec Google"
2. Choisissez votre compte Google
3. ✅ Vous devriez être redirigé vers /

### Test 3 : Dashboard
1. Connectez-vous
2. Allez sur http://localhost:3000/dashboard
3. ✅ Vous devriez voir vos informations

### Test 4 : Firestore
1. Connectez-vous
2. Allez sur [Firestore Console](https://console.firebase.google.com/project/dataxxb2c/firestore)
3. ✅ Vérifiez que votre document user existe

---

## 💡 Exemples d'utilisation

### Dans un composant - Authentification

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { firebaseUser, userData, loading, isAuthenticated } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  if (!isAuthenticated) return <div>Non connecté</div>;
  
  return <div>Bienvenue {userData?.displayName}</div>;
}
```

### Protéger une page

```typescript
import { withAuth } from '@/lib/firebase/withAuth';

function ProtectedPage({ user, userData }) {
  return <div>Page protégée pour {user.email}</div>;
}

export default withAuth(ProtectedPage);
```

### Créer des données utilisateur

```typescript
import { createUserData } from '@/lib/firebase/userData';

const dataId = await createUserData(
  userId,
  { 
    myField: 'myValue',
    otherField: 123
  },
  'myCategory',
  ['tag1', 'tag2']
);
```

### Récupérer des données

```typescript
import { getAllUserData } from '@/lib/firebase/userData';

const data = await getAllUserData(userId);
```

---

## 🔧 Commandes utiles

### Firebase CLI

```bash
# Déployer les règles de sécurité
npx firebase deploy --only firestore:rules --project dataxxb2c

# Déployer les indexes
npx firebase deploy --only firestore:indexes --project dataxxb2c

# Tout déployer
npx firebase deploy --only firestore --project dataxxb2c

# Émulateur local
npx firebase emulators:start --project dataxxb2c
```

### Script d'aide

```bash
./firebase-commands.sh help
./firebase-commands.sh deploy-rules
./firebase-commands.sh console
```

---

## 📚 Documentation

| Fichier | Contenu |
|---------|---------|
| `FIREBASE_COMPLETE.md` | 🎉 Résumé de tout ce qui a été fait |
| `FIREBASE_SETUP.md` | 📚 Guide complet d'utilisation des services |
| `FIREBASE_CREDENTIALS.md` | 🔑 Comment obtenir les credentials Firebase |

---

## 🔮 Prochaine étape : Stripe

Votre structure est déjà prête pour l'intégration Stripe :

1. **Collection `subscriptions`** configurée
2. **Types TypeScript** définis
3. **Services** `lib/firebase/subscriptions.ts`
4. **Hook** `useSubscription` prêt
5. **Règles de sécurité** en place

Quand vous serez prêt :

```bash
npm install stripe @stripe/stripe-js
```

---

## ❓ Besoin d'aide ?

### Erreurs courantes

**"Firebase not initialized"**
→ Vérifiez que `.env.local` contient les bonnes valeurs

**"Permission denied"**
→ Redéployez les règles : `./firebase-commands.sh deploy-rules`

**"Invalid API key"**
→ Vérifiez vos credentials dans `.env.local`

### Ressources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js + Firebase](https://firebase.google.com/docs/web/setup)

---

## ✅ Checklist finale

Avant de commencer le développement :

- [ ] Credentials Firebase configurés dans `.env.local`
- [ ] Google OAuth activé dans Firebase Console
- [ ] Test d'inscription réussi
- [ ] Test de connexion réussi
- [ ] Document user créé dans Firestore
- [ ] Dashboard accessible

**🎊 Une fois tout coché, vous êtes prêt à développer !**

---

## 🎯 Résumé en 3 points

1. **Configuration** : Remplissez `.env.local` avec vos credentials Firebase
2. **Test** : Inscrivez-vous et connectez-vous sur /register et /login
3. **Développement** : Utilisez `useAuth`, `useSubscription` et les services dans `lib/firebase/`

**Bon développement ! 🚀**
