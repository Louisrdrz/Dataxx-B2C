#!/bin/bash

# Script de déploiement rapide des règles Firestore
# Usage: ./deploy-firestore-rules.sh

echo "🚀 Déploiement des règles Firestore..."
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "firestore.rules" ]; then
    echo "❌ Erreur: fichier firestore.rules introuvable"
    echo "   Assurez-vous d'exécuter ce script depuis la racine du projet"
    exit 1
fi

if [ ! -f "firestore.indexes.json" ]; then
    echo "❌ Erreur: fichier firestore.indexes.json introuvable"
    echo "   Assurez-vous d'exécuter ce script depuis la racine du projet"
    exit 1
fi

echo "📋 Fichiers trouvés:"
echo "   ✓ firestore.rules"
echo "   ✓ firestore.indexes.json"
echo ""

# Afficher un aperçu des règles
echo "📜 Aperçu des règles Firestore:"
echo "────────────────────────────────────────"
head -n 30 firestore.rules
echo "..."
echo "────────────────────────────────────────"
echo ""

# Demander confirmation
read -p "🤔 Voulez-vous déployer ces règles sur Firebase ? (o/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Oo]$ ]]; then
    echo "❌ Déploiement annulé"
    exit 0
fi

echo ""
echo "⏳ Déploiement en cours..."
echo ""

# Déployer les règles
npx firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Règles Firestore déployées avec succès !"
    echo ""
    
    # Demander si on veut aussi déployer les index
    read -p "🤔 Voulez-vous aussi déployer les index Firestore ? (o/N) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        echo ""
        echo "⏳ Déploiement des index en cours..."
        echo ""
        npx firebase deploy --only firestore:indexes
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Index Firestore déployés avec succès !"
        else
            echo ""
            echo "❌ Erreur lors du déploiement des index"
            exit 1
        fi
    fi
    
    echo ""
    echo "🎉 Déploiement terminé !"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "   1. Testez la création d'un workspace"
    echo "   2. Vérifiez que les workspaces s'affichent sur /my-workspaces"
    echo "   3. Consultez la console du navigateur pour les logs"
    echo ""
else
    echo ""
    echo "❌ Erreur lors du déploiement des règles"
    echo ""
    echo "💡 Suggestions:"
    echo "   - Vérifiez que vous êtes connecté à Firebase (npx firebase login)"
    echo "   - Vérifiez que le projet Firebase est correct (npx firebase use)"
    echo "   - Consultez firebase-debug.log pour plus de détails"
    echo ""
    exit 1
fi

