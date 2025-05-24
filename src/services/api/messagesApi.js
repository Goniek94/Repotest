// src/services/api/messagesApi.js

import apiClient from './client';

const MessagesService = {
  // Pobieranie wiadomości dla danego folderu
  getByFolder: (folder = 'inbox') => {
    return apiClient.get(`/messages/${folder}`)
      .then(response => response.data);
  },

  // Pobieranie pojedynczej wiadomości
  getById: (id) => {
    return apiClient.get(`/messages/message/${id}`)
      .then(response => response.data);
  },

  // Wysyłanie nowej wiadomości
  send: (messageData) => {
    const config = messageData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return apiClient.post('/messages/send', messageData, config)
      .then(response => response.data);
  },

  // Wysyłanie wiadomości do użytkownika
  sendToUser: (userId, messageData) => {
    const config = messageData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return apiClient.post(`/messages/send-to-user/${userId}`, messageData, config)
      .then(response => response.data);
  },

  // Wysyłanie wiadomości do ogłoszenia
  sendToAd: (adId, messageData) => {
    const config = messageData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return apiClient.post(`/messages/send-to-ad/${adId}`, messageData, config)
      .then(response => response.data);
  },

  // Odpowiadanie na wiadomość
  replyToMessage: (messageId, messageData) => {
    const config = messageData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return apiClient.post(`/messages/reply/${messageId}`, messageData, config)
      .then(response => response.data);
  },

  // Zapisywanie wersji roboczej
  saveDraft: (messageData) => {
    return apiClient.post('/messages/drafts', messageData)
      .then(response => response.data);
  },

  // Oznaczanie jako przeczytane
  markAsRead: (id) => {
    return apiClient.patch(`/messages/read/${id}`)
      .then(response => response.data);
  },

  // Przełączanie gwiazdki (oznaczanie/odznaczanie wiadomości)
  toggleStar: (id) => {
    return apiClient.patch(`/messages/star/${id}`)
      .then(response => response.data);
  },

  // Usuwanie wiadomości
  delete: (id) => {
    return apiClient.delete(`/messages/${id}`)
      .then(response => response.data);
  },

  // Wyszukiwanie wiadomości
  search: (query, folder) => {
    return apiClient.get('/messages/search', {
      params: { query, folder }
    }).then(response => response.data);
  },

  // Pobieranie sugestii użytkowników do wysyłki wiadomości
  getUserSuggestions: (query) => {
    return apiClient.get('/messages/users', {
      params: { query }
    }).then(response => response.data);
  },

  // Pobieranie listy konwersacji
  getConversationsList: () => {
    return apiClient.get('/messages/conversations')
      .then(response => response.data);
  },

  // Pobieranie konkretnej konwersacji
  getConversation: (conversationId) => {
    return apiClient.get(`/messages/conversation/${conversationId}`)
      .then(response => response.data);
  }
};

export default MessagesService;
