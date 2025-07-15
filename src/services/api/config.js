// Centralna konfiguracja API
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const API_URL = baseUrl; // Usunięto dodawanie '/api' - będzie dodawane przez serwer
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10); // domyślnie 30 sekund

// Konfiguracja cache
export const CACHE_TTL = parseInt(process.env.REACT_APP_CACHE_TTL || '3600000', 10); // domyślnie 1 godzina
export const TOKEN_EXPIRY = parseInt(process.env.REACT_APP_TOKEN_EXPIRY || '86400000', 10); // domyślnie 24 godziny

// Konfiguracja retry i throttling
export const MAX_RETRIES = parseInt(process.env.REACT_APP_MAX_RETRIES || '3', 10);
export const THROTTLE_REQUESTS = process.env.REACT_APP_THROTTLE_REQUESTS === 'true';

// Informacja o środowisku
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEV = process.env.NODE_ENV === 'development';
export const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';
export const DISABLE_CONSOLE = IS_PRODUCTION && process.env.REACT_APP_DISABLE_CONSOLE_IN_PRODUCTION === 'true';

// Token uwierzytelniający przesyłany jest w ciasteczku HttpOnly.
// Jako źródło prawdy traktujemy cookie i nie zapisujemy tokenu w localStorage.
export const getAuthToken = () => {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Zapisywanie danych użytkownika i tokenu
export const setAuthData = (token, user) => {
  // Backend zapisuje token w HttpOnly cookie
  localStorage.setItem('user', JSON.stringify(user));
};

// Czyszczenie danych autoryzacyjnych
export const clearAuthData = () => {
  // Usuwamy dane lokalne
  localStorage.removeItem('user');
};

// Pobieranie danych użytkownika
export const getUserData = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    clearAuthData();
    return null;
  }
};
