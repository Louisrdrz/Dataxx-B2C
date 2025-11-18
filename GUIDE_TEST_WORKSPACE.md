# 🧪 Guide de Test - Nouveau Système de Workspace

## 📋 Checklist de test

Suivez ces étapes pour tester le nouveau système de workspace :

### ✅ Test 1 : Connexion avec workspaces existants

1. **Déconnectez-vous** de votre compte (si connecté)
2. **Allez sur** `/login`
3. **Connectez-vous** avec votre compte
4. ✅ **Vérifiez** : Vous devriez arriver sur `/select-workspace`
5. ✅ **Vérifiez** : Vous voyez la liste de vos workspaces existants
6. ✅ **Vérifiez** : Vous pouvez sélectionner un workspace en cliquant dessus
7. ✅ **Vérifiez** : Le workspace sélectionné a un badge "✓ Sélectionné"

### ✅ Test 2 : Définir un workspace par défaut (méthode 1)

1. Sur la page `/select-workspace`
2. **Cochez** la case "Se souvenir de mon choix"
3. **Sélectionnez** un workspace
4. **Cliquez** sur "🚀 Accéder à ce workspace"
5. ✅ **Vérifiez** : Vous arrivez sur le dashboard
6. **Déconnectez-vous**
7. **Reconnectez-vous**
8. ✅ **Vérifiez** : Vous êtes automatiquement redirigé vers le dashboard (sans passer par la sélection)

### ✅ Test 3 : Voir le workspace actif dans le dashboard

1. **Allez sur** le dashboard
2. ✅ **Vérifiez** : Dans le header, vous voyez un bouton avec "📁 [Nom de votre workspace]"
3. **Cliquez** sur ce bouton
4. ✅ **Vérifiez** : Un menu déroulant s'ouvre
5. ✅ **Vérifiez** : Vous voyez tous vos workspaces
6. ✅ **Vérifiez** : Le workspace par défaut a une étoile ⭐

### ✅ Test 4 : Gérer les workspaces depuis "Mes Workspaces"

1. **Allez sur** `/my-workspaces` (depuis le dashboard ou le menu du sélecteur)
2. ✅ **Vérifiez** : Vous voyez tous vos workspaces
3. ✅ **Vérifiez** : Le workspace par défaut a un badge "⭐ Par défaut"
4. ✅ **Vérifiez** : Les autres workspaces ont un bouton "⭐ Définir par défaut"
5. ✅ **Vérifiez** : Tous les workspaces ont un bouton "🚀 Accéder au workspace"

### ✅ Test 5 : Changer le workspace par défaut

1. Sur la page `/my-workspaces`
2. **Trouvez** un workspace qui n'est PAS par défaut
3. **Cliquez** sur "⭐ Définir par défaut"
4. ✅ **Vérifiez** : Une notification s'affiche en haut à droite
5. ✅ **Vérifiez** : La page se rafraîchit
6. ✅ **Vérifiez** : Ce workspace a maintenant le badge "⭐ Par défaut"
7. ✅ **Vérifiez** : L'ancien workspace par défaut n'a plus le badge
8. **Déconnectez-vous et reconnectez-vous**
9. ✅ **Vérifiez** : C'est le nouveau workspace par défaut qui est chargé

### ✅ Test 6 : Accéder directement à un workspace

1. Sur la page `/my-workspaces`
2. **Cliquez** sur "🚀 Accéder au workspace" pour n'importe quel workspace
3. ✅ **Vérifiez** : Vous êtes redirigé vers le dashboard
4. ✅ **Vérifiez** : Le sélecteur de workspace affiche le bon nom

### ✅ Test 7 : Créer un nouveau workspace depuis la sélection

1. **Allez sur** `/select-workspace?force=true` (pour forcer l'affichage même avec un défaut)
2. **Cliquez** sur "➕ Créer un nouveau workspace"
3. ✅ **Vérifiez** : Vous êtes redirigé vers `/create-workspace`

### ✅ Test 8 : Menu du sélecteur de workspace

1. Sur le dashboard
2. **Cliquez** sur le sélecteur de workspace (📁 [Nom])
3. **Cliquez** sur "➕ Créer un nouveau workspace"
4. ✅ **Vérifiez** : Vous êtes redirigé vers `/create-workspace`
5. **Revenez au dashboard**
6. **Cliquez** sur le sélecteur de workspace
7. **Cliquez** sur "⚙️ Gérer mes workspaces"
8. ✅ **Vérifiez** : Vous êtes redirigé vers `/my-workspaces`

### ✅ Test 9 : Nouvel utilisateur sans workspace

1. **Créez un nouveau compte** (ou utilisez un compte de test sans workspace)
2. **Connectez-vous**
3. ✅ **Vérifiez** : Vous êtes automatiquement redirigé vers `/onboarding`
4. ✅ **Vérifiez** : Vous pouvez créer votre premier workspace
5. **Créez le workspace**
6. ✅ **Vérifiez** : Vous êtes redirigé vers le dashboard

## 🐛 Problèmes connus possibles

### Le workspace par défaut ne se charge pas automatiquement

**Symptôme :** Après avoir défini un workspace par défaut, vous arrivez toujours sur la page de sélection.

**Solutions :**
1. Vérifiez que la notification "✅ Workspace par défaut défini" est bien apparue
2. Videz le cache de votre navigateur
3. Ouvrez la console du navigateur (F12) et cherchez des erreurs
4. Vérifiez dans Firestore que votre document utilisateur a bien le champ `defaultWorkspaceId`

### Le menu du sélecteur ne se ferme pas

**Symptôme :** Le menu déroulant reste ouvert après avoir cliqué ailleurs.

**Solution :** Cliquez à nouveau sur le bouton du sélecteur pour le fermer.

### Les workspaces n'apparaissent pas

**Symptôme :** La liste des workspaces est vide alors que vous en avez créé.

**Solutions :**
1. Allez directement sur `/my-workspaces` pour vérifier
2. Vérifiez dans Firestore :
   - Collection `workspaces` : vos workspaces existent
   - Collection `workspaceMembers` : vous êtes bien membre (documents avec votre userId)
3. Vérifiez les règles Firestore

### Erreur lors de la définition du workspace par défaut

**Symptôme :** Notification d'erreur "❌ Erreur - Impossible de définir le workspace par défaut"

**Solutions :**
1. Vérifiez que vous êtes bien connecté
2. Vérifiez les permissions Firestore
3. Consultez la console du navigateur pour plus de détails

## 📊 Points à vérifier dans Firestore

### Collection `users`

Vérifiez que votre document utilisateur ressemble à :
```json
{
  "uid": "votre-user-id",
  "email": "votre@email.com",
  "defaultWorkspaceId": "workspace-id-123",  // ← Ce champ doit être présent
  "displayName": "Votre Nom",
  // ... autres champs ...
}
```

### Collection `workspaceMembers`

Vérifiez que vous avez des documents pour chaque workspace :
```json
{
  "id": "workspace-id-123_votre-user-id",
  "workspaceId": "workspace-id-123",
  "userId": "votre-user-id",
  "role": "admin",  // ou "member"
  "joinedAt": { /* timestamp */ }
}
```

## 🎯 Résultats attendus

Après avoir effectué tous les tests :

✅ Vous pouvez vous connecter et voir vos workspaces
✅ Vous pouvez définir un workspace par défaut
✅ Le workspace par défaut se charge automatiquement
✅ Vous pouvez changer de workspace facilement
✅ Le sélecteur de workspace fonctionne dans le dashboard
✅ Tous les badges et indicateurs sont corrects
✅ Les notifications s'affichent correctement

## 📝 Rapport de bugs

Si vous rencontrez des problèmes :

1. **Notez** :
   - Quelle étape du test a échoué
   - Le message d'erreur exact (si présent)
   - Ce que vous voyez dans la console du navigateur
   - L'URL actuelle

2. **Vérifiez** :
   - Firestore (collections et documents)
   - Les règles de sécurité Firestore
   - Les logs dans la console

3. **Testez** :
   - Avec un autre navigateur
   - En navigation privée
   - Après avoir vidé le cache

## 🚀 Test de performance

Pour vérifier que tout est rapide :

1. **Chronométrez** le temps de :
   - Connexion → Arrivée sur le dashboard (avec workspace par défaut) : < 3 secondes
   - Ouverture du menu du sélecteur : instantané
   - Changement de workspace par défaut : < 2 secondes

2. **Vérifiez** :
   - Pas de rechargements inutiles de page
   - Les transitions sont fluides
   - Pas de freeze ou de lag

---

**Bonne chance pour les tests ! 🎉**

