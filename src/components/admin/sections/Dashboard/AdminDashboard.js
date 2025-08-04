import React, { useState, useEffect } from 'react';
import { Users, FileText, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import useAdminApi from '../../hooks/useAdminApi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { getDashboardStats, loading, error } = useAdminApi();
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch real dashboard data from API using new hook
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await getDashboardStats();
        
        if (result.success) {
          setDashboardData(result.data);
        } else {
          console.error('Dashboard fetch error:', result.error);
          // Fallback data in case of error
          setDashboardData({
            stats: {
              totalUsers: 0,
              totalListings: 0,
              pendingReports: 0,
              totalRevenue: 0
            },
            trends: {
              users: 'Błąd ładowania',
              listings: 'Błąd ładowania',
              reports: 'Błąd ładowania',
              revenue: 'Błąd ładowania'
            },
            recentActivity: []
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        // Fallback data in case of error
        setDashboardData({
          stats: {
            totalUsers: 0,
            totalListings: 0,
            pendingReports: 0,
            totalRevenue: 0
          },
          trends: {
            users: 'Błąd ładowania',
            listings: 'Błąd ładowania',
            reports: 'Błąd ładowania',
            revenue: 'Błąd ładowania'
          },
          recentActivity: []
        });
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, getDashboardStats]);

  const StatCard = ({ title, value, icon: Icon, trend, color = 'green' }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</p>
          {trend && (
            <p className={`text-sm ${color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
              {loading ? '...' : trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color === 'green' ? 'bg-green-100' : 'bg-red-100'}`}>
          <Icon className={`w-6 h-6 ${color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Ładowanie danych...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-red-600">Błąd ładowania: {error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Brak danych</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Witaj z powrotem, {user?.name || 'Administrator'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Użytkownicy"
          value={dashboardData.stats?.totalUsers || 0}
          icon={Users}
          trend={dashboardData.trends?.users || '+0 w tym tygodniu'}
          color="green"
        />
        <StatCard
          title="Ogłoszenia"
          value={dashboardData.stats?.totalListings || 0}
          icon={FileText}
          trend={dashboardData.trends?.listings || 'Brak nowych'}
          color="green"
        />
        <StatCard
          title="Zgłoszenia"
          value={dashboardData.stats?.pendingReports || 0}
          icon={AlertCircle}
          trend={dashboardData.trends?.reports || 'Wszystkie rozwiązane'}
          color={(dashboardData.stats?.pendingReports || 0) > 0 ? 'red' : 'green'}
        />
        <StatCard
          title="Przychody"
          value={`${dashboardData.stats?.totalRevenue || 0} zł`}
          icon={DollarSign}
          trend={dashboardData.trends?.revenue || '0% zmiana'}
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Ostatnia aktywność</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(dashboardData.recentActivity || []).length > 0 ? (
                dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Brak ostatniej aktywności</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Szybkie akcje</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Zarządzaj użytkownikami</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Przejrzyj ogłoszenia</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Zobacz statystyki</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Status systemu</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900">Backend API</p>
              <p className="text-xs text-green-600">Sprawny</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900">Baza danych</p>
              <p className="text-xs text-green-600">Sprawna</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900">Autoryzacja</p>
              <p className="text-xs text-green-600">Aktywna</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Panel administratora działa!</h3>
            <p className="text-green-700">
              System autoryzacji został zintegrowany z główną aplikacją. 
              Użytkownicy z rolą 'admin' mają teraz dostęp do panelu administratora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
