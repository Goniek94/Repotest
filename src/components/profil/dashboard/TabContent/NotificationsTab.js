import React, { useState } from 'react';
import { X, BellRing, AlertCircle } from 'lucide-react';
import useUserDashboardData from '../hooks/useUserDashboardData';
import { dismissNotification } from '../../../../services/api';

// Główny kolor aplikacji
const PRIMARY_COLOR = '#35530A';

/**
 * Komponent wyświetlający powiadomienia użytkownika
 */
const NotificationsTab = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dismissedActivities, setDismissedActivities] = useState([]);
  
  // Pobieranie danych z tego samego źródła co dashboard
  const { activities, isLoading, error } = useUserDashboardData(refreshTrigger);
  
  // Funkcja odświeżania danych
  const handleRetry = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Funkcja do obsługi usuwania aktywności
  const handleDismissActivity = async (id) => {
    // Natychmiast aktualizujemy lokalny stan dla lepszego UX
    setDismissedActivities(prev => [...prev, id]);
    
    try {
      // Wywołanie API do usunięcia powiadomienia na serwerze
      await dismissNotification(id);
    } catch (error) {
      console.error('Błąd podczas odrzucania powiadomienia:', error);
      // Lokalne odrzucenie działa nawet gdy API zawiedzie
    }
  };
  
  // Filtrowanie powiadomień (usunięte nie są wyświetlane)
  const filteredActivities = activities.filter(item => !dismissedActivities.includes(item.id));

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      {/* Nagłówek z gradientem */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white p-3 flex items-center">
        <BellRing className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-medium">Powiadomienia</h2>
      </div>
      
      {/* Błąd ładowania */}
      {error && (
        <div className="bg-red-50 p-4 border-b border-red-100">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Wystąpił problem</h3>
              <p className="text-sm text-red-700 mt-1">Nie udało się załadować powiadomień.</p>
              <button 
                onClick={handleRetry}
                className="mt-2 text-xs font-medium text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
              >
                Spróbuj ponownie
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Stan ładowania */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 bg-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-l-2" 
               style={{ borderColor: PRIMARY_COLOR }}></div>
          <p className="mt-4 text-gray-600 text-sm">
            Ładowanie powiadomień...
          </p>
        </div>
      )}
      
      {/* Lista powiadomień */}
      {!isLoading && !error && (
        <>
          {filteredActivities.length > 0 ? (
            <div className="bg-white">
              {filteredActivities.map((notification) => (
                <div 
                  key={notification.id || `activity-${Math.random()}`} 
                  className="border-b border-gray-100 relative"
                >
                  <div className="p-4 bg-white">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        {notification.icon}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mb-1.5">{notification.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <a href={notification.href} className="text-green-800 font-medium text-xs">
                            {notification.actionLabel || "Zobacz"} →
                          </a>
                        </div>
                      </div>
                      <button 
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => handleDismissActivity(notification.id)}
                        aria-label="Usuń powiadomienie"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white border-b border-gray-100">
              <BellRing size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Brak nowych powiadomień</p>
              <button 
                onClick={handleRetry}
                className="mt-3 text-xs font-medium text-green-800 underline"
              >
                Odśwież
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationsTab;