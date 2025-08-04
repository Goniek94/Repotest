import React, { useState, useEffect } from 'react';
import AdminLayout from './components/Layout/AdminLayout';
import AdminDashboard from './sections/Dashboard/AdminDashboard';
import AdminUsers from './sections/Users/AdminUsers';
import AdminListings from './sections/Listings/AdminListings';
import AdminPromotions from './sections/Promotions/AdminPromotions';
import AdminReports from './sections/Reports/AdminReports';
import AdminStatistics from './sections/Statistics/AdminStatistics';
import AdminSettings from './sections/Settings/AdminSettings';
import { useAuth } from '../../contexts/AuthContext';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout, isAuthenticated } = useAuth();

  // Initialize admin panel data
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        setLoading(true);
        // Skip API initialization for now - panel will load directly
        // In production, you would fetch initial admin data here
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      initializeAdmin();
    }
  }, [isAuthenticated]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Routing logic
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'listings':
        return <AdminListings />;
      case 'promotions':
        return <AdminPromotions />;
      case 'reports':
        return <AdminReports />;
      case 'statistics':
        return <AdminStatistics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie panelu administratora...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Błąd ładowania</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Odśwież stronę
          </button>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-yellow-600 text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Brak autoryzacji</h2>
          <p className="text-gray-600 mb-4">Musisz się zalogować aby uzyskać dostęp do panelu administratora.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#35530A' }}
          >
            Przejdź do logowania
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      onLogout={handleLogout}
      user={user}
    >
      {renderActiveSection()}
    </AdminLayout>
  );
};

export default AdminPanel;
