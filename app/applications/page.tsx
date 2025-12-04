'use client';
import { logger } from '@/lib/logger';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  statusUpdatedAt: string;
  applicationUrl?: string;
  affiliateId?: string;
  notes?: string;
  reminderDate?: string;
  totalEarnings?: number;
  totalClicks?: number;
  totalSales?: number;
  program: {
    id: string;
    name: string;
    commissionRate: number;
    commissionType: string;
    category: string;
    network: {
      name: string;
      website: string;
    };
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      logger.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return '✓ Одобрено';
      case 'rejected':
        return '✕ Отказано';
      case 'withdrawn':
        return '⊘ Отозвано';
      default:
        return '⏳ Ожидание';
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">📋 Мои заявки</h1>
          <p className="mt-2 text-gray-600">
            Отслеживайте статус ваших заявок на партнерские программы
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Всего заявок</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <div className="text-sm text-yellow-700">Ожидание</div>
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <div className="text-sm text-green-700">Одобрено</div>
            <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <div className="text-sm text-red-700">Отказано</div>
            <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Все ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ожидание ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Одобрено ({stats.approved})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Отказано ({stats.rejected})
          </button>
        </div>

        {/* Applications list */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Загрузка заявок...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              {filter === 'all'
                ? 'Вы еще не подавали заявок'
                : `Нет заявок со статусом "${getStatusLabel(filter)}"`}
            </p>
            <Link
              href="/programs"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Найти программы →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(app.status)}`}
                      >
                        {getStatusLabel(app.status)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Подано: {new Date(app.appliedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>

                    <Link
                      href={`/programs/${app.program.id}`}
                      className="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
                    >
                      {app.program.name}
                    </Link>

                    <p className="text-sm text-gray-600 mt-1">
                      {app.program.network.name} • {app.program.category} •{' '}
                      {app.program.commissionRate}% {app.program.commissionType}
                    </p>
                  </div>
                </div>

                {/* Application details */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {app.affiliateId && (
                    <div className="bg-blue-50 rounded p-3">
                      <div className="text-xs text-gray-600">Affiliate ID</div>
                      <div className="font-mono text-sm font-semibold">{app.affiliateId}</div>
                    </div>
                  )}
                  {app.totalEarnings !== undefined && app.totalEarnings > 0 && (
                    <div className="bg-green-50 rounded p-3">
                      <div className="text-xs text-gray-600">Заработано</div>
                      <div className="text-lg font-bold text-green-600">
                        ${app.totalEarnings.toFixed(2)}
                      </div>
                    </div>
                  )}
                  {app.totalSales !== undefined && app.totalSales > 0 && (
                    <div className="bg-purple-50 rounded p-3">
                      <div className="text-xs text-gray-600">Продаж</div>
                      <div className="text-lg font-bold text-purple-600">{app.totalSales}</div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {app.notes && (
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <div className="text-xs text-gray-600 mb-1">Заметки:</div>
                    <div className="text-sm text-gray-700">{app.notes}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Link
                    href={`/programs/${app.program.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Открыть программу →
                  </Link>
                  {app.applicationUrl && (
                    <a
                      href={app.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Ссылка на заявку ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
