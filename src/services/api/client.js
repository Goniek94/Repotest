// src/services/api/client.js
import axios from 'axios';
import {
  API_URL,
  API_TIMEOUT,
  clearAuthData,
  IS_PRODUCTION
} from './config';
import debugUtils from '../../utils/debug';

const { safeConsole } = debugUtils;

/* ===================== ACCESS TOKEN W PAMIĘCI ===================== */
let accessToken = null;
export const setAccessToken = (t) => { accessToken = t || null; };
export const clearAccessToken = () => { accessToken = null; };

/* ===================== LEKKI CACHE W PAMIĘCI ===================== */
const apiCache = new Map();
const MAX_CACHE_SIZE = 50;

/* ===================== INSTANCJE AXIOS ===================== */
// Główna – do wszystkich zwykłych requestów
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // żeby cookie refresh poszło do /auth/refresh, kiedy trzeba
  headers: { Accept: 'application/json' }
});

// Oddzielna, minimalna instancja do REFRESH (nie dziedziczy interceptorów)
const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: { Accept: 'application/json' }
});

/* ===================== POMOCNICZE: KOLEJKA PODCZAS REFRESH ===================== */
let refreshPromise = null;
const subscribers = [];
const subscribeTokenRefreshed = (cb) => subscribers.push(cb);
const notifySubscribers = (newAccess) => {
  while (subscribers.length) {
    const cb = subscribers.shift();
    try { cb(newAccess); } catch {}
  }
};

/* ===================== REQUEST INTERCEPTOR ===================== */
apiClient.interceptors.request.use(
  (config) => {
    // Content-Type tylko dla JSON (FormData bez nagłówka)
    if (config.data && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Dołącz access token jeżeli jest
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      // upewnij się, że nie niesiemy pustego nagłówka
      delete config.headers.Authorization;
    }

    // Debug: wielkość nagłówków
    if (!IS_PRODUCTION) {
      const headersStr = JSON.stringify(config.headers || {});
      if (headersStr.length > 700) {
        safeConsole.warn(`Nagłówki >700 znaków (${headersStr.length})`, config.url);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR ===================== */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    /* ---- 431: Request Header Fields Too Large ---- */
    if (error.response?.status === 431) {
      safeConsole.error('HTTP 431: Nagłówki za duże – czyszczę cache i robię minimalny retry');
      apiCache.clear();

      if (!originalRequest?._minimal_retry) {
        originalRequest._minimal_retry = true;

        // Minimalne nagłówki + zachowaj withCredentials
        const retryConfig = {
          ...originalRequest,
          headers: { Accept: 'application/json' },
          withCredentials: true
        };

        try {
          return await axios(retryConfig);
        } catch (retryErr) {
          safeConsole.error('Minimalny retry po 431 nie powiódł się', retryErr?.response?.status);
        }
      }
    }

    /* ---- 401: Unauthorized – spróbuj odświeżyć ---- */
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      // Jeśli już trwa refresh – dołącz do kolejki i poczekaj
      if (refreshPromise) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefreshed((newAccess) => {
            if (newAccess) {
              // Podmień Authorization i ponów
              originalRequest.headers = {
                ...(originalRequest.headers || {}),
                Authorization: `Bearer ${newAccess}`
              };
              resolve(apiClient(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      // Zacznij świeży refresh
      refreshPromise = (async () => {
        try {
          // Cookie refresh (Path=/api/auth/refresh) poleci automatycznie
          const { data } = await refreshClient.post('/auth/refresh');
          // Oczekujemy { accessToken: '...' } — nic więcej nie jest potrzebne
          const newAccess = data?.accessToken;
          if (!newAccess) throw new Error('Brak accessToken w odpowiedzi /auth/refresh');

          setAccessToken(newAccess);
          notifySubscribers(newAccess);
          return newAccess;
        } catch (e) {
          // Nie udało się odświeżyć – wyloguj
          safeConsole.error('Odświeżenie sesji nieudane – wylogowuję', e?.response?.status);
          notifySubscribers(null);
          await clearAuthData();      // czyści LS, ew. wywołuje logout endpoint (u Ciebie już jest)
          clearAccessToken();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login?expired=true';
          }
          throw e;
        } finally {
          refreshPromise = null;
        }
      })();

      try {
        const newAccess = await refreshPromise;
        // Ustaw nowe Authorization i ponów oryginalne żądanie
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newAccess}`
        };
        return apiClient(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

/* ===================== CACHE – NARZĘDZIA ===================== */
apiClient.getCache = (key) => {
  const cached = apiCache.get(key);
  if (!cached) return null;
  if (cached.expiry && Date.now() > cached.expiry) {
    apiCache.delete(key);
    return null;
  }
  return cached.data;
};

apiClient.setCache = (key, data, ttl = 300000) => {
  if (apiCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = apiCache.keys().next().value;
    apiCache.delete(oldestKey);
  }
  apiCache.set(key, { data, expiry: Date.now() + ttl });
};

apiClient.clearCache = (key) => {
  if (key) apiCache.delete(key);
  else apiCache.clear();
};

apiClient.getCached = async (url, params = {}, ttl = 300000) => {
  const cacheKey = `${url}${JSON.stringify(params)}`;
  const cached = apiClient.getCache(cacheKey);
  if (cached) return { data: cached };
  const response = await apiClient.get(url, { params });
  apiClient.setCache(cacheKey, response.data, ttl);
  return response;
};

export default apiClient;
