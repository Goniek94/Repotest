import React, { createContext, useContext } from 'react';
import useResponsive from '../hooks/useResponsive';

// Tworzenie kontekstu
const ResponsiveContext = createContext(null);

/**
 * Provider kontekstu responsywności
 * @param {Object} props - Właściwości komponentu
 * @param {React.ReactNode} props.children - Komponenty potomne
 * @returns {JSX.Element} Provider kontekstu
 */
export const ResponsiveProvider = ({ children }) => {
  // Użycie hooka useResponsive do pobrania informacji o rozmiarze ekranu
  const responsiveData = useResponsive();

  return (
    <ResponsiveContext.Provider value={responsiveData}>
      {children}
    </ResponsiveContext.Provider>
  );
};

/**
 * Hook do używania kontekstu responsywności
 * @returns {Object} Obiekt zawierający informacje o rozmiarze ekranu
 */
export const useResponsiveContext = () => {
  const context = useContext(ResponsiveContext);
  if (context === null) {
    throw new Error('useResponsiveContext must be used within a ResponsiveProvider');
  }
  return context;
};

export default ResponsiveContext;
