/**
 * Billing Success Page
 *
 * Shown after successful checkout
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { stripe } from '@/lib/billing/stripe';

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect('/billing');
  }

  // Verify session with Stripe and get details
  let planName = 'Pro';
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.tier) {
      planName = session.metadata.tier.charAt(0).toUpperCase() + session.metadata.tier.slice(1);
    }
  } catch (error) {
    console.error('Failed to retrieve Stripe session:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <svg
                className="w-16 h-16 text-green-500"
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
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to {planName}! 🎉</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your subscription is now active and all {planName} features are unlocked.
          </p>

          {/* What's Unlocked */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              What&apos;s Now Available:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Unlimited Favorites</p>
                  <p className="text-sm text-gray-600">Save as many programs as you want</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Unlimited Comparisons</p>
                  <p className="text-sm text-gray-600">Compare unlimited programs</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Application Tracking</p>
                  <p className="text-sm text-gray-600">Track all your applications</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Analytics Dashboard</p>
                  <p className="text-sm text-gray-600">Deep insights into your data</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Write Reviews</p>
                  <p className="text-sm text-gray-600">Share your experiences</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Export Data</p>
                  <p className="text-sm text-gray-600">CSV/Excel exports</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Next Steps:</h3>
            <div className="space-y-3">
              <Link
                href="/programs"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>Browse all 80,000+ programs</span>
              </Link>
              <Link
                href="/applications"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>Track your applications</span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>View analytics dashboard</span>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-700">
              <strong>Need help getting started?</strong> Check out our{' '}
              <a href="/docs" className="text-blue-600 hover:underline">
                documentation
              </a>{' '}
              or{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                contact support
              </a>
              .
            </p>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
