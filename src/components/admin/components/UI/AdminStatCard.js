import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const AdminStatCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color = '#35530A',
  loading = false,
  error = null,
  onClick = null
}) => {
  const getChangeIcon = (type) => {
    switch (type) {
      case 'increase':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'decrease':
        return <TrendingDown size={16} className="text-red-600" />;
      case 'neutral':
        return <Minus size={16} className="text-gray-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString('pl-PL');
    }
    return val;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
              <div className="h-3 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-400">--</p>
            <p className="text-sm text-red-600">Błąd ładowania</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow
        ${onClick ? 'cursor-pointer hover:border-gray-200' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          {change && (
            <div className="flex items-center space-x-1 mt-1">
              {getChangeIcon(changeType)}
              <span className={`text-sm ${getChangeColor(changeType)}`}>
                {change}
              </span>
              <span className="text-sm text-gray-500">vs poprzedni okres</span>
            </div>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          {Icon && <Icon size={24} style={{ color }} />}
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;