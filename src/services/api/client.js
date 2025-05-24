// src/services/api/client.js
import axios from 'axios';
import { API_URL, API_TIMEOUT, getAuthToken, clearAuthData } from './config';

// Globalna instancja cache
const apiCache = new Map();

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
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Dla FormData nie ustawiaj Content-Type - axios zrobi to automatycznie
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  error => {
    console.error('Błąd w request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor obsługujący odpowiedzi i błędy
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      // Obsługa błędu 401 Unauthorized
      if (error.response.status === 401) {
        console.log('Wykryto błąd 401 Unauthorized');
        clearAuthData();
      }
      
      // Obsługa błędu 429 Too Many Requests
      if (error.response.status === 429 && !error.config._isRetry) {
        // Ustawiamy flagę, że to jest ponowna próba
        error.config._isRetry = true;
        
        // Obliczamy opóźnienie (1 sekunda lub wartość z nagłówka Retry-After)
        const retryAfter = error.response.headers['retry-after'] 
          ? parseInt(error.response.headers['retry-after']) * 1000 
          : 1000;
        
        console.log(`Zbyt wiele zapytań (429). Ponowna próba za ${retryAfter}ms...`);
        
        try {
          // Czekamy określony czas i ponawiamy żądanie
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          return await axios(error.config);
        } catch (retryError) {
          console.error('Błąd podczas ponownej próby:', retryError);
          return Promise.reject(retryError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Funkcje pomocnicze do cache
apiClient.getCache = (key) => {
  const cached = apiCache.get(key);
  if (!cached) return null;
  
  // Sprawdzamy czy cache nie wygasł
  if (cached.expiry && Date.now() > cached.expiry) {
    apiCache.delete(key);
    return null;
  }
  
  return cached.data;
};

apiClient.setCache = (key, data, ttl = 60000) => {
  apiCache.set(key, {
    data,
    expiry: ttl ? Date.now() + ttl : null
  });
};

apiClient.clearCache = (key) => {
  if (key) {
    apiCache.delete(key);
  } else {
    apiCache.clear();
  }
};

// Funkcje rozszerzające API client

// GET z obsługą cache
apiClient.getCached = async (url, params = {}, ttl = 60000) => {
  const cacheKey = `${url}${JSON.stringify(params)}`;
  const cached = apiClient.getCache(cacheKey);
  
  if (cached) {
    return { data: cached };
  }
  
  try {
    const response = await apiClient.get(url, { params });
    apiClient.setCache(cacheKey, response.data, ttl);
    return response;
  } catch (error) {
    console.error(`Błąd podczas pobierania ${url}:`, error);
    throw error;
  }
};

// GET z obsługą retry i błędów
apiClient.getSafe = async (url, params = {}, retries = 2) => {
  let lastError = null;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await apiClient.get(url, { params });
      return response;
    } catch (error) {
      lastError = error;
      
      // Jeśli to nie jest błąd 429 lub to ostatnia próba, nie próbujemy ponownie
      if (error.response?.status !== 429 || i === retries) {
        break;
      }
      
      // Czekamy coraz dłużej przed kolejną próbą
      const delay = Math.pow(2, i) * 1000;
      console.log(`Próba ${i+1}/${retries+1} nie powiodła się. Kolejna próba za ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Jeśli wszystkie próby zawiodły, zwracamy null jako dane i załączamy błąd
  console.error(`Wszystkie próby pobrania ${url} zawiodły.`);
  return { data: null, error: lastError };
};

export default apiClient;