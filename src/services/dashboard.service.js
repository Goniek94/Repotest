// src/services/dashboard.service.js
import apiClient from './client';

/**
 * Serwis do obsługi funkcji panelu administratora
 */
const dashboardService = {
  /**
   * Pobiera statystyki do panelu administratora
   * @returns {Promise} Obiekt zawierający statystyki (użytkownicy, ogłoszenia, komentarze, itp.)
   */
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/api/admin/dashboard/stats');
      
      // Dopasowanie struktury odpowiedzi do tego, czego oczekuje AdminPanel.js
      const { stats, recentActivity } = response.data;
      
      return {
        totalUsers: stats.usersCount,
        totalListings: stats.adsCount,
        totalComments: stats.commentsCount,
        activeDiscounts: stats.notificationsCount, // Używamy notificationsCount jako liczby aktywnych powiadomień/zniżek
        recentActivities: formatRecentActivities(recentActivity)
      };
    } catch (error) {
      console.error('Błąd podczas pobierania statystyk dashboardu:', error);
      throw error;
    }
  },

  /**
   * Pobiera listę użytkowników dla panelu administratora
   * @param {Object} params Parametry filtrowania i paginacji
   * @returns {Promise} Lista użytkowników
   */
  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/admin/users', { params });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania listy użytkowników:', error);
      throw error;
    }
  },

  /**
   * Pobiera szczegóły konkretnego użytkownika
   * @param {string} userId ID użytkownika
   * @returns {Promise} Dane użytkownika
   */
  getUserDetails: async (userId) => {
    try {
      const response = await apiClient.get(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania danych użytkownika ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Aktualizuje dane użytkownika
   * @param {string} userId ID użytkownika
   * @param {Object} userData Dane do aktualizacji
   * @returns {Promise} Zaktualizowane dane użytkownika
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas aktualizacji użytkownika ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Usuwa użytkownika
   * @param {string} userId ID użytkownika
   * @returns {Promise} Status operacji
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas usuwania użytkownika ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Pobiera listę ogłoszeń dla panelu administratora
   * @param {Object} params Parametry filtrowania i paginacji
   * @returns {Promise} Lista ogłoszeń
   */
  getAds: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/admin/ads', { params });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania listy ogłoszeń:', error);
      throw error;
    }
  },

  /**
   * Pobiera szczegóły konkretnego ogłoszenia
   * @param {string} adId ID ogłoszenia
   * @returns {Promise} Dane ogłoszenia
   */
  getAdDetails: async (adId) => {
    try {
      const response = await apiClient.get(`/api/admin/ads/${adId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania danych ogłoszenia ${adId}:`, error);
      throw error;
    }
  },

  /**
   * Aktualizuje dane ogłoszenia
   * @param {string} adId ID ogłoszenia
   * @param {Object} adData Dane do aktualizacji
   * @returns {Promise} Zaktualizowane dane ogłoszenia
   */
  updateAd: async (adId, adData) => {
    try {
      const response = await apiClient.put(`/api/admin/ads/${adId}`, adData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas aktualizacji ogłoszenia ${adId}:`, error);
      throw error;
    }
  },

  /**
   * Usuwa ogłoszenie
   * @param {string} adId ID ogłoszenia
   * @returns {Promise} Status operacji
   */
  deleteAd: async (adId) => {
    try {
      const response = await apiClient.delete(`/api/admin/ads/${adId}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas usuwania ogłoszenia ${adId}:`, error);
      throw error;
    }
  },

  /**
   * Pobiera listę komentarzy dla panelu administratora
   * @param {Object} params Parametry filtrowania i paginacji
   * @returns {Promise} Lista komentarzy
   */
  getComments: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/admin/comments', { params });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania listy komentarzy:', error);
      throw error;
    }
  },

  /**
   * Pobiera listę zniżek dla panelu administratora
   * @param {Object} params Parametry filtrowania i paginacji
   * @returns {Promise} Lista zniżek
   */
  getDiscounts: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/admin/discounts', { params });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania listy zniżek:', error);
      throw error;
    }
  }
};

/**
 * Formatuje dane aktywności do formatu oczekiwanego przez komponent AdminPanel
 * @param {Object} recentActivity Dane aktywności z API
 * @returns {Array} Sformatowana lista aktywności
 */
function formatRecentActivities(recentActivity) {
  if (!recentActivity) return [];
  
  const activities = [];
  
  // Dodaj ostatnio utworzone ogłoszenia
  if (recentActivity.ads && recentActivity.ads.length > 0) {
    recentActivity.ads.forEach(ad => {
      activities.push({
        description: `Nowe ogłoszenie: ${ad.title} (dodane przez ${ad.user?.name || ad.user?.email || 'użytkownika'})`,
        timeAgo: formatTimeAgo(ad.createdAt)
      });
    });
  }
  
  // Dodaj ostatnio zarejestrowanych użytkowników
  if (recentActivity.users && recentActivity.users.length > 0) {
    recentActivity.users.forEach(user => {
      activities.push({
        description: `Nowy użytkownik: ${user.name || user.email} (rola: ${user.role || 'użytkownik'})`,
        timeAgo: formatTimeAgo(user.createdAt)
      });
    });
  }
  
  // Dodaj ostatnie komentarze
  if (recentActivity.comments && recentActivity.comments.length > 0) {
    recentActivity.comments.forEach(comment => {
      activities.push({
        description: `Nowy komentarz do ogłoszenia ${comment.ad?.title || 'bez tytułu'} (dodany przez ${comment.user?.name || comment.user?.email || 'użytkownika'})`,
        timeAgo: formatTimeAgo(comment.createdAt)
      });
    });
  }
  
  // Sortuj aktywności od najnowszych
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Formatuje datę na "x czasu temu" (np. "2 godz. temu")
 * @param {string} dateString Data w formacie ISO
 * @returns {string} Sformatowany czas
 */
function formatTimeAgo(dateString) {
  if (!dateString) return 'niedawno';
  
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'przed chwilą';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min. temu`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} godz. temu`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} dni temu`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} tyg. temu`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mies. temu`;
  
  const years = Math.floor(days / 365);
  return `${years} lat temu`;
}

export default dashboardService;