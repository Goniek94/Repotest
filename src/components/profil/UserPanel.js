import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { FiUser, FiMail, FiBell, FiClock, FiBarChart2, FiList, FiHeart, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

// Importy komponentów
import Messages from './Messages';
import Notifications from './Notifications';
import Transactions from './Transactions';
import Stats from './Stats';
import UserListings from './UserListings';
import Favorites from './Favorites';
import Settings from './Settings';
import UserPanel from './UserPanel';

const UserDashboard = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Sprawdzenie autentykacji (dodatkowa warstwa zabezpieczeń)
  useEffect(() => {
    console.log('UserDashboard - dane użytkownika:', user);
  }, [user]);

  // Jeśli nie ma danych użytkownika, przekieruj do logowania
  if (!user || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  const menuItems = [
    {
      title: 'Panel Główny',
      path: '/profil',
      icon: <FiUser size={20} />,
    },
    {
      title: 'Wiadomości',
      path: '/profil/messages',
      icon: <FiMail size={20} />,
      badge: 5
    },
    {
      title: 'Powiadomienia',
      path: '/profil/notifications',
      icon: <FiBell size={20} />,
      badge: 3
    },
    {
      title: 'Historia Transakcji',
      path: '/profil/transactions',
      icon: <FiClock size={20} />
    },
    {
      title: 'Moje Ogłoszenia',
      path: '/profil/listings',
      icon: <FiList size={20} />
    },
    {
      title: 'Ustawienia',
      path: '/profil/settings',
      icon: <FiSettings size={20} />
    }
  ];

  // Komponent zastępczy, jeśli UserPanel nie istnieje
  const DefaultDashboard = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Witaj w Panelu Użytkownika</h2>
      <p className="text-gray-600">Zarządzaj swoimi ogłoszeniami, wiadomościami i ustawieniami.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - oryginalny, bez zmian */}
          <div className="w-64 bg-white rounded-lg shadow-lg h-fit hidden lg:block">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-green-800">Panel Użytkownika</h2>
              <p className="text-sm text-gray-600">Witaj, {user?.firstName || user?.name || 'Użytkowniku'}!</p>
            </div>
            <nav className="p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between mb-2 p-3 rounded-lg transition-colors
                    ${location.pathname === item.path 
                      ? 'bg-green-100 text-green-800' 
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
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

          {/* Content */}
          <div className="flex-1">
            <Routes>
              <Route index element={
                UserPanel ? <UserPanel user={user} /> : <DefaultDashboard />
              } />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="stats" element={<Stats />} />
              <Route path="listings" element={<UserListings />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="settings" element={<Settings user={user} />} />
            </Routes>
          </div>
        </div>
      </div>
      
      {/* Tutaj był komponent MobileSideNav - usunięty zgodnie z prośbą */}
    </div>
  );
};

export default UserDashboard;