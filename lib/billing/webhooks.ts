/**
 * Stripe Webhook Handlers
 *
 * Process Stripe webhook events
 */

import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { stripe } from './stripe';
import type { Prisma } from '@prisma/client';
import { logger } from '@/lib/logger';

/**
 * Handle checkout session completed
 */
export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier as 'pro' | 'business' | 'enterprise';

  if (!userId || !tier) {
    logger.error('Missing metadata in checkout session:', session.id);
    return;
  }

  const subscriptionId = session.subscription as string;
  if (!subscriptionId) {
    logger.error('No subscription ID in checkout session:', session.id);
    return;
  }

  // Session completed, subscription will be handled by subscription.created event
  await prisma.billingEvent.create({
    data: {
      userId,
      type: 'checkout_completed',
      status: 'success',
      stripeEventId: session.id,
      eventData: session as unknown as Prisma.JsonObject,
    },
  });
}

/**
 * Handle subscription created
 */
export async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const tier = subscription.metadata?.tier as 'pro' | 'business' | 'enterprise';

  if (!userId || !tier) {
    logger.error('Missing metadata in subscription:', subscription.id);
    return;
  }

  // Create subscription in database
  await prisma.subscription.create({
    data: {
      userId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeProductId: subscription.items.data[0].price.product as string,
      tier,
      status: subscription.status,
      // Note: Stripe SDK types don't include all webhook properties
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      trialStart: (subscription as any).trial_start
        ? new Date((subscription as any).trial_start * 1000)
        : null,
      trialEnd: (subscription as any).trial_end
        ? new Date((subscription as any).trial_end * 1000)
        : null,
    },
  });

  // Log event
  await prisma.billingEvent.create({
    data: {
      userId,
      type: 'subscription_created',
      status: 'success',
      subscriptionId: subscription.id,
      stripeEventId: subscription.id,
      eventData: subscription as unknown as Prisma.JsonObject,
    },
  });
}

/**
 * Handle subscription updated
 */
export /**
 * Check if a payment method is the default for a customer
 */
async function checkIsDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<boolean> {
  try {
    const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
    return customer.invoice_settings?.default_payment_method === paymentMethodId;
  } catch (error) {
    logger.error('Error checking default payment method:', error);
    return true; // Default to true on error
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    logger.error('Subscription not found in database:', subscription.id);
    return;
  }

  // Update subscription
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      // Note: Stripe SDK types don't include all webhook properties
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      canceledAt: (subscription as any).canceled_at
        ? new Date((subscription as any).canceled_at * 1000)
        : null,
    },
  });

  // Log event
  await prisma.billingEvent.create({
    data: {
      userId: dbSubscription.userId,
      type: 'subscription_updated',
      status: 'success',
      subscriptionId: subscription.id,
      stripeEventId: subscription.id,
      eventData: subscription as unknown as Prisma.JsonObject,
    },
  });
}

/**
 * Handle subscription deleted (canceled)
 */
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    logger.error('Subscription not found in database:', subscription.id);
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
      tier: 'free', // Downgrade to free
    },
  });

  // Log event
  await prisma.billingEvent.create({
    data: {
      userId: dbSubscription.userId,
      type: 'subscription_deleted',
      status: 'success',
      subscriptionId: subscription.id,
      stripeEventId: subscription.id,
      eventData: subscription as unknown as Prisma.JsonObject,
    },
  });
}

/**
 * Handle invoice paid
 */
export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Note: Stripe SDK types don't include all webhook properties
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!dbSubscription) {
    logger.error('Subscription not found for invoice:', invoice.id);
    return;
  }

  // Create invoice record
  await prisma.invoice.create({
    data: {
      userId: dbSubscription.userId,
      subscriptionId: dbSubscription.id,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: 'paid',
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
      paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
      periodStart: new Date(invoice.period_start * 1000),
      periodEnd: new Date(invoice.period_end * 1000),
    },
  });

  // Log event
  await prisma.billingEvent.create({
    data: {
      userId: dbSubscription.userId,
      type: 'invoice_paid',
      status: 'success',
      invoiceId: invoice.id,
      subscriptionId,
      stripeEventId: invoice.id,
      eventData: invoice as unknown as Prisma.JsonObject,
    },
  });
}

/**
 * Handle invoice payment failed
 */
export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Note: Stripe SDK types don't include all webhook properties
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!dbSubscription) {
    logger.error('Subscription not found for invoice:', invoice.id);
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: 'past_due',
    },
  });

  // Log event
  await prisma.billingEvent.create({
    data: {
      userId: dbSubscription.userId,
      type: 'invoice_payment_failed',
      status: 'failed',
      invoiceId: invoice.id,
      subscriptionId,
      stripeEventId: invoice.id,
      errorMessage: 'Payment failed',
      eventData: invoice as unknown as Prisma.JsonObject,
    },
  });

  // TODO: Send notification to user about failed payment
}

/**
 * Handle payment method attached
 */
export async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  const customerId = paymentMethod.customer as string;
  if (!customerId) return;

  // Find user by customer ID
  const subscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
    orderBy: { createdAt: 'desc' },
  });

  if (!subscription) {
    logger.error('User not found for customer:', customerId);
    return;
  }

  // Store payment method
  await prisma.paymentMethod.create({
    data: {
      userId: subscription.userId,
      stripePaymentMethodId: paymentMethod.id,
      type: paymentMethod.type,
      last4: paymentMethod.card?.last4 || paymentMethod.us_bank_account?.last4 || '',
      brand: paymentMethod.card?.brand,
      expiryMonth: paymentMethod.card?.exp_month,
      expiryYear: paymentMethod.card?.exp_year,
      bankName: paymentMethod.us_bank_account?.bank_name,
      isDefault: await checkIsDefaultPaymentMethod(
        subscription.stripeCustomerId || '',
        paymentMethod.id
      ),
    },
  });
}

/**
 * Main webhook event router
 */
export async function handleWebhookEvent(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod);
        break;

      default:
        logger.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    logger.error(`Error handling webhook event ${event.type}:`, error);
    throw error;
  }
}
