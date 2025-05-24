import React, { useState, useEffect } from "react";
import { Bell, Mail, CheckCircle, Trash2, Info, ShoppingCart, Heart, AlertCircle } from "lucide-react";
import { NotificationsService } from "../../../services/api";

// Prosta funkcja powiadomień zamiast react-toastify
const showNotification = (message, type = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Można również użyć window.alert() w razie potrzeby
  // alert(`${type.toUpperCase()}: ${message}`);
};

/**
 * Notification center for user profile.
 * Displays a list of notifications with actions.
 */
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie powiadomień przy ładowaniu komponentu
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await NotificationsService.getAll();
        
        // Mapowanie powiadomień na odpowiedni format
        const formattedNotifications = response.notifications.map(notification => ({
          id: notification.id,
          type: notification.type,
          title: getNotificationTitle(notification.type),
          message: notification.message,
          date: new Date(notification.createdAt).toLocaleString('pl-PL'),
          read: notification.isRead,
          metadata: notification.metadata,
          icon: getNotificationIcon(notification.type)
        }));
        
        setNotifications(formattedNotifications);
        setLoading(false);
      } catch (err) {
        console.error("Błąd podczas pobierania powiadomień:", err);
        setError("Nie udało się pobrać powiadomień. Spróbuj ponownie później.");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Funkcja zwracająca tytuł powiadomienia na podstawie typu
  const getNotificationTitle = (type) => {
    switch (type) {
      case 'message':
        return 'Nowa wiadomość';
      case 'system':
        return 'Informacja systemowa';
      case 'transaction':
        return 'Transakcja';
      case 'favorite':
        return 'Ulubione';
      case 'listing':
        return 'Ogłoszenie';
      default:
        return 'Powiadomienie';
    }
  };

  // Funkcja zwracająca ikonę powiadomienia na podstawie typu
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <Mail className="w-5 h-5 text-green-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'transaction':
        return <ShoppingCart className="w-5 h-5 text-purple-500" />;
      case 'favorite':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'listing':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  // Oznaczanie powiadomienia jako przeczytane
  const markAsRead = async (id) => {
    try {
      await NotificationsService.markAsRead(id);
      
      // Aktualizacja stanu
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      
      showNotification("Powiadomienie oznaczone jako przeczytane", "success");
    } catch (err) {
      console.error("Błąd podczas oznaczania powiadomienia jako przeczytane:", err);
      showNotification("Wystąpił błąd. Spróbuj ponownie później.", "error");
    }
  };

  // Usuwanie powiadomienia
  const deleteNotification = async (id) => {
    try {
      await NotificationsService.delete(id);
      
      // Aktualizacja stanu
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      showNotification("Powiadomienie usunięte", "success");
    } catch (err) {
      console.error("Błąd podczas usuwania powiadomienia:", err);
      showNotification("Wystąpił błąd. Spróbuj ponownie później.", "error");
    }
  };

  // Oznaczanie wszystkich powiadomień jako przeczytane
  const markAllAsRead = async () => {
    try {
      await NotificationsService.markAllAsRead();
      
      // Aktualizacja stanu
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      
      showNotification("Wszystkie powiadomienia oznaczone jako przeczytane", "success");
    } catch (err) {
      console.error("Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:", err);
      showNotification("Wystąpił błąd. Spróbuj ponownie później.", "error");
    }
  };

  // Sprawdzenie czy są nieprzeczytane powiadomienia
  const hasUnreadNotifications = notifications.some(n => !n.read);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Bell className="w-6 h-6 mr-2 text-green-700" />
          Powiadomienia
        </h1>
        
        {hasUnreadNotifications && (
          <button
            className="text-sm text-green-700 hover:underline"
            onClick={markAllAsRead}
          >
            Oznacz wszystkie jako przeczytane
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="mt-4 text-gray-600">Ładowanie powiadomień...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
          >
            Odśwież stronę
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <Bell className="w-10 h-10 mx-auto mb-4 text-gray-300" />
          Brak powiadomień.
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-start p-4 rounded-lg shadow-sm border transition ${
                n.read
                  ? "bg-gray-50 border-gray-100"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="mr-4">{n.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">{n.title}</h2>
                  <span className="text-xs text-gray-400 ml-4">
                    {n.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                {!n.read && (
                  <button
                    className="mt-2 text-xs text-green-700 hover:underline"
                    onClick={() => markAsRead(n.id)}
                  >
                    Oznacz jako przeczytane
                  </button>
                )}
              </div>
              <button
                className="ml-4 text-gray-400 hover:text-red-500"
                onClick={() => deleteNotification(n.id)}
                title="Usuń powiadomienie"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;