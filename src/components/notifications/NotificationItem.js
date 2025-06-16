import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Chip, 
  Divider, 
  Button, 
  useTheme, 
  alpha 
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  CheckCircle as CheckCircleIcon, 
  OpenInNew as OpenInNewIcon 
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

import { getNotificationIcon, getNotificationColor, getNotificationTypeName } from '../../utils/NotificationTypes';

/**
 * Komponent pojedynczego powiadomienia
 * @param {Object} props - Właściwości komponentu
 * @param {Object} props.notification - Obiekt powiadomienia
 * @param {Function} props.onMarkAsRead - Funkcja wywoływana po oznaczeniu powiadomienia jako przeczytane
 * @param {Function} props.onDelete - Funkcja wywoływana po usunięciu powiadomienia
 * @returns {JSX.Element}
 */
const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Formatowanie daty
  const formattedDate = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: pl
  });
  
  // Ikona i kolor powiadomienia
  const icon = getNotificationIcon(notification.type);
  const color = getNotificationColor(notification.type);
  const typeName = getNotificationTypeName(notification.type);
  
  // Obsługa kliknięcia w akcję
  const handleActionClick = (e) => {
    e.stopPropagation();
    
    // Jeśli powiadomienie nie jest przeczytane, oznaczamy je jako przeczytane
    if (!notification.read) {
      onMarkAsRead();
    }
    
    // Przekierowujemy na stronę akcji
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };
  
  // Obsługa kliknięcia w powiadomienie
  const handleClick = () => {
    // Jeśli powiadomienie nie jest przeczytane, oznaczamy je jako przeczytane
    if (!notification.read) {
      onMarkAsRead();
    }
    
    // Jeśli powiadomienie ma URL akcji, przekierowujemy na tę stronę
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };
  
  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        p: 2,
        borderLeft: `4px solid ${color}`,
        backgroundColor: notification.read ? 'background.paper' : alpha(color, 0.05),
        cursor: notification.actionUrl ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: notification.actionUrl ? 3 : 1,
          transform: notification.actionUrl ? 'translateY(-2px)' : 'none'
        }
      }}
      onClick={handleClick}
    >
      <Box display="flex" alignItems="flex-start">
        {/* Ikona powiadomienia */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: alpha(color, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            color: color
          }}
        >
          <span className="material-icons">{icon}</span>
        </Box>
        
        {/* Treść powiadomienia */}
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="subtitle1" fontWeight="bold" component="h3">
              {notification.title}
            </Typography>
            
            <Box display="flex" alignItems="center">
              {/* Chip z typem powiadomienia */}
              <Chip
                label={typeName}
                size="small"
                sx={{
                  backgroundColor: alpha(color, 0.1),
                  color: color,
                  mr: 1
                }}
              />
              
              {/* Przycisk oznaczania jako przeczytane */}
              {!notification.read && (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead();
                  }}
                  title="Oznacz jako przeczytane"
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              )}
              
              {/* Przycisk usuwania */}
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title="Usuń powiadomienie"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* Treść wiadomości */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            {notification.message}
          </Typography>
          
          {/* Stopka powiadomienia */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
            
            {/* Przycisk akcji */}
            {notification.actionUrl && notification.actionText && (
              <Button
                variant="text"
                size="small"
                color="primary"
                endIcon={<OpenInNewIcon fontSize="small" />}
                onClick={handleActionClick}
              >
                {notification.actionText}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default NotificationItem;
