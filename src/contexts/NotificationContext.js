import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import ActivityLogService from '../services/activityLogService';
import notificationService from '../services/notifications';
import axios from 'axios';
import { API_URL } from '../services/api/config';
import { debug } from '../utils/debug';
import { toast } from 'react-toastify';

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

  // Funkcja wyświetlająca toast w zależności od typu powiadomienia
  const showToast = useCallback((notification) => {
    const isMobile = window.innerWidth < 768;
    
    const toastConfig = {
      position: isMobile ? "bottom-center" : "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        fontSize: isMobile ? '16px' : '14px',
        padding: isMobile ? '12px 16px' : '8px 12px',
        width: isMobile ? '90%' : 'auto',
        maxWidth: isMobile ? '90%' : '350px'
      }
    };

    const message = notification.title || notification.message || notification.content || 'Nowe powiadomienie';

    // Różne typy toastów dla różnych typów powiadomień
    switch (notification.type) {
      case 'new_message':
      case 'NEW_MESSAGE':
        toast.info(`💬 ${message}`, toastConfig);
        break;
      case 'message_reply':
        toast.info(`↩️ ${message}`, toastConfig);
        break;
      case 'listing_liked':
        toast.success(`❤️ ${message}`, toastConfig);
        break;
      case 'payment_completed':
        toast.success(`💳 ${message}`, toastConfig);
        break;
      case 'listing_added':
        toast.success(`📝 ${message}`, toastConfig);
        break;
      case 'listing_expiring':
        toast.warning(`⏰ ${message}`, toastConfig);
        break;
      case 'system':
        toast.info(`🔔 ${message}`, toastConfig);
        break;
      default:
        toast.info(`🔔 ${message}`, toastConfig);
    }
  }, []);

  // Pobieranie powiadomień z API - memoized
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    try {
      const [notificationsResponse, countResponse] = await Promise.all([
        axios.get(`${API_URL}/notifications`, { withCredentials: true }),
        axios.get(`${API_URL}/notifications/unread/count`, { withCredentials: true })
      ]);

      const notificationsData = notificationsResponse.data.notifications || [];
      setNotifications(notificationsData);
      
      const countData = countResponse.data;
      setUnreadCount({
        notifications: countData.notifications || 0,
        messages: countData.messages || 0
      });
      
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Zmniejszanie licznika nieprzeczytanych wiadomości - memoized
  const decreaseMessageCount = useCallback((count = 1) => {
    if (!count) return;
    setUnreadCount(prev => ({
      ...prev,
      messages: Math.max(0, (prev.messages || 0) - count)
    }));
  }, []);

  // Oznaczanie powiadomienia jako przeczytane - memoized
  const markAsRead = useCallback(async (notificationId) => {
    if (!isAuthenticated || !user) return;

    try {
      await axios.patch(`${API_URL}/notifications/${notificationId}/read`, {}, {
        withCredentials: true
      });

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      // Aktualizuj liczniki lokalnie
      setUnreadCount(prev => {
        const newCount = { ...prev };
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          if (notification.type === 'new_message') {
            newCount.messages = Math.max(0, newCount.messages - 1);
          } else {
            newCount.notifications = Math.max(0, newCount.notifications - 1);
          }
        }
        return newCount;
      });
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
    }
  }, [isAuthenticated, user, notifications]);

  // Oznaczanie wszystkich powiadomień jako przeczytane - memoized
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      await axios.patch(`${API_URL}/notifications/read-all`, {}, {
        withCredentials: true
      });

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount({ notifications: 0, messages: 0 });
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
    }
  }, [isAuthenticated, user]);

  // Usuwanie powiadomienia - memoized
  const deleteNotification = useCallback(async (notificationId) => {
    if (!isAuthenticated || !user) return;

    try {
      await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        withCredentials: true
      });

      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        const updatedNotifications = prev.filter(n => n.id !== notificationId);
        
        // Aktualizuj liczniki jeśli powiadomienie było nieprzeczytane
        if (notification && !notification.isRead) {
          setUnreadCount(prevCount => {
            const newCount = { ...prevCount };
            if (notification.type === 'new_message') {
              newCount.messages = Math.max(0, newCount.messages - 1);
            } else {
              newCount.notifications = Math.max(0, newCount.notifications - 1);
            }
            return newCount;
          });
        }
        
        return updatedNotifications;
      });
    } catch (error) {
      console.error('Błąd podczas usuwania powiadomienia:', error);
    }
  }, [isAuthenticated, user]);

  // Główny useEffect - pojedyncza inicjalizacja
  useEffect(() => {
    if (!isAuthenticated || !user?.token) {
      // Rozłączenie WebSocket po wylogowaniu
      notificationService.disconnect();
      setIsConnected(false);
      setNotifications([]);
      setUnreadCount({ notifications: 0, messages: 0 });
      return;
    }

    // Pobierz powiadomienia z API
    fetchNotifications();

    // Inicjalizacja połączenia WebSocket
    debug('Inicjalizacja połączenia z serwerem powiadomień');
    
    notificationService.connect()
      .then(() => {
        debug('Połączono z serwerem powiadomień');
        setIsConnected(true);
      })
      .catch(error => {
        console.error('Błąd połączenia z serwerem powiadomień:', error);
        setIsConnected(false);
        
        if (error.message && (error.message.includes('401') || error.message.includes('unauthorized'))) {
          console.warn('Problem z autoryzacją Socket.io - wymagane ponowne logowanie');
          localStorage.setItem('redirectAfterLogin', window.location.pathname);
        }
      });

    // Handler dla nowych powiadomień
    const handleNewNotification = (notification) => {
      console.log('Otrzymano nowe powiadomienie:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      
      setUnreadCount(prev => {
        const newCount = { ...prev };
        if (notification.type === 'new_message' || notification.type === 'NEW_MESSAGE') {
          newCount.messages = (newCount.messages || 0) + 1;
        } else {
          newCount.notifications = (newCount.notifications || 0) + 1;
        }
        return newCount;
      });

      // Wyświetl toast powiadomienie
      showToast(notification);

      // Odtwarzanie dźwięku
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => debug('Nie można odtworzyć dźwięku powiadomienia:', e));
      } catch (error) {
        console.error('Błąd podczas odtwarzania dźwięku:', error);
      }

      // Dodanie do ActivityLog
      if (user?.id) {
        const iconType = notification.type === 'new_message' ? 'mail'
          : notification.type === 'message_reply' ? 'reply'
          : notification.type === 'message_liked' ? 'heart'
          : 'bell';
            
        const activity = {
          id: notification._id || Date.now(),
          iconType: iconType,
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

    // Handler dla aktualizacji powiadomień
    const handleNotificationUpdated = (data) => {
      const { notificationId, isRead } = data;
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead } 
            : notification
        )
      );
    };

    // Handler dla oznaczenia wszystkich jako przeczytane
    const handleAllNotificationsRead = () => {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount({ notifications: 0, messages: 0 });
    };

    // Handler dla usunięcia powiadomienia
    const handleNotificationDeleted = (data) => {
      const { notificationId } = data;
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    };

    // Handler dla zmiany statusu połączenia
    const handleConnectionChange = (connected) => {
      setIsConnected(connected);
    };

    // Rejestracja event listenerów
    notificationService.on('notification', handleNewNotification);
    notificationService.on('new_notification', handleNewNotification);
    notificationService.on('notification_updated', handleNotificationUpdated);
    notificationService.on('all_notifications_read', handleAllNotificationsRead);
    notificationService.on('notification_deleted', handleNotificationDeleted);
    notificationService.on('connect', () => handleConnectionChange(true));
    notificationService.on('disconnect', () => handleConnectionChange(false));

    // Cleanup function - WAŻNE: usuń wszystkie event listenery!
    return () => {
      notificationService.off('notification', handleNewNotification);
      notificationService.off('new_notification', handleNewNotification);
      notificationService.off('notification_updated', handleNotificationUpdated);
      notificationService.off('all_notifications_read', handleAllNotificationsRead);
      notificationService.off('notification_deleted', handleNotificationDeleted);
      notificationService.off('connect', () => handleConnectionChange(true));
      notificationService.off('disconnect', () => handleConnectionChange(false));
      notificationService.disconnect();
    };
  }, [isAuthenticated, user?.token, showToast, fetchNotifications]); // Dodane showToast i fetchNotifications

  // Wartość kontekstu - memoized
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
    [notifications, unreadCount, isConnected, isLoading, markAsRead, markAllAsRead, deleteNotification, fetchNotifications, decreaseMessageCount]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
