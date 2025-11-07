'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardAnalytics {
  overview: {
    totalPrograms: number;
    totalNetworks: number;
    activeNetworks: number;
    avgCommission: string;
  };
  programsByNetwork: Array<{ network: string; programs: number }>;
  programsByCategory: Array<{ category: string; count: number }>;
  topCommissions: Array<{
    id: string;
    name: string;
    commissionRate: number;
    commissionType: string;
    category: string;
    network: { name: string };
  }>;
  recentPrograms: Array<{
    id: string;
    name: string;
    category: string;
    commissionRate: number;
    createdAt: string;
    network: { name: string };
  }>;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/dashboard/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || 'Failed to load data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                🌐 Affiliate Aggregator
              </Link>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/programs"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Browse Programs
              </Link>
              <Link
                href="/"
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Global overview of affiliate programs and networks
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Total Programs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.overview.totalPrograms.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Networks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.overview.totalNetworks}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {analytics.overview.activeNetworks} active
                </p>
              </div>
              <div className="text-4xl">🌐</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Avg Commission</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.overview.avgCommission}%
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.programsByCategory.length}
                </p>
              </div>
              <div className="text-4xl">🏷️</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Networks */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📊 Programs by Network
            </h2>
            <div className="space-y-3">
              {analytics.programsByNetwork.slice(0, 6).map((item) => (
                <div key={item.network} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{item.network}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.programs / analytics.overview.totalPrograms) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 min-w-[60px] text-right">
                      {item.programs.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🏷️ Top Categories
            </h2>
            <div className="space-y-3">
              {analytics.programsByCategory.slice(0, 6).map((item) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / analytics.overview.totalPrograms) * 100 * 10}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 min-w-[60px] text-right">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Commissions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              💎 Highest Commissions
            </h2>
            <div className="space-y-3">
              {analytics.topCommissions.slice(0, 5).map((program) => (
                <div key={program.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{program.name}</h3>
                      <p className="text-sm text-gray-500">{program.network.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">
                        {program.commissionRate}%
                      </span>
                      <p className="text-xs text-gray-500">{program.commissionType}</p>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                    {program.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Programs */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🆕 Recently Added
            </h2>
            <div className="space-y-3">
              {analytics.recentPrograms.map((program) => (
                <div key={program.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{program.name}</h3>
                      <p className="text-sm text-gray-500">{program.network.name}</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {program.commissionRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">
                      {program.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(program.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
