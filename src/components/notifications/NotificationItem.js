import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { getNotificationColor, getNotificationTypeName, getNotificationIcon } from '../../utils/NotificationTypes';

/**
 * Komponent pojedynczego powiadomienia
 * @param {Object} props - Właściwości komponentu
 * @param {Object} props.notification - Obiekt powiadomienia
 * @param {Function} props.onMarkAsRead - Funkcja wywoływana po oznaczeniu powiadomienia jako przeczytane
 * @param {Function} props.onDelete - Funkcja wywoływana po usunięciu powiadomienia
 * @returns {JSX.Element}
 */
const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate();
  
  // Formatowanie daty
  const formattedDate = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: pl
  });
  
  // Kolor powiadomienia i ikona
  const color = getNotificationColor(notification.type);
  const typeName = getNotificationTypeName(notification.type);
  const iconPath = getNotificationIcon(notification.type);
  
  // Obsługa kliknięcia w akcję
  const handleActionClick = (e) => {
    e.stopPropagation();
    
    // Jeśli powiadomienie nie jest przeczytane, oznaczamy je jako przeczytane
    if (!notification.isRead) {
      onMarkAsRead();
    }
    
    // Przekierowujemy na stronę akcji
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };
  
  // Obsługa kliknięcia w powiadomienie
  const handleClick = () => {
    // Przekierowujemy do strony szczegółów powiadomienia
    navigate(`/profil/notification/${notification.id}`);
  };

  
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
        notification.actionUrl ? 'cursor-pointer' : 'cursor-default'
      } ${!notification.isRead ? 'bg-gradient-to-r from-blue-50 via-white to-purple-50' : ''}`}
      onClick={handleClick}
    >
      {/* Gradient border dla nieprzeczytanych */}
      {!notification.isRead && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-start">
        {/* Nagłówek powiadomienia dla urządzeń mobilnych */}
        <div className="flex sm:hidden items-center justify-between mb-4">
          <div className="flex items-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mr-3 shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                border: `2px solid ${color}30`
              }}
            >
              <img 
                src={iconPath} 
                alt="Notification icon" 
                className="w-6 h-6"
                style={{ 
                  filter: `brightness(0) saturate(100%)`,
                  color: color
                }}
              />
            </div>
            <h3 className="font-bold text-gray-900 truncate max-w-[150px]">
              {notification.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Przycisk oznaczania jako przeczytane - większy na mobile */}
            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead();
                }}
                className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                title="Oznacz jako przeczytane"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
            
            {/* Przycisk usuwania - większy na mobile */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
              title="Usuń powiadomienie"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Ikona powiadomienia - widoczna tylko na desktop */}
        <div
          className="hidden sm:flex w-14 h-14 rounded-full items-center justify-center mr-5 shadow-lg flex-shrink-0"
          style={{ 
            background: `linear-gradient(135deg, ${color}20, ${color}40)`,
            border: `2px solid ${color}30`
          }}
        >
          <img 
            src={iconPath} 
            alt="Notification icon" 
            className="w-7 h-7"
            style={{ 
              filter: `brightness(0) saturate(100%)`,
              color: color
            }}
          />
        </div>
        
        {/* Treść powiadomienia */}
        <div className="flex-1">
          {/* Nagłówek powiadomienia dla desktop */}
          <div className="hidden sm:flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-900 text-lg">
              {notification.title}
            </h3>
            
            <div className="flex items-center space-x-3 ml-4">
              {/* Chip z typem powiadomienia */}
              <span
                className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm"
                style={{ 
                  background: `linear-gradient(135deg, ${color}20, ${color}30)`,
                  color: color,
                  border: `1px solid ${color}40`
                }}
              >
                {typeName}
              </span>
              
              {/* Przycisk oznaczania jako przeczytane */}
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead();
                  }}
                  className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                  title="Oznacz jako przeczytane"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
              
              {/* Przycisk usuwania */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                title="Usuń powiadomienie"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Chip z typem powiadomienia - widoczny tylko na mobile */}
          <div className="sm:hidden mb-3">
            <span
              className="px-3 py-1 text-xs font-semibold rounded-full shadow-sm"
              style={{ 
                background: `linear-gradient(135deg, ${color}20, ${color}30)`,
                color: color,
                border: `1px solid ${color}40`
              }}
            >
              {typeName}
            </span>
          </div>
          
          {/* Treść wiadomości */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
            {notification.message}
          </p>
          
          {/* Stopka powiadomienia */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {formattedDate}
            </span>
            
            {/* Przycisk akcji */}
            {notification.actionUrl && notification.actionText && (
              <button
                onClick={handleActionClick}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto justify-center sm:justify-start"
              >
                {notification.actionText}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Efekt świecenia dla nieprzeczytanych */}
      {!notification.isRead && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-2xl pointer-events-none"></div>
      )}
    </div>
  );
};

export default NotificationItem;
