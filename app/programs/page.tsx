'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useComparison } from '@/contexts/ComparisonContext';

interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  commissionRate: number;
  commissionType: string;
  cookieDuration: number;
  paymentThreshold: number;
  paymentMethods: string[];
  network: {
    name: string;
    website: string;
  };
}

interface Stats {
  totalPrograms: number;
  totalNetworks: number;
  networks: { name: string; programs: number }[];
}

interface Filters {
  categories: { value: string; count: number }[];
  commissionTypes: { value: string; count: number }[];
  commissionRange: { min: number; max: number };
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Comparison hook
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();

  // Initialize filter states from URL params
  const getInitialFilterValue = (param: string) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get(param) || '';
    }
    return '';
  };

  // Filter states
  const [search, setSearch] = useState(() => getInitialFilterValue('search'));
  const [selectedNetwork, setSelectedNetwork] = useState(() => getInitialFilterValue('network'));
  const [selectedCategory, setSelectedCategory] = useState(() => getInitialFilterValue('category'));
  const [selectedCommissionType, setSelectedCommissionType] = useState(() =>
    getInitialFilterValue('commissionType')
  );
  const [minCommission, setMinCommission] = useState(() => getInitialFilterValue('minCommission'));
  const [maxCommission, setMaxCommission] = useState(() => getInitialFilterValue('maxCommission'));

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchFilters(); // Initial load
    fetchFavorites();
  }, []);

  // Refetch filters when network, category, or commissionType changes (cascading filters)
  useEffect(() => {
    // Skip initial run (already called above)
    if (selectedNetwork || selectedCategory || selectedCommissionType) {
      fetchFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNetwork, selectedCategory, selectedCommissionType]);

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedNetwork,
    selectedCategory,
    selectedCommissionType,
    search,
    minCommission,
    maxCommission,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  async function fetchStats() {
    try {
      const response = await fetch('/api/programs/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }

  async function fetchFilters() {
    try {
      // Build query params for cascading filters
      const params = new URLSearchParams();
      if (selectedNetwork) params.set('network', selectedNetwork);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedCommissionType) params.set('commissionType', selectedCommissionType);

      const url = params.toString() ? `/api/programs/filters?${params}` : '/api/programs/filters';

      const response = await fetch(url);
      const data = await response.json();
      setFilters(data);
    } catch (error) {
      console.error('Failed to fetch filters:', error);
    }
  }

  async function fetchFavorites() {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        const favoriteIds = new Set<string>(
          data.favorites.map((fav: any) => fav.programId as string)
        );
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  }

  async function toggleFavorite(programId: string) {
    if (favoritesLoading) return;

    const isFavorited = favorites.has(programId);
    setFavoritesLoading(true);

    try {
      if (isFavorited) {
        const response = await fetch(`/api/favorites?programId=${programId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFavorites((prev) => {
            const newSet = new Set(prev);
            newSet.delete(programId);
            return newSet;
          });
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to remove favorite');
        }
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ programId }),
        });

        if (response.ok) {
          setFavorites((prev) => new Set([...prev, programId]));
        } else {
          const error = await response.json();
          if (response.status === 401) {
            alert('Пожалуйста, войдите в систему, чтобы добавить в избранное');
          } else {
            alert(error.error || 'Failed to add favorite');
          }
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('Произошла ошибка. Попробуйте снова.');
    } finally {
      setFavoritesLoading(false);
    }
  }

  function toggleComparison(program: Program) {
    if (isInComparison(program.id)) {
      removeFromComparison(program.id);
    } else {
      addToComparison(program);
    }
  }

  async function fetchPrograms() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy,
        sortOrder,
        ...(selectedNetwork && { network: selectedNetwork }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedCommissionType && { commissionType: selectedCommissionType }),
        ...(search && { search }),
        ...(minCommission && { minCommission }),
        ...(maxCommission && { maxCommission }),
      });

      const response = await fetch(`/api/programs?${params}`);
      const data = await response.json();

      setPrograms(data.programs);
      setTotalPages(data.pagination.totalPages);

      // Update stats with filtered count
      if (stats) {
        setStats({
          ...stats,
          totalPrograms: data.pagination.total,
        });
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedNetwork('');
    setSelectedCategory('');
    setSelectedCommissionType('');
    setMinCommission('');
    setMaxCommission('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    search,
    selectedNetwork,
    selectedCategory,
    selectedCommissionType,
    minCommission,
    maxCommission,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
              >
                ← Назад на главную
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Партнерские программы</h1>
              <p className="text-gray-600 mt-1">
                {stats?.totalPrograms.toLocaleString() || '0'} программ от{' '}
                {stats?.totalNetworks || '0'} сетей
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Фильтры</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Сбросить ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Поиск по названию
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Введите название..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Network filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Партнерская сеть
                </label>
                <select
                  value={selectedNetwork}
                  onChange={(e) => {
                    setSelectedNetwork(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все сети</option>
                  {stats?.networks.map((network) => (
                    <option key={network.name} value={network.name}>
                      {network.name} ({network.programs.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Категория</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все категории</option>
                  {filters?.categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.value} ({cat.count.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Commission type filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Тип комиссии
                </label>
                <select
                  value={selectedCommissionType}
                  onChange={(e) => {
                    setSelectedCommissionType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все типы</option>
                  {filters?.commissionTypes.map((ct) => (
                    <option key={ct.value} value={ct.value}>
                      {ct.value} ({ct.count.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Commission range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Диапазон комиссии (%)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minCommission}
                    onChange={(e) => {
                      setMinCommission(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="От"
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={maxCommission}
                    onChange={(e) => {
                      setMaxCommission(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="До"
                    max={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {filters && (
                  <p className="text-xs text-gray-500 mt-1">
                    Доступно: {filters.commissionRange.min}% - {filters.commissionRange.max}%
                  </p>
                )}
              </div>

              {/* Quick stats */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Статистика</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Всего программ:</span>
                    <span className="font-semibold">{stats?.totalPrograms.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Сетей:</span>
                    <span className="font-semibold">{stats?.totalNetworks}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Programs list */}
          <div className="lg:col-span-3">
            {/* Sorting controls */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Сортировать:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="createdAt">По дате добавления</option>
                    <option value="commission">По комиссии</option>
                    <option value="name">По названию</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    {sortOrder === 'asc' ? '↑ По возрастанию' : '↓ По убыванию'}
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Найдено программ: {stats?.totalPrograms.toLocaleString()}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Загрузка программ...</p>
              </div>
            ) : programs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500 text-lg">Программы не найдены</p>
                <p className="text-gray-400 text-sm mt-2">
                  Попробуйте изменить параметры фильтрации
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 mb-8">
                  {programs.map((program) => (
                    <div
                      key={program.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {program.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 flex-wrap">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {program.network.name}
                            </span>
                            {program.category && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                {program.category}
                              </span>
                            )}
                            {program.commissionType && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                {program.commissionType}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {program.description}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => toggleComparison(program)}
                            className={`p-2 rounded-full transition-all ${
                              isInComparison(program.id)
                                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                            title={
                              isInComparison(program.id)
                                ? 'Убрать из сравнения'
                                : 'Добавить к сравнению'
                            }
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => toggleFavorite(program.id)}
                            disabled={favoritesLoading}
                            className={`p-2 rounded-full transition-all ${
                              favorites.has(program.id)
                                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-500'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={
                              favorites.has(program.id)
                                ? 'Удалить из избранного'
                                : 'Добавить в избранное'
                            }
                          >
                            <svg
                              className="w-6 h-6"
                              fill={favorites.has(program.id) ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Комиссия</div>
                          <div className="font-semibold text-green-600">
                            {program.commissionRate}% {program.commissionType}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Cookie</div>
                          <div className="font-semibold">{program.cookieDuration} дней</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Мин. выплата</div>
                          <div className="font-semibold">${program.paymentThreshold}</div>
                        </div>
                        <div>
                          <a
                            href={program.network.website || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
                          >
                            Подробнее →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      ← Назад
                    </button>
                    <div className="flex items-center gap-2">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'border hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      {totalPages > 5 && <span className="px-2">...</span>}
                    </div>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Вперед →
                    </button>
                  </div>
                )}

                {/* Page info */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  Страница {currentPage} из {totalPages.toLocaleString()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
