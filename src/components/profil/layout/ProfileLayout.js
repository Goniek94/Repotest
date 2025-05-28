import React from 'react';
import { Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white">
      <main className="space-y-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;
