import React, { useState } from 'react';
import ActivityItem from '../components/ActivityItem';
import RecentListingItem from '../components/RecentListingItem';
import { useNavigate } from 'react-router-dom';

// Komponenty ikon SVG
const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 19.718A8.966 8.966 0 0112 21a8.966 8.966 0 017.132-1.282M6 9a6 6 0 1112 0c0 1.887.454 3.665 1.257 5.234a.75.75 0 01-.515 1.07L12 16.5l-6.742-1.196a.75.75 0 01-.515-1.07A9.97 9.97 0 006 9z" />
  </svg>
);

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
      <div className="flex flex-col md:flex-row w-full gap-6">
        {/* Sekcja Ostatnio oglądane */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-5" style={{background: 'linear-gradient(135deg, #35530A, #4a7c0c, #35530A)'}}>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 text-white">
                  <EyeIcon />
                </div>
                <h2 className="text-lg font-bold text-white">Ostatnio oglądane</h2>
              </div>
            </div>
            
            {recentAds.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-green-50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 text-gray-400">
                    <EyeIcon />
                  </div>
                </div>
                <p className="text-gray-600 font-medium">Brak ostatnio oglądanych</p>
                <p className="text-sm text-gray-500 mt-1">Przeglądaj ogłoszenia, aby zobaczyć je tutaj</p>
              </div>
            ) : (
              <div className="p-4 sm:p-5 bg-white space-y-3">
                {recentAds.map((ad, index) => (
                  <div 
                    key={ad.id}
                    className="transform transition-all duration-200 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <RecentListingItem
                      title={ad.title}
                      href={ad.href}
                      image={ad.image}
                      price={ad.price}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Sekcja Ostatnia aktywność */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-5" style={{background: 'linear-gradient(135deg, #35530A, #4a7c0c, #35530A)'}}>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-3 text-white">
                  <BellIcon />
                </div>
                <h2 className="text-lg font-bold text-white">Ostatnia aktywność</h2>
              </div>
            </div>
            
            {filteredActivities.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-green-50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 text-gray-400">
                    <BellIcon />
                  </div>
                </div>
                <p className="text-gray-600 font-medium">Brak ostatnich aktywności</p>
                <p className="text-sm text-gray-500 mt-1">Nowe powiadomienia pojawią się tutaj</p>
              </div>
            ) : (
              <div className="bg-white">
                {filteredActivities.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`border-b border-gray-100 last:border-b-0 transform transition-all duration-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-600 mb-2 leading-relaxed">{item.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.time}</span>
                            <a 
                              href={item.href} 
                              className="inline-flex items-center text-blue-600 hover:text-purple-600 font-medium text-xs transition-colors duration-200"
                            >
                              {item.actionLabel || "Zobacz"}
                              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          </div>
                        </div>
                        <button 
                          className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                          onClick={() => handleDismiss(item.id)}
                          aria-label="Usuń powiadomienie"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Przycisk "Zobacz wszystkie" */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-5 text-center border-t border-gray-100">
                  <button 
                    onClick={goToNotifications}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Zobacz wszystkie powiadomienia
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;
