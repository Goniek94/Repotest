// src/services/stats.js
import apiClient from './api/client';

const StatsService = {
  // Pobieranie statystyk dla wszystkich ogłoszeń użytkownika
  getUserStats: () => {
    return apiClient.get('/api/ads/user/stats');
  },

  // Pobieranie szczegółowych statystyk dla konkretnego ogłoszenia
  getAdStats: (adId) => {
    return apiClient.get(`/api/ads/user/stats?adId=${adId}`);
  },

  // Aktualizacja statystyk ogłoszenia
  updateAdStats: (adId, data) => {
    return apiClient.post(`/api/ads/${adId}/stats/update`, data);
  },

  // Rejestracja wyświetlenia ogłoszenia
  registerView: (adId, source = 'direct') => {
    return apiClient.post(`/api/ads/${adId}/stats/update`, {
      activityType: 'view',
      source
    });
  },

  // Rejestracja wizyty na stronie ogłoszenia
  registerVisit: (adId, source = 'direct') => {
    return apiClient.post(`/api/ads/${adId}/stats/update`, {
      activityType: 'visit',
      source
    });
  },

  // Rejestracja dodania do ulubionych
  registerFavorite: (adId) => {
    return apiClient.post(`/api/ads/${adId}/stats/update`, {
      activityType: 'favorite'
    });
  },

  // Rejestracja nowej wiadomości
  registerMessage: (adId) => {
    return apiClient.post(`/api/ads/${adId}/stats/update`, {
      activityType: 'message'
    });
  },

  // Rejestracja zmiany ceny
  registerPriceChange: (adId, newPrice) => {
    return apiClient.post(`/api/ads/${adId}/stats/update`, {
      activityType: 'price_change',
      newPrice
    });
  }
};

export default StatsService;
