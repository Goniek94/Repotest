// src/services/api/transactionsApi.js

import apiClient from './client';

/**
 * Serwis do obsługi transakcji i płatności
 */
const TransactionsService = {
  /**
   * Pobieranie historii płatności/transakcji
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getHistory: () => 
    apiClient.get('/payments/history')
      .then(response => response.data),

  /**
   * Przetwarzanie płatności za ogłoszenie
   * @param {Object} paymentData - Dane płatności
   * @param {string} paymentData.adId - ID ogłoszenia
   * @param {number} paymentData.amount - Kwota płatności
   * @param {string} paymentData.paymentMethod - Metoda płatności
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  processPayment: (paymentData) => 
    apiClient.post('/payments/process', paymentData)
      .then(response => response.data)
};

export default TransactionsService;