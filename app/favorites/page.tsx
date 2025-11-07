'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
        setError('Пожалуйста, войдите в систему, чтобы увидеть избранное');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites);
    } catch (err) {
      setError('Произошла ошибка при загрузке избранного');
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(programId: string) {
    if (removingId) return;

    setRemovingId(programId);

    try {
      const response = await fetch(`/api/favorites?programId=${programId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.programId !== programId));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove favorite');
      }
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      alert('Произошла ошибка. Попробуйте снова.');
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
              ← Назад на главную
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Избранные программы</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Загрузка избранного...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
              ← Назад на главную
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Избранные программы</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow p-12 text-center">
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
            <p className="text-gray-600 text-lg mt-4">{error}</p>
            <Link
              href="/auth/signin"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Войти в систему
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Назад на главную
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Избранные программы
          </h1>
          <p className="text-gray-600 mt-1">
            {favorites.length === 0
              ? 'У вас пока нет избранных программ'
              : `${favorites.length} ${favorites.length === 1 ? 'программа' : favorites.length < 5 ? 'программы' : 'программ'}`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
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
            <p className="text-gray-500 text-lg mt-4">У вас пока нет избранных программ</p>
            <p className="text-gray-400 text-sm mt-2">
              Добавьте программы в избранное, нажав на иконку сердца на странице программ
            </p>
            <Link
              href="/programs"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Перейти к программам
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {favorite.program.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 flex-wrap">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {favorite.program.network.name}
                      </span>
                      {favorite.program.category && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {favorite.program.category}
                        </span>
                      )}
                      {favorite.program.commissionType && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {favorite.program.commissionType}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {favorite.program.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Добавлено: {new Date(favorite.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFavorite(favorite.programId)}
                    disabled={removingId === favorite.programId}
                    className="ml-4 p-2 rounded-full text-red-500 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Комиссия</div>
                    <div className="font-semibold text-green-600">
                      {favorite.program.commissionRate}% {favorite.program.commissionType}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Cookie</div>
                    <div className="font-semibold">
                      {favorite.program.cookieDuration} дней
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Мин. выплата</div>
                    <div className="font-semibold">
                      ${favorite.program.paymentThreshold}
                    </div>
                  </div>
                  <div>
                    <a
                      href={favorite.program.network.website || '#'}
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
        )}
      </div>
    </div>
  );
}
