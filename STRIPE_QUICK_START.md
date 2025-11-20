# 🚀 Guide de Démarrage Rapide - Stripe

Ce guide vous permet de démarrer rapidement avec Stripe en quelques étapes simples.

---

## ⚡ Installation (5 minutes)

### 1. Installer les dépendances

```bash
npm install stripe @stripe/stripe-js micro
```

### 2. Créer votre fichier .env.local

Créez un fichier `.env.local` à la racine du projet :

```env
# Stripe - Mode Test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# IDs des prix Stripe
STRIPE_PRICE_ID_BASIC=price_id_du_plan_basic
STRIPE_PRICE_ID_PRO=price_id_du_plan_pro

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📝 Configuration Stripe (10 minutes)

### Étape 1 : Créer votre compte Stripe

1. Allez sur https://dashboard.stripe.com/register
2. Inscrivez-vous avec votre email
3. Vérifiez que vous êtes en **mode Test**

### Étape 2 : Récupérer vos clés API

1. Dans Stripe Dashboard, allez dans **Développeurs** > **Clés API**
2. Copiez :
   - **Clé publiable** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Clé secrète** → `STRIPE_SECRET_KEY`

### Étape 3 : Créer les produits

#### Plan Basic (89,99€/mois avec 14 jours gratuits)

1. **Produits** > **+ Ajouter un produit**
2. Remplissez :
   - Nom : `Dataxx Basic`
   - Description : `Plan Basic - Max 3 utilisateurs, 10 contacts`
   - Prix : `89.99` EUR
   - Facturation : **Mensuelle**
   - Essai gratuit : **14 jours**
3. Cliquez sur **Enregistrer**
4. Copiez l'ID du prix → `STRIPE_PRICE_ID_BASIC`

#### Plan Pro (150€/mois)

1. **Produits** > **+ Ajouter un produit**
2. Remplissez :
   - Nom : `Dataxx Pro`
   - Description : `Plan Pro - Max 5 utilisateurs, 50 contacts`
   - Prix : `150` EUR
   - Facturation : **Mensuelle**
3. Cliquez sur **Enregistrer**
4. Copiez l'ID du prix → `STRIPE_PRICE_ID_PRO`

---

## 🔔 Configuration des Webhooks (5 minutes)

### En développement local

1. **Installer Stripe CLI** :

   **macOS** :
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

   **Windows** : Téléchargez depuis https://github.com/stripe/stripe-cli/releases

2. **Connectez-vous à Stripe** :
   ```bash
   stripe login
   ```

3. **Lancez le forwarding** (dans un terminal séparé) :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copiez le **webhook signing secret** affiché → `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Test de l'intégration

### 1. Démarrer l'application

```bash
npm run dev
```

### 2. Tester un abonnement

1. Allez sur votre workspace
2. Accédez aux paramètres
3. Cliquez sur "Passer au plan Basic"
4. Utilisez la carte de test : `4242 4242 4242 4242`
5. Date : N'importe quelle date future
6. CVC : N'importe quel 3 chiffres

### 3. Vérifier le webhook

- Dans le terminal où Stripe CLI écoute, vous devriez voir les événements arriver
- Vérifiez dans Firestore que l'abonnement a été créé

---

## 🎨 Intégrer les composants dans votre UI

### Dans la page des paramètres du workspace

```typescript
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { PricingPlans } from '@/components/PricingPlans';

// Dans votre composant
const WorkspaceSettings = () => {
  const { workspace, userRole } = useWorkspace();
  const { activeSubscription } = useSubscription(workspace?.id);

  return (
    <div>
      {/* Afficher le gestionnaire d'abonnement si un abonnement existe */}
      {activeSubscription ? (
        <SubscriptionManager 
          workspaceId={workspace.id}
          isAdmin={userRole === 'admin'}
        />
      ) : (
        /* Sinon afficher les plans disponibles */
        <PricingPlans 
          workspaceId={workspace.id}
          currentPlan={activeSubscription?.planName}
        />
      )}
    </div>
  );
};
```

---

## 🔒 Sécurité : Mettre à jour les Firestore Rules

Ajoutez ces règles dans `firestore.rules` :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Règles pour les abonnements
    match /subscriptions/{subscriptionId} {
      // Seuls les admins du workspace peuvent lire
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/workspaceMembers/$(resource.data.workspaceId + '_' + request.auth.uid)) &&
        get(/databases/$(database)/documents/workspaceMembers/$(resource.data.workspaceId + '_' + request.auth.uid)).data.role == 'admin';
      
      // Les modifications se font uniquement via webhooks (côté serveur)
      allow write: if false;
    }
  }
}
```

---

## ✅ Vérification de l'installation

Checklist :

- [ ] Dépendances installées (`stripe`, `@stripe/stripe-js`, `micro`)
- [ ] Fichier `.env.local` créé avec toutes les variables
- [ ] Compte Stripe créé en mode Test
- [ ] Deux produits créés (Basic et Pro)
- [ ] Stripe CLI installé et connecté
- [ ] Webhooks en écoute (`stripe listen`)
- [ ] Test de paiement réussi avec carte test
- [ ] Abonnement visible dans Firestore
- [ ] Firestore rules mises à jour

---

## 🐛 Dépannage rapide

### Erreur "Variables d'environnement manquantes"

→ Vérifiez que `.env.local` existe et contient toutes les variables

### Webhooks ne fonctionnent pas

→ Vérifiez que `stripe listen` est en cours d'exécution

### Paiement refusé

→ Utilisez la carte test : `4242 4242 4242 4242`

### L'abonnement n'apparaît pas dans Firestore

→ Vérifiez les logs du webhook dans le terminal Stripe CLI

---

## 📞 Support

- **Documentation complète** : Voir `STRIPE_CONFIGURATION.md`
- **Stripe Docs** : https://stripe.com/docs
- **Support Stripe** : support@stripe.com

---

**C'est tout ! Vous êtes prêt à monétiser votre SaaS ! 🎉**

