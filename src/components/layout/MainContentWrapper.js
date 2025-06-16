import React from 'react';
import useBreakpoint from '../../utils/responsive/useBreakpoint';
import { useSidebar } from '../../contexts/SidebarContext';

const MainContentWrapper = ({ children }) => {
  const breakpoint = useBreakpoint();
  const { profileRef } = useSidebar();
  const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';

  return (
    <div ref={isMobile ? profileRef : null} className="relative">
      {children}
    </div>
  );
};

export default MainContentWrapper;
