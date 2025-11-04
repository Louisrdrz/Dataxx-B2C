# 🔑 Comment récupérer vos credentials Firebase

## Étapes pour obtenir la configuration Firebase

### 1. Accéder à la Console Firebase

Allez sur : https://console.firebase.google.com/project/dataxxb2c/settings/general

### 2. Créer une application Web (si ce n'est pas déjà fait)

1. Dans la section **"Vos applications"**, cliquez sur l'icône Web (`</>`)
2. Donnez un nom à votre app (ex: "Dataxx Web")
3. Cochez "Configurer également Firebase Hosting" (optionnel)
4. Cliquez sur **"Enregistrer l'application"**

### 3. Copier la configuration

Vous verrez un objet de configuration JavaScript ressemblant à ceci :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "dataxxb2c.firebaseapp.com",
  projectId: "dataxxb2c",
  storageBucket: "dataxxb2c.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

### 4. Créer le fichier `.env.local`

À la racine de votre projet, créez un fichier `.env.local` et copiez les valeurs :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dataxxb2c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dataxxb2c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dataxxb2c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5. Redémarrer le serveur de développement

```bash
npm run dev
```

## ✅ Vérification de la configuration

Pour vérifier que tout fonctionne :

1. Allez sur http://localhost:3000/login
2. Essayez de vous connecter avec Google ou créer un compte
3. Vérifiez dans la [Console Firebase](https://console.firebase.google.com/project/dataxxb2c/authentication/users) que l'utilisateur a été créé

## 🔒 Sécurité

- ⚠️ **NE COMMITTEZ JAMAIS** le fichier `.env.local` dans Git
- Le fichier `.env.local` est déjà dans `.gitignore`
- Les clés préfixées par `NEXT_PUBLIC_` sont exposées côté client (c'est normal)
- Pour les opérations sensibles côté serveur, utilisez Firebase Admin SDK avec une clé de service

## 📚 Documentation officielle

- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)
