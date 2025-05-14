import React from 'react';
import PropTypes from 'prop-types';

/**
 * Komponent wyświetlający animację ładowania
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.size - Rozmiar spinnera (sm, md, lg)
 * @param {string} props.color - Kolor spinnera
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element} - Komponent spinnera ładowania
 */
const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Mapowanie rozmiaru na klasy CSS
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  // Mapowanie koloru na klasy CSS
  const colorClasses = {
    primary: 'text-[#35530A]',
    secondary: 'text-gray-500',
    white: 'text-white'
  };

  // Wybór odpowiednich klas
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`inline-block ${className}`} role="status" aria-label="Ładowanie">
      <svg 
        className={`animate-spin ${spinnerSize} ${spinnerColor}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Ładowanie...</span>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white']),
  className: PropTypes.string
};

export default LoadingSpinner;
