// src/services/api/messages/conversationsApi.js

import apiClient from '../client';

// Pobieranie listy konwersacji
const getConversationsList = () => {
  return apiClient.get('/api/messages/conversations');
};

// Pobieranie konwersacji z konkretnym użytkownikiem
const getConversation = (userId) => {
  return apiClient.get(`/api/messages/conversation/${userId}`);
};

// Alias dla getConversation - dla zachowania kompatybilności
const getConversationMessages = (userId) => {
  return getConversation(userId);
};

// Oznaczanie konwersacji jako przeczytanej
const markConversationAsRead = (userId) => {
  return apiClient.patch(`/api/messages/conversation/${userId}/read`);
};

// Oznaczanie konwersacji jako ważnej (gwiazdka)
const toggleConversationStar = (userId) => {
  return apiClient.patch(`/api/messages/conversation/${userId}/star`);
};

// Usuwanie konwersacji
const deleteConversation = (userId) => {
  return apiClient.delete(`/api/messages/conversation/${userId}`);
};

// Przenoszenie konwersacji do archiwum
const archiveConversation = (userId) => {
  return apiClient.patch(`/api/messages/conversation/${userId}/archive`);
};

// Przywracanie konwersacji z archiwum
const unarchiveConversation = (userId) => {
  return apiClient.patch(`/api/messages/conversation/${userId}/unarchive`);
};

// Przenoszenie konwersacji do kosza
const moveConversationToTrash = (userId) => {
  return deleteConversation(userId);
};

// Przenoszenie konwersacji do folderu
const moveConversationToFolder = (userId, folder) => {
  return apiClient.patch(`/api/messages/conversation/${userId}/move`, { folder });
};

// Odpowiadanie na konwersację
const replyToConversation = (userId, messageData) => {
  return apiClient.post(`/api/messages/conversation/${userId}/reply`, messageData);
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