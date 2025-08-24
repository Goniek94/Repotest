// src/services/api/transactionsApi.js

import apiClient from './client';

/**
 * Serwis do obsługi transakcji i płatności
 */
const TransactionsService = {
  /**
   * Pobieranie historii transakcji użytkownika
   * @param {Object} params - Parametry zapytania
   * @param {number} params.page - Numer strony (domyślnie 1)
   * @param {number} params.limit - Limit wyników na stronę (domyślnie 10)
   * @param {string} params.status - Filtr statusu transakcji
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getHistory: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/payments/transactions?${queryString}` : '/payments/transactions';
    
    return apiClient.get(url)
      .then(response => response.data)
      .catch(error => {
        console.error('Błąd podczas pobierania historii transakcji:', error);
        throw error;
      });
  },

  /**
   * Pobieranie szczegółów pojedynczej transakcji
   * @param {string} transactionId - ID transakcji
   * @returns {Promise} - Promise rozwiązywane danymi transakcji
   */
  getTransaction: (transactionId) => 
    apiClient.get(`/payments/transactions/${transactionId}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Błąd podczas pobierania transakcji:', error);
        throw error;
      }),

  /**
   * Tworzenie nowej transakcji
   * @param {Object} transactionData - Dane transakcji
   * @param {string} transactionData.adId - ID ogłoszenia
   * @param {number} transactionData.amount - Kwota transakcji
   * @param {string} transactionData.type - Typ transakcji (standard_listing, featured_listing)
   * @param {string} transactionData.paymentMethod - Metoda płatności
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  createTransaction: (transactionData) => 
    apiClient.post('/payments/transactions', transactionData)
      .then(response => response.data)
      .catch(error => {
        console.error('Błąd podczas tworzenia transakcji:', error);
        throw error;
      }),

  /**
   * Przetwarzanie płatności za ogłoszenie (legacy - dla wstecznej kompatybilności)
   * @param {Object} paymentData - Dane płatności
   * @param {string} paymentData.adId - ID ogłoszenia
   * @param {number} paymentData.amount - Kwota płatności
   * @param {string} paymentData.paymentMethod - Metoda płatności
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  processPayment: (paymentData) => 
    apiClient.post('/payments/process', paymentData)
      .then(response => response.data)
      .catch(error => {
        console.error('Błąd podczas przetwarzania płatności:', error);
        throw error;
      }),

  /**
   * Żądanie faktury dla transakcji
   * @param {string} transactionId - ID transakcji
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  requestInvoice: (transactionId) => 
    apiClient.post(`/payments/transactions/${transactionId}/invoice`)
      .then(response => response.data)
      .catch(error => {
        console.error('Błąd podczas żądania faktury:', error);
        throw error;
      }),

  /**
   * Pobieranie faktury PDF
   * @param {string} transactionId - ID transakcji
   * @returns {Promise} - Promise rozwiązywane blob'em PDF
   */
  downloadInvoice: (transactionId) => 
    apiClient.get(`/payments/transactions/${transactionId}/invoice/download`, {
      responseType: 'blob'
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Błąd podczas pobierania faktury:', error);
      throw error;
    }),

  /**
   * Eksport transakcji do CSV
   * @param {Object} filters - Filtry eksportu
   * @param {string} filters.startDate - Data początkowa
   * @param {string} filters.endDate - Data końcowa
   * @param {string} filters.status - Status transakcji
   * @returns {Promise} - Promise rozwiązywane blob'em CSV
   */
  exportTransactions: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.status) queryParams.append('status', filters.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/payments/transactions/export?${queryString}` : '/payments/transactions/export';
    
    return apiClient.get(url, {
      responseType: 'blob'
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Błąd podczas eksportu transakcji:', error);
      throw error;
    });
  }
};

export default TransactionsService;
