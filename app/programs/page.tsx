'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useComparison } from '@/contexts/ComparisonContext';
import { EnhancedProgramCard } from '@/components/EnhancedProgramCard';
import { SearchSuggestions } from '@/components/SearchSuggestions';
import { TourButton } from '@/components/TourButton';
import { useTour } from '@/hooks/useTour';
import { calculateDifficulty } from '@/lib/program-utils';

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
  createdAt: string;
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
  countries: { value: string; count: number }[];
  commissionRange: { min: number; max: number };
}

function ProgramsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Comparison hook
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();

  // Tour hook
  const { startTour, shouldShowTour } = useTour();

  // Filter states - initialized from URL params
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCommissionType, setSelectedCommissionType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [minCommission, setMinCommission] = useState('');
  const [maxCommission, setMaxCommission] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [minCookieDuration, setMinCookieDuration] = useState('');
  const [maxCookieDuration, setMaxCookieDuration] = useState('');
  const [minPaymentThreshold, setMinPaymentThreshold] = useState('');
  const [maxPaymentThreshold, setMaxPaymentThreshold] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [hasReviews, setHasReviews] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState('');

  // Initialize from URL params on client side
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedNetwork(searchParams.get('network') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedCommissionType(searchParams.get('commissionType') || '');
    setSelectedCountry(searchParams.get('country') || '');
    setMinCommission(searchParams.get('minCommission') || '');
    setMaxCommission(searchParams.get('maxCommission') || '');
    setSelectedPaymentMethod(searchParams.get('paymentMethod') || '');
    setMinCookieDuration(searchParams.get('minCookieDuration') || '');
    setMaxCookieDuration(searchParams.get('maxCookieDuration') || '');
    setMinPaymentThreshold(searchParams.get('minPaymentThreshold') || '');
    setMaxPaymentThreshold(searchParams.get('maxPaymentThreshold') || '');
  }, [searchParams]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Auto-start tour for new users
  useEffect(() => {
    if (shouldShowTour() && stats && programs.length > 0) {
      // Delay to ensure UI is ready
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stats, programs, shouldShowTour, startTour]);

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

  async function trackClick(programId: string) {
    try {
      await fetch('/api/track/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId }),
      });
    } catch (error) {
      // Silent fail - tracking shouldn't break UX
      console.error('Failed to track click:', error);
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
        ...(selectedCountry && { country: selectedCountry }),
        ...(search && { search }),
        ...(minCommission && { minCommission }),
        ...(maxCommission && { maxCommission }),
        ...(selectedPaymentMethod && { paymentMethod: selectedPaymentMethod }),
        ...(minCookieDuration && { minCookieDuration }),
        ...(maxCookieDuration && { maxCookieDuration }),
        ...(minPaymentThreshold && { minPaymentThreshold }),
        ...(maxPaymentThreshold && { maxPaymentThreshold }),
        ...(hasReviews && { hasReviews: 'true' }),
        ...(paymentFrequency && { paymentFrequency }),
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

  // Update URL when filters change
  const updateURL = () => {
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (selectedNetwork) params.set('network', selectedNetwork);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCommissionType) params.set('commissionType', selectedCommissionType);
    if (selectedCountry) params.set('country', selectedCountry);
    if (minCommission) params.set('minCommission', minCommission);
    if (maxCommission) params.set('maxCommission', maxCommission);
    if (selectedPaymentMethod) params.set('paymentMethod', selectedPaymentMethod);
    if (minCookieDuration) params.set('minCookieDuration', minCookieDuration);
    if (maxCookieDuration) params.set('maxCookieDuration', maxCookieDuration);
    if (minPaymentThreshold) params.set('minPaymentThreshold', minPaymentThreshold);
    if (maxPaymentThreshold) params.set('maxPaymentThreshold', maxPaymentThreshold);
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newURL = params.toString() ? `/programs?${params}` : '/programs';
    router.push(newURL, { scroll: false });
  };

  // Sync filters to URL
  useEffect(() => {
    updateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedNetwork,
    selectedCategory,
    selectedCommissionType,
    selectedCountry,
    search,
    minCommission,
    maxCommission,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setShowSuggestions(value.length >= 2);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedNetwork('');
    setSelectedCategory('');
    setSelectedCommissionType('');
    setSelectedCountry('');
    setMinCommission('');
    setMaxCommission('');
    setSelectedPaymentMethod('');
    setMinCookieDuration('');
    setMaxCookieDuration('');
    setMinPaymentThreshold('');
    setMaxPaymentThreshold('');
    setSelectedDifficulty([]);
    setHasReviews(false);
    setPaymentFrequency('');
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
    selectedDifficulty.length > 0,
    hasReviews,
    paymentFrequency,
  ].filter(Boolean).length;

  // Client-side difficulty filtering
  const filteredPrograms = useMemo(() => {
    if (selectedDifficulty.length === 0) return programs;

    return programs.filter((program) => {
      const difficulty = calculateDifficulty({
        paymentThreshold: program.paymentThreshold,
        commissionRate: program.commissionRate,
        cookieDuration: program.cookieDuration,
      });
      return selectedDifficulty.includes(difficulty.level);
    });
  }, [programs, selectedDifficulty]);

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
            <TourButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-lg shadow p-6 sticky top-4 space-y-6"
              data-tour="filters"
            >
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
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Поиск по названию
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                  placeholder="Введите название..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showSuggestions && (
                  <SearchSuggestions
                    query={search}
                    onSelect={(suggestion) => {
                      router.push(`/programs/${suggestion.id}`);
                    }}
                    onClose={() => setShowSuggestions(false)}
                  />
                )}
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

              {/* Country filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌍 Страна сети
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все страны</option>
                  {filters?.countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.value} ({country.count} сетей)
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

              {/* Payment Method filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💳 Способ оплаты
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => {
                    setSelectedPaymentMethod(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все способы</option>
                  <option value="PayPal">💳 PayPal</option>
                  <option value="Wire Transfer">🏦 Банковский перевод</option>
                  <option value="Direct Deposit">💰 Прямой депозит</option>
                  <option value="Payoneer">💵 Payoneer</option>
                  <option value="Check">📝 Чек</option>
                  <option value="ACH">🏛️ ACH</option>
                  <option value="Cryptocurrency">₿ Криптовалюта</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Фильтр по доступным методам выплат</p>
              </div>

              {/* Cookie Duration filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🍪 Длительность Cookie (дни)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Мин"
                    value={minCookieDuration}
                    onChange={(e) => {
                      setMinCookieDuration(e.target.value);
                      setCurrentPage(1);
                    }}
                    min={0}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Макс"
                    value={maxCookieDuration}
                    onChange={(e) => {
                      setMaxCookieDuration(e.target.value);
                      setCurrentPage(1);
                    }}
                    max={365}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Популярно: 30, 60, 90, 365 дней</p>
              </div>

              {/* Payment Threshold filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💵 Минимальная выплата ($)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={minPaymentThreshold}
                    onChange={(e) => {
                      setMinPaymentThreshold(e.target.value);
                      setCurrentPage(1);
                    }}
                    min={0}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={maxPaymentThreshold}
                    onChange={(e) => {
                      setMaxPaymentThreshold(e.target.value);
                      setCurrentPage(1);
                    }}
                    max={10000}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Типично: $50, $100, $500</p>
              </div>

              {/* Difficulty Level filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🎯 Сложность входа
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDifficulty.includes('easy')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDifficulty([...selectedDifficulty, 'easy']);
                        } else {
                          setSelectedDifficulty(selectedDifficulty.filter((d) => d !== 'easy'));
                        }
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span className="text-sm">🟢 Легкий старт</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDifficulty.includes('medium')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDifficulty([...selectedDifficulty, 'medium']);
                        } else {
                          setSelectedDifficulty(selectedDifficulty.filter((d) => d !== 'medium'));
                        }
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-yellow-600 rounded"
                    />
                    <span className="text-sm">🟡 Средние требования</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDifficulty.includes('hard')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDifficulty([...selectedDifficulty, 'hard']);
                        } else {
                          setSelectedDifficulty(selectedDifficulty.filter((d) => d !== 'hard'));
                        }
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-sm">🔴 Высокие требования</span>
                  </label>
                </div>
              </div>

              {/* Has Reviews filter */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasReviews}
                    onChange={(e) => {
                      setHasReviews(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      ⭐ Только с отзывами
                    </span>
                    <p className="text-xs text-gray-500">Программы с рейтингами пользователей</p>
                  </div>
                </label>
              </div>

              {/* Payment Frequency filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💵 Частота выплат
                </label>
                <select
                  value={paymentFrequency}
                  onChange={(e) => {
                    setPaymentFrequency(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все</option>
                  <option value="daily">⚡ Daily (Ежедневно)</option>
                  <option value="weekly">📅 Weekly (Еженедельно)</option>
                  <option value="net-15">📆 NET-15 (15 дней)</option>
                  <option value="net-30">📆 NET-30 (30 дней)</option>
                  <option value="monthly">📆 Monthly (Ежемесячно)</option>
                  <option value="net-60">📆 NET-60 (60 дней)</option>
                  <option value="quarterly">📆 Quarterly (Квартально)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Как часто платят комиссии</p>
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
            ) : filteredPrograms.length === 0 ? (
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
                  {filteredPrograms.map((program) => (
                    <EnhancedProgramCard
                      key={program.id}
                      program={{
                        ...program,
                        createdAt: new Date(program.createdAt || Date.now()),
                      }}
                      showFavoriteButton={true}
                      showCompareButton={true}
                    />
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

export default function ProgramsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      }
    >
      <ProgramsContent />
    </Suspense>
  );
}
