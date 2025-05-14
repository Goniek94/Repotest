import React from 'react';

/**
 * Komponent Badge do wyświetlania liczników i oznaczeń
 * @param {Object} props - Właściwości komponentu
 * @param {number|string} props.count - Liczba do wyświetlenia
 * @param {string} props.variant - Wariant kolorystyczny (primary, danger, warning, success)
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element} - Komponent Badge
 */
function Badge({ count, variant = 'primary', className = '' }) {
  if (!count && count !== 0) return null;
  
  const variantClasses = {
    primary: 'bg-[#35530A] text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    success: 'bg-green-500 text-white',
    gray: 'bg-gray-200 text-gray-800'
  };
  
  const baseClasses = 'text-xs px-2 py-1 rounded-full font-medium inline-flex items-center justify-center min-w-[1.5rem]';
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`}>
      {count}
    </span>
  );
}

export default Badge;
