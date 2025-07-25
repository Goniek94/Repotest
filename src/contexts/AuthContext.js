import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// AuthProvider Component - wraps entire app
export const AuthProvider = ({ children }) => {
  // State management
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication state
  const initializeAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Verify token is still valid (optional)
        verifyToken(token);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear invalid data
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  // Verify token validity (optional enhancement)
  const verifyToken = async (token) => {
    try {
      // You can add API call to verify token here
      // const response = await api.get('/auth/verify');
      // if (!response.data.valid) {
      //   logout();
      // }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  // Login function
  const login = (userData, token, refreshToken = null) => {
    try {
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);

      console.log('User logged in successfully:', userData.email);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login');
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Clear localStorage
      clearAuthData();
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);

      console.log('User logged out successfully');
      
      // Optional: Redirect to login page
      // window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  };

  // Update user data (for profile updates)
  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      console.log('User data updated:', newUserData);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user data');
    }
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    
    // Handle array of roles
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is moderator or admin
  const isModerator = () => {
    return hasRole(['admin', 'moderator']);
  };

  // Get user's full name
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.email || 'User';
  };

  // Context value
  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    updateUser,
    
    // Utilities
    hasRole,
    isAdmin,
    isModerator,
    getUserDisplayName,
    
    // Clear error
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// HOC for components that require authentication
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>;
    }
    
    if (!isAuthenticated) {
      return <div className="text-center p-8">
        <p className="text-gray-600">You need to be logged in to access this page.</p>
      </div>;
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;
