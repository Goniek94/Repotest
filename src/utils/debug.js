/**
 * Bezpieczne funkcje debugowania i narzędzia konsolowe
 * Zaprojektowane do pracy we wszystkich środowiskach bez błędów
 */

// Sprawdzenie czy jesteśmy w środowisku produkcyjnym
const IS_PRODUCTION = 
  typeof process !== 'undefined' && 
  process.env && 
  process.env.NODE_ENV === 'production';

// Dla ESLint: deklaracja, że używamy zmiennych globalnych
/* global window */

/**
 * Bezpieczna funkcja debugowania - nie wyświetla nic w produkcji
 */
export const debug = (...args) => {
  if (!IS_PRODUCTION) {
    console.log(...args);
  }
};

/**
 * Bezpieczny wrapper konsolowy, który nie wyświetla logów w produkcji
 * Używaj: safeConsole.log(), safeConsole.error(), safeConsole.warn()
 */
export const safeConsole = {
  log: (...args) => {
    if (!IS_PRODUCTION) {
      console.log(...args);
    }
  },
  error: (...args) => {
    // W produkcji możemy przekierować błędy do serwisu monitorowania
    if (IS_PRODUCTION) {
      // W produkcji logujemy tylko pierwszy argument jako string (dla bezpieczeństwa)
      console.error(typeof args[0] === 'string' ? args[0] : 'Błąd aplikacji');
      
      // Tutaj można dodać kod do wysyłania błędów do serwisu monitorowania
      // np. Sentry, LogRocket, itp.
    } else {
      // W środowisku deweloperskim logujemy wszystkie szczegóły
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (!IS_PRODUCTION) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (!IS_PRODUCTION) {
      console.info(...args);
    }
  }
};

// Eksportujemy flagę produkcyjną dla innych modułów
export const isProduction = IS_PRODUCTION;

// Bezpiecznie dołączamy do obiektu window tylko w środowisku przeglądarki
try {
  if (typeof window === 'object') {
    window.debugUtils = { debug, safeConsole };
  }
} catch (err) {
  // Ignorujemy błędy, które mogą wystąpić w niektórych środowiskach
}

// Eksportujemy domyślnie obiekt z wszystkimi narzędziami
export default {
  debug,
  safeConsole,
  isProduction
};
