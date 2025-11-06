#!/bin/bash

# Script de déploiement Firestore pour Dataxx B2C
# Project ID: dataxxb2c-1bc3f

echo "🚀 Déploiement Firestore pour Dataxx B2C"
echo "=========================================="
echo ""

# Vérifier que Firebase CLI est installé
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI n'est pas installé."
    echo "📦 Installation de Firebase CLI..."
    sudo npm install -g firebase-tools
    echo "✅ Firebase CLI installé avec succès"
fi

# Vérifier la connexion Firebase
echo "🔐 Vérification de la connexion Firebase..."
firebase login:ci --no-localhost 2>/dev/null || {
    echo "⚠️  Non connecté à Firebase. Connexion en cours..."
    firebase login --no-localhost
}

# Sélectionner le projet
echo "📂 Sélection du projet dataxxb2c-1bc3f..."
firebase use dataxxb2c-1bc3f

echo ""
echo "Que souhaitez-vous déployer ?"
echo "1. Règles Firestore uniquement"
echo "2. Index Firestore uniquement"
echo "3. Règles + Index Firestore (Tout)"
echo "4. Annuler"
echo ""
read -p "Votre choix (1-4) : " choice

case $choice in
    1)
        echo ""
        echo "📜 Déploiement des règles Firestore..."
        firebase deploy --only firestore:rules
        echo "✅ Règles déployées avec succès !"
        ;;
    2)
        echo ""
        echo "📊 Déploiement des index Firestore..."
        firebase deploy --only firestore:indexes
        echo "✅ Index déployés avec succès !"
        ;;
    3)
        echo ""
        echo "📦 Déploiement complet de Firestore (règles + index)..."
        firebase deploy --only firestore
        echo "✅ Déploiement complet réussi !"
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
echo "📊 Console Firebase : https://console.firebase.google.com/project/dataxxb2c-1bc3f/overview"
echo ""
