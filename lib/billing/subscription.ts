/**
 * Subscription Management Utilities
 *
 * Handle subscription creation, updates, and cancellations
 */

import { stripe } from './stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

/**
 * Get or create Stripe customer for user
 */
export async function getOrCreateCustomer(userId: string, email: string): Promise<string> {
  // Check if user already has a subscription with Stripe customer
  const existing = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  if (existing?.stripeCustomerId) {
    return existing.stripeCustomerId
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  return customer.id
}

/**
 * Create checkout session for subscription
 */
export async function createCheckoutSession({
  userId,
  email,
  priceId,
  tier,
  successUrl,
  cancelUrl,
  trialDays,
  couponId,
}: {
  userId: string
  email: string
  priceId: string
  tier: 'pro' | 'business'
  successUrl: string
  cancelUrl: string
  trialDays?: number
  couponId?: string
}): Promise<Stripe.Checkout.Session> {
  const customerId = await getOrCreateCustomer(userId, email)

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      tier,
    },
    subscription_data: {
      metadata: {
        userId,
        tier,
      },
    },
  }

  // Add trial period if specified
  if (trialDays && trialDays > 0) {
    sessionParams.subscription_data = {
      ...sessionParams.subscription_data,
      trial_period_days: trialDays,
    }
  }

  // Add coupon if specified
  if (couponId) {
    sessionParams.discounts = [{ coupon: couponId }]
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  return session
}

/**
 * Create subscription record in database
 */
export async function createSubscription({
  userId,
  stripeCustomerId,
  stripeSubscriptionId,
  stripePriceId,
  stripeProductId,
  tier,
  status,
  currentPeriodStart,
  currentPeriodEnd,
  trialStart,
  trialEnd,
  organizationId,
}: {
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripePriceId: string
  stripeProductId: string
  tier: 'free' | 'pro' | 'business' | 'enterprise'
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  trialStart?: Date
  trialEnd?: Date
  organizationId?: string
}) {
  return await prisma.subscription.create({
    data: {
      userId,
      organizationId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      stripeProductId,
      tier,
      status,
      currentPeriodStart,
      currentPeriodEnd,
      trialStart,
      trialEnd,
    },
  })
}

/**
 * Update subscription in database
 */
export async function updateSubscription(
  subscriptionId: string,
  data: {
    tier?: 'free' | 'pro' | 'business' | 'enterprise'
    status?: string
    currentPeriodStart?: Date
    currentPeriodEnd?: Date
    cancelAtPeriodEnd?: boolean
    canceledAt?: Date
  }
) {
  return await prisma.subscription.update({
    where: { id: subscriptionId },
    data,
  })
}

/**
 * Get active subscription for user
 */
export async function getActiveSubscription(userId: string) {
  return await prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ['active', 'trialing'],
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get user's current tier
 */
export async function getUserTier(userId: string): Promise<'free' | 'pro' | 'business' | 'enterprise'> {
  const subscription = await getActiveSubscription(userId)
  return (subscription?.tier as 'free' | 'pro' | 'business' | 'enterprise') || 'free'
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(subscriptionId: string, cancelImmediately = false) {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  })

  if (!subscription?.stripeSubscriptionId) {
    throw new Error('Subscription not found')
  }

  // Cancel in Stripe
  const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: !cancelImmediately,
  })

  // Update in database
  return await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      cancelAtPeriodEnd: !cancelImmediately,
      canceledAt: cancelImmediately ? new Date() : null,
      status: cancelImmediately ? 'canceled' : (subscription.status as string),
    },
  })
}

/**
 * Reactivate canceled subscription
 */
export async function reactivateSubscription(subscriptionId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  })

  if (!subscription?.stripeSubscriptionId) {
    throw new Error('Subscription not found')
  }

  // Reactivate in Stripe
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: false,
  })

  // Update in database
  return await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      cancelAtPeriodEnd: false,
      canceledAt: null,
    },
  })
}

/**
 * Create customer portal session
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

/**
 * Upgrade/downgrade subscription
 */
export async function changeSubscriptionPlan(subscriptionId: string, newPriceId: string, newTier: 'pro' | 'business') {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  })

  if (!subscription?.stripeSubscriptionId) {
    throw new Error('Subscription not found')
  }

  // Get current subscription from Stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)

  // Update subscription in Stripe
  const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    items: [
      {
        id: stripeSubscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations', // Prorate charges
  })

  // Update in database
  return await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      tier: newTier as 'pro' | 'business' | 'free' | 'enterprise',
      stripePriceId: newPriceId,
    },
  })
}
