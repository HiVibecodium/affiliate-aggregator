'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🛠️ Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Business metrics & system health</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Revenue Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💰 Revenue</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="text-3xl font-bold">${stats?.revenue?.mrr || 0}</div>
              <div className="text-sm opacity-90">MRR (Monthly)</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="text-3xl font-bold">${((stats?.revenue?.arr || 0) / 1000).toFixed(0)}K</div>
              <div className="text-sm opacity-90">ARR (Annual)</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="text-3xl font-bold">${stats?.revenue?.last30Days || 0}</div>
              <div className="text-sm opacity-90">Last 30 Days</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div className="text-3xl font-bold">${stats?.revenue?.total || 0}</div>
              <div className="text-sm opacity-90">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* User Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">👥 Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.users?.total || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-green-600">{stats?.users?.new30Days || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">New (30 days)</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-blue-600">{stats?.subscriptions?.active || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Subs</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-purple-600">{stats?.subscriptions?.conversionRate || 0}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversion</div>
            </div>
          </div>
        </div>

        {/* Subscriptions by Tier */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📊 Subscriptions by Tier</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              {stats?.subscriptions?.byTier?.map((tier: any) => (
                <div key={tier.tier} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 capitalize font-medium">{tier.tier}</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{tier.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📈 Engagement</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.engagement?.clicks || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.engagement?.favorites || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Favorites</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.engagement?.reviews || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.engagement?.applications || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Applications</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.engagement?.savedSearches || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Saved Searches</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.engagement?.alertsEnabled || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Alerts Active</div>
            </div>
          </div>
        </div>

        {/* Referrals */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🎁 Referral Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.referrals?.total || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-green-600">{stats?.referrals?.completed || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-blue-600">{stats?.referrals?.conversionRate || 0}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversion</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Users</h3>
            <div className="space-y-3">
              {stats?.recent?.users?.map((user: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Subscriptions</h3>
            <div className="space-y-3">
              {stats?.recent?.subscriptions?.map((sub: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{sub.tier} - {sub.status}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/programs" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 text-center">
            Programs
          </Link>
          <Link href="/analytics" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 text-center">
            Analytics
          </Link>
          <Link href="/billing" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 text-center">
            Billing
          </Link>
          <Link href="/referrals" className="bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700 text-center">
            Referrals
          </Link>
        </div>
      </div>
    </div>
  )
}
