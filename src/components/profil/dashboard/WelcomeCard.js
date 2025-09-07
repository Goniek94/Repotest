import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useResponsiveContext } from '../../../contexts/ResponsiveContext';
import { 
  Settings, 
  PlusCircle, 
  Bell, 
  MessageSquare, 
  Eye, 
  UserCheck, 
  ChevronRight,
  Star,
  UserCog
} from 'lucide-react';

// Główny kolor
const PRIMARY_COLOR = '#35530A';

/**
 * Komponent karty powitalnej użytkownika
 * @param {Object} props - Właściwości komponentu
 * @param {Object} props.user - Dane użytkownika
 * @param {Object} props.userStats - Statystyki użytkownika (activeListings, completedTransactions)
 * @param {boolean} props.isMobile - Czy interfejs jest w trybie mobilnym
 * @param {Array} props.recentAds - Lista ostatnio przeglądanych ogłoszeń
 * @param {Array} props.activities - Lista aktywności użytkownika
 */
const WelcomeCard = ({ user, userStats, recentAds = [], activities = [] }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { isMobile, isTablet } = useResponsiveContext();
  const isMobileOrTablet = isMobile || isTablet;
  
  // Liczniki nieprzeczytanych wiadomości i powiadomień
  // W rzeczywistej implementacji te wartości powinny być pobierane z API
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newNotifications, setNewNotifications] = useState(0);
  
  // Pobieranie liczby nieprzeczytanych wiadomości i powiadomień
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        // W rzeczywistej implementacji pobieranie z API
        // Przykład: const response = await messagesApi.getUnreadCount();
        if (user) {
          // Tymczasowo - docelowo powinno być z API
          setUnreadMessages(user.unreadMessages || 0);
          setNewNotifications(user.unreadNotifications || 0);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania liczby nieprzeczytanych wiadomości:", error);
      }
    };
    
    fetchUnreadCounts();
  }, [user]);
  
  // Liczba wyświetleń ogłoszeń
  const viewsCount = userStats?.viewsCount || recentAds?.length || 0;
  
  // Obliczanie uzupełnienia profilu na podstawie danych użytkownika
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  
  useEffect(() => {
    // Funkcja sprawdzająca uzupełnienie profilu
    const calculateProfileCompleteness = () => {
      if (!user) return 0;
      
      const requiredFields = [
        'name', 'email', 'phone', 'address', 
        'profileImage', 'description'
      ];
      
      // Ustalamy ile pól jest uzupełnionych
      const filledFields = requiredFields.filter(field => 
        user[field] && String(user[field]).trim() !== ''
      ).length;
      
      // Obliczamy procent uzupełnienia
      return Math.floor((filledFields / requiredFields.length) * 100);
    };
    
    setProfileCompleteness(calculateProfileCompleteness());
  }, [user]);

  // Imię użytkownika
  const userName = user && user.name ? user.name : 'Użytkowniku';
  

  // Szybkie akcje
  const quickActions = [
    { icon: <Eye size={16} />, label: 'Ostatnio oglądane', path: '/profil/history' },
    { icon: <MessageSquare size={16} />, label: 'Wiadomości', path: '/profil/messages?folder=odebrane' },
    { icon: <Bell size={16} />, label: 'Powiadomienia', path: '/profil/notifications' }
  ];
  
  // Obliczanie czasu od rejestracji użytkownika
  const getUserSinceText = () => {
    if (!user || !user.createdAt) return 'Nowy użytkownik';
    
    const registrationDate = new Date(user.createdAt);
    const now = new Date();
    const diffYears = now.getFullYear() - registrationDate.getFullYear();
    
    if (diffYears < 1) {
      // Jeśli mniej niż rok, pokażmy miesiące
      const diffMonths = (now.getMonth() - registrationDate.getMonth()) + 
                         (now.getFullYear() - registrationDate.getFullYear()) * 12;
      return `Użytkownik od ${diffMonths} mies.`;
    }
    
    // Jeśli więcej niż rok
    return `Użytkownik od ${diffYears} ${diffYears === 1 ? 'roku' : 'lat'}`;
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md mb-4 sm:mb-6 md:mb-8 text-white relative mx-auto max-w-4xl" 
         style={{ background: PRIMARY_COLOR, borderRadius: '12px' }}>
         
      {/* Przypięte etykiety - nieodczytane powiadomienia/wiadomości */}
      <div className="absolute top-0 right-0 flex space-x-2 m-2 sm:m-3">
        
        {unreadMessages > 0 && (
          <div className="bg-blue-600 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <MessageSquare size={12} className="mr-1" />
            {unreadMessages}
          </div>
        )}
        {newNotifications > 0 && (
          <div className="bg-amber-500 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Bell size={12} className="mr-1" />
            {newNotifications}
          </div>
        )}
      </div>
      
      {/* Górna część z avatarem i powitaniem */}
      <div className="p-4 sm:p-5 md:p-6 lg:p-8 relative">
        <div className="flex flex-col">
          {/* Powitanie i ostatnie logowanie */}
          <div className="w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Witaj, {userName}!</h2>
            <div className="flex items-center text-sm sm:text-base opacity-90 mt-1 sm:mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {user && user.lastLoginAt ? (
                `Ostatnie logowanie: ${new Date(user.lastLoginAt).toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}`
              ) : (
                `Ostatnie logowanie: ${new Date().toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}`
              )}
            </div>
            
            {/* Pasek uzupełnienia profilu */}
            <div className="mt-3 sm:mt-4 flex items-center">
              <div className="flex-1 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden mr-3">
                <div 
                  className="h-full bg-white" 
                  style={{ width: `${profileCompleteness}%` }}
                ></div>
              </div>
              <div className="text-xs sm:text-sm whitespace-nowrap">{profileCompleteness}% profilu</div>
            </div>
            
            {/* Status konta */}
            <div className="mt-2 flex flex-wrap items-center">
              <div className="flex items-center mr-3 mb-1">
                <UserCheck size={14} className="mr-1.5" />
                <span className="text-xs sm:text-sm">Konto zweryfikowane</span>
              </div>
              <div className="flex items-center">
                <Star size={14} className="mr-1.5" />
                <span className="text-xs sm:text-sm">{getUserSinceText()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Przyciski główne - wyeksponowane, pełna szerokość na mobile */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 mt-5 sm:mt-6`}>
          <button 
            className="flex items-center justify-center bg-white text-green-800 hover:bg-opacity-90 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-200"
            onClick={() => navigate('/dodaj-ogloszenie')}
            style={{ color: PRIMARY_COLOR }}
          >
            <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            Dodaj ogłoszenie
          </button>
          
          <button 
            className="flex items-center justify-center bg-opacity-20 bg-white hover:bg-opacity-40 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-200"
            onClick={() => navigate('/profil/settings')}
          >
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            Ustawienia konta
          </button>
        </div>
        
        {/* Szybkie odnośniki */}
        <div className="mt-5 space-y-2 sm:space-y-2.5">
          {quickActions.map((action, index) => (
            <button 
              key={index}
              onClick={() => navigate(action.path)}
              className="w-full flex items-center justify-between bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 rounded-md py-2 px-3 sm:py-2.5 sm:px-4 text-sm"
            >
              <div className="flex items-center">
                <span className="mr-2.5">{action.icon}</span>
                <span>{action.label}</span>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </div>
      
      {/* Dolna sekcja ze statystykami */}
      <div className={`grid ${isMobile ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-3'} text-white border-t border-opacity-20 border-white`}>
        <div className={`py-3 sm:py-4 md:py-5 px-3 sm:px-4 text-center ${isMobile ? 'border-b sm:border-b-0 sm:border-r' : 'border-r'} border-opacity-20 border-white`}>
          <div className="text-xs xs:text-sm sm:text-base text-opacity-80 text-white">
            Aktywne ogłoszenia
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">
            {userStats?.activeListings || 0}
          </div>
        </div>
        
        <div className={`py-3 sm:py-4 md:py-5 px-3 sm:px-4 text-center ${isMobile ? 'border-b sm:border-b-0 sm:border-r' : 'border-r'} border-opacity-20 border-white`}>
          <div className="text-xs xs:text-sm sm:text-base text-opacity-80 text-white">
            Zakończone transakcje
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">
            {userStats?.completedTransactions || 0}
          </div>
        </div>
        
        <div className="py-3 sm:py-4 md:py-5 px-3 sm:px-4 text-center">
          <div className="text-xs xs:text-sm sm:text-base text-opacity-80 text-white">
            Wyświetlenia
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">
            {viewsCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
