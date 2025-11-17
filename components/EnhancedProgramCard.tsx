/**
 * Enhanced Program Card
 *
 * Rich program card with badges, ratings, and detailed info
 */

'use client';

import Link from 'next/link';
import { useComparison } from '@/contexts/ComparisonContext';
import {
  calculateDifficulty,
  isNewProgram,
  formatPaymentMethods,
  formatCookieDuration,
  formatCommissionRate,
  formatPaymentThreshold,
  getQualityBadge,
} from '@/lib/program-badges';

interface Program {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  commissionRate: number | null;
  commissionType: string | null;
  cookieDuration: number | null;
  paymentThreshold: number | null;
  paymentMethods: string[];
  paymentFrequency?: string | null;
  createdAt: Date;
  network: {
    name: string;
  };
}

interface EnhancedProgramCardProps {
  program: Program;
  showFavoriteButton?: boolean;
  showCompareButton?: boolean;
}

// Helper: Get payment frequency display
function getPaymentFrequencyDisplay(
  frequency: string | null | undefined
): { label: string; emoji: string } | null {
  if (!frequency) return null;

  const displays: Record<string, { label: string; emoji: string }> = {
    daily: { label: 'Daily Payouts', emoji: '⚡' },
    weekly: { label: 'Weekly', emoji: '📅' },
    'net-15': { label: 'NET-15', emoji: '📆' },
    'net-30': { label: 'NET-30', emoji: '📆' },
    monthly: { label: 'Monthly', emoji: '📆' },
    'net-60': { label: 'NET-60', emoji: '📆' },
    quarterly: { label: 'Quarterly', emoji: '📆' },
    annual: { label: 'Annual', emoji: '📆' },
  };

  return displays[frequency] || null;
}

export function EnhancedProgramCard({
  program,
  showFavoriteButton = true,
  showCompareButton = true,
}: EnhancedProgramCardProps) {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const difficulty = calculateDifficulty(program);
  const isNew = isNewProgram(program.createdAt);
  const quality = getQualityBadge(program);
  // const paymentFreq = getPaymentFrequencyDisplay(program.paymentFrequency); // Disabled until migration
  const inComparison = isInComparison(program.id);

  const handleCompareToggle = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (inComparison) {
      removeFromComparison(program.id);
    } else {
      const res = await fetch('/api/comparisons/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId: program.id }),
      });

      if (res.status === 403) {
        const data = await res.json();
        if (confirm(data.error + ' Upgrade now?')) {
          window.location.href = '/billing/upgrade';
        }
        return;
      }

      if (res.ok) {
        addToComparison({
          id: program.id,
          name: program.name,
          description: program.description || '',
          category: program.category || '',
          commissionRate: program.commissionRate || 0,
          commissionType: program.commissionType || '',
          cookieDuration: program.cookieDuration || 0,
          paymentThreshold: program.paymentThreshold || 0,
          paymentMethods: program.paymentMethods,
          network: {
            name: program.network.name,
            website: '',
          },
        });
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link href={`/programs/${program.id}`} className="group">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {program.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{program.network.name}</p>
        </div>

        <div className="flex flex-col gap-1 ml-4">
          {isNew && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded whitespace-nowrap">
              🆕 NEW
            </span>
          )}

          {quality && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${quality.color}`}
            >
              ⭐ {quality.label}
            </span>
          )}

          <span
            className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${difficulty.bgColor} ${difficulty.color}`}
            title={difficulty.description}
          >
            {difficulty.level === 'easy' && '🟢'}
            {difficulty.level === 'medium' && '🟡'}
            {difficulty.level === 'hard' && '🔴'} {difficulty.label}
          </span>

          {/* Payment Frequency badge - disabled until migration */}
          {/* {paymentFreq && (
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded whitespace-nowrap">
              {paymentFreq.emoji} {paymentFreq.label}
            </span>
          )} */}
        </div>
      </div>

      {program.description && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {program.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400 mr-2">💰 Commission:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCommissionRate(program.commissionRate, program.commissionType)}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400 mr-2">🍪 Cookie:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCookieDuration(program.cookieDuration)}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400 mr-2">💵 Min Payout:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatPaymentThreshold(program.paymentThreshold)}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400 mr-2">💳 Methods:</span>
          <span
            className="font-semibold text-gray-900 dark:text-white"
            title={program.paymentMethods.join(', ')}
          >
            {formatPaymentMethods(program.paymentMethods)}
          </span>
        </div>
      </div>

      {program.category && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
            {program.category}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <Link
          href={`/programs/${program.id}`}
          className="flex-1 text-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          View Details
        </Link>

        {showFavoriteButton && (
          <button
            onClick={async (e) => {
              e.preventDefault();
              const res = await fetch('/api/favorites', {
                method: 'POST',
                body: JSON.stringify({ programId: program.id }),
              });
              if (res.status === 403) {
                const data = await res.json();
                if (confirm(data.error)) window.location.href = '/billing/upgrade';
              }
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
            title="Add to favorites"
          >
            ❤️
          </button>
        )}

        {showCompareButton && (
          <button
            onClick={handleCompareToggle}
            className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
              inComparison
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            title={inComparison ? 'Remove from compare' : 'Add to compare'}
          >
            ⚖️
          </button>
        )}
      </div>
    </div>
  );
}
