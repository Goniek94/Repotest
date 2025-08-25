import { useState, useEffect } from 'react';
import { SCREENS } from '../config/breakpoints';

const useResponsive = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = size;

  const isXs = width >= SCREENS.xs && width < SCREENS.sm;
  const isSm = width >= SCREENS.sm && width < SCREENS.md;
  const isMd = width >= SCREENS.md && width < SCREENS.lg;
  const isLg = width >= SCREENS.lg && width < SCREENS.xl;
  const isXl = width >= SCREENS.xl && width < SCREENS['2xl'];
  const is2Xl = width >= SCREENS['2xl'];

  const isMobile = width < SCREENS.md;
  const isTablet = width >= SCREENS.md && width < SCREENS.lg;
  const isDesktop = width >= SCREENS.lg;

  return {
    width,
    height,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile,
    isTablet,
    isDesktop,
  };
};

export default useResponsive;
