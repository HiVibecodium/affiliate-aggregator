'use client';

import React, { useEffect, useState } from 'react';
import { AnalyticsWidget } from './AnalyticsWidget';

interface RealtimeData {
  activeUsers: number;
  clicksToday: number;
  conversionsToday: number;
  revenueToday: number;
  topPrograms: Array<{
    id: string;
    name: string;
    clicks: number;
    conversions: number;
  }>;
}

export function RealtimeMetrics() {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Initial fetch
    fetchRealtimeData();

    // Setup polling every 30 seconds
    const interval = setInterval(() => {
      fetchRealtimeData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function fetchRealtimeData() {
    try {
      const response = await fetch('/api/analytics/realtime');
      if (response.ok) {
        const newData = await response.json();
        setData(newData);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsWidget title="Active Users" value="..." loading={true} />
        <AnalyticsWidget title="Clicks Today" value="..." loading={true} />
        <AnalyticsWidget title="Conversions Today" value="..." loading={true} />
        <AnalyticsWidget title="Revenue Today" value="..." loading={true} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header with last update time */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Real-Time Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsWidget
          title="Active Users"
          value={data.activeUsers}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          trend="neutral"
        />

        <AnalyticsWidget
          title="Clicks Today"
          value={data.clicksToday.toLocaleString()}
          change={12.5}
          changeLabel="vs yesterday"
          trend="up"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          }
        />

        <AnalyticsWidget
          title="Conversions Today"
          value={data.conversionsToday.toLocaleString()}
          change={8.2}
          changeLabel="vs yesterday"
          trend="up"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <AnalyticsWidget
          title="Revenue Today"
          value={`$${data.revenueToday.toLocaleString()}`}
          change={15.3}
          changeLabel="vs yesterday"
          trend="up"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Top performing programs */}
      {data.topPrograms && data.topPrograms.length > 0 && (
        <div className="card-base p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Top Performing Programs (Today)
          </h3>
          <div className="space-y-3">
            {data.topPrograms.slice(0, 5).map((program, index) => (
              <div
                key={program.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{program.name}</p>
                    <p className="text-sm text-muted">
                      {program.clicks} clicks · {program.conversions} conversions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    {program.conversions > 0
                      ? `${((program.conversions / program.clicks) * 100).toFixed(1)}% CVR`
                      : '0% CVR'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
