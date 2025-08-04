/**
 * Debug utility functions for development
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Debug logging function - only logs in development mode
 * @param {...any} args - Arguments to log
 */
export const debug = (...args) => {
  if (isDevelopment) {
    console.log('[DEBUG]', ...args);
  }
};

/**
 * Debug error logging function
 * @param {...any} args - Arguments to log
 */
export const debugError = (...args) => {
  if (isDevelopment) {
    console.error('[DEBUG ERROR]', ...args);
  }
};

/**
 * Debug warning logging function
 * @param {...any} args - Arguments to log
 */
export const debugWarn = (...args) => {
  if (isDevelopment) {
    console.warn('[DEBUG WARN]', ...args);
  }
};

/**
 * Safe console logging - prevents errors in production
 */
export const safeConsole = {
  log: (...args) => {
    if (isDevelopment && typeof console !== 'undefined') {
      console.log('[SAFE]', ...args);
    }
  },
  error: (...args) => {
    if (isDevelopment && typeof console !== 'undefined') {
      console.error('[SAFE ERROR]', ...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment && typeof console !== 'undefined') {
      console.warn('[SAFE WARN]', ...args);
    }
  },
  info: (...args) => {
    if (isDevelopment && typeof console !== 'undefined') {
      console.info('[SAFE INFO]', ...args);
    }
  }
};

const debugUtils = { debug, debugError, debugWarn, safeConsole };
export default debugUtils;
