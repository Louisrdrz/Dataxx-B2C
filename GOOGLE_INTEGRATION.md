# Intégration Google Calendar et Contacts

## 📋 Vue d'ensemble

Cette intégration permet aux utilisateurs de :
- Se connecter avec leur compte Google
- Autoriser l'accès à leurs calendriers Google
- Autoriser l'accès à leurs contacts Google
- Visualiser leurs événements, calendriers et contacts dans l'application

## 🔑 Configuration requise dans la Console Google Cloud

### 1. Activer les APIs

Dans la [Console Google Cloud](https://console.cloud.google.com/), activez les APIs suivantes :

1. **Google Calendar API**
   - Accédez à "APIs & Services" > "Library"
   - Recherchez "Google Calendar API"
   - Cliquez sur "Enable"

2. **Google People API** (pour les contacts)
   - Recherchez "Google People API"
   - Cliquez sur "Enable"

### 2. Configurer l'écran de consentement OAuth

1. Allez dans "APIs & Services" > "OAuth consent screen"
2. Choisissez "External" (ou "Internal" si vous avez Google Workspace)
3. Remplissez les informations requises :
   - Nom de l'application : "Dataxx"
   - Email de support
   - Domaine autorisé : `dataxx.com` (votre domaine)

4. **Ajoutez les scopes** :
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events.readonly`
   - `https://www.googleapis.com/auth/contacts.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

### 3. Créer les identifiants OAuth 2.0

1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth 2.0 Client ID"
3. Type d'application : "Web application"
4. Ajoutez les **URI de redirection autorisés** :
   ```
   http://localhost:3000
   https://votre-domaine.com
   https://dataxxb2c.firebaseapp.com
   https://dataxxb2c.web.app
   ```
5. Copiez le Client ID et le Client Secret

### 4. Configurer Firebase

Dans votre [Console Firebase](https://console.firebase.google.com/) :

1. Allez dans "Authentication" > "Sign-in method"
2. Activez "Google"
3. Ajoutez le Client ID et Client Secret de Google Cloud
4. Enregistrez les modifications

## 🚀 Utilisation dans le code

### Connexion avec Google

```typescript
import { signInWithGoogle } from '@/lib/firebase/auth';

// L'utilisateur sera invité à autoriser l'accès aux calendriers et contacts
const handleSignIn = async () => {
  try {
    const result = await signInWithGoogle();
    // Le token d'accès est automatiquement stocké
    console.log('Connecté avec succès!');
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Récupérer les événements du calendrier

```typescript
import { useCalendarEvents } from '@/hooks/useGoogleData';

function MyComponent() {
  const { events, isLoading, error, refetch } = useCalendarEvents(50);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.start?.toLocaleString()}</p>
          <p>{event.location}</p>
        </div>
      ))}
    </div>
  );
}
```

### Récupérer les contacts

```typescript
import { useContacts } from '@/hooks/useGoogleData';

function ContactsList() {
  const { contacts, isLoading, error, refetch } = useContacts();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {contacts.map(contact => (
        <div key={contact.id}>
          <h3>{contact.displayName}</h3>
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
          <p>{contact.company} - {contact.jobTitle}</p>
        </div>
      ))}
    </div>
  );
}
```

### Récupérer la liste des calendriers

```typescript
import { useCalendarList } from '@/hooks/useGoogleData';

function CalendarsList() {
  const { calendars, isLoading, error } = useCalendarList();

  return (
    <div>
      {calendars.map(calendar => (
        <div key={calendar.id}>
          <h3>{calendar.summary}</h3>
          <div style={{ backgroundColor: calendar.backgroundColor }}>
            {calendar.description}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 📦 Fichiers créés

### 1. `lib/firebase/auth.ts` (modifié)
- Configuration du GoogleAuthProvider avec les scopes nécessaires
- Fonction `signInWithGoogle()` qui stocke automatiquement le token d'accès
- Fonction `getGoogleAccessToken()` pour récupérer le token stocké

### 2. `lib/firebase/googleApis.ts` (nouveau)
- Fonctions pour interagir avec Google Calendar API
- Fonctions pour interagir avec Google People API (Contacts)
- Fonctions de formatage des données
- Vérification des permissions

### 3. `hooks/useGoogleData.ts` (nouveau)
- Hook `useGoogleData()` : état de base (token, permissions)
- Hook `useCalendarEvents()` : récupère les événements
- Hook `useContacts()` : récupère les contacts
- Hook `useCalendarList()` : récupère la liste des calendriers

### 4. `pages/google-data.tsx` (nouveau)
- Page de démonstration complète
- Affichage des événements, calendriers et contacts
- Interface utilisateur avec onglets
- Gestion des erreurs et du chargement

## 🔒 Sécurité et confidentialité

### Scopes demandés

- **`calendar.readonly`** : Lecture seule des calendriers
- **`calendar.events.readonly`** : Lecture seule des événements
- **`contacts.readonly`** : Lecture seule des contacts

### Stockage du token

Le token d'accès est stocké dans `localStorage` :
```typescript
localStorage.setItem('google_access_token', accessToken);
```

**⚠️ Note importante :** Pour la production, considérez :
- Stocker le token de manière sécurisée (backend)
- Implémenter le refresh token pour renouveler l'accès
- Chiffrer les données sensibles
- Ajouter une expiration du token

## 🧪 Test de l'intégration

1. **Démarrez votre application** :
   ```bash
   npm run dev
   ```

2. **Accédez à la page de test** :
   ```
   http://localhost:3000/google-data
   ```

3. **Cliquez sur "Se connecter avec Google"**
   - Vous verrez l'écran de consentement Google
   - Acceptez les permissions demandées
   - Vous serez redirigé vers la page avec vos données

4. **Vérifiez les données** :
   - Onglet "Événements" : vos prochains rendez-vous
   - Onglet "Calendriers" : liste de vos calendriers
   - Onglet "Contacts" : vos contacts Google

## 🐛 Dépannage

### Erreur 403 : Accès refusé

**Solution** : Vérifiez que les APIs sont bien activées dans Google Cloud Console

### Erreur 401 : Non autorisé

**Solution** : Le token a peut-être expiré. Reconnectez-vous avec Google.

### Aucun événement/contact affiché

**Vérifications** :
1. Vérifiez que vous avez bien des événements/contacts dans votre compte Google
2. Ouvrez la console du navigateur pour voir les erreurs
3. Vérifiez que les scopes sont bien configurés
4. Vérifiez que le token est bien stocké : `localStorage.getItem('google_access_token')`

### Écran de consentement bloqué

**Solution** : Si votre application est en mode "Testing" dans Google Cloud Console :
- Ajoutez votre email dans la liste des testeurs
- Ou publiez votre application (nécessite une vérification Google)

## 📚 Documentation API

- [Google Calendar API](https://developers.google.com/calendar/api/v3/reference)
- [Google People API](https://developers.google.com/people/api/rest)
- [OAuth 2.0 Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)

## 🔄 Prochaines étapes

1. **Implémenter le refresh token** pour éviter de redemander l'accès
2. **Stocker le token côté backend** pour plus de sécurité
3. **Ajouter la synchronisation** des événements vers Firestore
4. **Créer des fonctions** pour créer/modifier des événements (si besoin)
5. **Ajouter des filtres** pour les contacts et événements
6. **Implémenter la pagination** pour les grandes listes

## 💡 Exemple d'intégration dans le Dashboard

```typescript
// pages/dashboard.tsx
import { useCalendarEvents } from '@/hooks/useGoogleData';

export default function Dashboard() {
  const { events, isLoading } = useCalendarEvents(5);

  return (
    <div>
      <h2>Prochains rendez-vous</h2>
      {!isLoading && events.slice(0, 5).map(event => (
        <div key={event.id}>
          <p>{event.title}</p>
          <p>{event.start?.toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
```

## ⚙️ Variables d'environnement

Assurez-vous que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Ces variables sont nécessaires pour que Firebase fonctionne correctement.
