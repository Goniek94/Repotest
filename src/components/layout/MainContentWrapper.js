import React from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import useBreakpoint from '../../utils/responsive/useBreakpoint';

const MainContentWrapper = ({ children }) => {
  const { isExpanded } = useSidebar();
  const breakpoint = useBreakpoint();
  const isMobileOrTablet = breakpoint === 'mobile' || breakpoint === 'tablet';
  const marginClass = isMobileOrTablet ? (isExpanded ? 'ml-16' : 'ml-0') : '';

  return (
    <div className={`transition-[margin] duration-300 ${marginClass}`}>
      {children}
    </div>
  );
};

export default MainContentWrapper;
