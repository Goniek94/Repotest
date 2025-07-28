import axios from 'axios';
import vinService from './vinService';
import { getAuthToken } from './api/config';

/**
 * Konfiguracja Axios dla API
 * Zawiera podstawowe ustawienia dla wszystkich zapytań
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  withCredentials: true, // Ważne: wysyłaj cookies z każdym requestem
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor dla requestów - dodaje token JWT jeśli istnieje
api.interceptors.request.use(
  config => {
    const token = getAuthToken(); // Używamy bezpiecznej funkcji z config.js
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor dla odpowiedzi - obsługuje błędy autoryzacji
api.interceptors.response.use(
  response => response,
  error => {
    // Jeśli błąd 401 (Unauthorized), wyloguj użytkownika
    if (error.response && error.response.status === 401) {
      // Sprawdź, czy to nie jest endpoint logowania
      if (!error.config.url.includes('/auth/login')) {
        console.warn('Sesja wygasła. Wylogowywanie...');
        
        // Usuń tylko dane użytkownika z localStorage (nie tokeny - są w cookies)
        localStorage.removeItem('user');
        
        // Wyślij żądanie wylogowania do serwera aby wyczyścić cookies
        fetch('/api/users/logout', {
          method: 'POST',
          credentials: 'include'
        }).catch(() => {
          // Ignoruj błędy wylogowania
        });
        
        // Przekieruj na stronę logowania, jeśli nie jesteśmy już na niej
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session=expired';
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Pobiera historię transakcji użytkownika
 * @param {string} userId - ID użytkownika
 * @returns {Promise} - Promise z danymi
 */
export const getTransactionHistory = async (userId) => {
  try {
    const response = await api.get(`/transactions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania historii transakcji:', error);
    return [];
  }
};

/**
 * Odrzuca powiadomienie
 * @param {string} notificationId - ID powiadomienia
 * @returns {Promise} - Promise z wynikiem operacji
 */
export const dismissNotification = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/dismiss`);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas odrzucania powiadomienia:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Pobiera dane panelu użytkownika
 * @param {string} userId - ID użytkownika
 * @returns {Promise} - Promise z danymi
 */
export const getUserDashboard = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania danych panelu użytkownika:', error);
    return null;
  }
};

/**
 * Pobiera ogłoszenie
 * @param {string} listingId - ID ogłoszenia
 * @returns {Promise} - Promise z danymi
 */
export const getListing = async (listingId) => {
  try {
    const response = await api.get(`/ads/${listingId}`);
    return response.data;
  } catch (error) {
   console.error('Błąd podczas pobierania ogłoszenia:', error);
    return null;
  }
};

/**
 * Pobiera dane pojazdu na podstawie numeru VIN
 * @param {string} vin - 17-znakowy numer VIN
 * @returns {Promise} - Promise z danymi pojazdu
 */
export const getVehicleDataByVin = async (vin) => {
  try {
    // Najpierw próbujemy pobrać dane z API
    const response = await api.get(`/vehicle/vin/${vin}`);
    return response.data;
  } catch (error) {
    console.log('Błąd API, używam lokalnego serwisu VIN:', error);
    // Jeśli API nie odpowiada, używamy lokalnego serwisu
    try {
      const data = await vinService.lookupVin(vin);
      return { success: true, data };
    } catch (vinError) {
      console.error('Błąd podczas pobierania danych VIN:', vinError);
      return { success: false, error: vinError.message };
    }
  }
};

export default api;
