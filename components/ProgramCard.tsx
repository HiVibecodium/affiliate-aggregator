'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { calculateDifficulty, calculateQuality, isNewProgram } from '@/lib/program-utils';
import { translateCategory } from '@/lib/translations/categories';
import { NetworkLogo } from '@/components/OptimizedImage';

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
  createdAt?: string;
  averageRating?: number | null;
  reviewCount?: number;
  network: {
    name: string;
    website: string;
    logo?: string | null;
  };
}

interface ProgramCardProps {
  program: Program;
  isFavorite: boolean;
  isInComparison: boolean;
  onFavoriteToggle: (programId: string) => void;
  onComparisonToggle: (program: Program) => void;
  onClickTrack: (programId: string) => void;
}

export function ProgramCard({
  program,
  isFavorite,
  isInComparison,
  onFavoriteToggle,
  onComparisonToggle,
  onClickTrack,
}: ProgramCardProps) {
  const difficulty = calculateDifficulty(program);
  const quality = calculateQuality(program);
  const isNew = program.createdAt ? isNewProgram(program.createdAt) : false;

  // Swipe state for mobile actions
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const startX = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = startX.current - e.touches[0].clientX;
    // Only allow left swipe (reveal actions)
    if (diff > 0 && diff < 120) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 60) {
      // Show actions
      setSwipeOffset(100);
      setShowActions(true);
    } else {
      // Reset
      setSwipeOffset(0);
      setShowActions(false);
    }
  };

  const resetSwipe = () => {
    setSwipeOffset(0);
    setShowActions(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Swipe action buttons (revealed on swipe left) - mobile only */}
      <div className="absolute right-0 top-0 bottom-0 flex items-stretch md:hidden">
        <button
          onClick={() => {
            onFavoriteToggle(program.id);
            resetSwipe();
          }}
          className={`w-16 flex items-center justify-center touch-target haptic-feedback ${
            isFavorite ? 'bg-yellow-500' : 'bg-gray-400'
          }`}
        >
          <span className="text-white text-xl">⭐</span>
        </button>
        <button
          onClick={() => {
            onComparisonToggle(program);
            resetSwipe();
          }}
          className={`w-16 flex items-center justify-center touch-target haptic-feedback ${
            isInComparison ? 'bg-blue-600' : 'bg-blue-500'
          }`}
        >
          <span className="text-white text-xl">⚖️</span>
        </button>
      </div>

      {/* Main card content */}
      <div
        ref={cardRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all border-l-4 border-blue-500 relative z-10"
        style={{ transform: `translateX(-${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => showActions && resetSwipe()}
      >
        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
          {isNew && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded">
              🆕 НОВАЯ
            </span>
          )}
          {program.averageRating && program.averageRating > 0 && (
            <span className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold rounded flex items-center gap-1">
              <span>⭐ {program.averageRating.toFixed(1)}</span>
              {program.reviewCount && program.reviewCount > 0 && (
                <span className="text-gray-600 dark:text-gray-400">({program.reviewCount})</span>
              )}
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-semibold rounded ${difficulty.color}`}>
            {difficulty.label}
          </span>
          <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">
            {quality.emoji} {quality.label}
          </span>
        </div>

        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <NetworkLogo
              networkName={program.network.name}
              logoUrl={program.network.logo}
              size="md"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Link
                href={`/programs/${program.id}`}
                onClick={() => onClickTrack(program.id)}
                className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 touch-target"
              >
                {program.name}
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {program.network.name}
              </p>
            </div>
          </div>

          {/* Desktop action buttons - hidden on mobile (swipe instead) */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Favorite button - larger touch target */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(program.id);
              }}
              className={`p-3 rounded-lg transition-colors touch-target haptic-feedback ${
                isFavorite
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 hover:bg-yellow-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={isFavorite ? 'Удалить из избранного' : 'В избранное'}
            >
              ⭐
            </button>

            {/* Compare button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComparisonToggle(program);
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-colors touch-target haptic-feedback ${
                isInComparison
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isInComparison ? '✓ В сравнении' : '+ Сравнить'}
            </button>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
          {program.description}
        </p>

        {/* Stats grid - responsive */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 sm:p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Комиссия</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {program.commissionRate}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{program.commissionType}</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Cookie</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {program.cookieDuration}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">дней</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm flex-wrap gap-2">
            <span className="px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-medium text-xs sm:text-sm">
              {translateCategory(program.category)}
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Мин. выплата: ${program.paymentThreshold.toLocaleString()}
            </span>
          </div>

          {/* Payment methods - horizontal scroll on mobile */}
          {program.paymentMethods && program.paymentMethods.length > 0 && (
            <div className="flex items-center gap-2 text-xs overflow-x-auto scrollbar-hide">
              <span className="text-gray-500 dark:text-gray-500 flex-shrink-0">Оплата:</span>
              <div className="flex gap-1 flex-nowrap">
                {program.paymentMethods.slice(0, 3).map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded whitespace-nowrap"
                    title={method}
                  >
                    {method === 'Bank Transfer' && '🏦'}
                    {method === 'PayPal' && '💳'}
                    {method === 'Direct Deposit' && '💵'}
                    {method === 'Wire Transfer' && '🔄'}
                    {method === 'Check' && '📝'}
                    {method === 'Payoneer' && '💰'}
                    {![
                      'Bank Transfer',
                      'PayPal',
                      'Direct Deposit',
                      'Wire Transfer',
                      'Check',
                      'Payoneer',
                    ].includes(method) && '💳'}{' '}
                    {method}
                  </span>
                ))}
                {program.paymentMethods.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded">
                    +{program.paymentMethods.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile hint - swipe indicator */}
        <div className="sm:hidden mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-400 text-center animate-swipe-hint">
            ← Свайп для действий
          </p>
        </div>
      </div>
    </div>
  );
}
