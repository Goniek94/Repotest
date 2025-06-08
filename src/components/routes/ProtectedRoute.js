// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Sprawdzamy, czy użytkownik jest zalogowany i czy ma wymagane uprawnienia
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      
      // Jeśli nie jest zalogowany
      if (!currentUser) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      
      // Jeśli jest wymagana konkretna rola i użytkownik jej nie ma
      if (requiredRole && currentUser.role !== requiredRole) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      
      // Użytkownik jest autoryzowany
      setAuthorized(true);
      setLoading(false);
    };
    
    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#35530A]"></div>
      </div>
    );
  }

  if (!authorized) {
    // Przekierowanie do strony logowania z zapisaniem docelowej lokalizacji
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;