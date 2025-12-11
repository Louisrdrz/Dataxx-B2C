#!/bin/bash
# Script de déploiement des règles Firebase Storage
# Project ID: dataxxb2c-1bc3f

PROJECT_ID="dataxxb2c-1bc3f"

echo "🚀 Déploiement des règles Firebase Storage..."
echo "📊 Projet cible: $PROJECT_ID"
echo ""

# Vérifier que Firebase CLI est installé
if ! command -v firebase &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Firebase CLI n'est pas installé"
    echo "Installez-le avec: npm install -g firebase-tools"
    exit 1
fi

# Vérifier que l'utilisateur est connecté
if ! npx firebase projects:list --project $PROJECT_ID &> /dev/null; then
    echo "❌ Vous n'êtes pas connecté à Firebase"
    echo "Connectez-vous avec: firebase login"
    exit 1
fi

# Vérifier que le fichier storage.rules existe
if [ ! -f "storage.rules" ]; then
    echo "❌ Fichier storage.rules introuvable"
    echo "   Assurez-vous d'exécuter ce script depuis la racine du projet"
    exit 1
fi

echo "📜 Fichier de règles trouvé: storage.rules"
echo ""

# Déployer les règles Storage
echo "📤 Déploiement des règles Storage sur le projet $PROJECT_ID..."
npx firebase deploy --only storage --project $PROJECT_ID

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Règles Storage déployées avec succès !"
    echo "📊 Console Firebase : https://console.firebase.google.com/project/$PROJECT_ID/storage/rules"
else
    echo ""
    echo "❌ Erreur lors du déploiement des règles Storage"
    exit 1
fi

