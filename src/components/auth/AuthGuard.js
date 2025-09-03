import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from './LoginModal';
import LoadingSpinner from '../LoadingSpinner';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany po załadowaniu
    if (!isLoading && !isAuthenticated) {
      setShowLoginModal(true);
    } else if (isAuthenticated) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated, isLoading]);

  // Pokazuj spinner podczas ładowania stanu autentykacji
  if (isLoading) {
    return <LoadingSpinner message="Sprawdzanie autoryzacji..." />;
  }

  // Jeśli użytkownik nie jest zalogowany, pokaż modal logowania
  if (!isAuthenticated) {
    return (
      <>
        {children}
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={null} // Nie pozwalaj na zamknięcie
          forceLogin={true} // Wymuś logowanie
        />
      </>
    );
  }

  // Użytkownik jest zalogowany - pokaż zawartość
  return children;
};

export default AuthGuard;
