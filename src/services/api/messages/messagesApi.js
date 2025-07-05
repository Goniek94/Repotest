// src/services/api/messages/messagesApi.js

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

// Funkcje związane z podstawowymi operacjami na wiadomościach

// Pobieranie wiadomości dla danego folderu
const getByFolder = (folder = 'inbox') => {
  debug(`Pobieranie wiadomości z folderu: ${folder}`);
  return executeWithRetry(() => 
    apiClient.get(`/messages/${folder}`)
      .then(response => {
        debug(`Otrzymano odpowiedź z /messages/${folder}:`, response.data);
        return response.data;
      })
  );
};

// Pobieranie pojedynczej wiadomości
const getById = (id) => {
  if (!id) {
    console.error('getById: Brak parametru id');
    return Promise.reject(new Error('Brak identyfikatora wiadomości'));
  }
  
  debug(`Pobieranie wiadomości o ID: ${id}`);
  return executeWithRetry(() => 
    apiClient.get(`/messages/message/${id}`)
      .then(response => {
        debug(`Otrzymano odpowiedź z /messages/message/${id}:`, response.data);
        return response.data;
      })
  );
};

// Oznaczanie jako przeczytane
const markAsRead = (id) => {
  if (!id) {
    console.error('markAsRead: Brak parametru id');
    return Promise.reject(new Error('Brak identyfikatora wiadomości'));
  }
  
  debug(`Oznaczanie wiadomości ${id} jako przeczytanej`);
  return executeWithRetry(() => 
    apiClient.patch(`/messages/read/${id}`)
      .then(response => {
        debug(`Odpowiedź po oznaczeniu wiadomości ${id} jako przeczytanej:`, response.data);
        return response.data;
      })
  );
};

// Oznaczanie wielu wiadomości jako przeczytane
const markMultipleAsRead = (ids) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    console.error('markMultipleAsRead: Brak lub nieprawidłowy parametr ids');
    return Promise.reject(new Error('Brak lub nieprawidłowa lista identyfikatorów wiadomości'));
  }
  
  debug(`Oznaczanie wielu wiadomości jako przeczytane: ${ids.join(', ')}`);
  
  // Oznaczanie każdej wiadomości oddzielnie z obsługą błędów dla każdej
  const markPromises = ids.map(id => 
    executeWithRetry(() => apiClient.patch(`/messages/read/${id}`))
      .catch(error => {
        console.error(`Błąd podczas oznaczania wiadomości ${id} jako przeczytanej:`, error);
        return { success: false, messageId: id, error };
      })
  );
  
  return Promise.all(markPromises)
    .then(responses => {
      const successCount = responses.filter(r => r.data || r.success).length;
      debug(`Pomyślnie oznaczono ${successCount}/${ids.length} wiadomości jako przeczytane`);
      return {
        success: true,
        totalCount: ids.length,
        successCount,
        results: responses
      };
    });
};

// Przełączanie gwiazdki (oznaczanie/odznaczanie wiadomości)
const toggleStar = (id) => {
  if (!id) {
    console.error('toggleStar: Brak parametru id');
    return Promise.reject(new Error('Brak identyfikatora wiadomości'));
  }
  
  debug(`Przełączanie gwiazdki dla wiadomości ${id}`);
  return executeWithRetry(() => 
    apiClient.patch(`/messages/star/${id}`)
      .then(response => {
        debug(`Odpowiedź po przełączeniu gwiazdki dla wiadomości ${id}:`, response.data);
        return response.data;
      })
  );
};

// Usuwanie wiadomości
const deleteMessage = (id) => {
  if (!id) {
    console.error('deleteMessage: Brak parametru id');
    return Promise.reject(new Error('Brak identyfikatora wiadomości'));
  }
  
  debug(`Usuwanie wiadomości ${id}`);
  return executeWithRetry(() => 
    apiClient.delete(`/messages/${id}`)
      .then(response => {
        debug(`Odpowiedź po usunięciu wiadomości ${id}:`, response.data);
        return response.data;
      })
  );
};

// Przenoszenie wiadomości do innego folderu
const moveToFolder = (messageId, folder) => {
  if (!messageId) {
    console.error('moveToFolder: Brak parametru messageId');
    return Promise.reject(new Error('Brak identyfikatora wiadomości'));
  }
  
  if (!folder) {
    console.error('moveToFolder: Brak parametru folder');
    return Promise.reject(new Error('Brak nazwy folderu docelowego'));
  }
  
  debug(`Przenoszenie wiadomości ${messageId} do folderu ${folder}`);
  
  // W zależności od folderu docelowego
  switch(folder) {
    case 'archived':
      return executeWithRetry(() => 
        apiClient.patch(`/messages/archive/${messageId}`)
          .then(response => {
            debug(`Odpowiedź po przeniesieniu wiadomości ${messageId} do archiwum:`, response.data);
            return response.data;
          })
      );
    case 'inbox':
      return executeWithRetry(() => 
        apiClient.patch(`/messages/unarchive/${messageId}`)
          .then(response => {
            debug(`Odpowiedź po przeniesieniu wiadomości ${messageId} do skrzynki odbiorczej:`, response.data);
            return response.data;
          })
      );
    case 'starred':
      return executeWithRetry(() => 
        apiClient.patch(`/messages/star/${messageId}`)
          .then(response => {
            debug(`Odpowiedź po oznaczeniu wiadomości ${messageId} gwiazdką:`, response.data);
            return response.data;
          })
      );
    case 'trash':
      return executeWithRetry(() => 
        apiClient.delete(`/messages/${messageId}`)
          .then(response => {
            debug(`Odpowiedź po przeniesieniu wiadomości ${messageId} do kosza:`, response.data);
            return response.data;
          })
      );
    default:
      // Dla innych folderów nie mamy bezpośredniej implementacji
      debug(`Przeniesienie do folderu ${folder} nie jest obsługiwane`);
      return Promise.resolve({ 
        success: false, 
        message: `Przeniesienie do folderu ${folder} nie jest obsługiwane` 
      });
  }
};

// Przenoszenie wielu wiadomości do innego folderu
const moveMultipleToFolder = (messageIds, folder) => {
  if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
    console.error('moveMultipleToFolder: Brak lub nieprawidłowy parametr messageIds');
    return Promise.reject(new Error('Brak lub nieprawidłowa lista identyfikatorów wiadomości'));
  }
  
  if (!folder) {
    console.error('moveMultipleToFolder: Brak parametru folder');
    return Promise.reject(new Error('Brak nazwy folderu docelowego'));
  }
  
  debug(`Przenoszenie wielu wiadomości do folderu ${folder}: ${messageIds.join(', ')}`);
  const movePromises = messageIds.map(id => moveToFolder(id, folder)
    .catch(error => {
      console.error(`Błąd podczas przenoszenia wiadomości ${id} do folderu ${folder}:`, error);
      return { success: false, messageId: id, error };
    })
  );
  
  return Promise.all(movePromises)
    .then(responses => {
      const successCount = responses.filter(r => r.success !== false).length;
      debug(`Pomyślnie przeniesiono ${successCount}/${messageIds.length} wiadomości do folderu ${folder}`);
      return {
        success: true,
        totalCount: messageIds.length,
        successCount,
        results: responses
      };
    });
};

// Zgłaszanie wiadomości
const reportMessage = (messageId, reason) => {
  if (!messageId) {
    console.error('reportMessage: Brak parametru messageId');
    return Promise.reject(new Error('Brak identyfikatora wiadomości'));
  }
  
  debug(`Zgłoszenie wiadomości ${messageId} z powodu: ${reason || 'nie podano'}`);
  // Aktualnie nie mamy implementacji API, więc zwracamy mock
  return Promise.resolve({ 
    success: true, 
    message: 'Wiadomość została zgłoszona', 
    messageId, 
    reason 
  });
};

// Pobieranie statystyk wiadomości (liczba nieprzeczytanych itp.)
const getStats = () => {
  debug('Pobieranie statystyk wiadomości');
  
  // Pobieramy wiadomości z folderu inbox i liczymy nieprzeczytane
  return executeWithRetry(() => 
    apiClient.get('/messages/inbox')
      .then(response => {
        debug('Odpowiedź po pobraniu wiadomości z folderu inbox:', response.data);
        
        const messages = response.data || [];
        const unreadCount = Array.isArray(messages) 
          ? messages.filter(msg => !msg.read).length
          : 0;
        
        return {
          success: true,
          unreadCount,
          totalCount: Array.isArray(messages) ? messages.length : 0
        };
      })
  );
};

// Zapisywanie wersji roboczej
const saveDraft = (messageData) => {
  if (!messageData) {
    console.error('saveDraft: Brak danych wiadomości');
    return Promise.reject(new Error('Brak danych wiadomości'));
  }
  
  debug('Zapisywanie wersji roboczej:', messageData);
  
  const config = messageData instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  return executeWithRetry(() => 
    apiClient.post('/messages/draft', messageData, config)
      .then(response => {
        debug('Odpowiedź po zapisaniu wersji roboczej:', response.data);
        return response.data;
      })
  );
};

export {
  getByFolder,
  getById,
  markAsRead,
  markMultipleAsRead,
  toggleStar,
  deleteMessage,
  moveToFolder,
  moveMultipleToFolder,
  reportMessage,
  getStats,
  saveDraft
};
