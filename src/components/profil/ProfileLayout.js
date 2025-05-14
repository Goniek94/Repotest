import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaBell, 
  FaClock, 
  FaFileAlt, 
  FaCog, 
  FaChevronLeft,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../common/Badge';
import axios from 'axios';

/**
 * Komponent układu profilu użytkownika
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Zawartość strony
 * @param {string} props.title - Tytuł strony
 * @returns {JSX.Element} - Komponent układu profilu
 */
const ProfileLayout = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Pobieranie liczby nieprzeczytanych wiadomości i powiadomień
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        // Pobieranie nieprzeczytanych wiadomości
        const messagesResponse = await axios.get('/api/messages/unread/count');
        if (messagesResponse.data && typeof messagesResponse.data.count === 'number') {
          setUnreadMessages(messagesResponse.data.count);
        }
        
        // Pobieranie nieprzeczytanych powiadomień
        const notificationsResponse = await axios.get('/api/notifications/unread/count');
        if (notificationsResponse.data && typeof notificationsResponse.data.count === 'number') {
          setUnreadNotifications(notificationsResponse.data.count);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania liczby nieprzeczytanych elementów:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUnreadCounts();
    
    // Ustawienie interwału do odświeżania co 60 sekund
    const interval = setInterval(fetchUnreadCounts, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Menu boczne
  const menuItems = [
    {
      title: "Panel Główny",
      path: "/profil",
      icon: FaUser,
      exact: true
    },
    {
      title: "Wiadomości",
      path: "/profil/messages",
      icon: FaEnvelope,
      badge: unreadMessages
    },
    {
      title: "Powiadomienia",
      path: "/profil/notifications",
      icon: FaBell,
      badge: unreadNotifications
    },
    {
      title: "Historia Transakcji",
      path: "/profil/transactions",
      icon: FaClock
    },
    {
      title: "Moje Ogłoszenia",
      path: "/profil/listings",
      icon: FaFileAlt
    },
    {
      title: "Ustawienia",
      path: "/profil/settings",
      icon: FaCog
    }
  ];

  /**
   * Sprawdza, czy dana ścieżka jest aktywna
   * @param {string} path - Ścieżka do sprawdzenia
   * @param {boolean} exact - Czy ścieżka musi być dokładnie taka sama
   * @returns {boolean} - Czy ścieżka jest aktywna
   */
  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  /**
   * Przełącza widoczność menu mobilnego
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Nagłówek mobilny */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('/profil')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaChevronLeft size={20} className="mr-1" />
          <span>Powrót do panelu</span>
        </button>
        <button 
          onClick={toggleMobileMenu}
          className="text-gray-600 hover:text-gray-900"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu mobilne */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg rounded-lg mb-6 overflow-hidden">
          <nav className="divide-y divide-gray-100">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                state={item.path === "/profil/messages" ? { openComposeModal: false } : undefined}
                className={`flex items-center justify-between px-4 py-3 transition-colors
                  ${isActive(item.path, item.exact) 
                    ? 'bg-green-50 text-[#35530A]'
                    : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className={`mr-3 flex-shrink-0 ${isActive(item.path, item.exact) ? 'text-[#35530A]' : 'text-gray-400'}`} />
                  {item.title}
                </div>
                {item.badge > 0 && (
                  <Badge count={item.badge} variant="danger" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Główna zawartość */}
      <main className="space-y-6">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;
