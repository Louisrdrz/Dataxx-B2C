# 🔥 Configuration Firebase Admin

Pour que les API routes fonctionnent correctement avec Stripe, vous devez configurer Firebase Admin SDK.

## 📋 Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env.local` :

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dataxxb2c-1bc3f
```

## 🔑 Comment obtenir les credentials

### Option 1 : Via Firebase Console (Recommandé)

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet : `dataxxb2c-1bc3f`
3. Cliquez sur l'icône ⚙️ (Paramètres) → **Paramètres du projet**
4. Allez dans l'onglet **Comptes de service**
5. Cliquez sur **Générer une nouvelle clé privée**
6. Un fichier JSON sera téléchargé (ex: `dataxxb2c-1bc3f-firebase-adminsdk-xxxxx.json`)

### Option 2 : Utiliser le fichier JSON directement

Si vous avez le fichier JSON, vous pouvez extraire les valeurs :

```bash
# Exemple de structure du fichier JSON
{
  "type": "service_account",
  "project_id": "dataxxb2c-1bc3f",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@dataxxb2c-1bc3f.iam.gserviceaccount.com",
  ...
}
```

### Option 3 : Script d'extraction automatique

Si vous avez le fichier JSON, créez un script pour extraire les valeurs :

```bash
# Créez un fichier extract-firebase-env.sh
cat > extract-firebase-env.sh << 'EOF'
#!/bin/bash
JSON_FILE=$1

if [ -z "$JSON_FILE" ]; then
  echo "Usage: ./extract-firebase-env.sh path/to/service-account.json"
  exit 1
fi

PRIVATE_KEY=$(cat $JSON_FILE | jq -r '.private_key')
CLIENT_EMAIL=$(cat $JSON_FILE | jq -r '.client_email')
PROJECT_ID=$(cat $JSON_FILE | jq -r '.project_id')

echo ""
echo "Ajoutez ces lignes à votre .env.local :"
echo ""
echo "FIREBASE_PRIVATE_KEY=\"$PRIVATE_KEY\""
echo "FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID"
echo ""
EOF

chmod +x extract-firebase-env.sh
./extract-firebase-env.sh path/to/your-service-account.json
```

## ⚠️ Important

1. **Ne commitez JAMAIS** le fichier JSON de service account dans Git
2. **Ne commitez JAMAIS** votre fichier `.env.local` dans Git
3. Le `FIREBASE_PRIVATE_KEY` doit être sur une seule ligne avec `\n` pour les retours à la ligne
4. Assurez-vous que le fichier `.env.local` est dans votre `.gitignore`

## ✅ Vérification

Après avoir ajouté les variables, redémarrez votre serveur :

```bash
npm run dev
```

Vous devriez voir dans les logs :
```
✅ Firebase Admin initialisé avec succès
```

Si vous voyez toujours l'erreur, vérifiez que :
- Les variables sont bien dans `.env.local` (pas `.env`)
- Le `FIREBASE_PRIVATE_KEY` contient bien `\n` pour les retours à la ligne
- Vous avez redémarré le serveur après avoir modifié `.env.local`

