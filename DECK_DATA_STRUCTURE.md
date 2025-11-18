# Structure des données extraites du deck commercial

Ce document détaille la structure complète des données qui peuvent être extraites d'un deck commercial.

## 📊 Structure TypeScript

```typescript
interface ExtractedWorkspaceData {
  // Informations de base
  name?: string;                    // Nom de l'athlète ou du club
  description?: string;             // Description courte
  type?: 'club' | 'athlete' | 'personal' | 'other';
  
  // Données enrichies
  enrichedData?: {
    // Palmarès
    achievements?: string[];        // Ex: ["Ligue 1 2023", "Coupe de France 2022"]
    
    // Sponsors et partenaires
    sponsors?: Array<{
      name: string;                 // Nom du sponsor
      type?: 'title' | 'official' | 'technical' | 'media' | 'other';
    }>;
    
    // Statistiques clés
    statistics?: {
      [key: string]: string | number;
      // Ex: { "founded": 1970, "members": 50000, "budget": "100M€" }
    };
    
    // Historique important
    history?: string[];             // Événements marquants
    
    // Valeurs et mission
    values?: string[];              // Ex: ["Excellence", "Respect", "Fair-play"]
    mission?: string;               // Mission ou vision du club/athlète
    
    // Informations spécifiques aux athlètes
    athleteInfo?: {
      sport?: string;               // Ex: "Football"
      position?: string;            // Ex: "Attaquant"
      birthDate?: string;           // Ex: "1990-05-15"
      nationality?: string;         // Ex: "Française"
      height?: string;              // Ex: "1.85m"
      weight?: string;              // Ex: "80kg"
      currentTeam?: string;         // Ex: "PSG"
    };
    
    // Informations spécifiques aux clubs
    clubInfo?: {
      sport?: string;               // Ex: "Football"
      founded?: number;             // Ex: 1970
      stadium?: string;             // Ex: "Parc des Princes"
      capacity?: number;            // Ex: 48000
      league?: string;              // Ex: "Ligue 1"
      colors?: string[];            // Ex: ["Rouge", "Bleu"]
    };
    
    // Autres informations personnalisées
    customData?: {
      [key: string]: any;
    };
  };
  
  // Métadonnées du fichier (ajoutées automatiquement)
  fileURL?: string;                 // URL du fichier dans Storage
  fileName?: string;                // Nom du fichier
  fileSize?: number;                // Taille en bytes
}
```

## 📝 Exemples concrets

### Exemple 1 : Club de Football

```json
{
  "name": "Paris Saint-Germain",
  "description": "Club de football professionnel français basé à Paris",
  "type": "club",
  "enrichedData": {
    "achievements": [
      "Ligue 1 : 11 fois champion",
      "Coupe de France : 14 fois vainqueur",
      "Finaliste Ligue des Champions 2020"
    ],
    "sponsors": [
      {
        "name": "Nike",
        "type": "technical"
      },
      {
        "name": "Qatar Airways",
        "type": "title"
      },
      {
        "name": "Accor",
        "type": "official"
      }
    ],
    "statistics": {
      "founded": 1970,
      "members": 50000,
      "budget": "600M€",
      "employees": 350,
      "socialMedia": "100M+ followers"
    },
    "history": [
      "1970 - Création du club par fusion",
      "2011 - Rachat par Qatar Sports Investments",
      "2020 - Première finale de Ligue des Champions"
    ],
    "values": [
      "Excellence sportive",
      "Innovation",
      "Engagement social",
      "Rayonnement international"
    ],
    "mission": "Devenir le club le plus prestigieux et innovant du monde",
    "clubInfo": {
      "sport": "Football",
      "founded": 1970,
      "stadium": "Parc des Princes",
      "capacity": 48583,
      "league": "Ligue 1",
      "colors": ["Rouge", "Bleu", "Blanc"]
    },
    "customData": {
      "academyPlayers": 200,
      "trophyRoom": "40+ trophées",
      "trainingCenter": "Camp des Loges"
    }
  }
}
```

### Exemple 2 : Athlète

```json
{
  "name": "Kylian Mbappé",
  "description": "Footballeur professionnel français, attaquant du Real Madrid",
  "type": "athlete",
  "enrichedData": {
    "achievements": [
      "Coupe du Monde FIFA 2018",
      "Soulier d'Or Ligue 1 : 5 fois",
      "Golden Boy 2017",
      "Meilleur jeune joueur du Monde FIFA 2018"
    ],
    "sponsors": [
      {
        "name": "Nike",
        "type": "technical"
      },
      {
        "name": "Hublot",
        "type": "official"
      },
      {
        "name": "EA Sports",
        "type": "official"
      }
    ],
    "statistics": {
      "matchesPlayed": 300,
      "goals": 250,
      "assists": 100,
      "marketValue": "180M€",
      "socialMedia": "100M+ followers"
    },
    "history": [
      "2013 - Débuts à Monaco",
      "2017 - Transfert au PSG",
      "2018 - Champion du Monde",
      "2024 - Transfert au Real Madrid"
    ],
    "values": [
      "Humilité",
      "Travail",
      "Détermination",
      "Solidarité"
    ],
    "mission": "Inspirer la jeunesse et marquer l'histoire du football",
    "athleteInfo": {
      "sport": "Football",
      "position": "Attaquant",
      "birthDate": "1998-12-20",
      "nationality": "Française",
      "height": "1.78m",
      "weight": "73kg",
      "currentTeam": "Real Madrid"
    },
    "customData": {
      "preferredFoot": "Droit",
      "jerseyNumber": 9,
      "foundation": "Inspired by KM",
      "awards": "40+ trophées individuels"
    }
  }
}
```

### Exemple 3 : Club de Rugby

```json
{
  "name": "Stade Toulousain",
  "description": "Club de rugby français le plus titré d'Europe",
  "type": "club",
  "enrichedData": {
    "achievements": [
      "Champion de France : 22 fois",
      "Coupe d'Europe : 5 fois",
      "Challenge Européen : 1 fois"
    ],
    "sponsors": [
      {
        "name": "Macron",
        "type": "technical"
      },
      {
        "name": "BNP Paribas",
        "type": "title"
      }
    ],
    "statistics": {
      "founded": 1907,
      "members": 12000,
      "players": 45,
      "budget": "35M€"
    },
    "clubInfo": {
      "sport": "Rugby",
      "founded": 1907,
      "stadium": "Stade Ernest-Wallon",
      "capacity": 19500,
      "league": "Top 14",
      "colors": ["Rouge", "Noir"]
    }
  }
}
```

## 🎯 Champs obligatoires vs optionnels

### Obligatoires (recommandés)
- ✅ `name` - Essentiel pour identifier l'entité
- ✅ `type` - Permet d'adapter l'affichage

### Optionnels mais recommandés
- 📌 `description` - Aide à la présentation
- 📌 `enrichedData.achievements` - Valorise l'entité
- 📌 `enrichedData.sponsors` - Important pour les clubs/athlètes pro
- 📌 `enrichedData.statistics` - Donne du contexte
- 📌 `athleteInfo` ou `clubInfo` selon le type

### Optionnels
- Tous les autres champs sont optionnels
- Ils enrichissent les données mais ne sont pas critiques

## 🔧 Personnalisation

### Ajouter un nouveau champ dans `enrichedData`

1. **Modifier le type TypeScript** (`types/firestore.ts`) :

```typescript
enrichedData?: {
  // ... champs existants
  
  // Nouveau champ
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
}
```

2. **Mettre à jour le prompt OpenAI** (`lib/openai/deckAnalyzer.ts`) :

```typescript
const prompt = `...
  "enrichedData": {
    ...
    "socialMedia": {
      "instagram": "URL du compte Instagram",
      "twitter": "URL du compte Twitter"
    }
  }
...`;
```

3. **Utiliser dans l'interface** :

```tsx
{workspace.enrichedData?.socialMedia?.instagram && (
  <a href={workspace.enrichedData.socialMedia.instagram}>
    Instagram
  </a>
)}
```

## 📊 Stockage dans Firestore

Les données sont stockées dans la collection `workspaces` :

```
workspaces/
  └── {workspaceId}/
      ├── name: "PSG"
      ├── type: "club"
      ├── description: "..."
      ├── enrichedData: { ... }
      └── deckDocument: {
            url: "https://storage...",
            fileName: "deck.pdf",
            uploadedAt: Timestamp
          }
```

## 🔍 Requêtes Firestore

```typescript
// Récupérer tous les clubs sportifs
const clubsQuery = query(
  collection(db, 'workspaces'),
  where('type', '==', 'club')
);

// Récupérer les workspaces avec sponsors Nike
const nikeSponsoredQuery = query(
  collection(db, 'workspaces'),
  where('enrichedData.sponsors', 'array-contains', { name: 'Nike' })
);
```

## ⚠️ Limites

- **Taille max Firestore** : 1 MB par document
- Si les données enrichies dépassent cette limite, envisager :
  - Stocker dans une sous-collection
  - Compresser les données
  - Stocker en fichier JSON dans Storage

## 💡 Bonnes pratiques

1. **Validation** : Valider les données extraites avant de les sauvegarder
2. **Normalisation** : Uniformiser les formats (dates, monnaies, etc.)
3. **Indexation** : Créer des index Firestore pour les champs fréquemment recherchés
4. **Versionning** : Garder une trace des modifications des données enrichies
5. **Fallback** : Toujours avoir des valeurs par défaut pour les champs manquants

