import React from 'react';
import { Outlet } from 'react-router-dom';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';
import MobileSidebar from '../../layout/MobileSidebar';
import MainContentWrapper from '../../layout/MainContentWrapper';
import ProfileNavigation from '../navigation/ProfileNavigation';
import { SidebarProvider } from '../../../contexts/SidebarContext';

const ProfileLayout = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';

  return (
    <SidebarProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white relative">
        <MainContentWrapper>
          {isMobile ? (
            <MobileSidebar>
              <ProfileNavigation />
            </MobileSidebar>
          ) : (
            <ProfileNavigation />
          )}
          <main className="space-y-6 mt-6">
            <Outlet />
          </main>
        </MainContentWrapper>
      </div>
    </SidebarProvider>
  );
};

export default ProfileLayout;