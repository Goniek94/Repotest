import apiClient from './api/client';

const AdsService = {
  // Pobieranie wszystkich ogłoszeń z opcjonalną filtracją
  getAll: (params = {}) => apiClient.get('/api/ads', { params }),

  // Pobieranie liczby ogłoszeń pasujących do filtrów
  getCount: (params = {}) => apiClient.get('/api/ads/count', { params }),

  // Pobieranie liczników filtrów dla kaskadowego filtrowania
  getFilterCounts: (params = {}) => apiClient.get('/api/ads/filter-counts', { params }),

  // Pobieranie statystyk wyszukiwania z licznikami marek i modeli
  getSearchStats: (params = {}) => apiClient.get('/api/ads/search-stats', { params }),

  // Pobieranie wszystkich dostępnych marek samochodów
  getBrands: () => apiClient.get('/api/ads/brands'),

  // Pobieranie modeli dla wybranej marki
  getModels: (brand) => apiClient.get('/api/ads/models', { params: { brand } }),

  // Pobieranie pojedynczego ogłoszenia
  getById: (id) => apiClient.get(`/api/ads/${id}`),

  // Tworzenie nowego ogłoszenia
  create: (adData) => apiClient.post('/api/ads', adData),

  // Dodanie ogłoszenia ze zdjęciami (FormData)
  addListing: (formData) => 
    apiClient.post('/api/ads/add', formData, {
      withCredentials: true
    }),

  // Aktualizacja ogłoszenia
  update: (id, adData) => apiClient.put(`/api/ads/${id}`, adData),

  // Usuwanie ogłoszenia
  delete: (id) => apiClient.delete(`/api/ads/${id}`),

  // Przeszukiwanie ogłoszeń (przekazuje wszystkie filtry jako params)
  search: (params = {}) => apiClient.get('/api/ads/search', { params }),

  // ✅ POPRAWKA: Używaj endpointu z Twojego backendu
  getUserAds: () => apiClient.get('/api/ads/user/listings'),

  // ✅ DODANE: Rotowane ogłoszenia dla strony głównej
  getRotatedListings: () => apiClient.get('/api/ads/rotated'),

  // Pobieranie wyróżnionych ogłoszeń
  getFeatured: () => apiClient.get('/api/ads/featured'),

  // Oznaczanie ogłoszenia jako wyróżnione
  markAsFeatured: (id) => apiClient.post(`/api/ads/${id}/featured`),

  // Upload zdjęć do ogłoszenia
  uploadImages: (id, formData) =>
    apiClient.post(`/api/ads/${id}/images`, formData),

  // ✅ DODANE: Usuwanie zdjęcia z ogłoszenia
  deleteImage: (id, index) => 
    apiClient.delete(`/api/ads/${id}/images/${index}`),

  // ✅ DODANE: Ustawienie głównego zdjęcia
  setMainImage: (id, mainImageIndex) =>
    apiClient.put(`/api/ads/${id}/main-image`, { mainImageIndex }),

  // Dodawanie ogłoszenia do ulubionych
  addToFavorites: (id) => apiClient.post(`/api/users/favorites/${id}`),

  // Usuwanie ogłoszenia z ulubionych
  removeFromFavorites: (id) => apiClient.delete(`/api/users/favorites/${id}`),

  // Pobieranie ulubionych ogłoszeń użytkownika
  getFavorites: () => apiClient.get('/api/users/favorites'),

  // Sprawdzanie czy ogłoszenie jest w ulubionych
  checkIsFavorite: (id) => apiClient.get(`/api/users/favorites/${id}/check`),
  
  // Aktualizacja statusu ogłoszenia
  updateStatus: (id, status) => apiClient.put(`/api/ads/${id}/status`, { status }),

  // ✅ DODANE: Aktualizacja zdjęć w ogłoszeniu
  updateListingImages: (id, imageData) => apiClient.patch(`/api/ads/${id}/images`, imageData),

  // ✅ ZAKTUALIZOWANE: Przedłużenie ogłoszenia używające dedykowanego endpointu
  extendListing: (id) => apiClient.post(`/api/ads/${id}/renew`),

  // ✅ DODANE: Zakończenie ogłoszenia
  finishListing: (id) => apiClient.put(`/api/ads/${id}/status`, { status: 'archived' }),
};

export default AdsService;
