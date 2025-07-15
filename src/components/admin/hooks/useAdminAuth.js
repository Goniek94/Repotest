import { useState, useEffect, useCallback } from 'react';

const useAdminAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // Try to verify token with backend
        try {
          const response = await fetch('/api/admin-panel/health', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            // Token is valid, create mock user for now
            const mockUser = {
              id: 1,
              name: 'Administrator',
              email: 'admin@example.com',
              role: 'admin',
              permissions: ['*'],
              token: token
            };
            
            setUser(mockUser);
            setIsAuthenticated(true);
          } else {
            // Token invalid, remove it
            localStorage.removeItem('admin_token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (apiError) {
          // API not available, but token exists - allow access for development
          console.warn('Admin API not available, using mock authentication');
          const mockUser = {
            id: 1,
            name: 'Administrator',
            email: 'admin@example.com',
            role: 'admin',
            permissions: ['*'],
            token: token
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setError(err.message);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token
      localStorage.setItem('admin_token', data.token);
      
      // Set user data
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      if (token) {
        // Call logout API
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      // Clear local storage
      localStorage.removeItem('admin_token');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout locally even if API call fails
      localStorage.removeItem('admin_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const response = await fetch('/api/admin/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh user data');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error('Refresh user error:', err);
      // If refresh fails, logout user
      logout();
    }
  }, [logout]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/admin/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password change failed');
      }

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.role === 'admin';
  }, [user]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshUser,
    updateProfile,
    changePassword,
    hasPermission
  };
};

export default useAdminAuth;
