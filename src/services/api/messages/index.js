// src/services/api/messages/index.js

// Importujemy wszystkie funkcje z poszczególnych modułów
import * as ConversationsAPI from './conversationsApi';
import * as MessagesAPI from './messagesApi';
import * as SearchAPI from './searchApi';
import * as SendAPI from './sendApi';

// Tworzymy obiekt MessagesService, który będzie zawierał wszystkie funkcje
const MessagesService = {
  // Funkcje z conversationsApi.js
  getConversationsList: ConversationsAPI.getConversationsList,
  getConversation: ConversationsAPI.getConversation,
  getConversationMessages: ConversationsAPI.getConversationMessages,
  markConversationAsRead: ConversationsAPI.markConversationAsRead,
  toggleConversationStar: ConversationsAPI.toggleConversationStar,
  deleteConversation: ConversationsAPI.deleteConversation,
  archiveConversation: ConversationsAPI.archiveConversation,
  unarchiveConversation: ConversationsAPI.unarchiveConversation,
  moveConversationToTrash: ConversationsAPI.moveConversationToTrash,
  moveConversationToFolder: ConversationsAPI.moveConversationToFolder,
  replyToConversation: ConversationsAPI.replyToConversation,
  
  // Funkcje z messagesApi.js
  getByFolder: MessagesAPI.getByFolder,
  getById: MessagesAPI.getById,
  markAsRead: MessagesAPI.markAsRead,
  markMultipleAsRead: MessagesAPI.markMultipleAsRead,
  toggleStar: MessagesAPI.toggleStar,
  delete: MessagesAPI.deleteMessage, // Zmiana nazwy z deleteMessage na delete dla zachowania kompatybilności
  moveToFolder: MessagesAPI.moveToFolder,
  moveMultipleToFolder: MessagesAPI.moveMultipleToFolder,
  reportMessage: MessagesAPI.reportMessage,
  getStats: MessagesAPI.getStats,
  saveDraft: MessagesAPI.saveDraft,
  
  // Funkcje z searchApi.js
  search: SearchAPI.search,
  getUserSuggestions: SearchAPI.getUserSuggestions,
  searchUsers: SearchAPI.searchUsers,
  searchConversations: SearchAPI.searchConversations,
  
  // Funkcje z sendApi.js
  send: SendAPI.send,
  sendToUser: SendAPI.sendToUser,
  sendToAd: SendAPI.sendToAd,
  replyToMessage: SendAPI.replyToMessage
};

// Eksportujemy zarówno całe API jako domyślny eksport, jak i poszczególne funkcje
export default MessagesService;

// Eksport poszczególnych modułów do selektywnego importu
export {
  ConversationsAPI,
  MessagesAPI,
  SearchAPI,
  SendAPI
};

// Reeksport wszystkich funkcji dla wygody
export * from './conversationsApi';
export * from './messagesApi';
export * from './searchApi';
export * from './sendApi';