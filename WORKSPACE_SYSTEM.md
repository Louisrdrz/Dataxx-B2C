# Système de Workspaces Multi-Tenant

## 📋 Vue d'ensemble

Le système de workspaces a été implémenté avec succès. Les utilisateurs peuvent maintenant créer et rejoindre plusieurs workspaces, où les données et abonnements sont partagés au niveau du workspace plutôt qu'au niveau utilisateur individuel.

## 🎯 Concepts clés

### Workspaces
- Un **workspace** représente un espace de travail partagé (ex: "TFC Masculin", "TFC Féminin", "Mbappé")
- Chaque workspace peut avoir plusieurs membres avec différents rôles
- Les données et abonnements sont liés au workspace, pas aux utilisateurs individuels

### Rôles
- **Admin** : Gestion complète du workspace (ajouter/retirer des membres, gérer l'abonnement, modifier les paramètres)
- **Member** : Accès aux données du workspace (lecture/écriture selon les permissions)

### Règles importantes
- Un workspace doit avoir au moins un admin
- Plusieurs utilisateurs peuvent être admins d'un même workspace
- L'admin du workspace gère la facturation pour toute l'équipe
- Les modifications au workspace affectent tous les membres

## 🗂️ Structure de données

### Collections principales

#### 1. `workspaces`
```typescript
{
  id: string;
  name: string;               // "TFC Masculin", "Mbappé"
  description?: string;
  ownerId: string;            // Créateur du workspace
  type?: 'club' | 'athlete' | 'personal' | 'other';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings?: {
    allowMemberInvite?: boolean;
    visibility?: 'private' | 'public';
  };
  memberCount?: number;
  logoURL?: string;
}
```

#### 2. `workspaceMembers`
```typescript
{
  id: string;                 // Format: "{workspaceId}_{userId}"
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Timestamp;
  invitedBy?: string;
  // Infos dénormalisées pour performance
  userEmail?: string;
  userDisplayName?: string;
  userPhotoURL?: string;
}
```

#### 3. `workspaceInvitations`
```typescript
{
  id: string;
  workspaceId: string;
  email: string;
  invitedBy: string;
  invitedByName?: string;
  role: 'admin' | 'member';
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  createdAt: Timestamp;
  expiresAt: Timestamp;       // Expire après 7 jours
  respondedAt?: Timestamp;
  workspaceName?: string;
  workspaceLogoURL?: string;
}
```

#### 4. `subscriptions` (modifié)
```typescript
{
  id: string;
  workspaceId: string;        // ⚠️ Changé de userId à workspaceId
  managedBy: string;          // Admin qui gère la facturation
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | ...;
  planName: string;
  maxMembers?: number;        // Limite de membres selon le plan
  // ... autres champs Stripe
}
```

#### 5. `userData` (modifié)
```typescript
{
  id: string;
  workspaceId: string;        // ⚠️ Changé de userId à workspaceId
  createdBy: string;          // Qui a créé cette donnée
  updatedBy?: string;         // Dernière personne à l'avoir modifiée
  dataCollected: Record<string, any>;
  category?: string;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔐 Règles de sécurité Firestore

Les règles de sécurité ont été réécrites pour supporter les workspaces :

### Fonctions helper
- `isWorkspaceMember(workspaceId)` - Vérifie l'appartenance
- `isWorkspaceAdmin(workspaceId)` - Vérifie le rôle admin
- `hasWorkspaceRole(workspaceId, role)` - Vérifie un rôle spécifique

### Permissions principales

**Workspaces** :
- Lecture : membres du workspace
- Création : utilisateurs authentifiés
- Modification : admins uniquement
- Suppression : admins uniquement

**WorkspaceMembers** :
- Lecture : membres du même workspace
- Création : admins ou via acceptation d'invitation
- Modification : admins (changement de rôle)
- Suppression : admins ou l'utilisateur lui-même

**Subscriptions** :
- Lecture : admins du workspace
- Création/Modification : backend uniquement (Cloud Functions)

**UserData** :
- Lecture : membres du workspace
- Création/Modification : membres du workspace
- Suppression : admins ou créateur de la donnée

## 💻 Utilisation du code

### 1. Créer un workspace

```typescript
import { createWorkspace } from '@/lib/firebase/workspaces';

const workspaceId = await createWorkspace(
  userId,
  {
    name: "TFC Masculin",
    description: "Équipe masculine du Toulouse FC",
    type: "club",
    logoURL: "https://..."
  }
);
```

### 2. Inviter des membres

```typescript
import { createInvitation } from '@/lib/firebase/invitations';

const invitationId = await createInvitation(
  workspaceId,
  "email@example.com",
  "member",  // ou "admin"
  currentUserId,
  { name: "TFC Masculin", logoURL: "..." },
  "John Doe"
);
```

### 3. Accepter une invitation

```typescript
import { acceptInvitation } from '@/lib/firebase/invitations';

await acceptInvitation(
  invitationId,
  userId,
  {
    email: "email@example.com",
    displayName: "John Doe",
    photoURL: "..."
  }
);
```

### 4. Gérer les membres

```typescript
import { 
  promoteToAdmin, 
  demoteToMember, 
  removeWorkspaceMember 
} from '@/lib/firebase/workspaceMembers';

// Promouvoir en admin
await promoteToAdmin(workspaceId, userId);

// Rétrograder en membre
await demoteToMember(workspaceId, userId);

// Retirer du workspace
await removeWorkspaceMember(workspaceId, userId);
```

### 5. Utiliser les hooks React

#### Hook de contexte workspace

```typescript
import { WorkspaceProvider, useWorkspace } from '@/hooks/useWorkspace';

// Dans _app.tsx
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <Component {...pageProps} />
      </WorkspaceProvider>
    </AuthProvider>
  );
}

// Dans un composant
function MyComponent() {
  const { 
    currentWorkspace, 
    userWorkspaces, 
    userRole, 
    switchWorkspace 
  } = useWorkspace();

  if (userRole === 'admin') {
    // Afficher les options admin
  }
}
```

#### Hook pour les membres

```typescript
import { 
  useWorkspaceMembers, 
  useIsWorkspaceAdmin,
  useWorkspaceMemberActions 
} from '@/hooks/useWorkspaceMembers';

function MembersPage() {
  const { members, isLoading, refresh } = useWorkspaceMembers(workspaceId);
  const { isAdmin } = useIsWorkspaceAdmin(workspaceId, userId);
  const { addMember, removeMember, changeMemberRole } = useWorkspaceMemberActions(workspaceId);

  // Utiliser les membres et actions...
}
```

### 6. Travailler avec les données

```typescript
import { 
  createUserData, 
  getWorkspaceData,
  updateUserData 
} from '@/lib/firebase/userData';

// Créer des données dans le workspace
const dataId = await createUserData(
  workspaceId,
  currentUserId,
  { name: "John Doe", age: 25 },
  "players",
  ["forward", "striker"]
);

// Récupérer toutes les données du workspace
const allData = await getWorkspaceData(workspaceId);

// Mettre à jour
await updateUserData(dataId, currentUserId, {
  dataCollected: { name: "John Doe", age: 26 }
});
```

### 7. Gérer les abonnements

```typescript
import { 
  getActiveSubscription,
  hasActiveSubscription,
  hasReachedMemberLimit 
} from '@/lib/firebase/subscriptions';

// Vérifier l'abonnement du workspace
const subscription = await getActiveSubscription(workspaceId);
const hasSubscription = await hasActiveSubscription(workspaceId);

// Vérifier la limite de membres
const reachedLimit = await hasReachedMemberLimit(workspaceId, currentMemberCount);
```

## 📊 Index Firestore

Tous les index nécessaires ont été définis dans `firestore.indexes.json` :

- `workspaces` : (ownerId, createdAt), (type, createdAt)
- `workspaceMembers` : (workspaceId, role, joinedAt), (userId, joinedAt)
- `workspaceInvitations` : (email, status, createdAt), (workspaceId, status, createdAt)
- `subscriptions` : (workspaceId, status, currentPeriodEnd)
- `userData` : (workspaceId, createdAt), (workspaceId, category, updatedAt)

**Pour déployer les index** :
```bash
firebase deploy --only firestore:indexes
```

## 🚀 Déploiement

### 1. Déployer les règles Firestore
```bash
firebase deploy --only firestore:rules
```

### 2. Déployer les index
```bash
firebase deploy --only firestore:indexes
```

### 3. Déployer tout
```bash
firebase deploy --only firestore
```

## ⚠️ Migration des données existantes

### Important : Données existantes

Si vous avez déjà des données dans les collections `subscriptions` et `userData`, vous devrez les migrer :

#### Script de migration suggéré

```typescript
// scripts/migrate-to-workspaces.ts

import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';

async function migrateUserDataToWorkspaces() {
  // 1. Pour chaque utilisateur existant, créer un workspace personnel
  const usersSnapshot = await getDocs(collection(db, 'users'));
  
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const userData = userDoc.data();
    
    // Créer un workspace personnel
    const workspaceId = await createWorkspace(userId, {
      name: `Workspace de ${userData.displayName || userData.email}`,
      type: 'personal'
    });
    
    // Migrer les subscriptions
    const subsSnapshot = await getDocs(
      query(collection(db, 'subscriptions'), where('userId', '==', userId))
    );
    
    for (const subDoc of subsSnapshot.docs) {
      const batch = writeBatch(db);
      const newSubRef = doc(collection(db, 'subscriptions'));
      batch.set(newSubRef, {
        ...subDoc.data(),
        workspaceId: workspaceId,
        managedBy: userId,
        // Retirer userId
      });
      batch.delete(subDoc.ref);
      await batch.commit();
    }
    
    // Migrer les userData
    const userDataSnapshot = await getDocs(
      query(collection(db, 'userData'), where('userId', '==', userId))
    );
    
    for (const dataDoc of userDataSnapshot.docs) {
      const batch = writeBatch(db);
      const newDataRef = doc(collection(db, 'userData'));
      batch.set(newDataRef, {
        ...dataDoc.data(),
        workspaceId: workspaceId,
        createdBy: userId,
        // Retirer userId
      });
      batch.delete(dataDoc.ref);
      await batch.commit();
    }
  }
}
```

**⚠️ ATTENTION** : Testez ce script sur un environnement de développement avant de l'exécuter en production !

## 📝 Étapes suivantes recommandées

1. **Interface utilisateur** :
   - Créer une page de sélection de workspace
   - Ajouter un sélecteur de workspace dans la navigation
   - Créer une page de gestion des membres
   - Créer une page de gestion des invitations

2. **Notifications par email** :
   - Implémenter l'envoi d'emails pour les invitations
   - Notifications pour les changements de rôle
   - Notifications pour les nouveaux membres

3. **Cloud Functions** :
   - Fonction pour nettoyer les invitations expirées
   - Fonction pour gérer les webhooks Stripe
   - Fonction pour valider les limites de membres selon l'abonnement

4. **Tests** :
   - Tests unitaires pour les fonctions Firestore
   - Tests d'intégration pour les règles de sécurité
   - Tests E2E pour les workflows utilisateur

5. **Amélioration UX** :
   - Loading states appropriés
   - Gestion des erreurs user-friendly
   - Confirmation pour les actions sensibles (retirer un membre, supprimer un workspace)

## 🐛 Points d'attention

1. **Dernier admin** : Impossible de retirer ou rétrograder le dernier admin d'un workspace
2. **Invitations expirées** : Les invitations expirent après 7 jours
3. **Limites de membres** : Vérifier les limites selon le plan d'abonnement
4. **Données orphelines** : Gérer les données quand un workspace est supprimé
5. **Performance** : Pagination recommandée pour les grandes listes de membres

## 📚 Ressources

- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [Règles de sécurité Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Index composites](https://firebase.google.com/docs/firestore/query-data/indexing)

---

**Version** : 1.0.0  
**Date** : 18 novembre 2025  
**Auteur** : Système de migration vers workspaces multi-tenant

