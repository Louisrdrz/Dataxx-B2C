#!/bin/bash

# Script de vérification de la configuration Firestore
# Project ID: dataxxb2c-1bc3f

echo "🔍 Vérification de la configuration Firestore"
echo "=============================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier Firebase CLI
echo -n "📦 Firebase CLI installé... "
if command -v firebase &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
    FIREBASE_VERSION=$(firebase --version)
    echo "   Version: $FIREBASE_VERSION"
else
    echo -e "${RED}✗${NC}"
    echo "   Installez Firebase CLI avec: npm install -g firebase-tools"
    exit 1
fi

echo ""

# Vérifier la connexion
echo -n "🔐 Connexion Firebase... "
if firebase projects:list &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
    CURRENT_USER=$(firebase login:list 2>/dev/null | grep "Logged in as" | cut -d' ' -f4)
    echo "   Utilisateur: $CURRENT_USER"
else
    echo -e "${RED}✗${NC}"
    echo "   Connectez-vous avec: firebase login"
    exit 1
fi

echo ""

# Vérifier le projet
echo -n "📂 Projet sélectionné... "
CURRENT_PROJECT=$(firebase use 2>/dev/null | grep "Now using" | cut -d' ' -f3)
if [ "$CURRENT_PROJECT" == "dataxxb2c-1bc3f" ]; then
    echo -e "${GREEN}✓${NC}"
    echo "   Projet: $CURRENT_PROJECT"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "   Projet actuel: ${CURRENT_PROJECT:-aucun}"
    echo "   Utilisez: firebase use dataxxb2c-1bc3f"
fi

echo ""

# Vérifier les fichiers de configuration
echo "📄 Fichiers de configuration:"
files=("firestore.rules" "firestore.indexes.json" "firebase.json" ".env.local")
for file in "${files[@]}"; do
    echo -n "   $file... "
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
done

echo ""

# Vérifier les pages
echo "📱 Pages de l'application:"
pages=("pages/dashboard.tsx" "pages/profile.tsx" "pages/login.tsx" "pages/register.tsx")
for page in "${pages[@]}"; do
    echo -n "   $page... "
    if [ -f "$page" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
done

echo ""

# Vérifier les services Firebase
echo "🔧 Services Firebase:"
services=("lib/firebase/config.ts" "lib/firebase/auth.ts" "lib/firebase/users.ts" "lib/firebase/withAuth.tsx")
for service in "${services[@]}"; do
    echo -n "   $service... "
    if [ -f "$service" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
done

echo ""

# Vérifier les variables d'environnement
echo "🔑 Variables d'environnement:"
if [ -f ".env.local" ]; then
    required_vars=(
        "NEXT_PUBLIC_FIREBASE_API_KEY"
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
        "NEXT_PUBLIC_FIREBASE_APP_ID"
    )
    
    for var in "${required_vars[@]}"; do
        echo -n "   $var... "
        if grep -q "$var" .env.local && ! grep -q "$var=your_" .env.local; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${RED}✗${NC}"
        fi
    done
else
    echo -e "   ${RED}✗ Fichier .env.local non trouvé${NC}"
fi

echo ""
echo "=============================================="
echo "📊 Liens utiles:"
echo "   Console: https://console.firebase.google.com/project/dataxxb2c-1bc3f/overview"
echo "   Firestore: https://console.firebase.google.com/project/dataxxb2c-1bc3f/firestore"
echo "   Authentication: https://console.firebase.google.com/project/dataxxb2c-1bc3f/authentication"
echo ""
