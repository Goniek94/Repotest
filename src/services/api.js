// src/services/api.js
import axios from 'axios';

// Konfiguracja podstawowa axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Zmieniony adres na port 5000
  timeout: 30000, // 30 sekund
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor do obsługi tokena autoryzacji
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Jeśli przesyłamy FormData, nie ustawiaj Content-Type, axios zrobi to automatycznie z boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

const api = {
  /**
   * Pobieranie ogłoszeń
   * @param {Object} params - Parametry zapytania (filtry, strona, limit)
   * @returns {Promise<Object>} - Lista ogłoszeń z metadanymi
   */
  getListings: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/ads', { params });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania ogłoszeń:', error);
      throw error;
    }
  },

  /**
   * Wyszukiwanie ogłoszeń z zaawansowanymi filtrami
   * @param {Object} params - Parametry wyszukiwania
   * @returns {Promise<Object>} - Wyniki wyszukiwania z metadanymi
   */
  searchListings: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/ads/search', { params });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas wyszukiwania ogłoszeń:', error);
      throw error;
    }
  },

  /**
   * Dodawanie nowego ogłoszenia
   * @param {FormData} formData - Dane formularza z ogłoszeniem i zdjęciami
   * @returns {Promise<Object>} - Dodane ogłoszenie
   */
  addListing: async (formData) => {
    try {
      console.log('API: Wysyłanie formData do endpointu /ads/add');
      
      // Sprawdź czy to jest obiekt FormData
      if (!(formData instanceof FormData)) {
        throw new Error('Nieprawidłowy format danych - wymagany FormData');
      }
      
      // Debugowanie - pokaż ilość plików
      let fileCount = 0;
      for (let [key, value] of formData.entries()) {
        if (key === 'images') {
          fileCount++;
          console.log(`FormData zawiera plik: ${value.name || 'bez nazwy'}`);
        }
      }
      console.log(`Łączna liczba plików w FormData: ${fileCount}`);
      
      const response = await axiosInstance.post('/ads/add', formData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas dodawania ogłoszenia:', error);
      
      // Szczegółowa obsługa błędów
      if (error.response) {
        console.error('Status odpowiedzi:', error.response.status);
       console.error('Dane odpowiedzi:', error.response.data);
     } else if (error.request) {
       console.error('Brak odpowiedzi od serwera:', error.request);
     }
     
     throw error;
   }
 },

 /**
  * Pobieranie szczegółów ogłoszenia
  * @param {string} id - ID ogłoszenia
  * @returns {Promise<Object>} - Szczegóły ogłoszenia
  */
 getListing: async (id) => {
   try {
     const response = await axiosInstance.get(`/ads/${id}`);
     return response.data;
   } catch (error) {
     console.error('Błąd podczas pobierania szczegółów ogłoszenia:', error);
     throw error;
   }
 },

 /**
  * Aktualizacja statusu ogłoszenia
  * @param {string} adId - ID ogłoszenia
  * @param {string} status - Nowy status
  * @returns {Promise<Object>} - Zaktualizowane ogłoszenie
  */
 updateAdStatus: async (adId, status) => {
   try {
     const response = await axiosInstance.put(`/ads/${adId}/status`, { status });
     return response.data;
   } catch (error) {
     console.error('Błąd podczas aktualizacji statusu ogłoszenia:', error);
     throw error;
   }
 },

 /**
  * Pobieranie rotowanych ogłoszeń dla strony głównej
  * @returns {Promise<Object>} - Ogłoszenia podzielone na kategorie
  */
 getRotatedListings: async () => {
   try {
     const response = await axiosInstance.get('/ads/rotated');
     return response.data;
   } catch (error) {
     console.error('Błąd podczas pobierania rotowanych ogłoszeń:', error);
     throw error;
   }
 },

 /**
  * Pobieranie dostępnych marek pojazdów
  * @returns {Promise<Array>} - Lista marek
  */
 getBrands: async () => {
   try {
     const response = await axiosInstance.get('/ads/brands');
     return response.data;
   } catch (error) {
     console.error('Błąd podczas pobierania marek:', error);
     throw error;
   }
 },

 /**
  * Pobieranie modeli dla wybranej marki
  * @param {string} brand - Nazwa marki
  * @returns {Promise<Array>} - Lista modeli
  */
 getModels: async (brand) => {
   try {
     const response = await axiosInstance.get('/ads/models', { params: { brand } });
     return response.data;
   } catch (error) {
     console.error('Błąd podczas pobierania modeli:', error);
     throw error;
   }
 },

 /**
  * Dodanie ogłoszenia do ulubionych
  * @param {string} adId - ID ogłoszenia
  * @returns {Promise<Object>} - Informacja o dodaniu do ulubionych
  */
 addToFavorites: async (adId) => {
   try {
     const response = await axiosInstance.post(`/favorites/add/${adId}`);
     return response.data;
   } catch (error) {
     console.error('Błąd podczas dodawania do ulubionych:', error);
     throw error;
   }
 },

 /**
  * Usunięcie ogłoszenia z ulubionych
  * @param {string} adId - ID ogłoszenia
  * @returns {Promise<Object>} - Informacja o usunięciu z ulubionych
  */
 removeFromFavorites: async (adId) => {
   try {
     const response = await axiosInstance.delete(`/favorites/remove/${adId}`);
     return response.data;
   } catch (error) {
     console.error('Błąd podczas usuwania z ulubionych:', error);
     throw error;
   }
 },

 /**
  * Przełączanie statusu ulubionego ogłoszenia
  * @param {string} adId - ID ogłoszenia
  * @returns {Promise<Object>} - Informacja o zmianie statusu
  */
 toggleFavorite: async (adId) => {
   try {
     const response = await axiosInstance.post(`/favorites/toggle/${adId}`);
     return response.data;
   } catch (error) {
     console.error('Błąd podczas przełączania ulubionego:', error);
     throw error;
   }
 },

 /**
  * Pobieranie danych pojazdu po numerze VIN
  * @param {string} vin - Numer VIN pojazdu
  * @returns {Promise<Object>} - Dane pojazdu
  */
 getVehicleDataByVin: async (vin) => {
   try {
     // W trybie rozwojowym, zwracamy mockowe dane
     if (process.env.NODE_ENV === 'development') {
       console.log('Symulacja pobierania danych VIN w trybie development');
       
       // Opóźnienie dla symulacji rzeczywistego zapytania
       await new Promise(resolve => setTimeout(resolve, 1500));
       
       // Przykładowe dane dla testów
       return {
         brand: 'Volkswagen',
         model: 'Golf',
         generation: 'VII',
         version: '1.4 TSI',
         condition: 'Używany',
         productionYear: 2018,
         engineSize: 1395,
         power: 125,
         fuelType: 'Benzyna',
         transmission: 'Manualna',
         drive: 'Przedni',
         mileage: 78500,
         accidentStatus: 'Bezwypadkowy',
         damageStatus: 'Nieuszkodzony',
         countryOfOrigin: 'Niemcy'
       };
     }
     
     // W produkcji, wykonujemy rzeczywiste zapytanie
     const response = await axiosInstance.get(`/vehicle/vin/${vin}`);
     return response.data;
   } catch (error) {
     console.error('Błąd podczas pobierania danych VIN:', error);
     throw error;
   }
 },

 /**
  * Walidacja płatności (integracja z systemem płatności)
  * @param {Object} paymentData - Dane płatności
  * @returns {Promise<Object>} - Status płatności
  */
 processPayment: async (paymentData) => {
   try {
     const response = await axiosInstance.post('/payments/process', paymentData);
     return response.data;
   } catch (error) {
     console.error('Błąd podczas przetwarzania płatności:', error);
     throw error;
   }
 },

 /**
  * Weryfikacja statusu płatności
  * @param {string} paymentId - ID płatności
  * @returns {Promise<Object>} - Status płatności
  */
 checkPaymentStatus: async (paymentId) => {
   try {
     const response = await axiosInstance.get(`/payments/status/${paymentId}`);
     return response.data;
   } catch (error) {
     console.error('Błąd podczas sprawdzania statusu płatności:', error);
     throw error;
   }
 },
 
 /**
  * Odświeżanie rotacji ogłoszeń (tylko dla zalogowanych użytkowników)
  * @returns {Promise<Object>} - Nowe rotowane ogłoszenia
  */
 refreshRotatedListings: async () => {
   try {
     const response = await axiosInstance.post('/ads/rotated/refresh');
     return response.data;
   } catch (error) {
     console.error('Błąd podczas odświeżania rotacji ogłoszeń:', error);
     throw error;
   }
 },

 /**
  * Pobieranie ogłoszeń użytkownika
  * @returns {Promise<Array>} - Lista ogłoszeń użytkownika
  */
 getUserListings: async () => {
   try {
     // Zmieniona ścieżka z /api/auth/my-listings na /api/users/my-listings
     const response = await axiosInstance.get('/api/users/my-listings');
     return response.data;
   } catch (error) {
     const errorMessage = error.response?.data?.message || 'Błąd podczas pobierania ogłoszeń użytkownika';
     throw new Error(errorMessage);
   }
 },
 
 /**
  * Pobieranie ulubionych ogłoszeń użytkownika
  * @returns {Promise<Array>} - Lista ulubionych ogłoszeń
  */
 getUserFavorites: async () => {
   try {
     // Zmieniona ścieżka z /api/auth/favorites na /api/users/favorites
     const response = await axiosInstance.get('/api/users/favorites');
     return response.data;
   } catch (error) {
     const errorMessage = error.response?.data?.message || 'Błąd podczas pobierania ulubionych ogłoszeń';
     throw new Error(errorMessage);
   }
 },

 /**
  * Rejestracja nowego użytkownika
  * @param {Object} userData - Dane nowego użytkownika
  * @returns {Promise<Object>} - Dane utworzonego użytkownika i token
  */
 register: async (userData) => {
   try {
     // Zmieniona ścieżka z /api/auth/register na /api/users/register
     const response = await axiosInstance.post('/api/users/register', userData);
     
     // Zapisz dane użytkownika do localStorage
     // Token przechowywany jest w HttpOnly cookie
     if (response.data.user) {
       localStorage.setItem('user', JSON.stringify(response.data.user));
     }
     
     return response.data;
   } catch (error) {
     const errorMessage = error.response?.data?.message || 'Błąd podczas rejestracji';
     throw new Error(errorMessage);
   }
 },

 /**
  * Logowanie użytkownika
  * @param {Object} credentials - Dane logowania (email, hasło)
  * @returns {Promise<Object>} - Dane użytkownika i token
  */
 login: async (credentials) => {
   try {
     // Zmieniona ścieżka z /api/auth/login na /api/users/login
     const response = await axiosInstance.post('/api/users/login', credentials);
     
     // Zapisz dane użytkownika do localStorage
     // Token przechowywany jest w HttpOnly cookie
     if (response.data.user) {
       localStorage.setItem('user', JSON.stringify(response.data.user));
     }
     
     return response.data;
   } catch (error) {
     // Ustandaryzowany obiekt błędu z czytelnym komunikatem
     const errorMessage = error.response?.data?.message || 'Błąd podczas logowania';
     throw new Error(errorMessage);
   }
 },

 /**
  * Wylogowanie użytkownika
  * @returns {Promise<void>}
  */
 logout: async () => {
   try {
     // Wywołanie endpointu logout, który usunie HttpOnly cookie
     // Zmieniona ścieżka z /api/auth/logout na /api/users/logout
     await axiosInstance.post('/api/users/logout');
   } catch (error) {
     // Ignorujemy ewentualne błędy podczas wylogowywania
   } finally {
     // Czyścimy lokalnie przechowywane dane
     localStorage.removeItem('user');
     return Promise.resolve();
   }
 },

 /**
  * Sprawdzenie czy użytkownik jest zalogowany
  * @returns {boolean} - Status zalogowania
  */
 isLoggedIn: () => {
   return !!localStorage.getItem('token');
 },

 /**
  * Pobranie danych zalogowanego użytkownika
  * @returns {Object|null} - Dane użytkownika lub null
  */
 getCurrentUser: () => {
   const userStr = localStorage.getItem('user');
   return userStr ? JSON.parse(userStr) : null;
 },

 /**
  * Aktualizacja danych użytkownika
  * @param {Object} userData - Nowe dane użytkownika
  * @returns {Promise<Object>} - Zaktualizowane dane
  */
 updateUserProfile: async (userData) => {
   try {
     // Zmieniona ścieżka z /api/auth/profile na /api/users/profile
     const response = await axiosInstance.put('/api/users/profile', userData);
     
     // Aktualizuj dane użytkownika w localStorage
     if (response.data.user) {
       localStorage.setItem('user', JSON.stringify(response.data.user));
     }
     
     return response.data;
   } catch (error) {
     const errorMessage = error.response?.data?.message || 'Błąd podczas aktualizacji profilu';
     throw new Error(errorMessage);
   }
 },

 /**
  * Zmiana hasła użytkownika
  * @param {Object} passwordData - Stare i nowe hasło
  * @returns {Promise<Object>} - Informacja o zmianie hasła
  */
 changePassword: async (passwordData) => {
   try {
     // Zmieniona ścieżka z /api/auth/change-password na /api/users/change-password
     const response = await axiosInstance.put('/api/users/change-password', passwordData);
     return response.data;
   } catch (error) {
     const errorMessage = error.response?.data?.message || 'Błąd podczas zmiany hasła';
     throw new Error(errorMessage);
   }
 }
};

export default api;