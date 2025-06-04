// src/services/api/index.js
// Centralny punkt exportu wszystkich usług API

// Importy poszczególnych modułów API
import apiClient from './client';
import ListingsService from './listingsApi';
import AuthService from './authApi';
import FavoritesService from './favoritesApi';
import MessagesService from './messagesApi';
import NotificationsService from './notificationsApi';
import TransactionsService from './transactionsApi';
import notificationService from '../notifications'; // WebSocket notifications

// Eksport usług jako przestrzeni nazw
export {
  ListingsService,
  AuthService,
  FavoritesService,
  MessagesService,
  NotificationsService,
  TransactionsService,
  notificationService,
  apiClient
};

// Eksport domyślny dla funkcji starego API (wsteczna kompatybilność)
export default {
  // Ogłoszenia
  getListings: ListingsService.getAll,
  getListing: ListingsService.getById,
  addListing: ListingsService.add,
  updateListing: ListingsService.update,
  deleteListing: ListingsService.delete,
  getUserListings: ListingsService.getUserListings,
  getRotatedListings: ListingsService.getRotated,
  getBrands: ListingsService.getBrands,
  getModels: ListingsService.getModels,
  searchListings: ListingsService.search,
  
  // Autentykacja
  login: AuthService.login,
  logout: AuthService.logout,
  register: AuthService.register,
  verifyCode: AuthService.verifyCode,
  checkEmailExists: (email) => apiClient.post('/users/check-email', { email }).then(r => r.data),
  checkPhoneExists: (phone) => apiClient.post('/users/check-phone', { phone }).then(r => r.data),
  getCurrentUser: AuthService.getCurrentUser,
  updateUserProfile: AuthService.refreshUserData,
  changePassword: (data) => apiClient.put('/users/change-password', data).then(r => r.data),
  
  // Ulubione
  getFavoriteListings: FavoritesService.getAll,
  addToFavorites: FavoritesService.addToFavorites,
  removeFromFavorites: FavoritesService.removeFromFavorites,
  checkIfFavorite: FavoritesService.checkIsFavorite,
  
  // Wiadomości
  getMessages: (folder) => MessagesService.getByFolder(folder).then(r => r.data),
  getMessage: (id) => MessagesService.getById(id).then(r => r.data),
  sendMessage: (data) => MessagesService.send(data).then(r => r.data),
  sendMessageToAd: (adId, data) => MessagesService.sendToAd(adId, data).then(r => r.data),
  sendMessageToUser: (userId, data) => MessagesService.sendToUser(userId, data).then(r => r.data),
  replyToMessage: (msgId, data) => MessagesService.replyToMessage(msgId, data).then(r => r.data),
  markMessageAsRead: (id) => MessagesService.markAsRead(id).then(r => r.data),
  toggleMessageStar: (id) => MessagesService.toggleStar(id).then(r => r.data),
  deleteMessage: (id) => MessagesService.delete(id).then(r => r.data),
  getConversationsList: (folder) => MessagesService.getConversationsList(folder).then(r => r.data),
  getConversation: (userId) => MessagesService.getConversation(userId).then(r => r.data),
  
  // Powiadomienia (REST API)
  getNotifications: NotificationsService.getAll,
  getUnreadNotifications: NotificationsService.getUnread,
  getUnreadNotificationsCount: NotificationsService.getUnreadCount,
  markNotificationAsRead: NotificationsService.markAsRead,
  markAllNotificationsAsRead: NotificationsService.markAllAsRead,
  deleteNotification: NotificationsService.delete,
  
  // Transakcje
  getTransactionHistory: TransactionsService.getHistory,
  processPayment: TransactionsService.processPayment,
  
  // CEPiK - pobieranie danych pojazdu
  getVehicleDataByVin: (vin) => apiClient.post('/api/cepik/checkVehicle', { vin }).then(r => r.data.vehicle)
};