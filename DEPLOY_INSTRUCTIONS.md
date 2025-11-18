# 🚀 Instructions de déploiement Firebase pour Dataxx B2C

## Étape 1 : Ouvrir un Terminal

1. Appuyez sur `cmd + espace`
2. Tapez "Terminal"
3. Appuyez sur `Entrée`

## Étape 2 : Copier-Coller ces commandes

### A. Charger Node.js
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd /Users/louisrodriguez/Documents/Dataxx/Dataxx-B2C
```

### B. Se connecter à Firebase (ouvrira votre navigateur)
```bash
npx firebase login
```

**→ Dans le navigateur :** Sélectionnez **louis@dataxx.fr** et autorisez l'accès

### C. Déployer les règles et index Firestore
```bash
npx firebase deploy --only firestore --project dataxxb2c-1bc3f
```

---

## ✅ Résultat attendu

Vous verrez :
```
✔ Deploy complete!
```

---

## 📊 Vérifier dans la console Firebase

Ouvrez : https://console.firebase.google.com/project/dataxxb2c-1bc3f/firestore

---

## 🆘 En cas de problème

Si vous avez une erreur, contactez-moi avec le message d'erreur exact.

---

## 🎯 Tout-en-un (commande unique)

Après avoir fait `firebase login` une fois, vous pourrez toujours utiliser :

```bash
cd /Users/louisrodriguez/Documents/Dataxx/Dataxx-B2C && \
export NVM_DIR="$HOME/.nvm" && \
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
npx firebase deploy --only firestore --project dataxxb2c-1bc3f
```

