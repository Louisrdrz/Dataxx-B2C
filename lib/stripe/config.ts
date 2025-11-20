// Configuration Stripe
export const stripeConfig = {
  // Clés API
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  
  // IDs des prix
  prices: {
    basic: process.env.STRIPE_PRICE_ID_BASIC!,
    pro: process.env.STRIPE_PRICE_ID_PRO!,
  },
  
  // Configuration des plans
  plans: {
    basic: {
      name: 'Basic',
      priceId: process.env.STRIPE_PRICE_ID_BASIC!,
      price: 89.99,
      currency: 'eur',
      interval: 'month' as const,
      trialDays: 14,
      features: [
        'Maximum 3 utilisateurs',
        '10 contacts et infos de sponsors',
        'Support email',
        '14 jours d\'essai gratuit',
      ],
      limits: {
        maxMembers: 3,
        maxContacts: 10,
      },
    },
    pro: {
      name: 'Pro',
      priceId: process.env.STRIPE_PRICE_ID_PRO!,
      price: 150,
      currency: 'eur',
      interval: 'month' as const,
      trialDays: 0,
      features: [
        'Maximum 5 utilisateurs',
        '50 contacts et infos de sponsors',
        'Support prioritaire',
        'Export des données',
        'Intégrations avancées',
      ],
      limits: {
        maxMembers: 5,
        maxContacts: 50,
      },
    },
  },
  
  // URL de l'application
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

// Type pour les noms de plans
export type PlanName = 'basic' | 'pro';

// Fonction helper pour obtenir les détails d'un plan
export const getPlanDetails = (planName: PlanName) => {
  return stripeConfig.plans[planName];
};

// Fonction pour vérifier si une clé existe
export const validateStripeConfig = () => {
  const required = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_PRICE_ID_BASIC',
    'STRIPE_PRICE_ID_PRO',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Variables d'environnement Stripe manquantes: ${missing.join(', ')}`
    );
  }
};

