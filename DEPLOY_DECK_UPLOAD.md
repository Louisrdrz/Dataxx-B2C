# 🚀 Déploiement en production - Upload de Deck Commercial

Guide complet pour déployer la fonctionnalité d'upload de deck commercial en production.

## 📋 Checklist pré-déploiement

### ✅ Variables d'environnement

**Sur Vercel** (ou votre plateforme de déploiement) :

```bash
# OpenAI (REQUIS)
OPENAI_API_KEY=sk-proj-...

# Firebase (normalement déjà configuré)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

### ✅ Firebase Storage

1. **Activer Storage dans Firebase Console**
   ```
   https://console.firebase.google.com/project/[PROJECT_ID]/storage
   ```

2. **Déployer les règles**
   ```bash
   firebase deploy --only storage
   ```

3. **Vérifier le bucket**
   - Aller dans Storage > Rules
   - Vérifier que les règles sont actives
   - Tester un upload manuel

### ✅ Firebase Firestore

Aucune modification requise, les nouveaux champs sont optionnels.

### ✅ OpenAI

1. **Créer/vérifier la clé API**
   - https://platform.openai.com/api-keys
   - Vérifier les crédits disponibles
   - Configurer les limites de dépenses si nécessaire

2. **Tester la clé localement**
   ```bash
   # Dans votre terminal
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

## 🔧 Déploiement étape par étape

### 1. Build local (optionnel)

Tester le build localement avant de déployer :

```bash
npm run build
npm start
```

Vérifier que :
- Le build réussit sans erreur
- Aucune erreur TypeScript
- Les pages se chargent correctement

### 2. Git commit et push

```bash
git add .
git commit -m "feat: Add deck upload with AI analysis"
git push origin main
```

### 3. Déploiement Vercel (automatique)

Si vous utilisez Vercel :
1. Le déploiement se lance automatiquement après le push
2. Vérifier les logs de build
3. Vérifier que les variables d'environnement sont configurées

**Configuration Vercel manuelle** (si nécessaire) :
```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 4. Vérifications post-déploiement

#### Test 1 : Page de création accessible
```
✅ https://votre-domaine.com/create-workspace
```

#### Test 2 : Upload fonctionne
- Cliquer sur "Upload deck avec IA"
- Glisser-déposer un PDF
- Vérifier l'analyse

#### Test 3 : Storage fonctionne
- Vérifier dans Firebase Console > Storage
- Un nouveau fichier doit apparaître dans `workspaces/{id}/decks/`

#### Test 4 : Données sauvegardées
- Vérifier dans Firebase Console > Firestore
- Le workspace doit avoir `enrichedData` et `deckDocument`

## 🔍 Monitoring et logs

### Logs Vercel
```
https://vercel.com/[TEAM]/[PROJECT]/logs
```

Filtrer par :
- `/api/upload-deck` pour les erreurs d'upload
- Erreurs 500 pour les problèmes serveur

### Logs Firebase
```
https://console.firebase.google.com/project/[PROJECT_ID]/logs
```

### OpenAI Usage
```
https://platform.openai.com/usage
```

Surveiller :
- Nombre de requêtes
- Coût par jour
- Erreurs API

## 🛡️ Sécurité en production

### 1. Firebase Storage Rules

Vérifier que les règles sont strictes :

```javascript
// storage.rules
match /workspaces/{workspaceId}/decks/{fileName} {
  allow read: if request.auth != null;
  allow write: if request.auth != null
               && request.resource.size < 50 * 1024 * 1024;
}
```

### 2. Rate limiting (recommandé)

Ajouter un rate limiting pour éviter les abus :

```typescript
// pages/api/upload-deck.ts
// TODO: Ajouter rate limiting
// Exemple avec upstash/ratelimit
```

### 3. Validation côté serveur

Déjà implémenté :
- ✅ Vérification de la taille (50 MB max)
- ✅ Vérification du type MIME
- ✅ Authentification requise

### 4. Monitoring des coûts OpenAI

**Configurer des alertes** :
1. Aller sur https://platform.openai.com/account/billing/limits
2. Configurer un budget mensuel
3. Activer les notifications email

**Budget recommandé pour démarrage** :
- $50/mois pour ~500 analyses

## 📊 Métriques à surveiller

### KPIs

| Métrique | Objectif | Critique si |
|----------|----------|-------------|
| Temps d'upload | <5s | >10s |
| Temps d'analyse | <30s | >60s |
| Taux d'erreur | <5% | >10% |
| Coût par analyse | <$0.10 | >$0.50 |

### Outils de monitoring

1. **Vercel Analytics**
   - Temps de réponse API
   - Erreurs serveur
   - Utilisation de la bande passante

2. **Firebase Console**
   - Lectures/écritures Firestore
   - Storage utilisé
   - Règles déclenchées

3. **OpenAI Dashboard**
   - Requêtes par jour
   - Coûts
   - Latence

## 🐛 Dépannage en production

### Erreur : "OPENAI_API_KEY not found"

**Cause** : Variable d'environnement non configurée sur Vercel

**Solution** :
1. Aller sur Vercel Dashboard
2. Settings > Environment Variables
3. Ajouter `OPENAI_API_KEY`
4. Redéployer

### Erreur : "Firebase Storage: Object not found"

**Cause** : Règles Storage pas déployées ou incorrectes

**Solution** :
```bash
firebase deploy --only storage
```

### Erreur : "Request timeout"

**Cause** : Document trop volumineux ou connexion lente à OpenAI

**Solution** :
1. Augmenter le timeout Vercel (Edge Functions: 30s, Serverless: 60s)
2. Optimiser le document (réduire la taille)

### Upload échoue silencieusement

**Cause** : Erreur JavaScript côté client

**Solution** :
1. Ouvrir Console développeur
2. Chercher les erreurs
3. Vérifier les permissions CORS

## 🔄 Rollback

Si un problème critique survient :

### Rollback Vercel
```bash
# Via dashboard
Deployments > [Previous deployment] > Promote to Production

# Via CLI
vercel rollback [DEPLOYMENT_URL]
```

### Rollback Firebase Rules
```bash
# Restaurer les anciennes règles
git checkout HEAD~1 storage.rules
firebase deploy --only storage
```

## 📈 Optimisations pour la production

### 1. Cache des analyses (à implémenter)

Éviter les analyses en double :
```typescript
// Vérifier si le fichier a déjà été analysé (par hash)
const fileHash = await calculateHash(file);
const cached = await getCachedAnalysis(fileHash);
if (cached) return cached;
```

### 2. Compression des fichiers

Compresser les PDFs avant stockage :
```typescript
// Utiliser pdf-lib pour compresser
const compressedPdf = await compressPDF(pdfBuffer);
```

### 3. CDN pour les fichiers

Firebase Storage utilise déjà un CDN, mais vérifier :
- Cache-Control headers
- Compression activée

## 🎯 Prochaines étapes post-déploiement

### Semaine 1
- [ ] Surveiller les logs quotidiennement
- [ ] Vérifier les coûts OpenAI
- [ ] Collecter les feedbacks utilisateurs

### Semaine 2-4
- [ ] Analyser les métriques
- [ ] Optimiser si nécessaire
- [ ] Implémenter le cache si besoin

### Long terme
- [ ] Ajouter plus de champs d'extraction
- [ ] Améliorer le prompt OpenAI
- [ ] Ajouter des analytics
- [ ] Implémenter le rate limiting

## 📞 Support

En cas de problème en production :

1. **Vérifier les logs** (Vercel + Firebase + OpenAI)
2. **Tester localement** avec les mêmes données
3. **Rollback** si critique
4. **Contacter l'équipe** si nécessaire

## ✅ Checklist finale

Avant de mettre en production :

- [ ] Build local réussi
- [ ] Tests manuels passés
- [ ] Variables d'environnement configurées (Vercel)
- [ ] Firebase Storage activé
- [ ] Règles Storage déployées
- [ ] OpenAI API Key valide avec crédits
- [ ] Budget OpenAI configuré
- [ ] Monitoring en place
- [ ] Plan de rollback préparé
- [ ] Documentation à jour
- [ ] Équipe prévenue

**Une fois tous les checks validés : 🚀 GO FOR LAUNCH!**

