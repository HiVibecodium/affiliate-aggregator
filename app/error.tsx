'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ошибка
          </h2>
          <p className="text-gray-600 mb-6">
            Произошла ошибка при загрузке этой страницы. Попробуйте обновить страницу.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left mb-6 bg-red-50 p-4 rounded">
              <summary className="cursor-pointer text-sm font-medium text-red-900 mb-2">
                Детали ошибки (dev mode)
              </summary>
              <pre className="text-xs text-red-800 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          {error.digest && (
            <p className="text-xs text-gray-400 mb-6">
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    </div>
  );
}
