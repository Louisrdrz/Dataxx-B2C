#!/bin/bash
# Script de déploiement rapide Firebase Firestore
# Assurez-vous d'avoir exécuté 'firebase login' au moins une fois

echo "🚀 Déploiement Firebase Firestore - Dataxx B2C"
echo "=============================================="
echo ""

# Charger nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Aller dans le répertoire du projet
cd "$(dirname "$0")"

# Vérifier si connecté
echo "🔍 Vérification de la connexion Firebase..."
if ! npx firebase projects:list &>/dev/null; then
    echo ""
    echo "❌ Vous n'êtes pas connecté à Firebase."
    echo ""
    echo "🔑 Veuillez d'abord exécuter : npx firebase login"
    echo ""
    echo "Puis relancez ce script."
    exit 1
fi

echo "✅ Connecté à Firebase"
echo ""
echo "📦 Déploiement des règles et index Firestore..."
echo "📊 Projet : dataxxb2c-1bc3f"
echo ""

# Déployer
npx firebase deploy --only firestore --project dataxxb2c-1bc3f

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ✅ ✅ DÉPLOIEMENT RÉUSSI ! ✅ ✅ ✅"
    echo ""
    echo "📊 Console Firebase : https://console.firebase.google.com/project/dataxxb2c-1bc3f/firestore"
    echo ""
else
    echo ""
    echo "❌ Erreur lors du déploiement"
    exit 1
fi

