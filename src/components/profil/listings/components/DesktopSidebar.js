import React from 'react';
import { Heart, CheckCircle, FileText } from 'lucide-react';
import { FiBarChart2 } from 'react-icons/fi';

const DesktopSidebar = ({ 
  activeTab, 
  setActiveTab, 
  allListings, 
  localDrafts 
}) => {
  const categories = [
    {
      id: 'active',
      label: 'Aktywne ogłoszenia',
      icon: CheckCircle,
      count: allListings.filter(listing => listing.status === 'active').length,
      gradient: 'from-[#35530A] to-[#4a6b0f]',
      bgColor: 'bg-[#35530A]/5',
      iconColor: 'text-[#35530A]'
    },
    {
      id: 'drafts',
      label: 'Wersja robocza',
      icon: FileText,
      count: allListings.filter(listing => 
        listing.status === 'pending' || 
        listing.status === 'needs_changes' || 
        listing.isVersionRobocza
      ).length + localDrafts.length,
      gradient: 'from-[#35530A]/80 to-[#4a6b0f]/80',
      bgColor: 'bg-[#35530A]/3',
      iconColor: 'text-[#35530A]/80'
    },
    {
      id: 'favorites',
      label: 'Ulubione',
      icon: Heart,
      count: allListings.filter(listing => listing.isFavorite).length,
      gradient: 'from-[#35530A]/70 to-[#4a6b0f]/70',
      bgColor: 'bg-[#35530A]/3',
      iconColor: 'text-[#35530A]/70'
    },
    {
      id: 'completed',
      label: 'Zakończone',
      icon: FiBarChart2,
      count: allListings.filter(listing => 
        listing.status === 'archived' || 
        listing.status === 'sold'
      ).length,
      gradient: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="hidden lg:block lg:w-64 flex-shrink-0 border-r border-gray-200">
      <div className="bg-gradient-to-b from-gray-50 to-white h-full relative flex flex-col">
        <div className="p-4 pb-2 flex-shrink-0">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              KATEGORIE
            </h3>
            <div className="w-10 h-0.5 bg-gradient-to-r from-[#35530A] to-green-400 rounded-full"></div>
          </div>
        </div>
        
        {/* Scrollable categories container */}
        <div 
          className="flex-1 overflow-y-auto px-4 pb-16"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 3px;
              transition: background 0.2s ease;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          {/* Desktop - przestronne karty kategorii */}
          <div className="space-y-3">
            {categories.map(category => {
              const Icon = category.icon;
              const isActive = activeTab === category.id;
              const hasCount = category.count > 0;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`
                    w-full group relative overflow-hidden
                    rounded-xl transition-all duration-300 ease-out
                    transform hover:scale-[1.02] hover:shadow-lg
                    ${isActive 
                      ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg scale-[1.02]` 
                      : `${category.bgColor} hover:shadow-md border border-gray-100 hover:border-gray-200`
                    }
                  `}
                >
                  {/* Tło z efektem świetlnym dla aktywnej kategorii */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                  )}
                  
                  <div className="relative px-4 py-3 flex items-center">
                    {/* Ikona z tłem */}
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center mr-3
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : 'bg-white shadow-sm group-hover:shadow-md'
                      }
                    `}>
                      <Icon className={`w-5 h-5 ${
                        isActive ? 'text-white' : category.iconColor
                      }`} />
                    </div>
                    
                    {/* Tekst kategorii */}
                    <div className="flex-1 text-left">
                      <span className={`
                        font-semibold text-xs
                        ${isActive ? 'text-white' : 'text-gray-800'}
                      `}>
                        {category.label}
                      </span>
                    </div>
                    
                    {/* Licznik */}
                    {hasCount && (
                      <div className={`
                        px-3 py-1.5 rounded-full text-xs font-bold
                        transition-all duration-300
                        ${isActive 
                          ? 'bg-white/25 text-white backdrop-blur-sm' 
                          : 'bg-red-500 text-white shadow-sm'
                        }
                      `}>
                        {category.count > 99 ? '99+' : category.count}
                      </div>
                    )}
                  </div>
                  
                  {/* Animowany pasek na dole dla aktywnej kategorii */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-xl">
                      <div className="h-full bg-white/50 rounded-b-xl animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Dekoracyjny element na dole */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gradient-to-r from-[#35530A]/5 to-green-400/5 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-[#35530A] rounded-full animate-pulse"></div>
              <p className="text-xs text-[#35530A] font-medium">
                Zarządzaj swoimi ogłoszeniami
              </p>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
