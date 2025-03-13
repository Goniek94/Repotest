// src/services/auth.service.js
import api from './axios';

// Logowanie użytkownika
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Błąd w auth.service - login:', error);
    throw error;
  }
};

// Sprawdzanie czy email istnieje
const checkEmailExists = async (email) => {
  try {
    const response = await api.post('/auth/check-email', { email });
    return response.data;
  } catch (error) {
    console.error('Błąd w auth.service - checkEmailExists:', error);
    throw error;
  }
};

// Sprawdzanie czy telefon istnieje
const checkPhoneExists = async (phone) => {
  try {
    const response = await api.post('/auth/check-phone', { phone });
    return response.data;
  } catch (error) {
    console.error('Błąd w auth.service - checkPhoneExists:', error);
    throw error;
  }
};

// Rejestracja użytkownika
const register = async (userData) => {
  try {
    console.log('auth.service - wysyłanie danych rejestracji:', userData);
    
    // Przygotowanie daty w formacie YYYY-MM-DD jeśli potrzeba
    let formattedData = { ...userData };
    if (formattedData.dob && typeof formattedData.dob === 'string' && formattedData.dob.includes('T')) {
      formattedData.dob = formattedData.dob.split('T')[0];
    }
    
    const response = await api.post('/auth/register', formattedData);
    console.log('auth.service - odpowiedź z rejestracji:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Błąd w auth.service - register:', error);
    console.error('Szczegóły błędu register:', error.response?.data || error.message);
    throw error;
  }
};

// Wylogowanie użytkownika
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Pobieranie aktualnego użytkownika
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Sprawdzanie czy użytkownik jest zalogowany
const isAuthenticated = () => {
  return !!localStorage.getItem('token') && !!localStorage.getItem('user');
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  checkEmailExists,
  checkPhoneExists
};

export default authService;