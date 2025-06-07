// src/services/client.js
import axios from 'axios/dist/node/axios.cjs';
import { API_URL, API_TIMEOUT, getAuthToken } from './api/config';

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
    // Dodajemy token do nagłówka jako fallback, gdyby ciasteczka nie działały
    const token = getAuthToken && getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Dla FormData nie ustawiaj Content-Type - axios zrobi to automatycznie
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor obsługujący błędy autoryzacji
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
