# 🏗️ Architecture Firebase - Dataxx B2C

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  /register       │  │  /login          │  │  /dashboard      │ │
│  │  - Email/Pass    │  │  - Email/Pass    │  │  (Protected)     │ │
│  │  - Google OAuth  │  │  - Google OAuth  │  │  - User Data     │ │
│  │  - User Data     │  │  - Reset Pass    │  │  - Subscription  │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘ │
│           │                     │                     │            │
│           └─────────────────────┼─────────────────────┘            │
│                                 │                                  │
│  ┌──────────────────────────────▼──────────────────────────────┐  │
│  │              HOOKS & COMPONENTS                              │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  useAuth()            - État authentification                │  │
│  │  useSubscription()    - État abonnement                      │  │
│  │  withAuth()           - HOC protection de page               │  │
│  │  withSubscription()   - HOC vérification abonnement          │  │
│  └──────────────────────────────┬───────────────────────────────┘  │
│                                 │                                  │
│  ┌──────────────────────────────▼──────────────────────────────┐  │
│  │              FIREBASE SERVICES                               │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  auth.ts              - Authentification                     │  │
│  │  users.ts             - Gestion utilisateurs                 │  │
│  │  userData.ts          - Données utilisateur                  │  │
│  │  subscriptions.ts     - Gestion abonnements                  │  │
│  └──────────────────────────────┬───────────────────────────────┘  │
│                                 │                                  │
└─────────────────────────────────┼──────────────────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │   FIREBASE CONFIG          │
                    │   (lib/firebase/config.ts) │
                    └─────────────┬──────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐      ┌────────▼─────────┐     ┌────────▼─────────┐
│ AUTHENTICATION │      │    FIRESTORE     │     │   FUTURE: STRIPE │
├────────────────┤      ├──────────────────┤     ├──────────────────┤
│ • Email/Pass   │      │ Collections:     │     │ • Webhooks       │
│ • Google OAuth │      │                  │     │ • Subscriptions  │
│ • Email Verify │      │ ┌──────────────┐ │     │ • Payments       │
│ • Reset Pass   │      │ │ users        │ │     │ • Customers      │
└────────────────┘      │ │ - Profile    │ │     └──────────────────┘
                        │ │ - Settings   │ │
                        │ └──────────────┘ │
                        │                  │
                        │ ┌──────────────┐ │
                        │ │ userData     │ │
                        │ │ - Collected  │ │
                        │ │ - Category   │ │
                        │ │ - Tags       │ │
                        │ └──────────────┘ │
                        │                  │
                        │ ┌──────────────┐ │
                        │ │subscription  │ │
                        │ │ - Stripe ID  │ │
                        │ │ - Status     │ │
                        │ │ - Plan       │ │
                        │ └──────────────┘ │
                        │                  │
                        │ ┌──────────────┐ │
                        │ │ auditLogs    │ │
                        │ │ - Actions    │ │
                        │ │ - Timestamp  │ │
                        │ └──────────────┘ │
                        │                  │
                        │ ┌──────────────┐ │
                        │ │userSessions  │ │
                        │ │ - Tracking   │ │
                        │ └──────────────┘ │
                        └──────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │   SECURITY RULES           │
                    │   (firestore.rules)        │
                    ├────────────────────────────┤
                    │ • User isolation           │
                    │ • Read own data only       │
                    │ • Authenticated required   │
                    │ • Field validation         │
                    └────────────────────────────┘
```

## 🔄 Flux de données

### 📝 Inscription (Register Flow)

```
User fills form
      │
      ▼
signUpWithEmail(email, password, displayName)
      │
      ├─► Firebase Auth creates user
      │
      ├─► Email verification sent
      │
      ▼
createOrUpdateUserDocument(user, additionalData)
      │
      ├─► Document created in 'users' collection
      │       {uid, email, firstName, lastName, ...}
      │
      ▼
createUserData(userId, sportData, "registration", tags)
      │
      ├─► Document created in 'userData' collection
      │       {userId, dataCollected: {...}, category, tags}
      │
      ▼
Redirect to dashboard
```

### 🔐 Connexion (Login Flow)

```
User enters credentials
      │
      ├─► Email/Password
      │         │
      │         ▼
      │   signInWithEmail(email, password)
      │
      └─► Google OAuth
                │
                ▼
          signInWithGoogle()
                │
                ▼
      Firebase Auth validates
                │
                ▼
      onAuthStateChange triggered
                │
                ▼
      createOrUpdateUserDocument(user)
                │
                ├─► Update lastLoginAt
                │
                ▼
      getUserData(userId)
                │
                ├─► Retrieve user profile
                │
                ▼
      useAuth hook updates state
                │
                ├─► firebaseUser
                ├─► userData
                └─► isAuthenticated
                │
                ▼
      Redirect to /
```

### 📊 Utilisation (Usage Flow)

```
User on protected page
      │
      ▼
withAuth HOC checks authentication
      │
      ├─► Not authenticated ──► Redirect to /login
      │
      └─► Authenticated
            │
            ▼
      useAuth provides user data
            │
            ▼
      User performs action
            │
            ▼
      createUserData(userId, data, category, tags)
            │
            ├─► Document created in 'userData'
            │
            ▼
      getAllUserData(userId)
            │
            ├─► Retrieve all user's data
            │
            ▼
      Display in UI
```

### 💳 Futur : Abonnement (Subscription Flow)

```
User clicks subscribe
      │
      ▼
Stripe Checkout Session
      │
      ├─► User pays with Stripe
      │
      ▼
Stripe Webhook triggered
      │
      ├─► customer.subscription.created
      │
      ▼
Cloud Function / API Route
      │
      ├─► Create document in 'subscriptions' collection
      │       {
      │         userId,
      │         stripeCustomerId,
      │         stripeSubscriptionId,
      │         status: 'active',
      │         planName, amount, ...
      │       }
      │
      ▼
useSubscription hook updates
      │
      ├─► activeSubscription
      ├─► hasActiveSubscription
      │
      ▼
withSubscription unlocks features
```

## 🔒 Security Model

```
┌──────────────────────────────────────────┐
│           FIRESTORE RULES                │
├──────────────────────────────────────────┤
│                                          │
│  Collection: users                       │
│  ├─ read:   if userId == request.auth.uid│
│  ├─ create: if userId == request.auth.uid│
│  ├─ update: if userId == request.auth.uid│
│  └─ delete: false                        │
│                                          │
│  Collection: userData                    │
│  ├─ read:   if userId == request.auth.uid│
│  ├─ create: if userId == request.auth.uid│
│  ├─ update: if userId == request.auth.uid│
│  └─ delete: if userId == request.auth.uid│
│                                          │
│  Collection: subscriptions               │
│  ├─ read:   if userId == request.auth.uid│
│  ├─ create: false (Cloud Functions only) │
│  ├─ update: false (Cloud Functions only) │
│  └─ delete: false                        │
│                                          │
│  Collection: auditLogs                   │
│  ├─ read:   if userId == request.auth.uid│
│  └─ write:  false (Cloud Functions only) │
│                                          │
└──────────────────────────────────────────┘
```

## 📁 File Structure

```
lib/firebase/
├── config.ts          ← Firebase initialization
├── auth.ts            ← signUp, signIn, signOut, resetPassword
├── users.ts           ← createUser, getUser, updateUser
├── userData.ts        ← createData, getData, updateData, deleteData
├── subscriptions.ts   ← getSubscription, hasActiveSubscription
└── withAuth.tsx       ← HOC for protected pages

hooks/
├── useAuth.ts         ← Authentication state & user data
└── useSubscription.ts ← Subscription state & status

types/
└── firestore.ts       ← TypeScript interfaces for all collections

pages/
├── register.tsx       ← Integrated with Firebase Auth
├── login.tsx          ← Integrated with Firebase Auth
└── dashboard.tsx      ← Example protected page
```

## 🚀 Quick Start Summary

1. **Get credentials**: Firebase Console → Project Settings → Your apps
2. **Configure**: Fill `.env.local` with your credentials
3. **Enable Google**: Firebase Console → Authentication → Sign-in method
4. **Test**: `npm run dev` → http://localhost:3000/register
5. **Verify**: Check Firebase Console for users and data

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README_FIREBASE.md` | 🚀 Quick start guide |
| `FIREBASE_SETUP.md` | 📚 Complete usage documentation |
| `FIREBASE_COMPLETE.md` | 🎉 Summary of everything |
| `FIREBASE_CREDENTIALS.md` | 🔑 How to get credentials |
| `TROUBLESHOOTING.md` | 🐛 Common issues & solutions |
| `ARCHITECTURE.md` | 🏗️ This file - architecture overview |
