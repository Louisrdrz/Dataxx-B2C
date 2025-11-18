# Changelog - Système de Workspaces Multi-Tenant

**Date** : 18 novembre 2025  
**Version** : 2.0.0  
**Type** : Major Update - Breaking Changes

## 🎉 Nouveautés

### Architecture Multi-Tenant

Le système a été complètement refactorisé pour supporter des workspaces multi-utilisateurs. Les utilisateurs peuvent maintenant créer et rejoindre plusieurs espaces de travail partagés.

### Nouvelles Collections Firestore

#### 1. `workspaces`
Collection racine pour gérer les espaces de travail partagés.
- Création de workspaces (clubs, athlètes, personnels)
- Paramètres de workspace (visibilité, permissions)
- Comptage automatique des membres

#### 2. `workspaceMembers`
Gestion des relations utilisateur-workspace avec système de rôles.
- Rôles : admin et member
- Plusieurs admins possibles par workspace
- Métadonnées dénormalisées pour performance

#### 3. `workspaceInvitations`
Système d'invitations avec expiration automatique.
- Invitations par email
- Expiration après 7 jours
- Statuts : pending, accepted, declined, expired, cancelled

### Nouveaux Fichiers

#### Librairies Firebase (`lib/firebase/`)

**`workspaces.ts`** - Gestion complète des workspaces
- `createWorkspace()` - Créer un workspace
- `getWorkspace()` - Récupérer un workspace
- `getUserWorkspaces()` - Liste des workspaces d'un utilisateur
- `updateWorkspace()` - Modifier un workspace
- `deleteWorkspace()` - Supprimer un workspace
- `isWorkspaceAdmin()` - Vérifier le rôle admin
- `isWorkspaceMember()` - Vérifier l'appartenance

**`workspaceMembers.ts`** - Gestion des membres
- `addWorkspaceMember()` - Ajouter un membre
- `getWorkspaceMembers()` - Liste des membres
- `getWorkspaceAdmins()` - Liste des admins
- `updateMemberRole()` - Changer le rôle
- `promoteToAdmin()` - Promouvoir en admin
- `demoteToMember()` - Rétrograder en membre
- `removeWorkspaceMember()` - Retirer un membre
- `leaveWorkspace()` - Quitter un workspace
- Protection du dernier admin

**`invitations.ts`** - Système d'invitations
- `createInvitation()` - Créer une invitation
- `getInvitation()` - Récupérer une invitation
- `getWorkspaceInvitations()` - Liste des invitations d'un workspace
- `getInvitationsForEmail()` - Invitations pour un email
- `acceptInvitation()` - Accepter une invitation
- `declineInvitation()` - Refuser une invitation
- `cancelInvitation()` - Annuler une invitation
- `resendInvitation()` - Renvoyer une invitation
- `markExpiredInvitations()` - Marquer comme expirées
- `cleanupOldInvitations()` - Nettoyer les anciennes

#### Hooks React (`hooks/`)

**`useWorkspace.tsx`** - Contexte et hooks pour workspaces
- `WorkspaceProvider` - Provider React Context
- `useWorkspace()` - Hook principal pour le workspace actif
- `useUserWorkspaces()` - Liste des workspaces
- `useWorkspaceById()` - Workspace spécifique
- Gestion du workspace actif
- Changement de workspace

**`useWorkspaceMembers.tsx`** - Hooks pour les membres
- `useWorkspaceMembers()` - Liste des membres
- `useWorkspaceAdmins()` - Liste des admins
- `useWorkspaceMember()` - Membre spécifique
- `useIsWorkspaceAdmin()` - Vérifier admin
- `useIsWorkspaceMember()` - Vérifier membre
- `useWorkspaceMemberActions()` - Actions sur membres
- `useUserRole()` - Rôle de l'utilisateur
- `useCurrentUserWorkspaceRole()` - Infos complètes de rôle

#### Documentation

**`WORKSPACE_SYSTEM.md`** - Documentation complète du système
- Architecture et concepts
- Structure des données
- Règles de sécurité
- Exemples de code
- Guide d'utilisation

**`WORKSPACE_DEPLOYMENT.md`** - Guide de déploiement
- Checklist de déploiement
- Script de migration
- Tests de validation
- Procédure de rollback

**`CHANGELOG_WORKSPACES.md`** - Ce fichier

## 🔄 Modifications de fichiers existants

### `types/firestore.ts`

**Ajouté** :
- `WorkspaceRole` - Type pour les rôles ('admin' | 'member')
- `Workspace` - Interface pour workspaces
- `WorkspaceMember` - Interface pour membres
- `WorkspaceInvitation` - Interface pour invitations

**Modifié** :
- `User` : 
  - Retiré `activeSubscriptionId`
  - Ajouté `defaultWorkspaceId`
- `Subscription` :
  - Changé `userId` → `workspaceId`
  - Ajouté `managedBy` (admin qui gère)
  - Ajouté `maxMembers` (limite de membres)
- `UserData` :
  - Changé `userId` → `workspaceId`
  - Ajouté `createdBy`
  - Ajouté `updatedBy`

### `firestore.rules`

**Réécriture complète** des règles de sécurité :

**Nouvelles fonctions helper** :
- `isWorkspaceMember(workspaceId)` - Vérifie l'appartenance
- `isWorkspaceAdmin(workspaceId)` - Vérifie le rôle admin
- `hasWorkspaceRole(workspaceId, role)` - Vérifie un rôle spécifique

**Nouvelles règles** :
- `workspaces` - CRUD avec permissions par rôle
- `workspaceMembers` - Gestion des membres
- `workspaceInvitations` - Système d'invitations

**Règles modifiées** :
- `subscriptions` - Permissions basées sur workspace
- `userData` - Permissions basées sur workspace

### `firestore.indexes.json`

**Nouveaux index** :
- `workspaces` :
  - (ownerId, createdAt)
  - (type, createdAt)
- `workspaceMembers` :
  - (workspaceId, role, joinedAt)
  - (userId, joinedAt)
  - (workspaceId, joinedAt)
- `workspaceInvitations` :
  - (email, status, createdAt)
  - (workspaceId, status, createdAt)
  - (invitedBy, createdAt)

**Index modifiés** :
- `subscriptions` : userId → workspaceId
- `userData` : userId → workspaceId

### `lib/firebase/subscriptions.ts`

**Changements majeurs** :
- Toutes les fonctions utilisent maintenant `workspaceId` au lieu de `userId`
- `getActiveSubscription(workspaceId)` - Pour un workspace
- `getWorkspaceSubscriptions(workspaceId)` - Liste pour workspace
- `hasActiveSubscription(workspaceId)` - Vérification workspace

**Nouvelles fonctions** :
- `canManageSubscription(workspaceId, userId)` - Vérifier droits
- `getSubscriptionsManagedByUser(userId)` - Subs gérées par user
- `hasReachedMemberLimit(workspaceId, count)` - Limite membres
- `getMaxMembersAllowed(workspaceId)` - Limite autorisée

### `lib/firebase/userData.ts`

**Changements majeurs** :
- Toutes les fonctions utilisent maintenant `workspaceId` au lieu de `userId`
- `createUserData(workspaceId, createdBy, ...)` - Ajout createdBy
- `getWorkspaceData(workspaceId)` - Données du workspace
- `getWorkspaceDataByCategory(workspaceId, category)` - Par catégorie
- `updateUserData(dataId, userId, updates)` - Ajout userId (updatedBy)

**Nouvelles fonctions** :
- `getDataCreatedByUser(workspaceId, userId)` - Par créateur
- `countWorkspaceData(workspaceId)` - Comptage
- `getRecentlyUpdatedData(workspaceId, limit)` - Récents
- `deleteAllWorkspaceData(workspaceId)` - Suppression en masse

## ⚠️ Breaking Changes

### 1. Structure de données

**Les collections suivantes ont changé de structure** :
- `subscriptions` : Le champ `userId` est remplacé par `workspaceId`
- `userData` : Le champ `userId` est remplacé par `workspaceId`

**Action requise** : Migration des données existantes (voir `WORKSPACE_DEPLOYMENT.md`)

### 2. API Functions

**Signatures modifiées** :
```typescript
// AVANT
getActiveSubscription(userId: string)
getAllUserData(userId: string)

// APRÈS
getActiveSubscription(workspaceId: string)
getWorkspaceData(workspaceId: string)
```

**Action requise** : Mettre à jour tous les appels dans l'application

### 3. Règles de sécurité

**Les règles ont été complètement réécrites** :
- L'accès aux `subscriptions` nécessite maintenant d'être admin du workspace
- L'accès aux `userData` nécessite d'être membre du workspace

**Action requise** : Déployer les nouvelles règles après migration

### 4. Hooks React

**Nouveaux hooks requis** :
- `WorkspaceProvider` doit envelopper l'application
- `useWorkspace()` remplace l'accès direct à `userId` pour les données

**Action requise** :
```typescript
// Dans _app.tsx
<WorkspaceProvider>
  <Component {...pageProps} />
</WorkspaceProvider>

// Dans les composants
const { currentWorkspace } = useWorkspace();
```

## 🐛 Corrections

- Protection contre la suppression du dernier admin
- Validation des invitations expirées
- Gestion atomique avec batch writes
- Vérification des limites de membres

## 🔒 Sécurité

### Nouvelles protections

- Vérification de l'appartenance au workspace pour toutes les opérations
- Permissions granulaires par rôle (admin/member)
- Validation côté serveur des règles métier
- Protection contre la suppression du dernier admin
- Expiration automatique des invitations (7 jours)

### Règles de sécurité renforcées

- Impossible d'accéder aux données d'un workspace sans être membre
- Impossible de modifier un abonnement sans être admin
- Impossible d'inviter sans être admin
- Validation des emails pour les invitations

## 📊 Performance

### Optimisations

- Dénormalisation des données utilisateur dans `workspaceMembers`
- Index composites pour toutes les requêtes fréquentes
- Batch writes pour les opérations multiples
- Comptage des membres stocké dans le workspace

### Nouveaux index

9 nouveaux index composites ajoutés pour optimiser :
- Récupération des membres par workspace et rôle
- Récupération des workspaces par utilisateur
- Filtrage des invitations par email et statut
- Requêtes sur subscriptions et userData par workspace

## 🔄 Migration

### Avant la migration

1. ✅ Créer un backup complet des données
2. ✅ Tester la migration en environnement de développement
3. ✅ Informer les utilisateurs de la maintenance

### Après la migration

1. ✅ Vérifier que tous les utilisateurs ont au moins un workspace
2. ✅ Vérifier que toutes les subscriptions sont migrées
3. ✅ Vérifier que toutes les userData sont migrées
4. ✅ Tester les fonctionnalités principales
5. ✅ Surveiller les logs pour les erreurs

## 📝 Notes de version

### Version 2.0.0 (Actuelle)

**Fonctionnalités principales** :
- ✅ Système de workspaces multi-tenant
- ✅ Gestion des membres avec rôles
- ✅ Système d'invitations par email
- ✅ Migration des abonnements au niveau workspace
- ✅ Migration des données au niveau workspace

**Limitations connues** :
- Les invitations par email nécessitent une Cloud Function (TODO)
- Le nettoyage automatique des invitations expirées nécessite un cron job (TODO)
- L'interface utilisateur pour les workspaces doit être créée (TODO)

### Prochaines versions

**v2.1.0** (À venir)
- Interface UI complète pour les workspaces
- Notifications par email pour les invitations
- Cloud Functions pour les webhooks Stripe

**v2.2.0** (À venir)
- Permissions avancées personnalisables
- Audit logs pour les actions workspace
- Statistiques et analytics par workspace

## 🆘 Support

### En cas de problème

1. Consultez `WORKSPACE_SYSTEM.md` pour la documentation
2. Consultez `WORKSPACE_DEPLOYMENT.md` pour le déploiement
3. Vérifiez les logs Firebase : `firebase functions:log`
4. Vérifiez la console Firebase pour les erreurs de permissions

### Rollback

Si nécessaire, voir la section "Rollback" dans `WORKSPACE_DEPLOYMENT.md`

## 👥 Contributeurs

- Système de migration développé pour Dataxx B2C
- Date : 18 novembre 2025

---

**Pour plus d'informations** : Voir `WORKSPACE_SYSTEM.md`

