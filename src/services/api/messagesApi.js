// src/services/api/messagesApi.js

import apiClient from './client'; // Importuj client.js z tego samego katalogu

const MessagesService = {
  // Pobieranie wiadomości dla danego folderu
  getByFolder: (folder = 'inbox') => apiClient.get(`/messages/${folder}`),

  // Pobieranie pojedynczej wiadomości
  getById: (id) => apiClient.get(`/messages/${id}`),

  // Wysyłanie nowej wiadomości
  send: (messageData) => apiClient.post('/messages', messageData),

  // Zapisywanie wersji roboczej
  saveDraft: (messageData) => apiClient.post('/messages/drafts', messageData),

  // Oznaczanie jako przeczytane
  markAsRead: (id) => apiClient.put(`/messages/${id}/read`),

  // Przełączanie gwiazdki (oznaczanie/odznaczanie wiadomości)
  toggleStar: (id) => apiClient.put(`/messages/${id}/star`),

  // Usuwanie wiadomości
  delete: (id) => apiClient.delete(`/messages/${id}`),

  // Wyszukiwanie wiadomości
  search: (query, folder) =>
    apiClient.get('/messages/search', {
      params: { query, folder }
    }),

  // Pobieranie sugestii użytkowników do wysyłki wiadomości
  getUserSuggestions: (query) =>
    apiClient.get('/messages/users', {
      params: { query }
    })
};

export default MessagesService;