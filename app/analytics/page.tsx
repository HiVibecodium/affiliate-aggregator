'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PopularProgram {
  id: string;
  name: string;
  network: string;
  category: string;
  commissionRate: number;
  clicks: number;
}

export default function AnalyticsPage() {
  const [popularPrograms, setPopularPrograms] = useState<PopularProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularPrograms();
  }, []);

  async function fetchPopularPrograms() {
    try {
      const response = await fetch('/api/analytics/popular');
      const data = await response.json();
      setPopularPrograms(data.popular);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Назад на главную
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600 mt-1">Популярные программы и тренды</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Popular Programs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 Самые популярные программы</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Загрузка аналитики...</p>
            </div>
          ) : popularPrograms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Пока нет данных по кликам</p>
              <p className="text-sm text-gray-400 mt-2">
                Начните просматривать программы, чтобы увидеть статистику
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {popularPrograms.map((program, index) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? 'bg-yellow-500'
                          : index === 1
                            ? 'bg-gray-400'
                            : index === 2
                              ? 'bg-orange-600'
                              : 'bg-blue-500'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    {/* Program Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{program.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{program.network}</span>
                        <span>•</span>
                        <span>{program.category}</span>
                        <span>•</span>
                        <span className="text-green-600 font-semibold">
                          {program.commissionRate}%
                        </span>
                      </div>
                    </div>

                    {/* Clicks Count */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{program.clicks}</div>
                      <div className="text-xs text-gray-500">кликов</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Всего кликов</div>
            <div className="text-3xl font-bold text-gray-900">
              {popularPrograms.reduce((sum, p) => sum + p.clicks, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Отслеживаемых программ</div>
            <div className="text-3xl font-bold text-gray-900">{popularPrograms.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Средний CTR</div>
            <div className="text-3xl font-bold text-gray-900">
              {popularPrograms.length > 0
                ? Math.round(
                    popularPrograms.reduce((sum, p) => sum + p.clicks, 0) / popularPrograms.length
                  )
                : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
