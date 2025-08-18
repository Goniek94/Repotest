import React from 'react';
import { ChevronDown, Sliders, X } from 'lucide-react';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';

const MobileSidebar = ({ children }) => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const { isMobile, isTablet } = useResponsiveContext();
  const { isAdmin } = useAuth();

  const isMobileOrTablet = isMobile || isTablet;
  if (!isMobileOrTablet) return null;

  const sidebarWidth = 'w-16';

  return (
    <>
      {!isExpanded && (
        <button
          onClick={toggleSidebar}
          className="fixed top-[64px] left-0 bg-[#35530A] text-white p-2.5 rounded-r-lg shadow-lg z-50 hover:bg-[#4a6b2a] flex items-center justify-center"
          aria-label="Otwórz menu"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      <aside
        className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] ${sidebarWidth} bg-[#35530A] text-white z-50 flex flex-col transform transition-transform duration-300 ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute right-0 top-0 w-full h-12 flex items-center justify-center hover:bg-[#4a6b2a] border-b border-[#4a6b2a]"
          aria-label="Zamknij menu"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="mt-16 flex flex-col items-center space-y-4 px-2">
          {isAdmin && isAdmin() && (
            <a
              href="/admin"
              className="flex items-center justify-center gap-3 px-3 py-3 hover:bg-[#4a6b2a] rounded-md"
            >
              <Sliders className="w-6 h-6" />
            </a>
          )}
          {children}
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
