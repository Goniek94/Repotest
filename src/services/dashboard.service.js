// src/services/dashboard.service.js
import api from './axios';

class DashboardService {
  // Pobieranie głównych statystyk dashboardu
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd pobierania statystyk dashboardu';
    }
  }

  // Pobieranie miesięcznych statystyk
  async getMonthlyStats() {
    try {
      const response = await api.get('/dashboard/monthly-stats');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd pobierania miesięcznych statystyk';
    }
  }
}

export default new DashboardService();