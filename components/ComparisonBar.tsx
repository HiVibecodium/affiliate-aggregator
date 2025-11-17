'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import Link from 'next/link';

export function ComparisonBar() {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();

  if (comparisonList.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 shadow-2xl z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 overflow-x-auto w-full">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="text-sm sm:text-base font-semibold text-gray-900">
                Сравнение ({comparisonList.length}/5):
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto py-1">
              {comparisonList.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg whitespace-nowrap"
                >
                  <span className="text-sm font-medium text-gray-900">{program.name}</span>
                  <button
                    onClick={() => removeFromComparison(program.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={clearComparison}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Очистить
            </button>
            <Link
              href="/compare"
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl whitespace-nowrap text-center"
            >
              Сравнить →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
