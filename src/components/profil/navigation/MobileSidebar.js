import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Eye,
  Mail,
  FileText,
  Bell,
  History,
  PhoneCall,
  Settings as SettingsIcon,
  Sliders,
  ChevronRight,
  X,
} from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';
import { useSidebar } from './MainContentWrapper';

// Importujemy te same elementy nawigacyjne co w ProfileNavigation
const NAV_ITEMS = [
  {
    id: "panel",
    name: "Panel",
    path: "/profil",
    icon: Eye,
  },
  {
    id: "messages",
    name: "Wiadomości",
    path: "/profil/messages",
    icon: Mail,
    badgeKey: "messages",
  },
  {
    id: "listings",
    name: "Moje ogłoszenia",
    path: "/profil/listings",
    icon: FileText,
  },
  {
    id: "notifications",
    name: "Powiadomienia",
    path: "/profil/notifications",
    icon: Bell,
    badgeKey: "alerts",
  },
  {
    id: "transactions",
    name: "Historia Transakcji",
    path: "/profil/transactions",
    icon: History,
  },
  {
    id: "contact",
    name: "Kontakt",
    path: "/profil/contact",
    icon: PhoneCall,
  },
  {
    id: "settings",
    name: "Ustawienia",
    path: "/profil/settings",
    icon: SettingsIcon,
  },
];

const PRIMARY_COLOR = "#35530A";

const MobileSidebar = () => {
  const location = useLocation();
  const breakpoint = useBreakpoint();
  const { unreadCount = { messages: 0, alerts: 0 } } = useNotifications() || {};
  const { isAdmin } = useAuth();
  
  // Używamy contextu do zarządzania stanem sidebara
  const { isExpanded, setIsExpanded } = useSidebar();
  
  // Określamy, czy jesteśmy na urządzeniu mobilnym lub tablecie
  const isMobileOrTablet = breakpoint === 'mobile' || breakpoint === 'tablet';
  
  // Określamy aktywną zakładkę na podstawie aktualnej ścieżki
  const getActiveTab = () => {
    const current = NAV_ITEMS.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/")
    );
    return current ? current.id : null;
  };
  const activeTab = getActiveTab();
  
  // Jeśli nie jesteśmy na urządzeniu mobilnym lub tablecie, nie renderujemy tego komponentu
  if (!isMobileOrTablet) {
    return null;
  }
  
  // Funkcje sterujące widocznością sidebara
  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const closeSidebar = () => setIsExpanded(false);
  
  return (
    <>
      {/* Toggle button - visible only when sidebar is closed */}
      {!isExpanded && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-[#5A7834] text-white p-3 rounded-full shadow-lg hover:bg-[#4a6b2a] transition-all duration-200 hover:scale-105"
          aria-label="Otwórz menu"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#5A7834] text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={closeSidebar}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            aria-label="Zamknij menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-6 space-y-2 overflow-y-auto h-full pb-20">
          {isAdmin() && (
            <Link
              to="/admin"
              onClick={closeSidebar}
              className="flex items-center space-x-3 p-4 rounded-lg transition-colors text-yellow-300 hover:bg-white hover:bg-opacity-10 hover:text-yellow-200 mb-4 border-b border-white border-opacity-20 pb-4"
            >
              <Sliders className="w-6 h-6 flex-shrink-0" />
              <span className="text-base font-medium">Panel Administratora</span>
            </Link>
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <item.icon className="w-6 h-6" />
                  {item.badgeKey && unreadCount[item.badgeKey] > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-[#5A7834] rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold px-1">
                      {unreadCount[item.badgeKey] > 99 ? '99+' : unreadCount[item.badgeKey]}
                    </span>
                  )}
                </div>
                <span className="text-base font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;