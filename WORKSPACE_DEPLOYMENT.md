# Guide de Déploiement - Système de Workspaces

## ✅ Checklist de déploiement

### 1. Vérification des fichiers modifiés

Les fichiers suivants ont été créés ou modifiés :

**Nouveaux fichiers** :
- ✅ `lib/firebase/workspaces.ts` - Gestion CRUD des workspaces
- ✅ `lib/firebase/workspaceMembers.ts` - Gestion des membres
- ✅ `lib/firebase/invitations.ts` - Système d'invitations
- ✅ `hooks/useWorkspace.tsx` - Hook React pour workspaces
- ✅ `hooks/useWorkspaceMembers.tsx` - Hook React pour membres
- ✅ `WORKSPACE_SYSTEM.md` - Documentation complète
- ✅ `WORKSPACE_DEPLOYMENT.md` - Ce guide

**Fichiers modifiés** :
- ✅ `types/firestore.ts` - Types ajoutés et modifiés
- ✅ `firestore.rules` - Règles de sécurité réécrites
- ✅ `firestore.indexes.json` - Index ajoutés
- ✅ `lib/firebase/subscriptions.ts` - Adapté aux workspaces
- ✅ `lib/firebase/userData.ts` - Adapté aux workspaces

### 2. Étapes de déploiement

#### Étape 1 : Tester localement (RECOMMANDÉ)

Avant de déployer en production, testez avec l'émulateur Firebase :

```bash
# Installer les émulateurs si nécessaire
firebase init emulators

# Démarrer les émulateurs
firebase emulators:start --only firestore
```

#### Étape 2 : Déployer les index Firestore

Les index doivent être déployés **en premier** car certaines requêtes en dépendent :

```bash
firebase deploy --only firestore:indexes
```

⏱️ **Attention** : La création des index peut prendre plusieurs minutes. Surveillez l'état dans la console Firebase.

#### Étape 3 : Déployer les règles de sécurité

```bash
firebase deploy --only firestore:rules
```

⚠️ **IMPORTANT** : Une fois les règles déployées, l'ancien système utilisateur cessera de fonctionner. Assurez-vous d'avoir migré les données d'abord !

#### Étape 4 : Vérifier le déploiement

Vérifiez dans la console Firebase que :
- Les index sont en cours de création (statut "Building")
- Les règles ont été mises à jour

### 3. Migration des données (CRITIQUE)

⚠️ **AVANT** de déployer les nouvelles règles, vous devez migrer les données existantes.

#### Option A : Environnement de test (RECOMMANDÉ)

1. Créez un projet Firebase de test
2. Copiez vos données existantes
3. Testez le script de migration
4. Vérifiez que tout fonctionne
5. Appliquez ensuite en production

#### Option B : Migration en production

**Créez d'abord un backup** :

```bash
# Exporter toutes les collections
gcloud firestore export gs://[BUCKET_NAME]/backup-$(date +%Y%m%d)
```

**Script de migration** :

```typescript
// scripts/migrate-to-workspaces.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';
import { createWorkspace } from '@/lib/firebase/workspaces';

// Initialiser Firebase Admin (côté serveur)
const db = getFirestore();

async function migrateToWorkspaces() {
  console.log('🚀 Début de la migration...');
  
  const usersSnapshot = await getDocs(collection(db, 'users'));
  let migratedCount = 0;
  
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const userData = userDoc.data();
    
    console.log(`📝 Migration de l'utilisateur: ${userData.email}`);
    
    try {
      // 1. Créer un workspace personnel
      const workspaceId = await createWorkspace(userId, {
        name: `Workspace de ${userData.displayName || userData.email}`,
        type: 'personal'
      });
      
      console.log(`  ✅ Workspace créé: ${workspaceId}`);
      
      // 2. Migrer les subscriptions
      const subsQuery = query(
        collection(db, 'subscriptions'),
        where('userId', '==', userId)
      );
      const subsSnapshot = await getDocs(subsQuery);
      
      if (!subsSnapshot.empty) {
        const batch = writeBatch(db);
        
        for (const subDoc of subsSnapshot.docs) {
          const oldData = subDoc.data();
          const newSubRef = doc(collection(db, 'subscriptions_new'));
          
          batch.set(newSubRef, {
            ...oldData,
            workspaceId: workspaceId,
            managedBy: userId,
            // Ne pas inclure userId dans le nouveau document
          });
        }
        
        await batch.commit();
        console.log(`  ✅ ${subsSnapshot.size} subscription(s) migrée(s)`);
      }
      
      // 3. Migrer les userData
      const userDataQuery = query(
        collection(db, 'userData'),
        where('userId', '==', userId)
      );
      const userDataSnapshot = await getDocs(userDataQuery);
      
      if (!userDataSnapshot.empty) {
        const batch = writeBatch(db);
        
        for (const dataDoc of userDataSnapshot.docs) {
          const oldData = dataDoc.data();
          const newDataRef = doc(collection(db, 'userData_new'));
          
          batch.set(newDataRef, {
            ...oldData,
            workspaceId: workspaceId,
            createdBy: userId,
            updatedBy: userId,
            // Ne pas inclure userId dans le nouveau document
          });
        }
        
        await batch.commit();
        console.log(`  ✅ ${userDataSnapshot.size} userData migrée(s)`);
      }
      
      migratedCount++;
      
    } catch (error) {
      console.error(`  ❌ Erreur pour ${userData.email}:`, error);
    }
  }
  
  console.log(`\n✅ Migration terminée: ${migratedCount}/${usersSnapshot.size} utilisateurs`);
  console.log('\n⚠️ IMPORTANT: Vérifiez les données avant de supprimer les anciennes collections !');
}

// Exécuter la migration
migrateToWorkspaces()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
```

**Exécuter la migration** :

```bash
# Créer le fichier de migration
npm install -g ts-node
ts-node scripts/migrate-to-workspaces.ts
```

### 4. Après la migration

#### 4.1 Vérifier les données migrées

```typescript
// Vérifier que tous les utilisateurs ont un workspace
const users = await getDocs(collection(db, 'users'));
for (const user of users.docs) {
  const workspaces = await getUserWorkspaces(user.id);
  if (workspaces.length === 0) {
    console.error(`❌ Utilisateur sans workspace: ${user.data().email}`);
  } else {
    console.log(`✅ ${user.data().email}: ${workspaces.length} workspace(s)`);
  }
}
```

#### 4.2 Renommer les collections

Une fois que vous êtes certain que la migration a fonctionné :

```bash
# Dans la console Firebase, renommer :
# subscriptions -> subscriptions_old
# userData -> userData_old
# subscriptions_new -> subscriptions
# userData_new -> userData
```

⚠️ **Attention** : Firestore ne permet pas de renommer directement. Vous devrez :
1. Exporter les données
2. Supprimer les anciennes collections
3. Réimporter avec les nouveaux noms

Ou simplement :
1. Copier manuellement les documents via la console
2. Vérifier
3. Supprimer les anciennes collections

#### 4.3 Nettoyer les anciennes collections

Après quelques semaines de vérification en production :

```bash
# Supprimer les anciennes collections (IRRÉVERSIBLE!)
# Faites cela manuellement via la console Firebase
```

### 5. Mettre à jour l'application

#### 5.1 Intégrer le WorkspaceProvider

Dans `pages/_app.tsx` :

```typescript
import { WorkspaceProvider } from '@/hooks/useWorkspace';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <Component {...pageProps} />
      </WorkspaceProvider>
    </AuthProvider>
  );
}
```

#### 5.2 Adapter les composants existants

Tous les composants qui utilisent `userData` ou `subscriptions` doivent être adaptés :

**Avant** :
```typescript
const data = await getUserData(userId);
const subscription = await getActiveSubscription(userId);
```

**Après** :
```typescript
const { currentWorkspace } = useWorkspace();
const data = await getWorkspaceData(currentWorkspace.id);
const subscription = await getActiveSubscription(currentWorkspace.id);
```

### 6. Créer les pages UI

**Pages recommandées à créer** :

1. **`pages/workspaces/index.tsx`** - Liste des workspaces
2. **`pages/workspaces/[id]/settings.tsx`** - Paramètres du workspace
3. **`pages/workspaces/[id]/members.tsx`** - Gestion des membres
4. **`pages/workspaces/[id]/invitations.tsx`** - Gestion des invitations
5. **`components/WorkspaceSwitcher.tsx`** - Sélecteur de workspace dans la navigation

### 7. Tests de validation

Après le déploiement, testez ces scénarios :

✅ **Création de workspace**
- Un utilisateur peut créer un nouveau workspace
- Il devient automatiquement admin

✅ **Invitations**
- Un admin peut inviter un nouvel utilisateur
- L'invitation expire après 7 jours
- L'utilisateur invité peut accepter/refuser

✅ **Gestion des membres**
- Un admin peut promouvoir un membre en admin
- Impossible de retirer le dernier admin
- Un membre peut quitter le workspace

✅ **Données**
- Les membres peuvent voir toutes les données du workspace
- Les modifications sont visibles par tous les membres
- Les admins peuvent supprimer des données

✅ **Abonnements**
- L'abonnement est lié au workspace
- Tous les membres bénéficient de l'abonnement
- Seuls les admins peuvent voir les détails de facturation

### 8. Monitoring

Surveillez ces métriques après le déploiement :

- Erreurs dans les logs Firebase
- Temps de réponse des requêtes Firestore
- Nombre de lectures/écritures (impact sur le coût)
- Erreurs de permissions (règles de sécurité)

```bash
# Voir les logs en temps réel
firebase functions:log --only firestore
```

### 9. Rollback (en cas de problème)

Si vous rencontrez des problèmes critiques :

```bash
# 1. Restaurer les anciennes règles
git checkout HEAD~1 firestore.rules
firebase deploy --only firestore:rules

# 2. Restaurer les anciennes données (depuis le backup)
gcloud firestore import gs://[BUCKET_NAME]/backup-[DATE]
```

## 📋 Checklist finale

Avant de considérer le déploiement comme terminé :

- [ ] Les index sont créés et actifs (statut "Enabled" dans Firebase)
- [ ] Les règles de sécurité sont déployées
- [ ] La migration des données est complète et vérifiée
- [ ] L'application fonctionne avec les workspaces
- [ ] Les tests de validation passent
- [ ] La documentation est à jour
- [ ] Les backups sont en place
- [ ] L'équipe est informée des changements

## 🆘 Support

En cas de problème :

1. Vérifiez les logs Firebase : `firebase functions:log`
2. Vérifiez la console Firebase (erreurs de permissions)
3. Consultez `WORKSPACE_SYSTEM.md` pour la documentation complète
4. Restaurez depuis le backup si nécessaire

## 📞 Contacts

- Documentation : `WORKSPACE_SYSTEM.md`
- Règles Firestore : `firestore.rules`
- Index : `firestore.indexes.json`

---

**Bonne migration ! 🚀**

