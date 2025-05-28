// src/services/api/messages/searchApi.js

import apiClient from '../client';

// Funkcje związane z wyszukiwaniem wiadomości i użytkowników

// Wyszukiwanie wiadomości
const search = (query, folder) => {
  console.log(`Wyszukiwanie wiadomości z zapytaniem "${query}" w folderze ${folder}`);
  return apiClient.get('/api/messages/search', {
    params: { query, folder }
  })
  .then(response => {
    console.log(`Odpowiedź po wyszukiwaniu wiadomości z zapytaniem "${query}" w folderze ${folder}:`, response.data);
    return response.data;
  })
  .catch(error => {
    console.error(`Błąd podczas wyszukiwania wiadomości z zapytaniem "${query}" w folderze ${folder}:`, error);
    throw error;
  });
};

// Pobieranie sugestii użytkowników do wysyłki wiadomości
const getUserSuggestions = (query) => {
  console.log(`Pobieranie sugestii użytkowników z zapytaniem "${query}"`);
  return apiClient.get('/api/messages/users/suggestions', {
    params: { query }
  })
  .then(response => {
    console.log(`Odpowiedź po pobraniu sugestii użytkowników z zapytaniem "${query}":`, response.data);
    return response.data;
  })
  .catch(error => {
    console.error(`Błąd podczas pobierania sugestii użytkowników z zapytaniem "${query}":`, error);
    throw error;
  });
};

// Wyszukiwanie użytkowników
const searchUsers = (query) => {
  console.log(`Wyszukiwanie użytkowników z zapytaniem "${query}"`);
  return apiClient.get('/api/users/search', {
    params: { query }
  })
  .then(response => {
    console.log(`Odpowiedź po wyszukiwaniu użytkowników z zapytaniem "${query}":`, response.data);
    return response.data;
  })
  .catch(error => {
    console.error(`Błąd podczas wyszukiwania użytkowników z zapytaniem "${query}":`, error);
    throw error;
  });
};

// Wyszukiwanie konwersacji
const searchConversations = (query, folder) => {
  console.log(`Wyszukiwanie konwersacji z zapytaniem "${query}" w folderze ${folder}`);
  
  // Używamy endpointu wyszukiwania wiadomości
  return apiClient.get('/api/messages/search', {
    params: { query, folder }
  })
  .then(response => {
    console.log(`Odpowiedź po wyszukiwaniu wiadomości z zapytaniem "${query}" w folderze ${folder}:`, response.data);
    
    // Konwertujemy wyniki wyszukiwania na format konwersacji
    const messages = response.data || [];
    
    // Grupujemy wiadomości według nadawcy/odbiorcy
    const conversationsByUser = {};
    
    messages.forEach(message => {
      // Określamy ID drugiego użytkownika (nie bieżącego użytkownika)
      const otherUser = message.sender._id !== message.recipient._id ? 
        (message.folder === 'sent' ? message.recipient : message.sender) : 
        message.recipient; // w przypadku wiadomości do siebie
      
      const otherUserId = otherUser._id;
      
      if (!conversationsByUser[otherUserId]) {
        conversationsByUser[otherUserId] = {
          _id: message._id,
          user: {
            _id: otherUser._id,
            name: otherUser.name || 'Nieznany użytkownik',
            email: otherUser.email || ''
          },
          lastMessage: message,
          unreadCount: message.folder !== 'sent' && !message.read ? 1 : 0,
          starred: message.starred,
          folder: folder
        };
      } else {
        // Aktualizuj datę i treść, jeśli ta wiadomość jest nowsza
        const messageDate = new Date(message.createdAt);
        const currentLastMessageDate = new Date(conversationsByUser[otherUserId].lastMessage.createdAt);
        
        if (messageDate > currentLastMessageDate) {
          conversationsByUser[otherUserId].lastMessage = message;
        }
        
        // Zwiększ licznik nieprzeczytanych
        if (message.folder !== 'sent' && !message.read) {
          conversationsByUser[otherUserId].unreadCount += 1;
        }
        
        // Aktualizuj status oznaczenia gwiazdką
        if (message.starred) {
          conversationsByUser[otherUserId].starred = true;
        }
      }
    });
    
    // Konwertuj obiekt na tablicę
    return Object.values(conversationsByUser);
  })
  .catch(error => {
    console.error(`Błąd podczas wyszukiwania konwersacji z zapytaniem "${query}" w folderze ${folder}:`, error);
    throw error;
  });
};

export {
  search,
  getUserSuggestions,
  searchUsers,
  searchConversations
};