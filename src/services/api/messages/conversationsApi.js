// src/services/api/messages/conversationsApi.js

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

// Pobieranie listy konwersacji
const getConversationsList = (folder = 'inbox', options = {}) => {
  debug(`Pobieranie listy konwersacji z folderu: ${folder}`);
  return executeWithRetry(() => 
    apiClient.get('/messages/conversations', {
      params: { folder },
      signal: options.signal
    })
    .then(response => {
      debug('Odpowiedź z /messages/conversations:', response.data);
      return response.data;
    })
  );
};

// Pobieranie konwersacji z konkretnym użytkownikiem
const getConversation = (userId, options = {}) => {
  if (!userId) {
    console.error('getConversation: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  debug(`Pobieranie konwersacji z użytkownikiem ${userId}`);
  return executeWithRetry(() => 
    apiClient.get(`/messages/conversation/${userId}`, { signal: options.signal })
      .then(response => {
        debug(`Odpowiedź z /messages/conversation/${userId}:`, response.data);
        return response.data;
      })
  );
};

// Alias dla getConversation - dla zachowania kompatybilności
const getConversationMessages = (userId) => {
  if (!userId) {
    console.error('getConversationMessages: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  debug(`Pobieranie wiadomości z konwersacji z użytkownikiem ${userId}`);
  return getConversation(userId);
};

// Oznaczanie konwersacji jako przeczytanej
const markConversationAsRead = (userId) => {
  if (!userId) {
    console.error('markConversationAsRead: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  debug(`Oznaczanie konwersacji z użytkownikiem ${userId} jako przeczytanej`);
  
  // Najpierw pobieramy konwersację, aby uzyskać ID wiadomości
  return executeWithRetry(() => 
    getConversation(userId)
      .then(conversation => {
        if (!conversation || !conversation.messages) {
          console.warn('Nie znaleziono wiadomości w konwersacji');
          return { success: true, message: 'Brak wiadomości w konwersacji' };
        }
        
        // Oznacz wszystkie nieprzeczytane wiadomości jako przeczytane
        const unreadMessages = conversation.messages.filter(msg => 
          !msg.read && msg.sender && msg.sender._id !== userId
        );
        
        if (unreadMessages.length === 0) {
          debug('Brak nieprzeczytanych wiadomości w konwersacji');
          return { success: true, message: 'Brak nieprzeczytanych wiadomości' };
        }
        
        // Tworzenie tablicy promises dla każdej wiadomości
        const markPromises = unreadMessages.map(msg => 
          apiClient.patch(`/messages/read/${msg._id}`)
        );
        
        return Promise.all(markPromises)
          .then(() => {
            debug(`Oznaczono ${unreadMessages.length} wiadomości jako przeczytane`);
            return { success: true, count: unreadMessages.length };
          });
      })
  );
};

// Oznaczanie konwersacji jako ważnej (gwiazdka)
const toggleConversationStar = (userId) => {
  if (!userId) {
    console.error('toggleConversationStar: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  debug(`Przełączanie gwiazdki dla konwersacji z użytkownikiem ${userId}`);
  
  return executeWithRetry(() => 
    getConversation(userId)
      .then(conversation => {
        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
          console.warn('Nie znaleziono wiadomości w konwersacji');
          return { success: false, message: 'Brak wiadomości w konwersacji' };
        }
        
        // Użyj najnowszej wiadomości w konwersacji
        const latestMessage = conversation.messages.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
        
        return apiClient.patch(`/messages/star/${latestMessage._id}`)
          .then(response => {
            debug(`Przełączono gwiazdkę dla konwersacji z użytkownikiem ${userId}`);
            return response.data;
          });
      })
  );
};

// Usuwanie konwersacji
const deleteConversation = (userId) => {
  if (!userId) {
    console.error('deleteConversation: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  debug(`Usuwanie konwersacji z użytkownikiem ${userId}`);
  
  return executeWithRetry(() => 
    getConversation(userId)
      .then(conversation => {
        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
          console.warn('Nie znaleziono wiadomości w konwersacji');
          return { success: true, message: 'Brak wiadomości w konwersacji' };
        }
        
        // Usuwanie wszystkich wiadomości w konwersacji
        const deletePromises = conversation.messages.map(msg => 
          apiClient.delete(`/messages/${msg._id}`)
        );
        
        return Promise.all(deletePromises)
          .then(() => {
            debug(`Usunięto ${conversation.messages.length} wiadomości z konwersacji`);
            return { success: true, count: conversation.messages.length };
          });
      })
  );
};

// Przenoszenie konwersacji do archiwum
const archiveConversation = (userId) => {
  if (!userId) {
    console.error('archiveConversation: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  debug(`Przenoszenie konwersacji z użytkownikiem ${userId} do archiwum`);
  
  return executeWithRetry(() => 
    getConversation(userId)
      .then(conversation => {
        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
          console.warn('Nie znaleziono wiadomości w konwersacji');
          return { success: true, message: 'Brak wiadomości w konwersacji' };
        }
        
        // Archiwizacja wszystkich wiadomości w konwersacji
        const archivePromises = conversation.messages.map(msg => 
          apiClient.patch(`/messages/archive/${msg._id}`)
        );
        
        return Promise.all(archivePromises)
          .then(() => {
            debug(`Zarchiwizowano ${conversation.messages.length} wiadomości z konwersacji`);
            return { success: true, count: conversation.messages.length };
          });
      })
  );
};

// Przywracanie konwersacji z archiwum
const unarchiveConversation = (userId) => {
  if (!userId) {
    console.error('unarchiveConversation: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  debug(`Przywracanie konwersacji z użytkownikiem ${userId} z archiwum`);
  
  return executeWithRetry(() => 
    getConversation(userId)
      .then(conversation => {
        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
          console.warn('Nie znaleziono wiadomości w konwersacji');
          return { success: true, message: 'Brak wiadomości w konwersacji' };
        }
        
        // Przywracanie wszystkich wiadomości z archiwum
        const unarchivePromises = conversation.messages.map(msg => 
          apiClient.patch(`/messages/unarchive/${msg._id}`)
        );
        
        return Promise.all(unarchivePromises)
          .then(() => {
            debug(`Przywrócono ${conversation.messages.length} wiadomości z archiwum`);
            return { success: true, count: conversation.messages.length };
          });
      })
  );
};

// Przenoszenie konwersacji do kosza
const moveConversationToTrash = (userId) => {
  if (!userId) {
    console.error('moveConversationToTrash: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  debug(`Przenoszenie konwersacji z użytkownikiem ${userId} do kosza`);
  return deleteConversation(userId);
};

// Przenoszenie konwersacji do folderu
const moveConversationToFolder = (userId, folder) => {
  if (!userId) {
    console.error('moveConversationToFolder: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  if (!folder) {
    console.error('moveConversationToFolder: Brak parametru folder');
    return Promise.reject(new Error('Brak nazwy folderu docelowego'));
  }
  
  debug(`Przenoszenie konwersacji z użytkownikiem ${userId} do folderu ${folder}`);
  
  // Określenie akcji na podstawie folderu docelowego
  switch(folder) {
    case 'archived':
      return archiveConversation(userId);
    case 'inbox':
      return unarchiveConversation(userId);
    case 'trash':
      return moveConversationToTrash(userId);
    default:
      debug(`Przeniesienie do folderu ${folder} nie jest bezpośrednio obsługiwane`);
      return Promise.resolve({ success: false, message: `Przeniesienie do folderu ${folder} nie jest obsługiwane` });
  }
};

// Odpowiadanie na konwersację
const replyToConversation = (userId, messageData) => {
  if (!userId) {
    console.error('replyToConversation: Brak parametru userId');
    return Promise.reject(new Error('Brak identyfikatora użytkownika'));
  }
  
  if (!messageData) {
    console.error('replyToConversation: Brak treści wiadomości');
    return Promise.reject(new Error('Brak treści wiadomości'));
  }
  
  debug(`Odpowiadanie na konwersację z użytkownikiem ${userId}`);
  
  const config = messageData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
    
  return executeWithRetry(() => 
    getConversation(userId)
      .then(conversation => {
        if (!conversation || !conversation.messages || conversation.messages.length === 0) {
          console.warn('Nie znaleziono wiadomości w konwersacji');
          
          // Fallback - wysyłamy nową wiadomość
          debug(`Wysyłanie nowej wiadomości do użytkownika ${userId}`);
          return apiClient.post(`/messages/send-to-user/${userId}`, messageData, config)
            .then(response => {
              debug(`Wysłano nową wiadomość do użytkownika ${userId}`);
              return response.data;
            });
        }
        
        // Użyj najnowszej wiadomości w konwersacji jako referencji
        const latestMessage = conversation.messages.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
        
        // Odpowiedz na tę wiadomość
        return apiClient.post(`/messages/reply/${latestMessage._id}`, messageData, config)
          .then(response => {
            debug(`Odpowiedziano na wiadomość w konwersacji z użytkownikiem ${userId}`);
            return response.data;
          })
          .catch(replyError => {
            console.error(`Błąd podczas odpowiadania na wiadomość:`, replyError);
            
            // Fallback - wysyłamy nową wiadomość
            debug(`Próba wysłania nowej wiadomości do użytkownika ${userId}`);
            return apiClient.post(`/messages/send-to-user/${userId}`, messageData, config)
              .then(response => {
                debug(`Wysłano nową wiadomość do użytkownika ${userId}`);
                return response.data;
              });
          });
      })
  );
};

export {
  getConversationsList,
  getConversation,
  getConversationMessages,
  markConversationAsRead,
  toggleConversationStar,
  deleteConversation,
  archiveConversation,
  unarchiveConversation,
  moveConversationToTrash,
  moveConversationToFolder,
  replyToConversation
};
