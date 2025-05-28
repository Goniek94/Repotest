import React, { useState } from 'react';
import { Bell, Mail, Car, User, MessageSquare, ShoppingBag, BellRing, History, Phone } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Messages from '../messages/Messages';
import UserListings from '../listings/UserListings';
import RecentListingItem from '../components/RecentListingItem';
import ActivityItem from '../components/ActivityItem';

// Główny kolor
const PRIMARY_COLOR = '#35530A';
const PRIMARY_DARK = '#2A4208'; 
const PRIMARY_LIGHT = '#EAF2DE';

// Definicje zakładek
const TABS = {
  PANEL: 'panel',
  MESSAGES: 'messages',
  LISTINGS: 'listings',
  NOTIFICATIONS: 'notifications',
  TRANSACTIONS: 'transactions',
  CONTACT: 'contact'
};

// Stub dla TransactionHistory, który obecnie nie istnieje lub jest w nieprawidłowej lokalizacji
const TransactionHistory = () => (
  <div className="bg-white p-6 rounded-sm shadow-sm">
    <h2 className="text-xl font-bold mb-4">Historia transakcji</h2>
    <p>Tutaj będzie wyświetlana historia transakcji.</p>
  </div>
);

// Placeholder components for tabs that don't have implementations yet
const Notifications = () => (
  <div className="bg-white p-6 rounded-sm shadow-sm">
    <h2 className="text-xl font-bold mb-4">Powiadomienia</h2>
    <p>Tutaj będą wyświetlane powiadomienia.</p>
  </div>
);

const Contact = () => (
  <div className="bg-white p-6 rounded-sm shadow-sm">
    <h2 className="text-xl font-bold mb-4">Kontakt</h2>
    <p>Tutaj będą wyświetlane informacje kontaktowe.</p>
  </div>
);

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState(TABS.PANEL);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Statyczne dane użytkownika
  const stats = {
    activeListings: 5,
    completedTransactions: 12,
    sellerRating: 4.8
  };
  
  const recentListings = [
    {
      title: "BMW 520d 2019",
      description: "Sedan, 190 KM, 80 000 km",
      price: "95 000 zł",
      href: "#",
    },
    {
      title: "Audi A4 2020",
      description: "Kombi, 150 KM, 45 000 km",
      price: "112 000 zł",
      href: "#",
    },
    {
      title: "Volkswagen Passat 2021",
      description: "Sedan, 170 KM, 35 000 km",
      price: "129 000 zł",
      href: "#",
    }
  ];
  
  const activities = [
    {
      icon: <Mail className="w-4 h-4 text-gray-600" />,
      title: "Nowa wiadomość od użytkownika",
      description: "Odpowiedz, aby kontynuować rozmowę",
      time: "dziś, 10:17",
      href: "#",
      actionLabel: "Odpowiedz",
    },
    {
      icon: <Car className="w-4 h-4 text-gray-600" />,
      title: "Dodano nowe ogłoszenie",
      description: "Sprawdź szczegóły swojego ogłoszenia",
      time: "wczoraj, 12:17",
      href: "#",
      actionLabel: "Zobacz",
    },
    {
      icon: <Bell className="w-4 h-4 text-gray-600" />,
      title: "Nowe powiadomienie systemowe",
      description: "Ważna aktualizacja regulaminu serwisu",
      time: "14.05.2025",
      href: "#",
      actionLabel: "Zobacz",
    }
  ];

  // Konfiguracja zakładek głównej nawigacji
  const navigationTabs = [
    { id: TABS.PANEL, label: 'Panel', icon: <User size={18} /> },
    { id: TABS.MESSAGES, label: 'Wiadomości', icon: <MessageSquare size={18} /> },
    { id: TABS.LISTINGS, label: 'Moje ogłoszenia', icon: <ShoppingBag size={18} /> },
    { id: TABS.NOTIFICATIONS, label: 'Powiadomienia', icon: <BellRing size={18} /> },
    { id: TABS.TRANSACTIONS, label: 'Historia transakcji', icon: <History size={18} /> },
    { id: TABS.CONTACT, label: 'Kontakt', icon: <Phone size={18} /> }
  ];

  // Renderowanie zawartości panelu głównego
  const renderPanelContent = () => {
    // Wyświetlanie stanu ładowania
    if (authLoading) {
      return (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: PRIMARY_COLOR }}></div>
          <p className="mt-4 text-gray-600">Ładowanie danych użytkownika...</p>
        </div>
      );
    }
    
    // Inicjał użytkownika
    const getInitial = () => {
      if (user && user.firstName && user.firstName.length > 0) {
        return user.firstName.charAt(0).toUpperCase();
      }
      return 'U';
    };
    
    // Imię użytkownika
    const userName = user && user.firstName ? user.firstName : 'Użytkowniku';
    
    return (
      <>
        {/* Nowa karta powitalna - jeden spójny panel z zaokrąglonymi rogami */}
        <div className="rounded-lg overflow-hidden shadow-md mb-6 md:mb-8 text-white relative" 
             style={{ background: PRIMARY_COLOR, borderRadius: '10px' }}>
          <div className="p-4 flex items-center">
            {/* Avatar z inicjałem */}
            <div className="bg-opacity-30 bg-white h-16 w-16 rounded-full flex items-center justify-center mr-4 border-2 border-opacity-20 border-white">
              <span className="text-2xl font-bold">{getInitial()}</span>
            </div>
            
            {/* Powitanie i ostatnie logowanie */}
            <div className="flex-grow">
              <h2 className="text-2xl font-bold">Witaj, {userName}!</h2>
              <div className="flex items-center text-sm opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Ostatnie logowanie: dziś, 12:30
              </div>
            </div>
            
            {/* Przyciski */}
            <div className="flex gap-2">
              <button 
                className="flex items-center bg-opacity-20 bg-white hover:bg-opacity-30 px-3 py-1.5 rounded text-sm"
                onClick={() => navigate('/profil/settings')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Ustawienia
              </button>
              <button 
                className="flex items-center bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm"
                onClick={() => navigate('/dodaj-ogloszenie')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Dodaj ogłoszenie
              </button>
            </div>
          </div>
          
          {/* Dolna sekcja ze statystykami */}
          <div className="flex text-white border-t border-opacity-20 border-white">
            <div className="w-1/3 py-3 px-4 text-center border-r border-opacity-20 border-white">
              <div className="text-sm text-opacity-80 text-white">Aktywne ogłoszenia</div>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
            </div>
            <div className="w-1/3 py-3 px-4 text-center border-r border-opacity-20 border-white">
              <div className="text-sm text-opacity-80 text-white">Zakończone transakcje</div>
              <div className="text-2xl font-bold">{stats.completedTransactions}</div>
            </div>
            <div className="w-1/3 py-3 px-4 text-center">
              <div className="text-sm text-opacity-80 text-white">Ocena sprzedającego</div>
              <div className="flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.sellerRating.toFixed(1)}/5</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-green-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sekcje Ostatnio przeglądane oraz Ostatnia aktywność obok siebie */}
        <div className="flex flex-row w-full gap-4 md:gap-6">
          {/* Ostatnio przeglądane */}
          <div className="bg-white p-5 w-1/2 border border-gray-200 shadow-lg" style={{ borderRadius: '8px' }}>
            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">Ostatnio przeglądane</h3>
            
            <div className="space-y-4">
              {recentListings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Brak ostatnio przeglądanych ogłoszeń</p>
              ) : (
                recentListings.map((item, idx) => (
                  <RecentListingItem
                    key={idx}
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    href={item.href}
                    imageLabel="Auto"
                    color={PRIMARY_COLOR}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* Ostatnia aktywność */}
          <div className="bg-white p-5 w-1/2 border border-gray-200 shadow-lg" style={{ borderRadius: '8px' }}>
            <h3 className="text-lg font-bold text-gray-700 mb-4">Ostatnia aktywność</h3>
            
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Brak ostatnich aktywności</p>
              ) : (
                activities.map((item, idx) => (
                  <ActivityItem
                    key={idx}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    time={item.time}
                    href={item.href}
                    actionLabel={item.actionLabel}
                    color={PRIMARY_COLOR}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  // Renderowanie odpowiedniej zawartości w zależności od aktywnej zakładki
  const renderContent = () => {
    switch (activeTab) {
      case TABS.PANEL:
        return renderPanelContent();
      case TABS.MESSAGES:
        return <Messages />;
      case TABS.LISTINGS:
        return <UserListings />;
      case TABS.NOTIFICATIONS:
        return <Notifications />;
      case TABS.TRANSACTIONS:
        return <TransactionHistory />;
      case TABS.CONTACT:
        return <Contact />;
      default:
        return renderPanelContent();
    }
  };

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Główny kontener */}
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
        {/* Górna nawigacja z podkreśleniem aktywnej zakładki */}
        <div className="flex mb-8 border-b-2 border-gray-100 shadow-sm pb-0.5 bg-white">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center mr-8 py-4 px-3 transition-all duration-200 ${
                activeTab === tab.id
                  ? `text-[${PRIMARY_COLOR}] border-b-3 border-[${PRIMARY_COLOR}] font-medium -mb-[2px]`
                  : `text-gray-500 border-b-2 border-transparent hover:text-[${PRIMARY_COLOR}] hover:border-gray-200`
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Zawartość aktywnej zakładki */}
        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;

/* Style CSS dla animacji kół (zachowane na wszelki wypadek) */
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes rotate-reverse {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }
  .wheel-animation {
    animation: rotate 20s linear infinite;
  }
  .wheel-animation-reverse {
    animation: rotate-reverse 20s linear infinite;
  }
`;
document.head.appendChild(styleSheet);