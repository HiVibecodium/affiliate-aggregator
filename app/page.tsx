import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { HomeHeader } from '@/components/HomeHeader';
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      <HomeHeader />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🌐 Global Affiliate Networks Aggregator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 px-4">
            Откройте для себя 750+ лучших партнерских программ со всего мира
          </p>
          <div className="flex gap-2 sm:gap-4 justify-center flex-wrap px-2">
            <Link
              href="/programs"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Посмотреть все программы →
            </Link>
            <Link
              href="/programs/top-rated"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              🏆 Лучшие программы
            </Link>
            <Link
              href="/programs/new"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              🆕 Новые программы
            </Link>
            <Link
              href="/applications"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              📋 Мои заявки
            </Link>
            <Link
              href="/favorites"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              ❤️ Избранное
            </Link>
            <Link
              href="/dashboard"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Dashboard →
            </Link>
            <Link
              href="/analytics"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              📊 Аналитика
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

        {/* Auth Links */}
        <div className="text-center">
          <div className="flex gap-4 justify-center mb-4">
            <Link
              href="/login"
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
          <a href="/api/health" target="_blank" className="text-blue-600 hover:underline text-sm">
            Health Check
          </a>
        </div>
      </div>
    </main>
  );
}
