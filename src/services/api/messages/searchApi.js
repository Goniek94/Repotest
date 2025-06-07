// src/services/api/messages/searchApi.js

import apiClient from '../client';
import { getAuthToken } from '../config';

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
 * Wyszukiwanie wiadomości w danym folderze
 * @param {string} query - Fraza do wyszukania
 * @param {string} folder - Folder, w którym szukamy (inbox, sent, archived, etc.)
 * @returns {Promise} - Promise z wynikami wyszukiwania
 */
const search = (query, folder = 'inbox') => {
  if (!query || query.trim().length === 0) {
    console.error('search: Brak parametru query');
    return Promise.reject(new Error('Brak frazy do wyszukania'));
  }
  
  debug(`Wyszukiwanie wiadomości zawierających "${query}" w folderze ${folder}`);
  return executeWithRetry(() => 
    apiClient.get('/messages/search', { 
      params: { query, folder } 
    })
    .then(response => {
      debug(`Odpowiedź z wyszukiwania wiadomości:`, response.data);
      return response.data;
    })
  );
};

/**
 * Pobieranie sugestii użytkowników do wysyłania wiadomości
 * @param {string} query - Fraza do wyszukania
 * @returns {Promise} - Promise z sugestiami użytkowników
 */
const getUserSuggestions = (query) => {
  if (!query || query.trim().length === 0) {
    console.error('getUserSuggestions: Brak parametru query');
    return Promise.resolve([]); // Zwracamy pustą tablicę zamiast błędu, bo to bardziej user-friendly
  }
  
  // Nie wyszukujemy dla bardzo krótkich zapytań (mniej niż 2 znaki)
  if (query.trim().length < 2) {
    return Promise.resolve([]);
  }
  
  debug(`Pobieranie sugestii użytkowników dla frazy "${query}"`);
  return executeWithRetry(() => 
    apiClient.get('/messages/users/suggestions', { 
      params: { query } 
    })
    .then(response => {
      debug(`Odpowiedź z sugestiami użytkowników:`, response.data);
      return response.data;
    })
  );
};

/**
 * Wyszukiwanie użytkowników po nazwie, emailu, itp.
 * @param {string} query - Fraza do wyszukania
 * @returns {Promise} - Promise z wynikami wyszukiwania użytkowników
 */
const searchUsers = (query) => {
  if (!query || query.trim().length === 0) {
    console.error('searchUsers: Brak parametru query');
    return Promise.resolve([]); // Zwracamy pustą tablicę zamiast błędu, bo to bardziej user-friendly
  }
  
  // Nie wyszukujemy dla bardzo krótkich zapytań (mniej niż 2 znaki)
  if (query.trim().length < 2) {
    return Promise.resolve([]);
  }
  
  debug(`Wyszukiwanie użytkowników dla frazy "${query}"`);
  return executeWithRetry(() => 
    apiClient.get('/messages/users/search', { 
      params: { query } 
    })
    .then(response => {
      debug(`Odpowiedź z wyszukiwania użytkowników:`, response.data);
      
      // Jeśli odpowiedź nie jest tablicą, zwracamy pustą tablicę
      if (!Array.isArray(response.data)) {
        console.warn('Odpowiedź z wyszukiwania użytkowników nie jest tablicą');
        return [];
      }
      
      return response.data;
    })
  );
};

/**
 * Wyszukiwanie konwersacji (grupowanie wiadomości po użytkownikach)
 * @param {string} query - Fraza do wyszukania
 * @param {string} folder - Folder, w którym szukamy (inbox, sent, archived, etc.)
 * @returns {Promise} - Promise z wynikami wyszukiwania konwersacji
 */
const searchConversations = (query, folder = 'inbox') => {
  if (!query || query.trim().length === 0) {
    console.error('searchConversations: Brak parametru query');
    return Promise.reject(new Error('Brak frazy do wyszukania'));
  }
  
  // Nie wyszukujemy dla bardzo krótkich zapytań (mniej niż 2 znaki)
  if (query.trim().length < 2) {
    debug(`Zapytanie "${query}" jest zbyt krótkie do wyszukiwania konwersacji`);
    return Promise.resolve([]);
  }
  
  debug(`Wyszukiwanie konwersacji zawierających "${query}" w folderze ${folder}`);
  return executeWithRetry(() => 
    apiClient.get('/messages/conversations/search', { 
      params: { query, folder } 
    })
    .then(response => {
      debug(`Odpowiedź z wyszukiwania konwersacji:`, response.data);
      
      // Jeśli API konwersacji nie jest dostępne, używamy zwykłego wyszukiwania i grupujemy wyniki
      if (!response.data || !Array.isArray(response.data)) {
        debug('Odpowiedź z API konwersacji nieprawidłowa, próba fallbacku...');
        return search(query, folder)
          .then(messages => {
            if (!Array.isArray(messages)) {
              return [];
            }
            
            // Grupowanie wiadomości według użytkownika
            const conversationsByUser = {};
            
            messages.forEach(message => {
              const otherUser = message.sender ? message.sender : message.recipient;
              const otherUserId = otherUser?._id;
              
              if (otherUserId) {
                if (!conversationsByUser[otherUserId]) {
                  conversationsByUser[otherUserId] = {
                    _id: message._id,
                    user: otherUser,
                    lastMessage: message,
                    unreadCount: message.read ? 0 : 1,
                    starred: message.starred,
                    folder: message.folder || folder,
                    messages: [message]
                  };
                } else {
                  conversationsByUser[otherUserId].messages.push(message);
                  
                  // Aktualizuj datę i treść, jeśli ta wiadomość jest nowsza
                  const messageDate = new Date(message.createdAt);
                  const lastMessageDate = new Date(conversationsByUser[otherUserId].lastMessage.createdAt);
                  if (messageDate > lastMessageDate) {
                    conversationsByUser[otherUserId].lastMessage = message;
                  }
                  
                  // Zwiększ licznik nieprzeczytanych
                  if (!message.read) {
                    conversationsByUser[otherUserId].unreadCount += 1;
                  }
                }
              }
            });
            
            // Konwersja obiektu na tablicę i sortowanie według daty ostatniej wiadomości
            return Object.values(conversationsByUser).sort((a, b) => 
              new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
            );
          });
      }
      
      return response.data;
    })
  );
};

export {
  search,
  getUserSuggestions,
  searchUsers,
  searchConversations
};