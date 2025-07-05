import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from '../../contexts/NotificationContext';
import { safeConsole } from '../../utils/debug';

/**
 * Komponent wyświetlający powiadomienia w formie toastów w czasie rzeczywistym
 * @returns {JSX.Element}
 */
const ToastNotification = () => {
  const { notifications } = useNotifications();

  // Funkcja wyświetlająca toast w zależności od typu powiadomienia
  const showToast = (notification) => {
    // Określenie typu powiadomienia i odpowiedniej konfiguracji
    // Używamy różnych pozycji dla urządzeń mobilnych i desktopowych
    const isMobile = window.innerWidth < 768;
    
    let toastConfig = {
      position: isMobile ? "bottom-center" : "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        fontSize: isMobile ? '16px' : '14px',
        padding: isMobile ? '12px 16px' : '8px 12px',
        width: isMobile ? '90%' : 'auto',
        maxWidth: isMobile ? '90%' : '350px'
      },
      icon: {
        style: {
          fontSize: isMobile ? '24px' : '20px'
        }
      }
    };

    // Różne ikony/typy dla różnych typów powiadomień
    switch (notification.type) {
      case 'new_message':
        toast.info(notification.message || 'Otrzymano nową wiadomość', toastConfig);
        // Opcjonalnie można odtworzyć dźwięk
        playNotificationSound();
        break;
      case 'listing_liked':
        toast.success(notification.message || 'Twoje ogłoszenie zostało dodane do ulubionych!', toastConfig);
        break;
      case 'payment_completed':
        toast.success(notification.message || 'Płatność została zrealizowana!', toastConfig);
        break;
      case 'listing_added':
        toast.success(notification.message || 'Nowe ogłoszenie zostało dodane!', toastConfig);
        break;
      case 'listing_expiring':
        toast.warning(notification.message || 'Twoje ogłoszenie wkrótce wygaśnie!', toastConfig);
        break;
      default:
        toast.info(notification.message, toastConfig);
    }
  };

  // Funkcja odtwarzająca dźwięk powiadomienia
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(e => safeConsole.error('Nie można odtworzyć dźwięku powiadomienia:', e));
    } catch (error) {
      safeConsole.error('Błąd podczas odtwarzania dźwięku:', error);
    }
  };

  // Nasłuchiwanie na nowe powiadomienia
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Pobierz ostatnie powiadomienie
      const latestNotification = notifications[0];
      
      // Wyświetl toast tylko dla nowych powiadomień
      if (!latestNotification.isRead && latestNotification._id) {
        showToast(latestNotification);
      }
    }
  }, [notifications]);

  // Określamy, czy urządzenie jest mobilne
  const isMobile = window.innerWidth < 768;
  
  return (
    <ToastContainer
      position={isMobile ? "bottom-center" : "top-right"}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{
        width: isMobile ? '100%' : 'auto',
        padding: isMobile ? '12px' : '8px'
      }}
      toastStyle={{
        fontSize: isMobile ? '16px' : '14px',
        padding: isMobile ? '12px 16px' : '8px 12px',
        width: isMobile ? '90%' : 'auto',
        maxWidth: isMobile ? '90%' : '350px'
      }}
    />
  );
};

export default ToastNotification;
