import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useResponsiveContext } from '../../../contexts/ResponsiveContext';
import MobileSidebar from '../../layout/MobileSidebar';
import MainContentWrapper from '../../layout/MainContentWrapper';
import ProfileNavigation from '../navigation/ProfileNavigation';
import MobilePanelSidebar from '../navigation/MobilePanelSidebar';
import { SidebarProvider } from '../../../contexts/SidebarContext';
import { ResponsiveContainer } from '../../layout';

/**
 * Układ strony profilu użytkownika
 * Automatycznie dostosowuje się do różnych rozmiarów ekranu
 * 
 * @returns {JSX.Element}
 */
const ProfileLayout = () => {
  const { isMobile, isTablet } = useResponsiveContext();
  const isMobileOrTablet = isMobile || isTablet;
  const [isPanelRaised, setIsPanelRaised] = useState(false);
  const location = useLocation();
  
  // Określenie aktywnego elementu na podstawie ścieżki
  const getActiveItem = () => {
    const path = location.pathname;
    
    if (path === '/profil' || path === '/profil/dashboard') return 'panel';
    if (path.startsWith('/profil/messages')) return 'messages';
    if (path.startsWith('/profil/listings')) return 'listings';
    if (path.startsWith('/profil/notifications')) return 'notifications';
    if (path.startsWith('/profil/transactions')) return 'transactions';
    if (path.startsWith('/profil/contact')) return 'contact';
    if (path.startsWith('/profil/settings')) return 'settings';
    if (path.startsWith('/admin')) return 'admin';
    
    return 'panel'; // Domyślnie panel
  };
  
  // Obsługa podnoszenia panelu
  const handleRaisePanel = () => {
    setIsPanelRaised(!isPanelRaised);
  };

  return (
    <SidebarProvider>
      {/* Nawigacja przeniesiona na samą górę - poza ResponsiveContainer */}
      {isMobileOrTablet ? (
        <MobileSidebar>
          <ProfileNavigation activeTab={getActiveItem()} handleRaisePanel={handleRaisePanel} isPanelRaised={isPanelRaised} />
        </MobileSidebar>
      ) : (
        <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <ProfileNavigation activeTab={getActiveItem()} handleRaisePanel={handleRaisePanel} isPanelRaised={isPanelRaised} />
          </div>
        </div>
      )}
      
      <ResponsiveContainer className={`bg-white relative ${isPanelRaised ? 'raised-panel' : ''}`}>
        {/* Mobilny sidebar panelu użytkownika - widoczny tylko na mobile */}
        {isMobile && <MobilePanelSidebar activeItem={getActiveItem()} />}

        <MainContentWrapper className={isMobileOrTablet ? "ml-12 sm:ml-14 lg:ml-0" : ""}>
          <main className="space-y-6 mt-0 pl-[10%]">
            <div className="section">
              <Outlet />
            </div>
          </main>
        </MainContentWrapper>
      </ResponsiveContainer>
    </SidebarProvider>
  );
};

export default ProfileLayout;
