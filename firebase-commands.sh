#!/bin/bash

# Script d'aide pour les commandes Firebase courantes
# Usage: ./firebase-commands.sh [command]

PROJECT_ID="dataxxb2c"

case "$1" in
  "deploy-rules")
    echo "📋 Déploiement des règles Firestore..."
    npx firebase deploy --only firestore:rules --project $PROJECT_ID
    ;;
  
  "deploy-indexes")
    echo "📊 Déploiement des indexes Firestore..."
    npx firebase deploy --only firestore:indexes --project $PROJECT_ID
    ;;
  
  "deploy-all")
    echo "🚀 Déploiement complet Firestore (règles + indexes)..."
    npx firebase deploy --only firestore --project $PROJECT_ID
    ;;
  
  "emulator")
    echo "🧪 Démarrage de l'émulateur Firebase..."
    npx firebase emulators:start --project $PROJECT_ID
    ;;
  
  "list-users")
    echo "👥 Liste des utilisateurs..."
    npx firebase auth:export users.json --project $PROJECT_ID
    cat users.json | jq '.users[] | {uid, email, displayName}'
    rm users.json
    ;;
  
  "console")
    echo "🌐 Ouverture de la console Firebase..."
    open "https://console.firebase.google.com/project/$PROJECT_ID"
    ;;
  
  "auth-console")
    echo "🔐 Ouverture de la console Authentication..."
    open "https://console.firebase.google.com/project/$PROJECT_ID/authentication/users"
    ;;
  
  "firestore-console")
    echo "📦 Ouverture de la console Firestore..."
    open "https://console.firebase.google.com/project/$PROJECT_ID/firestore"
    ;;
  
  "help"|*)
    echo "🔥 Commandes Firebase disponibles:"
    echo ""
    echo "  deploy-rules       - Déployer uniquement les règles de sécurité"
    echo "  deploy-indexes     - Déployer uniquement les indexes"
    echo "  deploy-all         - Déployer règles + indexes"
    echo "  emulator           - Démarrer l'émulateur local"
    echo "  list-users         - Afficher la liste des utilisateurs"
    echo "  console            - Ouvrir la console Firebase"
    echo "  auth-console       - Ouvrir la console Authentication"
    echo "  firestore-console  - Ouvrir la console Firestore"
    echo "  help               - Afficher cette aide"
    echo ""
    echo "Usage: ./firebase-commands.sh [command]"
    ;;
esac
