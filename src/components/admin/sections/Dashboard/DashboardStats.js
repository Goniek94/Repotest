import React from 'react';
import { Users, Car, AlertTriangle, DollarSign, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import AdminStatCard from '../../components/UI/AdminStatCard';

const DashboardStats = ({ data, trends, loading }) => {
  // Default stats structure
  const defaultStats = {
    totalUsers: 0,
    activeListings: 0,
    pendingReports: 0,
    monthlyRevenue: 0,
    newUsersToday: 0,
    newListingsToday: 0,
    resolvedReports: 0,
    totalViews: 0
  };

  // Default trends structure
  const defaultTrends = {
    totalUsers: { change: 0, type: 'neutral' },
    activeListings: { change: 0, type: 'neutral' },
    pendingReports: { change: 0, type: 'neutral' },
    monthlyRevenue: { change: 0, type: 'neutral' },
    newUsersToday: { change: 0, type: 'neutral' },
    newListingsToday: { change: 0, type: 'neutral' },
    resolvedReports: { change: 0, type: 'neutral' },
    totalViews: { change: 0, type: 'neutral' }
  };

  const stats = { ...defaultStats, ...data };
  const statseTrends = { ...defaultTrends, ...trends };

  // Format change percentage
  const formatChange = (change) => {
    if (change === 0) return '0%';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  // Get change type for trend
  const getChangeType = (change) => {
    if (change > 0) return 'increase';
    if (change < 0) return 'decrease';
    return 'neutral';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('pl-PL').format(num);
  };

  const statCards = [
    {
      title: 'Łączna liczba użytkowników',
      value: formatNumber(stats.totalUsers),
      change: formatChange(statseTrends.totalUsers.change),
      changeType: getChangeType(statseTrends.totalUsers.change),
      icon: Users,
      color: '#35530A'
    },
    {
      title: 'Aktywne ogłoszenia',
      value: formatNumber(stats.activeListings),
      change: formatChange(statseTrends.activeListings.change),
      changeType: getChangeType(statseTrends.activeListings.change),
      icon: Car,
      color: '#10B981'
    },
    {
      title: 'Oczekujące zgłoszenia',
      value: formatNumber(stats.pendingReports),
      change: formatChange(statseTrends.pendingReports.change),
      changeType: getChangeType(statseTrends.pendingReports.change),
      icon: AlertTriangle,
      color: '#F59E0B'
    },
    {
      title: 'Miesięczne przychody',
      value: formatCurrency(stats.monthlyRevenue),
      change: formatChange(statseTrends.monthlyRevenue.change),
      changeType: getChangeType(statseTrends.monthlyRevenue.change),
      icon: DollarSign,
      color: '#3B82F6'
    }
  ];

  const secondaryStatCards = [
    {
      title: 'Nowi użytkownicy dziś',
      value: formatNumber(stats.newUsersToday),
      change: formatChange(statseTrends.newUsersToday.change),
      changeType: getChangeType(statseTrends.newUsersToday.change),
      icon: Users,
      color: '#8B5CF6'
    },
    {
      title: 'Nowe ogłoszenia dziś',
      value: formatNumber(stats.newListingsToday),
      change: formatChange(statseTrends.newListingsToday.change),
      changeType: getChangeType(statseTrends.newListingsToday.change),
      icon: Car,
      color: '#EC4899'
    },
    {
      title: 'Rozwiązane zgłoszenia',
      value: formatNumber(stats.resolvedReports),
      change: formatChange(statseTrends.resolvedReports.change),
      changeType: getChangeType(statseTrends.resolvedReports.change),
      icon: AlertTriangle,
      color: '#14B8A6'
    },
    {
      title: 'Łączne wyświetlenia',
      value: formatNumber(stats.totalViews),
      change: formatChange(statseTrends.totalViews.change),
      changeType: getChangeType(statseTrends.totalViews.change),
      icon: Eye,
      color: '#6366F1'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <AdminStatCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={card.icon}
            color={card.color}
            loading={loading}
          />
        ))}
      </div>

      {/* Secondary statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Dzisiejsze statystyki</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Aktualizowane na żywo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondaryStatCards.map((card, index) => (
            <AdminStatCard
              key={index}
              title={card.title}
              value={card.value}
              change={card.change}
              changeType={card.changeType}
              icon={card.icon}
              color={card.color}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {/* Performance indicators */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Wskaźniki wydajności</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversion rate */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.conversionRate ? `${stats.conversionRate.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-sm text-gray-500 mb-2">Współczynnik konwersji</p>
            <div className="flex items-center justify-center space-x-1">
              {stats.conversionRate > 0 ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}
              <span className={`text-sm ${stats.conversionRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.conversionRate > 0 ? '+' : ''}{stats.conversionRate || 0}%
              </span>
            </div>
          </div>

          {/* Average session duration */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.avgSessionDuration ? `${Math.round(stats.avgSessionDuration / 60)}m` : '0m'}
            </div>
            <p className="text-sm text-gray-500 mb-2">Średni czas sesji</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {stats.avgSessionDuration ? `${stats.avgSessionDuration}s` : '0s'}
              </span>
            </div>
          </div>

          {/* Bounce rate */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.bounceRate ? `${stats.bounceRate.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-sm text-gray-500 mb-2">Współczynnik odrzuceń</p>
            <div className="flex items-center justify-center space-x-1">
              {stats.bounceRate < 50 ? (
                <TrendingDown size={16} className="text-green-600" />
              ) : (
                <TrendingUp size={16} className="text-red-600" />
              )}
              <span className={`text-sm ${stats.bounceRate < 50 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.bounceRate || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalUsers || 0)}</div>
            <div className="text-xs text-gray-500">Użytkownicy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.activeListings || 0)}</div>
            <div className="text-xs text-gray-500">Ogłoszenia</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews || 0)}</div>
            <div className="text-xs text-gray-500">Wyświetlenia</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalMessages || 0)}</div>
            <div className="text-xs text-gray-500">Wiadomości</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalPromotions || 0)}</div>
            <div className="text-xs text-gray-500">Promocje</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalReports || 0)}</div>
            <div className="text-xs text-gray-500">Zgłoszenia</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;