/**
 * Stripe Client Tests
 */

// Mock Stripe - must define class inside jest.mock
jest.mock('stripe', () => {
  class MockStripeError extends Error {
    code?: string;
    constructor(message: string, code?: string) {
      super(message);
      this.code = code;
      this.name = 'StripeError';
    }
  }

  const MockStripe = function () {
    return {
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
    };
  };

  MockStripe.errors = {
    StripeError: MockStripeError,
  };

  return MockStripe;
});

import {
  isStripeConfigured,
  STRIPE_PLANS,
  getPriceId,
  formatAmount,
  handleStripeError,
  stripe,
} from '@/lib/billing/stripe';

// Get the mocked Stripe for error class
const Stripe = jest.requireMock('stripe');

// Store original env
const originalEnv = process.env;

describe('Stripe Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('isStripeConfigured', () => {
    it('returns false when STRIPE_SECRET_KEY is missing', () => {
      delete process.env.STRIPE_SECRET_KEY;
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123';
      process.env.STRIPE_PRO_MONTHLY_PRICE_ID = 'price_123';

      expect(isStripeConfigured()).toBe(false);
    });

    it('returns false when NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123';
      delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      process.env.STRIPE_PRO_MONTHLY_PRICE_ID = 'price_123';

      expect(isStripeConfigured()).toBe(false);
    });

    it('returns false when STRIPE_PRO_MONTHLY_PRICE_ID is missing', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123';
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123';
      delete process.env.STRIPE_PRO_MONTHLY_PRICE_ID;

      expect(isStripeConfigured()).toBe(false);
    });

    it('returns true when all required env vars are set', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123';
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123';
      process.env.STRIPE_PRO_MONTHLY_PRICE_ID = 'price_123';

      expect(isStripeConfigured()).toBe(true);
    });
  });

  describe('STRIPE_PLANS', () => {
    it('has pro_monthly plan', () => {
      expect(STRIPE_PLANS.pro_monthly).toBeDefined();
      expect(STRIPE_PLANS.pro_monthly.amount).toBe(1200);
      expect(STRIPE_PLANS.pro_monthly.interval).toBe('month');
      expect(STRIPE_PLANS.pro_monthly.tier).toBe('pro');
    });

    it('has pro_yearly plan', () => {
      expect(STRIPE_PLANS.pro_yearly).toBeDefined();
      expect(STRIPE_PLANS.pro_yearly.amount).toBe(9900);
      expect(STRIPE_PLANS.pro_yearly.interval).toBe('year');
      expect(STRIPE_PLANS.pro_yearly.tier).toBe('pro');
    });

    it('has business_monthly plan', () => {
      expect(STRIPE_PLANS.business_monthly).toBeDefined();
      expect(STRIPE_PLANS.business_monthly.amount).toBe(4900);
      expect(STRIPE_PLANS.business_monthly.interval).toBe('month');
      expect(STRIPE_PLANS.business_monthly.tier).toBe('business');
    });

    it('has business_yearly plan', () => {
      expect(STRIPE_PLANS.business_yearly).toBeDefined();
      expect(STRIPE_PLANS.business_yearly.amount).toBe(39900);
      expect(STRIPE_PLANS.business_yearly.interval).toBe('year');
      expect(STRIPE_PLANS.business_yearly.tier).toBe('business');
    });

    it('yearly plans have discount compared to monthly', () => {
      const proMonthlyYearly = STRIPE_PLANS.pro_monthly.amount * 12;
      expect(STRIPE_PLANS.pro_yearly.amount).toBeLessThan(proMonthlyYearly);

      const businessMonthlyYearly = STRIPE_PLANS.business_monthly.amount * 12;
      expect(STRIPE_PLANS.business_yearly.amount).toBeLessThan(businessMonthlyYearly);
    });
  });

  describe('getPriceId', () => {
    it('returns pro monthly price ID', () => {
      const result = getPriceId('pro', 'month');
      expect(result).toBe(STRIPE_PLANS.pro_monthly.priceId);
    });

    it('returns pro yearly price ID', () => {
      const result = getPriceId('pro', 'year');
      expect(result).toBe(STRIPE_PLANS.pro_yearly.priceId);
    });

    it('returns business monthly price ID', () => {
      const result = getPriceId('business', 'month');
      expect(result).toBe(STRIPE_PLANS.business_monthly.priceId);
    });

    it('returns business yearly price ID', () => {
      const result = getPriceId('business', 'year');
      expect(result).toBe(STRIPE_PLANS.business_yearly.priceId);
    });
  });

  describe('formatAmount', () => {
    it('formats USD amount correctly', () => {
      expect(formatAmount(1200)).toBe('$12.00');
      expect(formatAmount(9900)).toBe('$99.00');
      expect(formatAmount(4900)).toBe('$49.00');
      expect(formatAmount(100)).toBe('$1.00');
      expect(formatAmount(50)).toBe('$0.50');
    });

    it('formats zero amount', () => {
      expect(formatAmount(0)).toBe('$0.00');
    });

    it('formats large amounts', () => {
      expect(formatAmount(1000000)).toBe('$10,000.00');
    });

    it('formats with different currency', () => {
      const result = formatAmount(1200, 'eur');
      expect(result).toContain('12');
      expect(result).toContain('€');
    });

    it('handles uppercase currency', () => {
      const result = formatAmount(1200, 'GBP');
      expect(result).toContain('12');
      expect(result).toContain('£');
    });
  });

  describe('handleStripeError', () => {
    it('handles Stripe errors with code', () => {
      const stripeError = new Stripe.errors.StripeError('Card declined', 'card_declined');

      const result = handleStripeError(stripeError);

      expect(result.message).toBe('Card declined');
      expect(result.code).toBe('card_declined');
    });

    it('handles Stripe errors without code', () => {
      const stripeError = new Stripe.errors.StripeError('Something went wrong');

      const result = handleStripeError(stripeError);

      expect(result.message).toBe('Something went wrong');
    });

    it('handles generic Error', () => {
      const error = new Error('Network failure');

      const result = handleStripeError(error);

      expect(result.message).toBe('Network failure');
      expect(result.code).toBeUndefined();
    });

    it('handles unknown error type', () => {
      const result = handleStripeError('string error');

      expect(result.message).toBe('An unexpected error occurred');
    });

    it('handles null error', () => {
      const result = handleStripeError(null);

      expect(result.message).toBe('An unexpected error occurred');
    });

    it('handles undefined error', () => {
      const result = handleStripeError(undefined);

      expect(result.message).toBe('An unexpected error occurred');
    });

    it('handles number error', () => {
      const result = handleStripeError(500);

      expect(result.message).toBe('An unexpected error occurred');
    });

    it('handles object error', () => {
      const result = handleStripeError({ code: 'ERR' });

      expect(result.message).toBe('An unexpected error occurred');
    });
  });

  describe('stripe instance', () => {
    it('exports stripe instance', () => {
      expect(stripe).toBeDefined();
    });

    it('stripe has customers API', () => {
      expect(stripe.customers).toBeDefined();
    });

    it('stripe has subscriptions API', () => {
      expect(stripe.subscriptions).toBeDefined();
    });

    it('stripe has checkout API', () => {
      expect(stripe.checkout).toBeDefined();
    });

    it('stripe has billing portal API', () => {
      expect(stripe.billingPortal).toBeDefined();
    });
  });
});
