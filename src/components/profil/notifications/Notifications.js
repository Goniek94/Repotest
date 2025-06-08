import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { 
  Bell, 
  Mail, 
  Clock, 
  Check, 
  RefreshCw, 
  CheckCheck, 
  Package, 
  Heart, 
  CreditCard, 
  AlertCircle,
  X,
  MessageSquare,
  Filter
} from 'lucide-react';

// Primary color to match the rest of the application
const PRIMARY_COLOR = '#35530A';
const SECONDARY_COLOR = '#5A7D2A';

/**
 * Komponent wyświetlający historię powiadomień użytkownika
 * @returns {JSX.Element}
 */
const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    fetchNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // all, unread, messages, listings, payments
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtrowanie powiadomień
  useEffect(() => {
    if (!notifications) return;

    let filtered = [...notifications];
    
    // Zastosowanie filtrów
    switch(filter) {
      case 'unread':
        filtered = filtered.filter(notification => !notification.isRead);
        break;
      case 'messages':
        filtered = filtered.filter(notification => notification.type === 'new_message');
        break;
      case 'listings':
        filtered = filtered.filter(notification => 
          notification.type === 'listing_added' || 
          notification.type === 'listing_expiring' || 
          notification.type === 'listing_status_changed' ||
          notification.type === 'listing_liked'
        );
        break;
      case 'payments':
        filtered = filtered.filter(notification => notification.type === 'payment_completed');
        break;
      default:
        // Wszystkie powiadomienia
        break;
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, filter]);

  // Odświeżanie powiadomień z animacją
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNotifications();
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Oznaczanie wszystkich jako przeczytane
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  // Formatowanie daty
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Błąd formatowania daty:', error);
      return dateString;
    }
  };

  // Formatowanie względnej daty (np. "2 godz. temu")
  const getRelativeTime = (dateString) => {
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHour / 24);

      if (diffSec < 60) {
        return 'przed chwilą';
      } else if (diffMin < 60) {
        return `${diffMin} ${diffMin === 1 ? 'minutę' : diffMin < 5 ? 'minuty' : 'minut'} temu`;
      } else if (diffHour < 24) {
        return `${diffHour} ${diffHour === 1 ? 'godzinę' : diffHour < 5 ? 'godziny' : 'godzin'} temu`;
      } else if (diffDays < 7) {
        return `${diffDays} ${diffDays === 1 ? 'dzień' : 'dni'} temu`;
      } else {
        return formatDate(dateString);
      }
    } catch (error) {
      return formatDate(dateString);
    }
  };

  // Ikona w zależności od typu powiadomienia
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_message':
        return <MessageSquare size={20} className="text-blue-500" />;
      case 'listing_added':
        return <Package size={20} className="text-green-500" />;
      case 'listing_expiring':
        return <Clock size={20} className="text-yellow-500" />;
      case 'listing_status_changed':
        return <AlertCircle size={20} className="text-purple-500" />;
      case 'listing_liked':
        return <Heart size={20} className="text-red-500" />;
      case 'payment_completed':
        return <CreditCard size={20} className="text-emerald-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  // Kolor tła w zależności od typu powiadomienia
  const getNotificationColor = (type, isRead) => {
    if (isRead) return 'bg-gray-50 hover:bg-gray-100';
    
    switch (type) {
      case 'new_message':
        return 'bg-blue-50 hover:bg-blue-100';
      case 'listing_added':
        return 'bg-green-50 hover:bg-green-100';
      case 'listing_expiring':
        return 'bg-yellow-50 hover:bg-yellow-100';
      case 'listing_status_changed':
        return 'bg-purple-50 hover:bg-purple-100';
      case 'listing_liked':
        return 'bg-red-50 hover:bg-red-100';
      case 'payment_completed':
        return 'bg-emerald-50 hover:bg-emerald-100';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  // Funkcja obsługująca kliknięcie w powiadomienie
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Jeśli powiadomienie ma metadane z ID ogłoszenia lub wiadomości,
    // można przekierować użytkownika do odpowiedniej strony
    if (notification.metadata?.adId) {
      window.location.href = `/listing/${notification.metadata.adId}`;
    } else if (notification.metadata?.messageId) {
      window.location.href = `/profil/wiadomosci?message=${notification.metadata.messageId}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl max-w-full w-full mx-auto">
      {/* Nagłówek z gradientem */}
      <div className="bg-gradient-to-r from-[#35530A] to-[#5A7D2A] px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bell size={22} className="text-white mr-2" />
          <h2 className="text-xl font-bold text-white">Powiadomienia</h2>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white"
            title="Odśwież"
            disabled={isRefreshing}
            aria-label="Odśwież powiadomienia"
          >
            <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          {(unreadCount.alerts > 0 || unreadCount.messages > 0) && (
            <button 
              onClick={handleMarkAllAsRead}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white"
              title="Oznacz wszystkie jako przeczytane"
              aria-label="Oznacz wszystkie jako przeczytane"
            >
              <CheckCheck size={18} />
            </button>
          )}
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white md:hidden"
            title="Filtry"
            aria-label="Pokaż filtry"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Filtry w formie zakładek - wersja mobilna rozwijana */}
      <div className={`md:hidden border-b border-gray-200 bg-gray-50 transition-all duration-300 ${showMobileFilters ? 'max-h-64' : 'max-h-0 overflow-hidden'}`}>
        <div className="flex flex-col w-full">
          <MobileTabButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
            icon={<Bell size={16} />}
            label="Wszystkie"
            count={notifications?.length || 0}
          />
          <MobileTabButton 
            active={filter === 'unread'} 
            onClick={() => setFilter('unread')}
            icon={<AlertCircle size={16} />}
            label="Nieprzeczytane"
            count={unreadCount.alerts + unreadCount.messages}
            highlight={unreadCount.alerts + unreadCount.messages > 0}
          />
          <MobileTabButton 
            active={filter === 'messages'} 
            onClick={() => setFilter('messages')}
            icon={<Mail size={16} />}
            label="Wiadomości"
            count={unreadCount.messages}
            highlight={unreadCount.messages > 0}
          />
          <MobileTabButton 
            active={filter === 'listings'} 
            onClick={() => setFilter('listings')}
            icon={<Package size={16} />}
            label="Ogłoszenia"
          />
          <MobileTabButton 
            active={filter === 'payments'} 
            onClick={() => setFilter('payments')}
            icon={<CreditCard size={16} />}
            label="Płatności"
          />
        </div>
      </div>

      {/* Filtry w formie zakładek - wersja desktopowa */}
      <div className="hidden md:flex border-b border-gray-200 bg-gray-50">
        <TabButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
          icon={<Bell size={16} />}
          label="Wszystkie"
          count={notifications?.length || 0}
        />
        <TabButton 
          active={filter === 'unread'} 
          onClick={() => setFilter('unread')}
          icon={<AlertCircle size={16} />}
          label="Nieprzeczytane"
          count={unreadCount.alerts + unreadCount.messages}
          highlight={unreadCount.alerts + unreadCount.messages > 0}
        />
        <TabButton 
          active={filter === 'messages'} 
          onClick={() => setFilter('messages')}
          icon={<Mail size={16} />}
          label="Wiadomości"
          count={unreadCount.messages}
          highlight={unreadCount.messages > 0}
        />
        <TabButton 
          active={filter === 'listings'} 
          onClick={() => setFilter('listings')}
          icon={<Package size={16} />}
          label="Ogłoszenia"
        />
        <TabButton 
          active={filter === 'payments'} 
          onClick={() => setFilter('payments')}
          icon={<CreditCard size={16} />}
          label="Płatności"
        />
      </div>

      {/* Lista powiadomień */}
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#35530A]"></div>
            <p className="text-gray-500 mt-4">Wczytywanie powiadomień...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Brak powiadomień</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Tutaj pojawią się informacje o Twoich ogłoszeniach, wiadomościach i aktywnościach
            </p>
            <button 
              onClick={handleRefresh}
              className="mt-6 px-4 py-2 bg-[#35530A] text-white rounded-lg flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Odśwież
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`${getNotificationColor(notification.type, notification.isRead)} transition-all duration-200 relative group cursor-pointer`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="p-4 sm:px-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1 p-2 rounded-full bg-white shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                      <div className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.message}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {getRelativeTime(notification.createdAt)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        title="Usuń powiadomienie"
                        aria-label="Usuń powiadomienie"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Stopka komponentu */}
      <div className="border-t border-gray-100 p-4 bg-gray-50 text-center">
        <button 
          className="text-sm text-[#35530A] hover:text-[#5A7D2A] transition-colors font-medium"
          onClick={() => window.location.href = '/ustawienia/powiadomienia'}
        >
          Zarządzaj ustawieniami powiadomień
        </button>
      </div>
    </div>
  );
};

// Komponent przycisku zakładki dla filtrów (desktopowa wersja)
const TabButton = ({ active, onClick, icon, label, count, highlight }) => (
  <button 
    className={`flex items-center px-4 py-3 font-medium text-sm border-b-2 transition-all duration-200 flex-1 justify-center ${
      active 
        ? 'border-[#35530A] text-[#35530A]' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
    onClick={onClick}
  >
    <span className="mr-1.5">{icon}</span>
    <span>{label}</span>
    {count > 0 && (
      <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
        highlight 
          ? 'bg-red-500 text-white' 
          : 'bg-gray-200 text-gray-700'
      }`}>
        {count}
      </span>
    )}
  </button>
);

// Komponent przycisku zakładki dla filtrów (mobilna wersja)
const MobileTabButton = ({ active, onClick, icon, label, count, highlight }) => (
  <button 
    className={`flex items-center justify-between px-4 py-3 font-medium text-sm transition-all duration-200 ${
      active 
        ? 'bg-[#35530A]/10 text-[#35530A]' 
        : 'text-gray-500 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </div>
    {count > 0 && (
      <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
        highlight 
          ? 'bg-red-500 text-white' 
          : 'bg-gray-200 text-gray-700'
      }`}>
        {count}
      </span>
    )}
  </button>
);

// Dodanie niestandardowego stylu dla paska przewijania
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }
`;
document.head.appendChild(style);

export default Notifications;