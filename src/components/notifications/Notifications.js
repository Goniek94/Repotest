import React, { useState, memo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bell, Inbox, CheckCircle, MessageCircle, Settings, Trash2, FileText, CreditCard, MessageSquare, AlertTriangle, Cog } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import useResponsiveLayout from '../../hooks/useResponsiveLayout';
import NotificationsHeader from './NotificationsHeader';
import NotificationsCategoriesPanel from './NotificationsCategoriesPanel';
import NotificationsListPanel from './NotificationsListPanel';

/**
 * 🔔 NOTIFICATIONS - Główny komponent panelu powiadomień
 * 
 * 3-panelowy layout w stylu Messenger z pełną responsywnością:
 * 1. Panel kategorii (lewy)
 * 2. Panel listy powiadomień (prawy)
 * 
 * Wzorowany na komponencie Messages.js i UserListings.js
 */
const Notifications = memo(() => {
  // ===== HOOKS =====
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotifications();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();
  
  // ===== STATE =====
  // Aktywna kategoria powiadomień
  const [activeTab, setActiveTab] = useState(() => {
    const initial = searchParams.get('category');
    return ['all', 'unread', 'listings', 'messages', 'comments', 'payments', 'system', 'preferences'].includes(initial) ? initial : 'all';
  });
  
  // Stan paneli - kontroluje które panele są widoczne na mobile
  const [panelState, setPanelState] = useState('categories'); // categories, list

  // ===== EFFECTS =====
  /**
   * Automatycznie otwórz panel listy z powiadomieniami po załadowaniu
   */
  useEffect(() => {
    // Jeśli nie ma parametru category w URL, ustaw domyślny
    if (!searchParams.get('category')) {
      setSearchParams({ category: 'all' });
      // Na mobilnych pokaż kategorie, na desktop od razu listę
      setPanelState(isMobile ? 'categories' : 'list');
    }
  }, [searchParams, setSearchParams, isMobile]);

  // ===== HANDLERS =====
  /**
   * Obsługa zmiany kategorii powiadomień
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ category: tab });
    setPanelState('list'); // Pokaż panel listy
  };

  /**
   * Obsługa powrotu do poprzedniego panelu
   */
  const handleBack = () => {
    if (panelState === 'list') {
      setPanelState('categories');
    }
  };

  /**
   * Obsługa oznaczania powiadomienia jako przeczytane
   */
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
    }
  };

  /**
   * Obsługa oznaczania wszystkich powiadomień jako przeczytane
   */
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
    }
  };

  /**
   * Obsługa usuwania powiadomienia
   */
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Błąd podczas usuwania powiadomienia:', error);
    }
  };

  // ===== FILTERING =====
  /**
   * Filtrowanie powiadomień na podstawie aktywnej kategorii
   */
  const getFilteredNotifications = () => {
    switch(activeTab) {
      case 'unread':
        return notifications.filter(notification => !notification.isRead);
      case 'listings':
        return notifications.filter(notification => 
          notification.type === 'listing_added' || 
          notification.type === 'listing_expiring' ||
          notification.type === 'listing_approved' ||
          notification.type === 'listing_rejected'
        );
      case 'messages':
        return notifications.filter(notification => 
          notification.type === 'new_message' || 
          notification.type === 'NEW_MESSAGE' || 
          notification.type === 'message_reply'
        );
      case 'comments':
        return notifications.filter(notification => 
          notification.type === 'comment_added' || 
          notification.type === 'comment_reply'
        );
      case 'payments':
        return notifications.filter(notification => 
          notification.type === 'payment_completed' ||
          notification.type === 'payment_failed' ||
          notification.type === 'payment_pending'
        );
      case 'system':
        return notifications.filter(notification => 
          notification.type === 'system' || 
          notification.type === 'maintenance' ||
          notification.type === 'update'
        );
      case 'preferences':
        return notifications.filter(notification => 
          notification.type === 'settings_changed' || 
          notification.type === 'preferences_updated'
        );
      case 'all':
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  // ===== COUNTS =====
  const getCategoryCounts = () => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      listings: notifications.filter(n => 
        n.type === 'listing_added' || 
        n.type === 'listing_expiring' ||
        n.type === 'listing_approved' ||
        n.type === 'listing_rejected'
      ).length,
      messages: notifications.filter(n => 
        n.type === 'new_message' || 
        n.type === 'NEW_MESSAGE' || 
        n.type === 'message_reply'
      ).length,
      comments: notifications.filter(n => 
        n.type === 'comment_added' || 
        n.type === 'comment_reply'
      ).length,
      payments: notifications.filter(n => 
        n.type === 'payment_completed' ||
        n.type === 'payment_failed' ||
        n.type === 'payment_pending'
      ).length,
      system: notifications.filter(n => 
        n.type === 'system' || 
        n.type === 'maintenance' ||
        n.type === 'update'
      ).length,
      preferences: notifications.filter(n => 
        n.type === 'settings_changed' || 
        n.type === 'preferences_updated'
      ).length
    };
  };

  const categoryCounts = getCategoryCounts();

  // ===== RENDER =====
  return (
    <div className="bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-0 sm:px-1 lg:px-2 py-0 sm:py-1 lg:py-1">
        {/* Nagłówek z tytułem i licznikami - połączony z panelami */}
        <div>
          <NotificationsHeader 
            unreadCount={unreadCount.notifications}
            totalCount={notifications.length}
          />
        </div>

        {/* Mobile Layout - Categories in grid under header */}
        {isMobile && panelState === 'categories' && (
          <div className="bg-white border-b border-gray-200">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">KATEGORIE</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'all', label: 'Wszystkie', icon: Bell, count: categoryCounts.all },
                  { id: 'unread', label: 'Nieprzeczytane', icon: Inbox, count: categoryCounts.unread },
                  { id: 'listings', label: 'Ogłoszenia', icon: FileText, count: categoryCounts.listings },
                  { id: 'messages', label: 'Wiadomości', icon: MessageCircle, count: categoryCounts.messages },
                  { id: 'comments', label: 'Komentarze', icon: MessageSquare, count: categoryCounts.comments },
                  { id: 'payments', label: 'Płatności', icon: CreditCard, count: categoryCounts.payments },
                  { id: 'system', label: 'Systemowe', icon: AlertTriangle, count: categoryCounts.system },
                  { id: 'preferences', label: 'Preferencje', icon: Cog, count: categoryCounts.preferences }
                ].map(category => {
                  const Icon = category.icon;
                  const isActive = activeTab === category.id;
                  const hasCount = category.count > 0;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleTabChange(category.id)}
                      className={`
                        flex flex-col items-center justify-center
                        p-3 rounded-xl
                        transition-all duration-200 group
                        h-16 relative
                        ${isActive 
                          ? 'bg-[#35530A] text-white shadow-lg' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }
                      `}
                    >
                      <Icon className={`
                        w-5 h-5 mb-1
                        ${isActive ? 'text-white' : 'text-gray-600'}
                      `} />
                      <span className={`
                        text-xs font-medium text-center
                        ${isActive ? 'text-white' : 'text-gray-700'}
                      `}>
                        {category.label}
                      </span>
                      {hasCount && (
                        <div className={`
                          absolute -top-1 -right-1
                          w-2 h-2 rounded-full
                          ${isActive 
                            ? 'bg-yellow-400' 
                            : 'bg-yellow-500'
                          }
                        `}>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Główny kontener - responsywny layout */}
        <div className={`
          flex flex-col lg:flex-row
          bg-white rounded-b-2xl border border-gray-200 border-t-0
          ${isMobile ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : 'overflow-hidden'}
        `} style={{
          boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.15), -3px 0 6px -1px rgba(0, 0, 0, 0.1), 3px 0 6px -1px rgba(0, 0, 0, 0.1)',
          height: isMobile ? '70vh' : 'calc(100vh - 150px)',
          minHeight: isMobile ? '500px' : '600px',
          maxHeight: isMobile ? '80vh' : '800px'
        }}>
          
          {/* Panel kategorii - tylko desktop */}
          {isDesktop && (
            <div className="
              w-64 xl:w-72
              flex-shrink-0 
              border-r border-gray-200
            ">
              <NotificationsCategoriesPanel
                activeTab={activeTab}
                categoryCounts={categoryCounts}
                onTabChange={handleTabChange}
              />
            </div>
          )}

          {/* Panel listy powiadomień - pełna szerokość na mobile, ograniczona na desktop */}
          {(panelState === 'list' || isDesktop) && (
            <div className={`
              ${isMobile 
                ? 'w-full' 
                : 'flex-1'
              }
              min-h-[280px] lg:min-h-0
            `}>
              <NotificationsListPanel
                notifications={filteredNotifications}
                loading={isLoading}
                activeTab={activeTab}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteNotification}
                onBack={handleBack}
                showBackButton={isMobile && panelState === 'list'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Notifications.displayName = 'Notifications';

export default Notifications;
