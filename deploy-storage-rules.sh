#!/bin/bash
# Script de déploiement des règles Firebase Storage

echo "🚀 Déploiement des règles Firebase Storage..."

# Vérifier que Firebase CLI est installé
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI n'est pas installé"
    echo "Installez-le avec: npm install -g firebase-tools"
    exit 1
fi

# Vérifier que l'utilisateur est connecté
if ! firebase projects:list &> /dev/null; then
    echo "❌ Vous n'êtes pas connecté à Firebase"
    echo "Connectez-vous avec: firebase login"
    exit 1
fi

# Déployer les règles Storage
echo "📤 Déploiement des règles Storage..."
firebase deploy --only storage

if [ $? -eq 0 ]; then
    echo "✅ Règles Storage déployées avec succès !"
else
    echo "❌ Erreur lors du déploiement des règles Storage"
    exit 1
fi

