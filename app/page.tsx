import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Revalidate every 10 minutes
export const revalidate = 600;

interface NetworkStats {
  name: string;
  programs: number;
}

interface HomeStats {
  totalPrograms: number;
  totalNetworks: number;
  networks: NetworkStats[];
}

async function getStats(): Promise<HomeStats | null> {
  try {
    const [totalPrograms, totalNetworks, programsByNetwork] = await Promise.all([
      prisma.affiliateProgram.count(),
      prisma.affiliateNetwork.count(),
      prisma.affiliateNetwork.findMany({
        include: {
          _count: {
            select: { programs: true },
          },
        },
      }),
    ]);

    return {
      totalPrograms,
      totalNetworks,
      networks: programsByNetwork.map((n) => ({
        name: n.name,
        programs: n._count.programs,
      })),
    };
  } catch (error) {
    logger.error('Failed to fetch stats:', error);
    return null;
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Affiliate Program
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover {stats?.totalPrograms?.toLocaleString() || '1,700+'} affiliate programs from{' '}
            {stats?.totalNetworks || 6} major networks. Compare commissions, track applications, and
            grow your income.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Browse Programs
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
              <span>Top Rated</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
              <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase mb-2">
                Всего программ
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalPrograms?.toLocaleString() || '0'}
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm">
                ✓ База полностью загружена
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-purple-500">
              <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase mb-2">
                Партнерских сетей
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalNetworks || '0'}
              </div>
              <div className="text-blue-600 dark:text-blue-400 text-sm">
                Крупнейшие мировые сети
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-green-500">
              <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase mb-2">
                Средний процент
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">42%</div>
              <div className="text-purple-600 dark:text-purple-400 text-sm">Комиссия с продаж</div>
            </div>
          </div>
        )}

        {/* Networks Section */}
        {stats && stats.networks && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📊 Программ по сетям
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
                      <div className="text-sm text-gray-500">Партнерская сеть</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {network.programs.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">программ</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Умный поиск</h3>
            <p className="text-gray-600">
              Фильтруйте программы по категориям, комиссиям и условиям
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Только качество</h3>
            <p className="text-gray-600">750+ отборных программ с высокими комиссиями</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">Для бизнеса</h3>
            <p className="text-gray-600">Multi-tenant система с ролевым доступом</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto px-4">
            Create a free account to save favorites, track applications, and compare programs side
            by side.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Get Started Free
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
