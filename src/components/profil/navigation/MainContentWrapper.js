import React, { createContext, useContext, useState } from 'react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';

// Context do zarządzania stanem sidebara
const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Komponent do owijania głównej treści
export const MainContentWrapper = ({ children }) => {
  const breakpoint = useBreakpoint();
  const { isExpanded } = useSidebar();
  
  // Określamy, czy jesteśmy na urządzeniu mobilnym lub tablecie
  const isMobileOrTablet = breakpoint === 'mobile' || breakpoint === 'tablet';
  
  // Jeśli nie jesteśmy na mobile/tablet, nie stosujemy marginesu
  if (!isMobileOrTablet) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};