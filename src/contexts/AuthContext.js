import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sprawdź token przy ładowaniu
  useEffect(() => {
    console.log('AuthContext Init - sprawdzam sesję');
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      console.log('Stan autoryzacji przy starcie:', { token: !!token, user: !!userData });
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('Sesja użytkownika odtworzona z localStorage:', parsedUser);
        } catch (error) {
          console.error('Błąd parsowania danych użytkownika:', error);
          authService.logout();
          setUser(null);
        }
      } else {
        console.log('Brak danych sesji w localStorage');
      }
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Próba logowania użytkownika:', email);
      const response = await authService.login(email, password);
      console.log('Logowanie udane, dane użytkownika:', response.user);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Błąd logowania:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Próba rejestracji użytkownika:', userData);
      const response = await authService.register(userData);
      console.log('Rejestracja udana, dane użytkownika:', response.user);
      // Opcjonalnie: automatycznie zaloguj użytkownika po rejestracji
      if (response.token) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Wylogowywanie użytkownika');
    authService.logout();
    setUser(null);
    
    // Przekierowanie na stronę główną po wylogowaniu
    window.location.href = '/';
  };

  // Nowa funkcja do aktualizacji danych użytkownika
  const updateUser = (userData) => {
    console.log('Aktualizacja danych użytkownika:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Sprawdź czy token istnieje i czy mamy dane użytkownika
  const isAuthenticated = !!user && !!localStorage.getItem('token');

  const contextValue = {
    user,
    loading,
    login,
    register, // Dodana funkcja rejestracji
    logout,
    updateUser,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth musi być używany wewnątrz AuthProvider');
  }
  return context;
};