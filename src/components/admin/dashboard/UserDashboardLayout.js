import React from 'react';

const UserDashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <main>{children}</main>
    </div>
  );
};

export default UserDashboardLayout;