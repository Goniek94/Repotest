import React from 'react';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

/**
 * Responsywny komponent Text, który dostosowuje swoje właściwości w zależności od rozmiaru ekranu
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {string} props.className - Dodatkowe klasy CSS
 * @param {string} props.variant - Wariant tekstu (h1, h2, h3, h4, h5, h6, body1, body2, caption, button)
 * @param {string} props.color - Kolor tekstu (primary, secondary, white, black, gray, success, error, warning, info)
 * @param {string} props.align - Wyrównanie tekstu (left, center, right, justify)
 * @param {string} props.weight - Waga czcionki (thin, extralight, light, normal, medium, semibold, bold, extrabold, black)
 * @param {string} props.transform - Transformacja tekstu (uppercase, lowercase, capitalize, normal-case)
 * @param {string} props.decoration - Dekoracja tekstu (underline, line-through, no-underline)
 * @param {string} props.as - Element HTML, który ma być użyty (h1, h2, h3, h4, h5, h6, p, span, div)
 * @param {boolean} props.truncate - Czy tekst ma być obcięty, jeśli jest za długi
 * @param {number} props.lines - Liczba linii, po których tekst ma być obcięty
 * @returns {JSX.Element} Komponent Text
 */
const Text = ({ 
  children, 
  className = '', 
  variant = 'body1', 
  color = 'black',
  align = 'left',
  weight,
  transform,
  decoration,
  as,
  truncate = false,
  lines,
  ...rest 
}) => {
  const { isMobile, isTablet } = useResponsiveContext();
  
  // Określenie rozmiaru tekstu w zależności od wariantu i rozmiaru ekranu
  const getFontSizeClass = () => {
    if (variant === 'h1') return isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl';
    if (variant === 'h2') return isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl';
    if (variant === 'h3') return isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl';
    if (variant === 'h4') return isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-xl';
    if (variant === 'h5') return isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg';
    if (variant === 'h6') return isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-base';
    if (variant === 'body1') return isMobile ? 'text-sm' : 'text-base';
    if (variant === 'body2') return isMobile ? 'text-xs' : 'text-sm';
    if (variant === 'caption') return 'text-xs';
    if (variant === 'button') return isMobile ? 'text-xs' : 'text-sm';
    return 'text-base';
  };
  
  // Określenie wagi czcionki w zależności od wariantu i właściwości weight
  const getFontWeightClass = () => {
    if (weight) {
      if (weight === 'thin') return 'font-thin';
      if (weight === 'extralight') return 'font-extralight';
      if (weight === 'light') return 'font-light';
      if (weight === 'normal') return 'font-normal';
      if (weight === 'medium') return 'font-medium';
      if (weight === 'semibold') return 'font-semibold';
      if (weight === 'bold') return 'font-bold';
      if (weight === 'extrabold') return 'font-extrabold';
      if (weight === 'black') return 'font-black';
    }
    
    if (variant.startsWith('h')) return 'font-bold';
    if (variant === 'button') return 'font-medium';
    return 'font-normal';
  };
  
  // Określenie koloru tekstu
  const getColorClass = () => {
    if (color === 'primary') return 'text-[#35530A]';
    if (color === 'secondary') return 'text-[#6c757d]';
    if (color === 'white') return 'text-white';
    if (color === 'black') return 'text-black';
    if (color === 'gray') return 'text-gray-500';
    if (color === 'success') return 'text-green-500';
    if (color === 'error') return 'text-red-500';
    if (color === 'warning') return 'text-yellow-500';
    if (color === 'info') return 'text-blue-500';
    return `text-${color}`;
  };
  
  // Określenie wyrównania tekstu
  const getAlignClass = () => {
    if (align === 'left') return 'text-left';
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    if (align === 'justify') return 'text-justify';
    return 'text-left';
  };
  
  // Określenie transformacji tekstu
  const getTransformClass = () => {
    if (transform === 'uppercase') return 'uppercase';
    if (transform === 'lowercase') return 'lowercase';
    if (transform === 'capitalize') return 'capitalize';
    if (transform === 'normal-case') return 'normal-case';
    return '';
  };
  
  // Określenie dekoracji tekstu
  const getDecorationClass = () => {
    if (decoration === 'underline') return 'underline';
    if (decoration === 'line-through') return 'line-through';
    if (decoration === 'no-underline') return 'no-underline';
    return '';
  };
  
  // Określenie obcięcia tekstu
  const getTruncateClass = () => {
    if (truncate) return 'truncate';
    if (lines) return `line-clamp-${lines}`;
    return '';
  };
  
  // Określenie klas dla tekstu
  const textClasses = `
    ${getFontSizeClass()}
    ${getFontWeightClass()}
    ${getColorClass()}
    ${getAlignClass()}
    ${getTransformClass()}
    ${getDecorationClass()}
    ${getTruncateClass()}
    ${className}
  `;
  
  // Określenie elementu HTML
  const Component = as || (
    variant === 'h1' ? 'h1' :
    variant === 'h2' ? 'h2' :
    variant === 'h3' ? 'h3' :
    variant === 'h4' ? 'h4' :
    variant === 'h5' ? 'h5' :
    variant === 'h6' ? 'h6' :
    variant === 'button' ? 'span' :
    'p'
  );

  return (
    <Component className={textClasses.trim()} {...rest}>
      {children}
    </Component>
  );
};

export default Text;
