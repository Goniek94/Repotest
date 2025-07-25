// src/services/api/favoritesApi.js

import apiClient from './client';

/**
 * Serwis do obsługi ulubionych ogłoszeń
 */
const FavoritesService = {
  /**
   * Pobieranie wszystkich ulubionych ogłoszeń użytkownika
   * @returns {Promise<[]>}
   */
  async getAll() {
    const response = await apiClient.get('/users/favorites');
    return response.data;
  },

  /**
   * Dodawanie ogłoszenia do ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  async addToFavorites(adId) {
    const response = await apiClient.post(`/users/favorites/${adId}`);
    return response.data;
  },

  /**
   * Usuwanie ogłoszenia z ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  async removeFromFavorites(adId) {
    const response = await apiClient.delete(`/users/favorites/${adId}`);
    return response.data;
  },

  /**
   * Sprawdzanie, czy ogłoszenie jest w ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise<{isFavorite: boolean}>} - Promise rozwiązywane statusem
   */
  async checkIsFavorite(adId) {
    const response = await apiClient.get(`/users/favorites/${adId}/check`);
    return response.data;
  }
};

export default FavoritesService;
