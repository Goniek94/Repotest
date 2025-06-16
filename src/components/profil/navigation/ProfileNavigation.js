import React from 'react';
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
} from 'lucide-react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useSidebar } from '../../../contexts/SidebarContext';

const BASE_ITEMS = [
  { id: 'panel', name: 'Panel', path: '/profil', icon: Eye },
  { id: 'messages', name: 'Wiadomości', path: '/profil/messages', icon: Mail, badgeKey: 'messages' },
  { id: 'listings', name: 'Moje ogłoszenia', path: '/profil/listings', icon: FileText },
  { id: 'notifications', name: 'Powiadomienia', path: '/profil/notifications', icon: Bell, badgeKey: 'alerts' },
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
    },
    ref
  ) => {
  const breakpoint = useBreakpoint();
  const { isAdmin } = useAuth();
  const { unreadCount = { messages: 0, alerts: 0 } } = useNotifications();
  const { isExpanded } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = React.useMemo(() => {
    const items = [...BASE_ITEMS];
    if (isAdmin && isAdmin()) {
      items.push({ id: 'admin', name: 'Admin', path: '/admin', icon: Sliders });
    }
    return items;
  }, [isAdmin]);

  const counts = notifications || unreadCount;
  const activeTab = navItems.find(
    (item) =>
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + '/')
  )?.id;

    const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';

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
            {counts.messages + counts.alerts > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {counts.messages + counts.alerts}
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
                    to={item.path}
                    className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase font-bold transition ${
                      activeTab === item.id ? 'text-[#35530A] font-bold border-b-2 border-[#35530A] bg-[#F3F4F6]' : ''
                    } flex items-center gap-2`}
                    onClick={() => setIsOpen && setIsOpen(false)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {item.badgeKey && counts[item.badgeKey] > 0 && (
                      <span
                        className="ml-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                      >
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
        <nav ref={ref} className="flex flex-col mt-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center justify-center gap-3 px-3 py-2 text-white hover:bg-[#4a6b2a] ${
                activeTab === item.id ? 'bg-[#4a6b2a]' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.badgeKey && counts[item.badgeKey] > 0 && (
                <span className="ml-auto text-[#35530A] bg-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold">
                  {counts[item.badgeKey] > 99 ? '99+' : counts[item.badgeKey]}
                </span>
              )}
            </Link>
          ))}
        </nav>
      );
    }

    return (
      <div ref={ref} className="w-full border-b border-gray-200 mb-6 bg-white relative">
        <div className="flex justify-between flex-wrap">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`whitespace-nowrap py-3 px-4 md:px-5 flex items-center transition-colors ${
                activeTab === item.id
                  ? 'border-b-3 text-[#35530A] border-[#35530A] font-medium bg-[#f5f8f0] -mb-[1px]'
                  : 'text-gray-600 hover:text-green-800 hover:border-b-2 hover:border-gray-300'
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.name}
              {item.badgeKey && counts[item.badgeKey] > 0 && (
                <span
                  className="ml-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
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
