import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

const DesktopNav = ({ user }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { unreadCount } = useNotifications();

  // Helper function to determine if a route is active (matches exactly or starts with path)
  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav>
      <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8 font-bold uppercase text-sm lg:text-base xl:text-lg">
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
          <li className="relative">
            <Link 
              to="/profil/messages" 
              className={`px-3 py-2 transition-colors border-b-3 ${
                isActive('/profil/messages') 
                  ? 'text-[#35530A] border-[#35530A]'
                  : 'hover:bg-gray-100 rounded-[2px] border-transparent'
              }`}
            >
              Wiadomości
              {unreadCount.messages > 0 && (
                <span className="absolute -top-4 -right-2 bg-red-600 text-white text-sm font-bold px-2.5 py-1.5 rounded-full min-w-[24px] text-center shadow-md z-10">
                  {unreadCount.messages}
                </span>
              )}
            </Link>
          </li>
        )}
        {user && user.role === 'admin' && (
          <li>
            <Link 
              to="/admin" 
              className={`px-3 py-2 transition-colors border-b-3 ${
                isActive('/admin') 
                  ? 'text-[#35530A] border-[#35530A]'
                  : 'hover:bg-gray-100 rounded-[2px] border-transparent'
              }`}
            >
              Panel Administratora
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default DesktopNav;
