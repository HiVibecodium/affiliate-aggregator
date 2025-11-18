'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/loading-skeleton';

interface AnalyticsWidgetProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  footer?: React.ReactNode;
}

export function AnalyticsWidget({
  title,
  value,
  change,
  changeLabel,
  icon,
  loading = false,
  trend,
  footer,
}: AnalyticsWidgetProps) {
  if (loading) {
    return (
      <div className="card-base p-6">
        <Skeleton variant="text" width="60%" height="1rem" />
        <Skeleton variant="text" width="80%" height="2rem" className="mt-2" />
        <Skeleton variant="text" width="40%" height="0.875rem" className="mt-2" />
      </div>
    );
  }

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div className="card-base p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold text-primary">{value}</p>
          {change !== undefined && (
            <div
              className={`mt-2 flex items-center gap-1 text-sm ${trendColors[trend || 'neutral']}`}
            >
              {trend && trendIcons[trend]}
              <span className="font-medium">
                {change > 0 ? '+' : ''}
                {change}%
              </span>
              {changeLabel && <span className="text-muted ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
            {icon}
          </div>
        )}
      </div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">{footer}</div>
      )}
    </div>
  );
}

interface ChartWidgetProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  actions?: React.ReactNode;
}

export function ChartWidget({ title, children, loading = false, actions }: ChartWidgetProps) {
  if (loading) {
    return (
      <div className="card-base p-6">
        <Skeleton variant="text" width="40%" height="1.5rem" />
        <div className="mt-4 space-y-2">
          <Skeleton variant="rectangular" width="100%" height="200px" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-base p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function MetricCard({ label, value, subValue, color = 'blue' }: MetricCardProps) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className={`rounded-lg p-4 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subValue && <p className="mt-1 text-xs opacity-70">{subValue}</p>}
    </div>
  );
}
