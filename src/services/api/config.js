// Centralna konfiguracja API
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
export const API_TIMEOUT = 30000; // 30 sekund timeout

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