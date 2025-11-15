/**
 * Pricing/Upgrade Page
 *
 * Shows pricing table and allows users to upgrade their plan
 */

import { PricingTable } from '@/components/billing/PricingTable'

export default async function UpgradePage() {
  // For demo purposes, show pricing to everyone
  // TODO: Get actual user from auth when ready
  const user = null as any

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Supercharge Your Affiliate Marketing
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of successful affiliates who use our platform to find and manage the best programs
          </p>
        </div>
      </div>

      {/* Pricing Table */}
      <PricingTable
        currentTier={'free'}
        userId={user?.id}
        userEmail={user?.email}
      />

      {/* Social Proof */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by Affiliate Marketers Worldwide
            </h2>
            <p className="text-gray-600">
              Join our community and start growing your affiliate income today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">80,010+</div>
              <div className="text-gray-600">Affiliate Programs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
              <div className="text-gray-600">Major Networks</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">&lt;1s</div>
              <div className="text-gray-600">Average Load Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Can I switch plans anytime?
            </summary>
            <p className="mt-3 text-gray-600">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
              and we&apos;ll prorate the charges accordingly.
            </p>
          </details>

          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              What payment methods do you accept?
            </summary>
            <p className="mt-3 text-gray-600">
              We accept all major credit cards (Visa, Mastercard, American Express) and debit cards
              through our secure payment processor, Stripe.
            </p>
          </details>

          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Is there a free trial?
            </summary>
            <p className="mt-3 text-gray-600">
              Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              You can cancel anytime during the trial period at no charge.
            </p>
          </details>

          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              What happens if I cancel?
            </summary>
            <p className="mt-3 text-gray-600">
              You can cancel anytime. Your subscription will remain active until the end of your billing period,
              then you&apos;ll be downgraded to the Free plan. All your data remains safe.
            </p>
          </details>

          <details className="bg-white rounded-lg p-6 shadow-sm">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Do you offer refunds?
            </summary>
            <p className="mt-3 text-gray-600">
              We offer a 30-day money-back guarantee. If you&apos;re not satisfied within the first 30 days,
              contact us for a full refund.
            </p>
          </details>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Your Affiliate Marketing to the Next Level?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </div>
  )
}
