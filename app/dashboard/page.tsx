import Link from 'next/link';
import { getDashboardAnalytics } from '@/lib/dashboard/get-analytics';

export default async function DashboardPage() {
  // Fetch data directly on the server - no client-side loading!
  const analytics = await getDashboardAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                🌐 Affiliate Aggregator
              </Link>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/programs" className="text-gray-600 hover:text-gray-900 font-medium">
                Обзор программ
              </Link>
              <Link href="/programs/new" className="text-gray-600 hover:text-gray-900 font-medium">
                🆕 New Programs
              </Link>
              <Link href="/settings" className="text-gray-600 hover:text-gray-900 font-medium">
                Settings
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Панель аналитики</h1>
          <p className="text-gray-600">Общий обзор партнерских программ и сетей</p>
        </div>

        {/* Overview Cards - Now Clickable! */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/programs"
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase group-hover:text-blue-600 transition-colors">
                  Total Programs
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.overview.totalPrograms.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  → Смотреть все программы
                </p>
              </div>
              <div className="text-4xl group-hover:scale-110 transition-transform">📦</div>
            </div>
          </Link>

          <Link
            href="/programs"
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase group-hover:text-purple-600 transition-colors">
                  Networks
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.overview.totalNetworks}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {analytics.overview.activeNetworks} активных
                </p>
                <p className="text-xs text-purple-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  → Просмотр по сетям
                </p>
              </div>
              <div className="text-4xl group-hover:scale-110 transition-transform">🌐</div>
            </div>
          </Link>

          <Link
            href="/programs?sortBy=commission&sortOrder=desc"
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase group-hover:text-green-600 transition-colors">
                  Avg Commission
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.overview.avgCommission}%
                </p>
                <p className="text-xs text-green-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  → Программы с высокими выплатами
                </p>
              </div>
              <div className="text-4xl group-hover:scale-110 transition-transform">💰</div>
            </div>
          </Link>

          <Link
            href="/programs"
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase group-hover:text-orange-600 transition-colors">
                  Categories
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.programsByCategory.length}
                </p>
                <p className="text-xs text-orange-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  → Просмотр по категориям
                </p>
              </div>
              <div className="text-4xl group-hover:scale-110 transition-transform">🏷️</div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Networks */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">📊 Программы по сетям</h2>
              <Link
                href="/programs"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {analytics.programsByNetwork.slice(0, 6).map((item) => (
                <Link
                  key={item.network}
                  href={`/programs?network=${encodeURIComponent(item.network)}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all cursor-pointer group"
                >
                  <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.network}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.programs / analytics.overview.totalPrograms) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 min-w-[60px] text-right">
                      {item.programs.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Топ категорий */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">🏷️ Топ категорий</h2>
              <Link
                href="/programs"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {analytics.programsByCategory.slice(0, 6).map((item) => (
                <Link
                  key={item.category}
                  href={`/programs?category=${encodeURIComponent(item.category)}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all cursor-pointer group"
                >
                  <span className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / analytics.overview.totalPrograms) * 100 * 10}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 min-w-[60px] text-right">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Commissions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">💎 Высокие комиссии</h2>
              <Link
                href="/programs?sortBy=commission&sortOrder=desc"
                className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {analytics.topCommissions.slice(0, 5).map((program) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {program.name}
                      </h3>
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
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Programs */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">🆕 Недавно добавленные</h2>
              <Link
                href="/programs?sortBy=createdAt&sortOrder=desc"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {analytics.recentPrograms.map((program) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                        {program.name}
                      </h3>
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
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Быстрые действия Panel */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">⚡ Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/programs"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">Обзор программ</h3>
              <p className="text-sm text-white/80">Изучите 80,000+ партнерских программ</p>
            </Link>

            <Link
              href="/favorites"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold mb-1">Избранное</h3>
              <p className="text-sm text-white/80">Просмотр сохраненных программ</p>
            </Link>

            <Link
              href="/compare"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="font-semibold mb-1">Сравнение</h3>
              <p className="text-sm text-white/80">Сравнение программ</p>
            </Link>

            <Link
              href="/analytics"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold mb-1">Аналитика</h3>
              <p className="text-sm text-white/80">Отслеживание показателей</p>
            </Link>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 Статистика платформы</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.programsByCategory.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Активных категорий</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">💼</div>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalNetworks}</p>
              <p className="text-sm text-gray-600 mt-1">Партнерских сетей</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">🌍</div>
              <p className="text-2xl font-bold text-gray-900">Глобально</p>
              <p className="text-sm text-gray-600 mt-1">Мировое покрытие</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
