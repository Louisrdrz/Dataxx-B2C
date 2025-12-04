// Client Stripe côté serveur
import Stripe from 'stripe';
import { stripeConfig } from './config';

// Initialiser le client Stripe
export const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Client Stripe côté client
import { loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripeConfig.publishableKey);
  }
  return stripePromise;
};

