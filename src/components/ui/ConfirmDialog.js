import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

/**
 * Prosty dialog potwierdzenia akcji
 * @param {Object} props
 * @param {boolean} props.open - Czy dialog jest otwarty
 * @param {Function} props.onClose - Funkcja zamykająca dialog
 * @param {Function} props.onConfirm - Funkcja wykonywana po potwierdzeniu
 * @param {string} props.title - Tytuł dialogu
 * @param {string|React.ReactNode} props.content - Treść dialogu
 * @param {string} props.confirmText - Tekst przycisku potwierdzenia
 * @param {string} props.cancelText - Tekst przycisku anulowania
 * @param {string} props.confirmColor - Kolor przycisku potwierdzenia
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = 'Potwierdź',
  cancelText = 'Anuluj',
  confirmColor = 'primary'
}) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    PaperProps={{
      sx: {
        width: { xs: '90%', sm: 'auto' },
        maxWidth: { xs: '90%', sm: 500 }
      }
    }}
  >
    {title && (
      <DialogTitle sx={{ 
        fontSize: { xs: '1.2rem', sm: '1.5rem' },
        py: { xs: 2, sm: 2 }
      }}>
        {title}
      </DialogTitle>
    )}
    {content && (
      <DialogContent sx={{ py: { xs: 2, sm: 2 } }}>
        <DialogContentText sx={{ 
          fontSize: { xs: '1rem', sm: '1rem' }
        }}>
          {content}
        </DialogContentText>
      </DialogContent>
    )}
    <DialogActions sx={{ 
      px: { xs: 3, sm: 3 },
      py: { xs: 2, sm: 2 },
      justifyContent: 'space-between'
    }}>
      <Button 
        onClick={onClose}
        sx={{ 
          fontSize: { xs: '0.9rem', sm: '0.9rem' },
          py: { xs: 1 },
          px: { xs: 3 }
        }}
      >
        {cancelText}
      </Button>
      <Button 
        onClick={onConfirm} 
        color={confirmColor} 
        variant="contained"
        sx={{ 
          fontSize: { xs: '0.9rem', sm: '0.9rem' },
          py: { xs: 1 },
          px: { xs: 3 }
        }}
      >
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
