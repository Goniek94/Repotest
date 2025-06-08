import React from 'react';
import { Outlet } from 'react-router-dom';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';
import MobileSidebar from '../navigation/MobileSidebar';
import ProfileNavigation from '../navigation/ProfileNavigation';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';

const ProfileLayout = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';
  const { unreadCount = { messages: 0, alerts: 0 } } = useNotifications() || {};
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white relative">
      <MobileSidebar user={user} />

      <main className="space-y-6 mt-6 ml-12">
        {!isMobile && <ProfileNavigation notifications={unreadCount} user={user} />}
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;