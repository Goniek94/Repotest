import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute sprawdzanie:', { 
      isAuthenticated, 
      user: !!user,
      path: location.pathname,
      token: localStorage.getItem('token') ? 'Istnieje' : 'Brak'
    });
  }, [isAuthenticated, user, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#35530A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('Przekierowanie do logowania z:', location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;