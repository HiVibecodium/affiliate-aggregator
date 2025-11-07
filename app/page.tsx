import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getStats() {
  try {
    const [totalPrograms, totalNetworks, programsByNetwork] = await Promise.all([
      prisma.affiliateProgram.count(),
      prisma.affiliateNetwork.count(),
      prisma.affiliateNetwork.findMany({
        include: {
          _count: {
            select: { programs: true }
          }
        }
      })
    ]);

    return {
      totalPrograms,
      totalNetworks,
      networks: programsByNetwork.map(n => ({
        name: n.name,
        programs: n._count.programs
      }))
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return null;
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🌐 Global Affiliate Networks Aggregator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Откройте для себя 80,000+ партнерских программ со всего мира
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/programs"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Посмотреть все программы →
            </Link>
            <Link
              href="/dashboard"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Dashboard →
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
              <div className="text-gray-500 text-sm font-semibold uppercase mb-2">
                Всего программ
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {stats.totalPrograms?.toLocaleString() || '0'}
              </div>
              <div className="text-green-600 text-sm">
                ✓ База полностью загружена
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-500">
              <div className="text-gray-500 text-sm font-semibold uppercase mb-2">
                Партнерских сетей
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {stats.totalNetworks || '0'}
              </div>
              <div className="text-blue-600 text-sm">
                Крупнейшие мировые сети
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500">
              <div className="text-gray-500 text-sm font-semibold uppercase mb-2">
                Средний процент
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                5-30%
              </div>
              <div className="text-purple-600 text-sm">
                Комиссия с продаж
              </div>
            </div>
          </div>
        )}

        {/* Networks Section */}
        {stats && stats.networks && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📊 Программ по сетям
            </h2>
            <div className="space-y-4">
              {stats.networks.map((network: any) => (
                <div key={network.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {network.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{network.name}</div>
                      <div className="text-sm text-gray-500">Партнерская сеть</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {network.programs.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">программ</div>
                  </div>
                </div>
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
            <h3 className="text-xl font-semibold mb-2">Актуальные данные</h3>
            <p className="text-gray-600">
              База из 80,000+ программ обновляется регулярно
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">Для бизнеса</h3>
            <p className="text-gray-600">
              Multi-tenant система с ролевым доступом
            </p>
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
          <a
            href="/api/health"
            target="_blank"
            className="text-blue-600 hover:underline text-sm"
          >
            Health Check
          </a>
        </div>
      </div>
    </main>
  );
}
