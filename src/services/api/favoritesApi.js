// src/services/api/favoritesApi.js

import apiClient from './client';

/**
 * Serwis do obsługi ulubionych ogłoszeń
 * POPRAWIONE ENDPOINTY - zgodne z backendem
 */
const FavoritesService = {
  /**
   * Pobieranie wszystkich ulubionych ogłoszeń użytkownika
   * @returns {Promise<[]>}
   */
  async getAll(params = {}) {
    const response = await apiClient.get('/favorites', { params });
    return response;
  },

  /**
   * Dodawanie ogłoszenia do ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  async addToFavorites(adId) {
    const response = await apiClient.post(`/favorites/add/${adId}`);
    return response;
  },

  /**
   * Usuwanie ogłoszenia z ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  async removeFromFavorites(adId) {
    const response = await apiClient.delete(`/favorites/remove/${adId}`);
    return response;
  },

  /**
   * Toggle favorite status (add/remove) - fallback to add/remove logic
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  async toggleFavorite(adId) {
    try {
      // First check if it's already a favorite
      const checkResponse = await apiClient.get(`/favorites/check/${adId}`);
      const isFavorite = checkResponse.data.data.isFavorite;
      
      if (isFavorite) {
        // Remove from favorites
        return await apiClient.delete(`/favorites/remove/${adId}`);
      } else {
        // Add to favorites
        return await apiClient.post(`/favorites/add/${adId}`);
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Sprawdzanie, czy ogłoszenie jest w ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise<{isFavorite: boolean}>} - Promise rozwiązywane statusem
   */
  async checkIsFavorite(adId) {
    const response = await apiClient.get(`/favorites/check/${adId}`);
    return response;
  },

  /**
   * Pobieranie liczby ulubionych - fallback to counting favorites from getAll
   * @returns {Promise<{count: number}>} - Promise rozwiązywane liczbą ulubionych
   */
  async getFavoritesCount() {
    try {
      const response = await apiClient.get('/favorites');
      return {
        data: {
          count: response.data.data.favorites ? response.data.data.favorites.length : 0
        }
      };
    } catch (error) {
      throw error;
    }
  }
};

export default FavoritesService;
