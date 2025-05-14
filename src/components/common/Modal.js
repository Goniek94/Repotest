import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Komponent Modal do wyświetlania okien modalnych
 * @param {Object} props - Właściwości komponentu
 * @param {boolean} props.isOpen - Czy modal jest otwarty
 * @param {Function} props.onClose - Funkcja wywoływana po zamknięciu modalu
 * @param {string} props.title - Tytuł modalu
 * @param {React.ReactNode} props.children - Zawartość modalu
 * @param {React.ReactNode} props.footer - Stopka modalu (przyciski akcji)
 * @param {string} props.size - Rozmiar modalu (sm, md, lg, xl, full)
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element|null} - Komponent modalu lub null, jeśli modal jest zamknięty
 */
function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = ''
}) {
  // Klasy dla różnych rozmiarów
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };
  
  // Blokowanie przewijania body, gdy modal jest otwarty
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Obsługa klawisza Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Jeśli modal nie jest otwarty, nie renderuj nic
  if (!isOpen) return null;
  
  // Obsługa kliknięcia poza modalem
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-lg w-full ${sizeClasses[size] || sizeClasses.md} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nagłówek */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Zamknij"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Zawartość */}
        <div className="p-6">
          {children}
        </div>
        
        {/* Stopka */}
        {footer && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
