import React from 'react';
import UserNavigation from '../layout/UserNavigation';

/**
 * Layout profilu użytkownika z nawigacją górną.
 * Renderuje nawigację i główną zawartość (children) w kontenerze.
 */
const ProfileLayout = ({ children, title }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Nawigacja */}
      <UserNavigation />
      
      {/* Główna zawartość */}
      <main className="space-y-6">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;