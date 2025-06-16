import React from 'react';
import { ChevronLeft, ChevronRight, Sliders } from 'lucide-react';
import useBreakpoint from '../../utils/responsive/useBreakpoint';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import ProfileNavigation from '../profil/navigation/ProfileNavigation';

const MobileSidebar = ({ children }) => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const breakpoint = useBreakpoint();
  const { isAdmin } = useAuth();

  const isMobileOrTablet = breakpoint === 'mobile' || breakpoint === 'tablet';
  if (!isMobileOrTablet) return null;

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#35530A] text-white z-50 flex flex-col transition-all duration-300 overflow-hidden ${
        isExpanded ? 'w-48' : 'w-12'
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center hover:bg-[#4a6b2a]"
        aria-label="Toggle sidebar"
      >
        {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
      <div className="mt-14 flex flex-col space-y-1 px-1">
        <ProfileNavigation />
        {isAdmin && isAdmin() && (
          <a
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 hover:bg-[#4a6b2a]"
          >
            <Sliders className="w-5 h-5" />
            {isExpanded && <span className="text-sm">Admin</span>}
          </a>
        )}
        {children}
      </div>
    </aside>
  );
};

export default MobileSidebar;
