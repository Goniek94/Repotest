import React from 'react';

/**
 * Responsywna siatka, która automatycznie dostosowuje liczbę kolumn do różnych rozmiarów ekranu
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość siatki
 * @param {Object|number} props.cols - Liczba kolumn dla różnych breakpointów
 *   Może być liczbą (np. 3) lub obiektem (np. { default: 1, sm: 2, md: 3, lg: 4 })
 * @param {number} props.gap - Odstęp między elementami siatki (1-12)
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
const ResponsiveGrid = ({ 
  children, 
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = "" 
}) => {
  // Obsługa przypadku, gdy cols jest liczbą
  const colsConfig = typeof cols === 'number' 
    ? { default: 1, sm: Math.min(cols, 2), md: Math.min(cols, 3), lg: cols }
    : cols;
  
  // Tworzenie klas dla kolumn
  const colsClass = `
    grid-cols-${colsConfig.default || 1} 
    ${colsConfig.sm ? `sm:grid-cols-${colsConfig.sm}` : ''} 
    ${colsConfig.md ? `md:grid-cols-${colsConfig.md}` : ''} 
    ${colsConfig.lg ? `lg:grid-cols-${colsConfig.lg}` : ''}
  `;
  
  return (
    <div className={`grid ${colsClass} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;
