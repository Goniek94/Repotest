// src/services/api/authApi.js

import apiClient from './client';
import { setAuthData, clearAuthData, getUserData } from './config';
import { debug } from '../../utils/debug';

/**
 * Serwis do obsługi autentykacji i zarządzania kontem użytkownika
 */
const AuthService = {
  /**
   * Logowanie użytkownika
   * @param {string} email - Email użytkownika
   * @param {string} password - Hasło użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      if (response.data.token) {
        // Zapisujemy token i dane użytkownika
        setAuthData(response.data.token, response.data.user);
        debug('Zalogowano pomyślnie, token zapisany');
        
        // Po zalogowaniu czyścimy cache API
        apiClient.clearCache();
      }
      return response.data;
    } catch (error) {
      // Ustandaryzowany obiekt błędu z czytelnym komunikatem
      const errorMessage = error.response?.data?.message || 'Błąd podczas logowania';
      throw new Error(errorMessage);
    }
  },

  /**
   * Rejestracja użytkownika
   * @param {Object} userData - Dane użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users/register', userData);
      if (response.data.token) {
        // Zapisujemy token i dane użytkownika
        setAuthData(response.data.token, response.data.user);
        
        // Po rejestracji czyścimy cache API
        apiClient.clearCache();
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas rejestracji';
      throw new Error(errorMessage);
    }
  },

  /**
   * Wylogowanie użytkownika
   * @returns {Promise} - Promise rozwiązywane po wylogowaniu
   */
  logout: async () => {
    try {
      await apiClient.post('/users/logout');
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    } finally {
      clearAuthData();
      // Czyszczenie cache API przy wylogowaniu
      apiClient.clearCache();
    }
  },

  /**
   * Pobranie aktualnych danych użytkownika z API
   * @param {boolean} forceRefresh - Wymusić odświeżenie z API pomijając cache
   * @returns {Promise} - Promise rozwiązywane danymi użytkownika
   */
  refreshUserData: async (forceRefresh = false) => {
    try {
      // Używamy metody getCached lub get z apiClient
      let response;
      
      if (forceRefresh) {
        // Jeśli wymuszamy odświeżenie, czyscimy cache dla tego endpointu
        apiClient.clearCache('/users/profile');
        response = await apiClient.get('/users/profile');
      } else {
        // W przeciwnym razie korzystamy z cache (TTL 5 minut)
        response = await apiClient.getCached('/users/profile', {}, 300000);
      }
      
      const updatedUser = response.data;
      
      // Aktualizujemy tylko dane użytkownika
      setAuthData(null, updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Błąd podczas odświeżania danych użytkownika:', error);
      // W przypadku błędu, zwracamy lokalne dane użytkownika, jeśli są dostępne
      const localUser = getUserData();
      if (localUser) {
        debug('Używam lokalnych danych użytkownika jako fallback');
        return localUser;
      }
      const errorMessage = error.response?.data?.message || 'Błąd podczas odświeżania danych użytkownika';
      throw new Error(errorMessage);
    }
  },

  /**
   * Sprawdzenie czy użytkownik jest zalogowany
   * @returns {boolean} - Czy użytkownik jest zalogowany
   */
  isAuthenticated: () => !!getUserData(),

  /**
   * Pobranie danych użytkownika z cache lub localStorage
   * @returns {Object|null} - Dane użytkownika lub null
   */
  getCurrentUser: () => {
    // Próbujemy pobrać z cache najpierw, jeśli nie ma to z localStorage
    const cachedUser = apiClient.getCache('/users/profile');
    if (cachedUser) return cachedUser;
    return getUserData();
  },

  /**
   * Sprawdzenie czy użytkownik jest adminem
   * @returns {boolean} - Czy użytkownik jest adminem
   */
  isAdmin: () => {
    const user = AuthService.getCurrentUser();
    return user && user.role === 'admin';
  },

  /**
   * Weryfikacja kodu podczas rejestracji
   * @param {string} email - Email użytkownika
   * @param {string} code - Kod weryfikacyjny
   * @param {string} type - Typ weryfikacji (np. 'email')
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  verifyCode: async (email, code, type = 'email') => {
    try {
      const response = await apiClient.post('/users/verify-code', { email, code, type });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas weryfikacji kodu';
      throw new Error(errorMessage);
    }
  },

  /**
   * Resetowanie hasła
   * @param {string} email - Email użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await apiClient.post('/users/request-reset-password', { email });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas żądania resetowania hasła';
      throw new Error(errorMessage);
    }
  },

  /**
   * Potwierdzenie resetu hasła
   * @param {string} token - Token resetu hasła
   * @param {string} password - Nowe hasło
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  confirmPasswordReset: async (token, password) => {
    try {
      const response = await apiClient.post('/users/reset-password', { token, password });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas resetowania hasła';
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Aktualizacja danych użytkownika
   * @param {Object} userData - Nowe dane użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  updateUserProfile: async (userData) => {
    try {
      const response = await apiClient.put('/users/profile', userData);
      
      // Aktualizacja danych w localStorage i cache
      setAuthData(null, response.data);
      
      // Odświeżamy cache
      apiClient.clearCache('/users/profile');
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas aktualizacji profilu';
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Zmiana hasła użytkownika
   * @param {string} currentPassword - Aktualne hasło
   * @param {string} newPassword - Nowe hasło
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/users/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas zmiany hasła';
      throw new Error(errorMessage);
    }
  },

  /**
   * Logowanie za pomocą Google
   * @param {string} googleToken - Token otrzymany z Google OAuth
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  loginWithGoogle: async (googleToken) => {
    try {
      const response = await apiClient.post('/users/auth/google', { token: googleToken });
      if (response.data.token) {
        // Zapisujemy token i dane użytkownika
        setAuthData(response.data.token, response.data.user);
        debug('Zalogowano przez Google pomyślnie, token zapisany');
        
        // Po zalogowaniu czyścimy cache API
        apiClient.clearCache();
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas logowania przez Google';
      throw new Error(errorMessage);
    }
  },

  /**
   * Uzupełnienie profilu użytkownika Google (imię, nazwisko, telefon)
   * @param {Object} profileData - Dane profilu do uzupełnienia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  completeGoogleProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/users/complete-google-profile', profileData);
      
      // Aktualizacja danych w localStorage i cache
      setAuthData(null, response.data.user);
      
      // Odświeżamy cache
      apiClient.clearCache('/users/profile');
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas uzupełniania profilu Google';
      throw new Error(errorMessage);
    }
  }
};

export default AuthService;
