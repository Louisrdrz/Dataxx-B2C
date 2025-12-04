// Configuration Stripe pour les abonnements utilisateur
export const stripeConfig = {
  // Clés API
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  
  // IDs des prix (à configurer dans Stripe Dashboard)
  prices: {
    one_shot: process.env.STRIPE_PRICE_ID_ONE_SHOT!,
    basic: process.env.STRIPE_PRICE_ID_BASIC!,
    pro: process.env.STRIPE_PRICE_ID_PRO!,
  },
  
  // Configuration des plans
  plans: {
    one_shot: {
      name: 'One Shot',
      priceId: process.env.STRIPE_PRICE_ID_ONE_SHOT!,
      price: 49, // Prix suggéré pour un paiement unique
      currency: 'eur',
      isRecurring: false,
      searchesPerMonth: 1, // 1 recherche unique
      features: [
        '1 recherche de sponsors complète',
        'Recommandations IA personnalisées',
        'Export des résultats',
        'Support email',
        'Valable à vie (1 utilisation)',
      ],
      description: 'Parfait pour un événement ponctuel',
      badge: null,
    },
    basic: {
      name: 'Basic',
      priceId: process.env.STRIPE_PRICE_ID_BASIC!,
      price: 89,
      currency: 'eur',
      interval: 'month' as const,
      isRecurring: true,
      searchesPerMonth: 3, // 3 recherches par mois
      features: [
        '3 recherches de sponsors par mois',
        'Recommandations IA personnalisées',
        'Invitez des membres à vos workspaces',
        'Export des résultats',
        'Support email prioritaire',
        'Historique des recherches',
      ],
      description: 'Idéal pour les clubs et athlètes actifs',
      badge: null,
    },
    pro: {
      name: 'Pro',
      priceId: process.env.STRIPE_PRICE_ID_PRO!,
      price: 179,
      currency: 'eur',
      interval: 'month' as const,
      isRecurring: true,
      searchesPerMonth: 15, // 15 recherches par mois
      features: [
        '15 recherches de sponsors par mois',
        'Recommandations IA avancées',
        'Membres illimités dans vos workspaces',
        'Export des résultats en PDF',
        'Support prioritaire 24/7',
        'Historique complet des recherches',
        'Analyses et statistiques avancées',
        'Accès API (bientôt)',
      ],
      description: 'Pour les organisations professionnelles',
      badge: '⭐ Populaire',
    },
  },
  
  // URL de l'application
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
};

// Type pour les noms de plans
export type PlanName = 'one_shot' | 'basic' | 'pro';

// Fonction helper pour obtenir les détails d'un plan
export const getPlanDetails = (planName: PlanName) => {
  return stripeConfig.plans[planName];
};

// Fonction pour vérifier si un plan est récurrent
export const isRecurringPlan = (planName: PlanName): boolean => {
  return stripeConfig.plans[planName].isRecurring;
};

// Fonction pour obtenir le nombre de recherches par mois
export const getSearchesPerMonth = (planName: PlanName): number => {
  return stripeConfig.plans[planName].searchesPerMonth;
};

// Fonction pour vérifier si une clé existe
export const validateStripeConfig = () => {
  const required = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_PRICE_ID_ONE_SHOT',
    'STRIPE_PRICE_ID_BASIC',
    'STRIPE_PRICE_ID_PRO',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(
      `Variables d'environnement Stripe manquantes: ${missing.join(', ')}`
    );
    return false;
  }
  return true;
};
