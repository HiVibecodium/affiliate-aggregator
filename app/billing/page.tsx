/**
 * Billing Dashboard Page
 *
 * Shows current subscription, usage stats, and billing history
 */

import { UsageStats } from '@/components/billing/UsageStats';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getActiveSubscription } from '@/lib/billing/subscription';
import { getUsageSummary } from '@/lib/billing/feature-gates';
import { redirect } from 'next/navigation';
import type { Invoice } from '@prisma/client';

export default async function BillingPage() {
  // Get authenticated user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/billing');
  }

  // Get user from database
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) {
    redirect('/login?redirect=/billing');
  }

  // Get subscription data
  const subscription = await getActiveSubscription(dbUser.id);
  const tier = subscription?.tier || 'free';

  // Get invoices
  const invoices = await prisma.invoice.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const subscriptionData = {
    tier,
    status: subscription?.status || 'active',
    subscription: subscription
      ? {
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        }
      : null,
    invoices,
  };

  // Get usage data
  const usageData = await getUsageSummary(dbUser.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription and view billing history</p>
        </div>

        {/* Current Plan Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Current Plan</h2>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-3xl font-bold ${
                      subscriptionData.tier === 'enterprise'
                        ? 'text-purple-600'
                        : subscriptionData.tier === 'business'
                          ? 'text-blue-600'
                          : subscriptionData.tier === 'pro'
                            ? 'text-green-600'
                            : 'text-gray-600'
                    }`}
                  >
                    {subscriptionData.tier.charAt(0).toUpperCase() + subscriptionData.tier.slice(1)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      subscriptionData.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : subscriptionData.status === 'trialing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {subscriptionData.status}
                  </span>
                </div>
              </div>

              {subscriptionData.tier !== 'enterprise' && (
                <a
                  href="/billing/upgrade"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  {subscriptionData.tier === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                </a>
              )}
            </div>

            {subscriptionData.subscription && (
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next billing date:</span>
                  <span className="font-medium text-gray-900">
                    {subscriptionData.subscription.currentPeriodEnd
                      ? new Date(
                          subscriptionData.subscription.currentPeriodEnd
                        ).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>

                {subscriptionData.subscription.cancelAtPeriodEnd && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Your subscription will cancel on{' '}
                      {subscriptionData.subscription.currentPeriodEnd
                        ? new Date(
                            subscriptionData.subscription.currentPeriodEnd
                          ).toLocaleDateString()
                        : 'N/A'}
                      . You can reactivate anytime before then.
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <form action="/api/billing/portal" method="POST">
                    <button
                      type="submit"
                      className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Manage subscription →
                    </button>
                  </form>
                </div>
              </div>
            )}

            {subscriptionData.tier === 'free' && (
              <div className="border-t border-gray-200 pt-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Upgrade to unlock powerful features:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Unlimited favorites and comparisons</li>
                    <li>• Application tracking</li>
                    <li>• Advanced analytics</li>
                    <li>• Export capabilities</li>
                  </ul>
                  <a
                    href="/billing/upgrade"
                    className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    See all Pro features →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Usage Stats */}
          <div className="lg:col-span-1">
            <UsageStats tier={usageData.tier} usage={usageData.usage} />
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing History</h2>

          {subscriptionData.invoices && subscriptionData.invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptionData.invoices.map((invoice: Invoice) => (
                    <tr key={invoice.id} className="text-sm">
                      <td className="py-3 text-gray-900">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-gray-700">
                        {invoice.description || `${subscriptionData.tier} subscription`}
                      </td>
                      <td className="py-3 text-gray-900 font-medium">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : invoice.status === 'open'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {invoice.hostedInvoiceUrl && (
                          <a
                            href={invoice.hostedInvoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 text-xs"
                          >
                            View →
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-600">No billing history yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Invoices will appear here after you subscribe to a paid plan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
