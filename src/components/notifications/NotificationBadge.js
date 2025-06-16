import React, { useState, useEffect, useContext } from 'react';
import { 
  Badge, 
  IconButton, 
  Popover, 
  Box, 
  Typography, 
  Button, 
  Divider, 
  CircularProgress 
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { SocketContext } from '../../contexts/SocketContext';
import NotificationItem from './NotificationItem';
import EmptyState from '../ui/EmptyState';

/**
 * Komponent wyświetlający ikonę powiadomień z liczbą nieprzeczytanych powiadomień
 * @returns {JSX.Element}
 */
const NotificationBadge = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const socket = useContext(SocketContext);
  
  // Stan komponentu
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Pobieranie nieprzeczytanych powiadomień
  useEffect(() => {
    fetchUnreadNotifications();
    
    // Nasłuchiwanie na nowe powiadomienia
    if (socket) {
      socket.on('notification:new', handleNewNotification);
      socket.on('notification:read', handleNotificationRead);
      socket.on('notification:read-all', handleAllNotificationsRead);
      socket.on('notification:deleted', handleNotificationDeleted);
      socket.on('notification:deleted-all', handleAllNotificationsDeleted);
    }
    
    return () => {
      // Czyszczenie nasłuchiwania
      if (socket) {
        socket.off('notification:new');
        socket.off('notification:read');
        socket.off('notification:read-all');
        socket.off('notification:deleted');
        socket.off('notification:deleted-all');
      }
    };
  }, [socket]);
  
  // Pobieranie nieprzeczytanych powiadomień z API
  const fetchUnreadNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications/unread');
      setNotifications(response.data);
      setUnreadCount(response.data.length);
      setError(null);
    } catch (err) {
      console.error('Błąd podczas pobierania nieprzeczytanych powiadomień:', err);
      setError('Nie udało się pobrać powiadomień');
    } finally {
      setLoading(false);
    }
  };
  
  // Obsługa nowego powiadomienia
  const handleNewNotification = (notification) => {
    // Dodajemy nowe powiadomienie na początek listy
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Wyświetlamy powiadomienie w snackbarze
    enqueueSnackbar(notification.title, {
      variant: 'info',
      action: (key) => (
        <Button 
          color="inherit" 
          size="small" 
          onClick={() => {
            navigate(notification.actionUrl);
            handleMarkAsRead(notification._id);
          }}
        >
          {notification.actionText || 'Zobacz'}
        </Button>
      )
    });
  };
  
  // Obsługa oznaczenia powiadomienia jako przeczytane
  const handleNotificationRead = (notificationId) => {
    // Aktualizujemy stan powiadomienia
    setNotifications(prev => 
      prev.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Zmniejszamy licznik nieprzeczytanych
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  // Obsługa oznaczenia wszystkich powiadomień jako przeczytane
  const handleAllNotificationsRead = () => {
    // Aktualizujemy stan wszystkich powiadomień
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // Zerujemy licznik nieprzeczytanych
    setUnreadCount(0);
  };
  
  // Obsługa usunięcia powiadomienia
  const handleNotificationDeleted = (notificationId) => {
    // Usuwamy powiadomienie z listy
    const notification = notifications.find(n => n._id === notificationId);
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
    
    // Jeśli powiadomienie było nieprzeczytane, zmniejszamy licznik
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  
  // Obsługa usunięcia wszystkich powiadomień
  const handleAllNotificationsDeleted = () => {
    // Czyścimy listę powiadomień
    setNotifications([]);
    
    // Zerujemy licznik nieprzeczytanych
    setUnreadCount(0);
  };
  
  // Otwieranie/zamykanie popovera
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // Oznaczanie powiadomienia jako przeczytane
  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      
      // Aktualizacja stanu
      handleNotificationRead(notificationId);
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
      handleAllNotificationsRead();
      
      enqueueSnackbar('Wszystkie powiadomienia oznaczone jako przeczytane', { variant: 'success' });
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
      handleNotificationDeleted(notificationId);
      
      enqueueSnackbar('Powiadomienie usunięte', { variant: 'success' });
    } catch (err) {
      console.error('Błąd podczas usuwania powiadomienia:', err);
      enqueueSnackbar('Nie udało się usunąć powiadomienia', { variant: 'error' });
    }
  };
  
  // Przejście do strony powiadomień
  const goToNotificationsPage = () => {
    navigate('/profil/notifications');
    handleClose();
  };
  
  // Sprawdzenie, czy popover jest otwarty
  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;
  
  return (
    <>
      <IconButton
        color="inherit"
        aria-label="powiadomienia"
        onClick={handleClick}
        aria-describedby={id}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }
        }}
      >
        {/* Nagłówek */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          bgcolor="primary.main"
          color="primary.contrastText"
        >
          <Typography variant="h6">
            Powiadomienia {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
          
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleMarkAllAsRead}
            >
              Oznacz wszystkie jako przeczytane
            </Button>
          )}
        </Box>
        
        <Divider />
        
        {/* Zawartość */}
        <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <EmptyState
              icon="error_outline"
              title="Wystąpił błąd"
              description={error}
              actionText="Spróbuj ponownie"
              onAction={fetchUnreadNotifications}
            />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon="notifications_off"
              title="Brak powiadomień"
              description="Nie masz żadnych nieprzeczytanych powiadomień"
            />
          ) : (
            notifications.slice(0, 5).map(notification => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={() => handleMarkAsRead(notification._id)}
                onDelete={() => handleDeleteNotification(notification._id)}
              />
            ))
          )}
        </Box>
        
        <Divider />
        
        {/* Stopka */}
        <Box p={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={goToNotificationsPage}
            fullWidth
          >
            Zobacz wszystkie powiadomienia
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBadge;
