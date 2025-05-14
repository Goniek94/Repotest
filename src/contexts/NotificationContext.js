import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import notificationService from '../services/notifications';
import axios from 'axios';

// Tworzenie kontekstu
const NotificationContext = createContext();

// Hook do używania kontekstu
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications musi być używany wewnątrz NotificationProvider');
  }
  return context;
};

// Provider kontekstu
export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState({ messages: 0, alerts: 0 });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pobieranie powiadomień z API
  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      setNotifications(response.data.notifications || []);
      updateUnreadCount(response.data.notifications || []);
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Aktualizacja licznika nieprzeczytanych powiadomień
  const updateUnreadCount = (notificationsList = notifications) => {
    const unread = notificationsList.reduce(
      (acc, notification) => {
        if (notification.isRead) return acc;

        if (notification.type === 'new_message') {
          acc.messages += 1;
        } else {
          acc.alerts += 1;
        }
        return acc;
      },
      { messages: 0, alerts: 0 }
    );

    setUnreadCount(unread);
  };

  // Oznaczanie powiadomienia jako przeczytane
  const markAsRead = async (notificationId) => {
    if (!isAuthenticated || !user) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      // Aktualizacja lokalnego stanu
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      // Aktualizacja licznika nieprzeczytanych
      updateUnreadCount();
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
    }
  };

  // Oznaczanie wszystkich powiadomień jako przeczytane
  const markAllAsRead = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/notifications/read-all`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      // Aktualizacja lokalnego stanu
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Aktualizacja licznika nieprzeczytanych
      setUnreadCount({ messages: 0, alerts: 0 });
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
    }
  };

  // Usuwanie powiadomienia
  const deleteNotification = async (notificationId) => {
    if (!isAuthenticated || !user) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      // Aktualizacja lokalnego stanu
      const updatedNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      setNotifications(updatedNotifications);
      
      // Aktualizacja licznika nieprzeczytanych
      updateUnreadCount(updatedNotifications);
    } catch (error) {
      console.error('Błąd podczas usuwania powiadomienia:', error);
    }
  };

  // Inicjalizacja połączenia WebSocket po zalogowaniu
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      // Pobierz powiadomienia z API
      fetchNotifications();

      // TYMCZASOWO WYŁĄCZONE - problemy z połączeniem WebSocket
      console.log('Połączenie z serwerem powiadomień tymczasowo wyłączone');
      setIsConnected(false);
      
      // Inicjalizacja połączenia WebSocket - WYŁĄCZONE
      /*
      notificationService.connect(user.token)
        .then(() => {
          console.log('Połączono z serwerem powiadomień');
          setIsConnected(true);
        })
        .catch(error => {
          console.error('Błąd połączenia z serwerem powiadomień:', error);
          setIsConnected(false);
        });
      */

      // TYMCZASOWO WYŁĄCZONE - nasłuchiwanie na zdarzenia WebSocket
      /*
      // Nasłuchiwanie na nowe powiadomienia
      const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        updateUnreadCount([notification, ...notifications]);
      };

      // Nasłuchiwanie na aktualizacje powiadomień
      const handleNotificationUpdated = (data) => {
        const { notificationId, isRead } = data;
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead } 
              : notification
          )
        );
        updateUnreadCount();
      };

      // Nasłuchiwanie na oznaczenie wszystkich jako przeczytane
      const handleAllNotificationsRead = () => {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount({ messages: 0, alerts: 0 });
      };

      // Nasłuchiwanie na usunięcie powiadomienia
      const handleNotificationDeleted = (data) => {
        const { notificationId } = data;
        const updatedNotifications = notifications.filter(
          notification => notification.id !== notificationId
        );
        setNotifications(updatedNotifications);
        updateUnreadCount(updatedNotifications);
      };

      // Nasłuchiwanie na zmianę statusu połączenia
      const handleConnectionChange = (connected) => {
        setIsConnected(connected);
      };

      // Rejestracja nasłuchiwania
      notificationService.on('notification', handleNewNotification);
      notificationService.on('notification_updated', handleNotificationUpdated);
      notificationService.on('all_notifications_read', handleAllNotificationsRead);
      notificationService.on('notification_deleted', handleNotificationDeleted);
      notificationService.on('connect', () => handleConnectionChange(true));
      notificationService.on('disconnect', () => handleConnectionChange(false));

      // Czyszczenie nasłuchiwania przy odmontowaniu
      return () => {
        notificationService.off('notification', handleNewNotification);
        notificationService.off('notification_updated', handleNotificationUpdated);
        notificationService.off('all_notifications_read', handleAllNotificationsRead);
        notificationService.off('notification_deleted', handleNotificationDeleted);
        notificationService.off('connect', () => handleConnectionChange(true));
        notificationService.off('disconnect', () => handleConnectionChange(false));
        notificationService.disconnect();
      };
      */
      
      // Pusty return dla useEffect
      return () => {
        console.log('Czyszczenie efektu NotificationContext');
      };
    } else {
      // Rozłączenie WebSocket po wylogowaniu
      notificationService.disconnect();
      setIsConnected(false);
      setNotifications([]);
      setUnreadCount({ messages: 0, alerts: 0 });
    }
  }, [isAuthenticated, user]);

  // Wartość kontekstu
  const value = {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
