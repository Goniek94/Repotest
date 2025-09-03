import apiClient from './api/client';

const AdsService = {
  // Pobieranie wszystkich ogłoszeń z opcjonalną filtracją
  getAll: (params = {}) => apiClient.get('/ads', { params }),

  // Pobieranie liczby ogłoszeń pasujących do filtrów
  getCount: (params = {}) => apiClient.get('/ads/count', { params }),

  // Pobieranie liczników filtrów dla kaskadowego filtrowania
  getFilterCounts: (params = {}) => apiClient.get('/ads/filter-counts', { params }),

  // Pobieranie statystyk wyszukiwania z licznikami marek i modeli
  getSearchStats: (params = {}) => apiClient.get('/ads/search-stats', { params }),

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
      withCredentials: true
    }),

  // Aktualizacja ogłoszenia
  update: (id, adData) => apiClient.put(`/ads/${id}`, adData),

  // Usuwanie ogłoszenia
  delete: (id) => apiClient.delete(`/ads/${id}`),

  // Przeszukiwanie ogłoszeń (przekazuje wszystkie filtry jako params)
  search: (params = {}) => apiClient.get('/ads/search', { params }),

  // ✅ POPRAWKA: Używaj endpointu z Twojego backendu
  getUserAds: () => apiClient.get('/ads/user/listings'),

  // ✅ DODANE: Rotowane ogłoszenia dla strony głównej
  getRotatedListings: () => apiClient.get('/ads/rotated'),

  // Pobieranie wyróżnionych ogłoszeń
  getFeatured: () => apiClient.get('/ads/featured'),

  // Oznaczanie ogłoszenia jako wyróżnione
  markAsFeatured: (id) => apiClient.post(`/ads/${id}/featured`),

  // Upload zdjęć do ogłoszenia
  uploadImages: (id, formData) =>
    apiClient.post(`/ads/${id}/images`, formData),

  // ✅ DODANE: Usuwanie zdjęcia z ogłoszenia
  deleteImage: (id, index) => 
    apiClient.delete(`/ads/${id}/images/${index}`),

  // ✅ POPRAWIONE: Zmiana kolejności zdjęć (pierwsze = główne)
  setMainImage: (id, images) =>
    apiClient.put(`/ads/${id}/images/reorder`, { images }),

  // Dodawanie ogłoszenia do ulubionych
  addToFavorites: (id) => apiClient.post(`/favorites/add/${id}`),

  // Usuwanie ogłoszenia z ulubionych
  removeFromFavorites: (id) => apiClient.delete(`/favorites/remove/${id}`),

  // Pobieranie ulubionych ogłoszeń użytkownika
  getFavorites: () => apiClient.get('/favorites'),

  // Sprawdzanie czy ogłoszenie jest w ulubionych
  checkIsFavorite: (id) => apiClient.get(`/favorites/check/${id}`),
  
  // Aktualizacja statusu ogłoszenia
  updateStatus: (id, status) => apiClient.put(`/ads/${id}/status`, { status }),

  // ✅ DODANE: Aktualizacja zdjęć w ogłoszeniu
  updateListingImages: (id, imageData) => apiClient.patch(`/ads/${id}/images`, imageData),

  // ✅ ZAKTUALIZOWANE: Przedłużenie ogłoszenia używające dedykowanego endpointu
  extendListing: (id) => apiClient.post(`/ads/${id}/renew`),

  // ✅ DODANE: Zakończenie ogłoszenia
  finishListing: (id) => apiClient.put(`/ads/${id}/status`, { status: 'archived' }),
};

export default AdsService;
