import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Eye, Mail, FileText, Bell, History, PhoneCall, Settings as SettingsIcon, Sliders } from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';

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
  
  return (
    <div className="fixed left-0 top-0 h-full flex flex-col bg-[#5A7834] text-white shadow-lg z-40 overflow-hidden w-12">
      {/* Nawigacja pionowa */}
      <nav className="flex flex-col h-full justify-center space-y-8 py-4">
        {/* Admin Panel link - widoczny tylko dla administratorów */}
        {isAdmin() && (
          <Link
            to="/admin"
            className="flex flex-col items-center justify-center p-2 rounded-md transition-colors hover:bg-white hover:bg-opacity-10"
            title="Panel Administratora"
          >
            <Sliders className="w-6 h-6 text-yellow-300" />
          </Link>
        )}
        
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-white bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
              title={item.name}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-200'}`} />
              {item.badgeKey && unreadCount[item.badgeKey] > 0 && (
                <span
                  className="mt-1 bg-white text-[#5A7834] rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"
                >
                  {unreadCount[item.badgeKey]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileSidebar;