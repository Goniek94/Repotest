import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Komponent do wyświetlania komunikatów o błędach
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.message - Treść komunikatu o błędzie
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element} - Komponent komunikatu o błędzie
 */
function ErrorMessage({ message, className = '' }) {
  if (!message) return null;
  
  return (
    <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center ${className}`}>
      <FaExclamationTriangle className="text-red-500 mr-2 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export default ErrorMessage;
