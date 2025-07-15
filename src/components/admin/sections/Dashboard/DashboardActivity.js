import React, { useState } from 'react';
import { 
  Users, 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MessageSquare,
  Gift,
  Settings,
  Shield,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { formatDate } from '../../components/utils/adminHelpers';

const DashboardActivity = ({ activities = [], loading = false }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Activity type configuration
  const activityTypes = {
    user_registered: {
      icon: Users,
      color: '#10B981',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      label: 'Nowy użytkownik'
    },
    user_verified: {
      icon: CheckCircle,
      color: '#10B981',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      label: 'Weryfikacja'
    },
    user_blocked: {
      icon: XCircle,
      color: '#EF4444',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      label: 'Zablokowany'
    },
    listing_created: {
      icon: Car,
      color: '#3B82F6',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      label: 'Nowe ogłoszenie'
    },
    listing_approved: {
      icon: CheckCircle,
      color: '#10B981',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      label: 'Zatwierdzone'
    },
    listing_rejected: {
      icon: XCircle,
      color: '#EF4444',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      label: 'Odrzucone'
    },
    listing_featured: {
      icon: Gift,
      color: '#8B5CF6',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      label: 'Wyróżnione'
    },
    report_created: {
      icon: AlertTriangle,
      color: '#F59E0B',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      label: 'Nowe zgłoszenie'
    },
    report_resolved: {
      icon: CheckCircle,
      color: '#10B981',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      label: 'Rozwiązane'
    },
    promotion_activated: {
      icon: Gift,
      color: '#EC4899',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      label: 'Promocja aktywna'
    },
    system_update: {
      icon: Settings,
      color: '#6B7280',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      label: 'Aktualizacja'
    },
    security_alert: {
      icon: Shield,
      color: '#EF4444',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      label: 'Alert bezpieczeństwa'
    }
  };

  // Filter options
  const filterOptions = [
    { key: 'all', label: 'Wszystkie', count: activities.length },
    { key: 'user', label: 'Użytkownicy', count: activities.filter(a => a.type.startsWith('user_')).length },
    { key: 'listing', label: 'Ogłoszenia', count: activities.filter(a => a.type.startsWith('listing_')).length },
    { key: 'report', label: 'Zgłoszenia', count: activities.filter(a => a.type.startsWith('report_')).length },
    { key: 'system', label: 'System', count: activities.filter(a => a.type.startsWith('system_') || a.type.startsWith('security_')).length }
  ];

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'user') return activity.type.startsWith('user_');
    if (selectedFilter === 'listing') return activity.type.startsWith('listing_');
    if (selectedFilter === 'report') return activity.type.startsWith('report_');
    if (selectedFilter === 'system') return activity.type.startsWith('system_') || activity.type.startsWith('security_');
    return false;
  });

  // Get activity icon and styling
  const getActivityConfig = (type) => {
    return activityTypes[type] || {
      icon: Clock,
      color: '#6B7280',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      label: 'Aktywność'
    };
  };

  // Format activity message
  const formatActivityMessage = (activity) => {
    const { type, user, target, metadata } = activity;
    
    switch (type) {
      case 'user_registered':
        return `${user.name} zarejestrował się w systemie`;
      case 'user_verified':
        return `${user.name} został zweryfikowany`;
      case 'user_blocked':
        return `${user.name} został zablokowany`;
      case 'listing_created':
        return `${user.name} utworzył ogłoszenie "${target.title}"`;
      case 'listing_approved':
        return `Ogłoszenie "${target.title}" zostało zatwierdzone`;
      case 'listing_rejected':
        return `Ogłoszenie "${target.title}" zostało odrzucone`;
      case 'listing_featured':
        return `Ogłoszenie "${target.title}" zostało wyróżnione`;
      case 'report_created':
        return `Nowe zgłoszenie: ${target.type}`;
      case 'report_resolved':
        return `Zgłoszenie zostało rozwiązane przez ${user.name}`;
      case 'promotion_activated':
        return `Promocja "${target.name}" została aktywowana`;
      case 'system_update':
        return `Aktualizacja systemu: ${metadata.version}`;
      case 'security_alert':
        return `Alert bezpieczeństwa: ${metadata.message}`;
      default:
        return activity.message || 'Nieznana aktywność';
    }
  };

  // Get activity priority
  const getActivityPriority = (type) => {
    const highPriority = ['security_alert', 'user_blocked', 'report_created'];
    const mediumPriority = ['listing_rejected', 'system_update'];
    
    if (highPriority.includes(type)) return 'high';
    if (mediumPriority.includes(type)) return 'medium';
    return 'low';
  };

  // Handle activity click
  const handleActivityClick = (activity) => {
    // Navigate to relevant section based on activity type
    if (activity.type.startsWith('user_')) {
      // Navigate to user details
      console.log('Navigate to user:', activity.user.id);
    } else if (activity.type.startsWith('listing_')) {
      // Navigate to listing details
      console.log('Navigate to listing:', activity.target.id);
    } else if (activity.type.startsWith('report_')) {
      // Navigate to report details
      console.log('Navigate to report:', activity.target.id);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ostatnie aktywności</h3>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
          {filterOptions.map(option => (
            <button
              key={option.key}
              onClick={() => setSelectedFilter(option.key)}
              className={`
                flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${selectedFilter === option.key
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              style={selectedFilter === option.key ? { backgroundColor: '#35530A' } : {}}
            >
              <span>{option.label}</span>
              <span className={`
                px-1.5 py-0.5 text-xs rounded-full
                ${selectedFilter === option.key 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity list */}
      <div className="p-6">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Brak aktywności do wyświetlenia</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.slice(0, 10).map((activity, index) => {
              const config = getActivityConfig(activity.type);
              const priority = getActivityPriority(activity.type);
              const Icon = config.icon;

              return (
                <div 
                  key={activity.id || index}
                  onClick={() => handleActivityClick(activity)}
                  className={`
                    flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                    hover:bg-gray-50 border-l-4
                    ${priority === 'high' 
                      ? 'border-red-500 bg-red-50' 
                      : priority === 'medium' 
                      ? 'border-yellow-500 bg-yellow-50' 
                      : 'border-transparent'
                    }
                  `}
                >
                  {/* Activity icon */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${config.bgColor}
                  `}>
                    <Icon size={16} className={config.textColor} />
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {formatActivityMessage(activity)}
                      </p>
                      <div className="flex items-center space-x-2">
                        {priority === 'high' && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDate(activity.createdAt, 'relative')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {config.label}
                      </p>
                      
                      {activity.metadata && (
                        <div className="flex items-center space-x-1">
                          {activity.metadata.location && (
                            <span className="text-xs text-gray-400">
                              📍 {activity.metadata.location}
                            </span>
                          )}
                          {activity.metadata.ip && (
                            <span className="text-xs text-gray-400">
                              🌐 {activity.metadata.ip}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Additional info for specific activity types */}
                    {activity.type === 'listing_created' && activity.target && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <span className="font-medium">Kategoria:</span> {activity.target.category} | 
                        <span className="font-medium"> Cena:</span> {activity.target.price} PLN
                      </div>
                    )}

                    {activity.type === 'report_created' && activity.target && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                        <span className="font-medium">Powód:</span> {activity.target.reason}
                      </div>
                    )}

                    {activity.type === 'security_alert' && activity.metadata && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                        <span className="font-medium">Szczegóły:</span> {activity.metadata.details}
                      </div>
                    )}
                  </div>

                  {/* External link icon */}
                  <div className="flex-shrink-0">
                    <ExternalLink size={14} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Show more button */}
        {filteredActivities.length > 10 && (
          <div className="mt-6 text-center">
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Pokaż więcej aktywności
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Ostatnia aktualizacja: {formatDate(new Date(), 'time')}
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-500">Na żywo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardActivity;
