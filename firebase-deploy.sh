#!/bin/bash

# Script de déploiement Firebase pour Dataxx B2C
# Project ID: dataxxb2c-1bc3f

echo "🚀 Déploiement Firebase Firestore pour Dataxx B2C"
echo "=================================================="
echo ""

# Charger nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")"

# Vérifier la connexion Firebase
echo "🔐 Vérification de la connexion Firebase..."
if ! npx firebase projects:list --project dataxxb2c-1bc3f &>/dev/null; then
    echo "⚠️  Non connecté à Firebase."
    echo "🔑 Lancement de la connexion (navigateur requis)..."
    echo ""
    npx firebase login --no-localhost
    echo ""
fi

# Vérifier à nouveau après login
if ! npx firebase projects:list --project dataxxb2c-1bc3f &>/dev/null; then
    echo "❌ Échec de la connexion Firebase. Veuillez réessayer."
    exit 1
fi

echo "✅ Connecté à Firebase"
echo ""
echo "📊 Projet cible: dataxxb2c-1bc3f"
echo ""

# Menu de déploiement
echo "Que souhaitez-vous déployer ?"
echo "1. Règles Firestore uniquement"
echo "2. Index Firestore uniquement"
echo "3. Règles + Index Firestore (Tout) [Recommandé]"
echo "4. Annuler"
echo ""
read -p "Votre choix (1-4) : " choice

case $choice in
    1)
        echo ""
        echo "📜 Déploiement des règles Firestore..."
        npx firebase deploy --only firestore:rules --project dataxxb2c-1bc3f
        if [ $? -eq 0 ]; then
            echo "✅ Règles déployées avec succès !"
        else
            echo "❌ Erreur lors du déploiement des règles"
            exit 1
        fi
        ;;
    2)
        echo ""
        echo "📊 Déploiement des index Firestore..."
        npx firebase deploy --only firestore:indexes --project dataxxb2c-1bc3f
        if [ $? -eq 0 ]; then
            echo "✅ Index déployés avec succès !"
        else
            echo "❌ Erreur lors du déploiement des index"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "📦 Déploiement complet de Firestore (règles + index)..."
        npx firebase deploy --only firestore --project dataxxb2c-1bc3f
        if [ $? -eq 0 ]; then
            echo "✅ Déploiement complet réussi !"
        else
            echo "❌ Erreur lors du déploiement"
            exit 1
        fi
        ;;
    4)
        echo "❌ Annulé."
        exit 0
        ;;
    *)
        echo "❌ Choix invalide."
        exit 1
        ;;
esac

echo ""
echo "🎉 Déploiement terminé !"
echo "📊 Console Firebase : https://console.firebase.google.com/project/dataxxb2c-1bc3f/firestore"
echo ""

