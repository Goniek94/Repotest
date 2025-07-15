import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const AdminModal = ({
  isOpen = false,
  onClose = null,
  title = '',
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer = null,
  loading = false,
  className = ''
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'max-w-md';
      case 'medium':
        return 'max-w-2xl';
      case 'large':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-7xl';
      default:
        return 'max-w-2xl';
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus and body scroll
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div 
          ref={modalRef}
          tabIndex={-1}
          className={`
            relative w-full ${getSizeClasses(size)} bg-white rounded-lg shadow-xl 
            transform transition-all max-h-[90vh] overflow-hidden
            ${className}
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Zamknij modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Ładowanie...</p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {children}
              </div>
            )}
          </div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-gray-200 p-6">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;