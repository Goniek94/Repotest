import { useState, useEffect } from 'react';

/**
 * Hook dostarczający informacje o rozmiarze ekranu i breakpointach
 * @returns {Object} Obiekt zawierający informacje o rozmiarze ekranu
 */
const useResponsive = () => {
  // Breakpointy zgodne z Tailwind CSS
  const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };

  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    breakpoint: 'xs'
  });

  useEffect(() => {
    // Funkcja aktualizująca stan na podstawie rozmiaru okna
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Określenie aktualnego breakpointu
      let currentBreakpoint = 'xs';
      if (width >= breakpoints['2xl']) currentBreakpoint = '2xl';
      else if (width >= breakpoints.xl) currentBreakpoint = 'xl';
      else if (width >= breakpoints.lg) currentBreakpoint = 'lg';
      else if (width >= breakpoints.md) currentBreakpoint = 'md';
      else if (width >= breakpoints.sm) currentBreakpoint = 'sm';
      
      setScreenSize({
        width,
        height,
        isMobile: width < breakpoints.sm,
        isTablet: width >= breakpoints.sm && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
        isLargeDesktop: width >= breakpoints.xl,
        breakpoint: currentBreakpoint
      });
    };

    // Inicjalizacja stanu
    updateScreenSize();

    // Nasłuchiwanie na zmiany rozmiaru okna
    window.addEventListener('resize', updateScreenSize);

    // Czyszczenie nasłuchiwania przy odmontowaniu komponentu
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  // Funkcje pomocnicze do sprawdzania breakpointów
  const isBreakpoint = (breakpoint) => screenSize.breakpoint === breakpoint;
  const isUpTo = (breakpoint) => screenSize.width < breakpoints[breakpoint];
  const isFrom = (breakpoint) => screenSize.width >= breakpoints[breakpoint];
  const isBetween = (minBreakpoint, maxBreakpoint) => 
    screenSize.width >= breakpoints[minBreakpoint] && 
    screenSize.width < breakpoints[maxBreakpoint];

  return {
    ...screenSize,
    breakpoints,
    isBreakpoint,
    isUpTo,
    isFrom,
    isBetween
  };
};

export default useResponsive;
