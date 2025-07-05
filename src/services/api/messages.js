import apiClient from './client';
import { debug } from '../../utils/debug';
import * as sendApi from './messages/sendApi';

/**
 * Serwis do obsługi wiadomości i konwersacji - NAPRAWIONY I ZOPTYMALIZOWANY
 * Zapewnia interfejs do komunikacji z API wiadomości
 */
const MessagesService = {
  // === KONWERSACJE ===
  
  /**
   * Oznaczanie konwersacji jako przeczytanej
   * @param {string} userId - ID użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  markConversationAsRead: async (userId) => {
    try {
      debug(`Oznaczanie konwersacji z użytkownikiem ${userId} jako przeczytanej`);
      const response = await apiClient.patch(`/messages/conversation/${userId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas oznaczania konwersacji z użytkownikiem ${userId} jako przeczytanej:`, error);
      throw error;
    }
  },

  /**
   * Oznaczanie konwersacji gwiazdką
   * @param {string} userId - ID użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  toggleConversationStar: async (userId) => {
    try {
      debug(`Przełączanie gwiazdki dla konwersacji z użytkownikiem ${userId}`);
      const response = await apiClient.patch(`/messages/conversation/${userId}/star`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas przełączania gwiazdki dla konwersacji z użytkownikiem ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Usuwanie konwersacji
   * @param {string} userId - ID użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  deleteConversation: async (userId) => {
    try {
      debug(`Usuwanie konwersacji z użytkownikiem ${userId}`);
      const response = await apiClient.delete(`/messages/conversation/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas usuwania konwersacji z użytkownikiem ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Przenoszenie konwersacji do archiwum
   * @param {string} userId - ID użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  archiveConversation: async (userId) => {
    try {
      debug(`Archiwizowanie konwersacji z użytkownikiem ${userId}`);
      const response = await apiClient.patch(`/messages/conversation/${userId}/archive`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas archiwizowania konwersacji z użytkownikiem ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Przywracanie konwersacji z archiwum
   * @param {string} userId - ID użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  unarchiveConversation: async (userId) => {
    try {
      debug(`Przywracanie konwersacji z użytkownikiem ${userId} z archiwum`);
      const response = await apiClient.patch(`/messages/conversation/${userId}/unarchive`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas przywracania konwersacji z użytkownikiem ${userId} z archiwum:`, error);
      throw error;
    }
  },

  /**
   * Przenoszenie konwersacji do kosza
   * @param {string} userId - ID użytkownika
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  moveConversationToTrash: async (userId) => {
    try {
      debug(`Przenoszenie konwersacji z użytkownikiem ${userId} do kosza`);
      const response = await apiClient.patch(`/messages/conversation/${userId}/trash`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas przenoszenia konwersacji z użytkownikiem ${userId} do kosza:`, error);
      throw error;
    }
  },

  /**
   * Przenoszenie konwersacji do folderu
   * @param {string} userId - ID użytkownika
   * @param {string} folder - Folder docelowy
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  moveConversationToFolder: async (userId, folder) => {
    try {
      debug(`Przenoszenie konwersacji z użytkownikiem ${userId} do folderu ${folder}`);
      const response = await apiClient.patch(`/messages/conversation/${userId}/move`, { folder });
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas przenoszenia konwersacji z użytkownikiem ${userId} do folderu ${folder}:`, error);
      throw error;
    }
  },

  /**
   * 🔥 NAPRAWIONA FUNKCJA - Odpowiadanie na konwersację 
   * @param {string} userId - ID użytkownika
   * @param {FormData|Object} messageData - Dane wiadomości (FormData lub obiekt)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  replyToConversation: async (userId, messageData) => {
    try {
      console.log('🚀 WYWOŁANIE replyToConversation:', { userId, messageData });
      
      if (!userId) {
        throw new Error('userId jest wymagany');
      }
      
      // Sprawdź czy messageData to FormData czy obiekt
      let dataToSend = messageData;
      
      if (!(messageData instanceof FormData)) {
        // Jeśli to nie FormData, stwórz FormData
        const formData = new FormData();
        
        if (messageData.content) {
          formData.append('content', messageData.content);
        }
        
        // Obsługa załączników
        if (messageData.attachments && Array.isArray(messageData.attachments)) {
          messageData.attachments.forEach((attachment, index) => {
            if (attachment.file) {
              formData.append('attachments', attachment.file);
            }
          });
        }
        
        dataToSend = formData;
      }
      
      console.log('📤 Wysyłanie danych:', dataToSend);
      
      const response = await apiClient.post(`/messages/conversation/${userId}/reply`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ Odpowiedź z serwera:', response.data);
      return response.data;
    } catch (error) {
      console.error(`💥 Błąd podczas odpowiadania na konwersację z użytkownikiem ${userId}:`, error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Wyszukiwanie konwersacji
   * @param {string} query - Fraza do wyszukania
   * @param {string} folder - Folder, w którym szukamy
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  searchConversations: async (query, folder = 'inbox') => {
    try {
      debug(`Wyszukiwanie konwersacji zawierających "${query}" w folderze ${folder}`);
      const response = await apiClient.get(`/messages/conversations/search?query=${encodeURIComponent(query)}&folder=${folder}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas wyszukiwania konwersacji zawierających "${query}" w folderze ${folder}:`, error);
      throw error;
    }
  },
  
  // === WIADOMOŚCI ===
  /**
   * Pobieranie wiadomości z określonego folderu
   * @param {string} folder - Folder wiadomości (inbox, sent, starred, archived, trash)
   * @param {Object} options - Opcje zapytania
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getByFolder: async (folder, options = {}) => {
    try {
      debug(`Pobieranie wiadomości z folderu: ${folder}`);
      const response = await apiClient.get(`/messages/${folder}`, options);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania wiadomości z folderu ${folder}:`, error);
      throw error;
    }
  },

  /**
   * Pobieranie pojedynczej wiadomości
   * @param {string} messageId - ID wiadomości
   * @param {Object} options - Opcje zapytania
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getMessage: async (messageId, options = {}) => {
    try {
      debug(`Pobieranie wiadomości o ID: ${messageId}`);
      const response = await apiClient.get(`/messages/message/${messageId}`, options);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania wiadomości ${messageId}:`, error);
      throw error;
    }
  },

  /**
   * 🔥 NAPRAWIONA FUNKCJA - Pobieranie listy konwersacji
   * @param {string} folder - Folder wiadomości (inbox, sent, starred, archived, trash)
   * @param {Object} options - Opcje zapytania
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getConversationsList: async (folder, options = {}) => {
    try {
      console.log('📋 Pobieranie listy konwersacji:', { folder, options });
      
      const response = await apiClient.get(`/messages/conversations`, {
        params: { folder, ...options.params },
        ...options
      });
      
      console.log('✅ Lista konwersacji pobrana:', response.data);
      return response.data;
    } catch (error) {
      console.error(`💥 Błąd podczas pobierania listy konwersacji z folderu ${folder}:`, error);
      throw error;
    }
  },

  /**
   * 🔥 NAPRAWIONA FUNKCJA - Pobieranie konwersacji z określonym użytkownikiem
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje zapytania
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  getConversation: async (userId, options = {}) => {
    try {
      console.log('💬 Pobieranie konwersacji z użytkownikiem:', { userId, options });
      
      if (!userId) {
        throw new Error('userId jest wymagany');
      }
      
      const response = await apiClient.get(`/messages/conversation/${userId}`, options);
      
      console.log('✅ Konwersacja pobrana:', response.data);
      return response.data;
    } catch (error) {
      console.error(`💥 Błąd podczas pobierania konwersacji z użytkownikiem ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Wysyłanie nowej wiadomości
   * @param {Object} messageData - Dane wiadomości (recipient, subject, content, attachments)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  sendMessage: async (messageData) => {
    try {
      debug('Wysyłanie nowej wiadomości');
      const response = await apiClient.post('/messages/send', messageData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      throw error;
    }
  },

  /**
   * Wysyłanie wiadomości do użytkownika
   * @param {string} userId - ID użytkownika
   * @param {Object} messageData - Dane wiadomości (subject, content, attachments)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  sendMessageToUser: async (userId, messageData) => {
    try {
      debug(`Wysyłanie wiadomości do użytkownika: ${userId}`);
      const response = await apiClient.post(`/messages/send-to-user/${userId}`, messageData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas wysyłania wiadomości do użytkownika ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Wysyłanie wiadomości do właściciela ogłoszenia
   * @param {string} adId - ID ogłoszenia
   * @param {Object} messageData - Dane wiadomości (subject, content, attachments)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  sendMessageToAd: async (adId, messageData) => {
    try {
      debug(`Wysyłanie wiadomości do ogłoszenia: ${adId}`);
      const response = await apiClient.post(`/messages/send-to-ad/${adId}`, messageData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas wysyłania wiadomości do ogłoszenia ${adId}:`, error);
      throw error;
    }
  },

  /**
   * Odpowiadanie na wiadomość
   * @param {string} messageId - ID wiadomości
   * @param {Object} messageData - Dane odpowiedzi (content, attachments)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  replyToMessage: async (messageId, messageData) => {
    try {
      debug(`Odpowiadanie na wiadomość: ${messageId}`);
      const response = await apiClient.post(`/messages/reply/${messageId}`, messageData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas odpowiadania na wiadomość ${messageId}:`, error);
      throw error;
    }
  },

  /**
   * Oznaczanie wiadomości jako przeczytanej
   * @param {string} messageId - ID wiadomości
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  markAsRead: async (messageId) => {
    try {
      debug(`Oznaczanie wiadomości jako przeczytanej: ${messageId}`);
      const response = await apiClient.patch(`/messages/read/${messageId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas oznaczania wiadomości ${messageId} jako przeczytanej:`, error);
      throw error;
    }
  },

  /**
   * Oznaczanie wiadomości gwiazdką
   * @param {string} messageId - ID wiadomości
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  toggleStar: async (messageId) => {
    try {
      debug(`Przełączanie gwiazdki dla wiadomości: ${messageId}`);
      const response = await apiClient.patch(`/messages/star/${messageId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas przełączania gwiazdki dla wiadomości ${messageId}:`, error);
      throw error;
    }
  },

  /**
   * Przenoszenie wiadomości do archiwum
   * @param {string} messageId - ID wiadomości
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  archiveMessage: async (messageId) => {
    try {
      debug(`Archiwizowanie wiadomości: ${messageId}`);
      const response = await apiClient.patch(`/messages/archive/${messageId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas archiwizowania wiadomości ${messageId}:`, error);
      throw error;
    }
  },

  /**
   * Przywracanie wiadomości z archiwum
   * @param {string} messageId - ID wiadomości
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  unarchiveMessage: async (messageId) => {
    try {
      debug(`Przywracanie wiadomości z archiwum: ${messageId}`);
      const response = await apiClient.patch(`/messages/unarchive/${messageId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas przywracania wiadomości ${messageId} z archiwum:`, error);
      throw error;
    }
  },

  /**
   * Usuwanie wiadomości
   * @param {string} messageId - ID wiadomości
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  deleteMessage: async (messageId) => {
    try {
      debug(`Usuwanie wiadomości: ${messageId}`);
      const response = await apiClient.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas usuwania wiadomości ${messageId}:`, error);
      throw error;
    }
  },
  
  /**
   * Alias dla deleteMessage (dla kompatybilności)
   */
  delete: function(messageId) {
    return this.deleteMessage(messageId);
  },

  /**
   * 🔥 DODANA FUNKCJA - Alias dla sendMessage (dla kompatybilności)
   */
  send: function(messageData) {
    return this.sendMessage(messageData);
  },

  /**
   * 🔥 DODANA FUNKCJA - Alias dla getMessage (dla kompatybilności)
   */
  getById: function(messageId) {
    return this.getMessage(messageId);
  },

  /**
   * 🔥 DODANA FUNKCJA - Wyszukiwanie użytkowników
   * @param {string} query - Fraza do wyszukania
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  searchUsers: async (query) => {
    try {
      debug(`Wyszukiwanie użytkowników: "${query}"`);
      const response = await apiClient.get(`/messages/users/suggestions?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas wyszukiwania użytkowników "${query}":`, error);
      throw error;
    }
  },

  /**
   * Przenoszenie wiadomości do folderu
   * @param {string} messageId - ID wiadomości
   * @param {string} folder - Folder docelowy
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  moveToFolder: async (messageId, folder) => {
    try {
      debug(`Przenoszenie wiadomości ${messageId} do folderu ${folder}`);
      const response = await apiClient.patch(`/messages/${messageId}/move`, { folder });
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas przenoszenia wiadomości ${messageId} do folderu ${folder}:`, error);
      throw error;
    }
  },

  /**
   * Wyszukiwanie wiadomości
   * @param {string} query - Fraza do wyszukania
   * @param {string} folder - Folder, w którym szukamy (inbox, sent, starred, archived, trash)
   * @returns {Promise} - Promise rozwiązywane danymi odpowiedzi
   */
  search: async (query, folder = 'inbox') => {
    try {
      debug(`Wyszukiwanie wiadomości zawierających "${query}" w folderze ${folder}`);
      const response = await apiClient.get(`/messages/search?query=${encodeURIComponent(query)}&folder=${folder}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas wyszukiwania wiadomości zawierających "${query}" w folderze ${folder}:`, error);
      throw error;
    }
  },
  ...sendApi
};

export default MessagesService;
