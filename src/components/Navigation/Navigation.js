import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useMobileMenu } from '../../contexts/MobileMenuContext';
import LoginModal from '../auth/LoginModal';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import ProfileNavigation from '../profil/navigation/ProfileNavigation';
import AddListingButton from './AddListingButton';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);

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

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      
      // Check if user is on a protected route and redirect to home
      const protectedRoutes = ['/profil', '/profile', '/user', '/create-listing', '/add-listing-view', '/favorites', '/admin'];
      const currentPath = location.pathname;
      
      if (protectedRoutes.some(route => currentPath.startsWith(route))) {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect from protected routes
      const protectedRoutes = ['/profil', '/profile', '/user', '/create-listing', '/add-listing-view', '/favorites', '/admin'];
      const currentPath = location.pathname;
      
      if (protectedRoutes.some(route => currentPath.startsWith(route))) {
        navigate('/');
      }
    }
  };

  // Używamy rzeczywistych danych o nieprzeczytanych powiadomieniach
  const notifications = {
    messages: unreadCount?.messages || 0,
    notifications: unreadCount?.notifications || 0,
  };

  return (
    <header className="bg-white text-gray-800 sticky top-0 z-50 shadow-md">
      {/* Logo i linki nawigacyjne */}
      <div className="wrapper h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden md:flex gap-6">
            <DesktopNav user={user} />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
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
