import { useState, useCallback } from 'react';

const useAdminApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base API call function - używa HttpOnly cookies
  const apiCall = useCallback(async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const defaultOptions = {
        credentials: 'include', // Ważne: wysyła HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const response = await fetch(`/api/admin${endpoint}`, {
        ...defaultOptions,
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // GET request
  const get = useCallback(async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return apiCall(url, {
      method: 'GET'
    });
  }, [apiCall]);

  // POST request
  const post = useCallback(async (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }, [apiCall]);

  // PUT request
  const put = useCallback(async (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }, [apiCall]);

  // PATCH request
  const patch = useCallback(async (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }, [apiCall]);

  // DELETE request
  const del = useCallback(async (endpoint) => {
    return apiCall(endpoint, {
      method: 'DELETE'
    });
  }, [apiCall]);

  // File upload
  const uploadFile = useCallback(async (endpoint, file, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      
      // Append additional data
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await fetch(`/api/admin${endpoint}`, {
        method: 'POST',
        credentials: 'include', // Ważne: wysyła HttpOnly cookies
        // Don't set Content-Type for FormData
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Download file
  const downloadFile = useCallback(async (endpoint, filename = 'download') => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin${endpoint}`, {
        method: 'GET',
        credentials: 'include' // Ważne: wysyła HttpOnly cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Batch operations
  const batch = useCallback(async (operations) => {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled(
        operations.map(op => {
          switch (op.method.toLowerCase()) {
            case 'get':
              return get(op.endpoint, op.params);
            case 'post':
              return post(op.endpoint, op.data);
            case 'put':
              return put(op.endpoint, op.data);
            case 'patch':
              return patch(op.endpoint, op.data);
            case 'delete':
              return del(op.endpoint);
            default:
              throw new Error(`Unsupported method: ${op.method}`);
          }
        })
      );

      const responses = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return { 
            success: false, 
            error: result.reason?.message || 'Unknown error',
            operation: operations[index]
          };
        }
      });

      const hasErrors = responses.some(r => !r.success);
      if (hasErrors) {
        const errorMessages = responses
          .filter(r => !r.success)
          .map(r => r.error)
          .join('; ');
        setError(`Batch operation failed: ${errorMessages}`);
      }

      return { 
        success: !hasErrors, 
        results: responses,
        errors: responses.filter(r => !r.success)
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [get, post, put, patch, del]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if authenticated by trying to access admin endpoint
  const isAuthenticated = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/health', {
        credentials: 'include'
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Specific API methods for admin panel

  // Dashboard methods
  const getDashboardStats = useCallback(async () => {
    return get('/dashboard');
  }, [get]);

  // User management methods
  const getUsers = useCallback(async (params = {}) => {
    return get('/users', params);
  }, [get]);

  const getUserById = useCallback(async (userId) => {
    return get(`/users/${userId}`);
  }, [get]);

  const createUser = useCallback(async (userData) => {
    return post('/users', userData);
  }, [post]);

  const updateUser = useCallback(async (userId, userData) => {
    return put(`/users/${userId}`, userData);
  }, [put]);

  const deleteUser = useCallback(async (userId, reason) => {
    return del(`/users/${userId}`, { reason });
  }, [del]);

  const toggleUserBlock = useCallback(async (userId, blocked, reason = '') => {
    return post(`/users/${userId}/block`, { blocked, reason });
  }, [post]);

  const bulkUpdateUsers = useCallback(async (userIds, updateData) => {
    return post('/users/bulk-update', { userIds, updateData });
  }, [post]);

  const getUserAnalytics = useCallback(async (timeframe = '30d') => {
    return get('/users/analytics', { timeframe });
  }, [get]);

  const exportUsers = useCallback(async (format = 'json', filters = {}) => {
    return downloadFile(`/users/export?format=${format}&${new URLSearchParams(filters).toString()}`, `users.${format}`);
  }, [downloadFile]);

  // Listing management methods
  const getListings = useCallback(async (params = {}) => {
    return get('/listings', params);
  }, [get]);

  const getListingById = useCallback(async (listingId) => {
    return get(`/listings/${listingId}`);
  }, [get]);

  const updateListing = useCallback(async (listingId, listingData) => {
    return put(`/listings/${listingId}`, listingData);
  }, [put]);

  const deleteListing = useCallback(async (listingId, reason) => {
    return del(`/listings/${listingId}`, { reason });
  }, [del]);

  const approveListing = useCallback(async (listingId) => {
    return post(`/listings/${listingId}/approve`);
  }, [post]);

  const rejectListing = useCallback(async (listingId, reason) => {
    return post(`/listings/${listingId}/reject`, { reason });
  }, [post]);

  // Report management methods
  const getReports = useCallback(async (params = {}) => {
    return get('/reports', params);
  }, [get]);

  const getReportById = useCallback(async (reportId) => {
    return get(`/reports/${reportId}`);
  }, [get]);

  const updateReportStatus = useCallback(async (reportId, status, resolution = '') => {
    return put(`/reports/${reportId}`, { status, resolution });
  }, [put]);

  const resolveReport = useCallback(async (reportId, resolution) => {
    return post(`/reports/${reportId}/resolve`, { resolution });
  }, [post]);

  // Promotion management methods
  const getPromotions = useCallback(async (params = {}) => {
    return get('/promotions', params);
  }, [get]);

  const createPromotion = useCallback(async (promotionData) => {
    return post('/promotions', promotionData);
  }, [post]);

  const updatePromotion = useCallback(async (promotionId, promotionData) => {
    return put(`/promotions/${promotionId}`, promotionData);
  }, [put]);

  const deletePromotion = useCallback(async (promotionId) => {
    return del(`/promotions/${promotionId}`);
  }, [del]);

  // Statistics methods
  const getStatistics = useCallback(async (params = {}) => {
    return get('/statistics', params);
  }, [get]);

  const getAdvancedAnalytics = useCallback(async (type, timeframe = '30d') => {
    return get(`/analytics/${type}`, { timeframe });
  }, [get]);

  // Settings methods
  const getSettings = useCallback(async () => {
    return get('/settings');
  }, [get]);

  const updateSettings = useCallback(async (settings) => {
    return put('/settings', settings);
  }, [put]);

  // System health check
  const getSystemHealth = useCallback(async () => {
    return get('/health');
  }, [get]);

  return {
    loading,
    error,
    // Generic methods
    get,
    post,
    put,
    patch,
    del,
    uploadFile,
    downloadFile,
    batch,
    clearError,
    isAuthenticated,
    // Dashboard methods
    getDashboardStats,
    // User management methods
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserBlock,
    bulkUpdateUsers,
    getUserAnalytics,
    exportUsers,
    // Listing management methods
    getListings,
    getListingById,
    updateListing,
    deleteListing,
    approveListing,
    rejectListing,
    // Report management methods
    getReports,
    getReportById,
    updateReportStatus,
    resolveReport,
    // Promotion management methods
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    // Statistics methods
    getStatistics,
    getAdvancedAnalytics,
    // Settings methods
    getSettings,
    updateSettings,
    // System methods
    getSystemHealth
  };
};

export default useAdminApi;
