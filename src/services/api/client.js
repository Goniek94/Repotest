// src/services/api/client.js
import axios from 'axios';
import { API_URL, API_TIMEOUT, getAuthToken } from './config';

// Tworzenie instancji axios z podstawową konfiguracją
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Kluczowe - przesyłanie ciasteczek
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor dodający token do nagłówków
apiClient.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    // Dodajemy token do nagłówka jako fallback, gdyby ciasteczka nie działały
    const token = getAuthToken();
    if (token) {
      console.log('Dodaję token do nagłówka Authorization');
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Dla FormData nie ustawiaj Content-Type - axios zrobi to automatycznie
    if (config.data instanceof FormData) {
      console.log('Wykryto FormData, usuwam nagłówek Content-Type');
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  error => {
    console.error('Błąd w request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor obsługujący błędy autoryzacji
apiClient.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  error => {
    console.error('Błąd w API response:', error.message);
    
    if (error.response) {
      console.error('Status odpowiedzi:', error.response.status);
      console.error('Dane odpowiedzi:', error.response.data);
      
      // Obsługa błędu 401 Unauthorized
      if (error.response.status === 401) {
        console.log('Wykryto błąd 401 Unauthorized - wylogowuję użytkownika');
        
        // Usuwamy token z localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Przekierowanie do strony logowania jeśli nie jesteśmy już na niej
        if (window && window.location && !window.location.pathname.includes('/login')) {
          console.log('Przekierowuję do strony logowania');
          window.location.href = '/login?session_expired=true';
        }
      }
    } else if (error.request) {
      console.error('Brak odpowiedzi od serwera:', error.request);
    }
    
    return Promise.reject(error);
  }
);

// Dodajemy metodę do debugowania
apiClient.debug = (endpoint) => {
  return apiClient.get(`/debug/${endpoint}`)
    .then(response => {
      console.log(`Debug odpowiedź z ${endpoint}:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Debug błąd z ${endpoint}:`, error);
      throw error;
    });
};

export default apiClient;