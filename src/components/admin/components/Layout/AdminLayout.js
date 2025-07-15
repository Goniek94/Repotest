import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ 
  children, 
  activeSection, 
  onSectionChange, 
  onLogout, 
  user 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [layoutData, setLayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch layout-specific data (notifications, quick stats, etc.)
  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        setLoading(true);
        
        // Use mock data for now - in production you would fetch real data
        setLayoutData({
          notifications: [],
          quickStats: {
            totalUsers: 0,
            totalAds: 0,
            pendingReports: 0
          },
          apiStatus: 'ready'
        });
      } catch (err) {
        setError(err.message);
        console.error('Layout data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLayoutData();
    } else {
      setLoading(false);
      setLayoutData({
        notifications: [],
        quickStats: {
          totalUsers: 0,
          totalAds: 0,
          pendingReports: 0
        },
        apiStatus: 'no-user'
      });
    }
  }, [user]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSectionChange = (section) => {
    onSectionChange(section);
    // Close sidebar on mobile after section change
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Loading state for layout data
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-t-2 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Ładowanie interfejsu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        user={user}
        layoutData={layoutData}
        onLogout={onLogout}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={handleSidebarClose}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AdminHeader
          onMenuClick={handleSidebarToggle}
          user={user}
          layoutData={layoutData}
          activeSection={activeSection}
          onLogout={onLogout}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Błąd ładowania danych układu
                    </h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Page content */}
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
