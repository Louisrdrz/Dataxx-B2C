# Intégration Google + Workspaces

## 📊 Vue d'ensemble

Ce document décrit l'intégration du système de workspaces avec les données Google (Calendar, Contacts).

## ✅ Ce qui a été modifié

### 1. **hooks/useGoogleData.ts** (Modifié)

**Nouvelles fonctionnalités :**
- Ajout de la fonction `saveToWorkspace()` à tous les hooks
- Permet de sauvegarder les données Google dans un workspace Firestore

**Hooks mis à jour :**

#### `useCalendarEvents()`
```typescript
const { events, saveToWorkspace } = useCalendarEvents(20);
// Sauvegarder les événements dans un workspace
await saveToWorkspace(workspaceId, userId);
```

#### `useContacts()`
```typescript
const { contacts, saveToWorkspace } = useContacts();
// Sauvegarder les contacts dans un workspace
await saveToWorkspace(workspaceId, userId);
```

#### `useCalendarList()`
```typescript
const { calendars, saveToWorkspace } = useCalendarList();
// Sauvegarder les calendriers dans un workspace
await saveToWorkspace(workspaceId, userId);
```

### 2. **pages/google-data.tsx** (Modifié)

**Nouvelles fonctionnalités :**

1. **Sélection de workspace**
   - Dropdown pour choisir le workspace de destination
   - Sélection automatique du premier workspace disponible

2. **Boutons de sauvegarde**
   - Bouton "💾 Sauvegarder dans workspace" sur chaque onglet
   - Sauvegarde les données dans la collection `userData` de Firestore

3. **Notifications de succès**
   - Message de confirmation après sauvegarde
   - Disparaît automatiquement après 5 secondes

4. **Intégration avec useUserWorkspaces**
   - Récupère automatiquement les workspaces de l'utilisateur
   - Affiche uniquement les workspaces où l'utilisateur est membre

## 🔄 Flux de données

```
Google API → Hook (useGoogleData) → Page (google-data.tsx)
                                          ↓
                                   Sélection workspace
                                          ↓
                                   userData.createUserData()
                                          ↓
                                   Firestore collection: userData
```

## 📝 Structure des données sauvegardées

### Événements de calendrier
```json
{
  "workspaceId": "workspace_123",
  "createdBy": "user_456",
  "category": "google_calendar",
  "tags": ["google", "calendar", "events"],
  "dataCollected": {
    "source": "google_calendar",
    "events": [
      {
        "id": "event_1",
        "title": "Meeting",
        "start": "2024-11-20T10:00:00Z",
        "end": "2024-11-20T11:00:00Z",
        "location": "Bureau",
        "attendees": [...]
      }
    ],
    "totalEvents": 20,
    "importedAt": "2024-11-18T15:30:00Z"
  }
}
```

### Contacts
```json
{
  "workspaceId": "workspace_123",
  "createdBy": "user_456",
  "category": "google_contacts",
  "tags": ["google", "contacts", "people"],
  "dataCollected": {
    "source": "google_contacts",
    "contacts": [
      {
        "id": "contact_1",
        "displayName": "John Doe",
        "email": "john@example.com",
        "phone": "+33612345678",
        "company": "Acme Inc"
      }
    ],
    "totalContacts": 100,
    "importedAt": "2024-11-18T15:30:00Z"
  }
}
```

### Calendriers
```json
{
  "workspaceId": "workspace_123",
  "createdBy": "user_456",
  "category": "google_calendars",
  "tags": ["google", "calendar", "list"],
  "dataCollected": {
    "source": "google_calendars",
    "calendars": [
      {
        "id": "calendar_1",
        "summary": "Mon calendrier",
        "description": "Calendrier principal",
        "backgroundColor": "#4285f4"
      }
    ],
    "totalCalendars": 5,
    "importedAt": "2024-11-18T15:30:00Z"
  }
}
```

## 🔒 Sécurité

Les données sont protégées par les **règles Firestore** :
- Seuls les membres d'un workspace peuvent lire les données
- Seuls les membres peuvent créer des données
- Les admins peuvent supprimer les données

## 🚀 Utilisation

### 1. Se connecter avec Google
```typescript
import { signInWithGoogle } from '@/lib/firebase/auth';
await signInWithGoogle();
```

### 2. Accéder à la page Google Data
```
/google-data
```

### 3. Sélectionner un workspace et sauvegarder
- Choisir un workspace dans le dropdown
- Cliquer sur "💾 Sauvegarder dans workspace"
- Les données sont sauvegardées dans Firestore

### 4. Récupérer les données sauvegardées
```typescript
import { getWorkspaceDataByCategory } from '@/lib/firebase/userData';

// Récupérer les événements de calendrier
const calendarData = await getWorkspaceDataByCategory(
  workspaceId,
  'google_calendar'
);

// Récupérer les contacts
const contactsData = await getWorkspaceDataByCategory(
  workspaceId,
  'google_contacts'
);
```

## 📊 Requêtes optimisées

Les index Firestore suivants sont déjà configurés :
- `workspaceId` + `category` + `updatedAt` (DESC)
- `workspaceId` + `createdAt` (DESC)

Ces index permettent des requêtes rapides par catégorie.

## 🎯 Cas d'usage

1. **Import de données** : Importer les événements/contacts Google dans un workspace d'équipe
2. **Partage** : Tous les membres du workspace peuvent accéder aux données importées
3. **Historique** : Conserver plusieurs imports avec dates
4. **Analytics** : Analyser les événements et contacts de l'équipe

## ⚠️ Limitations

- Les données sont en lecture seule (pas de synchronisation bidirectionnelle)
- Un import remplace pas les données précédentes (création de nouveaux documents)
- Limite de 100 contacts par défaut (peut être augmentée avec `getAllContacts`)

## 🔮 Améliorations futures

- [ ] Synchronisation automatique périodique
- [ ] Déduplication des données
- [ ] Export vers Google depuis Firestore
- [ ] Fusion de plusieurs sources de données
- [ ] Dashboard d'analytics des données importées

## 📚 Fichiers concernés

- `hooks/useGoogleData.ts` - Hooks React pour Google APIs
- `lib/firebase/googleApis.ts` - Services d'API Google (inchangé)
- `pages/google-data.tsx` - Interface utilisateur
- `lib/firebase/userData.ts` - Services Firestore pour données (compatible workspaces)

## ✅ Tests à effectuer

1. ✅ Vérifier que les hooks retournent bien les données Google
2. ✅ Vérifier que la page affiche les workspaces
3. ✅ Tester la sauvegarde d'événements
4. ✅ Tester la sauvegarde de contacts
5. ✅ Tester la sauvegarde de calendriers
6. ✅ Vérifier les permissions Firestore
7. ✅ Vérifier que les données sont bien dans Firestore

---

**Date de création** : 18 novembre 2024
**Auteur** : Adaptation automatique du système de workspaces
**Version** : 1.0.0

