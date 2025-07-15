import { useState, useCallback } from 'react';

const useAdminApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('admin_token');
  };

  // Base API call function
  const apiCall = useCallback(async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const defaultOptions = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const response = await fetch(`/api/admin-panel${endpoint}`, {
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

      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('file', file);
      
      // Append additional data
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await fetch(`/api/admin-panel${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData
        },
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

      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/admin-panel${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  // Check if token exists
  const isAuthenticated = useCallback(() => {
    return !!getAuthToken();
  }, []);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    del,
    uploadFile,
    downloadFile,
    batch,
    clearError,
    isAuthenticated
  };
};

export default useAdminApi;
