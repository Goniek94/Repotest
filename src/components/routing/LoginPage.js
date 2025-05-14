import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import FeaturedListings from '../FeaturedListings/FeaturedListings';
import { logger } from '../../services/api/config';

/**
 * Wrapper dla komponentu logowania, który używa hooka useNavigate
 * Wyświetla FeaturedListings jako tło i modal logowania
 * 
 * @returns {React.ReactNode} - Komponent strony logowania
 */
const LoginPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Funkcja do zamknięcia okna logowania i powrotu do poprzedniej strony
  const handleClose = () => {
    // Powrót do poprzedniej strony lub na stronę główną
    const returnPath = location.state?.from || '/';
    logger.log('Zamykanie modalu logowania, przekierowanie do:', returnPath);
    navigate(returnPath, { replace: true });
  };
  
  return (
    <>
      <FeaturedListings />
      <LoginModal isOpen={true} onClose={handleClose} />
    </>
  );
};

/**
 * Komponent dla strony logowania
 * Wyświetla FeaturedListings jako tło i modal logowania
 * 
 * @returns {React.ReactNode} - Komponent strony logowania
 */
const LoginPage = () => <LoginPageWrapper />;

export default LoginPage;
