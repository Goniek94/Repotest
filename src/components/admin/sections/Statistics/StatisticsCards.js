import React from 'react';
import { Users, Car, DollarSign, TrendingUp } from 'lucide-react';
import AdminStatCard from '../../components/UI/AdminStatCard';

const StatisticsCards = ({ data = {}, loading = false }) => {
  const statsCards = [
    {
      title: 'Nowi użytkownicy',
      value: data.newUsers || 0,
      change: data.usersChange ? `${data.usersChange > 0 ? '+' : ''}${data.usersChange}%` : null,
      changeType: data.usersChange > 0 ? 'increase' : 'decrease',
      icon: Users,
      color: '#35530A'
    },
    {
      title: 'Nowe ogłoszenia',
      value: data.newListings || 0,
      change: data.listingsChange ? `${data.listingsChange > 0 ? '+' : ''}${data.listingsChange}%` : null,
      changeType: data.listingsChange > 0 ? 'increase' : 'decrease',
      icon: Car,
      color: '#10B981'
    },
    {
      title: 'Przychody',
      value: data.revenue || '0 PLN',
      change: data.revenueChange ? `${data.revenueChange > 0 ? '+' : ''}${data.revenueChange}%` : null,
      changeType: data.revenueChange > 0 ? 'increase' : 'decrease',
      icon: DollarSign,
      color: '#3B82F6'
    },
    {
      title: 'Konwersja',
      value: data.conversion ? `${data.conversion}%` : '0%',
      change: data.conversionChange ? `${data.conversionChange > 0 ? '+' : ''}${data.conversionChange}%` : null,
      changeType: data.conversionChange > 0 ? 'increase' : 'decrease',
      icon: TrendingUp,
      color: '#8B5CF6'
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
          loading={loading}
        />
      ))}
    </div>
  );
};

export default StatisticsCards;
