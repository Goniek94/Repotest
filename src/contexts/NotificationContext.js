import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import ActivityLogService from '../services/activityLogService';
import getActivityIcon from '../utils/getActivityIcon';
import notificationService from '../services/notifications';
import axios from 'axios';
import { API_URL } from '../services/api/config';

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

  // Pobieranie powiadomień z API - użycie useCallback dla uniknięcia nieskończonej pętli
  const fetchNotifications = React.useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      const notificationsData = response.data.notifications || [];
      setNotifications(notificationsData);
      
      // Obliczenie licznika nieprzeczytanych
      const unread = notificationsData.reduce(
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
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Aktualizacja licznika nieprzeczytanych powiadomień
  const updateUnreadCount = React.useCallback((notificationsList = notifications) => {
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
  }, [notifications]);

  // Zmniejszanie licznika nieprzeczytanych wiadomości
  const decreaseMessageCount = useCallback((count = 1) => {
    if (!count) return;
    setUnreadCount(prev => ({
      ...prev,
      messages: Math.max(0, (prev.messages || 0) - count)
    }));
  }, []);

  // Oznaczanie powiadomienia jako przeczytane
  const markAsRead = async (notificationId) => {
    if (!isAuthenticated || !user) return;

    try {
      await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
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
      await axios.put(`${API_URL}/notifications/read-all`, {}, {
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
      await axios.delete(`${API_URL}/notifications/${notificationId}`, {
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

      // Inicjalizacja połączenia WebSocket
      debug('Inicjalizacja połączenia z serwerem powiadomień');
      
      notificationService.connect(user.token)
        .then(() => {
          debug('Połączono z serwerem powiadomień');
          setIsConnected(true);
          // Po poprawnym połączeniu nie musimy ponownie pobierać powiadomień
        })
        .catch(error => {
          console.error('Błąd połączenia z serwerem powiadomień:', error);
          setIsConnected(false);
          
          // Sprawdzamy, czy błąd dotyczy autoryzacji (401)
          if (error.message && (error.message.includes('401') || error.message.includes('unauthorized'))) {
            console.warn('Problem z autoryzacją Socket.io - wymagane ponowne logowanie');
            // Zapisujemy aktualny URL, aby móc wrócić po zalogowaniu
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            
            // Przekierowanie do strony logowania można dodać tutaj, ale pozostawiamy
            // to do decyzji aplikacji (można również wyświetlić modal z komunikatem)
          }
          
          // Mimo błędu, nadal używamy REST API do powiadomień
          fetchNotifications();
        });

      // Nasłuchiwanie na nowe powiadomienia
      const handleNewNotification = (notification) => {
        setNotifications(prev => {
          // Dodaj nowe powiadomienie na początek listy
          return [notification, ...prev];
        });
        
        // Aktualizacja licznika nieprzeczytanych
        setUnreadCount(prev => {
          const newCount = { ...prev };
          if (notification.type === 'new_message') {
            newCount.messages = (newCount.messages || 0) + 1;
          } else {
            newCount.alerts = (newCount.alerts || 0) + 1;
          }
          return newCount;
        });

        // Odtwarzanie dźwięku dla nowych powiadomień
        try {
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(e => debug('Nie można odtworzyć dźwięku powiadomienia:', e));
        } catch (error) {
          console.error('Błąd podczas odtwarzania dźwięku:', error);
        }

        if (user?.id) {
          const activity = {
            id: notification._id || Date.now(),
            icon: getActivityIcon(
              notification.type === 'new_message'
                ? 'mail'
                : notification.type === 'message_reply'
                ? 'reply'
                : notification.type === 'message_liked'
                ? 'heart'
                : 'bell'
            ),
            title: notification.title || 'Nowe powiadomienie',
            description: notification.content || '',
            time: new Date(notification.createdAt || Date.now()).toLocaleDateString('pl-PL', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            href: notification.link || '#',
            actionLabel: notification.type === 'new_message' || notification.type === 'message_reply' ? 'Odpowiedz' : 'Zobacz'
          };
          ActivityLogService.addActivity(activity, user.id);
        }
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
        setNotifications(prev => {
          const updatedNotifications = prev.filter(
            notification => notification.id !== notificationId
          );
          updateUnreadCount(updatedNotifications);
          return updatedNotifications;
        });
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
    } else {
      // Rozłączenie WebSocket po wylogowaniu
      notificationService.disconnect();
      setIsConnected(false);
      setNotifications([]);
      setUnreadCount({ messages: 0, alerts: 0 });
    }
  }, [isAuthenticated, user, fetchNotifications, updateUnreadCount]); // fetchNotifications jest teraz zapamiętywane przez useCallback

  // Wartość kontekstu
  const value = {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    decreaseMessageCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
