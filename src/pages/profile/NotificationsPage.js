import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Trash2, Settings, Car, Mail, MessageSquare, CreditCard, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { getNotificationGroups, getNotificationGroupNames, getNotificationIcon, getNotificationColor, formatNotificationDate } from '../../utils/NotificationTypes';
import NotificationItem from '../../components/notifications/NotificationItem';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import NotificationPreferences from '../../components/notifications/NotificationPreferences';

/**
 * Strona powiadomień w profilu użytkownika
 * @returns {JSX.Element}
 */
const NotificationsPage = () => {
  // Używamy kontekstu powiadomień
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    fetchNotifications 
  } = useNotifications();
  
  // Stan komponentu
  const [activeTab, setActiveTab] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState(null);
  
  // Grupy powiadomień
  const notificationGroups = getNotificationGroups();
  const groupNames = getNotificationGroupNames();
  
  // Pobieranie powiadomień przy pierwszym załadowaniu
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  // Oznaczanie powiadomienia jako przeczytane
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
    }
  };
  
  // Oznaczanie wszystkich powiadomień jako przeczytane
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
    }
  };
  
  // Usuwanie powiadomienia
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Błąd podczas usuwania powiadomienia:', error);
    }
  };
  
  // Usuwanie wszystkich powiadomień
  const handleDeleteAllNotifications = async () => {
    try {
      // Usuwamy wszystkie powiadomienia po kolei
      for (const notification of notifications) {
        await deleteNotification(notification.id);
      }
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error('Błąd podczas usuwania wszystkich powiadomień:', error);
    }
  };
  
  // Otwieranie dialogu potwierdzenia
  const openConfirmDialog = (action) => {
    setConfirmDialogAction(action);
    setConfirmDialogOpen(true);
  };
  
  // Wykonywanie akcji z dialogu potwierdzenia
  const handleConfirmAction = () => {
    if (confirmDialogAction === 'markAllAsRead') {
      handleMarkAllAsRead();
    } else if (confirmDialogAction === 'deleteAll') {
      handleDeleteAllNotifications();
    }
  };
  
  // Filtrowanie powiadomień według aktywnej zakładki
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    
    // Filtrowanie według grupy
    const groupTypes = notificationGroups[activeTab] || [];
    return groupTypes.includes(notification.type);
  });
  
  // Liczba nieprzeczytanych powiadomień
  const totalUnreadCount = unreadCount.notifications + unreadCount.messages;
  
  // Mapowanie ikon dla zakładek
  const tabIcons = {
    all: Bell,
    unread: Bell,
    listings: Car,
    messages: Mail,
    comments: MessageSquare,
    payments: CreditCard,
    system: AlertTriangle
  };

  // Lista zakładek
  const tabs = [
    { id: 'all', label: 'Wszystkie' },
    { id: 'unread', label: `Nieprzeczytane (${totalUnreadCount})` },
    { id: 'listings', label: groupNames.listings || 'Ogłoszenia' },
    { id: 'messages', label: groupNames.messages || 'Wiadomości' },
    { id: 'comments', label: groupNames.comments || 'Komentarze' },
    { id: 'payments', label: groupNames.payments || 'Płatności' },
    { id: 'system', label: groupNames.system || 'Systemowe' }
  ];

  if (showPreferences) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Preferencje powiadomień</h1>
          <button
            onClick={() => setShowPreferences(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Powrót
          </button>
        </div>
        <NotificationPreferences />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Powiadomienia {totalUnreadCount > 0 && `(${totalUnreadCount})`}
        </h1>
        
        {notifications.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => openConfirmDialog('markAllAsRead')}
              disabled={totalUnreadCount === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Oznacz jako przeczytane
            </button>
            
            <button
              onClick={() => openConfirmDialog('deleteAll')}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Usuń wszystkie
            </button>
          </div>
        )}
      </div>
      
      {/* Główna zawartość */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Nawigacja zakładek */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
              {tabs.map((tab) => {
                const TabIcon = tabIcons[tab.id];
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-start px-4 py-3 text-sm font-medium whitespace-nowrap lg:whitespace-normal border-b-2 lg:border-b-0 lg:border-r-4 transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <TabIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="min-w-0">{tab.label}</span>
                  </button>
                );
              })}
              
              <button
                onClick={() => setShowPreferences(true)}
                className="flex items-center justify-start px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 whitespace-nowrap lg:whitespace-normal transition-colors"
              >
                <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="min-w-0">Preferencje</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Zawartość zakładki */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Brak powiadomień"
              description={
                activeTab === 'all' 
                  ? 'Nie masz żadnych powiadomień' 
                  : activeTab === 'unread' 
                    ? 'Nie masz nieprzeczytanych powiadomień' 
                    : `Nie masz powiadomień w kategorii ${groupNames[activeTab] || activeTab}`
              }
            />
          ) : (
            <div className="space-y-4">
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
      
      {/* Dialog potwierdzenia */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          confirmDialogAction === 'markAllAsRead' 
            ? 'Oznacz wszystkie jako przeczytane' 
            : 'Usuń wszystkie powiadomienia'
        }
        message={
          confirmDialogAction === 'markAllAsRead'
            ? 'Czy na pewno chcesz oznaczyć wszystkie powiadomienia jako przeczytane?'
            : 'Czy na pewno chcesz usunąć wszystkie powiadomienia? Tej operacji nie można cofnąć.'
        }
        confirmText={confirmDialogAction === 'markAllAsRead' ? 'Oznacz wszystkie' : 'Usuń wszystkie'}
        confirmButtonClass={
          confirmDialogAction === 'markAllAsRead' 
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        }
      />
    </div>
  );
};

export default NotificationsPage;
