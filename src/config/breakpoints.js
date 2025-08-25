// Breakpoints configuration for responsive design
// Synchronized with Tailwind config and useResponsive hook

export const SCREENS = {
  xs: 360,    // Small phones (updated from 375px)
  sm: 640,    // Large phones
  md: 768,    // Tablets (portrait)
  lg: 1024,   // Small laptops
  xl: 1280,   // Desktops
  '2xl': 1536 // Large monitors
};

// Utility functions for breakpoint calculations
export const getBreakpointValue = (breakpoint) => SCREENS[breakpoint];

export const isAboveBreakpoint = (width, breakpoint) => width >= SCREENS[breakpoint];

export const isBelowBreakpoint = (width, breakpoint) => width < SCREENS[breakpoint];

export const getCurrentBreakpoint = (width) => {
  if (width >= SCREENS['2xl']) return '2xl';
  if (width >= SCREENS.xl) return 'xl';
  if (width >= SCREENS.lg) return 'lg';
  if (width >= SCREENS.md) return 'md';
  if (width >= SCREENS.sm) return 'sm';
  return 'xs';
};

// Export for use in other files
export default SCREENS;
