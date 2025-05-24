import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, Mail, FileText, Bell, History, PhoneCall } from 'lucide-react';

// Główny kolor
const PRIMARY_COLOR = '#35530A';

// Stałe identyfikatory zakładek
export const TABS = {
  PANEL: 'panel',
  MESSAGES: 'messages',
  LISTINGS: 'listings',
  NOTIFICATIONS: 'notifications',
  TRANSACTIONS: 'transactions',
  CONTACT: 'contact'
};

// Mapowanie identyfikatorów zakładek na ścieżki URL
const TAB_PATHS = {
  [TABS.PANEL]: '/profil',
  [TABS.MESSAGES]: '/profil/messages',
  [TABS.LISTINGS]: '/profil/listings',
  [TABS.NOTIFICATIONS]: '/profil/notifications',
  [TABS.TRANSACTIONS]: '/profil/transactions',
  [TABS.CONTACT]: '/profil/contact'
};

const UserNavigation = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Określenie aktywnej zakładki na podstawie ścieżki URL, jeśli nie podano activeTab
  const currentPath = location.pathname;
  const currentTab = activeTab || Object.entries(TAB_PATHS).find(
    ([_, path]) => currentPath.startsWith(path)
  )?.[0] || TABS.PANEL;
  
  // Funkcja obsługująca kliknięcie zakładki
  const handleTabClick = (tabId) => {
    if (typeof onTabChange === 'function') {
      // Jeśli przekazano funkcję onTabChange, użyj jej
      onTabChange(tabId);
    } else {
      // W przeciwnym razie nawiguj do odpowiedniej ścieżki
      navigate(TAB_PATHS[tabId]);
    }
  };
  // Nawigacja z ikonami i licznikami powiadomień
  const navItems = [
    { 
      id: TABS.PANEL, 
      name: 'Panel', 
      icon: Eye
    },
    { 
      id: TABS.MESSAGES, 
      name: 'Wiadomości', 
      icon: Mail,
      notifications: 5
    },
    { 
      id: TABS.LISTINGS, 
      name: 'Moje ogłoszenia', 
      icon: FileText
    },
    { 
      id: TABS.NOTIFICATIONS, 
      name: 'Powiadomienia', 
      icon: Bell,
      notifications: 3
    },
    { 
      id: TABS.TRANSACTIONS, 
      name: 'Historia Transakcji', 
      icon: History
    },
    { 
      id: TABS.CONTACT, 
      name: 'Kontakt', 
      icon: PhoneCall
    }
  ];

  return (
    <div className="w-full border-b border-gray-200 mb-6 bg-white">
      <div className="flex overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`whitespace-nowrap py-3 px-4 md:px-5 flex items-center transition-colors ${
              currentTab === item.id
                ? 'border-b-2 text-[#35530A] border-[#35530A] font-medium'
                : 'text-gray-600 hover:text-green-800'
            }`}
          >
            <item.icon className="w-4 h-4 mr-2" /> {item.name}
            {item.notifications && (
              <span 
                className="ml-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                {item.notifications}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserNavigation;