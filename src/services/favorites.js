import apiClient from './api/client';

const FavoritesService = {
  // Pobieranie wszystkich ulubionych ogłoszeń użytkownika
  getAll: () => apiClient.get('/api/favorites'),

  // Dodawanie ogłoszenia do ulubionych
  addToFavorites: (adId) => apiClient.post(`/api/favorites/add/${adId}`),

  // Usuwanie ogłoszenia z ulubionych
  removeFromFavorites: (adId) => apiClient.delete(`/api/favorites/remove/${adId}`),

  // Sprawdzanie, czy ogłoszenie jest w ulubionych
  checkIsFavorite: (adId) => apiClient.get(`/api/favorites/check/${adId}`)
};

export default FavoritesService;
