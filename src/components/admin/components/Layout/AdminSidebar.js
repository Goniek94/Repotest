import React from 'react';
import { Users, Car, BarChart3, AlertTriangle, Settings, Home, Gift, LogOut, X } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

const AdminSidebar = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange
}) => {
  const { user, logout } = useAuth();

  // Static menu items - no API call needed
  const menuItems = [
    { id: 'dashboard', label: 'Panel Główny', icon: 'home', enabled: true },
    { id: 'users', label: 'Użytkownicy', icon: 'users', enabled: true },
    { id: 'listings', label: 'Ogłoszenia', icon: 'car', enabled: true },
    { id: 'promotions', label: 'Promocje', icon: 'gift', enabled: true },
    { id: 'reports', label: 'Zgłoszenia', icon: 'alert-triangle', enabled: true },
    { id: 'statistics', label: 'Statystyki', icon: 'bar-chart-3', enabled: true },
    { id: 'settings', label: 'Ustawienia', icon: 'settings', enabled: true }
  ];

  const getIcon = (iconName) => {
    const iconMap = {
      'home': <Home size={20} />,
      'users': <Users size={20} />,
      'car': <Car size={20} />,
      'gift': <Gift size={20} />,
      'alert-triangle': <AlertTriangle size={20} />,
      'bar-chart-3': <BarChart3 size={20} />,
      'settings': <Settings size={20} />
    };
    return iconMap[iconName] || <Home size={20} />;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleMenuClick = (sectionId) => {
    onSectionChange(sectionId);
    // Close mobile menu after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b text-white" style={{backgroundColor: '#35530A'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Settings size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">PANEL</h1>
                <h2 className="text-sm opacity-90">ADMINISTRATORA</h2>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'admin@autosell.pl'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  disabled={!item.enabled}
                  className={`
                    w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors
                    ${activeSection === item.id 
                      ? 'text-white border-r-4' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                    ${!item.enabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  style={activeSection === item.id ? {backgroundColor: '#35530A', borderColor: '#35530A'} : {}}
                >
                  <span className={activeSection === item.id ? 'text-white' : 'text-gray-500'}>
                    {getIcon(item.icon)}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors rounded-lg"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">WYLOGUJ SIĘ</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
