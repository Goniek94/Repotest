import React from 'react';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

const AdminHeader = ({ 
  onMenuClick, 
  user, 
  layoutData, 
  activeSection, 
  onLogout 
}) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      } else {
        await logout();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Get section title based on active section
  const getSectionTitle = (section) => {
    const titles = {
      dashboard: 'Panel Główny',
      users: 'Zarządzanie Użytkownikami',
      listings: 'Zarządzanie Ogłoszeniami',
      promotions: 'Zarządzanie Promocjami',
      reports: 'Zgłoszenia i Raporty',
      statistics: 'Statystyki i Analityka',
      settings: 'Ustawienia Systemu'
    };
    return titles[section] || 'Panel Administratora';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and title */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Page title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {getSectionTitle(activeSection)}
            </h1>
            <p className="text-sm text-gray-500">
              Zarządzaj swoją platformą AutoSell
            </p>
          </div>
        </div>

        {/* Right side - Search, notifications, user menu */}
        <div className="flex items-center space-x-4">
          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              {/* Notification badge */}
              {layoutData?.notifications?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {layoutData.notifications.length > 9 ? '9+' : layoutData.notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            {/* User avatar and info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'admin@autosell.pl'}
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
              title="Wyloguj się"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats bar - only show on dashboard */}
      {activeSection === 'dashboard' && layoutData?.quickStats && (
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Użytkownicy:</span>
                <span className="font-medium text-gray-900">
                  {layoutData.quickStats.totalUsers || 0}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Ogłoszenia:</span>
                <span className="font-medium text-gray-900">
                  {layoutData.quickStats.totalAds || 0}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Oczekujące zgłoszenia:</span>
                <span className="font-medium text-red-600">
                  {layoutData.quickStats.pendingReports || 0}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                layoutData.apiStatus === 'ready' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-gray-500 text-xs">
                Status API: {layoutData.apiStatus === 'ready' ? 'Gotowy' : 'Błąd'}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
