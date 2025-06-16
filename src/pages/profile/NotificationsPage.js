import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Divider, Button, IconButton, useTheme, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { getNotificationGroups, getNotificationGroupNames, getNotificationIcon, getNotificationColor } from '../../utils/NotificationTypes';
import NotificationItem from '../../components/notifications/NotificationItem';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import NotificationPreferences from '../../components/notifications/NotificationPreferences';

/**
 * Strona powiadomień w profilu użytkownika
 * @returns {JSX.Element}
 */
const NotificationsPage = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  
  // Stan komponentu
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState(null);
  
  // Grupy powiadomień
  const notificationGroups = getNotificationGroups();
  const groupNames = getNotificationGroupNames();
  
  // Pobieranie powiadomień
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  // Pobieranie powiadomień z API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Błąd podczas pobierania powiadomień:', err);
      setError('Nie udało się pobrać powiadomień. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };
  
  // Oznaczanie powiadomienia jako przeczytane
  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      
      // Aktualizacja stanu
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      
      enqueueSnackbar('Powiadomienie oznaczone jako przeczytane', { variant: 'success' });
    } catch (err) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', err);
      enqueueSnackbar('Nie udało się oznaczyć powiadomienia jako przeczytane', { variant: 'error' });
    }
  };
  
  // Oznaczanie wszystkich powiadomień jako przeczytane
  const handleMarkAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      
      // Aktualizacja stanu
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      
      enqueueSnackbar('Wszystkie powiadomienia oznaczone jako przeczytane', { variant: 'success' });
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', err);
      enqueueSnackbar('Nie udało się oznaczyć wszystkich powiadomień jako przeczytane', { variant: 'error' });
    }
  };
  
  // Usuwanie powiadomienia
  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      
      // Aktualizacja stanu
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
      
      enqueueSnackbar('Powiadomienie usunięte', { variant: 'success' });
    } catch (err) {
      console.error('Błąd podczas usuwania powiadomienia:', err);
      enqueueSnackbar('Nie udało się usunąć powiadomienia', { variant: 'error' });
    }
  };
  
  // Usuwanie wszystkich powiadomień
  const handleDeleteAllNotifications = async () => {
    try {
      await axios.delete('/api/notifications');
      
      // Aktualizacja stanu
      setNotifications([]);
      
      enqueueSnackbar('Wszystkie powiadomienia usunięte', { variant: 'success' });
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error('Błąd podczas usuwania wszystkich powiadomień:', err);
      enqueueSnackbar('Nie udało się usunąć wszystkich powiadomień', { variant: 'error' });
    }
  };
  
  // Zmiana aktywnej zakładki
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
    if (activeTab === 'unread') return !notification.read;
    
    // Filtrowanie według grupy
    const groupTypes = notificationGroups[activeTab] || [];
    return groupTypes.includes(notification.type);
  });
  
  // Liczba nieprzeczytanych powiadomień
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Renderowanie zawartości
  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <EmptyState
          icon="error"
          title="Wystąpił błąd"
          description={error}
          actionText="Spróbuj ponownie"
          onAction={fetchNotifications}
        />
      );
    }
    
    if (showPreferences) {
      return <NotificationPreferences onBack={() => setShowPreferences(false)} />;
    }
    
    if (filteredNotifications.length === 0) {
      return (
        <EmptyState
          icon="notifications_off"
          title="Brak powiadomień"
          description={activeTab === 'all' 
            ? 'Nie masz żadnych powiadomień' 
            : activeTab === 'unread' 
              ? 'Nie masz nieprzeczytanych powiadomień' 
              : `Nie masz powiadomień w kategorii ${groupNames[activeTab] || activeTab}`
          }
        />
      );
    }
    
    return (
      <Box>
        {filteredNotifications.map(notification => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onMarkAsRead={() => handleMarkAsRead(notification._id)}
            onDelete={() => handleDeleteNotification(notification._id)}
          />
        ))}
      </Box>
    );
  };
  
  return (
    <Box>
      {/* Nagłówek */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Powiadomienia {unreadCount > 0 && `(${unreadCount})`}
        </Typography>
        
        <Box>
          {!showPreferences && notifications.length > 0 && (
            <>
              <IconButton 
                color="primary" 
                onClick={() => openConfirmDialog('markAllAsRead')}
                disabled={unreadCount === 0}
                title="Oznacz wszystkie jako przeczytane"
              >
                <CheckCircleIcon />
              </IconButton>
              
              <IconButton 
                color="error" 
                onClick={() => openConfirmDialog('deleteAll')}
                title="Usuń wszystkie powiadomienia"
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
          
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => setShowPreferences(!showPreferences)}
            sx={{ ml: 1 }}
          >
            {showPreferences ? 'Powrót do powiadomień' : 'Preferencje powiadomień'}
          </Button>
        </Box>
      </Box>
      
      {/* Zakładki */}
      {!showPreferences && (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Wszystkie" value="all" />
          <Tab label={`Nieprzeczytane (${unreadCount})`} value="unread" />
          <Tab label={groupNames.listings} value="listings" />
          <Tab label={groupNames.messages} value="messages" />
          <Tab label={groupNames.comments} value="comments" />
          <Tab label={groupNames.payments} value="payments" />
          <Tab label={groupNames.system} value="system" />
        </Tabs>
      )}
      
      {/* Zawartość */}
      {renderContent()}
      
      {/* Dialog potwierdzenia */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          confirmDialogAction === 'markAllAsRead' 
            ? 'Oznacz wszystkie jako przeczytane' 
            : 'Usuń wszystkie powiadomienia'
        }
        content={
          confirmDialogAction === 'markAllAsRead'
            ? 'Czy na pewno chcesz oznaczyć wszystkie powiadomienia jako przeczytane?'
            : 'Czy na pewno chcesz usunąć wszystkie powiadomienia? Tej operacji nie można cofnąć.'
        }
        confirmText={confirmDialogAction === 'markAllAsRead' ? 'Oznacz wszystkie' : 'Usuń wszystkie'}
        confirmColor={confirmDialogAction === 'markAllAsRead' ? 'primary' : 'error'}
      />
    </Box>
  );
};

export default NotificationsPage;
