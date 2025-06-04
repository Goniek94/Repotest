import React, { useState } from 'react';
import { User, MessageSquare, ShoppingBag, BellRing, History, Phone, LayoutDashboard } from 'lucide-react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';
import { useNotifications } from '../../../contexts/NotificationContext';
import Messages from '../messages/Messages';
import UserListings from '../listings/UserListings';
import useUserDashboardData from './hooks/useUserDashboardData';
import WelcomeCard from './WelcomeCard';
import ActivitySection from './ActivitySection';
import TransactionHistoryTab from './TabContent/TransactionHistoryTab';
import NotificationsTab from './TabContent/NotificationsTab';
import ContactTab from './TabContent/ContactTab';

// Główny kolor aplikacji
const PRIMARY_COLOR = '#35530A';

// Definicje zakładek
const TABS = {
  PANEL: 'panel',
  MESSAGES: 'messages',
  LISTINGS: 'listings',
  NOTIFICATIONS: 'notifications',
  TRANSACTIONS: 'transactions',
  CONTACT: 'contact'
};

/**
 * Główny komponent panelu użytkownika
 */
const UserPanel = () => {
  // Stan dla breakpointów
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';
  const { unreadCount = { messages: 0, alerts: 0 } } = useNotifications() || {};
  
  // Stan aktywnej zakładki
  const [activeTab, setActiveTab] = useState(TABS.PANEL);
  
  // Pobieranie danych użytkownika za pomocą hooka
  const { userStats, recentAds, activities, isLoading, error, user } = useUserDashboardData();

  // Konfiguracja zakładek głównej nawigacji
  const navigationTabs = [
    { id: TABS.PANEL, label: 'Panel', icon: <LayoutDashboard size={isMobile ? 18 : 20} /> },
    { id: TABS.MESSAGES, label: 'Wiadomości', icon: <MessageSquare size={isMobile ? 18 : 20} /> },
    { id: TABS.LISTINGS, label: 'Moje ogłoszenia', icon: <ShoppingBag size={isMobile ? 18 : 20} /> },
    { id: TABS.NOTIFICATIONS, label: 'Powiadomienia', icon: <BellRing size={isMobile ? 18 : 20} /> },
    { id: TABS.TRANSACTIONS, label: 'Historia transakcji', icon: <History size={isMobile ? 18 : 20} /> },
    { id: TABS.CONTACT, label: 'Kontakt', icon: <Phone size={isMobile ? 18 : 20} /> }
  ];

  // Renderowanie zawartości panelu głównego
  const renderPanelContent = () => {
    // Wyświetlanie stanu ładowania
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 border-b-2 border-l-2" 
               style={{ borderColor: PRIMARY_COLOR }}></div>
          <p className="mt-4 sm:mt-5 text-gray-600 text-sm sm:text-base md:text-lg font-medium">
            Ładowanie danych użytkownika...
          </p>
        </div>
      );
    }
    
    // Wyświetlanie błędu
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 sm:p-6 my-4 sm:my-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Wystąpił błąd</h3>
          <p className="text-sm sm:text-base">Nie udało się załadować danych. Spróbuj ponownie później.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 sm:mt-4 bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-md text-sm sm:text-base transition-colors duration-200"
          >
            Odśwież stronę
          </button>
        </div>
      );
    }
    
    // Renderowanie zawartości panelu
    return (
      <div className="transition-opacity duration-300 ease-in-out animate-fadeIn">
        {/* Karta powitalna */}
        <WelcomeCard 
          user={user} 
          userStats={userStats} 
          isMobile={isMobile} 
        />

        {/* Sekcja aktywności */}
        <ActivitySection
          recentAds={recentAds}
          activities={activities}
        />
      </div>
    );
  };

  // Renderowanie odpowiedniej zawartości w zależności od aktywnej zakładki
  const renderContent = () => {
    switch (activeTab) {
      case TABS.PANEL:
        return renderPanelContent();
      case TABS.MESSAGES:
        return <div className="transition-opacity duration-300 ease-in-out animate-fadeIn"><Messages /></div>;
      case TABS.LISTINGS:
        return <div className="transition-opacity duration-300 ease-in-out animate-fadeIn"><UserListings /></div>;
      case TABS.NOTIFICATIONS:
        return <div className="transition-opacity duration-300 ease-in-out animate-fadeIn"><NotificationsTab /></div>;
      case TABS.TRANSACTIONS:
        return <div className="transition-opacity duration-300 ease-in-out animate-fadeIn"><TransactionHistoryTab /></div>;
      case TABS.CONTACT:
        return <div className="transition-opacity duration-300 ease-in-out animate-fadeIn"><ContactTab /></div>;
      default:
        return renderPanelContent();
    }
  };

  // Style CSS dla kontenera panelu (bez wpływu na przewijanie całej strony)
  const panelContainerStyle = {
    maxWidth: '1140px',
    width: '100%',
    padding: '0',
    overflowX: 'hidden',  // Ukrycie poziomego przewijania tylko dla tego kontenera
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Główny kontener - dostosowany do szerokości górnego paska */}
      <div 
        className="mx-auto" 
        style={panelContainerStyle}
      >
        {/* Zawartość aktywnej zakładki */}
        <div style={{ padding: '0 0.75rem' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dodanie animacji do Tailwind (w rzeczywistości należałoby dodać to do konfiguracji Tailwind)
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
`;

// Dodanie stylu do head dokumentu
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = fadeInAnimation;
  document.head.appendChild(style);
}

export default UserPanel;