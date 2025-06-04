// Centralna konfiguracja API
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
export const API_TIMEOUT = 30000; // 30 sekund timeout

// UWAGA: Token jest przechowywany w HttpOnly cookie,
// ale również jako fallback w localStorage dla zachowania kompatybilności
export const getAuthToken = () => {
  // Próbujemy pobrać token z localStorage jako fallback
  return localStorage.getItem('token');
};

// Zapisywanie danych użytkownika i tokenu
export const setAuthData = (token, user) => {
  // Zapisujemy token i dane użytkownika
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Czyszczenie danych autoryzacyjnych
export const clearAuthData = () => {
  // Usuwamy dane lokalne
  localStorage.removeItem('token');
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