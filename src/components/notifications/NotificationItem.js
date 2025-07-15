import React from 'react';
import { Trash2, CheckCircle, ExternalLink, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { getNotificationIcon, getNotificationColor, getNotificationTypeName } from '../../utils/NotificationTypes';

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
  
  // Ikona i kolor powiadomienia
  const iconName = getNotificationIcon(notification.type);
  const color = getNotificationColor(notification.type);
  const typeName = getNotificationTypeName(notification.type);
  
  // Mapowanie ikon Material Icons na emoji
  const getIconComponent = (iconName) => {
    const iconMap = {
      'announcement': '📢',
      'build': '🔧',
      'post_add': '📝',
      'timer': '⏰',
      'timer_off': '⏰',
      'update': '🔄',
      'favorite': '❤️',
      'visibility': '👁️',
      'message': '💬',
      'comment': '💭',
      'reply': '↩️',
      'payments': '💳',
      'error': '❌',
      'money_off': '💰',
      'account_circle': '👤',
      'person': '👤',
      'notifications': '🔔'
    };
    return iconMap[iconName] || '🔔';
  };
  
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

  // Obsługa przejścia do szczegółów powiadomienia
  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/profil/notification/${notification.id}`);
  };
  
  return (
    <div
      className={`bg-white rounded-lg shadow border-l-4 p-4 mb-4 transition-all duration-200 hover:shadow-md ${
        notification.actionUrl ? 'cursor-pointer hover:-translate-y-1' : 'cursor-default'
      } ${!notification.isRead ? 'bg-blue-50' : ''}`}
      style={{ borderLeftColor: color }}
      onClick={handleClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-start">
        {/* Nagłówek powiadomienia dla urządzeń mobilnych */}
        <div className="flex sm:hidden items-center justify-between mb-4">
          <div className="flex items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mr-3 text-lg"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              {getIconComponent(iconName)}
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
                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                title="Oznacz jako przeczytane"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
            
            {/* Przycisk usuwania - większy na mobile */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Usuń powiadomienie"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Ikona powiadomienia - widoczna tylko na desktop */}
        <div
          className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center mr-4 text-lg flex-shrink-0"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {getIconComponent(iconName)}
        </div>
        
        {/* Treść powiadomienia */}
        <div className="flex-1">
          {/* Nagłówek powiadomienia dla desktop */}
          <div className="hidden sm:flex justify-between items-start">
            <h3 className="font-bold text-gray-900">
              {notification.title}
            </h3>
            
            <div className="flex items-center space-x-2 ml-4">
              {/* Chip z typem powiadomienia */}
              <span
                className="px-2 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: `${color}20`, color: color }}
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
                  className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Oznacz jako przeczytane"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              
              {/* Przycisk usuwania */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Usuń powiadomienie"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Chip z typem powiadomienia - widoczny tylko na mobile */}
          <div className="sm:hidden mb-2">
            <span
              className="px-2 py-1 text-xs font-medium rounded-full"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              {typeName}
            </span>
          </div>
          
          {/* Treść wiadomości */}
          <p className="text-gray-600 text-sm mt-2 mb-4">
            {notification.message}
          </p>
          
          {/* Stopka powiadomienia */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <span className="text-xs text-gray-500">
              {formattedDate}
            </span>
            
            {/* Przycisk akcji */}
            {notification.actionUrl && notification.actionText && (
              <button
                onClick={handleActionClick}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                {notification.actionText}
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
