import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import AuthService from '../services/auth';
import { getAuthToken } from '../services/api/config';
import ActivityLogService from '../services/activityLogService';

// Tworzenie kontekstu autoryzacji
const AuthContext = createContext();

// Hook ułatwiający dostęp do kontekstu
export const useAuth = () => useContext(AuthContext);

// Provider kontekstu autoryzacji
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Konfiguracja automatycznego wylogowania - zwiększony czas
  const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minut w milisekundach
  const activityTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Funkcja resetująca timer nieaktywności
  const resetInactivityTimer = useCallback(() => {
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }
    
    lastActivityRef.current = Date.now();
    
    // Tylko ustawiaj timer jeśli użytkownik jest zalogowany
    if (isAuthenticated) {
      activityTimerRef.current = setTimeout(() => {
        // Sprawdź czy minęło wystarczająco dużo czasu od ostatniej aktywności
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
          debug('Automatyczne wylogowanie po okresie nieaktywności');
          logout('/login?session_expired=true');
        }
      }, INACTIVITY_TIMEOUT);
    }
  }, [isAuthenticated, INACTIVITY_TIMEOUT]);
  
  // Śledzenie aktywności użytkownika
  useEffect(() => {
    // Zdarzenia, które resetują timer nieaktywności
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 
      'scroll', 'touchstart', 'click'
    ];
    
    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
      resetInactivityTimer();
    };
    
    // Dodanie nasłuchiwania na zdarzenia
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Czyszczenie przy odmontowaniu
    return () => {
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
      
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, resetInactivityTimer]);

  // Inicjalizacja stanu autoryzacji przy montowaniu komponentu
  useEffect(() => {
    // Sprawdzenie czy użytkownik jest zalogowany
    const initAuth = () => {
      setIsLoading(true);
      try {
        const currentUser = AuthService.getCurrentUser();
        const authenticated = AuthService.isAuthenticated();

        debug('Inicjalizacja auth:', {
          user: !!currentUser,
          isAuthenticated: authenticated,
          token: getAuthToken() ? 'Istnieje' : 'Brak'
        });

        setUser(currentUser);
        setIsAuthenticated(authenticated);
        
        // Zainicjuj timer nieaktywności jeśli użytkownik jest zalogowany
        if (authenticated) {
          resetInactivityTimer();
        }
      } catch (error) {
        console.error('Błąd inicjalizacji autoryzacji:', error);
        // Czyszczenie danych w przypadku błędu
        AuthService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [resetInactivityTimer]);

  // Funkcja logowania
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await AuthService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      resetInactivityTimer(); // Reset timera po zalogowaniu
      ActivityLogService.logLogin(data.user);
      return data;
    } catch (error) {
      console.error('Błąd logowania:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcja rejestracji
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await AuthService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      resetInactivityTimer(); // Reset timera po rejestracji
      return data;
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcja wylogowania
  const logout = async (redirectTo = '/') => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      
      // Dodajemy informację o wylogowaniu do localStorage
      // Będzie ona odczytana na stronie głównej
      localStorage.setItem('justLoggedOut', 'true');
      
      // Przekierowanie na stronę główną
      window.location.href = redirectTo;
    } catch (error) {
      console.error('Błąd wylogowania:', error);
      
      // Nawet w przypadku błędu, czyścimy dane użytkownika lokalnie
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      
      // Przekierowanie na stronę główną
      window.location.href = redirectTo;
    }
  };

  // Funkcja odświeżania danych użytkownika
  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const updatedUser = await AuthService.refreshUserData();
      setUser(updatedUser);
      resetInactivityTimer(); // Reset timera po odświeżeniu danych
      return updatedUser;
    } catch (error) {
      console.error('Błąd odświeżania danych użytkownika:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcja sprawdzająca czy użytkownik jest adminem
  const isAdmin = () => {
    return AuthService.isAdmin();
  };

  // Wartość kontekstu
  const contextValue = React.useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      isAdmin
    }),
    [user, isAuthenticated, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

