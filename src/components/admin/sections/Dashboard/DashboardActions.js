import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Users, 
  Car, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Settings, 
  Plus,
  ArrowRight,
  Bell,
  Shield
} from 'lucide-react';
import AdminButton from '../../components/UI/AdminButton';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const DashboardActions = ({ pendingActions = {}, loading = false }) => {
  const [processingAction, setProcessingAction] = useState(null);
  const { showSuccess, showError } = useAdminNotifications();

  // Default pending actions structure
  const defaultPendingActions = {
    pendingReports: 0,
    pendingUsers: 0,
    pendingListings: 0,
    systemAlerts: 0,
    maintenanceTasks: 0,
    securityAlerts: 0
  };

  const actions = { ...defaultPendingActions, ...pendingActions };

  // Handle quick action
  const handleQuickAction = async (actionType, actionData) => {
    try {
      setProcessingAction(actionType);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (actionType) {
        case 'approve_listing':
          showSuccess('Ogłoszenie zostało zatwierdzone');
          break;
        case 'verify_user':
          showSuccess('Użytkownik został zweryfikowany');
          break;
        case 'resolve_report':
          showSuccess('Zgłoszenie zostało rozwiązane');
          break;
        case 'dismiss_alert':
          showSuccess('Alert został odrzucony');
          break;
        default:
          showSuccess('Akcja została wykonana');
      }
    } catch (error) {
      showError('Wystąpił błąd podczas wykonywania akcji');
    } finally {
      setProcessingAction(null);
    }
  };

  // Quick action items
  const quickActions = [
    {
      id: 'pending_reports',
      title: 'Oczekujące zgłoszenia',
      count: actions.pendingReports,
      icon: AlertTriangle,
      color: '#F59E0B',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      action: 'resolve_report',
      description: 'Nowe zgłoszenia wymagają przeglądu',
      priority: 'high'
    },
    {
      id: 'pending_users',
      title: 'Niezweryfikowani użytkownicy',
      count: actions.pendingUsers,
      icon: Users,
      color: '#3B82F6',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      action: 'verify_user',
      description: 'Użytkownicy oczekujący na weryfikację',
      priority: 'medium'
    },
    {
      id: 'pending_listings',
      title: 'Oczekujące ogłoszenia',
      count: actions.pendingListings,
      icon: Car,
      color: '#10B981',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      action: 'approve_listing',
      description: 'Ogłoszenia wymagają zatwierdzenia',
      priority: 'medium'
    },
    {
      id: 'system_alerts',
      title: 'Alerty systemowe',
      count: actions.systemAlerts,
      icon: Bell,
      color: '#EF4444',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      action: 'dismiss_alert',
      description: 'Wymagana interwencja administratora',
      priority: 'high'
    },
    {
      id: 'security_alerts',
      title: 'Alerty bezpieczeństwa',
      count: actions.securityAlerts,
      icon: Shield,
      color: '#DC2626',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      action: 'security_review',
      description: 'Podejrzane aktywności wykryte',
      priority: 'critical'
    },
    {
      id: 'maintenance_tasks',
      title: 'Zadania konserwacyjne',
      count: actions.maintenanceTasks,
      icon: Settings,
      color: '#6B7280',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      action: 'maintenance_task',
      description: 'Rutynowe zadania konserwacyjne',
      priority: 'low'
    }
  ];

  // Sort actions by priority and count
  const sortedActions = quickActions
    .filter(action => action.count > 0)
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.count - a.count;
    });

  // Get priority indicator
  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'critical':
        return <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>;
      case 'high':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'medium':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'low':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-6 bg-gray-300 rounded w-8"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
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
        <h3 className="text-lg font-semibold text-gray-900">Wymagane działania</h3>
        <p className="text-sm text-gray-500 mt-1">
          Zadania wymagające Twojej uwagi
        </p>
      </div>

      {/* Actions list */}
      <div className="p-6">
        {sortedActions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <p className="text-gray-500 font-medium">Wszystko jest aktualne!</p>
            <p className="text-sm text-gray-400 mt-1">
              Brak zadań wymagających działania
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActions.map((action) => {
              const Icon = action.icon;
              const isProcessing = processingAction === action.action;

              return (
                <div 
                  key={action.id}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-200
                    ${action.borderColor} ${action.bgColor}
                    ${action.priority === 'critical' ? 'animate-pulse' : ''}
                  `}
                >
                  {/* Priority indicator */}
                  <div className="absolute top-2 right-2">
                    {getPriorityIndicator(action.priority)}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${action.bgColor}
                      `}>
                        <Icon size={16} className={action.textColor} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{action.title}</h4>
                          <span className={`
                            px-2 py-1 text-xs font-bold rounded-full
                            ${action.textColor} ${action.bgColor}
                          `}>
                            {action.count}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {action.description}
                        </p>

                        {action.priority === 'critical' && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            <strong>Uwaga:</strong> Krytyczny priorytet - wymaga natychmiastowego działania
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <AdminButton
                        variant="primary"
                        size="small"
                        onClick={() => handleQuickAction(action.action, action)}
                        loading={isProcessing}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Przetwarzanie...' : 'Przejdź'}
                      </AdminButton>
                      
                      <AdminButton
                        variant="secondary"
                        size="small"
                        icon={Eye}
                        onClick={() => console.log('View details for:', action.id)}
                      >
                        Szczegóły
                      </AdminButton>
                    </div>

                    {action.count > 1 && (
                      <span className="text-xs text-gray-500">
                        +{action.count - 1} więcej
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Settings size={16} />
            <span>Szybkie działania</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <AdminButton
              variant="ghost"
              size="small"
              icon={Plus}
              onClick={() => console.log('Add custom action')}
            >
              Dodaj akcję
            </AdminButton>
            
            <AdminButton
              variant="ghost"
              size="small"
              icon={ArrowRight}
              onClick={() => console.log('View all actions')}
            >
              Zobacz wszystkie
            </AdminButton>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Łącznie: {Object.values(actions).reduce((sum, count) => sum + count, 0)} zadań
          </span>
          <span>
            Krytyczne: {quickActions.filter(a => a.priority === 'critical' && a.count > 0).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardActions;