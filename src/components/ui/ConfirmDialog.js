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
  <Dialog open={open} onClose={onClose}>
    {title && <DialogTitle>{title}</DialogTitle>}
    {content && (
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
    )}
    <DialogActions>
      <Button onClick={onClose}>{cancelText}</Button>
      <Button onClick={onConfirm} color={confirmColor} variant="contained">
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
