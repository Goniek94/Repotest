import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, CheckCircle, Plus, FileText } from 'lucide-react';
import { FiBarChart2 } from 'react-icons/fi';

const MobileTabsNavigation = ({ 
  activeTab, 
  setActiveTab, 
  allListings, 
  localDrafts 
}) => {
  const navigate = useNavigate();

  const categories = [
    { 
      id: 'active', 
      label: 'Aktywne', 
      icon: CheckCircle, 
      count: allListings.filter(listing => listing.status === 'active').length 
    },
    { 
      id: 'drafts', 
      label: 'Wersje robocze', 
      icon: FileText, 
      count: allListings.filter(listing => 
        listing.status === 'pending' || 
        listing.status === 'needs_changes' || 
        listing.isVersionRobocza
      ).length + localDrafts.length 
    },
    { 
      id: 'favorites', 
      label: 'Ulubione', 
      icon: Heart, 
      count: allListings.filter(listing => listing.isFavorite).length 
    },
    { 
      id: 'completed', 
      label: 'Zakończone', 
      icon: FiBarChart2, 
      count: allListings.filter(listing => 
        listing.status === 'archived' || 
        listing.status === 'sold'
      ).length 
    },
    { 
      id: 'add', 
      label: 'Dodaj', 
      icon: Plus, 
      count: 0 
    }
  ];

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'add') {
      navigate('/dodaj-ogloszenie');
    } else {
      setActiveTab(categoryId);
    }
  };

  const categoryColors = {
    'active': { gradient: 'from-[#35530A] to-[#4a6b0f]', bg: 'bg-[#35530A]/5', icon: 'text-[#35530A]' },
    'drafts': { gradient: 'from-[#35530A]/80 to-[#4a6b0f]/80', bg: 'bg-[#35530A]/3', icon: 'text-[#35530A]/80' },
    'favorites': { gradient: 'from-[#35530A]/70 to-[#4a6b0f]/70', bg: 'bg-[#35530A]/3', icon: 'text-[#35530A]/70' },
    'completed': { gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', icon: 'text-gray-600' },
    'add': { gradient: 'from-[#35530A] to-[#4a6b0f]', bg: 'bg-[#35530A]/5', icon: 'text-[#35530A]' }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex justify-center gap-3 relative">
          {categories.map(category => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            const hasCount = category.count > 0;
            const colors = categoryColors[category.id];
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex items-center justify-center
                  w-14 h-14 rounded-2xl
                  transition-all duration-300 ease-out
                  relative transform hover:scale-105
                  ${isActive 
                    ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg scale-105` 
                    : `${colors.bg} hover:shadow-md border border-gray-100 hover:border-gray-200`
                  }
                `}
                title={category.label}
              >
                {/* Efekt świetlny dla aktywnej kategorii */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                )}
                
                <Icon className={`w-6 h-6 relative z-10 ${
                  isActive ? 'text-white' : colors.icon
                }`} />
                
                {hasCount && (
                  <div className={`
                    absolute -top-1 -right-1 z-20
                    w-6 h-6 
                    rounded-full text-xs font-bold 
                    flex items-center justify-center
                    transition-all duration-300
                    ${isActive 
                      ? 'bg-white/90 text-gray-800 shadow-sm' 
                      : 'bg-red-500 text-white shadow-md'
                    }
                  `}>
                    {category.count > 9 ? '9+' : category.count}
                  </div>
                )}
                
                {/* Animowany pasek na dole dla aktywnej kategorii */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/40 rounded-t-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileTabsNavigation;
