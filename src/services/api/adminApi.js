/**
 * ADMIN API SERVICE
 * 
 * Serwis do komunikacji z API panelu administratora
 */

import { client } from './client';

export const adminApi = {
  // Admin login
  login: async (credentials) => {
    try {
      const response = await client.post('/api/admin/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // Admin logout
  logout: async () => {
    try {
      const response = await client.post('/api/admin/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Admin logout error:', error);
      throw error;
    }
  },

  // Check admin session
  checkSession: async () => {
    try {
      const response = await client.get('/api/admin/auth/session');
      return response.data;
    } catch (error) {
      console.error('Admin session check error:', error);
      throw error;
    }
  },

  // Get dashboard data
  getDashboard: async () => {
    try {
      const response = await client.get('/api/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Admin dashboard error:', error);
      throw error;
    }
  },

  // User management
  users: {
    getAll: async (params = {}) => {
      try {
        const response = await client.get('/api/admin/users', { params });
        return response.data;
      } catch (error) {
        console.error('Admin get users error:', error);
        throw error;
      }
    },

    getById: async (userId) => {
      try {
        const response = await client.get(`/api/admin/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Admin get user error:', error);
        throw error;
      }
    },

    update: async (userId, userData) => {
      try {
        const response = await client.put(`/api/admin/users/${userId}`, userData);
        return response.data;
      } catch (error) {
        console.error('Admin update user error:', error);
        throw error;
      }
    },

    delete: async (userId) => {
      try {
        const response = await client.delete(`/api/admin/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Admin delete user error:', error);
        throw error;
      }
    },

    ban: async (userId, reason) => {
      try {
        const response = await client.post(`/api/admin/users/${userId}/ban`, { reason });
        return response.data;
      } catch (error) {
        console.error('Admin ban user error:', error);
        throw error;
      }
    },

    unban: async (userId) => {
      try {
        const response = await client.post(`/api/admin/users/${userId}/unban`);
        return response.data;
      } catch (error) {
        console.error('Admin unban user error:', error);
        throw error;
      }
    }
  },

  // Listing management
  listings: {
    getAll: async (params = {}) => {
      try {
        const response = await client.get('/api/admin/listings', { params });
        return response.data;
      } catch (error) {
        console.error('Admin get listings error:', error);
        throw error;
      }
    },

    getById: async (listingId) => {
      try {
        const response = await client.get(`/api/admin/listings/${listingId}`);
        return response.data;
      } catch (error) {
        console.error('Admin get listing error:', error);
        throw error;
      }
    },

    approve: async (listingId) => {
      try {
        const response = await client.post(`/api/admin/listings/${listingId}/approve`);
        return response.data;
      } catch (error) {
        console.error('Admin approve listing error:', error);
        throw error;
      }
    },

    reject: async (listingId, reason) => {
      try {
        const response = await client.post(`/api/admin/listings/${listingId}/reject`, { reason });
        return response.data;
      } catch (error) {
        console.error('Admin reject listing error:', error);
        throw error;
      }
    },

    delete: async (listingId) => {
      try {
        const response = await client.delete(`/api/admin/listings/${listingId}`);
        return response.data;
      } catch (error) {
        console.error('Admin delete listing error:', error);
        throw error;
      }
    }
  },

  // Reports management
  reports: {
    getAll: async (params = {}) => {
      try {
        const response = await client.get('/api/admin/reports', { params });
        return response.data;
      } catch (error) {
        console.error('Admin get reports error:', error);
        throw error;
      }
    },

    getById: async (reportId) => {
      try {
        const response = await client.get(`/api/admin/reports/${reportId}`);
        return response.data;
      } catch (error) {
        console.error('Admin get report error:', error);
        throw error;
      }
    },

    resolve: async (reportId, action, notes) => {
      try {
        const response = await client.post(`/api/admin/reports/${reportId}/resolve`, {
          action,
          notes
        });
        return response.data;
      } catch (error) {
        console.error('Admin resolve report error:', error);
        throw error;
      }
    }
  },

  // Promotions management
  promotions: {
    getAll: async (params = {}) => {
      try {
        const response = await client.get('/api/admin/promotions', { params });
        return response.data;
      } catch (error) {
        console.error('Admin get promotions error:', error);
        throw error;
      }
    },

    create: async (promotionData) => {
      try {
        const response = await client.post('/api/admin/promotions', promotionData);
        return response.data;
      } catch (error) {
        console.error('Admin create promotion error:', error);
        throw error;
      }
    },

    update: async (promotionId, promotionData) => {
      try {
        const response = await client.put(`/api/admin/promotions/${promotionId}`, promotionData);
        return response.data;
      } catch (error) {
        console.error('Admin update promotion error:', error);
        throw error;
      }
    },

    delete: async (promotionId) => {
      try {
        const response = await client.delete(`/api/admin/promotions/${promotionId}`);
        return response.data;
      } catch (error) {
        console.error('Admin delete promotion error:', error);
        throw error;
      }
    }
  },

  // System settings
  settings: {
    get: async () => {
      try {
        const response = await client.get('/api/admin/settings');
        return response.data;
      } catch (error) {
        console.error('Admin get settings error:', error);
        throw error;
      }
    },

    update: async (settings) => {
      try {
        const response = await client.put('/api/admin/settings', settings);
        return response.data;
      } catch (error) {
        console.error('Admin update settings error:', error);
        throw error;
      }
    }
  },

  // Analytics
  analytics: {
    getStats: async (period = '30d') => {
      try {
        const response = await client.get('/api/admin/analytics/stats', {
          params: { period }
        });
        return response.data;
      } catch (error) {
        console.error('Admin get analytics error:', error);
        throw error;
      }
    },

    getUserStats: async (period = '30d') => {
      try {
        const response = await client.get('/api/admin/analytics/users', {
          params: { period }
        });
        return response.data;
      } catch (error) {
        console.error('Admin get user analytics error:', error);
        throw error;
      }
    },

    getListingStats: async (period = '30d') => {
      try {
        const response = await client.get('/api/admin/analytics/listings', {
          params: { period }
        });
        return response.data;
      } catch (error) {
        console.error('Admin get listing analytics error:', error);
        throw error;
      }
    }
  }
};

export default adminApi;
