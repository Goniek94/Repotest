import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiBell, FiClock, FiBarChart2, FiList, FiHeart, FiSettings } from 'react-icons/fi';

const UserSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'PANEL UŻYTKOWNIKA',
      path: '/profil',
      icon: <FiUser className="w-5 h-5" />,
      badge: null
    },
    {
      title: 'WIADOMOŚCI',
      path: '/profil/messages',
      icon: <FiMail className="w-5 h-5" />,
      badge: 5
    },
    // ... reszta menuItems
  ];

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#35530A]">Mój Profil</h2>
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between p-3 rounded-lg mb-1
              ${location.pathname === item.path 
                ? 'bg-[#35530A] text-white' 
                : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium text-sm">{item.title}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default UserSidebar;