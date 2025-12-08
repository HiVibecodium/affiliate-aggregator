'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: 'default' | 'compact' | 'card';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
}: EmptyStateProps) {
  const sizes = {
    default: 'py-16 px-8',
    compact: 'py-8 px-6',
    card: 'py-12 px-8',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${sizes[variant]} ${
        variant === 'card' ? 'bg-white dark:bg-gray-800 rounded-xl shadow-lg' : ''
      }`}
    >
      {icon && (
        <div className="mb-4 text-gray-400 dark:text-gray-500 animate-page-enter">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap gap-3 justify-center">
          {action && (
            <>
              {action.href ? (
                <Link
                  href={action.href}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors touch-target haptic-feedback"
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  onClick={action.onClick}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors touch-target haptic-feedback"
                >
                  {action.label}
                </button>
              )}
            </>
          )}
          {secondaryAction && (
            <>
              {secondaryAction.href ? (
                <Link
                  href={secondaryAction.href}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target haptic-feedback"
                >
                  {secondaryAction.label}
                </Link>
              ) : (
                <button
                  onClick={secondaryAction.onClick}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target haptic-feedback"
                >
                  {secondaryAction.label}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-built empty state variants
export function NoResultsEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="Ничего не найдено"
      description="Попробуйте изменить параметры поиска или сбросить фильтры"
      action={onReset ? { label: 'Сбросить фильтры', onClick: onReset } : undefined}
      variant="card"
    />
  );
}

export function NoFavoritesEmptyState() {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      }
      title="Нет избранных программ"
      description="Добавляйте программы в избранное, чтобы быстро к ним возвращаться"
      action={{ label: 'Смотреть программы', href: '/programs' }}
      variant="card"
    />
  );
}

export function NoComparisonEmptyState() {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      }
      title="Нет программ для сравнения"
      description="Добавьте минимум 2 программы для сравнения характеристик"
      action={{ label: 'Добавить программы', href: '/programs' }}
      variant="card"
    />
  );
}

export function ErrorEmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
      title="Что-то пошло не так"
      description="Произошла ошибка при загрузке данных. Попробуйте обновить страницу."
      action={onRetry ? { label: 'Попробовать снова', onClick: onRetry } : undefined}
      secondaryAction={{ label: 'На главную', href: '/' }}
      variant="card"
    />
  );
}

export function NoApplicationsEmptyState() {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
      title="Нет заявок"
      description="Вы ещё не подавали заявки на партнёрские программы"
      action={{ label: 'Найти программу', href: '/programs' }}
      variant="card"
    />
  );
}

export function ComingSoonEmptyState({ feature }: { feature: string }) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      }
      title="Скоро будет!"
      description={`${feature} находится в разработке и скоро появится`}
      action={{ label: 'Узнать больше', href: '/blog' }}
      variant="card"
    />
  );
}
