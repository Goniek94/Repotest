import React from 'react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';

const Stats = () => {
const breakpoint = useBreakpoint();
const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';

return (
  <div className="bg-white p-4 sm:p-6 rounded shadow-sm">
    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Statystyki</h2>
    <p className="text-sm sm:text-base">Tu były statystyki użytkownika.</p>
  </div>
);
};

export default Stats;
