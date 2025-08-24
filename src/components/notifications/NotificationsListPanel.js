import React from 'react';
import { ArrowLeft, CheckCircle, CheckSquare, Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

/**
 * 🔔 NOTIFICATIONS LIST PANEL - Panel listy powiadomień
 * 
 * Wzorowany na ConversationsPanel.js z wiadomości
 */
const NotificationsListPanel = ({
  notifications = [],
  loading = false,
  activeTab,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onBack,
  showBackButton = false
}) => {
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const hasUnreadNotifications = unreadNotifications.length > 0;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header z przyciskiem powrotu i akcjami */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={onBack}
                className="flex items-center justify-center w-8 h-8 hover:bg-[#35530A]/10 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-[#35530A]" />
              </button>
            )}
            <h3 className="text-sm font-medium text-gray-700">
              {activeTab === 'all' && 'WSZYSTKIE POWIADOMIENIA'}
              {activeTab === 'unread' && 'NIEPRZECZYTANE'}
              {activeTab === 'listings' && 'OGŁOSZENIA'}
              {activeTab === 'messages' && 'WIADOMOŚCI'}
              {activeTab === 'comments' && 'KOMENTARZE'}
              {activeTab === 'payments' && 'PŁATNOŚCI'}
              {activeTab === 'system' && 'SYSTEMOWE'}
              {activeTab === 'preferences' && 'PREFERENCJE'}
            </h3>
          </div>
          
          {/* Przycisk oznacz wszystkie jako przeczytane */}
          {hasUnreadNotifications && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#35530A] hover:bg-[#35530A]/10 rounded-lg transition-colors"
              title="Oznacz wszystkie jako przeczytane"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Oznacz wszystkie</span>
            </button>
          )}
        </div>
      </div>

      {/* Lista powiadomień z suwakiem */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-[#35530A] border-t-transparent rounded-full"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              {activeTab === 'unread' ? 'Brak nieprzeczytanych powiadomień' : 'Brak powiadomień'}
            </h3>
            <p className="text-gray-500 text-sm text-center">
              {activeTab === 'unread' 
                ? 'Wszystkie powiadomienia zostały przeczytane'
                : 'Gdy pojawią się nowe powiadomienia, zobaczysz je tutaj'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => onMarkAsRead(notification.id)}
                onDelete={() => onDelete(notification.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer z informacją o liczbie powiadomień */}
      {notifications.length > 0 && (
        <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {notifications.length} {notifications.length === 1 ? 'powiadomienie' : 'powiadomień'}
            </span>
            {hasUnreadNotifications && (
              <span className="text-[#35530A] font-medium">
                {unreadNotifications.length} nieprzeczytanych
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsListPanel;
