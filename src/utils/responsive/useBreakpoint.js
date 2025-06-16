import { useEffect, useState } from "react";

/**
 * Hook do wykrywania aktualnego breakpointa (mobile/tablet/laptop/desktop)
 * Przykład użycia:
 *   const { breakpoint, isMobile, isTablet } = useBreakpoint();
 *   if (isMobile) ...
 */
const breakpoints = {
  mobile: 0,
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
};

export function getBreakpoint(width) {
  if (width < breakpoints.tablet) return "mobile";
  if (width < breakpoints.laptop) return "tablet";
  if (width < breakpoints.desktop) return "laptop";
  return "desktop";
}

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() =>
    typeof window !== "undefined" ? getBreakpoint(window.innerWidth) : "desktop"
  );
  
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 800
  }));

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pomocnicze właściwości dla łatwiejszego użycia
  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";
  const isLaptop = breakpoint === "laptop";
  const isDesktop = breakpoint === "desktop";
  const isMobileOrTablet = isMobile || isTablet;
  const isLaptopOrDesktop = isLaptop || isDesktop;

  return {
    breakpoint,
    dimensions,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isMobileOrTablet,
    isLaptopOrDesktop
  };
};

export default useBreakpoint;
