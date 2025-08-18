import React, { createContext, useContext, ReactNode } from 'react';
import useResponsive from '../hooks/useResponsive';

const ResponsiveContext = createContext<ReturnType<typeof useResponsive> | undefined>(undefined);

export const ResponsiveProvider = ({ children }: { children: ReactNode }) => {
  const value = useResponsive();
  return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
};

export const useResponsiveContext = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsiveContext must be used within a ResponsiveProvider');
  }
  return context;
};

export default ResponsiveContext;
