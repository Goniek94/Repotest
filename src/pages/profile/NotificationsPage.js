import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, useTheme, CircularProgress, Paper } from '@mui/material';
import { 
  Delete as DeleteIcon, 
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  DirectionsCar as DirectionsCarIcon,
  Message as MessageIcon,
  Comment as CommentIcon,
  Payment as PaymentIcon,
  Announcement as AnnouncementIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
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
      return <NotificationPreferences />;
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
  
  // Mapowanie ikon dla zakładek
  const tabIcons = {
    all: NotificationsIcon,
    unread: NotificationsActiveIcon,
    listings: DirectionsCarIcon,
    messages: MessageIcon,
    comments: CommentIcon,
    payments: PaymentIcon,
    system: AnnouncementIcon
  };

  // Lista zakładek
  const tabs = [
    { id: 'all', label: 'Wszystkie' },
    { id: 'unread', label: `Nieprzeczytane (${unreadCount})` },
    { id: 'listings', label: groupNames.listings },
    { id: 'messages', label: groupNames.messages },
    { id: 'comments', label: groupNames.comments },
    { id: 'payments', label: groupNames.payments },
    { id: 'system', label: groupNames.system }
  ];

  return (
    <Box>
      {/* Nagłówek */}
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        mb={3}
        gap={2}
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          Powiadomienia {unreadCount > 0 && `(${unreadCount})`}
        </Typography>
        
        {!showPreferences && notifications.length > 0 && (
          <Box 
            display="flex" 
            flexDirection={{ xs: 'row' }} 
            justifyContent={{ xs: 'flex-end' }}
            width={{ xs: '100%', sm: 'auto' }}
            gap={1}
          >
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => openConfirmDialog('markAllAsRead')}
              disabled={unreadCount === 0}
              startIcon={<CheckCircleIcon />}
              sx={{ 
                py: { xs: 1 },
                flex: { xs: 1, sm: 'none' }
              }}
            >
              Oznacz jako przeczytane
            </Button>
            
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => openConfirmDialog('deleteAll')}
              startIcon={<DeleteIcon />}
              sx={{ 
                py: { xs: 1 },
                flex: { xs: 1, sm: 'none' }
              }}
            >
              Usuń wszystkie
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Główna zawartość */}
      {showPreferences ? (
        <NotificationPreferences />
      ) : (
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          {/* Nawigacja zakładek */}
          <Box width={{ xs: '100%', md: '250px' }}>
            <Paper 
              sx={{ 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box 
                display="flex" 
                flexDirection={{ xs: 'row', md: 'column' }}
                sx={{ 
                  overflowX: { xs: 'auto', md: 'visible' },
                  flexWrap: { xs: 'nowrap', md: 'wrap' }
                }}
              >
                {tabs.map((tab) => {
                  const TabIcon = tabIcons[tab.id];
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        px: { xs: 2, md: 3 },
                        py: { xs: 1.5, md: 2 },
                        borderRadius: { xs: 0, md: 0 },
                        borderBottom: { xs: activeTab === tab.id ? '2px solid' : '2px solid transparent', md: 'none' },
                        borderRight: { xs: 'none', md: activeTab === tab.id ? '4px solid' : '4px solid transparent' },
                        borderColor: activeTab === tab.id ? 'primary.main' : 'transparent',
                        backgroundColor: activeTab === tab.id ? { xs: 'rgba(53, 83, 10, 0.08)', md: 'rgba(53, 83, 10, 0.12)' } : 'transparent',
                        color: activeTab === tab.id ? 'primary.main' : 'text.primary',
                        '&:hover': {
                          backgroundColor: 'rgba(53, 83, 10, 0.08)',
                        },
                        width: { xs: 'auto', md: '100%' },
                        minWidth: { xs: '120px', md: 'auto' },
                        textAlign: 'left',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <TabIcon sx={{ mr: { xs: 1, md: 2 }, fontSize: '1.25rem' }} />
                      <span>{tab.label}</span>
                    </Button>
                  );
                })}
                
                <Button
                  onClick={() => setShowPreferences(true)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    px: { xs: 2, md: 3 },
                    py: { xs: 1.5, md: 2 },
                    borderRadius: 0,
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(53, 83, 10, 0.08)',
                    },
                    width: { xs: 'auto', md: '100%' },
                    minWidth: { xs: '120px', md: 'auto' },
                    textAlign: 'left',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <SettingsIcon sx={{ mr: { xs: 1, md: 2 }, fontSize: '1.25rem' }} />
                  <span>Preferencje</span>
                </Button>
              </Box>
            </Paper>
          </Box>
          
          {/* Zawartość zakładki */}
          <Box flex="1">
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
              </Box>
            ) : error ? (
              <EmptyState
                icon="error"
                title="Wystąpił błąd"
                description={error}
                actionText="Spróbuj ponownie"
                onAction={fetchNotifications}
              />
            ) : filteredNotifications.length === 0 ? (
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
            ) : (
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
            )}
          </Box>
        </Box>
      )}
      
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
