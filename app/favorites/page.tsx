'use client';
import { logger } from '@/lib/logger';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SwipeableCard } from '@/components/SwipeableCard';
import { ProgramListSkeleton } from '@/components/MobileSkeletons';
import { ScrollToTopFAB } from '@/components/FloatingActionButton';

interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  commissionRate: number;
  commissionType: string;
  cookieDuration: number;
  paymentThreshold: number;
  network: {
    name: string;
    website: string;
  };
}

interface Favorite {
  id: string;
  programId: string;
  createdAt: string;
  program: Program;
}

export default function FavoritesPage() {
  const t = useTranslations('favorites');
  const common = useTranslations('common');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/favorites');

      if (response.status === 401) {
        setError(t('loginRequired'));
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites);
    } catch (err) {
      setError(common('error'));
      logger.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    if (favorites.length === 0) {
      alert(t('empty'));
      return;
    }

    const headers = ['Name', 'Network', 'Category', 'Commission', 'Type', 'Cookie', 'Min. Payment'];
    const rows = favorites.map((fav) => [
      fav.program.name,
      fav.program.network.name,
      fav.program.category || '',
      `${fav.program.commissionRate}%`,
      fav.program.commissionType || '',
      `${fav.program.cookieDuration}`,
      `$${fav.program.paymentThreshold}`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `favorites-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function removeFavorite(programId: string) {
    if (removingId) return;

    setRemovingId(programId);

    try {
      const response = await fetch(`/api/favorites?programId=${programId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.programId !== programId));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove favorite');
      }
    } catch (err) {
      logger.error('Failed to remove favorite:', err);
      alert(common('error'));
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mb-2 inline-block"
            >
              {common('backToHome')}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <ProgramListSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mb-2 inline-block"
            >
              {common('backToHome')}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 text-lg mt-4">{error}</p>
            <Link
              href="/auth/signin"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 touch-target"
            >
              {common('login')}
            </Link>
          </div>
        </div>
      </div>
    );
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
            {common('backToHome')}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {t('title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {favorites.length === 0 ? t('empty') : t('subtitle', { count: favorites.length })}
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors touch-target"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="hidden sm:inline">{common('exportCSV')}</span>
                <span className="sm:hidden">CSV</span>
              </button>
            )}
          </div>
          {/* Mobile swipe hint */}
          {favorites.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 md:hidden">
              {t('swipeHint')}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
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
            <p className="text-gray-500 dark:text-gray-400 text-lg mt-4">{t('empty')}</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">{t('emptyHint')}</p>
            <Link
              href="/programs"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 touch-target"
            >
              {t('goToPrograms')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {favorites.map((favorite) => (
              <SwipeableCard
                key={favorite.id}
                rightActions={[
                  {
                    icon: (
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    ),
                    label: common('delete'),
                    color: 'bg-red-500',
                    onClick: () => removeFavorite(favorite.programId),
                  },
                ]}
                className="rounded-lg overflow-hidden shadow"
              >
                <div className="bg-white dark:bg-gray-800 p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
                        {favorite.program.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 flex-wrap">
                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                          {favorite.program.network.name}
                        </span>
                        {favorite.program.category && (
                          <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
                            {favorite.program.category}
                          </span>
                        )}
                        {favorite.program.commissionType && (
                          <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                            {favorite.program.commissionType}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 hidden md:block">
                        {favorite.program.description}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Добавлено: {new Date(favorite.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    {/* Desktop delete button */}
                    <button
                      onClick={() => removeFavorite(favorite.programId)}
                      disabled={removingId === favorite.programId}
                      className="hidden md:flex ml-4 p-2 rounded-full text-red-500 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Удалить из избранного"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
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

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4 border-t dark:border-gray-700">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Комиссия</div>
                      <div className="font-semibold text-green-600 dark:text-green-400 text-sm md:text-base">
                        {favorite.program.commissionRate}% {favorite.program.commissionType}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cookie</div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                        {favorite.program.cookieDuration} дней
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Мин. выплата
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                        ${favorite.program.paymentThreshold}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <a
                        href={favorite.program.network.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-2 rounded transition-colors touch-target w-full text-center"
                      >
                        Подробнее →
                      </a>
                    </div>
                  </div>
                </div>
              </SwipeableCard>
            ))}
          </div>
        )}
      </div>

      {/* Scroll to top FAB */}
      <ScrollToTopFAB />
    </div>
  );
}
