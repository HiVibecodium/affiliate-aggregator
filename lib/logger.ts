/**
 * Production-safe logger
 * Logs only in development or when explicitly enabled
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugEnabled = process.env.ENABLE_DEBUG_LOGS === 'true';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.log(...args);
    }
  },

  error: (...args: unknown[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.error(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.warn(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.info(...args);
    }
  },

  debug: (...args: unknown[]) => {
    if (isDebugEnabled) {
      console.debug(...args);
    }
  },
};
