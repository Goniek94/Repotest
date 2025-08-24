import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Trash2, ExternalLink } from 'lucide-react';
import { getNotificationColor, getNotificationTypeName, getNotificationIcon } from '../../utils/NotificationTypes';

/**
 * 🔔 NOTIFICATION LIST ITEM - Kompaktowy element listy powiadomień
 * 
 * Wzorowany na UserListingListItem.js - kompaktowy design dla listy
 */
const NotificationListItem = ({ notification, onMarkAsRead, onDelete }) => {
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
      onMarkAsRead(notification.id);
    }
    
    // Przekierowujemy na stronę akcji
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };
  
  // Obsługa kliknięcia w powiadomienie
  const handleClick = () => {
    // Jeśli nie jest przeczytane, oznacz jako przeczytane
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 relative group
        ${!notification.isRead ? 'border-l-4 border-[#35530A] bg-[#35530A]/5' : 'border border-gray-200'}
        flex flex-col lg:flex-row lg:h-[120px]
      `}
      onClick={handleClick}
    >
      {/* Status badge - nieprzeczytane */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-[#35530A] rounded-full z-10"></div>
      )}
      
      {/* Typ powiadomienia badge */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-[#35530A] px-2 py-1 rounded font-semibold text-xs flex items-center gap-1 shadow z-10">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        {typeName}
      </div>

      {/* Ikona powiadomienia - lewy panel */}
      <div className="lg:w-24 lg:flex-shrink-0 p-4 lg:p-3 flex lg:flex-col items-center justify-center bg-gray-50">
        <div
          className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-md"
          style={{ 
            background: `linear-gradient(135deg, ${color}20, ${color}40)`,
            border: `2px solid ${color}30`
          }}
        >
          <img 
            src={iconPath} 
            alt="Notification icon" 
            className="w-6 h-6 lg:w-8 lg:h-8"
            style={{ 
              filter: `brightness(0) saturate(100%)`,
              color: color
            }}
          />
        </div>
      </div>

      {/* Treść powiadomienia - środkowy panel */}
      <div className="flex-1 p-4 lg:p-3 min-w-0">
        <div className="mb-3">
          <h3 className="text-lg font-bold mb-1 line-clamp-1 text-[#35530A]">
            {notification.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
        </div>
        
        {/* Data i akcje */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {formattedDate}
          </span>
          
          {/* Przycisk akcji jeśli istnieje */}
          {notification.actionUrl && notification.actionText && (
            <button
              onClick={handleActionClick}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-[#35530A] hover:bg-[#35530A]/10 rounded-lg transition-colors"
            >
              {notification.actionText}
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Akcje - prawy panel */}
      <div className="lg:w-32 lg:flex-shrink-0 p-3 lg:p-2 flex lg:flex-col items-center justify-center gap-2 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100">
        {/* Przycisk oznacz jako przeczytane */}
        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            className="flex-1 lg:flex-none bg-[#35530A] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#2D4A06] transition-colors flex items-center justify-center gap-1"
            title="Oznacz jako przeczytane"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="lg:hidden">Przeczytane</span>
          </button>
        )}
        
        {/* Przycisk usuń */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="flex-1 lg:flex-none bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
          title="Usuń powiadomienie"
        >
          <Trash2 className="w-4 h-4" />
          <span className="lg:hidden">Usuń</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationListItem;
