import React from 'react';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

/**
 * Responsywny komponent Flex, który dostosowuje swoje właściwości w zależności od rozmiaru ekranu
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {string} props.direction - Kierunek flex (row, column, row-reverse, column-reverse)
 * @param {string} props.mdDirection - Kierunek flex na średnich ekranach
 * @param {string} props.smDirection - Kierunek flex na małych ekranach
 * @param {string} props.justify - Justification (start, end, center, between, around, evenly)
 * @param {string} props.mdJustify - Justification na średnich ekranach
 * @param {string} props.smJustify - Justification na małych ekranach
 * @param {string} props.align - Alignment (start, end, center, baseline, stretch)
 * @param {string} props.mdAlign - Alignment na średnich ekranach
 * @param {string} props.smAlign - Alignment na małych ekranach
 * @param {string} props.wrap - Wrap (wrap, nowrap, wrap-reverse)
 * @param {string} props.mdWrap - Wrap na średnich ekranach
 * @param {string} props.smWrap - Wrap na małych ekranach
 * @param {number} props.gap - Odstęp między elementami (w jednostkach Tailwind)
 * @param {number} props.mdGap - Odstęp między elementami na średnich ekranach
 * @param {number} props.smGap - Odstęp między elementami na małych ekranach
 * @returns {JSX.Element} Komponent Flex
 */
const Flex = ({ 
  children, 
  className = '', 
  direction = 'row', 
  mdDirection, 
  smDirection,
  justify = 'start',
  mdJustify,
  smJustify,
  align = 'start',
  mdAlign,
  smAlign,
  wrap = 'nowrap',
  mdWrap,
  smWrap,
  gap = 4,
  mdGap,
  smGap,
  ...rest 
}) => {
  const { isMobile, isTablet } = useResponsiveContext();
  
  // Określenie kierunku flex w zależności od rozmiaru ekranu
  const getDirectionClass = () => {
    if (isMobile && smDirection) return `flex-${smDirection}`;
    if (isTablet && mdDirection) return `flex-${mdDirection}`;
    return `flex-${direction}`;
  };
  
  // Określenie justification w zależności od rozmiaru ekranu
  const getJustifyClass = () => {
    const justifyValue = isMobile && smJustify 
      ? smJustify 
      : isTablet && mdJustify 
        ? mdJustify 
        : justify;
    
    return `justify-${justifyValue}`;
  };
  
  // Określenie alignment w zależności od rozmiaru ekranu
  const getAlignClass = () => {
    const alignValue = isMobile && smAlign 
      ? smAlign 
      : isTablet && mdAlign 
        ? mdAlign 
        : align;
    
    return `items-${alignValue}`;
  };
  
  // Określenie wrap w zależności od rozmiaru ekranu
  const getWrapClass = () => {
    const wrapValue = isMobile && smWrap 
      ? smWrap 
      : isTablet && mdWrap 
        ? mdWrap 
        : wrap;
    
    return `flex-${wrapValue}`;
  };
  
  // Określenie gap w zależności od rozmiaru ekranu
  const getGapClass = () => {
    const gapValue = isMobile && smGap !== undefined 
      ? smGap 
      : isTablet && mdGap !== undefined 
        ? mdGap 
        : gap;
    
    return `gap-${gapValue}`;
  };
  
  // Określenie klas dla flex
  const flexClasses = `
    flex
    ${getDirectionClass()}
    ${getJustifyClass()}
    ${getAlignClass()}
    ${getWrapClass()}
    ${getGapClass()}
    ${className}
  `;

  return (
    <div className={flexClasses.trim()} {...rest}>
      {children}
    </div>
  );
};

/**
 * Komponent elementu Flex
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {number|string} props.grow - Flex grow (0, 1, ...)
 * @param {number|string} props.shrink - Flex shrink (0, 1, ...)
 * @param {string} props.basis - Flex basis (auto, 0, 1/2, 1/3, 2/3, 1/4, 2/4, 3/4, 1/5, ...)
 * @param {number|string} props.order - Flex order (0, 1, 2, ...)
 * @returns {JSX.Element} Komponent elementu Flex
 */
export const FlexItem = ({ 
  children, 
  className = '', 
  grow, 
  shrink, 
  basis,
  order,
  ...rest 
}) => {
  // Określenie klas dla elementu flex
  const itemClasses = `
    ${grow !== undefined ? `flex-grow-${grow}` : ''}
    ${shrink !== undefined ? `flex-shrink-${shrink}` : ''}
    ${basis ? `flex-basis-${basis}` : ''}
    ${order !== undefined ? `order-${order}` : ''}
    ${className}
  `;

  return (
    <div className={itemClasses.trim()} {...rest}>
      {children}
    </div>
  );
};

export default Flex;
