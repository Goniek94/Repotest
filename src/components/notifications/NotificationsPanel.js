import React, { useState, useEffect, useContext } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';

/**
 * Panel powiadomień użytkownika
 * Wyświetla listę powiadomień z możliwością oznaczenia jako przeczytane
 * Używa NotificationContext dla pełnej funkcjonalności
 * 
 * @returns {JSX.Element}
 */
const NotificationsPanel = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotifications();
  const [filter, setFilter] = useState('all'); // all, unread, read
  
  // Filtrowanie powiadomień
  const filteredNotifications = notifications.filter(notification => {
    switch(filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
  });
  
  // Obsługa oznaczania powiadomienia jako przeczytane
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
    }
  };
  
  // Obsługa usuwania powiadomienia
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Błąd podczas usuwania powiadomienia:', error);
    }
  };
  
  // Obsługa oznaczania wszystkich jako przeczytane
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header z filtrami */}
      <div className="bg-[#35530A] text-white p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold">Powiadomienia</h2>
            <p className="text-green-100 text-sm mt-1">
              {unreadCount.notifications > 0 ? `${unreadCount.notifications} nieprzeczytanych` : 'Wszystkie przeczytane'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filtry */}
            <div className="flex bg-white/10 rounded-lg p-1">
              {[
                { key: 'all', label: 'Wszystkie', count: notifications.length },
                { key: 'unread', label: 'Nieprzeczytane', count: unreadCount.notifications },
                { key: 'read', label: 'Przeczytane', count: notifications.length - unreadCount.notifications }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    filter === filterOption.key 
                      ? 'bg-white text-[#35530A]' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
            
            {/* Przycisk oznacz wszystkie jako przeczytane */}
            {unreadCount.notifications > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Oznacz wszystkie jako przeczytane
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Zawartość */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#35530A]"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'Brak nieprzeczytanych powiadomień' : 
               filter === 'read' ? 'Brak przeczytanych powiadomień' : 
               'Brak powiadomień'}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'Gdy pojawią się nowe powiadomienia, zobaczysz je tutaj.' :
               filter === 'unread' ? 'Wszystkie powiadomienia zostały przeczytane.' :
               'Nie masz jeszcze przeczytanych powiadomień.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => handleMarkAsRead(notification.id)}
                onDelete={() => handleDeleteNotification(notification.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
