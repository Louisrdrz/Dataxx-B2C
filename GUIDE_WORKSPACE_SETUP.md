# 🚀 Guide : Configurer un Workspace et Vérifier votre Rôle

## 📋 Table des matières
1. [Créer votre premier workspace](#créer-votre-premier-workspace)
2. [Vérifier si vous êtes admin](#vérifier-si-vous-êtes-admin)
3. [Utiliser la console Firebase](#utiliser-la-console-firebase)
4. [Tester avec du code](#tester-avec-du-code)

---

## 1. 🎯 Créer votre premier workspace

### Option A : Via l'application (recommandé)

Créez une page ou un composant pour créer un workspace. Voici un exemple simple :

**Créez le fichier : `pages/create-workspace.tsx`**

```typescript
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createWorkspace } from '@/lib/firebase/workspaces';
import { useRouter } from 'next/router';

export default function CreateWorkspacePage() {
  const { firebaseUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firebaseUser) {
      setError('Vous devez être connecté');
      return;
    }

    if (!name.trim()) {
      setError('Le nom est requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const workspaceId = await createWorkspace(firebaseUser.uid, {
        name: name.trim(),
        description: description.trim(),
        type: 'personal', // ou 'club', 'athlete', 'other'
      });

      alert(`✅ Workspace créé avec succès ! ID: ${workspaceId}`);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la création du workspace');
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Veuillez vous connecter pour créer un workspace</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Créer un workspace</h1>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du workspace *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mon équipe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optionnel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de votre workspace"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Création...' : 'Créer le workspace'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

**Ensuite, accédez à :**
```
http://localhost:3000/create-workspace
```

### Option B : Via la console Firebase

1. Allez sur : `https://console.firebase.google.com/project/dataxxb2c-1bc3f/firestore`
2. Créez manuellement un document dans la collection `workspaces`
3. Puis créez un document dans `workspaceMembers` avec votre userId

---

## 2. 🔍 Vérifier si vous êtes admin

### Méthode 1 : Via la Console Firebase (Rapide)

1. **Ouvrez la console Firestore :**
   ```
   https://console.firebase.google.com/project/dataxxb2c-1bc3f/firestore/data
   ```

2. **Allez dans la collection `workspaceMembers`**

3. **Cherchez vos documents :**
   - Le format de l'ID est : `{workspaceId}_{userId}`
   - Exemple : `abc123_def456`

4. **Vérifiez le champ `role` :**
   - ✅ `"admin"` → Vous êtes admin
   - ❌ `"member"` → Vous êtes membre simple

### Méthode 2 : Via un composant React

**Créez : `pages/my-workspaces.tsx`**

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useUserWorkspaces } from '@/hooks/useWorkspace';
import { getUserWorkspaceRole } from '@/lib/firebase/workspaceMembers';
import { useEffect, useState } from 'react';

export default function MyWorkspacesPage() {
  const { firebaseUser } = useAuth();
  const { workspaces, loading } = useUserWorkspaces(firebaseUser?.uid || '');
  const [roles, setRoles] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchRoles = async () => {
      if (!firebaseUser || !workspaces.length) return;
      
      const rolesData: Record<string, string> = {};
      
      for (const workspace of workspaces) {
        const role = await getUserWorkspaceRole(workspace.id, firebaseUser.uid);
        rolesData[workspace.id] = role || 'unknown';
      }
      
      setRoles(rolesData);
    };
    
    fetchRoles();
  }, [firebaseUser, workspaces]);

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!firebaseUser) {
    return <div className="p-8">Veuillez vous connecter</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Mes Workspaces</h1>
        
        {workspaces.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600 mb-4">Vous n'avez pas encore de workspace</p>
            <a 
              href="/create-workspace" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Créer mon premier workspace
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {workspaces.map((workspace) => (
              <div 
                key={workspace.id} 
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{workspace.name}</h2>
                    {workspace.description && (
                      <p className="text-gray-600 mt-1">{workspace.description}</p>
                    )}
                  </div>
                  
                  <div>
                    {roles[workspace.id] === 'admin' ? (
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                        👑 Admin
                      </span>
                    ) : roles[workspace.id] === 'member' ? (
                      <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                        👤 Membre
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full">
                        ❓ Role inconnu
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>ID: {workspace.id}</p>
                  <p>Type: {workspace.type}</p>
                  <p>Créé le: {workspace.createdAt?.toDate?.().toLocaleDateString('fr-FR') || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Accédez à :**
```
http://localhost:3000/my-workspaces
```

### Méthode 3 : Via la console du navigateur

Ouvrez la console (F12) sur n'importe quelle page et exécutez :

```javascript
// Récupérer votre userId
const userId = firebase.auth().currentUser.uid;
console.log('Mon userId:', userId);

// Récupérer vos workspaces et rôles
const workspaceMembersRef = firebase.firestore().collection('workspaceMembers');
const query = workspaceMembersRef.where('userId', '==', userId);

query.get().then(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log('Workspace:', data.workspaceId);
    console.log('Role:', data.role);
    console.log('Admin?', data.role === 'admin' ? '✅ OUI' : '❌ NON');
    console.log('---');
  });
});
```

---

## 3. 📊 Comprendre les rôles

### Rôles disponibles :

| Rôle | Permissions |
|------|-------------|
| **admin** 👑 | - Gérer les membres (inviter, changer rôles, retirer)<br>- Modifier les paramètres du workspace<br>- Supprimer le workspace<br>- Gérer les abonnements<br>- Toutes les permissions de membre |
| **member** 👤 | - Lire les données du workspace<br>- Créer des données<br>- Modifier ses propres données<br>- Se retirer du workspace |

### Qui est admin automatiquement ?

✅ **Le créateur du workspace** devient automatiquement le **premier admin**

La fonction `createWorkspace()` fait cela automatiquement :
```typescript
// Dans lib/firebase/workspaces.ts
await addWorkspaceMember(workspaceId, userId, 'admin', undefined, userInfo);
```

---

## 4. 🧪 Test complet : Créer et vérifier

### Étape 1 : Créer un workspace

```bash
# Option 1 : Via l'interface web
http://localhost:3000/create-workspace

# Option 2 : Via le code directement
```

### Étape 2 : Vérifier dans Firestore

1. **Collection `workspaces`**
   ```
   Cherchez un document avec votre nom de workspace
   Notez le workspaceId (l'ID du document)
   ```

2. **Collection `workspaceMembers`**
   ```
   Cherchez le document : {workspaceId}_{votre_userId}
   Vérifiez que role = "admin"
   ```

### Étape 3 : Tester l'intégration Google

1. Allez sur : `http://localhost:3000/google-data`
2. Le dropdown devrait afficher votre workspace
3. Importez des données Google
4. Vérifiez qu'elles sont bien dans `userData` avec votre `workspaceId`

---

## 5. 🔧 Commandes utiles

### Obtenir votre userId actuel

Dans n'importe quel composant React :

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { firebaseUser } = useAuth();
  
  console.log('Mon userId:', firebaseUser?.uid);
  console.log('Mon email:', firebaseUser?.email);
  
  return <div>Voir la console</div>;
}
```

### Vérifier votre rôle dans un workspace

```typescript
import { getUserWorkspaceRole } from '@/lib/firebase/workspaceMembers';

const role = await getUserWorkspaceRole(workspaceId, userId);
console.log('Mon rôle:', role); // "admin" ou "member"

if (role === 'admin') {
  console.log('✅ Je suis admin !');
}
```

### Vérifier si vous êtes admin

```typescript
import { isWorkspaceAdmin } from '@/lib/firebase/workspaceMembers';

const isAdmin = await isWorkspaceAdmin(workspaceId, userId);
console.log('Admin?', isAdmin ? '✅ OUI' : '❌ NON');
```

---

## 6. 🐛 Troubleshooting

### Problème : "Aucun workspace ne s'affiche"

**Solution :**
1. Vérifiez que vous êtes connecté
2. Créez un workspace via `/create-workspace`
3. Vérifiez dans Firestore que le document existe

### Problème : "Je ne suis pas admin"

**Solution :**
1. Si vous avez créé le workspace, vous DEVEZ être admin
2. Vérifiez dans `workspaceMembers` que votre role est bien "admin"
3. Si ce n'est pas le cas, modifiez manuellement dans Firestore

### Problème : "Erreur de permissions Firestore"

**Solution :**
1. Vérifiez que les règles Firestore sont déployées
2. Vérifiez que vous êtes membre du workspace
3. Vérifiez que le document `workspaceMembers` existe

---

## 7. 📱 Pages recommandées à créer

Pour une expérience complète, créez ces pages :

1. ✅ `/create-workspace` - Créer un workspace
2. ✅ `/my-workspaces` - Liste de vos workspaces avec vos rôles
3. ⭐ `/workspace/[id]` - Page détaillée d'un workspace
4. ⭐ `/workspace/[id]/settings` - Paramètres (admin uniquement)
5. ⭐ `/workspace/[id]/members` - Gestion des membres (admin uniquement)

---

## 📚 Fonctions utiles disponibles

Toutes ces fonctions sont dans vos fichiers :

### Dans `lib/firebase/workspaces.ts` :
- `createWorkspace()` - Créer un workspace
- `getWorkspace()` - Récupérer un workspace
- `updateWorkspace()` - Modifier un workspace
- `deleteWorkspace()` - Supprimer un workspace

### Dans `lib/firebase/workspaceMembers.ts` :
- `getUserWorkspaceRole()` - Obtenir votre rôle
- `isWorkspaceAdmin()` - Vérifier si admin
- `getWorkspaceMembers()` - Liste des membres
- `updateMemberRole()` - Changer le rôle (admin uniquement)

### Dans `hooks/useWorkspace.tsx` :
- `useUserWorkspaces()` - Hook React pour vos workspaces
- `useWorkspace()` - Hook pour un workspace spécifique

---

**Vous êtes prêt à utiliser les workspaces ! 🚀**

Pour toute question, consultez `WORKSPACE_README.md` pour plus de détails.

