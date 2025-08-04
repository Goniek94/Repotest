// src/services/api/client.js
import axios from 'axios';
import { 
  API_URL, 
  API_TIMEOUT, 
  getAuthToken, 
  clearAuthData, 
  IS_PRODUCTION,
  CACHE_TTL,
  MAX_RETRIES,
  THROTTLE_REQUESTS
} from './config';
import debugUtils from '../../utils/debug';

const { safeConsole } = debugUtils;

// Globalna instancja cache
const apiCache = new Map();

// Tworzenie instancji axios z podstawową konfiguracją
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // KLUCZOWE - JWT w HttpOnly cookie
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor przygotowujący requesty (BEZ tokenów - używamy tylko HttpOnly cookies)
apiClient.interceptors.request.use(
  config => {
    // USUNIĘTO: Nie dodajemy tokenów z localStorage - używamy tylko HttpOnly cookies
    // HttpOnly cookies są automatycznie wysyłane przez przeglądarkę z withCredentials: true
    
    // Dla FormData nie ustawiaj Content-Type - axios zrobi to sam
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  error => {
    safeConsole.error('Błąd w request interceptor:', error);
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
        safeConsole.warn('Wykryto błąd 401 Unauthorized - wylogowywanie użytkownika');
        
        // Wyczyść dane autoryzacyjne
        await clearAuthData();
        
        // Przekieruj na stronę logowania jeśli nie jesteśmy już tam
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login?expired=true';
        }
      }
      // Obsługa błędu 429 Too Many Requests - throttling
      if (error.response.status === 429 && !error.config._isRetry && THROTTLE_REQUESTS) {
        error.config._isRetry = true;
        const retryAfter = error.response.headers['retry-after'] 
          ? parseInt(error.response.headers['retry-after']) * 1000 
          : 1000;
        safeConsole.warn(`Zbyt wiele zapytań (429). Ponowna próba za ${retryAfter}ms...`);
        try {
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          return await axios(error.config);
        } catch (retryError) {
          safeConsole.error('Błąd podczas ponownej próby:', retryError);
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
  if (cached.expiry && Date.now() > cached.expiry) {
    apiCache.delete(key);
    return null;
  }
  return cached.data;
};

apiClient.setCache = (key, data, ttl = CACHE_TTL) => {
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

// GET z obsługą cache
apiClient.getCached = async (url, params = {}, ttl = CACHE_TTL) => {
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
    safeConsole.error(`Błąd podczas pobierania ${url}:`, error);
    throw error;
  }
};

// GET z obsługą retry i błędów
apiClient.getSafe = async (url, params = {}, retries = MAX_RETRIES) => {
  let lastError = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await apiClient.get(url, { params });
      return response;
    } catch (error) {
      lastError = error;
      if (error.response?.status !== 429 || i === retries) {
        break;
      }
      const delay = Math.pow(2, i) * 1000;
      safeConsole.warn(`Próba ${i+1}/${retries+1} nie powiodła się. Kolejna próba za ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  safeConsole.error(`Wszystkie próby pobrania ${url} zawiodły.`);
  return { data: null, error: lastError };
};

export default apiClient;
