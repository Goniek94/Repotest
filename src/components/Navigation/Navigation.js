import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../auth/LoginModal';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import UserMenu from './UserMenu';
import AddListingButton from './AddListingButton';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();  // Dodaj isAuthenticated
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();

  // Debugging - logowanie stanu autentykacji
  useEffect(() => {
    console.log('Navigation - stan autentykacji:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  // Zamykanie menu mobilnego po zmianie strony
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Blokowanie przewijania strony gdy menu mobilne jest otwarte
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Zamykanie menu użytkownika po kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Dane powiadomień użytkownika
  const notifications = {
    messages: 1,
    alerts: 1,
  };

  return (
    <header className="bg-white text-gray-800 sticky top-0 z-50 shadow-md">
      <div className="w-full flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <DesktopNav user={user} />
          
          {/* Przycisk Dodaj Ogłoszenie */}
          <AddListingButton user={user} setIsLoginModalOpen={setIsLoginModalOpen} />
          
          {/* Przyciski logowania/wylogowania */}
          {isAuthenticated && user ? (  // Zmień warunek na isAuthenticated && user
            <UserMenu 
              notifications={notifications}
              handleLogout={handleLogout}
              isUserMenuOpen={isUserMenuOpen}
              setIsUserMenuOpen={setIsUserMenuOpen}
            />
          ) : (
            <button
              onClick={handleOpenLogin}
              className="px-4 py-2 font-bold uppercase hover:bg-gray-800 bg-gray-900 text-white rounded-[2px] transition-colors text-sm"
            >
              Zaloguj się
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-800 focus:outline-none"
            aria-label="Otwórz menu"
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        user={user} 
        notifications={notifications} 
        handleOpenLogin={handleOpenLogin}
        handleLogout={handleLogout}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Modal logowania */}
      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </header>
  );
};

export default Navigation;