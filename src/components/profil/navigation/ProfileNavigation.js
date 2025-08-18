import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Eye,
  Mail,
  FileText,
  Bell,
  History,
  PhoneCall,
  LogOut,
  Settings as SettingsIcon,
  Sliders,
  ArrowUp,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useSidebar } from '../../../contexts/SidebarContext';
import { useResponsiveContext } from '../../../contexts/ResponsiveContext';

const BASE_ITEMS = [
  { id: 'panel', name: 'Panel', path: '/profil', icon: Eye },
  { id: 'messages', name: 'Wiadomości', path: '/profil/messages', search: '?folder=odebrane', icon: Mail, badgeKey: 'messages' },
  { id: 'listings', name: 'Moje ogłoszenia', path: '/profil/listings', icon: FileText },
  { id: 'notifications', name: 'Powiadomienia', path: '/profil/notifications', icon: Bell, badgeKey: 'notifications' },
  { id: 'transactions', name: 'Historia Transakcji', path: '/profil/transactions', icon: History },
  { id: 'contact', name: 'Kontakt', path: '/profil/contact', icon: PhoneCall },
  { id: 'settings', name: 'Ustawienia', path: '/profil/settings', icon: SettingsIcon },
];

const PRIMARY_COLOR = '#35530A';

const ProfileNavigation = React.forwardRef(
  (
    {
      notifications,
      handleLogout,
      isDropdown = false,
      isOpen,
      setIsOpen,
      user,
      handleRaisePanel,
      isPanelRaised,
      activeTab: propActiveTab,
    },
    ref
  ) => {
  const { isMobile, isTablet } = useResponsiveContext();
  const isMobileView = isMobile || isTablet;
  const { isAdmin } = useAuth();
  const { unreadCount = { notifications: 0, messages: 0 } } = useNotifications();
  const { isExpanded } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Jeśli nie przekazano handleRaisePanel i isPanelRaised, używamy lokalnego stanu
  const [localIsPanelRaised, setLocalIsPanelRaised] = useState(false);
  
  // Funkcja do podnoszenia panelu użytkownika
  const handleRaisePanelLocal = () => {
    if (handleRaisePanel) {
      // Używamy funkcji przekazanej przez props
      handleRaisePanel();
    } else {
      // Używamy lokalnego stanu
      setLocalIsPanelRaised(!localIsPanelRaised);
      // Dodajemy lub usuwamy klasę do body, która podnosi panel
      if (!localIsPanelRaised) {
        document.body.classList.add('panel-raised');
      } else {
        document.body.classList.remove('panel-raised');
      }
    }
  };
  
  // Używamy albo przekazanego stanu, albo lokalnego
  const isRaised = isPanelRaised !== undefined ? isPanelRaised : localIsPanelRaised;

  const navItems = React.useMemo(() => {
    // Usuwamy opcję Admin z nawigacji na desktopach
    return [...BASE_ITEMS];
  }, []);

  const counts = notifications || unreadCount;
  // Używamy activeTab z props, jeśli jest dostępny, w przeciwnym razie określamy go na podstawie ścieżki
  const activeTab = propActiveTab || navItems.find(
    (item) =>
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + '/')
  )?.id;

    const isMobile = isMobileView;

    if (isDropdown) {
      return (
        <div ref={ref} className="relative user-menu">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen && setIsOpen(!isOpen);
            }}
            className="px-4 py-2 font-bold uppercase rounded-[2px] hover:bg-gray-100 transition-colors relative flex items-center gap-2 text-gray-800 text-sm lg:text-base xl:text-lg"
          >
            Mój Profil
            {counts.messages + counts.notifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {counts.messages + counts.notifications}
              </div>
            )}
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-[2px] shadow-xl z-50 border border-gray-200">
              <div className="py-2">
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-[#35530A] font-bold hover:bg-gray-100 uppercase flex items-center gap-2"
                    onClick={() => setIsOpen && setIsOpen(false)}
                  >
                    <Sliders className="w-4 h-4 mr-2" />
                    Panel Administratora
                  </Link>
                )}
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={{
                      pathname: item.path,
                      search: item.search || ''
                    }}
                    className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase font-bold transition ${
                      activeTab === item.id ? 'text-[#35530A] font-bold border-b-2 border-[#35530A] bg-[#F3F4F6]' : ''
                    } flex items-center gap-2`}
                    onClick={() => setIsOpen && setIsOpen(false)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {item.badgeKey && counts[item.badgeKey] > 0 && (
                      <span className="ml-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {counts[item.badgeKey]}
                      </span>
                    )}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 uppercase flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Wyloguj się
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (isMobile) {
      return (
        <nav ref={ref} className="flex flex-col mt-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={{
                pathname: item.path,
                search: item.search || ''
              }}
              className={`flex items-center justify-center gap-3 px-3 py-3 text-white hover:bg-[#4a6b2a] rounded-md ${
                activeTab === item.id ? 'bg-[#4a6b2a]' : ''
              }`}
            >
              <item.icon className="w-6 h-6" />
              {item.badgeKey && counts[item.badgeKey] > 0 && (
                <span className="ml-auto text-[#35530A] bg-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold">
                  {counts[item.badgeKey] > 99 ? '99+' : counts[item.badgeKey]}
                </span>
              )}
            </Link>
          ))}
          {/* Przycisk do podnoszenia panelu użytkownika */}
          <button
            onClick={handleRaisePanelLocal}
            className={`flex items-center justify-center gap-3 px-3 py-3 text-white hover:bg-[#4a6b2a] rounded-md ${
              isRaised ? 'bg-[#4a6b2a]' : ''
            }`}
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </nav>
      );
    }

    return (
      <div ref={ref} className="w-full relative">
        <div className="flex justify-between flex-wrap gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.search) {
                  navigate({
                    pathname: item.path,
                    search: item.search
                  });
                } else {
                  navigate(item.path);
                }
              }}
            className={`whitespace-nowrap py-3 px-3 md:px-4 flex items-center transition-colors border-b-3 ${
              activeTab === item.id
                ? 'text-[#35530A] border-[#35530A] font-medium bg-white'
                : 'text-gray-600 hover:text-green-800 border-transparent hover:border-gray-300'
            }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.name}
              {item.badgeKey && counts[item.badgeKey] > 0 && (
                <span className="ml-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {counts[item.badgeKey]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

export default ProfileNavigation;
