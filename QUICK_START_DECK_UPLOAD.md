# 🚀 Démarrage rapide - Upload de Deck Commercial

Guide ultra-rapide pour mettre en place la fonctionnalité d'upload de deck commercial.

## ⚡ En 5 minutes

### 1️⃣ Installer les dépendances

```bash
cd /Users/louisrodriguez/Documents/Dataxx/Dataxx-B2C
npm install
```

### 2️⃣ Configurer OpenAI API Key

Créez ou modifiez le fichier `.env.local` à la racine :

```bash
# Ajoutez cette ligne avec votre clé API OpenAI
OPENAI_API_KEY=sk-votre_cle_api_openai
```

**📌 Obtenir une clé API :**
1. Allez sur https://platform.openai.com/api-keys
2. Créez une nouvelle clé
3. Copiez-la dans `.env.local`

### 3️⃣ Déployer les règles Firebase Storage

```bash
# Se connecter à Firebase (si pas déjà fait)
firebase login

# Déployer les règles Storage
firebase deploy --only storage
```

Ou utilisez le script :
```bash
chmod +x deploy-storage-rules.sh
./deploy-storage-rules.sh
```

### 4️⃣ Démarrer le serveur

```bash
npm run dev
```

### 5️⃣ Tester !

1. Ouvrez http://localhost:3000/create-workspace
2. Connectez-vous
3. Cliquez sur "Upload deck avec IA"
4. Glissez-déposez un PDF de deck commercial
5. Attendez l'analyse (~10-30 secondes)
6. 🎉 Le formulaire est pré-rempli automatiquement !

## 🔍 Vérifications

### ✅ Checklist de configuration

- [ ] `npm install` exécuté sans erreur
- [ ] Fichier `.env.local` créé avec `OPENAI_API_KEY`
- [ ] Firebase Storage activé dans la console Firebase
- [ ] Règles Storage déployées
- [ ] Serveur de dev démarré sans erreur
- [ ] Page `/create-workspace` accessible

### 🧪 Test rapide

1. **Test de connexion OpenAI** : Les erreurs d'API apparaîtront dans la console du navigateur
2. **Test de Storage** : L'upload créera un fichier dans `workspaces/{id}/decks/` visible dans la console Firebase
3. **Test d'extraction** : Les données extraites s'affichent dans un message de succès vert

## 📍 Pages disponibles

| Page | URL | Description |
|------|-----|-------------|
| Création workspace | `/create-workspace` | Créer un workspace avec upload de deck |
| Paramètres workspace | `/workspace/[id]/settings` | Modifier et uploader un deck pour un workspace existant |

## 🐛 Problèmes courants

### Erreur : "OPENAI_API_KEY not found"
```bash
# Solution : Vérifier que .env.local existe et contient la clé
cat .env.local | grep OPENAI_API_KEY

# Redémarrer le serveur après modification
npm run dev
```

### Erreur : "Firebase Storage: Object not found"
```bash
# Solution : Déployer les règles Storage
firebase deploy --only storage

# Vérifier dans la console Firebase que Storage est activé
```

### Erreur : "Format de fichier non supporté"
- ✅ Formats acceptés : PDF, DOCX, PPTX
- ⚠️ Taille max : 50 MB
- 💡 Pour PPTX complexes, exportez en PDF manuellement

### L'analyse prend trop de temps
- ⏱️ Normal : 10-30 secondes selon la taille du document
- 📊 Si > 1 minute : Vérifiez la console pour les erreurs
- 🔄 Rechargez la page et réessayez

## 💰 Coûts OpenAI

Estimation par analyse :
- PDF 10 pages : ~$0.01 - $0.02
- PDF 50 pages : ~$0.05 - $0.10
- PDF 100 pages : ~$0.10 - $0.20

**Modèle utilisé** : GPT-4o (vision + fichiers)

## 🎯 Prochaines étapes

Après avoir testé :

1. **Personnaliser le prompt** : Éditez `lib/openai/deckAnalyzer.ts`
2. **Ajouter des champs** : Modifiez `types/firestore.ts`
3. **Améliorer l'UI** : Personnalisez `components/DeckUploader.tsx`
4. **Ajouter des règles de sécurité** : Éditez `storage.rules`

## 📚 Documentation complète

Pour plus de détails, consultez [DECK_UPLOAD_README.md](./DECK_UPLOAD_README.md)

## ❓ Besoin d'aide ?

- 📖 Documentation OpenAI : https://platform.openai.com/docs
- 🔥 Documentation Firebase Storage : https://firebase.google.com/docs/storage
- 💬 Support : Contactez l'équipe de développement

