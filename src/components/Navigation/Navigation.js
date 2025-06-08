import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import LoginModal from '../auth/LoginModal';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import ProfileNavigation from '../profil/navigation/ProfileNavigation';
import AddListingButton from './AddListingButton';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

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

  // Używamy rzeczywistych danych o nieprzeczytanych powiadomieniach
  const notifications = {
    messages: unreadCount?.messages || 0,
    alerts: unreadCount?.alerts || 0,
  };

  return (
    <header className="bg-white text-gray-800 sticky top-0 z-50 shadow-md">
      {/* Logo przy samej lewej krawędzi */}
      <div className="w-full h-16 flex items-center justify-between pl-0 pr-4 lg:pl-0 lg:pr-8">
        <Logo />

        <div className="hidden md:flex items-center space-x-6">
          <DesktopNav user={user} />
          <AddListingButton user={user} setIsLoginModalOpen={setIsLoginModalOpen} />

          {isAuthenticated && user ? (
            <ProfileNavigation
              notifications={notifications}
              handleLogout={handleLogout}
              isDropdown={true}
              isOpen={isUserMenuOpen}
              setIsOpen={setIsUserMenuOpen}
              user={user}
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

      <MobileMenu
        isOpen={isMobileMenuOpen}
        user={user}
        notifications={notifications}
        handleOpenLogin={handleOpenLogin}
        handleLogout={handleLogout}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

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
