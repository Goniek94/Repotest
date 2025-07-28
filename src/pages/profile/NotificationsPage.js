import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { getNotificationGroups, getNotificationGroupNames } from '../../utils/NotificationTypes';
import NotificationItem from '../../components/notifications/NotificationItem';
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
  
  // Komponenty ikon SVG
  const BellIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 19.718A8.966 8.966 0 0112 21a8.966 8.966 0 017.132-1.282M6 9a6 6 0 1112 0c0 1.887.454 3.665 1.257 5.234a.75.75 0 01-.515 1.07L12 16.5l-6.742-1.196a.75.75 0 01-.515-1.07A9.97 9.97 0 006 9z" />
    </svg>
  );

  const CarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );

  const MailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const MessageIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  const CreditCardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const AlertIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  // Mapowanie ikon dla zakładek
  const tabIcons = {
    all: BellIcon,
    unread: BellIcon,
    listings: CarIcon,
    messages: MailIcon,
    comments: MessageIcon,
    payments: CreditCardIcon,
    system: AlertIcon
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* MOBILE - Kompaktowy widok na wzór wiadomości */}
        <div className="lg:hidden">
          {/* Zielony nagłówek na mobile */}
          <div className="bg-[#35530A] text-white p-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <BellIcon />
              <div>
                <h1 className="text-xl font-bold">Powiadomienia</h1>
                {totalUnreadCount > 0 && (
                  <p className="text-sm opacity-90">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                      {totalUnreadCount} nieprzeczytanych
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Kategorie na mobile - grid 4 kolumny z ikonami */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">KATEGORIE</h3>
            <div className="grid grid-cols-4 gap-3">
              {tabs.slice(0, 7).map((tab) => {
                const TabIconComponent = tabIcons[tab.id];
                const isActive = activeTab === tab.id;
                const unreadForTab = tab.id === 'unread' ? totalUnreadCount : 0;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center justify-center p-4 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-[#35530A] bg-opacity-10 border border-[#35530A] border-opacity-30' 
                        : 'hover:bg-gray-50 border border-transparent'}
                    `}
                    title={tab.label}
                  >
                    <span className={`
                      ${isActive ? 'text-[#35530A]' : 'text-gray-400'}
                      transition-colors duration-200
                    `}>
                      <TabIconComponent />
                    </span>
                    {unreadForTab > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {unreadForTab > 99 ? '99+' : unreadForTab}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Przyciski akcji na mobile */}
            {notifications.length > 0 && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openConfirmDialog('markAllAsRead')}
                  disabled={totalUnreadCount === 0}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-[#35530A] text-white rounded-lg text-sm font-medium hover:bg-[#2A4208] focus:outline-none focus:ring-2 focus:ring-[#35530A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <span className="w-4 h-4 mr-2">✓</span>
                  Oznacz przeczytane
                </button>
                
                <button
                  onClick={() => openConfirmDialog('deleteAll')}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                >
                  <span className="w-4 h-4 mr-2">×</span>
                  Usuń wszystkie
                </button>
              </div>
            )}
          </div>

          {/* Lista powiadomień na mobile */}
          <div className="bg-white">
            {/* Lista powiadomień */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center min-h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <BellIcon />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Brak powiadomień</h3>
                  <p className="text-gray-600 text-sm">
                    {activeTab === 'all' 
                      ? 'Nie masz żadnych powiadomień.' 
                      : activeTab === 'unread' 
                        ? 'Wszystkie powiadomienia zostały przeczytane!' 
                        : `Brak powiadomień w kategorii "${tabs.find(t => t.id === activeTab)?.label}".`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={() => handleMarkAsRead(notification.id)}
                        onDelete={() => handleDeleteNotification(notification.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DESKTOP - Oryginalny layout */}
        <div className="hidden lg:block">
          {/* Nagłówek z gradientem */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 rounded-2xl shadow-xl p-8 mb-8" style={{background: 'linear-gradient(135deg, #35530A, #4a7c0c, #35530A)'}}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Powiadomienia
                </h1>
                {totalUnreadCount > 0 && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                    {totalUnreadCount} nieprzeczytanych
                  </div>
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => openConfirmDialog('markAllAsRead')}
                    disabled={totalUnreadCount === 0}
                    className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span className="w-4 h-4 mr-2 text-green-300">✓</span>
                    Oznacz jako przeczytane
                  </button>
                  
                  <button
                    onClick={() => openConfirmDialog('deleteAll')}
                    className="inline-flex items-center px-6 py-3 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl text-sm font-medium text-white hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-300/50 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span className="w-4 h-4 mr-2 text-red-300">×</span>
                    Usuń wszystkie
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Główna zawartość */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Nawigacja zakładek */}
            <div className="lg:w-72">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Kategorie</h3>
                </div>
                <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
                  {tabs.map((tab) => {
                    const TabIconComponent = tabIcons[tab.id];
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-start px-6 py-4 text-sm font-medium whitespace-nowrap lg:whitespace-normal transition-all duration-200 relative group ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                        }`}
                      >
                        <div className={`w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 ${
                          isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                        } ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                          <TabIconComponent />
                        </div>
                        <span className="min-w-0 font-medium">{tab.label}</span>
                        {isActive && (
                          <div className="absolute right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                  
                  <div className="border-t border-gray-100 mt-2">
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="flex items-center justify-start px-6 py-4 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 whitespace-nowrap lg:whitespace-normal transition-all duration-200 w-full group"
                    >
                      <div className="w-5 h-5 mr-3 flex-shrink-0 text-gray-500 group-hover:text-purple-500 transition-all duration-200 group-hover:scale-105">
                        <SettingsIcon />
                      </div>
                      <span className="min-w-0 font-medium">Preferencje</span>
                    </button>
                  </div>
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
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 text-gray-400">
                      <BellIcon />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Brak powiadomień</h3>
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                    {activeTab === 'all' 
                      ? 'Nie masz żadnych powiadomień. Gdy pojawią się nowe aktywności, znajdziesz je tutaj.' 
                      : activeTab === 'unread' 
                        ? 'Wszystkie powiadomienia zostały przeczytane. Świetna robota!' 
                        : `Nie masz powiadomień w kategorii "${groupNames[activeTab] || activeTab}". Sprawdź inne kategorie.`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification, index) => (
                    <div 
                      key={notification.id}
                      className="transform transition-all duration-200 hover:scale-[1.01]"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={() => handleMarkAsRead(notification.id)}
                        onDelete={() => handleDeleteNotification(notification.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
