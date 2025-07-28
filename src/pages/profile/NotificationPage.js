import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Clock, User, Car, Mail, MessageSquare, CreditCard, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { getNotificationIcon, getNotificationColor, formatNotificationDate } from '../../utils/NotificationTypes';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

/**
 * Strona pojedynczego powiadomienia
 * Wyświetla szczegóły konkretnego powiadomienia
 * @returns {JSX.Element}
 */
const NotificationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Używamy kontekstu powiadomień
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    deleteNotification, 
    fetchNotifications 
  } = useNotifications();
  
  // Stan komponentu
  const [notification, setNotification] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pobieranie powiadomień przy pierwszym załadowaniu
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  // Znajdowanie konkretnego powiadomienia
  useEffect(() => {
    if (notifications.length > 0 && id) {
      const foundNotification = notifications.find(n => n.id === parseInt(id) || n.id === id);
      setNotification(foundNotification || null);
    }
  }, [notifications, id]);
  
  // Oznaczanie powiadomienia jako przeczytane przy wejściu na stronę
  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id).catch(error => {
        console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
      });
    }
  }, [notification, markAsRead]);
  
  // Oznaczanie powiadomienia jako przeczytane
  const handleMarkAsRead = async () => {
    if (!notification) return;
    
    try {
      await markAsRead(notification.id);
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
    }
  };
  
  // Usuwanie powiadomienia
  const handleDeleteNotification = async () => {
    if (!notification) return;
    
    setIsDeleting(true);
    try {
      await deleteNotification(notification.id);
      setConfirmDialogOpen(false);
      // Przekierowanie do listy powiadomień po usunięciu
      navigate('/profil/notifications');
    } catch (error) {
      console.error('Błąd podczas usuwania powiadomienia:', error);
      setIsDeleting(false);
    }
  };
  
  // Powrót do listy powiadomień
  const handleGoBack = () => {
    navigate('/profil/notifications');
  };
  
  // Mapowanie ikon dla różnych typów powiadomień
  const getIconComponent = (type) => {
    const iconMap = {
      'listing_added': Bell,
      'listing_expiring': Clock,
      'listing_expired': AlertTriangle,
      'listing_status_changed': Bell,
      'new_message': Mail,
      'new_comment': MessageSquare,
      'comment_reply': MessageSquare,
      'payment_completed': CreditCard,
      'payment_failed': AlertTriangle,
      'system_notification': Bell,
      'account_activity': User,
      'listing_liked': Car,
      'listing_viewed': Car
    };
    
    return iconMap[type] || Bell;
  };

  // Mapowanie kolorów CSS dla różnych typów powiadomień
  const getIconColorClass = (type) => {
    const colorMap = {
      'listing_added': 'bg-green-500',
      'listing_expiring': 'bg-orange-500',
      'listing_expired': 'bg-red-500',
      'listing_status_changed': 'bg-blue-500',
      'new_message': 'bg-blue-500',
      'new_comment': 'bg-green-500',
      'comment_reply': 'bg-green-500',
      'payment_completed': 'bg-green-500',
      'payment_failed': 'bg-red-500',
      'system_notification': 'bg-red-500',
      'account_activity': 'bg-blue-500',
      'listing_liked': 'bg-pink-500',
      'listing_viewed': 'bg-purple-500'
    };
    
    return colorMap[type] || 'bg-blue-500';
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  // Powiadomienie nie znalezione
  if (!notification) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Powiadomienie</h1>
        </div>
        
        <EmptyState
          icon={Bell}
          title="Powiadomienie nie znalezione"
          description="Nie można znaleźć powiadomienia o podanym identyfikatorze."
          action={{
            label: 'Powrót do powiadomień',
            onClick: handleGoBack
          }}
        />
      </div>
    );
  }
  
  const IconComponent = getIconComponent(notification.type);
  const iconColorClass = getIconColorClass(notification.type);
  
  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Szczegóły powiadomienia</h1>
        </div>
        
        <button
          onClick={() => setConfirmDialogOpen(true)}
          disabled={isDeleting}
          className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="w-4 h-4 mr-2 text-red-600">×</span>
          {isDeleting ? 'Usuwanie...' : 'Usuń'}
        </button>
      </div>
      
      {/* Zawartość powiadomienia */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Header powiadomienia */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconColorClass}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  {notification.title}
                </h2>
                {!notification.isRead && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Nowe
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatNotificationDate(notification.createdAt)}
                </span>
                {notification.type && (
                  <span className="capitalize">
                    {notification.type.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Treść powiadomienia */}
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-wrap">
              {notification.message || notification.content}
            </div>
          </div>
          
          {/* Dodatkowe dane */}
          {notification.data && Object.keys(notification.data).length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dodatkowe informacje</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(notification.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {/* Akcje */}
          {notification.actionUrl && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href={notification.actionUrl}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Przejdź do akcji
              </a>
            </div>
          )}
        </div>
        
        {/* Footer z metadanymi */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>ID: {notification.id}</span>
            <span>
              Status: {notification.isRead ? 'Przeczytane' : 'Nieprzeczytane'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Dialog potwierdzenia usunięcia */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleDeleteNotification}
        title="Usuń powiadomienie"
        message="Czy na pewno chcesz usunąć to powiadomienie? Tej operacji nie można cofnąć."
        confirmText="Usuń"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />
    </div>
  );
};

export default NotificationPage;
