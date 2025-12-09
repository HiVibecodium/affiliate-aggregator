'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { HeroSearch } from '@/components/HeroSearch';

interface NetworkStats {
  name: string;
  programs: number;
}

interface HomeStats {
  totalPrograms: number;
  totalNetworks: number;
  networks: NetworkStats[];
}

interface HomeContentProps {
  stats: HomeStats | null;
}

export function HomeContent({ stats }: HomeContentProps) {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('subtitle', {
              programs: stats?.totalPrograms?.toLocaleString() || '1,700+',
              networks: stats?.totalNetworks || 6,
            })}
          </p>

          {/* Hero Search */}
          <div className="mb-8">
            <HeroSearch />
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t('browsePrograms')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/programs/top-rated"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:-translate-y-0.5"
            >
              <span>{t('topRated')}</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
              <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase mb-2">
                {t('stats.totalPrograms')}
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalPrograms?.toLocaleString() || '0'}
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm">
                {t('stats.databaseLoaded')}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-purple-500">
              <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase mb-2">
                {t('stats.affiliateNetworks')}
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalNetworks || '0'}
              </div>
              <div className="text-blue-600 dark:text-blue-400 text-sm">
                {t('stats.majorNetworks')}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-green-500">
              <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase mb-2">
                {t('stats.averageCommission')}
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">42%</div>
              <div className="text-purple-600 dark:text-purple-400 text-sm">
                {t('stats.salesCommission')}
              </div>
            </div>
          </div>
        )}

        {/* Networks Section */}
        {stats && stats.networks && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('programsByNetwork')}
            </h2>
            <div className="space-y-4">
              {stats.networks.map((network: NetworkStats) => (
                <Link
                  key={network.name}
                  href={`/programs?network=${encodeURIComponent(network.name)}`}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-200 dark:hover:border-blue-500 border border-transparent transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                      {network.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {network.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t('affiliateNetwork')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {network.programs.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('programs')}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">&#x1F50D;</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {t('features.smartSearch')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{t('features.smartSearchDesc')}</p>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">&#x1F4C8;</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {t('features.qualityOnly')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{t('features.qualityOnlyDesc')}</p>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">&#x1F4BC;</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {t('features.forBusiness')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{t('features.forBusinessDesc')}</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('readyToStart')}</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto px-4">{t('createAccount')}</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            {t('getStarted')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
