# 🔍 Guide de Débogage - Erreur d'Inscription

## Problème rencontré
"Une erreur est survenue lors de l'inscription. Veuillez réessayer."

---

## ✅ Modifications apportées

J'ai modifié la fonction `signUpWithEmail` dans `lib/firebase/auth.ts` pour que l'envoi de l'email de vérification n'empêche pas l'inscription de se terminer.

---

## 🔍 Comment déboguer

### 1. Ouvrir la console du navigateur
- **Chrome/Edge** : `Cmd + Option + I` (Mac) ou `F12` (Windows)
- **Firefox** : `Cmd + Option + K` (Mac) ou `F12` (Windows)
- **Safari** : `Cmd + Option + C`

### 2. Aller sur la page d'inscription
http://localhost:3001/register (ou 3000 selon le port)

### 3. Remplir le formulaire et soumettre

### 4. Regarder dans l'onglet "Console"
Vous devriez voir des messages d'erreur détaillés comme :
```
Erreur lors de l'inscription: FirebaseError: ...
```

---

## 🚨 Causes possibles de l'erreur

### 1. ❌ Authentification Email/Password non activée dans Firebase

**Solution** :
1. Aller sur : https://console.firebase.google.com/project/dataxxb2c-1bc3f/authentication/providers
2. Cliquer sur "Email/Password"
3. Activer "Email/Password"
4. Cliquer sur "Enregistrer"

### 2. ❌ Problème avec l'API Key Firebase

**Vérifier** :
- API Key dans `.env.local` : `IzaSyBV-gTk7qzkhy-51iPUaYncKeIFaRORC5Q`
- Si l'API Key commence par `I` au lieu de `A`, c'est normal (typo dans votre .env.local)

**Solution** :
```bash
# Vérifier la vraie clé dans Firebase Console
# Settings > General > Your apps > Web app
```

### 3. ❌ Règles Firestore trop restrictives

**Vérifier** :
Les règles permettent la création d'utilisateurs :
```javascript
allow create: if isAuthenticated() && 
                 request.auth.uid == userId &&
                 request.resource.data.uid == userId &&
                 request.resource.data.email == request.auth.token.email;
```

### 4. ❌ Email déjà utilisé

**Vérifier** :
- Allez sur : https://console.firebase.google.com/project/dataxxb2c-1bc3f/authentication/users
- Cherchez si l'email existe déjà

---

## 🧪 Test rapide

### Option 1 : Tester avec la console

Ouvrez la console du navigateur et testez :

```javascript
// Testez la création d'un compte
import { signUpWithEmail } from '@/lib/firebase/auth';

signUpWithEmail('test@example.com', 'password123', 'Test User')
  .then(result => console.log('✅ Succès:', result))
  .catch(error => console.error('❌ Erreur:', error));
```

### Option 2 : Vérifier l'authentification

1. Allez sur Firebase Console
2. Authentication > Sign-in method
3. Vérifiez que "Email/Password" est **Activé**

---

## 🔧 Solution Rapide

Si l'authentification Email/Password n'est pas activée :

### Via Firebase Console (Recommandé)

1. **Ouvrir** : https://console.firebase.google.com/project/dataxxb2c-1bc3f/authentication/providers
2. **Cliquer** sur "Email/Password"
3. **Activer** : Cocher "Enable"
4. **Enregistrer**

### Via Firebase CLI

```bash
# Cette commande n'existe pas directement
# Vous DEVEZ passer par la console
```

---

## 📋 Checklist de Vérification

Vérifiez ces éléments dans l'ordre :

- [ ] **Firebase Auth activé**
  - Console > Authentication > Sign-in method
  - Email/Password doit être "Enabled"

- [ ] **API Key correcte**
  - Vérifier dans `.env.local`
  - Comparer avec Firebase Console > Settings

- [ ] **Application redémarrée**
  - Après avoir modifié `.env.local`, redémarrer `npm run dev`

- [ ] **Console du navigateur**
  - Ouvrir F12 et regarder les erreurs détaillées

- [ ] **Firestore accessible**
  - Les règles permettent la création de documents

---

## 🎯 Actions Immédiates

### 1. Vérifier l'authentification
```bash
# Ouvrir directement la console Firebase
open https://console.firebase.google.com/project/dataxxb2c-1bc3f/authentication/providers
```

### 2. Tester avec un compte simple
- Email : `test@test.com`
- Password : `Test1234!`
- Essayez de créer ce compte

### 3. Regarder les logs
```bash
# Regarder les logs du terminal où tourne npm run dev
# Regarder la console du navigateur (F12)
```

---

## 💡 Message d'Erreur Détaillé

Pour obtenir plus d'informations, j'ai modifié le code pour afficher l'erreur complète dans la console.

**Où regarder** :
1. Console du navigateur (F12)
2. Onglet "Console"
3. Message commençant par "Erreur lors de l'inscription:"

**Ce que vous devriez voir** :
```
Erreur lors de l'inscription: FirebaseError: Firebase: Error (auth/email-already-in-use).
```

OU

```
Erreur lors de l'inscription: FirebaseError: Firebase: Error (auth/operation-not-allowed).
```

---

## 📞 Prochaines Étapes

1. **Ouvrir la console du navigateur** (F12)
2. **Essayer de créer un compte**
3. **Copier le message d'erreur complet** de la console
4. **Me donner le message** pour que je puisse vous aider précisément

---

## 🆘 Si rien ne fonctionne

Créons un compte de test directement via Firebase Console :

1. Allez sur : https://console.firebase.google.com/project/dataxxb2c-1bc3f/authentication/users
2. Cliquez sur "Add user"
3. Email : `test@test.com`
4. Password : `Test1234!`
5. Cliquez sur "Add user"

Puis essayez de vous connecter avec ce compte sur `/login`.

---

**Fichier créé** : 6 novembre 2025
