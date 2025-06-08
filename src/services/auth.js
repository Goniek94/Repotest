import apiClient from './api/client';
import { setAuthData, clearAuthData, getUserData } from './api/config';

const AuthService = {
  // Logowanie użytkownika - usunięto podwójny prefix /api/
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      if (response.data.token) {
        // Zapisujemy token i dane użytkownika
        setAuthData(response.data.token, response.data.user);
        debug('Zalogowano pomyślnie, token zapisany');
      }
      return response.data;
    } catch (error) {
      // Ustandaryzowany obiekt błędu z czytelnym komunikatem
      const errorMessage = error.response?.data?.message || 'Błąd podczas logowania';
      throw new Error(errorMessage);
    }
  },

  // Rejestracja użytkownika - usunięto podwójny prefix /api/
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users/register', userData);
      if (response.data.token) {
        // Zapisujemy token i dane użytkownika
        setAuthData(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas rejestracji';
      throw new Error(errorMessage);
    }
  },

  // Wylogowanie użytkownika - usunięto podwójny prefix /api/
  logout: async () => {
    try {
      await apiClient.post('/users/logout');
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    } finally {
      clearAuthData();
    }
  },

  // Pobranie aktualnych danych użytkownika z API - usunięto podwójny prefix /api/
  refreshUserData: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      const updatedUser = response.data;
      
      // Aktualizujemy tylko dane użytkownika
      setAuthData(null, updatedUser);
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd podczas odświeżania danych użytkownika';
      throw new Error(errorMessage);
    }
  },

  // Sprawdzenie czy użytkownik jest zalogowany
  isAuthenticated: () => !!getUserData(),

  // Pobranie danych użytkownika
  getCurrentUser: () => getUserData(),

  // Sprawdzenie czy użytkownik jest adminem
  isAdmin: () => {
    const user = getUserData();
    return user && user.role === 'admin';
  },

  // Resetowanie hasła - usunięto podwójny prefix /api/
  requestPasswordReset: (email) => apiClient.post('/users/request-reset-password', { email }),

  // Potwierdzenie resetu hasła - usunięto podwójny prefix /api/
  confirmPasswordReset: (token, password) => apiClient.post('/users/reset-password', { token, password })
};

export default AuthService;