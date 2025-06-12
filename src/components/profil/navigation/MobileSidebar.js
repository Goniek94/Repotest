import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Eye, Mail, FileText, Bell, History, PhoneCall, Settings as SettingsIcon, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  // Funkcja do przełączania stanu sidebara
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full flex flex-col bg-[#5A7834] text-white shadow-lg z-40 overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-12'
      }`}>
        
        {/* Przycisk do zwijania/rozwijania na górze */}
        <div className="flex justify-end p-2 border-b border-white border-opacity-20">
          <button
            onClick={toggleSidebar}
            className="text-white hover:bg-white hover:bg-opacity-10 p-1 rounded transition-colors"
            aria-label={isExpanded ? "Zwiń menu" : "Rozwiń menu"}
          >
            {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Nawigacja */}
        <nav className={`flex flex-col h-full ${isExpanded ? 'justify-start space-y-2 p-4' : 'justify-center space-y-6 py-4'}`}>
          {/* Admin Panel link - widoczny tylko dla administratorów */}
          {isAdmin() && (
            <Link
              to="/admin"
              className={`flex ${isExpanded ? 'flex-row items-center space-x-3 p-3' : 'flex-col items-center justify-center p-2'} rounded-md transition-colors hover:bg-white hover:bg-opacity-10`}
              title="Panel Administratora"
            >
              <Sliders className="w-6 h-6 text-yellow-300 flex-shrink-0" />
              {isExpanded && <span className="text-sm whitespace-nowrap">Panel Administratora</span>}
            </Link>
          )}
          
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex ${isExpanded ? 'flex-row items-center space-x-3 p-3' : 'flex-col items-center justify-center p-2'} rounded-md transition-colors ${
                  isActive
                    ? 'bg-white bg-opacity-20'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
                title={item.name}
              >
                <div className="relative flex-shrink-0">
                  <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-200'}`} />
                  {item.badgeKey && unreadCount[item.badgeKey] > 0 && (
                    <span
                      className={`${isExpanded ? 'absolute -top-2 -right-2' : 'absolute -top-1 -right-1'} bg-white text-[#5A7834] rounded-full min-w-[16px] h-4 flex items-center justify-center text-xs font-bold px-1`}
                    >
                      {unreadCount[item.badgeKey] > 99 ? '99+' : unreadCount[item.badgeKey]}
                    </span>
                  )}
                </div>
                {isExpanded && <span className="text-sm whitespace-nowrap overflow-hidden">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;