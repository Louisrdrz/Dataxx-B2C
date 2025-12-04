#!/bin/bash

# Script pour démarrer le webhook Stripe en local
# Usage: ./start-stripe-webhook.sh

set -e

echo "🔔 Configuration du Webhook Stripe"
echo "=================================="
echo ""

# Ajouter Homebrew au PATH si nécessaire
if [ -d "/opt/homebrew/bin" ]; then
    export PATH="/opt/homebrew/bin:$PATH"
fi

# Vérifier si Stripe CLI est installé
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI n'est pas installé"
    echo "Exécutez d'abord: brew install stripe/stripe-cli/stripe"
    exit 1
fi

# Vérifier si l'utilisateur est connecté à Stripe
echo "🔐 Vérification de la connexion Stripe..."
if ! stripe config --list &> /dev/null; then
    echo ""
    echo "⚠️  Vous n'êtes pas connecté à Stripe"
    echo "Une fenêtre de navigateur va s'ouvrir pour vous connecter..."
    echo ""
    stripe login
fi

echo ""
echo "✅ Connecté à Stripe"
echo ""
echo "🔔 Démarrage du forwarding du webhook..."
echo "Le webhook redirige vers: http://localhost:3000/api/webhooks/stripe"
echo ""
echo "⚠️  IMPORTANT:"
echo "- Gardez ce terminal ouvert pendant le développement"
echo "- Le secret du webhook sera affiché ci-dessous"
echo "- Copiez le 'whsec_...' dans votre fichier .env.local"
echo ""
echo "=========================================="
echo ""

# Démarrer le forwarding et afficher le secret
# Utiliser --print-secret pour afficher le secret au démarrage
stripe listen --forward-to localhost:3000/api/webhooks/stripe --print-secret
