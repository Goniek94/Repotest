/**
 * Ujednolicony serwis wiadomości
 * 
 * Ten plik agreguje wszystkie funkcje API związane z wiadomościami i konwersacjami.
 * Został zrefaktoryzowany, aby skupić się na modelu konwersacji, który jest nowszym
 * i bardziej efektywnym podejściem do obsługi wiadomości.
 */

// Importujemy funkcje z poszczególnych modułów
import * as ConversationsAPI from './conversationsApi';
import * as SearchAPI from './searchApi';
import * as SendAPI from './sendApi';

// Importujemy bezpośrednio funkcje z messagesApi.js, aby uniknąć cyklicznego importu
import { 
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
} from './messagesApi';

// Grupujemy funkcje z messagesApi.js dla zachowania struktury
const MessagesAPI = {
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

/**
 * Główny serwis wiadomości wykorzystujący model konwersacji
 */
const MessagesService = {
  // === KONWERSACJE (rekomendowany sposób pracy z wiadomościami) ===
  
  // Pobieranie konwersacji
  getConversationsList: ConversationsAPI.getConversationsList,
  getConversation: ConversationsAPI.getConversation,
  getConversationMessages: ConversationsAPI.getConversationMessages,
  
  // Działania na konwersacjach
  markConversationAsRead: ConversationsAPI.markConversationAsRead,
  toggleConversationStar: ConversationsAPI.toggleConversationStar,
  deleteConversation: ConversationsAPI.deleteConversation,
  
  // Zarządzanie folderami konwersacji
  archiveConversation: ConversationsAPI.archiveConversation,
  unarchiveConversation: ConversationsAPI.unarchiveConversation,
  moveConversationToTrash: ConversationsAPI.moveConversationToTrash,
  moveConversationToFolder: ConversationsAPI.moveConversationToFolder,
  
  // Wysyłanie i odpowiadanie
  replyToConversation: ConversationsAPI.replyToConversation,
  sendToUser: SendAPI.sendToUser,
  sendToAd: SendAPI.sendToAd,
  
  // Wyszukiwanie
  searchConversations: SearchAPI.searchConversations,
  getUserSuggestions: SearchAPI.getUserSuggestions,
  searchUsers: SearchAPI.searchUsers,
  
  // === KOMPATYBILNOŚĆ WSTECZNA (funkcje do usunięcia w przyszłości) ===
  
  // Te funkcje są zachowane dla kompatybilności, ale zalecane jest używanie
  // odpowiedników z modelu konwersacji
  getByFolder: MessagesAPI.getByFolder,
  getById: MessagesAPI.getById,
  markAsRead: MessagesAPI.markAsRead,
  markMultipleAsRead: MessagesAPI.markMultipleAsRead,
  toggleStar: MessagesAPI.toggleStar,
  delete: MessagesAPI.deleteMessage,
  moveToFolder: MessagesAPI.moveToFolder,
  moveMultipleToFolder: MessagesAPI.moveMultipleToFolder,
  reportMessage: MessagesAPI.reportMessage,
  getStats: MessagesAPI.getStats,
  saveDraft: MessagesAPI.saveDraft,
  search: SearchAPI.search,
  send: SendAPI.send,
  replyToMessage: SendAPI.replyToMessage
};

export default MessagesService;

// Eksportujemy poszczególne API dla selektywnego importu
export {
  ConversationsAPI,
  MessagesAPI,
  SearchAPI,
  SendAPI
};