import React from 'react';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

/**
 * Responsywny kontener, który dostosowuje swoją szerokość i padding w zależności od rozmiaru ekranu
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {boolean} props.fluid - Czy kontener ma być pełnej szerokości
 * @param {boolean} props.noPadding - Czy kontener ma nie mieć paddingu
 * @returns {JSX.Element} Komponent kontenera
 */
const Container = ({ 
  children, 
  className = '', 
  fluid = false, 
  noPadding = false,
  ...rest 
}) => {
  const { isMobile, isTablet } = useResponsiveContext();
  
  // Określenie klas dla kontenera
  const containerClasses = `
    ${fluid ? 'w-full' : 'mx-auto max-w-7xl'}
    ${noPadding ? '' : isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-8'}
    ${className}
  `;

  return (
    <div className={containerClasses.trim()} {...rest}>
      {children}
    </div>
  );
};

export default Container;
