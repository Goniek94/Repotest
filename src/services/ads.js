import apiClient from './api/client';

const AdsService = {
  // Pobieranie wszystkich ogłoszeń z opcjonalną filtracją
  getAll: (params = {}) => apiClient.get('/ads', { params }),

  // Pobieranie liczby ogłoszeń pasujących do filtrów
  getCount: (params = {}) => apiClient.get('/ads/count', { params }),

  // Pobieranie wszystkich dostępnych marek samochodów
  getBrands: () => apiClient.get('/ads/brands'),

  // Pobieranie modeli dla wybranej marki
  getModels: (brand) => apiClient.get('/ads/models', { params: { brand } }),

  // Pobieranie pojedynczego ogłoszenia
  getById: (id) => apiClient.get(`/ads/${id}`),

  // Tworzenie nowego ogłoszenia
  create: (adData) => apiClient.post('/ads', adData),

  // Dodanie ogłoszenia ze zdjęciami (FormData)
  addListing: (formData) => 
    apiClient.post('/ads/add', formData, {
      // Nie ustawiaj Content-Type dla FormData - axios zrobi to automatycznie
      withCredentials: true // Upewnij się, że przesyłasz ciasteczka
    }),

  // Aktualizacja ogłoszenia
  update: (id, adData) => apiClient.put(`/ads/${id}`, adData),

  // Usuwanie ogłoszenia
  delete: (id) => apiClient.delete(`/ads/${id}`),

  // Przeszukiwanie ogłoszeń (przekazuje wszystkie filtry jako params)
  search: (params = {}) => apiClient.get('/ads/search', { params }),

  // Pobieranie ogłoszeń użytkownika
  getUserAds: () => apiClient.get('/ads/user'),

  // Pobieranie wyróżnionych ogłoszeń
  getFeatured: () => apiClient.get('/ads/featured'),

  // Oznaczanie ogłoszenia jako wyróżnione
  markAsFeatured: (id) => apiClient.post(`/ads/${id}/featured`),

  // Upload zdjęć do ogłoszenia
  uploadImages: (id, formData) =>
    apiClient.post(`/ads/${id}/images`, formData),

  // Dodawanie ogłoszenia do ulubionych
  addToFavorites: (id) => apiClient.post(`/favorites/add/${id}`),

  // Usuwanie ogłoszenia z ulubionych
  removeFromFavorites: (id) => apiClient.delete(`/favorites/remove/${id}`),
  
  // Aktualizacja statusu ogłoszenia
  updateStatus: (id, status) => apiClient.put(`/ads/${id}/status`, { status }),
};

export default AdsService;
