import React from 'react';

/**
 * Responsywny stos elementów (układ pionowy)
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość stosu
 * @param {number|Object} props.gap - Odstęp między elementami (1-12)
 *   Może być liczbą (np. 4) lub obiektem (np. { default: 2, md: 4, lg: 6 })
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
const ResponsiveStack = ({ 
  children, 
  gap = 4,
  className = "" 
}) => {
  // Obsługa responsywnego odstępu
  const getGapClass = () => {
    if (typeof gap === 'number') {
      return `gap-${gap}`;
    }
    
    let classes = `gap-${gap.default || 4}`;
    if (gap.sm) classes += ` sm:gap-${gap.sm}`;
    if (gap.md) classes += ` md:gap-${gap.md}`;
    if (gap.lg) classes += ` lg:gap-${gap.lg}`;
    
    return classes;
  };
  
  return (
    <div className={`flex flex-col ${getGapClass()} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveStack;
