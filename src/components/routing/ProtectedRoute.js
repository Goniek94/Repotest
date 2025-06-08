import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logger, IS_DEV } from '../../services/api/config';

/**
 * Komponent dla tras chronionych, które wymagają uwierzytelnienia
 * Przekierowuje do strony logowania, jeśli użytkownik nie jest zalogowany
 * 
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Zawartość chronionej trasy
 * @param {boolean} props.requireAdmin - Czy trasa wymaga uprawnień administratora
 * @returns {React.ReactNode} - Zawartość chronionej trasy lub przekierowanie
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Logowanie dla debugowania tylko w trybie deweloperskim
  if (IS_DEV) {
    logger.log('ProtectedRoute sprawdzanie:', {
      isAuthenticated,
      user: !!user,
      path: location.pathname
    });
  }

  // Komponent ładowania podczas sprawdzania uwierzytelnienia
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#35530A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  // Przekierowanie do logowania, jeśli użytkownik nie jest zalogowany
  if (!isAuthenticated || !user) {
    logger.log('Przekierowanie do logowania z:', location.pathname);
    // Zapisz aktualną ścieżkę, aby można było wrócić po zalogowaniu
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Przekierowanie na stronę główną, jeśli trasa wymaga uprawnień administratora, a użytkownik ich nie ma
  if (requireAdmin && user.role !== 'admin') {
    logger.log('Brak uprawnień administratora, przekierowanie na stronę główną');
    return <Navigate to="/" replace />;
  }

  // Zwróć zawartość chronionej trasy, jeśli użytkownik jest zalogowany i ma odpowiednie uprawnienia
  return children;
};

export default ProtectedRoute;
