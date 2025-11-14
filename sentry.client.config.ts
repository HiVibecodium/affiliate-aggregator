import * as Sentry from '@sentry/nextjs';

// Only initialize Sentry in production and if DSN is available
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

if (IS_PRODUCTION && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Performance Monitoring - reduced sample rate for bundle size
    tracesSampleRate: 0.05, // 5% of transactions for performance

    // Session Replay - lazy loaded
    replaysSessionSampleRate: 0.05, // 5% of sessions (reduced from 10%)
    replaysOnErrorSampleRate: 0.5, // 50% of error sessions (reduced from 100%)

    // Environment
    environment: 'production',

    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

    // Debugging - always false in production
    debug: false,

    // Error filtering
    beforeSend(event, hint) {
      // Filter out known issues
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message);

        // Ignore network errors from ad blockers
        if (message.includes('Load failed') || message.includes('NetworkError')) {
          return null;
        }

        // Ignore Supabase connection issues
        if (message.includes('supabase') && message.includes('timeout')) {
          return null;
        }
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      'top.GLOBALS',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'cancelled', // React 18 cancellation
      'ChunkLoadError', // Code splitting errors
    ],

    // Minimal integrations for smaller bundle
    integrations: [
      // Lazy load replay integration
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
        // Reduce memory usage
        stickySession: false,
      }),
    ],

    // Transport options for better performance
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
  });
}
