// src/components/layout/ProfileNavigation.js
import React from 'react';

const ProfileNavigation = () => {
  return (
    <div className="w-full md:mt-8">
      <a href="/profil" className="block py-3 my-2 px-1 text-center hover:bg-[#4a6b2a] rounded-lg transition-all duration-200 shadow-sm">
        👤
      </a>
      <a href="/ustawienia" className="block py-3 my-2 px-1 text-center hover:bg-[#4a6b2a] rounded-lg transition-all duration-200 shadow-sm">
        ⚙️
      </a>
    </div>
  );
};

export default ProfileNavigation;