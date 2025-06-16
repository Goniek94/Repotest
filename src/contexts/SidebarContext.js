import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const [bounds, setBounds] = useState(null);

  const measure = useCallback(() => {
    if (profileRef.current) {
      setBounds(profileRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [measure]);

  const toggle = useCallback(() => {
    measure();
    setIsOpen(prev => !prev);
  }, [measure]);

  const close = useCallback(() => setIsOpen(false), []);

  const value = React.useMemo(
    () => ({ isOpen, toggle, close, profileRef, bounds }),
    [isOpen, toggle, close, bounds]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext;
