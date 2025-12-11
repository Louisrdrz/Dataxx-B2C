# 🔍 Vérification de la Configuration Vercel

Guide pour diagnostiquer pourquoi certaines erreurs n'apparaissent qu'en production sur Vercel.

## 📋 Checklist de Vérification

### 1. Variables d'environnement sur Vercel

**Accéder au dashboard Vercel :**
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `Dataxx-B2C`
3. Allez dans **Settings** > **Environment Variables**

**Vérifier que toutes ces variables sont présentes :**

```bash
# Firebase (REQUIS)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# OpenAI (REQUIS pour l'upload de deck)
OPENAI_API_KEY=sk-...

# Firebase Admin (optionnel, pour certaines fonctionnalités)
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

**⚠️ Important :**
- Les variables doivent être définies pour **Production**, **Preview**, et **Development**
- Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
- Les variables `NEXT_PUBLIC_*` sont exposées au client, ne mettez pas de secrets dedans

### 2. Règles Firebase Storage déployées

**Vérifier dans Firebase Console :**
1. Allez sur https://console.firebase.google.com/project/dataxxb2c/storage/rules
2. Vérifiez que les règles correspondent à `storage.rules` dans votre projet

**Déployer les règles si nécessaire :**
```bash
# Depuis votre machine locale
firebase deploy --only storage
```

**Règles attendues :**
```javascript
match /workspaces/{workspaceId}/decks/{fileName} {
  allow read: if request.auth != null;
  allow write: if request.auth != null
               && request.resource.size < 50 * 1024 * 1024
               && (
                 workspaceId.matches('temp_.*')
                 || request.resource.contentType.matches('application/pdf|application/vnd.openxmlformats-officedocument.*')
               );
}
```

### 3. Authentification Firebase

**Vérifier que l'authentification fonctionne :**
1. Sur Vercel, ouvrez la console du navigateur (F12)
2. Allez sur `/create-workspace`
3. Vérifiez dans l'onglet **Console** s'il y a des erreurs Firebase
4. Vérifiez dans l'onglet **Network** les requêtes Firebase Storage

**Erreurs courantes :**
- `Firebase: Error (auth/network-request-failed)` → Problème de connexion ou CORS
- `Firebase Storage: User does not have permission` → Règles Storage ou authentification
- `Firebase Storage: An unknown error occurred` → Variable d'environnement manquante

### 4. Logs Vercel

**Consulter les logs en temps réel :**
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **Deployments** > Sélectionnez le dernier déploiement
4. Cliquez sur **Functions** pour voir les logs des API routes

**Chercher :**
- Erreurs dans `/api/upload-deck`
- Erreurs Firebase Admin
- Erreurs OpenAI

### 5. Test de Diagnostic

**Créer un endpoint de test :**
```typescript
// pages/api/test-firebase.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const checks = {
    firebaseConfig: {
      apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    },
    openai: {
      apiKey: !!process.env.OPENAI_API_KEY,
    },
  };

  res.status(200).json(checks);
}
```

**Tester :**
```bash
curl https://votre-domaine.vercel.app/api/test-firebase
```

## 🔧 Solutions aux Problèmes Courants

### Problème : Erreur 403 "Forbidden" sur Firebase Storage

**Causes possibles :**
1. ✅ **Règles Storage non déployées** → Déployer avec `firebase deploy --only storage`
2. ✅ **Utilisateur non authentifié** → Vérifier que `firebaseUser` existe avant l'upload
3. ✅ **Token Firebase expiré** → Reconnecter l'utilisateur
4. ✅ **Variable `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` manquante** → Ajouter sur Vercel

**Solution :**
```typescript
// Vérifier l'authentification avant l'upload
if (!firebaseUser) {
  throw new Error('Vous devez être connecté pour uploader un fichier');
}
```

### Problème : Erreur "Unexpected token 'F', "Forbidden""

**Cause :** Le code essayait de parser une réponse d'erreur HTTP comme JSON.

**Solution :** ✅ **DÉJÀ CORRIGÉ** dans `DeckUploader.tsx`
- Vérification du statut HTTP avant parsing JSON
- Gestion des réponses non-JSON

### Problème : Variables d'environnement non disponibles

**Symptômes :**
- `undefined` dans les logs
- Erreurs Firebase "Invalid API key"
- Build réussit mais runtime échoue

**Solution :**
1. Vérifier que les variables sont définies pour **Production**
2. Redéployer après avoir ajouté des variables
3. Vérifier qu'il n'y a pas de fautes de frappe dans les noms

## 🚀 Commandes Utiles

```bash
# Vérifier les variables locales
cat .env.local

# Déployer les règles Storage
firebase deploy --only storage

# Vérifier les règles déployées
firebase firestore:rules:get

# Tester localement avec les mêmes règles que production
firebase emulators:start --only storage
```

## 📊 Comparaison Local vs Vercel

| Aspect | Local | Vercel |
|--------|-------|--------|
| Variables d'env | `.env.local` | Dashboard Vercel |
| Règles Storage | Émulateur ou production | Production uniquement |
| Authentification | Peut être plus permissive | Stricte |
| CORS | Pas de restrictions | Restrictions possibles |
| Logs | Terminal | Dashboard Vercel |
| Build | `npm run dev` | Build automatique |

## ✅ Checklist Finale

Avant de déployer, vérifiez :

- [ ] Toutes les variables d'environnement sont sur Vercel
- [ ] Les règles Firebase Storage sont déployées
- [ ] Le build local fonctionne (`npm run build`)
- [ ] Les tests d'authentification passent
- [ ] Les logs Vercel ne montrent pas d'erreurs

## 🆘 En Cas de Problème

1. **Vérifier les logs Vercel** → Dashboard > Deployments > Logs
2. **Vérifier Firebase Console** → Storage > Rules et Logs
3. **Tester localement** → `npm run build && npm start`
4. **Comparer les variables** → Local vs Vercel

