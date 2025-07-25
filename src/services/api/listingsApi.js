// src/services/api/listingsApi.js

import apiClient from './client';

/**
 * Serwis do obsługi ogłoszeń
 */
const ListingsService = {
  /**
   * Pobieranie wszystkich ogłoszeń (z paginacją i filtrami)
   * @param {Object} params - Parametry zapytania (strona, limit, filtry)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getAll: (params = {}) => 
    apiClient.get('/ads', { params })
      .then(response => response.data),

  /**
   * Pobieranie ogłoszenia po ID
   * @param {string} id - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getById: (id) => 
    apiClient.get(`/ads/${id}`)
      .then(response => response.data),

  /**
   * Dodawanie nowego ogłoszenia (wymaga autoryzacji)
   * @param {FormData} formData - Dane ogłoszenia z załącznikami
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  add: (formData) => 
    apiClient.post('/ads/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => response.data),

  /**
   * Pobieranie ogłoszeń użytkownika (wymaga autoryzacji)
   * @param {Object} params - Parametry zapytania (strona, limit)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getUserListings: (params = {}) => 
    apiClient.get('/ads/user/listings', { params })
      .then(response => response.data.ads),

  /**
   * Edycja ogłoszenia
   * @param {string} id - ID ogłoszenia
   * @param {FormData} formData - Zaktualizowane dane ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  update: (id, formData) => 
    apiClient.put(`/ads/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => response.data),

  /**
   * Usuwanie ogłoszenia
   * @param {string} id - ID ogłoszenia
   * @param {boolean} confirmed - Czy potwierdzono usunięcie
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  delete: (id, confirmed = false) => 
    apiClient.delete(`/ads/${id}${confirmed ? '?confirmed=true' : ''}`)
      .then(response => response.data),
      
  /**
   * Zakończenie ogłoszenia (przeniesienie do zakończonych)
   * @param {string} id - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  finishListing: (id) => 
    apiClient.put(`/ads/${id}/status`, { status: 'archived' })
      .then(response => response.data),
      
  /**
   * Usuwanie zdjęcia z ogłoszenia
   * @param {string} adId - ID ogłoszenia
   * @param {number} imageIndex - Indeks zdjęcia do usunięcia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  deleteImage: (adId, imageIndex) => 
    apiClient.delete(`/ads/${adId}/images/${imageIndex}`)
      .then(response => response.data),

  /**
   * Pobieranie wyróżnionych ogłoszeń (rotacja)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getRotated: () => {
    console.log('ListingsService.getRotated: Wywołuję endpoint /ads/rotated...');
    return apiClient.get('/ads/rotated')
      .then(response => {
        console.log('ListingsService.getRotated: Odpowiedź z /ads/rotated:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('ListingsService.getRotated: Błąd podczas pobierania rotowanych ogłoszeń:', error);
        if (error.response) {
          console.error('Status błędu:', error.response.status);
          console.error('Dane odpowiedzi:', error.response.data);
        } else if (error.request) {
          console.error('Nie otrzymano odpowiedzi, problem z połączeniem:', error.request);
        } else {
          console.error('Błąd konfiguracji zapytania:', error.message);
        }
        throw error;
      });
  },
      
  /**
   * Pobieranie wyróżnionych ogłoszeń (rotacja) - alias dla getRotated
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getRotatedListings: () => {
    console.log('ListingsService.getRotatedListings: Wywołuję endpoint /ads/rotated...');
    return apiClient.get('/ads/rotated')
      .then(response => {
        console.log('ListingsService.getRotatedListings: Odpowiedź z /ads/rotated:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('ListingsService.getRotatedListings: Błąd podczas pobierania rotowanych ogłoszeń:', error);
        if (error.response) {
          console.error('Status błędu:', error.response.status);
          console.error('Dane odpowiedzi:', error.response.data);
        } else if (error.request) {
          console.error('Nie otrzymano odpowiedzi, problem z połączeniem:', error.request);
        } else {
          console.error('Błąd konfiguracji zapytania:', error.message);
        }
        throw error;
      });
  },

  /**
   * Pobieranie marek
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getBrands: () => 
    apiClient.get('/ads/brands')
      .then(response => response.data),

  /**
   * Pobieranie modeli dla danej marki
   * @param {string} brand - Nazwa marki
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getModels: (brand) => 
    apiClient.get('/ads/models', { params: { brand } })
      .then(response => response.data),

  /**
   * Wyszukiwanie ogłoszeń
   * @param {Object} params - Parametry wyszukiwania
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  search: (params = {}) => 
    apiClient.get('/ads/search', { params })
      .then(response => response.data),
      
  /**
   * Przedłużenie ogłoszenia o kolejne 30 dni
   * @param {string} id - ID ogłoszenia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  extendListing: (id) => 
    apiClient.post(`/ads/${id}/extend`)
      .then(response => response.data)
};

export default ListingsService;
