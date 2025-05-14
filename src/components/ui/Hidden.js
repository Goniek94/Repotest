import React from 'react';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

/**
 * Komponent, który ukrywa lub pokazuje zawartość w zależności od rozmiaru ekranu
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @param {boolean} props.xs - Czy ukryć na ekranach xs (< 640px)
 * @param {boolean} props.sm - Czy ukryć na ekranach sm (>= 640px)
 * @param {boolean} props.md - Czy ukryć na ekranach md (>= 768px)
 * @param {boolean} props.lg - Czy ukryć na ekranach lg (>= 1024px)
 * @param {boolean} props.xl - Czy ukryć na ekranach xl (>= 1280px)
 * @param {boolean} props.xxl - Czy ukryć na ekranach 2xl (>= 1536px)
 * @param {boolean} props.mobile - Czy ukryć na urządzeniach mobilnych
 * @param {boolean} props.tablet - Czy ukryć na tabletach
 * @param {boolean} props.desktop - Czy ukryć na desktopach
 * @param {boolean} props.largeDesktop - Czy ukryć na dużych desktopach
 * @param {boolean} props.only - Czy pokazać tylko na określonym rozmiarze ekranu
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element|null} Komponent lub null, jeśli ma być ukryty
 */
const Hidden = ({ 
  children, 
  xs, 
  sm, 
  md, 
  lg, 
  xl, 
  xxl,
  mobile,
  tablet,
  desktop,
  largeDesktop,
  only,
  className = '',
  ...rest 
}) => {
  const { 
    breakpoint, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isLargeDesktop 
  } = useResponsiveContext();
  
  // Sprawdzenie, czy komponent ma być ukryty na podstawie breakpointów
  const isHidden = () => {
    // Jeśli only jest ustawione, pokazujemy tylko na określonym breakpoincie
    if (only) {
      if (only === 'xs') return breakpoint !== 'xs';
      if (only === 'sm') return breakpoint !== 'sm';
      if (only === 'md') return breakpoint !== 'md';
      if (only === 'lg') return breakpoint !== 'lg';
      if (only === 'xl') return breakpoint !== 'xl';
      if (only === '2xl') return breakpoint !== '2xl';
      if (only === 'mobile') return !isMobile;
      if (only === 'tablet') return !isTablet;
      if (only === 'desktop') return !isDesktop;
      if (only === 'largeDesktop') return !isLargeDesktop;
    }
    
    // Sprawdzenie, czy komponent ma być ukryty na podstawie breakpointów
    if (xs && breakpoint === 'xs') return true;
    if (sm && breakpoint === 'sm') return true;
    if (md && breakpoint === 'md') return true;
    if (lg && breakpoint === 'lg') return true;
    if (xl && breakpoint === 'xl') return true;
    if (xxl && breakpoint === '2xl') return true;
    
    // Sprawdzenie, czy komponent ma być ukryty na podstawie typu urządzenia
    if (mobile && isMobile) return true;
    if (tablet && isTablet) return true;
    if (desktop && isDesktop) return true;
    if (largeDesktop && isLargeDesktop) return true;
    
    return false;
  };
  
  // Jeśli komponent ma być ukryty, zwracamy null
  if (isHidden()) {
    return null;
  }
  
  // W przeciwnym razie zwracamy komponent
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

export default Hidden;
