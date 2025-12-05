'use client';

import { useServiceWorkerUpdate } from '@/hooks/usePWA';

export function PWAUpdateNotification() {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorkerUpdate();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-down">
      <div className="bg-blue-600 border border-blue-500 rounded-xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white">Update Available</h3>
            <p className="text-sm text-blue-100 mt-1">
              A new version is ready. Refresh to get the latest features.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={updateServiceWorker}
            className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition-colors"
          >
            Refresh Now
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
