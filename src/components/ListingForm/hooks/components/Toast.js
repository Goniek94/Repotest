import React, { useEffect } from 'react';
import { XIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/solid';

/**
 * Komponent Toast wyświetlający powiadomienia
 */
const Toast = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 5000, 
  position = 'bottom-right' 
}) => {
  // Automatyczne zamknięcie po określonym czasie
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  // Określenie ikon i kolorów w zależności od typu
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircleIcon className="h-6 w-6" />,
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-500',
          iconColor: 'text-green-500'
        };
      case 'error':
        return {
          icon: <ExclamationCircleIcon className="h-6 w-6" />,
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-500',
          iconColor: 'text-red-500'
        };
      case 'warning':
        return {
          icon: <ExclamationCircleIcon className="h-6 w-6" />,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-500',
          iconColor: 'text-yellow-500'
        };
      case 'info':
      default:
        return {
          icon: <InformationCircleIcon className="h-6 w-6" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-500',
          iconColor: 'text-blue-500'
        };
    }
  };
  
  // Pozycja
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };
  
  const styles = getTypeStyles();
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-md shadow-lg rounded-[2px] overflow-hidden`}>
      <div className={`${styles.bgColor} p-4 border-l-4 ${styles.borderColor} flex items-start`}>
        {/* Ikona */}
        <div className={`flex-shrink-0 ${styles.iconColor} mr-3`}>
          {styles.icon}
        </div>
        
        {/* Treść */}
        <div className={`mr-2 flex-grow ${styles.textColor}`}>
          {message}
        </div>
        
        {/* Przycisk zamykania */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Zamknij"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;