# 🚀 Guide rapide : Tester l'accès Google Calendar et Contacts

## ✅ Ce qui a été fait

J'ai configuré votre application pour demander l'accès aux calendriers et contacts Google lors de la connexion.

### Modifications principales :

1. **`lib/firebase/auth.ts`** ✅
   - Ajout des scopes OAuth pour Calendar et Contacts
   - Configuration du consentement (`prompt: 'consent'`) pour afficher les permissions à chaque connexion
   - Stockage automatique du token d'accès Google

2. **`lib/firebase/googleApis.ts`** ✅ (nouveau)
   - Fonctions pour récupérer les événements de calendrier
   - Fonctions pour récupérer les contacts
   - Fonctions pour récupérer la liste des calendriers

3. **`hooks/useGoogleData.ts`** ✅ (nouveau)
   - Hooks React pour faciliter l'utilisation des APIs Google
   - Gestion automatique du loading et des erreurs

4. **`pages/google-data.tsx`** ✅ (nouveau)
   - Page de démonstration complète avec tous vos calendriers et contacts

## 🎯 Étapes pour tester MAINTENANT

### 1. Configurer Google Cloud Console (5 minutes)

Allez sur https://console.cloud.google.com/

#### a) Activer les APIs
- **APIs & Services** > **Library**
- Cherchez et activez :
  - ✅ Google Calendar API
  - ✅ Google People API

#### b) Configurer OAuth Consent Screen
- **APIs & Services** > **OAuth consent screen**
- Ajoutez ces scopes :
  ```
  https://www.googleapis.com/auth/calendar.readonly
  https://www.googleapis.com/auth/calendar.events.readonly
  https://www.googleapis.com/auth/contacts.readonly
  ```

#### c) Ajouter votre email comme testeur (si en mode Testing)
- Dans l'écran de consentement OAuth
- Section "Test users"
- Ajoutez votre email Google

### 2. Démarrer l'application

```bash
npm run dev
```

### 3. Tester la connexion

#### Option A : Page de test dédiée
```
http://localhost:3000/google-data
```
1. Cliquez sur "Se connecter avec Google"
2. **Vous verrez maintenant un écran demandant les permissions** pour :
   - 📅 Voir et gérer vos calendriers
   - 👥 Voir vos contacts
3. Acceptez les permissions
4. Vous verrez vos événements, calendriers et contacts !

#### Option B : Pages existantes (login/register)
```
http://localhost:3000/login
```
1. Cliquez sur "Se connecter avec Google"
2. Acceptez les permissions
3. Allez ensuite sur `/google-data` pour voir vos données

## 🔍 Vérifier que ça fonctionne

### Dans le navigateur (Console DevTools - F12)

```javascript
// Vérifier que le token est bien stocké
console.log(localStorage.getItem('google_access_token'));
// Devrait afficher un long token si tout va bien
```

### Vérifier les permissions accordées

```javascript
// Dans la console du navigateur, après connexion
fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + 
      localStorage.getItem('google_access_token'))
  .then(r => r.json())
  .then(data => console.log('Scopes accordés:', data.scope))
```

Vous devriez voir :
```
calendar.readonly calendar.events.readonly contacts.readonly userinfo.email userinfo.profile
```

## 🎨 Intégrer dans vos pages existantes

### Exemple : Ajouter au Dashboard

```typescript
// pages/dashboard.tsx
import { useCalendarEvents } from '@/hooks/useGoogleData';

export default function Dashboard() {
  const { events, isLoading } = useCalendarEvents(5);

  return (
    <div>
      {/* Votre code existant */}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold">Prochains rendez-vous</h2>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 5).map(event => (
              <div key={event.id} className="p-3 border rounded">
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-600">
                  {event.start?.toLocaleString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

## ⚠️ Points d'attention

### Si ça ne marche pas :

1. **Erreur "Access blocked"**
   - ➡️ Ajoutez votre email dans les "Test users" de Google Cloud Console

2. **Pas d'écran de permissions**
   - ➡️ Déconnectez-vous d'abord, puis reconnectez-vous
   - ➡️ Ou effacez le cache/cookies du navigateur

3. **Erreur 403**
   - ➡️ Vérifiez que les APIs sont bien activées dans Google Cloud Console

4. **Token null ou undefined**
   - ➡️ Reconnectez-vous avec Google
   - ➡️ Vérifiez dans la console Firebase que Google Auth est activé

## 📊 Ce que vous pouvez récupérer

### Calendrier
- ✅ Liste de tous les calendriers
- ✅ Événements à venir (titre, date, heure, lieu, participants)
- ✅ Événements passés (si besoin)

### Contacts
- ✅ Nom complet
- ✅ Email(s)
- ✅ Numéro(s) de téléphone
- ✅ Organisation/Entreprise
- ✅ Poste

## 🚀 Prochaine étape : Déployer

Une fois que tout fonctionne en local, n'oubliez pas de :

1. Ajouter votre domaine de production dans les URI de redirection OAuth
2. Passer votre app en "Production" dans Google Cloud Console (nécessite une vérification)
3. Commit et push vos changements :

```bash
git add .
git commit -m "feat: Add Google Calendar and Contacts integration"
git push origin main
```

## 🎉 C'est prêt !

Testez maintenant sur : **http://localhost:3000/google-data**

Si vous avez des questions ou des problèmes, consultez le fichier `GOOGLE_INTEGRATION.md` pour plus de détails.
