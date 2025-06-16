import React from 'react';
import { ChevronLeft, ChevronRight, Sliders } from 'lucide-react';
import useBreakpoint from '../../utils/responsive/useBreakpoint';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';

const MobileSidebar = ({ children }) => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const breakpoint = useBreakpoint();
  const { isAdmin } = useAuth();

  const isMobileOrTablet = breakpoint === 'mobile' || breakpoint === 'tablet';
  if (!isMobileOrTablet) return null;

  const sidebarWidth = 'w-16';

  return (
    <>
      {!isExpanded && (
        <button
          onClick={toggleSidebar}
          className="absolute top-0 left-0 bg-[#35530A] text-white p-3 rounded-r-lg shadow-lg z-50 hover:bg-[#4a6b2a]"
          aria-label="Otw\u00f3rz menu"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <aside
        className={`absolute inset-y-0 left-0 ${sidebarWidth} bg-[#35530A] text-white z-50 flex flex-col transform transition-transform duration-300 ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute right-0 top-0 w-6 h-6 flex items-center justify-center hover:bg-[#4a6b2a]"
          aria-label="Zamknij menu"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="mt-8 flex flex-col items-center space-y-1 px-1">
          {isAdmin && isAdmin() && (
            <a
              href="/admin"
              className="flex items-center justify-center gap-3 px-3 py-2 hover:bg-[#4a6b2a]"
            >
              <Sliders className="w-5 h-5" />
            </a>
          )}
          {children}
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
