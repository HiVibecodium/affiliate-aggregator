/**
 * Tour Button Component
 *
 * Trigger button for welcome tour
 */

'use client';

import { useTour } from '@/hooks/useTour';

export function TourButton() {
  const { startTour } = useTour();

  return (
    <button
      onClick={startTour}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
      title="Запустить обучающий тур"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Показать тур</span>
    </button>
  );
}
