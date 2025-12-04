# 🧪 Guide de test des workspaces

## 1️⃣ Vérifier que le fix fonctionne

### Étape 1 : Relancer l'application
```bash
npm run dev
```

### Étape 2 : Ouvrir la console du navigateur
- Appuyez sur `F12` ou `Cmd+Option+I` (Mac)
- Allez dans l'onglet **Console**

### Étape 3 : Créer un workspace
1. Connectez-vous à votre application
2. Allez sur `/create-workspace`
3. Remplissez le formulaire
4. Cliquez sur "Créer le workspace"

### Étape 4 : Vérifier dans la console
Vous devriez voir :
```
useUserWorkspaces - IDs trouvés: ['workspace_id_123']
useUserWorkspaces - Mise à jour: 1 workspaces
```

### Étape 5 : Aller sur `/my-workspaces`
Vous devriez maintenant voir votre workspace affiché !

---

## 2️⃣ Vérifier dans Firebase Console

### 📁 Collection `workspaces`
1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet **DataxxB2C**
3. Allez dans **Firestore Database**
4. Vérifiez la collection `workspaces`

Vous devriez voir un document avec :
```json
{
  "name": "Nom de votre workspace",
  "type": "personal",
  "ownerId": "votre_user_id",
  "createdAt": "timestamp",
  "memberCount": 1
}
```

### 👥 Collection `workspaceMembers`
Vérifiez la collection `workspaceMembers`

Vous devriez voir un document avec l'ID : `workspace_id_userId`
```json
{
  "id": "workspace_id_userId",
  "workspaceId": "workspace_id",
  "userId": "votre_user_id",
  "role": "admin",
  "joinedAt": "timestamp"
}
```

---

## 3️⃣ Problèmes courants

### ❌ Le workspace n'apparaît toujours pas

**Vérifiez dans la console :**
1. Y a-t-il des erreurs de permission Firestore ?
   - Erreur type : `"Missing or insufficient permissions"`
   - **Solution** : Déployez les règles Firestore

2. Le document `workspaceMembers` existe-t-il ?
   - Si NON : Il y a un problème dans `createWorkspace`
   - Si OUI : Il y a un problème dans `useUserWorkspaces`

### 🔒 Erreur de permission Firestore

Si vous voyez : `"Missing or insufficient permissions"`

**Solution :**
```bash
# Déployer les règles Firestore
npx firebase deploy --only firestore:rules

# Déployer les index
npx firebase deploy --only firestore:indexes
```

### 🔄 Workspace créé mais pas affiché

**Vérifiez dans la console :**
```javascript
// Ligne 211 de useWorkspace.tsx
console.log('useUserWorkspaces - IDs trouvés:', workspaceIds);

// Ligne 230 de useWorkspace.tsx
console.log('useUserWorkspaces - Mise à jour:', sortedWorkspaces.length, 'workspaces');
```

Si `workspaceIds` est vide mais que le workspace existe dans Firebase :
- Le document `workspaceMembers` n'existe pas ou a le mauvais format
- Vérifiez que l'ID du document est bien `${workspaceId}_${userId}`

---

## 4️⃣ Commandes de débogage utiles

### Voir les règles Firestore actuelles
```bash
cat firestore.rules
```

### Voir les index Firestore
```bash
cat firestore.indexes.json
```

### Tester une requête Firestore manuellement
Ajoutez ce code temporaire dans `my-workspaces.tsx` :
```typescript
useEffect(() => {
  if (!firebaseUser) return;
  
  const testQuery = async () => {
    const membersRef = collection(db, 'workspaceMembers');
    const q = query(membersRef, where('userId', '==', firebaseUser.uid));
    const snapshot = await getDocs(q);
    
    console.log('🧪 TEST - Nombre de membres trouvés:', snapshot.size);
    snapshot.docs.forEach(doc => {
      console.log('🧪 TEST - Membre:', doc.id, doc.data());
    });
  };
  
  testQuery();
}, [firebaseUser]);
```

---

## 5️⃣ Checklist de vérification

- [ ] L'application démarre sans erreur (`npm run dev`)
- [ ] Je peux me connecter avec Firebase Auth
- [ ] Je peux créer un workspace sans erreur
- [ ] Le workspace apparaît dans Firestore Console (`workspaces`)
- [ ] Le membre apparaît dans Firestore Console (`workspaceMembers`)
- [ ] Le workspace apparaît sur la page `/my-workspaces`
- [ ] Je vois mon rôle "Admin" affiché
- [ ] Aucune erreur dans la console du navigateur

---

## 🆘 Si ça ne fonctionne toujours pas

Envoyez-moi :
1. Les logs de la console du navigateur (capture d'écran)
2. Une capture d'écran de Firestore Console montrant :
   - La collection `workspaces`
   - La collection `workspaceMembers`
3. Le message d'erreur exact

## ✅ Ce qui a été corrigé

- ✅ Import incorrect : `getUserWorkspaceRole` → `getUserRoleInWorkspace`
- ✅ Fonction inexistante corrigée dans `pages/my-workspaces.tsx`

