// src/services/api.js
import apiClient from './client';
import vinService from './vinService';

// Import modułów API
import { 
  ListingsService, 
  FavoritesService, 
  MessagesService, 
  NotificationsService, 
  TransactionsService 
} from './api/';

// Re-eksport modułów dla komponentów
export { 
  ListingsService, 
  FavoritesService, 
  MessagesService, 
  NotificationsService, 
  TransactionsService 
};

// --------------------------------
// Ogłoszenia / Listings
// --------------------------------

// Pobieranie wszystkich ogłoszeń (z paginacją i filtrami)
export const getListings = async (params = {}) => {
  const response = await apiClient.get('/ads', { params });
  return response.data;
};

// Pobieranie ogłoszenia po ID
export const getListing = async (id) => {
  const response = await apiClient.get(`/ads/${id}`);
  return response.data;
};

// Dodawanie nowego ogłoszenia (wymaga autoryzacji)
export const addListing = async (formData) => {
  const response = await apiClient.post('/ads/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Pobieranie ogłoszeń użytkownika (wymaga autoryzacji)
export const getUserListings = async (params = {}) => {
  const response = await apiClient.get('/ads/user/listings', { params });
  return response.data;
};

// Edycja ogłoszenia
export const updateListing = async (id, formData) => {
  const response = await apiClient.put(`/ads/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Usuwanie ogłoszenia
export const deleteListing = async (id) => {
  const response = await apiClient.delete(`/ads/${id}`);
  return response.data;
};

// --------------------------------
// Autentykacja / Authentication
// --------------------------------

// Logowanie użytkownika
export const login = async (credentials) => {
  const response = await apiClient.post('/users/login', credentials);
  return response.data;
};

// Wylogowanie użytkownika
export const logout = async () => {
  await apiClient.post('/users/logout');
};

// Rejestracja użytkownika
export const register = async (userData) => {
  const response = await apiClient.post('/users/register', userData);
  return response.data;
};

/**
 * Pobieranie dashboardu użytkownika (statystyki, ostatnio przeglądane, itp.)
 * Zawiera obsługę błędów i retry logic dla poprawy niezawodności
 */
export const getUserDashboard = async (retries = 2) => {
  let lastError = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await apiClient.get('/users/dashboard');
      return response.data;
    } catch (error) {
      console.error(`Próba ${attempt + 1}/${retries + 1} pobrania dashboardu nie powiodła się:`, error);
      lastError = error;
      
      // Jeśli to ostatnia próba, nie czekamy
      if (attempt === retries) break;
      
      // Czekamy coraz dłużej przed kolejną próbą (wykładnicze wycofanie)
      const delay = Math.pow(2, attempt) * 500;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Jeśli wszystkie próby się nie powiodły, zwracamy pusty obiekt z flagą błędu
  console.error("Wszystkie próby pobrania dashboardu zakończyły się niepowodzeniem");
  
  // Zwracamy podstawową strukturę danych zamiast rzucania wyjątku
  return {
    error: lastError,
    activeListingsCount: 0,
    completedTransactionsCount: 0,
    recentViewedAds: []
  };
};

// Pobieranie profilu użytkownika (wymaga autoryzacji)
export const getCurrentUser = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

// Aktualizacja profilu użytkownika
export const updateUserProfile = async (userData) => {
  const response = await apiClient.put('/users/profile', userData);
  return response.data;
};

// Zmiana hasła
export const changePassword = async (passwordData) => {
  const response = await apiClient.put('/users/change-password', passwordData);
  return response.data;
};

// --------------------------------
// Wyszukiwanie / Search
// --------------------------------

// Pobieranie wyróżnionych ogłoszeń (rotacja)
export const getRotatedListings = async () => {
  try {
    console.log('Wywołuję endpoint /ads/rotated...');
    const response = await apiClient.get('/ads/rotated');
    console.log('Odpowiedź z /ads/rotated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania rotowanych ogłoszeń:', error);
    if (error.response) {
      console.error('Status błędu:', error.response.status);
      console.error('Dane odpowiedzi:', error.response.data);
    } else if (error.request) {
      console.error('Nie otrzymano odpowiedzi, problem z połączeniem:', error.request);
    } else {
      console.error('Błąd konfiguracji zapytania:', error.message);
    }
    throw error;
  }
};

// Pobieranie marek
export const getBrands = async () => {
  const response = await apiClient.get('/ads/brands');
  return response.data;
};

// Pobieranie modeli dla danej marki
export const getModels = async (brand) => {
  const response = await apiClient.get('/ads/models', { params: { brand } });
  return response.data;
};

// Wyszukiwanie ogłoszeń
export const searchListings = async (params = {}) => {
  const response = await apiClient.get('/ads/search', { params });
  return response.data;
};

// --------------------------------
// Ulubione / Favorites
// --------------------------------

// Pobieranie ulubionych ogłoszeń
export const getFavoriteListings = async () => {
  const response = await apiClient.get('/favorites');
  return response.data;
};

// Dodawanie ogłoszenia do ulubionych
export const addToFavorites = async (id) => {
  const response = await apiClient.post(`/favorites/add/${id}`);
  return response.data;
};

// Usuwanie ogłoszenia z ulubionych
export const removeFromFavorites = async (id) => {
  const response = await apiClient.delete(`/favorites/remove/${id}`);
  return response.data;
};

// Sprawdzanie czy ogłoszenie jest w ulubionych
export const checkIfFavorite = async (id) => {
  const response = await apiClient.get(`/favorites/check/${id}`);
  return response.data;
};

// --------------------------------
// Wiadomości / Messages
// --------------------------------

// Pobieranie wszystkich wiadomości (inbox, wysłane, itp.)
export const getMessages = async (folder = 'odebrane') => {
  const response = await apiClient.get(`/messages/${folder}`);
  return response.data;
};

// Pobieranie pojedynczej wiadomości
export const getMessage = async (id) => {
  const response = await apiClient.get(`/messages/message/${id}`);
  return response.data;
};

// Wysyłanie nowej wiadomości
export const sendMessage = async (messageData) => {
  const response = await apiClient.post('/messages/send', messageData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Wysyłanie wiadomości do właściciela ogłoszenia
export const sendMessageToAd = async (adId, messageData) => {
  const response = await apiClient.post(`/messages/send-to-ad/${adId}`, messageData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Wysyłanie wiadomości do użytkownika
export const sendMessageToUser = async (userId, messageData) => {
  const response = await apiClient.post(`/messages/send-to-user/${userId}`, messageData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Odpowiadanie na wiadomość
export const replyToMessage = async (messageId, messageData) => {
  const response = await apiClient.post(`/messages/reply/${messageId}`, messageData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Oznaczanie wiadomości jako przeczytanej
export const markMessageAsRead = async (id) => {
  const response = await apiClient.patch(`/messages/read/${id}`);
  return response.data;
};

// Oznaczanie wiadomości gwiazdką
export const toggleMessageStar = async (id) => {
  const response = await apiClient.patch(`/messages/star/${id}`);
  return response.data;
};

// Usuwanie wiadomości
export const deleteMessage = async (id) => {
  const response = await apiClient.delete(`/messages/${id}`);
  return response.data;
};

// Pobieranie listy konwersacji
export const getConversationsList = async () => {
  const response = await apiClient.get('/messages/conversations');
  return response.data;
};

// Pobieranie konwersacji z konkretnym użytkownikiem
export const getConversation = async (userId) => {
  const response = await apiClient.get(`/messages/conversation/${userId}`);
  return response.data;
};

// --------------------------------
// Powiadomienia / Notifications
// --------------------------------

// Pobieranie wszystkich powiadomień
export const getNotifications = async (params = {}) => {
  const response = await apiClient.get('/notifications', { params });
  return response.data;
};

// Pobieranie nieprzeczytanych powiadomień
export const getUnreadNotifications = async (limit = 10) => {
  const response = await apiClient.get('/notifications/unread', { params: { limit } });
  return response.data;
};

// Pobieranie liczby nieprzeczytanych powiadomień
export const getUnreadNotificationsCount = async () => {
  const response = await apiClient.get('/notifications/unread/count');
  return response.data;
};

// Oznaczanie powiadomienia jako przeczytane
export const markNotificationAsRead = async (id) => {
  const response = await apiClient.put(`/notifications/${id}/read`);
  return response.data;
};

// Oznaczanie wszystkich powiadomień jako przeczytane
export const markAllNotificationsAsRead = async () => {
  const response = await apiClient.put('/notifications/read-all');
  return response.data;
};

// Ukrywanie/odrzucanie powiadomienia (bez usuwania z bazy)
export const dismissNotification = async (id) => {
  try {
    const response = await apiClient.post(`/notifications/${id}/dismiss`);
    return response.data;
  } catch (error) {
    console.error('Error dismissing notification:', error);
    // Return a success response even on error to maintain UI functionality
    // In a production environment, you might want to handle this differently
    return { success: true };
  }
};

// Usuwanie powiadomienia
export const deleteNotification = async (id) => {
  const response = await apiClient.delete(`/notifications/${id}`);
  return response.data;
};

// --------------------------------
// Transakcje / Transactions
// --------------------------------

// Pobieranie historii płatności/transakcji
export const getTransactionHistory = async () => {
  const response = await apiClient.get('/payments/history');
  return response.data;
};

// Pobieranie danych pojazdu na podstawie numeru VIN
export const getVehicleDataByVin = async (vin) => {
  try {
    // W rzeczywistej aplikacji, to byłoby zapytanie do API:
    // const response = await apiClient.get(`/vehicles/vin/${vin}`);
    // return response.data;
    
    // Symulacja: używamy lokalnego serwisu do symulacji odpowiedzi
    const vehicleData = await vinService.lookupVin(vin);
    return vehicleData;
  } catch (error) {
    console.error('Error fetching VIN data:', error);
    throw error;
  }
};

// Przetwarzanie płatności za ogłoszenie
export const processPayment = async (paymentData) => {
  const response = await apiClient.post('/payments/process', paymentData);
  return response.data;
};

// Eksport domyślny dla kompatybilności ze starymi importami
export default {
  // Ogłoszenia
  getListings,
  getListing,
  addListing,
  updateListing,
  deleteListing,
  getUserListings,
  
  // Autentykacja
  login,
  logout,
  register,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  
  // Wyszukiwanie
  getRotatedListings,
  getBrands,
  getModels,
  searchListings,
  
  // Ulubione
  getFavoriteListings,
  addToFavorites,
  removeFromFavorites,
  checkIfFavorite,
  
  // Wiadomości
  getMessages,
  getMessage,
  sendMessage,
  sendMessageToAd,
  sendMessageToUser,
  replyToMessage,
  markMessageAsRead,
  toggleMessageStar,
  deleteMessage,
  getConversationsList,
  getConversation,
  
  // Powiadomienia
  getNotifications,
  getUnreadNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  
  // Transakcje
  getTransactionHistory,
  processPayment,
  getVehicleDataByVin
};
