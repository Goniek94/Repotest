import React, { useState, useEffect, useContext } from 'react';
import { ResponsiveCard } from '../ui/ResponsiveCard';
import { Heading2, Text } from '../ui/Typography';
import { ResponsiveStack } from '../layout/ResponsiveStack';
import { getNotificationTypeName, getNotificationIcon, getNotificationColor } from '../../utils/NotificationTypes';
import { SocketContext } from '../../contexts/SocketContext';
import axios from 'axios';

/**
 * Panel powiadomień użytkownika
 * Wyświetla listę powiadomień z możliwością oznaczenia jako przeczytane
 * 
 * @returns {JSX.Element}
 */
const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useContext(SocketContext);
  
  // Pobieranie powiadomień
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/notifications');
        setNotifications(response.data);
        setError(null);
      } catch (err) {
        console.error('Błąd podczas pobierania powiadomień:', err);
        setError('Nie udało się pobrać powiadomień. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Odświeżanie powiadomień co 60 sekund
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Nasłuchiwanie na nowe powiadomienia przez WebSocket
  useEffect(() => {
    if (!socket) return;
    
    // Obsługa nowego powiadomienia
    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
    };
    
    // Obsługa oznaczenia powiadomienia jako przeczytane
    const handleNotificationRead = (notificationId) => {
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    };
    
    // Obsługa oznaczenia wszystkich powiadomień jako przeczytane
    const handleAllNotificationsRead = () => {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    };
    
    // Nasłuchiwanie na zdarzenia
    socket.on('notification:new', handleNewNotification);
    socket.on('notification:read', handleNotificationRead);
    socket.on('notification:read-all', handleAllNotificationsRead);
    
    return () => {
      // Usuwanie nasłuchiwania przy odmontowaniu komponentu
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:read', handleNotificationRead);
      socket.off('notification:read-all', handleAllNotificationsRead);
    };
  }, [socket]);
  
  // Oznaczanie powiadomienia jako przeczytane
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      
      // Aktualizacja stanu lokalnie
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', err);
    }
  };
  
  // Oznaczanie wszystkich powiadomień jako przeczytane
  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      
      // Aktualizacja stanu lokalnie
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', err);
    }
  };
  
  // Formatowanie daty
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'przed chwilą';
    if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minutę' : diffMin < 5 ? 'minuty' : 'minut'} temu`;
    if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'godzinę' : diffHour < 5 ? 'godziny' : 'godzin'} temu`;
    if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? 'dzień' : 'dni'} temu`;
    
    return date.toLocaleDateString('pl-PL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Renderowanie ikony w zależności od typu powiadomienia
  const renderNotificationIcon = (type) => {
    const iconPath = getNotificationIcon(type);
    const color = getNotificationColor(type);
    
    return (
      <div 
        className="w-6 h-6 flex items-center justify-center rounded-full p-1"
        style={{ backgroundColor: `${color}20` }}
      >
        <img 
          src={iconPath} 
          alt="Notification icon" 
          className="w-4 h-4"
          style={{ 
            filter: `brightness(0) saturate(100%)`,
            color: color
          }}
        />
      </div>
    );
  };
  
  // Renderowanie pojedynczego powiadomienia
  const renderNotification = (notification) => (
    <div 
      key={notification._id} 
      className={`
        p-3 rounded-md border 
        ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'} 
        transition-colors duration-200
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {renderNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <Text className="font-medium">{notification.title}</Text>
            <Text size="xs" className="text-gray-500 whitespace-nowrap ml-2">
              {formatDate(notification.createdAt)}
            </Text>
          </div>
          
          <Text size="sm" className="mt-1">{notification.message}</Text>
          
          <div className="flex justify-between items-center mt-2">
            {notification.actionUrl && (
              <a 
                href={notification.actionUrl} 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {notification.actionText || 'Zobacz szczegóły'}
              </a>
            )}
            
            {!notification.read && (
              <button 
                onClick={() => markAsRead(notification._id)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Oznacz jako przeczytane
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  // Grupowanie powiadomień według daty
  const groupNotificationsByDate = () => {
    const groups = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey;
      
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Dzisiaj';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Wczoraj';
      } else {
        groupKey = date.toLocaleDateString('pl-PL', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(notification);
    });
    
    return groups;
  };
  
  // Renderowanie grup powiadomień
  const renderNotificationGroups = () => {
    const groups = groupNotificationsByDate();
    
    return Object.entries(groups).map(([date, notificationsInGroup]) => (
      <div key={date} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Text className="font-medium text-gray-700">{date}</Text>
          <div className="h-px bg-gray-200 flex-grow ml-4"></div>
        </div>
        
        <ResponsiveStack gap={3}>
          {notificationsInGroup.map(renderNotification)}
        </ResponsiveStack>
      </div>
    ));
  };
  
  return (
    <ResponsiveCard className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <Heading2>Powiadomienia</Heading2>
        
        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Oznacz wszystkie jako przeczytane
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <div className="text-4xl mb-2">🔔</div>
          <Text className="font-medium">Brak powiadomień</Text>
          <Text size="sm" className="text-gray-500 mt-1">
            Gdy pojawią się nowe powiadomienia, zobaczysz je tutaj.
          </Text>
        </div>
      ) : (
        renderNotificationGroups()
      )}
    </ResponsiveCard>
  );
};

export default NotificationsPanel;
