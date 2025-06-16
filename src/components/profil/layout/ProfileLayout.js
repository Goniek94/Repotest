import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';
import MobileSidebar from '../../layout/MobileSidebar';
import MainContentWrapper from '../../layout/MainContentWrapper';
import ProfileNavigation from '../navigation/ProfileNavigation';
import { SidebarProvider } from '../../../contexts/SidebarContext';
import { ResponsiveContainer } from '../../layout';

/**
 * Układ strony profilu użytkownika
 * Automatycznie dostosowuje się do różnych rozmiarów ekranu
 * 
 * @returns {JSX.Element}
 */
const ProfileLayout = () => {
  const { isMobileOrTablet } = useBreakpoint();
  const [isPanelRaised, setIsPanelRaised] = useState(false);
  
  // Obsługa podnoszenia panelu
  const handleRaisePanel = () => {
    setIsPanelRaised(!isPanelRaised);
  };

  return (
    <SidebarProvider>
      <ResponsiveContainer className={`bg-white relative ${isPanelRaised ? 'raised-panel' : ''}`}>
        <MainContentWrapper>
          {isMobileOrTablet ? (
            <MobileSidebar>
              <ProfileNavigation handleRaisePanel={handleRaisePanel} isPanelRaised={isPanelRaised} />
            </MobileSidebar>
          ) : (
            <ProfileNavigation handleRaisePanel={handleRaisePanel} isPanelRaised={isPanelRaised} />
          )}
          <main className="space-y-6 mt-0">
            <Outlet />
          </main>
        </MainContentWrapper>
      </ResponsiveContainer>
    </SidebarProvider>
  );
};

export default ProfileLayout;
