import React from 'react';
import { BellRing, Eye } from 'lucide-react';
import ActivityItem from '../components/ActivityItem';
import RecentListingItem from '../components/RecentListingItem';
import { useNavigate } from 'react-router-dom';

/**
 * Komponent sekcji aktywności użytkownika
 * @param {Object} props - Właściwości komponentu
 * @param {Array} props.recentAds - Lista ostatnio przeglądanych ogłoszeń
 * @param {Array} props.activities - Lista aktywności użytkownika
 */
const ActivitySection = ({ recentAds = [], activities = [] }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col w-full gap-4">
        {/* Sekcja Ostatnio oglądane */}
        <div className="w-full">
          <div className="bg-[#35530A] p-3 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-white" />
            <h2 className="text-lg font-bold text-white">Ostatnio oglądane</h2>
          </div>
          
          {recentAds.length === 0 ? (
            <div className="bg-gray-50 p-4 text-sm text-gray-600 text-center">
              Brak danych
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-3 bg-white">
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
        <div className="w-full">
          <div className="bg-[#35530A] p-3 flex items-center">
            <BellRing className="w-5 h-5 mr-2 text-white" />
            <h2 className="text-lg font-bold text-white">Ostatnia aktywność</h2>
          </div>
          
          {activities.length === 0 ? (
            <div className="bg-gray-50 p-4 flex flex-col items-center justify-center">
              <div className="bg-gray-100 p-2 rounded-full mb-3">
                <BellRing className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-gray-600 text-center text-sm">Brak ostatnich aktywności</p>
            </div>
          ) : (
            <div>
              {activities.map((item, idx) => (
                <div 
                  key={idx} 
                  className="border-b border-green-100"
                >
                  <div className="p-3 bg-white">
                    <div className="flex items-start">
                      <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        {item.icon}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;