
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Mail, Eye, Car, History, FileText, PhoneCall } from 'lucide-react';
import UserNavigation, { TABS } from './profil/layout/UserNavigation';
import Messages from './profil/messages/Messages';
import UserListings from './profil/listings/UserListings';
import TransactionHistory from './profil/TransactionHistory';
import Notifications from './profil/notifications/Notifications';
import SettingsPanel from './profil/settings/SettingsPanel';

// Główny kolor
const PRIMARY_COLOR = '#35530A';
const PRIMARY_DARK = '#2A4208'; 
const PRIMARY_LIGHT = '#EAF2DE';

const Contact = () => (
  <div className="bg-white p-6 rounded-sm shadow-sm">
    <h2 className="text-xl font-bold mb-4">Kontakt</h2>
    <p>Tutaj będą wyświetlane informacje kontaktowe.</p>
  </div>
);

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState(TABS.PANEL);
  
  const navigate = useNavigate();

  // Renderowanie zawartości panelu głównego
  const renderPanelContent = () => (
    <>
      {/* Nowa karta powitalna - jeden spójny panel z zaokrąglonymi rogami */}
      <div className="rounded-lg overflow-hidden shadow-md mb-6 md:mb-8 text-white relative" 
           style={{ background: PRIMARY_COLOR, borderRadius: '10px' }}>
        <div className="p-4 flex items-center">
          {/* Avatar z inicjałem */}
          <div className="bg-opacity-30 bg-white h-16 w-16 rounded-full flex items-center justify-center mr-4 border-2 border-opacity-20 border-white">
            <span className="text-2xl font-bold">M</span>
          </div>
          
          {/* Powitanie i ostatnie logowanie */}
          <div className="flex-grow">
            <h2 className="text-2xl font-bold">Witaj, Mateusz!</h2>
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
            <button className="flex items-center bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-sm">
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
            <div className="text-2xl font-bold">3</div>
          </div>
          <div className="w-1/3 py-3 px-4 text-center border-r border-opacity-20 border-white">
            <div className="text-sm text-opacity-80 text-white">Zakończone transakcje</div>
            <div className="text-2xl font-bold">12</div>
          </div>
          <div className="w-1/3 py-3 px-4 text-center">
            <div className="text-sm text-opacity-80 text-white">Ocena sprzedającego</div>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold">4.8/5</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-green-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Sekcje Ostatnio przeglądane oraz Ostatnia aktywność obok siebie */}
      <div className="flex flex-row w-full gap-6 md:gap-8">
        {/* Ostatnio przeglądane */}
        <div className="bg-gray-50 p-4 shadow-md w-1/2" style={{ borderRadius: '2px' }}>
          <h3 className="text-lg font-bold text-gray-700 mb-4">Ostatnio przeglądane</h3>
          
          <div className="space-y-4">
            {/* Ogłoszenie 1 */}
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                 style={{ borderRadius: '2px' }}>
              <div className="flex">
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center shrink-0">
                  <div className="w-full h-full flex items-center justify-center text-gray-600">Auto</div>
                </div>
                <div className="flex-grow p-3 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-bold text-gray-800">BMW 520d 2019</h4>
                    </div>
                    <p className="text-xs text-gray-600 truncate">Sedan, 190 KM, 80 000 km</p>
                  </div>
                </div>
                <div className="p-3 flex flex-col items-end justify-between bg-gray-50 shrink-0"
                     style={{ borderRadius: '0 2px 2px 0' }}>
                  <span className="text-sm font-medium whitespace-nowrap">95 000 zł</span>
                  <a href="#" className="text-sm font-medium flex items-center" style={{ color: PRIMARY_COLOR }}>
                    Zobacz <span className="ml-1">→</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Ogłoszenie 2 */}
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                 style={{ borderRadius: '2px' }}>
              <div className="flex">
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center shrink-0">
                  <div className="w-full h-full flex items-center justify-center text-gray-600">Auto</div>
                </div>
                <div className="flex-grow p-3 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-bold text-gray-800">Audi A4 2020</h4>
                    </div>
                    <p className="text-xs text-gray-600 truncate">Kombi, 150 KM, 45 000 km</p>
                  </div>
                </div>
                <div className="p-3 flex flex-col items-end justify-between bg-gray-50 shrink-0"
                     style={{ borderRadius: '0 2px 2px 0' }}>
                  <span className="text-sm font-medium whitespace-nowrap">112 000 zł</span>
                  <a href="#" className="text-sm font-medium flex items-center" style={{ color: PRIMARY_COLOR }}>
                    Zobacz <span className="ml-1">→</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Ogłoszenie 3 */}
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                 style={{ borderRadius: '2px' }}>
              <div className="flex">
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center shrink-0">
                  <div className="w-full h-full flex items-center justify-center text-gray-600">Auto</div>
                </div>
                <div className="flex-grow p-3 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-bold text-gray-800">Volkswagen Passat 2021</h4>
                    </div>
                    <p className="text-xs text-gray-600 truncate">Sedan, 170 KM, 35 000 km</p>
                  </div>
                </div>
                <div className="p-3 flex flex-col items-end justify-between bg-gray-50 shrink-0"
                     style={{ borderRadius: '0 2px 2px 0' }}>
                  <span className="text-sm font-medium whitespace-nowrap">129 000 zł</span>
                  <a href="#" className="text-sm font-medium flex items-center" style={{ color: PRIMARY_COLOR }}>
                    Zobacz <span className="ml-1">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ostatnia aktywność */}
        <div className="bg-gray-50 p-4 shadow-md w-1/2" style={{ borderRadius: '2px' }}>
          <h3 className="text-lg font-bold text-gray-700 mb-4">Ostatnia aktywność</h3>
          
          <div className="space-y-4">
            {/* Aktywność 1 */}
            <div className="bg-white shadow-sm border border-gray-100 p-3 relative hover:shadow-md transition-shadow duration-300"
                 style={{ borderRadius: '2px' }}>
              <div className="absolute top-2 right-2">
                <button className="text-red-500 hover:text-red-700 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  ×
                </button>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 shrink-0">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 truncate">Nowa wiadomość od użytkownika</h4>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 mb-2 truncate">Odpowiedz, aby kontynuować rozmowę</p>
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">dziś, 10:17</span>
                <a href="#" className="text-sm font-medium flex items-center" style={{ color: PRIMARY_COLOR }}>
                  Odpowiedz <span className="ml-1">→</span>
                </a>
              </div>
            </div>
            
            {/* Aktywność 2 */}
            <div className="bg-white shadow-sm border border-gray-100 p-3 relative hover:shadow-md transition-shadow duration-300"
                 style={{ borderRadius: '2px' }}>
              <div className="absolute top-2 right-2">
                <button className="text-red-500 hover:text-red-700 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  ×
                </button>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 shrink-0">
                  <Car className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 truncate">Dodano nowe ogłoszenie</h4>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 mb-2 truncate">Sprawdź szczegóły swojego ogłoszenia</p>
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">wczoraj, 12:17</span>
                <a href="#" className="text-sm font-medium flex items-center" style={{ color: PRIMARY_COLOR }}>
                  Zobacz <span className="ml-1">→</span>
                </a>
              </div>
            </div>
            
            {/* Aktywność 3 */}
            <div className="bg-white shadow-sm border border-gray-100 p-3 relative hover:shadow-md transition-shadow duration-300"
                 style={{ borderRadius: '2px' }}>
              <div className="absolute top-2 right-2">
                <button className="text-red-500 hover:text-red-700 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  ×
                </button>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 shrink-0">
                  <Bell className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 truncate">Nowe powiadomienie systemowe</h4>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 mb-2 truncate">Ważna aktualizacja regulaminu serwisu</p>
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">14.05.2025</span>
                <a href="#" className="text-sm font-medium flex items-center" style={{ color: PRIMARY_COLOR }}>
                  Zobacz <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

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
      case TABS.SETTINGS:
        return <SettingsPanel />;
      case TABS.CONTACT:
        return <Contact />;
      default:
        return renderPanelContent();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      {/* Główny kontener */}
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
        {/* Nawigacja */}
        <UserNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Zawartość aktywnej zakładki */}
        {renderContent()}
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
