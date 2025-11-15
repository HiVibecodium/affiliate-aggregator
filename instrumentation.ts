export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

/**
 * Handle errors from nested React Server Components
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#errors-from-nested-react-server-components
 */
export async function onRequestError(
  err: unknown,
  request: {
    method: string;
    path: string;
    headers: Headers;
  }
) {
  // Import Sentry only when needed
  const Sentry = await import('@sentry/nextjs');

  // Capture the error with request context
  Sentry.captureException(err, {
    contexts: {
      request: {
        method: request.method,
        path: request.path,
        headers: Object.fromEntries(request.headers.entries()),
      },
    },
  });
}
