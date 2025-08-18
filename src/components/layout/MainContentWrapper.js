import React from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

/**
 * Wrapper dla głównej zawartości strony
 * Automatycznie dostosowuje marginesy w zależności od stanu sidebara i rozmiaru ekranu
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Zawartość wrappera
 * @param {string} props.className - Dodatkowe klasy CSS
 * @returns {JSX.Element}
 */
const MainContentWrapper = ({ children, className = "" }) => {
  const { isExpanded } = useSidebar();
  const { isMobile, isTablet } = useResponsiveContext();
  const isMobileOrTablet = isMobile || isTablet;
  
  // Dynamiczne marginesy w zależności od stanu sidebara i rozmiaru ekranu
  const marginClass = isMobileOrTablet ? (isExpanded ? 'ml-10' : 'ml-3') : '';

  return (
    <div className={`
      transition-all 
      duration-300 
      ${marginClass} 
      mt-0
      ${className}
    `}>
      {children}
    </div>
  );
};

export default MainContentWrapper;
