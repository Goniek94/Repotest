import axios from 'axios';
import { io } from 'socket.io-client';
import { debug } from '../utils/debug';

/**
 * Zunifikowany serwis powiadomień łączący HTTP API i Socket.IO
 * Obsługuje zarówno operacje CRUD jak i real-time events
 */
class UnifiedNotificationService {
  constructor() {
    // HTTP API configuration
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      withCredentials: true, // KLUCZOWE - JWT w HttpOnly cookie
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Socket.IO configuration
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
    this.serverUrl = this.baseURL;

    // Setup HTTP interceptors
    this.setupHttpInterceptors();
  }

  /**
   * Konfiguruje interceptory HTTP
   */
  setupHttpInterceptors() {
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error('UnifiedNotificationService API Error:', error);
        
        // Jeśli token jest nieprawidłowy, wyczyść dane i przekieruj
        if (error.response?.status === 401) {
          // Importuj dynamicznie clearAuthData aby uniknąć circular dependency
          const { clearAuthData } = await import('./api/config');
          await clearAuthData();
          
          // Przekieruj na stronę logowania jeśli nie jesteśmy już tam
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login?expired=true';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // ==================== HTTP API METHODS ====================

  /**
   * Pobiera listę powiadomień użytkownika
   * @param {Object} options - Opcje zapytania
   * @param {number} options.page - Numer strony (domyślnie 1)
   * @param {number} options.limit - Limit powiadomień na stronę (domyślnie 20)
   * @param {boolean} options.unreadOnly - Czy pobierać tylko nieprzeczytane (domyślnie false)
   * @returns {Promise<Object>} - Lista powiadomień z metadanymi paginacji
   */
  async getNotifications(options = {}) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = options;
      
      console.log('Pobieranie powiadomień:', { page, limit, unreadOnly });
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (unreadOnly) {
        params.append('unreadOnly', 'true');
      }
      
      const response = await this.apiClient.get(`/api/notifications?${params}`);
      
      console.log('Odpowiedź API powiadomień:', response.data);
      
      return {
        notifications: response.data.notifications || [],
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalNotifications: response.data.totalNotifications || 0,
        hasNextPage: response.data.hasNextPage || false,
        hasPrevPage: response.data.hasPrevPage || false
      };
      
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień:', error);
      throw new Error(
        error.response?.data?.message || 
        'Nie udało się pobrać powiadomień'
      );
    }
  }

  /**
   * Pobiera liczbę nieprzeczytanych powiadomień
   * @returns {Promise<Object>} - Liczniki nieprzeczytanych powiadomień
   */
  async getUnreadCount() {
    try {
      console.log('Pobieranie liczby nieprzeczytanych powiadomień');
      
      const response = await this.apiClient.get('/api/notifications/unread-count');
      
      console.log('Odpowiedź API liczników:', response.data);
      
      return {
        notifications: response.data.notifications || 0,
        messages: response.data.messages || 0,
        total: response.data.total || 0
      };
      
    } catch (error) {
      console.error('Błąd podczas pobierania liczników:', error);
      throw new Error(
        error.response?.data?.message || 
        'Nie udało się pobrać liczby nieprzeczytanych powiadomień'
      );
    }
  }

  /**
   * Oznacza powiadomienie jako przeczytane (HTTP API)
   * @param {string} notificationId - ID powiadomienia
   * @returns {Promise<Object>} - Zaktualizowane powiadomienie
   */
  async markAsReadHTTP(notificationId) {
    try {
      console.log('Oznaczanie powiadomienia jako przeczytane (HTTP):', notificationId);
      
      if (!notificationId) {
        throw new Error('ID powiadomienia jest wymagane');
      }
      
      const response = await this.apiClient.patch(`/api/notifications/${notificationId}/read`);
      
      console.log('Powiadomienie oznaczone jako przeczytane:', response.data);
      
      return response.data.notification || response.data;
      
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
      throw new Error(
        error.response?.data?.message || 
        'Nie udało się oznaczyć powiadomienia jako przeczytane'
      );
    }
  }

  /**
   * Oznacza wszystkie powiadomienia jako przeczytane (HTTP API)
   * @returns {Promise<Object>} - Wynik operacji
   */
  async markAllAsReadHTTP() {
    try {
      console.log('Oznaczanie wszystkich powiadomień jako przeczytane (HTTP)');
      
      const response = await this.apiClient.patch('/api/notifications/mark-all-read');
      
      console.log('Wszystkie powiadomienia oznaczone jako przeczytane:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
      throw new Error(
        error.response?.data?.message || 
        'Nie udało się oznaczyć wszystkich powiadomień jako przeczytane'
      );
    }
  }

  /**
   * Usuwa powiadomienie (HTTP API)
   * @param {string} notificationId - ID powiadomienia
   * @returns {Promise<Object>} - Wynik operacji
   */
  async deleteNotification(notificationId) {
    try {
      console.log('Usuwanie powiadomienia:', notificationId);
      
      if (!notificationId) {
        throw new Error('ID powiadomienia jest wymagane');
      }
      
      const response = await this.apiClient.delete(`/api/notifications/${notificationId}`);
      
      console.log('Powiadomienie usunięte:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('Błąd podczas usuwania powiadomienia:', error);
      throw new Error(
        error.response?.data?.message || 
        'Nie udało się usunąć powiadomienia'
      );
    }
  }

  // ==================== SOCKET.IO METHODS ====================

  /**
   * Inicjalizuje połączenie Socket.IO
   * @returns {Promise} - Promise rozwiązywane po nawiązaniu połączenia
   */
  connect() {
    return new Promise((resolve, reject) => {
      // Jeśli już jest połączenie, rozłącz je
      if (this.socket) {
        this.socket.disconnect();
      }

      // Inicjalizacja Socket.IO - używa HttpOnly cookies automatycznie
      this.socket = io(this.serverUrl, {
        withCredentials: true, // Ważne: wysyła HttpOnly cookies
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000
      });

      // Obsługa zdarzeń Socket.IO
      this.socket.on('connect', () => {
        debug('Połączono z serwerem powiadomień');
        this.connected = true;
        this._emitEvent('connect');
        resolve();
      });

      this.socket.on('disconnect', () => {
        debug('Rozłączono z serwerem powiadomień');
        this.connected = false;
        this._emitEvent('disconnect');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Błąd połączenia z serwerem powiadomień:', error);
        this._emitEvent('error', error);
        reject(error);
      });

      // Obsługa powiadomień
      this.socket.on('new_notification', (notification) => {
        debug('Otrzymano nowe powiadomienie:', notification);
        this._emitEvent('notification', notification);
        this._emitEvent('new_notification', notification);
      });

      // Obsługa aktualizacji powiadomień
      this.socket.on('notification_updated', (data) => {
        this._emitEvent('notification_updated', data);
      });

      // Obsługa oznaczenia wszystkich powiadomień jako przeczytane
      this.socket.on('all_notifications_read', () => {
        this._emitEvent('all_notifications_read');
      });

      // Obsługa usunięcia powiadomienia
      this.socket.on('notification_deleted', (data) => {
        this._emitEvent('notification_deleted', data);
      });

      // Obsługa potwierdzenia połączenia
      this.socket.on('connection_success', (data) => {
        debug('Potwierdzenie połączenia:', data);
        this._emitEvent('connection_success', data);
      });
    });
  }

  /**
   * Rozłącza połączenie Socket.IO
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Oznacza powiadomienie jako przeczytane (Socket.IO)
   * @param {string} notificationId - ID powiadomienia
   */
  markAsReadSocket(notificationId) {
    if (!this.socket || !this.connected) {
      console.warn('Brak połączenia z serwerem powiadomień');
      return;
    }

    this.socket.emit('mark_notification_read', { notificationId });
  }

  /**
   * Oznacza wszystkie powiadomienia jako przeczytane (Socket.IO)
   */
  markAllAsReadSocket() {
    if (!this.socket || !this.connected) {
      console.warn('Brak połączenia z serwerem powiadomień');
      return;
    }

    this.socket.emit('mark_all_read');
  }

  /**
   * Informuje serwer o wejściu do konwersacji
   * @param {string} participantId - ID uczestnika konwersacji
   * @param {string} conversationId - ID konwersacji (opcjonalne)
   */
  enterConversation(participantId, conversationId = null) {
    if (!this.socket || !this.connected) {
      console.warn('Brak połączenia z serwerem powiadomień');
      return;
    }

    this.socket.emit('enter_conversation', { participantId, conversationId });
    debug(`Weszedł do konwersacji z ${participantId}`);
  }

  /**
   * Informuje serwer o wyjściu z konwersacji
   * @param {string} participantId - ID uczestnika konwersacji
   * @param {string} conversationId - ID konwersacji (opcjonalne)
   */
  leaveConversation(participantId, conversationId = null) {
    if (!this.socket || !this.connected) {
      console.warn('Brak połączenia z serwerem powiadomień');
      return;
    }

    this.socket.emit('leave_conversation', { participantId, conversationId });
    debug(`Wyszedł z konwersacji z ${participantId}`);
  }

  // ==================== UNIFIED METHODS ====================

  /**
   * Oznacza powiadomienie jako przeczytane (używa HTTP API z fallback na Socket.IO)
   * @param {string} notificationId - ID powiadomienia
   * @returns {Promise<Object>} - Zaktualizowane powiadomienie
   */
  async markAsRead(notificationId) {
    try {
      // Preferuj HTTP API dla niezawodności
      const result = await this.markAsReadHTTP(notificationId);
      
      // Dodatkowo wyślij przez Socket.IO dla real-time update
      if (this.connected) {
        this.markAsReadSocket(notificationId);
      }
      
      return result;
    } catch (error) {
      // Fallback na Socket.IO jeśli HTTP API nie działa
      console.warn('HTTP API failed, falling back to Socket.IO:', error);
      this.markAsReadSocket(notificationId);
      throw error;
    }
  }

  /**
   * Oznacza wszystkie powiadomienia jako przeczytane (używa HTTP API z fallback na Socket.IO)
   * @returns {Promise<Object>} - Wynik operacji
   */
  async markAllAsRead() {
    try {
      // Preferuj HTTP API dla niezawodności
      const result = await this.markAllAsReadHTTP();
      
      // Dodatkowo wyślij przez Socket.IO dla real-time update
      if (this.connected) {
        this.markAllAsReadSocket();
      }
      
      return result;
    } catch (error) {
      // Fallback na Socket.IO jeśli HTTP API nie działa
      console.warn('HTTP API failed, falling back to Socket.IO:', error);
      this.markAllAsReadSocket();
      throw error;
    }
  }

  // ==================== EVENT HANDLING ====================

  /**
   * Dodaje nasłuchiwanie na zdarzenie
   * @param {string} event - Nazwa zdarzenia
   * @param {Function} callback - Funkcja wywoływana po wystąpieniu zdarzenia
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Usuwa nasłuchiwanie na zdarzenie
   * @param {string} event - Nazwa zdarzenia
   * @param {Function} callback - Funkcja do usunięcia
   */
  off(event, callback) {
    if (!this.listeners.has(event)) {
      return;
    }
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emituje zdarzenie do wszystkich nasłuchujących
   * @param {string} event - Nazwa zdarzenia
   * @param {*} data - Dane zdarzenia
   * @private
   */
  _emitEvent(event, data) {
    if (!this.listeners.has(event)) {
      return;
    }
    const callbacks = this.listeners.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Błąd w callbacku dla zdarzenia ${event}:`, error);
      }
    });
  }

  /**
   * Sprawdza, czy klient jest połączony z serwerem Socket.IO
   * @returns {boolean} - Czy klient jest połączony
   */
  isConnected() {
    return this.connected;
  }
}

// Eksport instancji serwisu jako singleton
const unifiedNotificationService = new UnifiedNotificationService();
export default unifiedNotificationService;
