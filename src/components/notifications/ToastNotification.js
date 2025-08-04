import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Komponent wyświetlający kontener dla toastów
 * Logika wyświetlania toastów jest teraz w NotificationContext
 * @returns {JSX.Element}
 */
const ToastNotification = () => {
  // Określamy, czy urządzenie jest mobilne
  const isMobile = window.innerWidth < 768;
  
  return (
    <ToastContainer
      position={isMobile ? "bottom-center" : "top-right"}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{
        width: isMobile ? '100%' : 'auto',
        padding: isMobile ? '12px' : '8px'
      }}
      toastStyle={{
        fontSize: isMobile ? '16px' : '14px',
        padding: isMobile ? '12px 16px' : '8px 12px',
        width: isMobile ? '90%' : 'auto',
        maxWidth: isMobile ? '90%' : '350px'
      }}
    />
  );
};

export default ToastNotification;
