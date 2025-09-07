import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  Mail, 
  FileText, 
  Bell, 
  History, 
  PhoneCall, 
  Settings,
  UserCog,
  Image,
  Link
} from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useResponsiveContext } from '../../../contexts/ResponsiveContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useMobileMenu } from '../../../contexts/MobileMenuContext';

/**
 * Mobilny sidebar dla panelu użytkownika
 * Widoczny tylko na urządzeniach mobilnych i tabletach
 * 
 * @param {Object} props
 * @param {string} props.activeItem - ID aktywnego elementu menu
 * @returns {JSX.Element}
 */
const MobilePanelSidebar = ({ activeItem = 'panel' }) => {
  const { unreadCount } = useNotifications();
  const { isMobile } = useResponsiveContext();
  const { isAdmin } = useAuth();
  const { isMobileMenuOpen } = useMobileMenu();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Renderujemy TYLKO na mobilkach (nie na tabletach/iPadach)
  if (!isMobile) {
    return null;
  }
  
  // WAŻNE: Renderujemy TYLKO w panelu użytkownika (/profil/*)
  if (!location.pathname.startsWith('/profil')) {
    return null;
  }
  
  // Nie renderuj gdy otwarte jest główne menu mobilne
  if (isMobileMenuOpen) {
    return null;
  }
  
  // Menu items odpowiadające nawigacji desktopowej
  const menuItems = [
    { id: 'panel', icon: Eye, label: 'Panel', href: '/profil', relativePath: '' },
    { id: 'messages', icon: Mail, label: 'Wiadomości', href: '/profil/messages?folder=odebrane', relativePath: 'messages?folder=odebrane', badgeKey: 'messages' },
    { id: 'listings', icon: FileText, label: 'Moje ogłoszenia', href: '/profil/listings', relativePath: 'listings' },
    { id: 'notifications', icon: Bell, label: 'Powiadomienia', href: '/profil/notifications', relativePath: 'notifications', badgeKey: 'alerts' },
    { id: 'transactions', icon: History, label: 'Historia Transakcji', href: '/profil/transactions', relativePath: 'transactions' },
    { id: 'contact', icon: PhoneCall, label: 'Kontakt', href: '/profil/contact', relativePath: 'contact' },
    { id: 'settings', icon: Settings, label: 'Ustawienia', href: '/profil/settings', relativePath: 'settings' }
  ];
  
  // Dodajemy opcję Admin dla administratorów
  if (isAdmin) {
    menuItems.push({ id: 'admin', icon: UserCog, label: 'Panel Administratora', href: '/admin' });
  }

  const handleItemClick = (item) => {
    console.log('🔄 MobilePanelSidebar - handleItemClick:', item);
    console.log('🔄 MobilePanelSidebar - navigating to:', item.href);
    
    // Dodaj preventDefault dla lepszej kontroli
    try {
      navigate(item.href);
      console.log('✅ MobilePanelSidebar - nawigacja zakończona pomyślnie');
    } catch (error) {
      console.error('❌ MobilePanelSidebar - błąd nawigacji:', error);
    }
  };

  return (
    <aside 
      className="fixed left-0 top-16 w-14 bg-[#35530A] shadow-lg border-r border-[#35530A]/20 z-[9999]" 
      style={{ bottom: '48px' }}
    >
      <div className="flex flex-col h-full py-4 space-y-3 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Poprawiona logika sprawdzania aktywności
          let isActive = false;
          
          if (item.id === 'panel') {
            // Panel jest aktywny tylko na dokładnej ścieżce /profil
            isActive = location.pathname === '/profil';
          } else if (item.id === 'admin') {
            // Admin jest aktywny na ścieżce /admin
            isActive = location.pathname.startsWith('/admin');
          } else {
            // Inne sekcje są aktywne gdy ścieżka zaczyna się od ich href
            const basePath = item.href.split('?')[0];
            isActive = location.pathname.startsWith(basePath) && location.pathname !== '/profil';
          }
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                transition-all duration-200 relative group
                ${isActive 
                  ? 'bg-white text-[#35530A] shadow-md' 
                  : 'text-white hover:bg-[#35530A]/80 hover:text-white'
                }
              `}
              title={item.label}
            >
              <Icon className="h-4 w-4" />
              
              {/* Badge dla nieprzeczytanych wiadomości/powiadomień */}
              {item.badgeKey && unreadCount[item.badgeKey] > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center">
                  {unreadCount[item.badgeKey] > 99 ? '99+' : unreadCount[item.badgeKey]}
                </span>
              )}
              
              {/* Tooltip na hover */}
              <div className="absolute left-12 bg-white text-[#35530A] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default MobilePanelSidebar;
