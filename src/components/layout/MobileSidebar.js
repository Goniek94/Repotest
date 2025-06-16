import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useBreakpoint from '../../utils/responsive/useBreakpoint';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import ProfileNavigation from '../profil/navigation/ProfileNavigation';

const MobileSidebar = ({ children }) => {
  const { isExpanded, setIsExpanded } = useSidebar();
  const breakpoint = useBreakpoint();
  const { isAdmin } = useAuth();

  const isMobileOrTablet = breakpoint === 'mobile' || breakpoint === 'tablet';
  if (!isMobileOrTablet) return null;

  const toggle = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#35530A] text-white z-50 flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-48' : 'w-12'
      }`}
    >
      <button
        onClick={toggle}
        className="flex items-center justify-center w-full h-12 hover:bg-[#4a6b2a]"
        aria-label="Toggle menu"
      >
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <ProfileNavigation />
      {isAdmin && isAdmin() && (
        <a
          href="/admin"
          className="flex items-center gap-3 px-3 py-2 hover:bg-[#4a6b2a]"
        >
          <span className="text-sm">Admin</span>
        </a>
      )}
      {children}
    </div>
  );
};

export default MobileSidebar;
