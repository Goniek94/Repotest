import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, LogOut, ArrowLeft, Search, Settings, AlertTriangle } from 'lucide-react';

const AdminHeader = ({ 
  onMenuClick, 
  user, 
  layoutData, 
  activeSection, 
  onLogout 
}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/notifications', {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (err) {
        console.error('Notifications fetch failed:', err);
        setNotifications([]);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchNotifications();
      
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.token]);

  const handleBackToSite = () => {
    window.open('https://autosell.pl', '_blank');
  };

  const handleLogout = async () => {
    if (window.confirm('Czy na pewno chcesz się wylogować?')) {
      try {
        await onLogout();
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark notification as read failed:', err);
    }
  };

  const getSectionTitle = (section) => {
    const titles = {
      'dashboard': 'Panel Główny',
      'users': 'Zarządzanie Użytkownikami',
      'listings': 'Zarządzanie Ogłoszeniami',
      'promotions': 'Promocje i Zniżki',
      'reports': 'Zgłoszenia',
      'statistics': 'Statystyki',
      'settings': 'Ustawienia'
    };
    return titles[section] || 'Panel Administratora';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user':
        return <User size={16} className="text-blue-600" />;
      case 'listing':
        return <Car size={16} className="text-green-600" />;
      case 'report':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Teraz';
    if (diffInMinutes < 60) return `${diffInMinutes} min temu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} godz. temu`;
    return date.toLocaleDateString('pl-PL');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          
          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{getSectionTitle(activeSection)}</h1>
            <p className="text-sm text-gray-500">Witaj, {user?.name || 'Administrator'}</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Back to Site Button */}
          <button
            onClick={handleBackToSite}
            className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Powrót na stronę</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Powiadomienia</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-t-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Bell size={24} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Brak powiadomień</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`
                          p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
                          ${!notification.read ? 'bg-blue-50' : ''}
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name || 'Administrator'}
              </span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Administrator'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@autosell.pl'}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile/settings
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">Profil</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Wyloguj się</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default AdminHeader;