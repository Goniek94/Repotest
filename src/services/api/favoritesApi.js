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
    const response = await apiClient.get('/favorites');
    return response.data;
  },

  /**
   * Dodawanie ogłoszenia do ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  async addToFavorites(adId) {
    const response = await apiClient.post(`/favorites/add/${adId}`);
    return response.data;
  },

  /**
   * Usuwanie ogłoszenia z ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  async removeFromFavorites(adId) {
    const response = await apiClient.delete(`/favorites/remove/${adId}`);
    return response.data;
  },

  /**
   * Sprawdzanie, czy ogłoszenie jest w ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise<{isFavorite: boolean}>} - Promise rozwiązywane statusem
   */
  async checkIsFavorite(adId) {
    const response = await apiClient.get(`/favorites/check/${adId}`);
    return response.data;
  }
};

export default FavoritesService;