# Dataxx B2C - Application Next.js

Application web Next.js pour Dataxx, plateforme IA de sponsoring sportif.

## 🚀 Technologies utilisées

- **Next.js 14** - Framework React pour la production
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations
- **Radix UI** - Composants UI accessibles
- **React Query** - Gestion d'état serveur
- **EmailJS** - Service d'envoi d'emails

## 📦 Installation

```bash
npm install
```

## 🛠️ Configuration

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## 🏃 Développement

Lancer le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🏗️ Build

Pour créer une version de production :

```bash
npm run build
```

Pour lancer la version de production :

```bash
npm start
```

## 📁 Structure du projet

- **components/** - Composants React réutilisables
- **hooks/** - Custom React hooks (useLanguage pour FR/EN)
- **pages/** - Pages Next.js (routing automatique)
- **public/** - Assets statiques (images, logos)
- **services/** - Services et API (EmailJS)
- **styles/** - Styles globaux (Tailwind CSS)
- **types/** - Types TypeScript

## 🌐 Pages disponibles

- `/` - Page d'accueil
- `/demo` - Formulaire de demande de démo
- `/mentions-legales` - Mentions légales

## 🎨 Personnalisation

Les couleurs principales sont définies dans `styles/globals.css` :
- Violet principal (#7c3aed)
- Gris foncé pour le texte
- Violet clair pour les accents

L'application supporte le français et l'anglais via `hooks/useLanguage.tsx`.

## 📝 License

Propriété de Dataxx - Tous droits réservés
