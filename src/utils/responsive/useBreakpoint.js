import { useEffect, useState } from "react";

/**
 * Hook do wykrywania aktualnego breakpointa (mobile/tablet/desktop)
 * Przykład użycia:
 *   const bp = useBreakpoint();
 *   if (bp === 'mobile') ...
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

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};

export default useBreakpoint;
