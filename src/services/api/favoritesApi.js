// src/services/api/favoritesApi.js

import apiClient from './client';

/**
 * Serwis do obsługi ulubionych ogłoszeń
 */
const FavoritesService = {
  /**
   * Pobieranie wszystkich ulubionych ogłoszeń użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getAll: () => 
    apiClient.get('/favorites')
      .then(response => response.data),

  /**
   * Dodawanie ogłoszenia do ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  addToFavorites: (adId) => 
    apiClient.post(`/favorites/add/${adId}`)
      .then(response => response.data),

  /**
   * Usuwanie ogłoszenia z ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  removeFromFavorites: (adId) => 
    apiClient.delete(`/favorites/remove/${adId}`)
      .then(response => response.data),

  /**
   * Sprawdzanie, czy ogłoszenie jest w ulubionych
   * @param {string} adId - ID ogłoszenia
   * @returns {Promise<{isFavorite: boolean}>} - Promise rozwiązywane statusem
   */
  checkIsFavorite: (adId) => 
    apiClient.get(`/favorites/check/${adId}`)
      .then(response => response.data)
};

export default FavoritesService;