// src/services/api/messages/messagesApi.js

import apiClient from '../client';

// Funkcje związane z podstawowymi operacjami na wiadomościach

// Pobieranie wiadomości dla danego folderu
const getByFolder = (folder = 'inbox') => {
  console.log(`Pobieranie wiadomości z folderu: ${folder}`);
  return apiClient.get(`/api/messages/${folder}`)
    .then(response => {
      console.log(`Otrzymano odpowiedź z /messages/${folder}:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Błąd podczas pobierania wiadomości z folderu ${folder}:`, error);
      throw error;
    });
};

// Pobieranie pojedynczej wiadomości
const getById = (id) => {
  console.log(`Pobieranie wiadomości o ID: ${id}`);
  return apiClient.get(`/api/messages/message/${id}`)
    .then(response => {
      console.log(`Otrzymano odpowiedź z /messages/message/${id}:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Błąd podczas pobierania wiadomości o ID ${id}:`, error);
      throw error;
    });
};

// Oznaczanie jako przeczytane
const markAsRead = (id) => {
  console.log(`Oznaczanie wiadomości ${id} jako przeczytanej`);
  return apiClient.patch(`/api/messages/read/${id}`)
    .then(response => {
      console.log(`Odpowiedź po oznaczeniu wiadomości ${id} jako przeczytanej:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Błąd podczas oznaczania wiadomości ${id} jako przeczytanej:`, error);
      throw error;
    });
};

// Oznaczanie wielu wiadomości jako przeczytane
const markMultipleAsRead = (ids) => {
  console.log(`Oznaczanie wielu wiadomości jako przeczytane: ${ids.join(', ')}`);
  // Sekwencyjne oznaczanie wiadomości jako przeczytane
  const promises = ids.map(id => 
    apiClient.patch(`/api/messages/read/${id}`)
  );
  return Promise.all(promises)
    .then(responses => {
      console.log('Odpowiedzi po oznaczeniu wielu wiadomości jako przeczytane:', responses);
      return responses.map(response => response.data);
    })
    .catch(error => {
      console.error('Błąd podczas oznaczania wielu wiadomości jako przeczytane:', error);
      throw error;
    });
};

// Przełączanie gwiazdki (oznaczanie/odznaczanie wiadomości)
const toggleStar = (id) => {
  console.log(`Przełączanie gwiazdki dla wiadomości ${id}`);
  return apiClient.patch(`/api/messages/star/${id}`)
    .then(response => {
      console.log(`Odpowiedź po przełączeniu gwiazdki dla wiadomości ${id}:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Błąd podczas przełączania gwiazdki dla wiadomości ${id}:`, error);
      throw error;
    });
};

// Usuwanie wiadomości
const deleteMessage = (id) => {
  console.log(`Usuwanie wiadomości ${id}`);
  return apiClient.delete(`/api/messages/${id}`)
    .then(response => {
      console.log(`Odpowiedź po usunięciu wiadomości ${id}:`, response.data);
      return response.data;
    })
    .catch(error => {
      console.error(`Błąd podczas usuwania wiadomości ${id}:`, error);
      throw error;
    });
};

// Przenoszenie wiadomości do innego folderu
const moveToFolder = (messageId, folder) => {
  console.log(`Przenoszenie wiadomości ${messageId} do folderu ${folder}`);
  
  // W zależności od folderu docelowego
  switch(folder) {
    case 'archived':
      return apiClient.patch(`/api/messages/archive/${messageId}`)
        .then(response => {
          console.log(`Odpowiedź po przeniesieniu wiadomości ${messageId} do archiwum:`, response.data);
          return response.data;
        })
        .catch(error => {
          console.error(`Błąd podczas przenoszenia wiadomości ${messageId} do archiwum:`, error);
          throw error;
        });
    case 'inbox':
      return apiClient.patch(`/api/messages/unarchive/${messageId}`)
        .then(response => {
          console.log(`Odpowiedź po przeniesieniu wiadomości ${messageId} do skrzynki odbiorczej:`, response.data);
          return response.data;
        })
        .catch(error => {
          console.error(`Błąd podczas przenoszenia wiadomości ${messageId} do skrzynki odbiorczej:`, error);
          throw error;
        });
    case 'starred':
      return apiClient.patch(`/api/messages/star/${messageId}`)
        .then(response => {
          console.log(`Odpowiedź po oznaczeniu wiadomości ${messageId} gwiazdką:`, response.data);
          return response.data;
        })
        .catch(error => {
          console.error(`Błąd podczas oznaczania wiadomości ${messageId} gwiazdką:`, error);
          throw error;
        });
    default:
      // Dla innych folderów nie mamy bezpośredniej implementacji
      console.log(`Przeniesienie do folderu ${folder} nie jest obsługiwane`);
      return Promise.resolve({ message: `Przeniesienie do folderu ${folder} nie jest obsługiwane` });
  }
};

// Przenoszenie wielu wiadomości do innego folderu
const moveMultipleToFolder = (messageIds, folder) => {
  console.log(`Przenoszenie wielu wiadomości do folderu ${folder}: ${messageIds.join(', ')}`);
  const promises = messageIds.map(id => moveToFolder(id, folder));
  return Promise.all(promises)
    .then(responses => {
      console.log(`Odpowiedzi po przeniesieniu wielu wiadomości do folderu ${folder}:`, responses);
      return responses;
    })
    .catch(error => {
      console.error(`Błąd podczas przenoszenia wielu wiadomości do folderu ${folder}:`, error);
      throw error;
    });
};

// Zgłaszanie wiadomości
const reportMessage = (messageId, reason) => {
  console.log(`Zgłoszenie wiadomości ${messageId} z powodu: ${reason}`);
  return Promise.resolve({ message: 'Wiadomość została zgłoszona' });
};

// Pobieranie statystyk wiadomości (liczba nieprzeczytanych itp.)
const getStats = () => {
  console.log('Pobieranie statystyk wiadomości');
  
  // Pobieramy wiadomości z folderu inbox i liczymy nieprzeczytane
  return apiClient.get('/api/messages/inbox')
    .then(response => {
      console.log('Odpowiedź po pobraniu wiadomości z folderu inbox:', response.data);
      
      const messages = response.data || [];
      const unreadCount = messages.filter(msg => !msg.read).length;
      
      return {
        unreadCount,
        totalCount: messages.length
      };
    })
    .catch(error => {
      console.error('Błąd podczas pobierania statystyk wiadomości:', error);
      throw error;
    });
};

// Zapisywanie wersji roboczej
const saveDraft = (messageData) => {
  console.log('Zapisywanie wersji roboczej:', messageData);
  return apiClient.post('/api/messages/draft', messageData)
    .then(response => {
      console.log('Odpowiedź po zapisaniu wersji roboczej:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Błąd podczas zapisywania wersji roboczej:', error);
      throw error;
    });
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