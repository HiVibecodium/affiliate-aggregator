import { logger } from '@/lib/logger';
/**
 * GET /api/billing/plans
 *
 * Get available subscription plans with pricing
 */

import { NextResponse } from 'next/server';
import { STRIPE_PLANS, formatAmount } from '@/lib/billing/stripe';
import { TIER_LIMITS } from '@/lib/billing/feature-gates';

export async function GET() {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        description: 'Perfect for getting started',
        price: {
          monthly: 0,
          yearly: 0,
        },
        features: {
          favorites: TIER_LIMITS.free.favorites,
          comparisons_daily: TIER_LIMITS.free.comparisons_daily,
          saved_searches: TIER_LIMITS.free.saved_searches,
          applications: TIER_LIMITS.free.applications,
          can_write_reviews: TIER_LIMITS.free.can_write_reviews,
          can_export: TIER_LIMITS.free.can_export,
          can_access_analytics: TIER_LIMITS.free.can_access_analytics,
          can_use_api: TIER_LIMITS.free.can_use_api,
        },
        limits: [
          `${TIER_LIMITS.free.favorites} favorites`,
          `${TIER_LIMITS.free.comparisons_daily} comparisons per day`,
          'Basic search & filters',
          'View program details',
          'Read reviews',
        ],
        cta: 'Get Started',
        popular: false,
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'For serious affiliate marketers',
        price: {
          monthly: STRIPE_PLANS.pro_monthly.amount,
          yearly: STRIPE_PLANS.pro_yearly.amount,
          monthlyFormatted: formatAmount(STRIPE_PLANS.pro_monthly.amount),
          yearlyFormatted: formatAmount(STRIPE_PLANS.pro_yearly.amount),
          yearlyMonthly: formatAmount(Math.round(STRIPE_PLANS.pro_yearly.amount / 12)),
        },
        priceIds: {
          monthly: STRIPE_PLANS.pro_monthly.priceId,
          yearly: STRIPE_PLANS.pro_yearly.priceId,
        },
        features: {
          favorites: TIER_LIMITS.pro.favorites,
          comparisons_daily: TIER_LIMITS.pro.comparisons_daily,
          saved_searches: TIER_LIMITS.pro.saved_searches,
          applications: TIER_LIMITS.pro.applications,
          can_write_reviews: TIER_LIMITS.pro.can_write_reviews,
          can_export: TIER_LIMITS.pro.can_export,
          can_access_analytics: TIER_LIMITS.pro.can_access_analytics,
          can_use_api: TIER_LIMITS.pro.can_use_api,
        },
        limits: [
          'Unlimited favorites',
          'Unlimited comparisons',
          `${TIER_LIMITS.pro.saved_searches} saved searches`,
          'Unlimited application tracking',
          'Write reviews',
          'Export to CSV/Excel',
          'Analytics dashboard',
          'Priority support',
        ],
        cta: 'Upgrade to Pro',
        popular: true,
        savings: '30% off yearly',
      },
      {
        id: 'business',
        name: 'Business',
        description: 'For teams and agencies',
        price: {
          monthly: STRIPE_PLANS.business_monthly.amount,
          yearly: STRIPE_PLANS.business_yearly.amount,
          monthlyFormatted: formatAmount(STRIPE_PLANS.business_monthly.amount),
          yearlyFormatted: formatAmount(STRIPE_PLANS.business_yearly.amount),
          yearlyMonthly: formatAmount(Math.round(STRIPE_PLANS.business_yearly.amount / 12)),
        },
        priceIds: {
          monthly: STRIPE_PLANS.business_monthly.priceId,
          yearly: STRIPE_PLANS.business_yearly.priceId,
        },
        features: {
          favorites: TIER_LIMITS.business.favorites,
          comparisons_daily: TIER_LIMITS.business.comparisons_daily,
          saved_searches: TIER_LIMITS.business.saved_searches,
          applications: TIER_LIMITS.business.applications,
          api_calls_monthly: TIER_LIMITS.business.api_calls_monthly,
          team_members: TIER_LIMITS.business.team_members,
          can_write_reviews: TIER_LIMITS.business.can_write_reviews,
          can_export: TIER_LIMITS.business.can_export,
          can_access_analytics: TIER_LIMITS.business.can_access_analytics,
          can_use_api: TIER_LIMITS.business.can_use_api,
        },
        limits: [
          'Everything in Pro',
          'API access (10,000 calls/month)',
          `Up to ${TIER_LIMITS.business.team_members} team members`,
          'Advanced analytics',
          'Custom integrations',
          'Webhooks',
          'Priority email + chat support',
          'Custom onboarding',
        ],
        cta: 'Upgrade to Business',
        popular: false,
        savings: '32% off yearly',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Custom solutions for large organizations',
        price: {
          monthly: null,
          yearly: null,
          monthlyFormatted: 'Custom',
          yearlyFormatted: 'Custom',
        },
        features: {
          favorites: TIER_LIMITS.enterprise.favorites,
          comparisons_daily: TIER_LIMITS.enterprise.comparisons_daily,
          saved_searches: TIER_LIMITS.enterprise.saved_searches,
          applications: TIER_LIMITS.enterprise.applications,
          api_calls_monthly: TIER_LIMITS.enterprise.api_calls_monthly,
          team_members: TIER_LIMITS.enterprise.team_members,
          can_write_reviews: TIER_LIMITS.enterprise.can_write_reviews,
          can_export: TIER_LIMITS.enterprise.can_export,
          can_access_analytics: TIER_LIMITS.enterprise.can_access_analytics,
          can_use_api: TIER_LIMITS.enterprise.can_use_api,
        },
        limits: [
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
        cta: 'Contact Sales',
        popular: false,
      },
    ];

    return NextResponse.json({ plans });
  } catch (error: unknown) {
    logger.error('Get plans error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get plans' },
      { status: 500 }
    );
  }
}
