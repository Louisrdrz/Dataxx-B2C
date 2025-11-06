# Configuration Firestore et Espace Personnel

## 📋 Résumé

Cette documentation détaille la configuration complète de Firestore pour l'application Dataxx B2C, incluant :
- ✅ Règles de sécurité Firestore déployées
- ✅ Index Firestore déployés
- ✅ Page d'espace personnel créée
- ✅ Système d'authentification configuré

## 🔒 Règles de Sécurité Firestore

Les règles de sécurité ont été déployées sur le projet **dataxxb2c-1bc3f** et couvrent les collections suivantes :

### Collections principales

#### 1. **users** - Profils utilisateurs
- **Lecture** : Un utilisateur peut lire uniquement son propre document
- **Création** : Lors de la première connexion, avec validation de l'email
- **Mise à jour** : L'utilisateur peut modifier son profil, mais pas les champs sensibles (uid, email, createdAt)
- **Suppression** : Interdite (soft delete recommandé)

#### 2. **users/{userId}/profile** - Profil détaillé (sous-collection)
- **Lecture** : Un utilisateur peut lire uniquement son propre profil
- **Création** : Un utilisateur peut créer son profil
- **Mise à jour** : Un utilisateur peut modifier son profil
- **Suppression** : Interdite

#### 3. **subscriptions** - Abonnements Stripe
- **Lecture** : Un utilisateur peut lire uniquement son propre abonnement
- **Création/Mise à jour** : Uniquement par Cloud Functions (webhooks Stripe)
- **Suppression** : Interdite

#### 4. **userData** - Données collectées par les utilisateurs
- **Lecture** : Un utilisateur peut lire uniquement ses propres données
- **Création** : Un utilisateur peut créer ses propres données
- **Mise à jour** : Un utilisateur peut modifier ses propres données
- **Suppression** : Un utilisateur peut supprimer ses propres données

#### 5. **auditLogs** - Logs d'audit
- **Lecture** : Un utilisateur peut lire uniquement ses propres logs
- **Création/Mise à jour** : Uniquement par Cloud Functions
- **Suppression** : Interdite

#### 6. **userSessions** - Sessions utilisateur
- **Lecture** : Un utilisateur peut lire uniquement ses propres sessions
- **Création** : Un utilisateur peut créer ses propres sessions
- **Mise à jour** : Un utilisateur peut modifier ses propres sessions
- **Suppression** : Interdite

#### 7. **appSettings** - Paramètres de l'application
- **Lecture** : Tous les utilisateurs authentifiés
- **Création/Mise à jour** : Uniquement par les admins (Cloud Functions)
- **Suppression** : Interdite

### Fonctions helper

```javascript
// Vérifier si l'utilisateur est authentifié
function isAuthenticated() {
  return request.auth != null;
}

// Vérifier si l'utilisateur est le propriétaire
function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}
```

## 📊 Index Firestore

Les index suivants ont été déployés pour optimiser les requêtes :

### 1. Index sur **users**
- Champs : `email` (ASC), `createdAt` (DESC)
- Usage : Recherche d'utilisateurs par email

### 2. Index sur **subscriptions** (Status)
- Champs : `userId` (ASC), `status` (ASC), `currentPeriodEnd` (DESC)
- Usage : Requêtes sur les abonnements actifs

### 3. Index sur **subscriptions** (Customer)
- Champs : `stripeCustomerId` (ASC), `createdAt` (DESC)
- Usage : Recherche par ID client Stripe

### 4. Index sur **userData** (Basic)
- Champs : `userId` (ASC), `createdAt` (DESC)
- Usage : Liste des données utilisateur par date

### 5. Index sur **userData** (Category)
- Champs : `userId` (ASC), `category` (ASC), `updatedAt` (DESC)
- Usage : Filtrage des données par catégorie

### 6. Index sur **auditLogs** (User)
- Champs : `userId` (ASC), `timestamp` (DESC)
- Usage : Logs d'audit par utilisateur

### 7. Index sur **auditLogs** (Resource)
- Champs : `resourceType` (ASC), `action` (ASC), `timestamp` (DESC)
- Usage : Filtrage des logs par type de ressource et action

### 8. Index sur **userSessions**
- Champs : `userId` (ASC), `startedAt` (DESC)
- Usage : Liste des sessions utilisateur

### 9. Index sur **profile** (sous-collection)
- Champs : `userId` (ASC), `updatedAt` (DESC)
- Usage : Profils utilisateurs par date de mise à jour

## 👤 Page d'Espace Personnel

### Nouvelle page : `/profile`

Une page complète de gestion du profil utilisateur a été créée avec les fonctionnalités suivantes :

#### Fonctionnalités
- ✅ Affichage des informations personnelles
- ✅ Édition du profil (prénom, nom, entreprise, poste, etc.)
- ✅ Gestion des préférences (langue, notifications)
- ✅ Affichage des informations du compte (email, date de création, dernière connexion)
- ✅ Protection par authentification (withAuth HOC)
- ✅ Interface moderne et responsive

#### Champs modifiables
- Prénom
- Nom
- Nom d'affichage
- Téléphone
- Entreprise
- Poste
- Langue (Français/English)
- Notifications (Email, Push)

#### Navigation
La page est accessible depuis le dashboard via le bouton "Mon Profil" dans la section "Actions rapides".

### Mise à jour du Dashboard

Le dashboard a été enrichi avec :
- Section "Actions rapides" avec 3 cartes cliquables :
  - 👤 Mon Profil
  - 💳 Abonnement
  - 📊 Mes Données
- Bouton "Modifier" sur la section "Informations du compte"

## 🚀 Déploiement

### Commandes utilisées

```bash
# Sélectionner le projet
firebase use dataxxb2c-1bc3f

# Déployer les règles Firestore
firebase deploy --only firestore:rules

# Déployer les index Firestore
firebase deploy --only firestore:indexes

# Déployer tout Firestore (règles + index)
firebase deploy --only firestore
```

### Statut du déploiement
- ✅ Règles déployées avec succès
- ✅ Index déployés avec succès
- ⚠️ Quelques warnings sur les fonctions non utilisées (non bloquant)

## 📁 Structure des fichiers

```
/Users/sixtine/Desktop/Dataxx-B2C/
├── firestore.rules          # Règles de sécurité Firestore
├── firestore.indexes.json   # Configuration des index
├── pages/
│   ├── dashboard.tsx        # Dashboard principal (mis à jour)
│   └── profile.tsx          # Nouvelle page de profil
├── lib/firebase/
│   ├── config.ts           # Configuration Firebase
│   ├── auth.ts             # Authentification
│   ├── users.ts            # Services utilisateurs
│   └── withAuth.tsx        # HOC de protection
└── types/
    └── firestore.ts        # Types TypeScript
```

## 🔐 Sécurité

### Principes appliqués
1. **Principe du moindre privilège** : Chaque utilisateur ne peut accéder qu'à ses propres données
2. **Validation des données** : Les champs sensibles (uid, email, createdAt) ne peuvent pas être modifiés
3. **Séparation des responsabilités** : Les actions critiques (abonnements, logs) sont gérées par Cloud Functions
4. **Audit trail** : Toutes les actions importantes sont enregistrées dans auditLogs

### Recommandations
- ⚠️ Implémenter des Cloud Functions pour gérer les abonnements Stripe
- ⚠️ Mettre en place un système de logs d'audit automatique
- ⚠️ Ajouter une vérification d'email obligatoire avant certaines actions
- ⚠️ Configurer des backups réguliers de Firestore

## 🧪 Tests

### Tests manuels recommandés
1. ✅ Créer un compte utilisateur
2. ✅ Se connecter avec ce compte
3. ✅ Accéder au dashboard
4. ✅ Cliquer sur "Mon Profil"
5. ✅ Modifier les informations personnelles
6. ✅ Vérifier que les données sont bien sauvegardées
7. ✅ Vérifier que l'utilisateur ne peut pas accéder aux données d'un autre utilisateur

### Tests de sécurité
```javascript
// Depuis la console Firebase (Firestore > Rules > Playground)
// Test 1 : Un utilisateur peut lire son propre document
// Match: /users/{userId}
// Auth: uid = userId

// Test 2 : Un utilisateur ne peut pas lire le document d'un autre utilisateur
// Match: /users/{otherUserId}
// Auth: uid != otherUserId

// Test 3 : Un utilisateur ne peut pas modifier l'email d'un autre utilisateur
// Match: /users/{userId}
// Operation: update
// Auth: uid = userId
// Data: email = "newemail@example.com" (devrait échouer si différent de l'email actuel)
```

## 📞 Support

### Console Firebase
- URL : https://console.firebase.google.com/project/dataxxb2c-1bc3f/overview
- Firestore : https://console.firebase.google.com/project/dataxxb2c-1bc3f/firestore
- Authentication : https://console.firebase.google.com/project/dataxxb2c-1bc3f/authentication

### Commandes utiles
```bash
# Voir le projet actuel
firebase projects:list

# Voir les règles actuelles
firebase firestore:rules

# Tester les règles localement
firebase emulators:start --only firestore
```

## 🎉 Prochaines étapes

1. **Intégration Stripe** : Implémenter les webhooks pour gérer les abonnements
2. **Cloud Functions** : Créer des fonctions pour les actions critiques
3. **Tests unitaires** : Écrire des tests pour les règles Firestore
4. **Monitoring** : Mettre en place des alertes sur les erreurs de sécurité
5. **Documentation API** : Documenter les endpoints et les schémas de données

---

**Date de configuration** : 6 novembre 2025  
**Projet** : dataxxb2c-1bc3f  
**Environnement** : Production
