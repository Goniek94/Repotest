import React from 'react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';

const UserDashboard = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Panel użytkownika</h2>
      <p className="text-sm sm:text-base">To jest panel użytkownika. Tu był Twój dashboard.</p>
    </div>
  );
};

export default UserDashboard;
