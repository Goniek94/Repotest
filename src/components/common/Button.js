import React from 'react';

/**
 * Komponent Button do wyświetlania przycisków w spójny sposób
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.variant - Wariant przycisku (primary, secondary, outline, danger)
 * @param {string} props.size - Rozmiar przycisku (sm, md, lg)
 * @param {boolean} props.isLoading - Czy przycisk jest w stanie ładowania
 * @param {boolean} props.disabled - Czy przycisk jest wyłączony
 * @param {React.ReactNode} props.icon - Ikona do wyświetlenia przed tekstem
 * @param {React.ReactNode} props.children - Zawartość przycisku
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {string} props.type - Typ przycisku (button, submit, reset)
 * @param {Function} props.onClick - Funkcja wywoływana po kliknięciu
 * @returns {JSX.Element} - Komponent przycisku
 */
function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  children,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  // Klasy dla różnych wariantów
  const variantClasses = {
    primary: 'bg-[#35530A] hover:bg-[#2A4208] text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'bg-white hover:bg-gray-50 text-[#35530A] border border-[#35530A]',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    text: 'bg-transparent hover:bg-gray-100 text-[#35530A]'
  };
  
  // Klasy dla różnych rozmiarów
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Bazowe klasy
  const baseClasses = 'rounded-md font-medium transition-all duration-200 flex items-center justify-center';
  
  // Klasy dla stanu wyłączenia i ładowania
  const stateClasses = (disabled || isLoading) 
    ? 'opacity-70 cursor-not-allowed' 
    : 'cursor-pointer';
  
  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${stateClasses}
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {children}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
