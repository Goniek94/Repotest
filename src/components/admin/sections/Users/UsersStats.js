import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import AdminStatCard from '../../components/UI/AdminStatCard';
import useAdminApi from '../../hooks/useAdminApi';

const UsersStats = ({ loading: parentLoading = false }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { get } = useAdminApi();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await get('/users/stats');
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
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
      icon: Users,
      color: '#35530A'
    },
    {
      title: 'Zweryfikowani',
      value: stats.verified || 0,
      change: stats.verifiedChange ? `${stats.verifiedChange > 0 ? '+' : ''}${stats.verifiedChange}%` : null,
      changeType: stats.verifiedChange > 0 ? 'increase' : 'decrease',
      icon: UserCheck,
      color: '#10B981'
    },
    {
      title: 'Nieaktywni',
      value: stats.inactive || 0,
      change: stats.inactiveChange ? `${stats.inactiveChange > 0 ? '+' : ''}${stats.inactiveChange}%` : null,
      changeType: stats.inactiveChange > 0 ? 'increase' : 'decrease',
      icon: UserX,
      color: '#F59E0B'
    },
    {
      title: 'Zablokowani',
      value: stats.blocked || 0,
      change: stats.blockedChange ? `${stats.blockedChange > 0 ? '+' : ''}${stats.blockedChange}%` : null,
      changeType: stats.blockedChange > 0 ? 'increase' : 'decrease',
      icon: Shield,
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

export default UsersStats;
