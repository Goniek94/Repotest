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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import useBreakpoint from '../../utils/responsive/useBreakpoint';
import { useSidebar } from '../../contexts/SidebarContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { id: 'panel', path: '/profil', icon: Eye },
  { id: 'messages', path: '/profil/messages', icon: Mail, badgeKey: 'messages' },
  { id: 'listings', path: '/profil/listings', icon: FileText },
  { id: 'notifications', path: '/profil/notifications', icon: Bell, badgeKey: 'alerts' },
  { id: 'transactions', path: '/profil/transactions', icon: History },
  { id: 'contact', path: '/profil/contact', icon: PhoneCall },
  { id: 'settings', path: '/profil/settings', icon: SettingsIcon },
];

const MobileSidebar = () => {
  const breakpoint = useBreakpoint();
  const { isOpen, toggle, close, bounds } = useSidebar();
  const { unreadCount = { messages: 0, alerts: 0 } } = useNotifications();
  const { isAdmin } = useAuth();
  const location = useLocation();

  const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';

  if (!isMobile || !bounds) return null;

  const activeId = NAV_ITEMS.find(
    (item) =>
      location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  )?.id;

  return (
    <>
      <button
        onClick={toggle}
        className="fixed z-50 bg-[#5A7834] text-white p-1 rounded-b-md"
        style={{ top: bounds.top - 32, left: bounds.left }}
        aria-label="Toggle menu"
      >
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div
          className="fixed z-50 bg-[#5A7834] text-white flex flex-col items-center"
          style={{ top: bounds.top, left: bounds.left, height: bounds.height, width: '48px' }}
        >
          {isAdmin() && (
            <Link
              to="/admin"
              onClick={close}
              className="w-12 h-12 flex items-center justify-center hover:bg-[#4a6b2a]"
            >
              <Sliders className="w-5 h-5" />
            </Link>
          )}
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={close}
              className={`w-12 h-12 flex items-center justify-center relative hover:bg-[#4a6b2a] ${
                activeId === item.id ? 'bg-[#4a6b2a]' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.badgeKey && unreadCount[item.badgeKey] > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#5A7834] rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                  {unreadCount[item.badgeKey] > 99 ? '99+' : unreadCount[item.badgeKey]}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default MobileSidebar;
