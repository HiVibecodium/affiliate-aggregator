/**
 * Stripe Client Configuration
 *
 * Centralized Stripe client setup with proper error handling
 */

import Stripe from 'stripe'

// Allow build without Stripe keys (will be set at runtime)
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

/**
 * Stripe client instance
 * Configured with API version and TypeScript support
 */
export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
  appInfo: {
    name: 'Affiliate Aggregator',
    version: '1.0.0',
  },
})

/**
 * Check if Stripe is properly configured
 */
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    process.env.STRIPE_PRO_MONTHLY_PRICE_ID
  )
}

/**
 * Stripe webhook secret for signature verification
 */
export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

/**
 * Stripe pricing configuration
 */
export const STRIPE_PLANS = {
  pro_monthly: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
    amount: 1200, // $12.00 in cents
    interval: 'month' as const,
    tier: 'pro' as const,
  },
  pro_yearly: {
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
    amount: 9900, // $99.00 in cents (30% off)
    interval: 'year' as const,
    tier: 'pro' as const,
  },
  business_monthly: {
    priceId: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || '',
    amount: 4900, // $49.00 in cents
    interval: 'month' as const,
    tier: 'business' as const,
  },
  business_yearly: {
    priceId: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || '',
    amount: 39900, // $399.00 in cents (32% off)
    interval: 'year' as const,
    tier: 'business' as const,
  },
} as const

/**
 * Get price configuration by tier and interval
 */
export function getPriceId(tier: 'pro' | 'business', interval: 'month' | 'year'): string {
  const planKey = `${tier}_${interval}ly` as keyof typeof STRIPE_PLANS
  return STRIPE_PLANS[planKey].priceId
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

/**
 * Stripe error handler
 */
export function handleStripeError(error: unknown): { message: string; code?: string } {
  if (error instanceof Stripe.errors.StripeError) {
    return {
      message: error.message,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: 'An unexpected error occurred',
  }
}
