import React, { useState, useEffect } from 'react';
import { Car, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminStatCard from '../../components/UI/AdminStatCard';
import useAdminApi from '../../hooks/useAdminApi';

const ListingsStats = ({ loading: parentLoading = false }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { get } = useAdminApi();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await get('/listings/stats');
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch listings stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Łączna liczba',
      value: stats.total || 0,
      change: stats.totalChange ? `${stats.totalChange > 0 ? '+' : ''}${stats.totalChange}%` : null,
      changeType: stats.totalChange > 0 ? 'increase' : 'decrease',
      icon: Car,
      color: '#35530A'
    },
    {
      title: 'Oczekujące',
      value: stats.pending || 0,
      change: stats.pendingChange ? `${stats.pendingChange > 0 ? '+' : ''}${stats.pendingChange}%` : null,
      changeType: stats.pendingChange > 0 ? 'increase' : 'decrease',
      icon: Clock,
      color: '#F59E0B'
    },
    {
      title: 'Zatwierdzone',
      value: stats.approved || 0,
      change: stats.approvedChange ? `${stats.approvedChange > 0 ? '+' : ''}${stats.approvedChange}%` : null,
      changeType: stats.approvedChange > 0 ? 'increase' : 'decrease',
      icon: CheckCircle,
      color: '#10B981'
    },
    {
      title: 'Odrzucone',
      value: stats.rejected || 0,
      change: stats.rejectedChange ? `${stats.rejectedChange > 0 ? '+' : ''}${stats.rejectedChange}%` : null,
      changeType: stats.rejectedChange > 0 ? 'increase' : 'decrease',
      icon: XCircle,
      color: '#EF4444'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <AdminStatCard
          key={index}
          title={card.title}
          value={card.value}
          change={card.change}
          changeType={card.changeType}
          icon={card.icon}
          color={card.color}
          loading={loading || parentLoading}
        />
      ))}
    </div>
  );
};

export default ListingsStats;
