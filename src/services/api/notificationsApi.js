// src/services/api/notificationsApi.js

import apiClient from './client';

/**
 * Serwis REST API do obsługi powiadomień
 * @notice Ten serwis jest uzupełnieniem serwisu WebSocket (notifications.js)
 */
const NotificationsService = {
  /**
   * Pobieranie wszystkich powiadomień z filtrowaniem i paginacją
   * @param {Object} params - Parametry zapytania (strona, limit, isRead, typ, sortowanie)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getAll: (params = {}) => 
    apiClient.get('/notifications', { params })
      .then(response => response.data),

  /**
   * Pobieranie nieprzeczytanych powiadomień
   * @param {number} limit - Limit wyników
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getUnread: (limit = 10) => 
    apiClient.get('/notifications/unread', { params: { limit } })
      .then(response => response.data),

  /**
   * Pobieranie liczby nieprzeczytanych powiadomień
   * @returns {Promise<{unreadCount: number}>} - Promise rozwiązywane liczbą nieprzeczytanych
   */
  getUnreadCount: () => 
    apiClient.get('/notifications/unread/count')
      .then(response => response.data),

  /**
   * Oznaczanie powiadomienia jako przeczytane
   * @param {string} id - ID powiadomienia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  markAsRead: (id) => 
    apiClient.put(`/notifications/${id}/read`)
      .then(response => response.data),

  /**
   * Oznaczanie wszystkich powiadomień jako przeczytane
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  markAllAsRead: () => 
    apiClient.put('/notifications/read-all')
      .then(response => response.data),

  /**
   * Usuwanie powiadomienia
   * @param {string} id - ID powiadomienia
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  delete: (id) => 
    apiClient.delete(`/notifications/${id}`)
      .then(response => response.data)
};

export default NotificationsService;