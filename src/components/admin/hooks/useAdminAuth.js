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
        
        // Try to verify authentication with backend using HttpOnly cookies
        try {
          const response = await fetch('/api/admin-panel/health', {
            credentials: 'include', // Ważne: wysyła HttpOnly cookies
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            // User is authenticated, get user data
            const userResponse = await fetch('/api/v1/users/check', {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.success && userData.user && ['admin', 'moderator'].includes(userData.user.role)) {
                setUser(userData.user);
                setIsAuthenticated(true);
              } else {
                setIsAuthenticated(false);
                setUser(null);
              }
            } else {
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (apiError) {
          console.warn('Admin API check failed:', apiError);
          setIsAuthenticated(false);
          setUser(null);
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

  // Login function - używa zwykłego logowania, nie osobnego admin logowania
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // Używamy zwykłego endpointu logowania
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        credentials: 'include', // Ważne: odbiera HttpOnly cookies
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
      
      // Sprawdź czy użytkownik ma uprawnienia admin
      if (!data.user || !['admin', 'moderator'].includes(data.user.role)) {
        throw new Error('Brak uprawnień administratora');
      }
      
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

  // Logout function - używa zwykłego wylogowania
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // Call logout API - używa zwykłego endpointu
      await fetch('/api/v1/users/logout', {
        method: 'POST',
        credentials: 'include', // Ważne: wysyła HttpOnly cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout locally even if API call fails
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/users/check', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh user data');
      }

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        throw new Error('Invalid user data');
      }
    } catch (err) {
      console.error('Refresh user error:', err);
      // If refresh fails, logout user
      logout();
    }
  }, [logout]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        throw new Error('Profile update failed');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    try {
      const response = await fetch('/api/v1/users/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
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
    if (!user || !user.role) return false;
    
    // Admin ma wszystkie uprawnienia
    if (user.role === 'admin') return true;
    
    // Moderator ma ograniczone uprawnienia
    if (user.role === 'moderator') {
      const moderatorPermissions = [
        'view_users',
        'moderate_content',
        'view_reports',
        'manage_listings'
      ];
      return moderatorPermissions.includes(permission);
    }
    
    return false;
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
