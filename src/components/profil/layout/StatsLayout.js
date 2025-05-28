import React from 'react';

const StatsLayout = ({ children }) => (
  <section className="bg-gray-50 p-4 rounded shadow-sm mb-4">
    <h3 className="font-semibold mb-2">Statystyki użytkownika</h3>
    {children}
  </section>
);

export default StatsLayout;
