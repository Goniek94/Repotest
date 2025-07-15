import React, { useState } from 'react';
import { BellRing, Eye, X } from 'lucide-react';
import ActivityItem from '../components/ActivityItem';
import RecentListingItem from '../components/RecentListingItem';
import { useNavigate } from 'react-router-dom';
import getActivityIcon from '../../../utils/getActivityIcon';

/**
 * Komponent sekcji aktywności użytkownika
 * @param {Object} props - Właściwości komponentu
 * @param {Array} props.recentAds - Lista ostatnio przeglądanych ogłoszeń
 * @param {Array} props.activities - Lista aktywności użytkownika
 * @param {Function} props.onDismissActivity - Funkcja wywoływana po usunięciu aktywności
 */
const ActivitySection = ({ recentAds = [], activities = [], onDismissActivity }) => {
  const navigate = useNavigate();
  const [dismissedActivities, setDismissedActivities] = useState([]);
  
  // Funkcja do lokalnego usuwania aktywności
  const handleDismiss = (id) => {
    setDismissedActivities(prev => [...prev, id]);
    if (onDismissActivity) {
      onDismissActivity(id);
    }
  };
  
  // Filtrowanie aktywności, które nie zostały usunięte i ograniczenie do 4
  const filteredActivities = activities
    .filter(item => !dismissedActivities.includes(item.id))
    .slice(0, 4);
    
  // Funkcja nawigacji do pełnej listy powiadomień
  const goToNotifications = () => {
    navigate('/profil/notifications');
  };
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row w-full gap-4 sm:gap-5">
        {/* Sekcja Ostatnio oglądane */}
        <div className="w-full md:w-1/2">
          <div className="bg-[#35530A] p-3 sm:p-4 flex items-center rounded-t-md">
            <Eye className="w-5 h-5 mr-2 text-white" />
            <h2 className="text-lg font-bold text-white">Ostatnio oglądane</h2>
          </div>
          
          {recentAds.length === 0 ? (
            <div className="bg-gray-50 p-4 text-sm text-gray-600 text-center rounded-b-md">
              Brak danych
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-3 sm:p-4 bg-white rounded-b-md">
              {recentAds.map((ad) => (
                <RecentListingItem
                  key={ad.id}
                  title={ad.title}
                  href={ad.href}
                  image={ad.image}
                  price={ad.price}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Sekcja Ostatnia aktywność */}
        <div className="w-full md:w-1/2">
          <div className="bg-[#35530A] p-3 sm:p-4 flex items-center rounded-t-md">
            <BellRing className="w-5 h-5 mr-2 text-white" />
            <h2 className="text-lg font-bold text-white">Ostatnia aktywność</h2>
          </div>
          
          {filteredActivities.length === 0 ? (
            <div className="bg-gray-50 p-4 flex flex-col items-center justify-center rounded-b-md">
              <div className="bg-gray-100 p-2 rounded-full mb-3">
                <BellRing className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-gray-600 text-center text-sm">Brak ostatnich aktywności</p>
            </div>
          ) : (
            <div>
              {filteredActivities.map((item, idx) => (
                <div 
                  key={idx} 
                  className="border-b border-green-100"
                >
                  <div className="p-3 bg-white">
                    <div className="flex items-start relative">
                      <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        {item.iconType ? getActivityIcon(item.iconType) : item.icon}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600 mb-1.5">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{item.time}</span>
                          <a href={item.href} className="text-green-800 font-medium text-xs">
                            {item.actionLabel || "Zobacz"} →
                          </a>
                        </div>
                      </div>
                      <button 
                        className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => handleDismiss(item.id)}
                        aria-label="Usuń powiadomienie"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Przycisk "Zobacz wszystkie" */}
              <div className="bg-gray-50 p-3 sm:p-4 text-center rounded-b-md">
                <button 
                  onClick={goToNotifications}
                  className="text-sm font-medium text-green-800 hover:text-green-700"
                >
                  Zobacz wszystkie powiadomienia →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;
