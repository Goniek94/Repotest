import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Komponent wyświetlający stan pusty (brak danych)
 * 
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.icon - Nazwa ikony Material Icons
 * @param {string} props.title - Tytuł stanu pustego
 * @param {string} props.description - Opis stanu pustego
 * @param {string} props.actionText - Tekst przycisku akcji (opcjonalny)
 * @param {Function} props.onAction - Funkcja wywoływana po kliknięciu przycisku akcji (opcjonalna)
 * @returns {JSX.Element}
 */
const EmptyState = ({ icon, title, description, actionText, onAction }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      py={{ xs: 6, sm: 4 }}
      px={{ xs: 3, sm: 2 }}
    >
      {/* Ikona */}
      {icon && (
        <Box
          sx={{
            fontSize: { xs: 80, sm: 64 },
            color: 'text.secondary',
            mb: { xs: 3, sm: 2 }
          }}
          className="material-icons"
        >
          {icon}
        </Box>
      )}
      
      {/* Tytuł */}
      {title && (
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.3rem', sm: '1.25rem' },
            fontWeight: { xs: 600, sm: 500 },
            mb: { xs: 2, sm: 1 }
          }}
        >
          {title}
        </Typography>
      )}
      
      {/* Opis */}
      {description && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 4, sm: 3 },
            fontSize: { xs: '1rem', sm: '0.875rem' },
            maxWidth: { xs: '90%', sm: '80%' },
            mx: 'auto'
          }}
        >
          {description}
        </Typography>
      )}
      
      {/* Przycisk akcji */}
      {actionText && onAction && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onAction}
          sx={{ 
            py: { xs: 1.5, sm: 1 },
            px: { xs: 4, sm: 3 },
            fontSize: { xs: '1rem', sm: '0.875rem' }
          }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
