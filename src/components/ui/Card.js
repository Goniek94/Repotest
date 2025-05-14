import React from 'react';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

/**
 * Responsywny komponent Card, który dostosowuje swoje właściwości w zależności od rozmiaru ekranu
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {boolean} props.hoverable - Czy karta ma reagować na najechanie myszą
 * @param {boolean} props.bordered - Czy karta ma mieć obramowanie
 * @param {string} props.variant - Wariant karty (default, primary, secondary, success, error, warning, info)
 * @returns {JSX.Element} Komponent Card
 */
const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  bordered = true,
  variant = 'default',
  ...rest 
}) => {
  const { isMobile } = useResponsiveContext();
  
  // Określenie paddingu w zależności od rozmiaru ekranu
  const getPaddingClass = () => {
    return isMobile ? 'p-3' : 'p-4';
  };
  
  // Określenie wyglądu karty w zależności od wariantu
  const getVariantClass = () => {
    if (variant === 'primary') {
      return 'bg-[#35530A]/10 border-[#35530A]';
    }
    if (variant === 'secondary') {
      return 'bg-[#6c757d]/10 border-[#6c757d]';
    }
    if (variant === 'success') {
      return 'bg-green-500/10 border-green-500';
    }
    if (variant === 'error') {
      return 'bg-red-500/10 border-red-500';
    }
    if (variant === 'warning') {
      return 'bg-yellow-500/10 border-yellow-500';
    }
    if (variant === 'info') {
      return 'bg-blue-500/10 border-blue-500';
    }
    return 'bg-white border-gray-200';
  };
  
  // Określenie klas dla karty
  const cardClasses = `
    ${getPaddingClass()}
    ${getVariantClass()}
    ${bordered ? 'border' : ''}
    ${hoverable ? 'hover:shadow-lg transition-shadow duration-200' : ''}
    rounded-[2px]
    shadow-sm
    ${className}
  `;

  return (
    <div className={cardClasses.trim()} {...rest}>
      {children}
    </div>
  );
};

/**
 * Komponent nagłówka karty
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element} Komponent nagłówka karty
 */
export const CardHeader = ({ 
  children, 
  className = '',
  ...rest 
}) => {
  const { isMobile } = useResponsiveContext();
  
  // Określenie paddingu w zależności od rozmiaru ekranu
  const getPaddingClass = () => {
    return isMobile ? 'pb-2 mb-2' : 'pb-3 mb-3';
  };
  
  // Określenie klas dla nagłówka karty
  const headerClasses = `
    ${getPaddingClass()}
    border-b
    border-gray-200
    ${className}
  `;

  return (
    <div className={headerClasses.trim()} {...rest}>
      {children}
    </div>
  );
};

/**
 * Komponent treści karty
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element} Komponent treści karty
 */
export const CardBody = ({ 
  children, 
  className = '',
  ...rest 
}) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

/**
 * Komponent stopki karty
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element} Komponent stopki karty
 */
export const CardFooter = ({ 
  children, 
  className = '',
  ...rest 
}) => {
  const { isMobile } = useResponsiveContext();
  
  // Określenie paddingu w zależności od rozmiaru ekranu
  const getPaddingClass = () => {
    return isMobile ? 'pt-2 mt-2' : 'pt-3 mt-3';
  };
  
  // Określenie klas dla stopki karty
  const footerClasses = `
    ${getPaddingClass()}
    border-t
    border-gray-200
    ${className}
  `;

  return (
    <div className={footerClasses.trim()} {...rest}>
      {children}
    </div>
  );
};

export default Card;
