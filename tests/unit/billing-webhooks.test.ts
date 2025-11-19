/**
 * Unit tests for Stripe webhook handlers
 */

import {
  handleCheckoutCompleted,
  handleSubscriptionCreated,
  handleSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  handlePaymentMethodAttached,
  handleWebhookEvent,
} from '@/lib/billing/webhooks';
import type Stripe from 'stripe';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    billingEvent: {
      create: jest.fn(),
    },
    subscription: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    invoice: {
      create: jest.fn(),
    },
    paymentMethod: {
      create: jest.fn(),
    },
  },
}));

// Mock Stripe
jest.mock('@/lib/billing/stripe', () => ({
  stripe: {
    customers: {
      retrieve: jest.fn(),
    },
  },
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Billing Webhooks', () => {
  let prismaMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = require('@/lib/prisma').prisma;
  });

  describe('handleCheckoutCompleted', () => {
    it('should log checkout completion and create billing event', async () => {
      const session = {
        id: 'cs_test_123',
        metadata: {
          userId: 'user_123',
          tier: 'pro',
        },
        subscription: 'sub_123',
      } as Stripe.Checkout.Session;

      prismaMock.billingEvent.create.mockResolvedValue({
        id: 'event_123',
        userId: 'user_123',
        type: 'checkout_completed',
        status: 'success',
        stripeEventId: 'cs_test_123',
        eventData: session as any,
        subscriptionId: null,
        invoiceId: null,
        errorMessage: null,
        createdAt: new Date(),
      });

      await handleCheckoutCompleted(session);

      expect(prismaMock.billingEvent.create).toHaveBeenCalledWith({
        data: {
          userId: 'user_123',
          type: 'checkout_completed',
          status: 'success',
          stripeEventId: 'cs_test_123',
          eventData: session,
        },
      });
    });

    it('should handle missing metadata gracefully', async () => {
      const session = {
        id: 'cs_test_123',
        metadata: {},
        subscription: 'sub_123',
      } as Stripe.Checkout.Session;

      await handleCheckoutCompleted(session);

      // Should not create billing event if metadata is missing
      expect(prismaMock.billingEvent.create).not.toHaveBeenCalled();
    });

    it('should handle missing subscription ID', async () => {
      const session = {
        id: 'cs_test_123',
        metadata: {
          userId: 'user_123',
          tier: 'pro',
        },
        subscription: null,
      } as unknown as Stripe.Checkout.Session;

      await handleCheckoutCompleted(session);

      // Should not create billing event if no subscription
      expect(prismaMock.billingEvent.create).not.toHaveBeenCalled();
    });
  });

  describe('handleSubscriptionCreated', () => {
    it('should create subscription and billing event', async () => {
      const subscription = {
        id: 'sub_123',
        customer: 'cus_123',
        status: 'active',
        metadata: {
          userId: 'user_123',
          tier: 'pro',
        },
        items: {
          data: [
            {
              price: {
                id: 'price_123',
                product: 'prod_123',
              },
            },
          ],
        },
        current_period_start: 1640000000,
        current_period_end: 1642592000,
        trial_start: null,
        trial_end: null,
      } as unknown as Stripe.Subscription;

      prismaMock.subscription.create.mockResolvedValue({
        id: 'db_sub_123',
        userId: 'user_123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'pro',
        status: 'active',
        currentPeriodStart: new Date(1640000000 * 1000),
        currentPeriodEnd: new Date(1642592000 * 1000),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialStart: null,
        trialEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.billingEvent.create.mockResolvedValue({
        id: 'event_123',
        userId: 'user_123',
        type: 'subscription_created',
        status: 'success',
        stripeEventId: 'sub_123',
        eventData: subscription as any,
        subscriptionId: 'sub_123',
        invoiceId: null,
        errorMessage: null,
        createdAt: new Date(),
      });

      await handleSubscriptionCreated(subscription);

      expect(prismaMock.subscription.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user_123',
          stripeCustomerId: 'cus_123',
          stripeSubscriptionId: 'sub_123',
          stripePriceId: 'price_123',
          stripeProductId: 'prod_123',
          tier: 'pro',
          status: 'active',
        }),
      });

      expect(prismaMock.billingEvent.create).toHaveBeenCalled();
    });

    it('should handle missing metadata', async () => {
      const subscription = {
        id: 'sub_123',
        customer: 'cus_123',
        status: 'active',
        metadata: {},
        items: {
          data: [
            {
              price: {
                id: 'price_123',
                product: 'prod_123',
              },
            },
          ],
        },
      } as unknown as Stripe.Subscription;

      await handleSubscriptionCreated(subscription);

      expect(prismaMock.subscription.create).not.toHaveBeenCalled();
    });
  });

  describe('handleSubscriptionDeleted', () => {
    it('should update subscription status to canceled', async () => {
      const subscription = {
        id: 'sub_123',
        status: 'canceled',
      } as Stripe.Subscription;

      prismaMock.subscription.findUnique.mockResolvedValue({
        id: 'db_sub_123',
        userId: 'user_123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'pro',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialStart: null,
        trialEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.subscription.update.mockResolvedValue({
        id: 'db_sub_123',
        userId: 'user_123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'free',
        status: 'canceled',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: new Date(),
        trialStart: null,
        trialEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.billingEvent.create.mockResolvedValue({
        id: 'event_123',
        userId: 'user_123',
        type: 'subscription_deleted',
        status: 'success',
        stripeEventId: 'sub_123',
        eventData: subscription as any,
        subscriptionId: 'sub_123',
        invoiceId: null,
        errorMessage: null,
        createdAt: new Date(),
      });

      await handleSubscriptionDeleted(subscription);

      expect(prismaMock.subscription.update).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: 'sub_123' },
        data: {
          status: 'canceled',
          canceledAt: expect.any(Date),
          tier: 'free',
        },
      });

      expect(prismaMock.billingEvent.create).toHaveBeenCalled();
    });

    it('should handle subscription not found', async () => {
      const subscription = {
        id: 'sub_123',
        status: 'canceled',
      } as Stripe.Subscription;

      prismaMock.subscription.findUnique.mockResolvedValue(null);

      await handleSubscriptionDeleted(subscription);

      expect(prismaMock.subscription.update).not.toHaveBeenCalled();
    });
  });

  describe('handleInvoicePaid', () => {
    it('should create invoice record and billing event', async () => {
      const invoice = {
        id: 'inv_123',
        subscription: 'sub_123',
        amount_paid: 1200,
        currency: 'usd',
        hosted_invoice_url: 'https://invoice.stripe.com/123',
        invoice_pdf: 'https://pdf.stripe.com/123.pdf',
        status_transitions: {
          paid_at: 1640000000,
        },
        period_start: 1640000000,
        period_end: 1642592000,
      } as unknown as Stripe.Invoice;

      prismaMock.subscription.findUnique.mockResolvedValue({
        id: 'db_sub_123',
        userId: 'user_123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'pro',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialStart: null,
        trialEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.invoice.create.mockResolvedValue({
        id: 'db_inv_123',
        userId: 'user_123',
        subscriptionId: 'db_sub_123',
        stripeInvoiceId: 'inv_123',
        amount: 12,
        currency: 'usd',
        status: 'paid',
        hostedInvoiceUrl: 'https://invoice.stripe.com/123',
        invoicePdf: 'https://pdf.stripe.com/123.pdf',
        paidAt: new Date(1640000000 * 1000),
        periodStart: new Date(1640000000 * 1000),
        periodEnd: new Date(1642592000 * 1000),
        createdAt: new Date(),
      });

      prismaMock.billingEvent.create.mockResolvedValue({
        id: 'event_123',
        userId: 'user_123',
        type: 'invoice_paid',
        status: 'success',
        stripeEventId: 'inv_123',
        eventData: invoice as any,
        subscriptionId: 'sub_123',
        invoiceId: 'inv_123',
        errorMessage: null,
        createdAt: new Date(),
      });

      await handleInvoicePaid(invoice);

      expect(prismaMock.invoice.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user_123',
          subscriptionId: 'db_sub_123',
          stripeInvoiceId: 'inv_123',
          amount: 12, // 1200 / 100
          currency: 'usd',
          status: 'paid',
        }),
      });

      expect(prismaMock.billingEvent.create).toHaveBeenCalled();
    });

    it('should handle invoice without subscription', async () => {
      const invoice = {
        id: 'inv_123',
        subscription: null,
        amount_paid: 1200,
      } as unknown as Stripe.Invoice;

      await handleInvoicePaid(invoice);

      expect(prismaMock.subscription.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.invoice.create).not.toHaveBeenCalled();
    });
  });

  describe('handleInvoicePaymentFailed', () => {
    it('should update subscription to past_due and create billing event', async () => {
      const invoice = {
        id: 'inv_123',
        subscription: 'sub_123',
      } as unknown as Stripe.Invoice;

      prismaMock.subscription.findUnique.mockResolvedValue({
        id: 'db_sub_123',
        userId: 'user_123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'pro',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialStart: null,
        trialEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.subscription.update.mockResolvedValue({
        id: 'db_sub_123',
        userId: 'user_123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'pro',
        status: 'past_due',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialStart: null,
        trialEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.billingEvent.create.mockResolvedValue({
        id: 'event_123',
        userId: 'user_123',
        type: 'invoice_payment_failed',
        status: 'failed',
        stripeEventId: 'inv_123',
        eventData: invoice as any,
        subscriptionId: 'sub_123',
        invoiceId: 'inv_123',
        errorMessage: 'Payment failed',
        createdAt: new Date(),
      });

      await handleInvoicePaymentFailed(invoice);

      expect(prismaMock.subscription.update).toHaveBeenCalledWith({
        where: { stripeSubscriptionId: 'sub_123' },
        data: {
          status: 'past_due',
        },
      });

      expect(prismaMock.billingEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user_123',
          type: 'invoice_payment_failed',
          status: 'failed',
          errorMessage: 'Payment failed',
        }),
      });
    });
  });

  describe('handlePaymentMethodAttached', () => {
    it('should create payment method record for card', async () => {
      const { stripe } = require('@/lib/billing/stripe');
      stripe.customers.retrieve.mockResolvedValue({
        id: 'cus_123',
        invoice_settings: {
          default_payment_method: 'pm_123',
        },
      });

      const paymentMethod = {
        id: 'pm_123',
        customer: 'cus_123',
        type: 'card',
        card: {
          last4: '4242',
          brand: 'visa',
          exp_month: 12,
          exp_year: 2025,
        },
      } as unknown as Stripe.PaymentMethod;

      prismaMock.subscription.findFirst.mockResolvedValue({
        id: 'db_sub_123',
        userId: 'user_123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'pro',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialStart: null,
        trialEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.paymentMethod.create.mockResolvedValue({
        id: 'db_pm_123',
        userId: 'user_123',
        stripePaymentMethodId: 'pm_123',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        bankName: null,
        isDefault: true,
        createdAt: new Date(),
      });

      await handlePaymentMethodAttached(paymentMethod);

      expect(prismaMock.paymentMethod.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user_123',
          stripePaymentMethodId: 'pm_123',
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
        }),
      });
    });

    it('should handle payment method without customer', async () => {
      const paymentMethod = {
        id: 'pm_123',
        customer: null,
        type: 'card',
      } as unknown as Stripe.PaymentMethod;

      await handlePaymentMethodAttached(paymentMethod);

      expect(prismaMock.subscription.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('handleWebhookEvent', () => {
    it('should route checkout.session.completed event', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            metadata: {
              userId: 'user_123',
              tier: 'pro',
            },
            subscription: 'sub_123',
          },
        },
      } as Stripe.Event;

      prismaMock.billingEvent.create.mockResolvedValue({
        id: 'event_123',
        userId: 'user_123',
        type: 'checkout_completed',
        status: 'success',
        stripeEventId: 'cs_test_123',
        eventData: event.data.object as any,
        subscriptionId: null,
        invoiceId: null,
        errorMessage: null,
        createdAt: new Date(),
      });

      await handleWebhookEvent(event);

      expect(prismaMock.billingEvent.create).toHaveBeenCalled();
    });

    it('should handle unhandled event types gracefully', async () => {
      const event = {
        type: 'customer.created',
        data: {
          object: {},
        },
      } as Stripe.Event;

      await expect(handleWebhookEvent(event)).resolves.not.toThrow();
    });

    it('should propagate errors from handlers', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            metadata: {
              userId: 'user_123',
              tier: 'pro',
            },
            subscription: 'sub_123',
          },
        },
      } as Stripe.Event;

      prismaMock.billingEvent.create.mockRejectedValue(new Error('Database error'));

      await expect(handleWebhookEvent(event)).rejects.toThrow('Database error');
    });
  });
});
