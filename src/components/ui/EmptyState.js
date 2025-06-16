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
      py={4}
      px={2}
    >
      {/* Ikona */}
      {icon && (
        <Box
          sx={{
            fontSize: 64,
            color: 'text.secondary',
            mb: 2
          }}
          className="material-icons"
        >
          {icon}
        </Box>
      )}
      
      {/* Tytuł */}
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      {/* Opis */}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      
      {/* Przycisk akcji */}
      {actionText && onAction && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
