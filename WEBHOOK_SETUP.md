# 🔔 Configuration du Webhook Stripe - Guide Rapide

## ✅ Étape 1 : Stripe CLI est installé

Stripe CLI version 1.33.0 est maintenant installé sur votre système.

## 🔐 Étape 2 : Connexion à Stripe

Vous êtes déjà connecté à Stripe ! ✅

## 🔔 Étape 3 : Démarrer le Webhook

Pour démarrer le webhook Stripe en local, exécutez :

```bash
./start-stripe-webhook.sh
```

OU manuellement :

```bash
export PATH="/opt/homebrew/bin:$PATH"
stripe listen --forward-to localhost:3000/api/webhooks/stripe --print-secret
```

### 📝 Récupérer le Secret du Webhook

Quand vous démarrez le webhook, vous verrez une sortie comme :

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxx
```

**Copiez ce secret** (commence par `whsec_`) et ajoutez-le à votre fichier `.env.local` :

```env
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_ICI
```

## 🚀 Utilisation

1. **Terminal 1** : Démarrez votre application Next.js
   ```bash
   npm run dev
   ```

2. **Terminal 2** : Démarrez le webhook Stripe
   ```bash
   ./start-stripe-webhook.sh
   ```

3. Gardez les deux terminaux ouverts pendant le développement.

## 🧪 Tester

1. Allez sur [http://localhost:3000/subscription](http://localhost:3000/subscription)
2. Cliquez sur "Souscrire" pour un plan
3. Utilisez la carte de test : `4242 4242 4242 4242`
4. Vérifiez dans le terminal du webhook que les événements sont reçus

## 📚 Commandes Utiles

- **Voir les événements en temps réel** : Le webhook affiche tous les événements Stripe
- **Arrêter le webhook** : `Ctrl+C` dans le terminal
- **Vérifier la connexion** : `stripe config --list`
- **Se reconnecter** : `stripe login`

## ⚠️ Notes Importantes

- Le webhook doit être actif pour que les abonnements soient créés dans Firestore
- En production, configurez le webhook dans le Dashboard Stripe
- Le secret change à chaque redémarrage du webhook local

## 🐛 Dépannage

### Le webhook ne reçoit pas les événements

- Vérifiez que le serveur Next.js tourne sur le port 3000
- Vérifiez que l'URL du webhook est correcte : `localhost:3000/api/webhooks/stripe`
- Vérifiez les logs dans le terminal du webhook

### Erreur "Connection refused"

- Assurez-vous que `npm run dev` est lancé avant de démarrer le webhook
- Vérifiez que le port 3000 n'est pas utilisé par une autre application

