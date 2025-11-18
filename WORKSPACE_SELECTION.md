# Système de Sélection de Workspace

## 📋 Vue d'ensemble

Le système de workspace permet aux utilisateurs de :
- **Créer et gérer plusieurs workspaces**
- **Choisir quel workspace utiliser** à chaque connexion
- **Définir un workspace par défaut** pour une connexion automatique
- **Changer de workspace facilement** depuis le dashboard

## 🔄 Flux de connexion amélioré

### Ancien flux (problématique)
```
Login → Onboarding → Dashboard
```
- Problème : L'utilisateur devait recréer un workspace à chaque connexion
- Aucune possibilité de choisir entre plusieurs workspaces

### Nouveau flux (solution)
```
Login → Select Workspace → Dashboard
```

#### Détails du flux :

1. **Connexion** (`/login`)
   - L'utilisateur se connecte avec email/mot de passe ou Google
   - Redirection vers `/select-workspace`

2. **Sélection de Workspace** (`/select-workspace`)
   - **Si l'utilisateur n'a aucun workspace** : Redirection automatique vers `/onboarding`
   - **Si l'utilisateur a un workspace par défaut défini** : Redirection automatique vers `/dashboard`
   - **Si l'utilisateur a des workspaces mais aucun par défaut** : Affichage de la page de sélection
   
   Sur cette page, l'utilisateur peut :
   - Voir tous ses workspaces
   - Sélectionner le workspace à utiliser
   - Cocher "Se souvenir de mon choix" pour définir un workspace par défaut
   - Créer un nouveau workspace

3. **Dashboard** (`/dashboard`)
   - L'utilisateur accède au dashboard avec le workspace sélectionné
   - Un **sélecteur de workspace** est affiché dans le header
   - L'utilisateur peut changer de workspace à tout moment

## 🎯 Fonctionnalités principales

### 1. Workspace par défaut

Un utilisateur peut définir un **workspace par défaut** qui sera chargé automatiquement à chaque connexion.

**Comment définir un workspace par défaut :**
- **Option A** : Sur la page `/select-workspace`, cocher "Se souvenir de mon choix" avant de sélectionner
- **Option B** : Sur la page `/my-workspaces`, cliquer sur "⭐ Définir par défaut" pour chaque workspace

**Stockage :**
- Le workspace par défaut est stocké dans le champ `defaultWorkspaceId` du document utilisateur dans Firestore
- Collection : `users`
- Champ : `defaultWorkspaceId` (string | null)

### 2. Page de sélection de workspace (`/select-workspace`)

**Fonctionnalités :**
- Liste tous les workspaces de l'utilisateur
- Affiche une étoile ⭐ pour le workspace par défaut actuel
- Permet de sélectionner un workspace
- Option "Se souvenir de mon choix" pour définir un workspace par défaut
- Bouton pour créer un nouveau workspace
- Lien vers la page de gestion des workspaces

**Comportement automatique :**
- Si l'utilisateur a un `defaultWorkspaceId` valide : Redirection automatique vers `/dashboard`
- Si l'utilisateur n'a aucun workspace : Redirection vers `/onboarding`
- Pour forcer l'affichage de la page de sélection : Ajouter `?force=true` dans l'URL

### 3. Page de gestion des workspaces (`/my-workspaces`)

**Nouvelles fonctionnalités :**
- Badge "⭐ Par défaut" pour identifier le workspace par défaut
- Bouton "⭐ Définir par défaut" pour chaque workspace (sauf celui déjà par défaut)
- Bouton "🚀 Accéder au workspace" pour aller directement au dashboard

**Fonctionnalités existantes :**
- Voir tous les workspaces
- Afficher le rôle (Admin / Membre)
- Créer un nouveau workspace
- Importer des données Google
- Gérer les membres (pour les admins)

### 4. Sélecteur de workspace dans le Dashboard

Un menu déroulant dans le header du dashboard permet de :
- Voir le workspace actuellement actif
- Voir tous les workspaces disponibles
- Identifier le workspace par défaut (étoile ⭐)
- Créer un nouveau workspace
- Accéder à la page de gestion des workspaces

## 🗂️ Structure des données

### Collection `users`
```typescript
interface User {
  uid: string;
  email: string;
  // ... autres champs ...
  
  // Nouveau champ
  defaultWorkspaceId?: string; // ID du workspace par défaut
}
```

### Collection `workspaces`
```typescript
interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  type: 'club' | 'athlete' | 'personal' | 'other';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  memberCount?: number;
  // ... autres champs ...
}
```

### Collection `workspaceMembers`
```typescript
interface WorkspaceMember {
  id: string; // Format: {workspaceId}_{userId}
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Timestamp;
  // ... autres champs ...
}
```

## 🔧 Fonctions principales

### `setDefaultWorkspace(userId: string, workspaceId: string | null)`

**Fichier :** `lib/firebase/users.ts`

Définit ou supprime le workspace par défaut d'un utilisateur.

```typescript
// Définir un workspace par défaut
await setDefaultWorkspace(userId, workspaceId);

// Supprimer le workspace par défaut
await setDefaultWorkspace(userId, null);
```

### `getUserWorkspaces(userId: string)`

**Fichier :** `lib/firebase/workspaces.ts`

Récupère tous les workspaces dont l'utilisateur est membre.

```typescript
const workspaces = await getUserWorkspaces(userId);
```

## 📱 Expérience utilisateur

### Première connexion (nouvel utilisateur)
1. Login → Redirection vers `/select-workspace`
2. Aucun workspace trouvé → Redirection vers `/onboarding`
3. Création du premier workspace
4. Redirection vers `/dashboard`

### Connexion avec workspace par défaut
1. Login → Redirection vers `/select-workspace`
2. Workspace par défaut détecté → Redirection automatique vers `/dashboard`
3. L'utilisateur est connecté à son workspace par défaut

### Connexion sans workspace par défaut
1. Login → Redirection vers `/select-workspace`
2. Affichage de la liste des workspaces
3. Sélection d'un workspace (avec option "Se souvenir")
4. Redirection vers `/dashboard`

### Changement de workspace
1. Depuis le dashboard, cliquer sur le sélecteur de workspace
2. **Option A** : Cliquer sur "⚙️ Gérer mes workspaces"
3. Sur `/my-workspaces`, choisir un workspace et :
   - Cliquer sur "⭐ Définir par défaut" pour le définir comme défaut
   - Cliquer sur "🚀 Accéder au workspace" pour y accéder directement

## 🎨 Interfaces utilisateur

### Page de sélection (`/select-workspace`)
- Design moderne avec dégradé de couleurs
- Cards cliquables pour chaque workspace
- Indicateurs visuels :
  - Badge "⭐ Par défaut" pour le workspace par défaut
  - Badge "✓ Sélectionné" pour le workspace sélectionné
  - Radio button visuel pour la sélection
- Checkbox "Se souvenir de mon choix"
- Boutons d'action :
  - "🚀 Accéder à ce workspace" (principal)
  - "➕ Créer un nouveau workspace" (secondaire)

### Dashboard avec sélecteur
- Sélecteur de workspace dans le header
- Affichage du workspace actif : "📁 {nom}"
- Menu déroulant avec :
  - Liste de tous les workspaces
  - Étoile ⭐ pour le workspace par défaut
  - Option "➕ Créer un nouveau workspace"
  - Option "⚙️ Gérer mes workspaces"

### Page de gestion (`/my-workspaces`)
- Cards pour chaque workspace avec :
  - Badges : "👑 Admin" / "👤 Membre" / "⭐ Par défaut"
  - Informations : Type, Date de création, ID
  - Actions :
    - "🚀 Accéder au workspace" (principal)
    - "⭐ Définir par défaut" (si pas déjà défini)
    - "📊 Importer des données"
    - "👥 Gérer les membres" (admins uniquement)

## 🐛 Points d'attention

### Gestion des cas limites

1. **Workspace par défaut supprimé**
   - Si le `defaultWorkspaceId` pointe vers un workspace qui n'existe plus ou dont l'utilisateur n'est plus membre
   - Solution : La page `/select-workspace` détecte automatiquement et affiche la liste des workspaces

2. **Aucun workspace**
   - Si l'utilisateur n'a aucun workspace
   - Solution : Redirection automatique vers `/onboarding` pour créer le premier workspace

3. **Force selection**
   - Pour forcer l'affichage de la page de sélection même avec un workspace par défaut
   - Utiliser : `/select-workspace?force=true`

## 🚀 Prochaines améliorations possibles

- [ ] Ajouter la possibilité de changer de workspace directement depuis le menu déroulant du dashboard (sans passer par /my-workspaces)
- [ ] Mémoriser le dernier workspace utilisé (même si pas défini comme défaut)
- [ ] Ajouter des raccourcis clavier pour changer de workspace
- [ ] Afficher les dernières activités de chaque workspace dans la page de sélection
- [ ] Ajouter la possibilité de marquer des workspaces comme "favoris"
- [ ] Implémenter un système de recherche pour les utilisateurs avec beaucoup de workspaces

## 📝 Notes techniques

### Performances
- Les workspaces sont chargés une seule fois au montage du composant
- Le hook `useUserWorkspaces` gère automatiquement le cache
- Pas de re-fetch inutile lors des changements de page

### Sécurité
- Vérification côté client ET serveur (Firestore Rules)
- L'utilisateur ne peut accéder qu'aux workspaces dont il est membre
- Les rôles sont vérifiés avant chaque action sensible

### Accessibilité
- Tous les boutons ont des labels clairs
- Navigation au clavier supportée
- Indicateurs visuels multiples (couleurs, icônes, texte)

## 📞 Support

En cas de problème avec le système de workspace :
1. Vérifier la console du navigateur pour les erreurs
2. Vérifier Firestore pour la présence du champ `defaultWorkspaceId` dans le document utilisateur
3. Vérifier que l'utilisateur est bien membre du workspace (collection `workspaceMembers`)
4. Utiliser `/select-workspace?force=true` pour déboguer

