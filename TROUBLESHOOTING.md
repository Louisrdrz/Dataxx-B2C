# 🐛 Troubleshooting Firebase

## Problèmes courants et solutions

### 1. Erreur : "Firebase: Error (auth/invalid-api-key)"

**Cause** : Les credentials Firebase dans `.env.local` ne sont pas valides.

**Solution** :
1. Vérifiez que `.env.local` existe à la racine du projet
2. Allez sur https://console.firebase.google.com/project/dataxxb2c/settings/general
3. Copiez les bonnes valeurs dans `.env.local`
4. Redémarrez le serveur : `npm run dev`

### 2. Erreur : "Permission denied" dans Firestore

**Cause** : Les règles de sécurité ne sont pas déployées ou sont incorrectes.

**Solution** :
```bash
npx firebase deploy --only firestore:rules --project dataxxb2c
```

### 3. La connexion Google ne fonctionne pas

**Cause** : Le provider Google n'est pas activé dans Firebase.

**Solution** :
1. Allez sur https://console.firebase.google.com/project/dataxxb2c/authentication/providers
2. Cliquez sur "Google"
3. Activez le fournisseur
4. Ajoutez votre domaine autorisé (localhost est déjà autorisé par défaut)

### 4. Erreur : "Email already in use"

**Cause** : Un compte avec cet email existe déjà.

**Solution** :
- Utilisez un autre email
- OU connectez-vous avec cet email
- OU supprimez le compte depuis la [Console Firebase](https://console.firebase.google.com/project/dataxxb2c/authentication/users)

### 5. Build échoue avec erreur Firebase

**Cause** : Les credentials Firebase sont requis même au build.

**Solution** :
1. Assurez-vous que `.env.local` contient toutes les variables
2. Pour CI/CD, utilisez des variables d'environnement système
3. Pour Vercel, configurez les variables dans les paramètres du projet

### 6. Hook useAuth ne retourne rien

**Cause** : Firebase n'est pas initialisé ou la config est incorrecte.

**Solution** :
1. Vérifiez `.env.local`
2. Vérifiez la console du navigateur pour des erreurs
3. Vérifiez que `lib/firebase/config.ts` est bien importé

### 7. "Collection not found" ou données vides

**Cause** : La collection n'a pas encore été créée dans Firestore.

**Solution** :
- Les collections Firestore sont créées automatiquement au premier document
- Créez un utilisateur pour initialiser la collection `users`
- Les règles permettent la création automatique

### 8. Erreur lors du déploiement des règles

**Cause** : Problème de syntaxe dans `firestore.rules` ou projet incorrect.

**Solution** :
```bash
# Vérifier la syntaxe
npx firebase firestore:rules --project dataxxb2c

# Forcer le redéploiement
npx firebase deploy --only firestore:rules --project dataxxb2c --force
```

### 9. L'utilisateur est créé mais pas dans Firestore

**Cause** : `createOrUpdateUserDocument` n'est pas appelé ou échoue.

**Solution** :
1. Vérifiez les règles Firestore (collection `users`)
2. Vérifiez la console pour des erreurs
3. Testez manuellement :
```typescript
import { createOrUpdateUserDocument } from '@/lib/firebase/users';
await createOrUpdateUserDocument(user);
```

### 10. Erreur : "Failed to get document because the client is offline"

**Cause** : Mode hors ligne de Firestore activé ou problème réseau.

**Solution** :
```typescript
// Dans lib/firebase/config.ts, désactiver le cache persistant
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});
```

## Vérifications rapides

### Checklist de debug

1. ✅ `.env.local` existe et contient toutes les variables
2. ✅ Firebase project ID est `dataxxb2c`
3. ✅ Google OAuth activé dans Firebase Console
4. ✅ Règles Firestore déployées
5. ✅ Serveur redémarré après modification `.env.local`
6. ✅ Console navigateur ne montre pas d'erreurs
7. ✅ Console Firebase Authentication montre les utilisateurs
8. ✅ Console Firebase Firestore montre les collections

### Commandes de diagnostic

```bash
# Vérifier la connexion Firebase
npx firebase login:list

# Vérifier le projet actif
npx firebase projects:list

# Tester les règles localement
npx firebase emulators:start --only firestore

# Voir les logs Firebase
npx firebase functions:log --project dataxxb2c
```

### Variables d'environnement

Vérifiez que toutes ces variables sont définies :

```bash
# Dans le terminal
echo $NEXT_PUBLIC_FIREBASE_API_KEY
echo $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

Si vide, redémarrez le terminal ou sourcez le fichier :
```bash
source .env.local
```

### Console Firebase

Liens utiles pour vérifier l'état :

- [Dashboard](https://console.firebase.google.com/project/dataxxb2c)
- [Authentication](https://console.firebase.google.com/project/dataxxb2c/authentication/users)
- [Firestore Data](https://console.firebase.google.com/project/dataxxb2c/firestore/data)
- [Firestore Rules](https://console.firebase.google.com/project/dataxxb2c/firestore/rules)
- [Firestore Indexes](https://console.firebase.google.com/project/dataxxb2c/firestore/indexes)

## Logs de debug

### Activer les logs détaillés Firebase

```typescript
// Dans lib/firebase/config.ts
import { setLogLevel } from 'firebase/app';

if (process.env.NODE_ENV === 'development') {
  setLogLevel('debug');
}
```

### Activer les logs Firestore

```typescript
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});
```

## Tester manuellement

### Tester l'authentification

```typescript
// Dans la console du navigateur
import { signInWithEmail } from '@/lib/firebase/auth';

signInWithEmail('test@example.com', 'password123')
  .then(user => console.log('✅ Connecté:', user))
  .catch(err => console.error('❌ Erreur:', err));
```

### Tester Firestore

```typescript
import { getUserData } from '@/lib/firebase/users';

getUserData('USER_ID')
  .then(data => console.log('✅ Données:', data))
  .catch(err => console.error('❌ Erreur:', err));
```

## Support

Si le problème persiste après avoir essayé ces solutions :

1. Vérifiez les [Status Firebase](https://status.firebase.google.com/)
2. Consultez les [Firebase Docs](https://firebase.google.com/docs)
3. Vérifiez les [Release Notes](https://firebase.google.com/support/release-notes/js)
4. Recherchez sur [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase) avec le tag `firebase`

## Problèmes spécifiques à Next.js

### SSR et Firebase

Firebase Auth ne fonctionne que côté client. Pour SSR :

```typescript
// Dans _app.tsx, entourer avec
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <Component {...pageProps} />;
}
```

### Erreur "window is not defined"

Si vous voyez cette erreur, importez Firebase uniquement côté client :

```typescript
import dynamic from 'next/dynamic';

const FirebaseComponent = dynamic(() => import('./FirebaseComponent'), {
  ssr: false
});
```

## Réinitialiser complètement

Si rien ne fonctionne, réinitialisez tout :

```bash
# 1. Supprimer node_modules et réinstaller
rm -rf node_modules
rm package-lock.json
npm install

# 2. Redéployer Firebase
npx firebase deploy --only firestore --project dataxxb2c

# 3. Effacer le cache Next.js
rm -rf .next

# 4. Redémarrer
npm run dev
```

## Aide supplémentaire

Pour une aide personnalisée, consultez :
- `FIREBASE_SETUP.md` - Guide complet
- `FIREBASE_CREDENTIALS.md` - Configuration des credentials
- `README_FIREBASE.md` - Guide de démarrage rapide
