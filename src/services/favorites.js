import apiClient from './api/client';

const FavoritesService = {
  // Pobieranie wszystkich ulubionych ogłoszeń użytkownika
  getAll: () => apiClient.get('/api/users/favorites'),

  // Dodawanie ogłoszenia do ulubionych
  addToFavorites: (adId) => apiClient.post(`/api/users/favorites/${adId}`),

  // Usuwanie ogłoszenia z ulubionych
  removeFromFavorites: (adId) => apiClient.delete(`/api/users/favorites/${adId}`),

  // Sprawdzanie, czy ogłoszenie jest w ulubionych
  checkIsFavorite: (adId) => apiClient.get(`/api/users/favorites/${adId}/check`)
};

export default FavoritesService;
