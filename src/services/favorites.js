import apiClient from './api/client';

const FavoritesService = {
  // Pobieranie wszystkich ulubionych ogłoszeń użytkownika
  getAll: (params = {}) => apiClient.get('/api/user/favorites', { params }),

  // Dodawanie ogłoszenia do ulubionych
  addToFavorites: (adId) => apiClient.post(`/api/user/favorites/${adId}`),

  // Usuwanie ogłoszenia z ulubionych
  removeFromFavorites: (adId) => apiClient.delete(`/api/user/favorites/${adId}`),

  // Toggle favorite status (add/remove)
  toggleFavorite: (adId) => apiClient.post(`/api/user/favorites/${adId}/toggle`),

  // Sprawdzanie, czy ogłoszenie jest w ulubionych
  checkIsFavorite: (adId) => apiClient.get(`/api/user/favorites/${adId}/check`),

  // Pobieranie liczby ulubionych
  getFavoritesCount: () => apiClient.get('/api/user/favorites/count')
};

export default FavoritesService;
