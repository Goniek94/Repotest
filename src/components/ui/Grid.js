import React from 'react';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

/**
 * Responsywny komponent siatki, który dostosowuje liczbę kolumn w zależności od rozmiaru ekranu
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {number} props.cols - Liczba kolumn na dużych ekranach
 * @param {number} props.mdCols - Liczba kolumn na średnich ekranach
 * @param {number} props.smCols - Liczba kolumn na małych ekranach
 * @param {number} props.gap - Odstęp między elementami (w jednostkach Tailwind)
 * @returns {JSX.Element} Komponent siatki
 */
const Grid = ({ 
  children, 
  className = '', 
  cols = 3, 
  mdCols, 
  smCols, 
  gap = 4,
  ...rest 
}) => {
  const { isMobile, isTablet } = useResponsiveContext();
  
  // Określenie liczby kolumn w zależności od rozmiaru ekranu
  const getColsClass = () => {
    if (isMobile) return `grid-cols-${smCols || 1}`;
    if (isTablet) return `grid-cols-${mdCols || 2}`;
    return `grid-cols-${cols}`;
  };

  // Określenie klas dla siatki
  const gridClasses = `
    grid
    ${getColsClass()}
    gap-${gap}
    ${className}
  `;

  return (
    <div className={gridClasses.trim()} {...rest}>
      {children}
    </div>
  );
};

/**
 * Komponent elementu siatki
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {number} props.span - Liczba kolumn, które ma zajmować element
 * @param {number} props.mdSpan - Liczba kolumn, które ma zajmować element na średnich ekranach
 * @param {number} props.smSpan - Liczba kolumn, które ma zajmować element na małych ekranach
 * @returns {JSX.Element} Komponent elementu siatki
 */
export const GridItem = ({ 
  children, 
  className = '', 
  span, 
  mdSpan, 
  smSpan,
  ...rest 
}) => {
  const { isMobile, isTablet } = useResponsiveContext();
  
  // Określenie liczby kolumn, które ma zajmować element w zależności od rozmiaru ekranu
  const getSpanClass = () => {
    if (isMobile && smSpan) return `col-span-${smSpan}`;
    if (isTablet && mdSpan) return `col-span-${mdSpan}`;
    if (span) return `col-span-${span}`;
    return '';
  };

  // Określenie klas dla elementu siatki
  const itemClasses = `
    ${getSpanClass()}
    ${className}
  `;

  return (
    <div className={itemClasses.trim()} {...rest}>
      {children}
    </div>
  );
};

export default Grid;
