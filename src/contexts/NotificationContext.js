import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import ActivityLogService from '../services/activityLogService';
import notificationService from '../services/notifications';
import axios from 'axios';
import { API_URL } from '../services/api/config';
import { debug } from '../utils/debug';

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
  const [unreadCount, setUnreadCount] = useState({ notifications: 0, messages: 0 });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pobieranie powiadomień z API - użycie useCallback dla uniknięcia nieskończonej pętli
  const fetchNotifications = React.useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    try {
      // Pobierz powiadomienia i liczniki osobno
      const [notificationsResponse, countResponse] = await Promise.all([
        axios.get(`${API_URL}/notifications`, {
          withCredentials: true
        }),
        axios.get(`${API_URL}/notifications/unread/count`, {
          withCredentials: true
        })
      ]);

      const notificationsData = notificationsResponse.data.notifications || [];
      setNotifications(notificationsData);
      
      // Użyj liczników z dedykowanego endpointu
      const countData = countResponse.data;
      setUnreadCount({
        notifications: countData.notifications || 0,
        messages: countData.messages || 0
      });
      
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień:', error);
      // Fallback - oblicz liczniki lokalnie jeśli endpoint nie działa
      if (notifications.length > 0) {
        const unread = notifications.reduce(
          (acc, notification) => {
            if (notification.isRead) return acc;

            if (notification.type === 'new_message') {
              acc.messages += 1;
            } else {
              acc.notifications += 1;
            }
            return acc;
          },
          { notifications: 0, messages: 0 }
        );
        setUnreadCount(unread);
      }
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
          acc.notifications += 1;
        }
        return acc;
      },
      { notifications: 0, messages: 0 }
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
      await axios.patch(`${API_URL}/notifications/${notificationId}/read`, {}, {
        withCredentials: true // Ważne - przesyłanie ciasteczek
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
      await axios.patch(`${API_URL}/notifications/read-all`, {}, {
        withCredentials: true // Ważne - przesyłanie ciasteczek
      });

      // Aktualizacja lokalnego stanu
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Aktualizacja licznika nieprzeczytanych
      setUnreadCount({ notifications: 0, messages: 0 });
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
    }
  };

  // Usuwanie powiadomienia
  const deleteNotification = async (notificationId) => {
    if (!isAuthenticated || !user) return;

    try {
      await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        withCredentials: true // Ważne - przesyłanie ciasteczek
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
        console.log('Otrzymano nowe powiadomienie:', notification);
        
        setNotifications(prev => {
          // Dodaj nowe powiadomienie na początek listy
          return [notification, ...prev];
        });
        
        // Aktualizacja licznika nieprzeczytanych
        setUnreadCount(prev => {
          const newCount = { ...prev };
          // Sprawdzamy typ powiadomienia - backend używa NEW_MESSAGE
          if (notification.type === 'new_message' || notification.type === 'NEW_MESSAGE') {
            newCount.messages = (newCount.messages || 0) + 1;
          } else {
            newCount.notifications = (newCount.notifications || 0) + 1;
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
          const iconType = notification.type === 'new_message'
            ? 'mail'
            : notification.type === 'message_reply'
            ? 'reply'
            : notification.type === 'message_liked'
            ? 'heart'
            : 'bell';
            
          const activity = {
            id: notification._id || Date.now(),
            iconType: iconType, // Przechowujemy typ ikony zamiast JSX elementu
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
        setUnreadCount({ notifications: 0, messages: 0 });
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

      // Rejestracja nasłuchiwania - dodajemy nasłuchiwanie na właściwy event z backendu
      notificationService.on('notification', handleNewNotification);
      notificationService.on('new_notification', handleNewNotification); // Event z backendu
      notificationService.on('notification_updated', handleNotificationUpdated);
      notificationService.on('all_notifications_read', handleAllNotificationsRead);
      notificationService.on('notification_deleted', handleNotificationDeleted);
      notificationService.on('connect', () => handleConnectionChange(true));
      notificationService.on('disconnect', () => handleConnectionChange(false));

      // Czyszczenie nasłuchiwania przy odmontowaniu
      return () => {
        notificationService.off('notification', handleNewNotification);
        notificationService.off('new_notification', handleNewNotification); // Event z backendu
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
      setUnreadCount({ notifications: 0, messages: 0 });
    }
  }, [isAuthenticated, user, fetchNotifications]); // updateUnreadCount intentionally omitted to prevent re-render loops

  // Wartość kontekstu
  const value = React.useMemo(
    () => ({
      notifications,
      unreadCount,
      isConnected,
      isLoading,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      fetchNotifications,
      decreaseMessageCount
    }),
    [notifications, unreadCount, isConnected, isLoading]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
