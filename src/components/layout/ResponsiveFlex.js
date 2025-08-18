import React from 'react';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

/**
 * Responsywny kontener flex, który automatycznie dostosowuje układ do różnych rozmiarów ekranu
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość kontenera
 * @param {string|Object} props.direction - Kierunek układu (row, col, row-reverse, col-reverse)
 *   Może być stringiem (np. "row") lub obiektem (np. { default: "col", md: "row" })
 * @param {string} props.justify - Wyrównanie w osi głównej (start, end, center, between, around, evenly)
 * @param {string} props.align - Wyrównanie w osi poprzecznej (start, end, center, baseline, stretch)
 * @param {boolean} props.wrap - Czy elementy mają zawijać się do nowej linii
 * @param {number} props.gap - Odstęp między elementami (1-12)
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
const ResponsiveFlex = ({ 
  children, 
  direction = "row", 
  justify = "start", 
  align = "start",
  wrap = false,
  gap = 4,
  className = "" 
}) => {
  const {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
  } = useResponsiveContext();
  const breakpoint = is2Xl
    ? '2xl'
    : isXl
      ? 'xl'
      : isLg
        ? 'lg'
        : isMd
          ? 'md'
          : isSm
            ? 'sm'
            : 'xs';
  
  // Obsługa responsywnego kierunku
  const getDirectionClass = () => {
    if (typeof direction === 'string') {
      // Obsługa specjalnego przypadku "responsive"
      if (direction === 'responsive') {
        return 'flex-col md:flex-row';
      }
      return `flex-${direction}`;
    }
    
    // Obsługa obiektu z różnymi kierunkami dla różnych breakpointów
    const currentDirection = direction[breakpoint] || direction.default || 'row';
    let classes = `flex-${direction.default || 'row'}`;
    
    if (direction.sm) classes += ` sm:flex-${direction.sm}`;
    if (direction.md) classes += ` md:flex-${direction.md}`;
    if (direction.lg) classes += ` lg:flex-${direction.lg}`;
    
    return classes;
  };
  
  return (
    <div className={`
      flex 
      ${getDirectionClass()} 
      justify-${justify} 
      items-${align}
      ${wrap ? 'flex-wrap' : 'flex-nowrap'}
      gap-${gap}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default ResponsiveFlex;
