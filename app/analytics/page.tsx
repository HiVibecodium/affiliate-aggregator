'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { StatsCards } from '@/components/analytics/StatsCards';
import { TopProgramsTable } from '@/components/analytics/TopProgramsTable';

// Dynamic imports for heavy chart components (recharts ~100kb)
// These are only loaded when needed, reducing initial bundle size
const CommissionChart = dynamic(
  () =>
    import('@/components/analytics/CommissionChart').then((mod) => ({
      default: mod.CommissionChart,
    })),
  {
    loading: () => <div className="bg-white rounded-lg border p-6 h-[350px] animate-pulse" />,
    ssr: false,
  }
);

const CategoryChart = dynamic(
  () =>
    import('@/components/analytics/CategoryChart').then((mod) => ({ default: mod.CategoryChart })),
  {
    loading: () => <div className="bg-white rounded-lg border p-6 h-[350px] animate-pulse" />,
    ssr: false,
  }
);

const TrendChart = dynamic(
  () => import('@/components/analytics/TrendChart').then((mod) => ({ default: mod.TrendChart })),
  {
    loading: () => <div className="bg-white rounded-lg border p-6 h-[350px] animate-pulse" />,
    ssr: false,
  }
);

interface PopularProgram {
  id: string;
  name: string;
  network: string;
  category: string;
  commissionRate: number;
  clicks: number;
}

interface AdvancedAnalyticsData {
  overview: {
    totalPrograms: number;
    totalNetworks: number;
    totalClicks: number;
    totalReviews: number;
    avgCommission: string;
  };
  commissionDistribution: Array<{
    type: string;
    count: number;
    avgRate: string;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
  }>;
  newProgramsTrend: Array<{
    date: string;
    count: number;
  }>;
  topPrograms: Array<{
    id: string;
    name: string;
    network: string;
    commissionRate: number | null;
    clicks: number;
    reviews: number;
    applications: number;
  }>;
}

export default function AnalyticsPage() {
  const [popularPrograms, setPopularPrograms] = useState<PopularProgram[]>([]);
  const [advancedData, setAdvancedData] = useState<AdvancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularPrograms();
    fetchAdvancedAnalytics();
  }, []);

  async function fetchAdvancedAnalytics() {
    try {
      const response = await fetch('/api/analytics/advanced');
      if (response.ok) {
        const data = await response.json();
        setAdvancedData(data);
      }
    } catch (err) {
      console.error('Failed to fetch advanced analytics:', err);
    }
  }

  async function fetchPopularPrograms() {
    try {
      const response = await fetch('/api/analytics/popular');

      if (!response.ok) {
        console.error('Analytics API error:', response.status);
        setError('Analytics data temporarily unavailable');
        setPopularPrograms([]);
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Handle API errors gracefully
      if (data.error) {
        setError(data.error);
        setPopularPrograms([]);
      } else {
        setPopularPrograms(data.popular || []);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      // Gracefully handle error - show empty state instead of crashing
      setError('Failed to load analytics data');
      setPopularPrograms([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mb-2 inline-block"
          >
            ← Назад на главную
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Аналитика</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Популярные программы и тренды</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Advanced Analytics Charts */}
        {advancedData && (
          <>
            <StatsCards stats={advancedData.overview} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <CommissionChart data={advancedData.commissionDistribution} />
              <CategoryChart data={advancedData.categoryStats} />
            </div>

            <div className="mb-6">
              <TrendChart data={advancedData.newProgramsTrend} />
            </div>

            <TopProgramsTable programs={advancedData.topPrograms} />
          </>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Original Popular Programs (keep as fallback) */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 Самые популярные программы</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Загрузка аналитики...</p>
            </div>
          ) : popularPrograms.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-700 font-semibold text-lg">Пока нет данных по кликам</p>
              <p className="text-sm text-gray-500 mt-2">
                Начните просматривать программы, чтобы увидеть статистику
              </p>
              <Link
                href="/programs"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Перейти к программам
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {popularPrograms.map((program, index) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? 'bg-yellow-500'
                          : index === 1
                            ? 'bg-gray-400'
                            : index === 2
                              ? 'bg-orange-600'
                              : 'bg-blue-500'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    {/* Program Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{program.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{program.network}</span>
                        <span>•</span>
                        <span>{program.category}</span>
                        <span>•</span>
                        <span className="text-green-600 font-semibold">
                          {program.commissionRate}%
                        </span>
                      </div>
                    </div>

                    {/* Clicks Count */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{program.clicks}</div>
                      <div className="text-xs text-gray-500">кликов</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Всего кликов</div>
            <div className="text-3xl font-bold text-gray-900">
              {popularPrograms.reduce((sum, p) => sum + p.clicks, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Отслеживаемых программ</div>
            <div className="text-3xl font-bold text-gray-900">{popularPrograms.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Средний CTR</div>
            <div className="text-3xl font-bold text-gray-900">
              {popularPrograms.length > 0
                ? Math.round(
                    popularPrograms.reduce((sum, p) => sum + p.clicks, 0) / popularPrograms.length
                  )
                : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
