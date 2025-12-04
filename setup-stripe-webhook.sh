#!/bin/bash

# Script pour installer Stripe CLI et configurer le webhook local
# Usage: ./setup-stripe-webhook.sh

set -e

echo "🚀 Configuration du Webhook Stripe en local"
echo "============================================"
echo ""

# Vérifier si Stripe CLI est déjà installé
if command -v stripe &> /dev/null; then
    echo "✅ Stripe CLI est déjà installé"
    stripe --version
else
    echo "❌ Stripe CLI n'est pas installé"
    echo ""
    echo "📦 Installation de Stripe CLI..."
    echo ""
    echo "Méthode recommandée pour macOS:"
    echo "1. Installez Homebrew si ce n'est pas déjà fait:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "2. Installez Stripe CLI:"
    echo "   brew install stripe/stripe-cli/stripe"
    echo ""
    echo "OU téléchargez manuellement depuis:"
    echo "https://github.com/stripe/stripe-cli/releases/latest"
    echo ""
    echo "Pour macOS ARM64 (Apple Silicon), téléchargez:"
    echo "stripe_Darwin_arm64.tar.gz"
    echo ""
    read -p "Appuyez sur Entrée une fois Stripe CLI installé, ou Ctrl+C pour annuler..."
    
    # Vérifier à nouveau
    if ! command -v stripe &> /dev/null; then
        echo "❌ Stripe CLI n'est toujours pas trouvé dans le PATH"
        echo "Assurez-vous que Stripe CLI est installé et accessible"
        exit 1
    fi
fi

echo ""
echo "🔐 Connexion à Stripe..."
echo "Une fenêtre de navigateur va s'ouvrir pour vous connecter"
stripe login

echo ""
echo "🔔 Configuration du webhook..."
echo "Le webhook va être configuré pour rediriger vers: http://localhost:3000/api/webhooks/stripe"
echo ""
echo "⚠️  IMPORTANT: Gardez ce terminal ouvert pendant le développement"
echo "Le secret du webhook sera affiché ci-dessous - copiez-le dans votre .env.local"
echo ""
echo "============================================"
echo ""

# Démarrer le forwarding et afficher le secret
stripe listen --forward-to localhost:3000/api/webhooks/stripe --print-secret

echo ""
echo "============================================"
echo "✅ Configuration terminée!"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Copiez le 'whsec_...' affiché ci-dessus"
echo "2. Ajoutez-le à votre fichier .env.local:"
echo "   STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET"
echo "3. Redémarrez votre serveur Next.js (npm run dev)"
echo ""
echo "Le webhook écoute maintenant les événements Stripe et les redirige vers votre application locale."
echo ""

