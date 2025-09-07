import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getUserData, 
  isAuthenticated as checkAuth,
  isAuthenticatedSync,
  refreshUserData,
  clearAuthData,
  setAuthData  // Tylko dla podstawowych danych, BEZ tokenów
} from '../services/api/config';
import AuthService from '../services/api/authApi';

// Create Auth Context
const AuthContext = createContext();

// AuthProvider Component - wraps entire app
export const AuthProvider = ({ children }) => {
  // State management
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // POPRAWIONA - Initialize authentication state bez localStorage tokenów
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Sprawdź lokalne dane użytkownika (BEZ tokenów)
      const localUserData = getUserData();
      
      // ZAWSZE sprawdź przez API - HttpOnly cookies będą wysłane automatycznie
      const authenticated = await checkAuth();
      
      if (authenticated) {
        // Pobierz świeże dane z serwera
        const freshUserData = await refreshUserData();
        
        if (freshUserData) {
          setUser(freshUserData);
          setIsAuthenticated(true);
          console.log('✅ Użytkownik zalogowany:', freshUserData.email);
        } else {
          // Jeśli nie można pobrać danych, wyczyść wszystko
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // Nie zalogowany - wyczyść lokalne dane
        if (localUserData) {
          clearAuthData(); // Wyczyści localStorage i wyśle logout do serwera
        }
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Błąd inicjalizacji auth:', error);
      
      // W przypadku błędu wyczyść wszystko
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function - używa AuthService z axios
  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // AuthService automatycznie obsługuje cookies
      const data = await AuthService.login(email, password);

      // Zapisz podstawowe dane użytkownika (BEZ tokenów)
      setUser(data.user);
      setIsAuthenticated(true);
      setAuthData(data.user); // Tylko podstawowe dane do localStorage

      console.log('✅ Zalogowano pomyślnie:', data.user.email);
      return data;
    } catch (error) {
      console.error('❌ Błąd logowania:', error);
      setError(error.message || 'Nie udało się zalogować');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const data = await AuthService.register(userData);

      // Po rejestracji może być automatyczne logowanie
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        setAuthData(data.user); // Tylko podstawowe dane
      }

      console.log('✅ Rejestracja pomyślna:', data.user?.email);
      return data;
    } catch (error) {
      console.error('❌ Błąd rejestracji:', error);
      setError(error.message || 'Nie udało się zarejestrować');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function - wyczyści HttpOnly cookies przez API
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // AuthService wyśle request do /logout który wyczyści HttpOnly cookies
      await AuthService.logout();
      
      // Wyczyść stan aplikacji
      setUser(null);
      setIsAuthenticated(false);
      setError(null);

      console.log('✅ Wylogowano pomyślnie');
      
    } catch (error) {
      console.error('❌ Błąd wylogowania:', error);
      
      // Wyloguj lokalnie nawet jeśli API zwróciło błąd
      clearAuthData(); // Wyczyści localStorage
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // USUNIĘTA - updateUser nie powinna zapisywać do localStorage
  // Dane użytkownika powinny być aktualizowane przez API
  
  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const userData = await refreshUserData();
      if (userData) {
        setUser(userData);
        return userData;
      }
      
      // Jeśli nie można odświeżyć, użytkownik może być wylogowany
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } catch (error) {
      console.error('❌ Błąd odświeżania danych użytkownika:', error);
      
      // W przypadku błędu wyloguj użytkownika
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is moderator or admin
  const isModerator = () => {
    return hasRole(['admin', 'moderator']);
  };

  // Get user's full name
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.name || user.email || 'User';
  };

  // Context value
  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    refreshUser,
    
    // Utilities
    hasRole,
    isAdmin,
    isModerator,
    getUserDisplayName,
    
    // Clear error
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// HOC for components that require authentication
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>;
    }
    
    if (!isAuthenticated) {
      return <div className="text-center p-8">
        <p className="text-gray-600">Musisz być zalogowany, aby zobaczyć tę stronę.</p>
      </div>;
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;