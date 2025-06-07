import { io } from 'socket.io-client';

/**
 * Serwis do obsługi powiadomień w czasie rzeczywistym
 */
class NotificationService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
    this.serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  /**
   * Inicjalizuje połączenie Socket.IO
   * @param {string} token - Token JWT do uwierzytelnienia
   * @returns {Promise} - Promise rozwiązywane po nawiązaniu połączenia
   */
  connect(token) {
    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('Brak tokenu uwierzytelniającego'));
        return;
      }

      // Jeśli już jest połączenie, rozłącz je
      if (this.socket) {
        this.socket.disconnect();
      }

      // Inicjalizacja Socket.IO
      this.socket = io(this.serverUrl, {
        auth: { token },
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
   * Oznacza powiadomienie jako przeczytane
   * @param {string} notificationId - ID powiadomienia
   */
  markAsRead(notificationId) {
    if (!this.socket || !this.connected) {
      console.warn('Brak połączenia z serwerem powiadomień');
      return;
    }

    this.socket.emit('mark_notification_read', { notificationId });
  }

  /**
   * Oznacza wszystkie powiadomienia jako przeczytane
   */
  markAllAsRead() {
    if (!this.socket || !this.connected) {
      console.warn('Brak połączenia z serwerem powiadomień');
      return;
    }

    this.socket.emit('mark_all_read');
  }

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
   * Sprawdza, czy klient jest połączony z serwerem
   * @returns {boolean} - Czy klient jest połączony
   */
  isConnected() {
    return this.connected;
  }
}

// Eksport instancji serwisu jako singleton
const notificationService = new NotificationService();
export default notificationService;
