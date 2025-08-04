// Centralna konfiguracja API
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const API_URL = baseUrl; // Nie dodajemy /api tutaj, bo będzie w endpointach
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

/**
 * BEZPIECZNE ZARZĄDZANIE TOKENAMI - TYLKO COOKIES
 * Usunięto localStorage dla tokenów ze względów bezpieczeństwa
 */

// Token uwierzytelniający - TYLKO z cookies (bezpieczne)
export const getAuthToken = () => {
  // HttpOnly cookies nie są dostępne z JavaScript - to jest DOBRE dla bezpieczeństwa
  // Backend automatycznie otrzyma cookies w każdym żądaniu
  // Nie próbujemy czytać tokenów z JavaScript - to luka bezpieczeństwa
  return null; // Zawsze null - tokeny są w HttpOnly cookies
};

// Zapisywanie danych użytkownika - TYLKO podstawowe dane, BEZ tokenów
export const setAuthData = (user) => {
  // Zapisujemy tylko podstawowe dane użytkownika (nie tokeny!)
  // Tokeny są zarządzane przez HttpOnly cookies po stronie serwera
  if (user) {
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Nie zapisujemy tokenów ani wrażliwych danych
    }));
  }
};

// Czyszczenie danych autoryzacyjnych
export const clearAuthData = () => {
  // Usuwamy dane lokalne
  localStorage.removeItem('user');
  
  // WAŻNE: Tokeny w HttpOnly cookies są automatycznie usuwane przez serwer
  // podczas wylogowania - nie możemy ich usunąć z JavaScript (to dobrze!)
  
  // Wyślij żądanie wylogowania do serwera aby wyczyścić HttpOnly cookies
  return fetch(`${API_URL}/users/logout`, {
    method: 'POST',
    credentials: 'include' // KRYTYCZNE: wysyłaj cookies
  }).catch(err => {
    console.warn('Błąd podczas wylogowania:', err);
  });
};

// Pobieranie danych użytkownika
export const getUserData = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.warn('Błąd podczas odczytu danych użytkownika:', e);
    localStorage.removeItem('user');
    return null;
  }
};

// Sprawdzanie czy użytkownik jest zalogowany
export const isAuthenticated = async () => {
  // Nie możemy sprawdzić HttpOnly cookies z JavaScript
  // Musimy sprawdzić przez API call do serwera
  try {
    const response = await fetch(`${API_URL}/users/check-auth`, {
      method: 'GET',
      credentials: 'include', // Ważne: wysyłaj cookies
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      // Zaktualizuj dane użytkownika w localStorage
      if (userData.user) {
        setAuthData(userData.user);
        return true;
      }
    }
    
    // Jeśli nie można pobrać danych, wyczyść lokalne dane
    clearAuthData();
    return false;
  } catch (error) {
    console.warn('Błąd podczas sprawdzania autoryzacji:', error);
    clearAuthData();
    return false;
  }
};

// Synchroniczna wersja sprawdzania (tylko na podstawie localStorage)
export const isAuthenticatedSync = () => {
  const user = getUserData();
  return !!user;
};

// Funkcja pomocnicza do odświeżania danych użytkownika
export const refreshUserData = async () => {
  try {
    const response = await fetch(`${API_URL}/users/check-auth`, {
      method: 'GET',
      credentials: 'include', // Ważne: wysyłaj cookies
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      setAuthData(userData.user);
      return userData.user;
    } else {
      // Jeśli nie można pobrać danych, wyczyść lokalne dane
      clearAuthData();
      return null;
    }
  } catch (error) {
    console.warn('Błąd podczas odświeżania danych użytkownika:', error);
    return null;
  }
};

/**
 * MIGRACJA Z LOCALSTORAGE - funkcja jednorazowa
 * Usuwa stare tokeny z localStorage jeśli istnieją
 */
export const migrateFromLocalStorage = () => {
  // Sprawdź czy istnieją stare tokeny w localStorage
  const oldToken = localStorage.getItem('token');
  const oldRefreshToken = localStorage.getItem('refreshToken');
  
  if (oldToken || oldRefreshToken) {
    console.warn('🔒 MIGRACJA BEZPIECZEŃSTWA: Usuwam stare tokeny z localStorage');
    
    // Usuń stare tokeny
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Wyloguj użytkownika dla bezpieczeństwa
    clearAuthData();
    
    console.log('✅ Stare tokeny zostały usunięte. Zaloguj się ponownie.');
    
    // Opcjonalnie: przekieruj na stronę logowania
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?migrated=true';
    }
  }
};

// Uruchom migrację przy załadowaniu modułu
migrateFromLocalStorage();
