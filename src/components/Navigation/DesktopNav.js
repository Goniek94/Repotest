import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DesktopNav = ({ user }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Helper function to determine if a route is active (matches exactly or starts with path)
  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav>
      <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8 font-bold uppercase text-base lg:text-lg xl:text-xl">
        <li>
          <Link 
            to="/" 
            className={`px-3 py-2 transition-colors border-b-3 ${
              isActive('/') 
                ? 'text-[#35530A] border-[#35530A]' // Usunięto bg-[#f5f8f0]
                : 'hover:bg-gray-100 rounded-[2px] border-transparent'
            }`}
          >
            Strona główna
          </Link>
        </li>
        <li>
          <Link 
            to="/listings" 
            className={`px-3 py-2 transition-colors border-b-3 ${
              isActive('/listings') 
                ? 'text-[#35530A] border-[#35530A]' // Usunięto bg-[#f5f8f0]
                : 'hover:bg-gray-100 rounded-[2px] border-transparent'
            }`}
          >
            Lista ogłoszeń
          </Link>
        </li>
        {user && (
          <li>
            {/* Ewentualne linki widoczne tylko dla zalogowanych */}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default DesktopNav;