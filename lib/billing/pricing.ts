/**
 * Pricing Configuration
 *
 * Centralized pricing configuration for subscriptions
 * Price IDs should be set in environment variables for different environments
 */

export type PricingInterval = 'month' | 'year';
export type Tier = 'free' | 'pro' | 'business' | 'enterprise';

export interface PriceConfig {
  monthly: number; // in cents
  yearly: number; // in cents
  monthlyFormatted: string;
  yearlyFormatted: string;
  yearlyMonthly: string; // monthly price when paid yearly
  savings: string;
}

export interface TierConfig {
  id: Tier;
  name: string;
  description: string;
  price: PriceConfig;
  priceIds: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  popular: boolean;
  trialDays: number;
}

/**
 * Pricing tiers configuration
 */
export const PRICING_CONFIG: Record<Tier, TierConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: {
      monthly: 0,
      yearly: 0,
      monthlyFormatted: '$0',
      yearlyFormatted: '$0',
      yearlyMonthly: '$0',
      savings: '',
    },
    priceIds: {
      monthly: '',
      yearly: '',
    },
    features: [
      '5 favorites',
      '3 comparisons per day',
      'Basic search & filters',
      'View program details',
      'Read reviews',
      'Basic analytics',
    ],
    popular: false,
    trialDays: 0,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For serious affiliate marketers',
    price: {
      monthly: 900, // $9
      yearly: 7900, // $79 (~$6.58/mo)
      monthlyFormatted: '$9',
      yearlyFormatted: '$79',
      yearlyMonthly: '$6.58',
      savings: '27% off yearly',
    },
    priceIds: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
    },
    features: [
      'Unlimited favorites',
      'Unlimited comparisons',
      '10 saved searches',
      '25 application tracking',
      '3 email alerts',
      'Write reviews',
      'Export to CSV/Excel',
      'Advanced analytics',
      'Priority support',
    ],
    popular: true,
    trialDays: 14,
  },
  business: {
    id: 'business',
    name: 'Business',
    description: 'For teams and agencies',
    price: {
      monthly: 2900, // $29
      yearly: 24900, // $249 (~$20.75/mo)
      monthlyFormatted: '$29',
      yearlyFormatted: '$249',
      yearlyMonthly: '$20.75',
      savings: '28% off yearly',
    },
    priceIds: {
      monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || '',
      yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || '',
    },
    features: [
      'Everything in Pro',
      'Unlimited saved searches',
      'Unlimited application tracking',
      'Unlimited email alerts',
      'API access (10,000 calls/month)',
      'Up to 5 team members',
      'Full analytics dashboard',
      'Webhooks & integrations',
      'Priority email + chat support',
    ],
    popular: false,
    trialDays: 14,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: {
      monthly: 0,
      yearly: 0,
      monthlyFormatted: 'Custom',
      yearlyFormatted: 'Custom',
      yearlyMonthly: 'Custom',
      savings: '',
    },
    priceIds: {
      monthly: '',
      yearly: '',
    },
    features: [
      'Everything in Business',
      'Unlimited API calls',
      'Unlimited team members',
      'Dedicated account manager',
      'Custom contract & invoicing',
      'On-premise deployment option',
      'Advanced security (SSO, SAML)',
      '24/7 phone support',
      'Custom SLA',
    ],
    popular: false,
    trialDays: 0,
  },
};

/**
 * Get price ID for a tier and interval
 */
export function getPriceId(tier: Tier, interval: PricingInterval): string {
  const config = PRICING_CONFIG[tier];
  if (!config) {
    throw new Error(`Unknown tier: ${tier}`);
  }
  return interval === 'month' ? config.priceIds.monthly : config.priceIds.yearly;
}

/**
 * Get price amount in cents for a tier and interval
 */
export function getPriceAmount(tier: Tier, interval: PricingInterval): number {
  const config = PRICING_CONFIG[tier];
  if (!config) {
    throw new Error(`Unknown tier: ${tier}`);
  }
  return interval === 'month' ? config.price.monthly : config.price.yearly;
}

/**
 * Get trial days for a tier
 */
export function getTrialDays(tier: Tier): number {
  return PRICING_CONFIG[tier]?.trialDays || 0;
}

/**
 * Calculate savings percentage for yearly vs monthly
 */
export function calculateYearlySavings(tier: Tier): number {
  const config = PRICING_CONFIG[tier];
  if (!config || config.price.monthly === 0) {
    return 0;
  }
  const monthlyTotal = config.price.monthly * 12;
  const savings = ((monthlyTotal - config.price.yearly) / monthlyTotal) * 100;
  return Math.round(savings);
}

/**
 * Get all available tiers (excluding free and enterprise for checkout)
 */
export function getCheckoutTiers(): TierConfig[] {
  return [PRICING_CONFIG.pro, PRICING_CONFIG.business];
}

/**
 * Validate if tier can be upgraded to
 */
export function canUpgradeTo(currentTier: Tier, targetTier: Tier): boolean {
  const tierOrder: Tier[] = ['free', 'pro', 'business', 'enterprise'];
  const currentIndex = tierOrder.indexOf(currentTier);
  const targetIndex = tierOrder.indexOf(targetTier);
  return targetIndex > currentIndex;
}

/**
 * Get upgrade path from current tier
 */
export function getUpgradePath(currentTier: Tier): Tier[] {
  const tierOrder: Tier[] = ['free', 'pro', 'business', 'enterprise'];
  const currentIndex = tierOrder.indexOf(currentTier);
  return tierOrder.slice(currentIndex + 1);
}
