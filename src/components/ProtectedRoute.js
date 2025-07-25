import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 text-sm">Ładowanie...</p>
    </div>
  </div>
);

// Unauthorized Access Component
const UnauthorizedAccess = ({ requiredRole, userRole }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-center p-8 max-w-md">
      <div className="mb-4">
        <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Brak uprawnień</h2>
      <p className="text-gray-600 mb-4">
        Nie masz uprawnień do przeglądania tej strony.
      </p>
      <div className="text-sm text-gray-500">
        <p>Wymagana rola: <span className="font-semibold">{requiredRole}</span></p>
        <p>Twoja rola: <span className="font-semibold">{userRole || 'brak'}</span></p>
      </div>
      <button 
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Wróć
      </button>
    </div>
  </div>
);

// Main ProtectedRoute Component
const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  requiredRoles = null, // Array of roles
  fallbackPath = '/login',
  showUnauthorized = true 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate 
      to={fallbackPath} 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // Check role-based access if required
  if (requiredRole || requiredRoles) {
    const userRole = user?.role;
    let hasRequiredRole = false;

    if (requiredRole) {
      hasRequiredRole = userRole === requiredRole;
    }

    if (requiredRoles && Array.isArray(requiredRoles)) {
      hasRequiredRole = requiredRoles.includes(userRole);
    }

    if (!hasRequiredRole) {
      if (showUnauthorized) {
        return <UnauthorizedAccess 
          requiredRole={requiredRole || requiredRoles?.join(' lub ')} 
          userRole={userRole} 
        />;
      } else {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  // User is authenticated and has required role - render children
  return children;
};

// Specialized Protected Route Components for common use cases

// Admin Only Route
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="admin" {...props}>
    {children}
  </ProtectedRoute>
);

// Moderator or Admin Route
export const ModeratorRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={['admin', 'moderator']} {...props}>
    {children}
  </ProtectedRoute>
);

// User Route (any authenticated user)
export const UserRoute = ({ children, ...props }) => (
  <ProtectedRoute {...props}>
    {children}
  </ProtectedRoute>
);

// Guest Route (only for non-authenticated users - like login/register pages)
export const GuestRoute = ({ children, fallbackPath = '/dashboard' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

// HOC version for class components (if needed)
export const withProtectedRoute = (Component, options = {}) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

export default ProtectedRoute;
