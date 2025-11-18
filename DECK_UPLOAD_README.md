# Upload et Analyse de Deck Commercial avec IA

Cette fonctionnalité permet aux utilisateurs d'uploader un deck commercial (PDF, DOCX, PPTX) pour extraire automatiquement les informations d'un workspace (athlète/club) via OpenAI et stocker le fichier dans Firebase Storage.

## 🚀 Fonctionnalités

- ✅ Upload de fichiers (PDF, DOCX, PPTX)
- ✅ Conversion automatique en PDF
- ✅ Analyse par IA (OpenAI GPT-4) pour extraction des données
- ✅ Stockage sécurisé dans Firebase Storage
- ✅ Pré-remplissage automatique du formulaire
- ✅ Support de données enrichies (palmarès, sponsors, stats, etc.)

## 📋 Configuration requise

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```bash
# OpenAI API Key (REQUIS)
OPENAI_API_KEY=sk-...votre_cle_api_openai...

# Firebase (déjà configuré normalement)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 2. Firebase Storage

Assurez-vous que Firebase Storage est activé dans votre projet Firebase :
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans "Storage" > "Règles"
4. Vérifiez que les règles permettent l'upload pour les utilisateurs authentifiés

Exemple de règles Firebase Storage :

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Autoriser les utilisateurs authentifiés à uploader dans leur workspace
    match /workspaces/{workspaceId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Installation des dépendances

Les dépendances sont déjà ajoutées au `package.json`. Exécutez :

```bash
npm install
```

Packages installés :
- `openai` - SDK OpenAI pour l'analyse par LLM
- `pdf-parse` - Extraction de texte depuis PDF
- `mammoth` - Conversion DOCX vers texte
- `pdf-lib` - Manipulation de PDF
- `formidable` - Upload de fichiers côté serveur

## 📁 Structure des fichiers

```
├── lib/
│   ├── firebase/
│   │   ├── config.ts          # Configuration Firebase (Storage ajouté)
│   │   └── storage.ts         # Fonctions de gestion du Storage
│   └── openai/
│       └── deckAnalyzer.ts    # Service d'analyse OpenAI
├── pages/
│   ├── api/
│   │   └── upload-deck.ts     # API route pour l'upload
│   ├── create-workspace.tsx    # Page de création (avec uploader)
│   └── workspace/
│       └── [id]/
│           └── settings.tsx    # Page de paramètres (avec uploader)
├── components/
│   └── DeckUploader.tsx        # Composant d'upload drag & drop
└── types/
    └── firestore.ts            # Types étendus (Workspace)
```

## 🎯 Utilisation

### 1. Lors de la création d'un workspace

1. Allez sur `/create-workspace`
2. Cliquez sur "Upload deck avec IA"
3. Glissez-déposez ou sélectionnez votre fichier
4. Attendez l'analyse (10-30 secondes)
5. Le formulaire se pré-remplit automatiquement
6. Vérifiez/modifiez les informations
7. Créez le workspace

### 2. Après la création d'un workspace

1. Allez sur `/workspace/[id]/settings`
2. Section "Upload deck commercial"
3. Cliquez sur "Uploader un deck" (ou "Remplacer le deck")
4. Suivez le même processus
5. Les données enrichies sont ajoutées/fusionnées

## 📊 Données extraites

Le système extrait automatiquement :

### Pour tous les types
- Nom
- Description
- Type (club/athlete/personal/other)

### Données enrichies
- **Palmarès** : Titres, récompenses, victoires
- **Sponsors** : Nom et type de partenaires
- **Statistiques** : Chiffres clés
- **Historique** : Événements marquants
- **Valeurs** : Valeurs et mission

### Spécifique aux athlètes
- Sport pratiqué
- Poste
- Date de naissance
- Nationalité
- Taille/Poids
- Équipe actuelle

### Spécifique aux clubs
- Sport principal
- Année de fondation
- Stade (nom et capacité)
- Championnat
- Couleurs

## 🔧 API

### POST /api/upload-deck

Upload et analyse un document.

**Paramètres (multipart/form-data):**
- `file`: Le fichier à uploader (PDF, DOCX, PPTX)
- `workspaceId`: ID du workspace (ou 'temp_' si création)
- `userId`: ID de l'utilisateur

**Réponse:**
```json
{
  "success": true,
  "data": {
    "name": "PSG",
    "description": "Club de football français",
    "type": "club",
    "enrichedData": {
      "achievements": ["Ligue 1 2023", ...],
      "sponsors": [{"name": "Nike", "type": "technical"}],
      ...
    },
    "fileURL": "https://storage.googleapis.com/...",
    "fileName": "deck.pdf",
    "fileSize": 1024000
  }
}
```

## 🎨 Composant DeckUploader

```tsx
import DeckUploader from '@/components/DeckUploader';

<DeckUploader
  workspaceId="workspace-id" // Optionnel si création
  userId="user-id"
  onDataExtracted={(data) => {
    console.log('Données extraites:', data);
    // Faire quelque chose avec les données
  }}
  onError={(error) => {
    console.error('Erreur:', error);
  }}
/>
```

## 🛠️ Personnalisation

### Modifier le prompt OpenAI

Éditez `lib/openai/deckAnalyzer.ts` et modifiez la variable `prompt` pour ajuster les instructions d'extraction.

### Ajouter des champs personnalisés

1. Modifiez l'interface `Workspace` dans `types/firestore.ts`
2. Ajoutez les champs dans `enrichedData.customData`
3. Mettez à jour le prompt OpenAI si nécessaire

### Changer le modèle OpenAI

Dans `lib/openai/deckAnalyzer.ts`, changez le paramètre `model` :
```typescript
model: 'gpt-4o', // ou 'gpt-4-turbo', 'gpt-4', etc.
```

## 📝 Limites

- **Taille maximale** : 50 MB par fichier
- **Formats supportés** : PDF, DOCX (PPT en lecture limitée)
- **Temps d'analyse** : 10-30 secondes selon la taille
- **Coût OpenAI** : ~$0.01-$0.10 par analyse (selon le modèle)

## 🐛 Dépannage

### Erreur "OPENAI_API_KEY not found"
- Vérifiez que `.env.local` contient la clé
- Redémarrez le serveur de développement

### Erreur "Firebase Storage: Object not found"
- Vérifiez que Storage est activé dans Firebase
- Vérifiez les règles de sécurité

### L'analyse échoue ou retourne des données incomplètes
- Vérifiez la qualité du PDF (texte sélectionnable)
- Si le PDF est scanné (image), l'OCR n'est pas inclus
- Ajustez le prompt dans `deckAnalyzer.ts`

### Conversion DOCX/PPTX échoue
- Vérifiez que le fichier n'est pas corrompu
- Pour PPTX complexes, exportez en PDF manuellement

## 🚀 Améliorations futures

- [ ] Support de l'OCR pour PDFs scannés
- [ ] Meilleure conversion PPTX vers PDF
- [ ] Gestion des versions de documents
- [ ] Comparaison de versions
- [ ] Export des données enrichies
- [ ] Intégration avec d'autres LLMs (Claude, Gemini)
- [ ] Cache des analyses pour éviter les doublons
- [ ] Webhook pour notifications d'analyse terminée

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

