import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiList, 
  FiMessageSquare, 
  FiTag,
  FiMenu,
  FiX 
} from 'react-icons/fi';

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { path: '/admin', icon: <FiHome size={20} />, name: 'Dashboard' },
    { path: '/admin/users', icon: <FiUsers size={20} />, name: 'Użytkownicy' },
    { path: '/admin/listings', icon: <FiList size={20} />, name: 'Ogłoszenia' },
    { path: '/admin/comments', icon: <FiMessageSquare size={20} />, name: 'Komentarze' },
    { path: '/admin/discounts', icon: <FiTag size={20} />, name: 'Zniżki' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } bg-[#35530A] text-white transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2D4A06]">
          <h2 className={`font-bold text-xl ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
            Panel Admina
          </h2>
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-[#2D4A06] transition-colors"
          >
            {isSidebarCollapsed ? <FiMenu size={24} /> : <FiX size={24} />}
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 transition-colors ${
                isActivePath(item.path)
                  ? 'bg-[#2D4A06] border-r-4 border-yellow-500'
                  : 'hover:bg-[#2D4A06]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`ml-4 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;