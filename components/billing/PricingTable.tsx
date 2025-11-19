'use client';

import { useState } from 'react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly?: number;
    yearly?: number;
    monthlyFormatted?: string;
    yearlyFormatted?: string;
    yearlyMonthly?: string;
  };
  priceIds?: {
    monthly?: string;
    yearly?: string;
  };
  features?: any;
  limits: string[];
  cta: string;
  popular: boolean;
  savings?: string;
}

interface PricingTableProps {
  currentTier?: string;
  userId?: string;
  userEmail?: string;
}

export function PricingTable({ currentTier = 'free', userId, userEmail }: PricingTableProps) {
  const [interval, setInterval] = useState<'month' | 'year'>('month');
  const [loading, setLoading] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: {
        monthly: 0,
        yearly: 0,
        monthlyFormatted: '$0',
        yearlyFormatted: '$0',
      },
      limits: [
        '5 favorites',
        '3 comparisons per day',
        'Basic search & filters',
        'View program details',
        'Read reviews',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For serious affiliate marketers',
      price: {
        monthly: 1200,
        yearly: 9900,
        monthlyFormatted: '$12',
        yearlyFormatted: '$99',
        yearlyMonthly: '$8.25',
      },
      limits: [
        'Unlimited favorites',
        'Unlimited comparisons',
        '10 saved searches',
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
        monthly: 4900,
        yearly: 39900,
        monthlyFormatted: '$49',
        yearlyFormatted: '$399',
        yearlyMonthly: '$33.25',
      },
      limits: [
        'Everything in Pro',
        'API access (10,000 calls/month)',
        'Up to 5 team members',
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
        monthlyFormatted: 'Custom',
        yearlyFormatted: 'Custom',
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

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === 'enterprise') return;

    if (!userId || !userEmail) {
      alert('Please sign in to upgrade');
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: userEmail,
          tier: planId,
          interval,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: unknown) {
      console.error('Upgrade error:', error);
      alert(error.message || 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 mb-8">Start free, upgrade when you need more</p>

        {/* Interval Toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setInterval('month')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              interval === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('year')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              interval === 'year'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs text-green-600 font-semibold">Save up to 32%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentTier;
          const price =
            interval === 'month'
              ? plan.price.monthlyFormatted
              : plan.price.yearlyMonthly || plan.price.yearlyFormatted;
          const isLoading = loading === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200 shadow-sm'
              } ${isCurrentPlan ? 'bg-gray-50' : 'bg-white'}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    CURRENT PLAN
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{price}</span>
                  {plan.id !== 'enterprise' && plan.id !== 'free' && (
                    <span className="text-gray-600 ml-2">/month</span>
                  )}
                </div>
                {interval === 'year' && plan.savings && (
                  <p className="text-sm text-green-600 font-medium mt-1">{plan.savings}</p>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrentPlan || isLoading || plan.id === 'enterprise'}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors mb-6 ${
                  plan.popular && !isCurrentPlan
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : isCurrentPlan
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : plan.id === 'enterprise'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {isLoading ? 'Loading...' : isCurrentPlan ? 'Current Plan' : plan.cta}
              </button>

              {/* Features List */}
              <ul className="space-y-3">
                {plan.limits.map((limit, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {limit}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* FAQ or Additional Info */}
      <div className="mt-12 text-center text-sm text-gray-600">
        <p>All plans include 14-day free trial • Cancel anytime • No hidden fees</p>
        <p className="mt-2">
          Questions?{' '}
          <a href="mailto:support@example.com" className="text-blue-500 hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
