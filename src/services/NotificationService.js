import axios from 'axios';

/**
 * Serwis HTTP API do zarządzania powiadomieniami
 * Obsługuje komunikację z REST API powiadomień
 */
class NotificationService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor do automatycznego dodawania tokenu autoryzacji
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor do obsługi błędów
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('NotificationService API Error:', error);
        
        // Jeśli token jest nieprawidłowy, przekieruj do logowania
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

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
   * Oznacza powiadomienie jako przeczytane
   * @param {string} notificationId - ID powiadomienia
   * @returns {Promise<Object>} - Zaktualizowane powiadomienie
   */
  async markAsRead(notificationId) {
    try {
      console.log('Oznaczanie powiadomienia jako przeczytane:', notificationId);
      
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
   * Oznacza wszystkie powiadomienia jako przeczytane
   * @returns {Promise<Object>} - Wynik operacji
   */
  async markAllAsRead() {
    try {
      console.log('Oznaczanie wszystkich powiadomień jako przeczytane');
      
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
   * Usuwa powiadomienie
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

  /**
   * Pobiera szczegóły pojedynczego powiadomienia
   * @param {string} notificationId - ID powiadomienia
   * @returns {Promise<Object>} - Szczegóły powiadomienia
   */
  async getNotificationDetails(notificationId) {
    try {
      console.log('Pobieranie szczegółów powiadomienia:', notificationId);
      
      if (!notificationId) {
        throw new Error('ID powiadomienia jest wymagane');
      }
      
      const response = await this.apiClient.get(`/api/notifications/${notificationId}`);
      
      console.log('Szczegóły powiadomienia:', response.data);
      
      return response.data.notification || response.data;
      
    } catch (error) {
      console.error('Błąd podczas pobierania szczegółów powiadomienia:', error);
      throw new Error(
        error.response?.data?.message || 
        'Nie udało się pobrać szczegółów powiadomienia'
      );
    }
  }

  /**
   * Tworzy nowe powiadomienie (dla celów testowych/administracyjnych)
   * @param {Object} notificationData - Dane powiadomienia
   * @returns {Promise<Object>} - Utworzone powiadomienie
   */
  async createNotification(notificationData) {
    try {
      console.log('Tworzenie powiadomienia:', notificationData);
      
      const response = await this.apiClient.post('/api/notifications', notificationData);
      
      console.log('Powiadomienie utworzone:', response.data);
      
      return response.data.notification || response.data;
      
    } catch (error) {
      console.error('Błąd podczas tworzenia powiadomienia:', error);
      throw new Error(
        error.response?.data?.message || 
        'Nie udało się utworzyć powiadomienia'
      );
    }
  }
}

// Eksport instancji serwisu jako singleton
const notificationService = new NotificationService();
export default notificationService;
