# Configuration Stripe pour Dataxx - Guide Complet

## 📋 Vue d'ensemble

Ce guide vous explique comment configurer Stripe pour monétiser votre SaaS Dataxx avec deux plans d'abonnement :

- **Plan Basic** : 89,99€/mois (14 jours gratuits) - Max 3 utilisateurs, 10 contacts
- **Plan Pro** : 150€/mois - Max 5 utilisateurs, 50 contacts

## 🎯 Plans d'abonnement

### Plan Basic
- **Prix** : 89,99€/mois
- **Période d'essai** : 14 jours gratuits
- **Limites** :
  - Maximum 3 utilisateurs par workspace
  - 10 contacts et infos de sponsors trouvés partagés par équipe

### Plan Pro
- **Prix** : 150€/mois
- **Période d'essai** : Aucune (optionnel : peut être ajoutée)
- **Limites** :
  - Maximum 5 utilisateurs par workspace
  - 50 contacts et infos de sponsors trouvés partagés par équipe

---

## 🚀 Étape 1 : Configuration de votre compte Stripe

### 1.1 Créer un compte Stripe

1. Allez sur https://dashboard.stripe.com/register
2. Créez votre compte avec votre email professionnel
3. Complétez les informations de votre entreprise

### 1.2 Activer le mode Test

⚠️ **Important** : Commencez toujours en mode Test avant de passer en production

1. Dans le dashboard Stripe, vérifiez que vous êtes en mode **Test** (toggle en haut à droite)
2. Vous verrez "Mode test" affiché dans l'interface

### 1.3 Récupérer vos clés API

1. Allez dans **Développeurs** > **Clés API**
2. Notez ces deux clés :
   - **Clé publiable** (commence par `pk_test_...`)
   - **Clé secrète** (commence par `sk_test_...`)

⚠️ **Ne partagez JAMAIS votre clé secrète** dans votre code frontend ou sur Git !

---

## 🎨 Étape 2 : Créer les produits et prix dans Stripe

### 2.1 Créer le produit "Basic"

1. Dans le dashboard Stripe, allez dans **Produits** > **+ Ajouter un produit**
2. Remplissez :
   - **Nom** : `Dataxx Basic`
   - **Description** : `Plan Basic - Maximum 3 utilisateurs, 10 contacts`
   - **Image** : Ajoutez votre logo (optionnel)

3. Configuration du prix :
   - **Modèle de tarification** : Tarification standard
   - **Prix** : `89.99` EUR
   - **Cycle de facturation** : Mensuel (Monthly)
   - **Période d'essai gratuite** : `14 jours`

4. Cliquez sur **Enregistrer le produit**
5. **IMPORTANT** : Notez l'ID du prix (commence par `price_...`) qui apparaît

### 2.2 Créer le produit "Pro"

1. **Produits** > **+ Ajouter un produit**
2. Remplissez :
   - **Nom** : `Dataxx Pro`
   - **Description** : `Plan Pro - Maximum 5 utilisateurs, 50 contacts`

3. Configuration du prix :
   - **Modèle de tarification** : Tarification standard
   - **Prix** : `150` EUR
   - **Cycle de facturation** : Mensuel (Monthly)
   - **Période d'essai gratuite** : Laissez vide (ou ajoutez si souhaité)

4. Cliquez sur **Enregistrer le produit**
5. **IMPORTANT** : Notez l'ID du prix (commence par `price_...`)

### 2.3 Récapitulatif des IDs

Vous devriez maintenant avoir :
```
STRIPE_PRICE_ID_BASIC=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_PRO=price_xxxxxxxxxxxxx
```

---

## 🔐 Étape 3 : Configuration des variables d'environnement

### 3.1 Créer le fichier .env.local

À la racine de votre projet, créez un fichier `.env.local` :

```env
# Stripe - Mode Test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# IDs des prix Stripe
STRIPE_PRICE_ID_BASIC=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_PRO=price_xxxxxxxxxxxxx

# URL de votre application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2 Variables pour Vercel (Production)

Quand vous déploierez en production :

1. Allez dans votre projet Vercel
2. **Settings** > **Environment Variables**
3. Ajoutez toutes ces variables :
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : Votre clé publique **de production** (pk_live_...)
   - `STRIPE_SECRET_KEY` : Votre clé secrète **de production** (sk_live_...)
   - `STRIPE_WEBHOOK_SECRET` : Votre secret webhook de production
   - `STRIPE_PRICE_ID_BASIC` : ID du prix Basic en production
   - `STRIPE_PRICE_ID_PRO` : ID du prix Pro en production
   - `NEXT_PUBLIC_APP_URL` : https://votre-domaine.com

---

## 🔔 Étape 4 : Configuration des Webhooks Stripe

Les webhooks permettent à Stripe de notifier votre application des événements (paiement réussi, abonnement annulé, etc.)

### 4.1 Webhooks en développement local (avec Stripe CLI)

#### Installation de Stripe CLI

**macOS** :
```bash
brew install stripe/stripe-cli/stripe
```

**Windows** : Téléchargez depuis https://github.com/stripe/stripe-cli/releases

**Linux** :
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

#### Configuration

1. Connectez-vous à Stripe :
```bash
stripe login
```

2. Dans un terminal séparé, lancez le forwarding des webhooks :
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Copiez le **webhook signing secret** affiché (commence par `whsec_...`)
4. Ajoutez-le dans votre `.env.local` :
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 4.2 Webhooks en production (Vercel)

1. Allez dans le dashboard Stripe > **Développeurs** > **Webhooks**
2. Cliquez sur **+ Ajouter un point de terminaison**
3. URL du point de terminaison : `https://votre-domaine.com/api/webhooks/stripe`
4. Sélectionnez les événements à écouter :
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `checkout.session.completed`
5. Cliquez sur **Ajouter un point de terminaison**
6. Copiez le **Signing secret** et ajoutez-le dans les variables d'environnement Vercel

---

## 📦 Étape 5 : Installation des dépendances

Installez Stripe dans votre projet :

```bash
npm install stripe @stripe/stripe-js
```

---

## 🔧 Étape 6 : Mise en place du code

Les fichiers suivants vont être créés automatiquement :

### Fichiers créés :

1. **lib/stripe/config.ts** - Configuration Stripe
2. **lib/stripe/client.ts** - Client Stripe côté serveur
3. **lib/firebase/subscriptions.ts** - Gestion des abonnements dans Firestore (déjà existant, sera mis à jour)
4. **pages/api/create-checkout-session.ts** - API pour créer une session de paiement
5. **pages/api/create-billing-portal-session.ts** - API pour gérer l'abonnement
6. **pages/api/webhooks/stripe.ts** - Webhook pour recevoir les événements Stripe
7. **components/PricingPlans.tsx** - Component UI pour afficher les plans
8. **components/SubscriptionManager.tsx** - Component pour gérer l'abonnement

---

## 🧪 Étape 7 : Tests

### 7.1 Cartes de test Stripe

Utilisez ces numéros de carte en mode test :

**Paiement réussi** :
- Numéro : `4242 4242 4242 4242`
- Date : N'importe quelle date future
- CVC : N'importe quel 3 chiffres
- Code postal : N'importe lequel

**Paiement refusé** :
- Numéro : `4000 0000 0000 0002`

**Authentification 3D Secure requise** :
- Numéro : `4000 0025 0000 3155`

### 7.2 Scénarios de test

1. **Test d'abonnement Basic** :
   - Créez un workspace
   - Cliquez sur "Passer au plan Basic"
   - Complétez le paiement avec la carte de test
   - Vérifiez que l'abonnement est actif dans votre dashboard
   - Vérifiez dans Firestore que l'abonnement est enregistré

2. **Test de la période d'essai** :
   - L'abonnement Basic doit montrer 14 jours d'essai
   - Vérifiez dans Stripe dashboard que `trial_end` est défini

3. **Test du portail de facturation** :
   - Allez dans les paramètres du workspace
   - Cliquez sur "Gérer mon abonnement"
   - Vous devriez être redirigé vers le portail Stripe
   - Testez l'annulation, la modification de carte, etc.

4. **Test des webhooks** :
   - Avec Stripe CLI en écoute, effectuez un paiement
   - Vérifiez dans la console que les webhooks sont reçus
   - Vérifiez dans Firestore que les données sont mises à jour

---

## 🚨 Étape 8 : Gestion des limites et restrictions

### 8.1 Vérification des limites dans le code

Les limites sont vérifiées automatiquement :

**Pour l'ajout de membres** :
- Le système vérifie `subscription.maxMembers`
- Empêche l'ajout si la limite est atteinte

**Pour l'ajout de contacts** :
- Le système vérifie le nombre de contacts dans le workspace
- Bloque l'ajout si la limite est dépassée

### 8.2 Mise à niveau automatique

Si un utilisateur veut ajouter plus de membres que sa limite :
- Afficher un message : "Vous avez atteint la limite de votre plan Basic (3 membres). Passez au plan Pro pour ajouter jusqu'à 5 membres."
- Proposer un bouton "Passer au plan Pro"

---

## 📊 Étape 9 : Passage en production

### 9.1 Activer votre compte Stripe

1. Dans le dashboard Stripe, cliquez sur **Activer votre compte**
2. Remplissez toutes les informations requises :
   - Informations légales de l'entreprise
   - Informations bancaires pour recevoir les paiements
   - Documents d'identité
3. Attendez la validation (généralement 24-48h)

### 9.2 Recréer les produits en mode Live

1. Basculez sur le mode **Live** dans Stripe (toggle en haut à droite)
2. Recréez les deux produits (Basic et Pro) avec les mêmes configurations
3. Notez les nouveaux IDs de prix (price_live_...)

### 9.3 Mettre à jour les variables d'environnement Vercel

Remplacez toutes les clés test par les clés live :
- `pk_test_...` → `pk_live_...`
- `sk_test_...` → `sk_live_...`
- `price_test_...` → `price_live_...`

### 9.4 Configurer les webhooks de production

Comme expliqué à l'étape 4.2, créez le webhook pointant vers votre domaine de production.

---

## 🛡️ Étape 10 : Sécurité et bonnes pratiques

### 10.1 Sécurité

- ✅ Ne jamais exposer `STRIPE_SECRET_KEY` côté client
- ✅ Toujours vérifier la signature des webhooks
- ✅ Valider tous les inputs côté serveur
- ✅ Utiliser HTTPS en production (obligatoire)
- ✅ Activer l'authentification 3D Secure (SCA) en Europe

### 10.2 Firestore Security Rules

Ajoutez ces règles pour protéger les abonnements :

```javascript
// Seuls les admins du workspace peuvent lire/modifier l'abonnement
match /subscriptions/{subscriptionId} {
  allow read: if isWorkspaceAdmin(resource.data.workspaceId);
  allow write: if false; // Les modifications se font uniquement via webhooks
}
```

### 10.3 Monitoring

1. **Surveillez les erreurs de webhooks** dans Stripe Dashboard
2. **Configurez des alertes** pour les paiements échoués
3. **Analysez les métriques** : taux de conversion, churn, MRR

---

## 📈 Étape 11 : Optimisations et améliorations

### 11.1 Fonctionnalités avancées

- **Coupons de réduction** : Créez des codes promo dans Stripe
- **Facturation annuelle** : Ajoutez une option avec réduction (ex: -20%)
- **Plan Enterprise sur mesure** : Contact direct pour les grandes équipes
- **Pause d'abonnement** : Permettre de suspendre temporairement

### 11.2 Récupération des paiements échoués

Stripe Billing gère automatiquement :
- Relance des paiements échoués
- Emails de rappel aux clients
- Gestion de la période de grâce

### 11.3 Analytics

Suivez ces métriques clés :
- **MRR (Monthly Recurring Revenue)** : Revenu mensuel récurrent
- **Churn Rate** : Taux d'annulation
- **LTV (Lifetime Value)** : Valeur vie client
- **CAC (Customer Acquisition Cost)** : Coût d'acquisition

---

## 🆘 Dépannage

### Problème : Les webhooks ne fonctionnent pas

**Solution** :
1. Vérifiez que Stripe CLI est en cours d'exécution
2. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
3. Regardez les logs dans le terminal Stripe CLI

### Problème : Erreur "No such price"

**Solution** :
1. Vérifiez que vous utilisez les bons IDs de prix (test vs live)
2. Vérifiez que les variables d'environnement sont bien chargées

### Problème : L'abonnement n'apparaît pas dans Firestore

**Solution** :
1. Vérifiez que le webhook `checkout.session.completed` est bien reçu
2. Vérifiez les logs de la fonction webhook
3. Vérifiez les permissions Firestore

---

## 📞 Support

- **Documentation Stripe** : https://stripe.com/docs
- **Discord Stripe** : https://discord.gg/stripe
- **Support Stripe** : support@stripe.com

---

## ✅ Checklist finale

Avant de lancer en production :

- [ ] Compte Stripe activé et vérifié
- [ ] Produits Basic et Pro créés en mode Live
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Webhooks configurés et testés
- [ ] Tests de paiement effectués
- [ ] Tests de la période d'essai validés
- [ ] Tests du portail de facturation OK
- [ ] Limites de plans vérifiées
- [ ] Security rules Firestore mises à jour
- [ ] Monitoring et alertes configurés
- [ ] Mentions légales et CGV mis à jour
- [ ] RGPD : Politique de confidentialité à jour

---

**Bon lancement ! 🚀**

