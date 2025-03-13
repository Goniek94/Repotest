import React, { useState } from 'react';
import FeaturedListings from '../FeaturedListings'; // Dostosuj ścieżkę do istniejącego komponentu

const ResponsiveListingsContainer = ({ screenSize }) => {
  const [viewMode, setViewMode] = useState('grid');

  // Określ liczbę kolumn w zależności od rozmiaru ekranu
  const getColumnsCount = () => {
    if (screenSize?.isMobile) return 1;
    if (screenSize?.isTablet) return 2;
    if (screenSize?.isLaptop) return 3;
    return 4; // desktop
  };

  return (
    <div className="bg-white shadow-md rounded-[2px]">
      {/* Przełącznik widoku na mobile */}
      {screenSize?.isMobile && (
        <div className="border-b border-gray-200 p-2 flex justify-end">
          <div className="inline-flex rounded-[2px] overflow-hidden">
            <button 
              className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-[#35530A] text-white' : 'bg-gray-100'}`}
              onClick={() => setViewMode('grid')}
            >
              Siatka
            </button>
            <button 
              className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-[#35530A] text-white' : 'bg-gray-100'}`}
              onClick={() => setViewMode('list')}
            >
              Lista
            </button>
          </div>
        </div>
      )}
      
      {/* Przekaż właściwości do komponentu ogłoszeń */}
      <div className="p-3">
        <FeaturedListings 
          isMobile={screenSize?.isMobile}
          isTablet={screenSize?.isTablet}
          columnsCount={getColumnsCount()}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};

export default ResponsiveListingsContainer;