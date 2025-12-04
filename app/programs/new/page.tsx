'use client';
import { logger } from '@/lib/logger';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EnhancedProgramCard } from '@/components/EnhancedProgramCard';

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

export default function NewProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90' | 'all'>('30');

  useEffect(() => {
    fetchNewPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter]);

  const fetchNewPrograms = async () => {
    setLoading(true);
    try {
      // Calculate date filter
      const daysAgo = timeFilter === 'all' ? 365 : parseInt(timeFilter);
      const dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - daysAgo);

      const response = await fetch(`/api/programs?sortBy=createdAt&sortOrder=desc&limit=50`);
      const data = await response.json();

      // Filter by date on client side (or move to API)
      const filtered = data.programs.filter((p: Program) => {
        const createdDate = new Date(p.createdAt);
        return timeFilter === 'all' || createdDate >= dateFilter;
      });

      setPrograms(filtered);
    } catch (error) {
      logger.error('Failed to fetch new programs:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTimeSinceAdded = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дней назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
    return `${Math.floor(diffDays / 30)} месяцев назад`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🆕 Новые программы</h1>
              <p className="mt-2 text-gray-600">Свежие партнерские программы, добавленные в базу</p>
            </div>
            <Link
              href="/programs"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Все программы
            </Link>
          </div>

          {/* Time filters */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setTimeFilter('7')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeFilter === '7'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Последние 7 дней
            </button>
            <button
              onClick={() => setTimeFilter('30')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeFilter === '30'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Последние 30 дней
            </button>
            <button
              onClick={() => setTimeFilter('90')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeFilter === '90'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Последние 90 дней
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все время
            </button>
          </div>
        </div>
      </div>

      {/* Programs list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Загрузка новых программ...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">Нет новых программ за выбранный период</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Найдено программ: <span className="font-semibold">{programs.length}</span>
            </div>

            <div className="grid gap-4">
              {programs.map((program) => (
                <EnhancedProgramCard
                  key={program.id}
                  program={{
                    ...program,
                    createdAt: new Date(program.createdAt),
                  }}
                  showFavoriteButton={true}
                  showCompareButton={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
