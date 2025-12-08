/**
 * Subscription Management Tests
 */

// Mock Stripe - create all mocks inside factory function
jest.mock('@/lib/billing/stripe', () => ({
  stripe: {
    customers: {
      create: jest.fn(),
    },
    subscriptions: {
      update: jest.fn(),
      retrieve: jest.fn(),
    },
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn(),
      },
    },
  },
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    subscription: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import {
  getOrCreateCustomer,
  createCheckoutSession,
  createSubscription,
  updateSubscription,
  getActiveSubscription,
  getUserTier,
  cancelSubscription,
  reactivateSubscription,
  createPortalSession,
  changeSubscriptionPlan,
} from '@/lib/billing/subscription';
import { stripe } from '@/lib/billing/stripe';
import { prisma } from '@/lib/prisma';

// Get typed mock references
const mockCustomersCreate = stripe.customers.create as jest.Mock;
const mockSubscriptionsUpdate = stripe.subscriptions.update as jest.Mock;
const mockSubscriptionsRetrieve = stripe.subscriptions.retrieve as jest.Mock;
const mockCheckoutSessionsCreate = stripe.checkout.sessions.create as jest.Mock;
const mockBillingPortalCreate = stripe.billingPortal.sessions.create as jest.Mock;
const mockFindFirst = prisma.subscription.findFirst as jest.Mock;
const mockFindUnique = prisma.subscription.findUnique as jest.Mock;
const mockCreate = prisma.subscription.create as jest.Mock;
const mockUpdate = prisma.subscription.update as jest.Mock;

describe('Subscription Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrCreateCustomer', () => {
    it('returns existing customer ID if found', async () => {
      mockFindFirst.mockResolvedValueOnce({
        stripeCustomerId: 'cus_existing123',
      });

      const result = await getOrCreateCustomer('user-123', 'user@example.com');

      expect(result).toBe('cus_existing123');
      expect(mockCustomersCreate).not.toHaveBeenCalled();
    });

    it('creates new customer if not found', async () => {
      mockFindFirst.mockResolvedValueOnce(null);
      mockCustomersCreate.mockResolvedValueOnce({ id: 'cus_new456' });

      const result = await getOrCreateCustomer('user-123', 'user@example.com');

      expect(result).toBe('cus_new456');
      expect(mockCustomersCreate).toHaveBeenCalledWith({
        email: 'user@example.com',
        metadata: { userId: 'user-123' },
      });
    });

    it('creates customer if subscription exists but no customer ID', async () => {
      mockFindFirst.mockResolvedValueOnce({
        stripeCustomerId: null,
      });
      mockCustomersCreate.mockResolvedValueOnce({ id: 'cus_new789' });

      const result = await getOrCreateCustomer('user-123', 'user@example.com');

      expect(result).toBe('cus_new789');
    });
  });

  describe('createCheckoutSession', () => {
    beforeEach(() => {
      mockFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_123' });
      mockCheckoutSessionsCreate.mockResolvedValue({
        id: 'cs_123',
        url: 'https://checkout.stripe.com/session123',
      });
    });

    it('creates checkout session with required params', async () => {
      const result = await createCheckoutSession({
        userId: 'user-123',
        email: 'user@example.com',
        priceId: 'price_123',
        tier: 'pro',
        successUrl: 'https://app.com/success',
        cancelUrl: 'https://app.com/cancel',
      });

      expect(result.id).toBe('cs_123');
      expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_123',
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [{ price: 'price_123', quantity: 1 }],
          success_url: 'https://app.com/success',
          cancel_url: 'https://app.com/cancel',
          metadata: { userId: 'user-123', tier: 'pro' },
        })
      );
    });

    it('includes trial period when specified', async () => {
      await createCheckoutSession({
        userId: 'user-123',
        email: 'user@example.com',
        priceId: 'price_123',
        tier: 'pro',
        successUrl: 'https://app.com/success',
        cancelUrl: 'https://app.com/cancel',
        trialDays: 14,
      });

      expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          subscription_data: expect.objectContaining({
            trial_period_days: 14,
          }),
        })
      );
    });

    it('includes coupon when specified', async () => {
      await createCheckoutSession({
        userId: 'user-123',
        email: 'user@example.com',
        priceId: 'price_123',
        tier: 'business',
        successUrl: 'https://app.com/success',
        cancelUrl: 'https://app.com/cancel',
        couponId: 'SAVE20',
      });

      expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          discounts: [{ coupon: 'SAVE20' }],
        })
      );
    });

    it('does not include trial for zero days', async () => {
      await createCheckoutSession({
        userId: 'user-123',
        email: 'user@example.com',
        priceId: 'price_123',
        tier: 'pro',
        successUrl: 'https://app.com/success',
        cancelUrl: 'https://app.com/cancel',
        trialDays: 0,
      });

      const callArgs = mockCheckoutSessionsCreate.mock.calls[0][0];
      expect(callArgs.subscription_data?.trial_period_days).toBeUndefined();
    });
  });

  describe('createSubscription', () => {
    it('creates subscription record in database', async () => {
      const subscriptionData = {
        userId: 'user-123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'pro' as const,
        status: 'active',
        currentPeriodStart: new Date('2024-01-01'),
        currentPeriodEnd: new Date('2024-02-01'),
      };

      mockCreate.mockResolvedValueOnce({ id: 'subscription-1', ...subscriptionData });

      const result = await createSubscription(subscriptionData);

      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-123',
          stripeCustomerId: 'cus_123',
          tier: 'pro',
          status: 'active',
        }),
      });
      expect(result.id).toBe('subscription-1');
    });

    it('creates subscription with trial dates', async () => {
      const subscriptionData = {
        userId: 'user-123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'pro' as const,
        status: 'trialing',
        currentPeriodStart: new Date('2024-01-01'),
        currentPeriodEnd: new Date('2024-02-01'),
        trialStart: new Date('2024-01-01'),
        trialEnd: new Date('2024-01-15'),
      };

      mockCreate.mockResolvedValueOnce({ id: 'subscription-1', ...subscriptionData });

      await createSubscription(subscriptionData);

      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          trialStart: subscriptionData.trialStart,
          trialEnd: subscriptionData.trialEnd,
        }),
      });
    });

    it('creates subscription with organization ID', async () => {
      const subscriptionData = {
        userId: 'user-123',
        stripeCustomerId: 'cus_123',
        stripeSubscriptionId: 'sub_123',
        stripePriceId: 'price_123',
        stripeProductId: 'prod_123',
        tier: 'business' as const,
        status: 'active',
        currentPeriodStart: new Date('2024-01-01'),
        currentPeriodEnd: new Date('2024-02-01'),
        organizationId: 'org-456',
      };

      mockCreate.mockResolvedValueOnce({ id: 'subscription-1', ...subscriptionData });

      await createSubscription(subscriptionData);

      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          organizationId: 'org-456',
        }),
      });
    });
  });

  describe('updateSubscription', () => {
    it('updates subscription tier', async () => {
      mockUpdate.mockResolvedValueOnce({ id: 'sub-1', tier: 'business' });

      await updateSubscription('sub-1', { tier: 'business' });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: { tier: 'business' },
      });
    });

    it('updates subscription status', async () => {
      mockUpdate.mockResolvedValueOnce({ id: 'sub-1', status: 'canceled' });

      await updateSubscription('sub-1', { status: 'canceled' });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: { status: 'canceled' },
      });
    });

    it('updates multiple fields', async () => {
      mockUpdate.mockResolvedValueOnce({ id: 'sub-1' });

      await updateSubscription('sub-1', {
        tier: 'pro',
        status: 'active',
        cancelAtPeriodEnd: false,
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: {
          tier: 'pro',
          status: 'active',
          cancelAtPeriodEnd: false,
        },
      });
    });
  });

  describe('getActiveSubscription', () => {
    it('returns active subscription', async () => {
      const subscription = {
        id: 'sub-1',
        userId: 'user-123',
        status: 'active',
        tier: 'pro',
      };
      mockFindFirst.mockResolvedValueOnce(subscription);

      const result = await getActiveSubscription('user-123');

      expect(result).toEqual(subscription);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          status: { in: ['active', 'trialing'] },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('returns trialing subscription', async () => {
      const subscription = {
        id: 'sub-1',
        userId: 'user-123',
        status: 'trialing',
        tier: 'business',
      };
      mockFindFirst.mockResolvedValueOnce(subscription);

      const result = await getActiveSubscription('user-123');

      expect(result?.status).toBe('trialing');
    });

    it('returns null if no active subscription', async () => {
      mockFindFirst.mockResolvedValueOnce(null);

      const result = await getActiveSubscription('user-123');

      expect(result).toBeNull();
    });
  });

  describe('getUserTier', () => {
    it('returns subscription tier for active user', async () => {
      mockFindFirst.mockResolvedValueOnce({ tier: 'pro' });

      const result = await getUserTier('user-123');

      expect(result).toBe('pro');
    });

    it('returns free tier if no subscription', async () => {
      mockFindFirst.mockResolvedValueOnce(null);

      const result = await getUserTier('user-123');

      expect(result).toBe('free');
    });

    it('returns business tier', async () => {
      mockFindFirst.mockResolvedValueOnce({ tier: 'business' });

      const result = await getUserTier('user-123');

      expect(result).toBe('business');
    });

    it('returns enterprise tier', async () => {
      mockFindFirst.mockResolvedValueOnce({ tier: 'enterprise' });

      const result = await getUserTier('user-123');

      expect(result).toBe('enterprise');
    });
  });

  describe('cancelSubscription', () => {
    it('cancels subscription at period end', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'sub-1',
        stripeSubscriptionId: 'stripe_sub_123',
        status: 'active',
      });
      mockSubscriptionsUpdate.mockResolvedValueOnce({});
      mockUpdate.mockResolvedValueOnce({ id: 'sub-1' });

      await cancelSubscription('sub-1');

      expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('stripe_sub_123', {
        cancel_at_period_end: true,
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: {
          cancelAtPeriodEnd: true,
          canceledAt: null,
          status: 'active',
        },
      });
    });

    it('cancels subscription immediately', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'sub-1',
        stripeSubscriptionId: 'stripe_sub_123',
        status: 'active',
      });
      mockSubscriptionsUpdate.mockResolvedValueOnce({});
      mockUpdate.mockResolvedValueOnce({ id: 'sub-1' });

      await cancelSubscription('sub-1', true);

      expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('stripe_sub_123', {
        cancel_at_period_end: false,
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: expect.objectContaining({
          cancelAtPeriodEnd: false,
          status: 'canceled',
        }),
      });
    });

    it('throws error if subscription not found', async () => {
      mockFindUnique.mockResolvedValueOnce(null);

      await expect(cancelSubscription('invalid-id')).rejects.toThrow('Subscription not found');
    });

    it('throws error if no Stripe subscription ID', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'sub-1',
        stripeSubscriptionId: null,
      });

      await expect(cancelSubscription('sub-1')).rejects.toThrow('Subscription not found');
    });
  });

  describe('reactivateSubscription', () => {
    it('reactivates canceled subscription', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'sub-1',
        stripeSubscriptionId: 'stripe_sub_123',
      });
      mockSubscriptionsUpdate.mockResolvedValueOnce({});
      mockUpdate.mockResolvedValueOnce({ id: 'sub-1' });

      await reactivateSubscription('sub-1');

      expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('stripe_sub_123', {
        cancel_at_period_end: false,
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: {
          cancelAtPeriodEnd: false,
          canceledAt: null,
        },
      });
    });

    it('throws error if subscription not found', async () => {
      mockFindUnique.mockResolvedValueOnce(null);

      await expect(reactivateSubscription('invalid-id')).rejects.toThrow('Subscription not found');
    });
  });

  describe('createPortalSession', () => {
    it('creates billing portal session', async () => {
      mockBillingPortalCreate.mockResolvedValueOnce({
        id: 'bps_123',
        url: 'https://billing.stripe.com/portal',
      });

      const result = await createPortalSession('cus_123', 'https://app.com/settings');

      expect(result.url).toBe('https://billing.stripe.com/portal');
      expect(mockBillingPortalCreate).toHaveBeenCalledWith({
        customer: 'cus_123',
        return_url: 'https://app.com/settings',
      });
    });
  });

  describe('changeSubscriptionPlan', () => {
    it('upgrades subscription plan', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'sub-1',
        stripeSubscriptionId: 'stripe_sub_123',
      });
      mockSubscriptionsRetrieve.mockResolvedValueOnce({
        items: {
          data: [{ id: 'si_123' }],
        },
      });
      mockSubscriptionsUpdate.mockResolvedValueOnce({});
      mockUpdate.mockResolvedValueOnce({ id: 'sub-1', tier: 'business' });

      await changeSubscriptionPlan('sub-1', 'price_business', 'business');

      expect(mockSubscriptionsUpdate).toHaveBeenCalledWith('stripe_sub_123', {
        items: [{ id: 'si_123', price: 'price_business' }],
        proration_behavior: 'create_prorations',
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: {
          tier: 'business',
          stripePriceId: 'price_business',
        },
      });
    });

    it('downgrades subscription plan', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'sub-1',
        stripeSubscriptionId: 'stripe_sub_123',
      });
      mockSubscriptionsRetrieve.mockResolvedValueOnce({
        items: {
          data: [{ id: 'si_456' }],
        },
      });
      mockSubscriptionsUpdate.mockResolvedValueOnce({});
      mockUpdate.mockResolvedValueOnce({ id: 'sub-1', tier: 'pro' });

      await changeSubscriptionPlan('sub-1', 'price_pro', 'pro');

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'sub-1' },
        data: {
          tier: 'pro',
          stripePriceId: 'price_pro',
        },
      });
    });

    it('throws error if subscription not found', async () => {
      mockFindUnique.mockResolvedValueOnce(null);

      await expect(changeSubscriptionPlan('invalid-id', 'price_123', 'pro')).rejects.toThrow(
        'Subscription not found'
      );
    });
  });
});
