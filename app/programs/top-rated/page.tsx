'use client';
import { logger } from '@/lib/logger';

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
  createdAt: string;
  averageRating: number;
  reviewCount: number;
  network: {
    name: string;
    website: string;
  };
}

export default function TopRatedProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [minRating, setMinRating] = useState<number>(4);
  const { addToComparison, isInComparison } = useComparison();

  useEffect(() => {
    fetchTopRated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minRating]);

  const fetchTopRated = async () => {
    setLoading(true);
    try {
      // Fetch all programs with ratings
      const response = await fetch('/api/programs?limit=100&sortBy=createdAt');
      const data = await response.json();

      // Filter by rating and sort
      const filtered = data.programs
        .filter(
          (p: Program) => p.averageRating && p.averageRating >= minRating && p.reviewCount >= 1
        )
        .sort((a: Program, b: Program) => {
          // Sort by rating first, then by review count
          if (b.averageRating !== a.averageRating) {
            return b.averageRating - a.averageRating;
          }
          return b.reviewCount - a.reviewCount;
        });

      setPrograms(filtered);
    } catch (error) {
      logger.error('Failed to fetch top rated programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🏆 Лучшие программы</h1>
              <p className="mt-2 text-gray-600">
                Программы с наивысшими рейтингами от нашего сообщества
              </p>
            </div>
            <Link
              href="/programs"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Все программы
            </Link>
          </div>

          {/* Rating filter */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Минимальный рейтинг:</span>
            <div className="flex gap-2">
              {[5, 4, 3].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    minRating === rating
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {rating}+ ⭐
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Programs grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <p className="mt-4 text-gray-600">Загрузка лучших программ...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">Пока нет программ с рейтингом {minRating}+</p>
            <p className="text-sm text-gray-500 mt-2">
              Попробуйте снизить минимальный рейтинг или напишите первый отзыв!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Найдено программ:{' '}
                <span className="font-semibold text-gray-900">{programs.length}</span>
              </p>
              <p className="text-sm text-gray-500">
                Отсортировано по рейтингу и количеству отзывов
              </p>
            </div>

            <div className="grid gap-6">
              {programs.map((program, index) => (
                <div
                  key={program.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-yellow-500"
                >
                  {/* Ranking badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-yellow-600">#{index + 1}</div>
                      <div className="flex-1">
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(program.averageRating)}
                          <span className="text-lg font-bold text-gray-900">
                            {program.averageRating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-600">
                            ({program.reviewCount} {program.reviewCount === 1 ? 'отзыв' : 'отзывов'}
                            )
                          </span>
                        </div>

                        {/* Program name */}
                        <Link
                          href={`/programs/${program.id}`}
                          className="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
                        >
                          {program.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{program.network.name}</p>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => addToComparison(program)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        isInComparison(program.id)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isInComparison(program.id) ? '✓ В сравнении' : '+ Сравнить'}
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{program.description}</p>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-green-50 rounded p-2 text-center">
                      <div className="text-xs text-gray-600">Комиссия</div>
                      <div className="text-lg font-bold text-green-600">
                        {program.commissionRate}%
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded p-2 text-center">
                      <div className="text-xs text-gray-600">Cookie</div>
                      <div className="text-lg font-bold text-blue-600">
                        {program.cookieDuration}d
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded p-2 text-center">
                      <div className="text-xs text-gray-600">Мин. выплата</div>
                      <div className="text-sm font-bold text-purple-600">
                        ${program.paymentThreshold}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="text-xs text-gray-600">Категория</div>
                      <div className="text-xs font-semibold text-gray-700 truncate">
                        {program.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
