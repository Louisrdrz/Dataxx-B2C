# 🚀 Guide de Configuration Stripe - Système d'Abonnement Utilisateur

Ce guide vous explique comment configurer Stripe pour le système d'abonnement de Dataxx.

## 📋 Résumé des Plans

| Plan | Prix | Type | Recherches |
|------|------|------|------------|
| **One Shot** | 49€ | Paiement unique | 1 recherche (à vie) |
| **Basic** | 89€/mois | Abonnement | 3 recherches/mois |
| **Pro** | 179€/mois | Abonnement | 15 recherches/mois |

---

## 🔧 Étape 1 : Créer un compte Stripe

1. Allez sur [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Créez votre compte avec votre email professionnel
3. Confirmez votre email

---

## 🔑 Étape 2 : Récupérer les clés API

### En mode Test (développement)

1. Allez sur [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copiez :
   - **Publishable key** : `pk_test_...`
   - **Secret key** : `sk_test_...` (cliquez sur "Reveal test key")

### Mettre à jour votre `.env.local`

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE
```

---

## 💰 Étape 3 : Créer les Produits et Prix dans Stripe

### Option A : Via le Dashboard Stripe (Recommandé)

1. Allez sur [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)

#### Créer le produit "One Shot"

1. Cliquez sur **"+ Add product"**
2. Remplissez :
   - **Name** : `One Shot - Recherche de Sponsors`
   - **Description** : `1 recherche de sponsors complète avec recommandations IA personnalisées`
3. Dans **Pricing** :
   - Sélectionnez **"One time"**
   - **Price** : `49.00 EUR`
4. Cliquez sur **"Save product"**
5. **Copiez le Price ID** (ex: `price_1ABC123...`)

#### Créer le produit "Basic"

1. Cliquez sur **"+ Add product"**
2. Remplissez :
   - **Name** : `Basic - Abonnement Mensuel`
   - **Description** : `3 recherches de sponsors par mois`
3. Dans **Pricing** :
   - Sélectionnez **"Recurring"**
   - **Price** : `89.00 EUR`
   - **Billing period** : `Monthly`
4. Cliquez sur **"Save product"**
5. **Copiez le Price ID** (ex: `price_2DEF456...`)

#### Créer le produit "Pro"

1. Cliquez sur **"+ Add product"**
2. Remplissez :
   - **Name** : `Pro - Abonnement Mensuel`
   - **Description** : `15 recherches de sponsors par mois`
3. Dans **Pricing** :
   - Sélectionnez **"Recurring"**
   - **Price** : `179.00 EUR`
   - **Billing period** : `Monthly`
4. Cliquez sur **"Save product"**
5. **Copiez le Price ID** (ex: `price_3GHI789...`)

### Mettre à jour votre `.env.local`

```env
STRIPE_PRICE_ID_ONE_SHOT=price_VOTRE_ID_ONE_SHOT
STRIPE_PRICE_ID_BASIC=price_VOTRE_ID_BASIC
STRIPE_PRICE_ID_PRO=price_VOTRE_ID_PRO
```

---

## 🔔 Étape 4 : Configurer le Webhook

### En développement local (avec Stripe CLI)

1. **Installer Stripe CLI** :
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows (avec scoop)
   scoop install stripe
   ```

2. **Se connecter** :
   ```bash
   stripe login
   ```

3. **Démarrer le forwarding** :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copier le webhook signing secret** affiché (ex: `whsec_...`) et l'ajouter à `.env.local` :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET
   ```

### En production (sur Vercel, etc.)

1. Allez sur [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. Cliquez sur **"+ Add endpoint"**
3. Remplissez :
   - **Endpoint URL** : `https://votre-domaine.com/api/webhooks/stripe`
   - **Events to listen to** : Sélectionnez ces événements :
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
4. Cliquez sur **"Add endpoint"**
5. Copiez le **Signing secret** et ajoutez-le à vos variables d'environnement de production

---

## 🧾 Étape 5 : Configurer le Customer Portal

1. Allez sur [https://dashboard.stripe.com/test/settings/billing/portal](https://dashboard.stripe.com/test/settings/billing/portal)
2. Activez le portal
3. Configurez :
   - ✅ **Allow customers to update payment methods**
   - ✅ **Allow customers to view invoice history**
   - ✅ **Allow customers to cancel subscriptions**
   - Dans **Cancellation** : choisissez "Cancel immediately" ou "At end of billing period"
4. Cliquez sur **"Save changes"**

---

## 📁 Fichier `.env.local` complet

```env
# ===================================
# CONFIGURATION STRIPE
# ===================================

# Clés API Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_VOTRE_SECRET_KEY

# Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET

# Price IDs des produits
STRIPE_PRICE_ID_ONE_SHOT=price_VOTRE_ID_ONE_SHOT
STRIPE_PRICE_ID_BASIC=price_VOTRE_ID_BASIC
STRIPE_PRICE_ID_PRO=price_VOTRE_ID_PRO

# URL de l'application (pour les redirections)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✅ Étape 6 : Tester l'intégration

### Démarrer l'application

```bash
npm run dev
```

### Démarrer Stripe CLI (dans un autre terminal)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Tester un paiement

1. Allez sur [http://localhost:3000/subscription](http://localhost:3000/subscription)
2. Cliquez sur "Souscrire" pour un plan
3. Utilisez une carte de test Stripe :
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future
   - **CVC** : N'importe quels 3 chiffres
   - **ZIP** : N'importe quels chiffres

### Vérifier dans Firestore

Après un paiement réussi, vérifiez que la collection `userSubscriptions` contient le nouvel abonnement.

---

## 🔒 Passage en Production

Quand vous êtes prêt pour la production :

1. Allez sur [https://dashboard.stripe.com/settings/account](https://dashboard.stripe.com/settings/account)
2. Complétez la vérification de votre compte
3. Activez le mode Live
4. Récupérez les clés Live (`pk_live_...` et `sk_live_...`)
5. Créez les produits en mode Live avec les mêmes prix
6. Configurez le webhook en mode Live
7. Mettez à jour les variables d'environnement de production

---

## 🐛 Dépannage

### Le webhook ne reçoit pas les événements

- Vérifiez que Stripe CLI tourne (`stripe listen`)
- Vérifiez que le webhook secret est correct
- Consultez les logs : `stripe logs tail`

### Erreur "Price ID manquant"

- Vérifiez que tous les `STRIPE_PRICE_ID_*` sont dans `.env.local`
- Redémarrez le serveur Next.js après avoir modifié `.env.local`

### Le paiement réussit mais l'abonnement n'apparaît pas

- Vérifiez les logs du webhook dans le terminal Stripe CLI
- Vérifiez les logs de l'application (`console.log`)
- Vérifiez les règles de sécurité Firestore

---

## 📚 Architecture du système

```
┌─────────────────┐
│    Frontend     │
│  subscription   │
│     .tsx        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  API Checkout   │────▶│  Stripe API     │
│    Session      │     │                 │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
┌─────────────────┐     ┌─────────────────┐
│   Webhook       │◀────│  Stripe Events  │
│   Handler       │     │                 │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Firestore     │
│ userSubscriptions│
└─────────────────┘
```

---

## 🎉 C'est terminé !

Votre système d'abonnement est maintenant configuré. Les utilisateurs peuvent :
- Souscrire à un plan One Shot, Basic ou Pro
- Voir leur abonnement actuel et le nombre de recherches restantes
- Gérer leur abonnement via le Customer Portal Stripe
- Être automatiquement facturés chaque mois (pour Basic et Pro)

Pour toute question, consultez la [documentation Stripe](https://stripe.com/docs).

