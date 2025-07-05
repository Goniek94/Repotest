// src/services/api/messages/sendApi.js

import apiClient from '../client';
import { getAuthToken } from '../config';
import { debug } from '../../../utils/debug';

// Maksymalna liczba prób ponownego wykonania zapytania
const MAX_RETRIES = 3;

/**
 * Wykonuje zapytanie z możliwością ponownych prób w przypadku błędów autoryzacji
 * @param {Function} requestFn - Funkcja wykonująca zapytanie
 * @param {number} retries - Liczba pozostałych prób
 * @returns {Promise} - Promise z wynikiem zapytania
 */
const executeWithRetry = async (requestFn, retries = MAX_RETRIES) => {
  try {
    return await requestFn();
  } catch (error) {
    console.error('Błąd zapytania API:', error);
    
    // Jeśli błąd 401 i mamy token oraz są jeszcze próby
    if (error.response?.status === 401 && getAuthToken() && retries > 0) {
      debug(`Ponowna próba po błędzie 401 (pozostało prób: ${retries})`);
      // Odczekaj chwilę przed ponowną próbą
      await new Promise(resolve => setTimeout(resolve, 1000));
      return executeWithRetry(requestFn, retries - 1);
    }
    
    throw error;
  }
};

/**
 * Wysyłanie nowej wiadomości - ogólna funkcja
 * @param {Object|FormData} messageData - Dane wiadomości (lub FormData z załącznikami)
 * @returns {Promise} - Promise z wynikiem operacji
 */
const send = (messageData) => {
  if (!messageData) {
    console.error('send: Brak danych wiadomości');
    return Promise.reject(new Error('Brak danych wiadomości'));
  }
  
  debug('Wysyłanie nowej wiadomości:', messageData instanceof FormData ? '[FormData]' : messageData);
  
  // Dla FormData nie ustawiamy Content-Type - axios zrobi to automatycznie z boundary
  const config = messageData instanceof FormData 
    ? {} 
    : {};
  
  return executeWithRetry(() => 
    apiClient.post('/messages/send', messageData, config)
      .then(response => {
        debug('Odpowiedź po wysłaniu wiadomości:', response.data);
        return response.data;
      })
  );
};

/**
 * Wysyłanie wiadomości do konkretnego użytkownika
 * @param {string} userId - ID użytkownika, do którego wysyłamy wiadomość
 * @param {Object|FormData} messageData - Dane wiadomości (lub FormData z załącznikami)
 * @returns {Promise} - Promise z wynikiem operacji
 */
const sendToUser = (userId, messageData) => {
  if (!userId) {
    console.error('sendToUser: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  if (!messageData) {
    console.error('sendToUser: Brak danych wiadomości');
    return Promise.reject(new Error('Brak danych wiadomości'));
  }
  
  debug(`Wysyłanie wiadomości do użytkownika ${userId}:`, messageData instanceof FormData ? '[FormData]' : messageData);
  
  // Dla FormData nie ustawiamy Content-Type - axios zrobi to automatycznie z boundary
  const config = messageData instanceof FormData 
    ? {} 
    : {};
  
  return executeWithRetry(() => 
    apiClient.post(`/messages/send-to-user/${userId}`, messageData, config)
      .then(response => {
        debug(`Odpowiedź po wysłaniu wiadomości do użytkownika ${userId}:`, response.data);
        return response.data;
      })
  );
};

/**
 * Wysyłanie wiadomości do właściciela ogłoszenia
 * @param {string} adId - ID ogłoszenia
 * @param {Object|FormData} messageData - Dane wiadomości (lub FormData z załącznikami)
 * @returns {Promise} - Promise z wynikiem operacji
 */
const sendToAd = (adId, messageData) => {
  if (!adId) {
    console.error('sendToAd: Brak parametru adId');
    return Promise.reject(new Error('Brak identyfikatora ogłoszenia'));
  }
  
  if (!messageData) {
    console.error('sendToAd: Brak danych wiadomości');
    return Promise.reject(new Error('Brak danych wiadomości'));
  }
  
  debug(`Wysyłanie wiadomości do właściciela ogłoszenia ${adId}:`, messageData instanceof FormData ? '[FormData]' : messageData);
  
  // Dla FormData nie ustawiamy Content-Type - axios zrobi to automatycznie z boundary
  const config = messageData instanceof FormData 
    ? {} 
    : {};
  
  return executeWithRetry(() => 
    apiClient.post(`/messages/send-to-ad/${adId}`, messageData, config)
      .then(response => {
        debug(`Odpowiedź po wysłaniu wiadomości do właściciela ogłoszenia ${adId}:`, response.data);
        return response.data;
      })
  );
};

/**
 * Odpowiadanie na konkretną wiadomość
 * @param {string} messageId - ID wiadomości, na którą odpowiadamy
 * @param {Object|FormData} messageData - Dane wiadomości (lub FormData z załącznikami)
 * @returns {Promise} - Promise z wynikiem operacji
 */
const replyToMessage = (messageId, messageData) => {
  if (!messageId) {
    console.error('replyToMessage: Brak parametru messageId');
    return Promise.reject(new Error('Brak identyfikatora wiadomości'));
  }
  
  if (!messageData) {
    console.error('replyToMessage: Brak danych wiadomości');
    return Promise.reject(new Error('Brak danych wiadomości'));
  }
  
  debug(`Odpowiadanie na wiadomość ${messageId}:`, messageData instanceof FormData ? '[FormData]' : messageData);
  
  // Dla FormData nie ustawiamy Content-Type - axios zrobi to automatycznie z boundary
  const config = messageData instanceof FormData 
    ? {} 
    : {};
  
  return executeWithRetry(() => 
    apiClient.post(`/messages/reply/${messageId}`, messageData, config)
      .then(response => {
        debug(`Odpowiedź po odpowiedzeniu na wiadomość ${messageId}:`, response.data);
        return response.data;
      })
  )
  .catch(error => {
    console.error(`Błąd podczas odpowiadania na wiadomość ${messageId}:`, error);
    
    // Jeśli wiadomość nie istnieje lub inny problem, próbujemy pobrać dane adresata
    // i wysłać nową wiadomość jako fallback
    if (error.response?.status === 404) {
      debug(`Wiadomość ${messageId} nie istnieje, próba pobrania danych adresata...`);
      
      return apiClient.get(`/messages/message/${messageId}`)
        .then(response => {
          const originalMessage = response.data;
          const recipientId = originalMessage.sender?._id;
          
          if (!recipientId) {
            throw new Error('Nie można określić adresata wiadomości');
          }
          
          debug(`Wysyłanie nowej wiadomości do użytkownika ${recipientId} jako fallback`);
          return sendToUser(recipientId, messageData);
        })
        .catch(fallbackError => {
          console.error('Błąd podczas próby fallbacku:', fallbackError);
          throw error; // Zwracamy oryginalny błąd
        });
    }
    
    throw error;
  });
};

export {
  send,
  sendToUser,
  sendToAd,
  replyToMessage
};
