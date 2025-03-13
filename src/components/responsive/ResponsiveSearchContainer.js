import React, { useState, useEffect } from 'react';
import SearchForm from '../SearchForm'; // Dostosuj ścieżkę do istniejącego komponentu

const ResponsiveSearchContainer = ({ screenSize }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  useEffect(() => {
    if (screenSize?.isMobile) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [screenSize]);

  const toggleCollapse = () => {
    if (screenSize?.isMobile || screenSize?.isTablet) {
      setIsCollapsed(prev => !prev);
    }
  };

  const handleAdvancedToggle = (value) => {
    setShowAdvanced(value);
  };

  return (
    <div className="bg-white shadow-md rounded-[2px] mb-4">
      {(screenSize?.isMobile || screenSize?.isTablet) && (
        <div 
          className="flex justify-between items-center p-3 bg-[#35530A] text-white cursor-pointer rounded-t-[2px]"
          onClick={toggleCollapse}
        >
          <h2 className="text-lg font-semibold">Wyszukaj pojazd</h2>
          <button className="text-white text-lg">
            {isCollapsed && !showAdvanced ? '▼' : '▲'}
          </button>
        </div>
      )}
      
      <div className={`transition-all duration-300 ${isCollapsed && !showAdvanced && (screenSize?.isMobile || screenSize?.isTablet) ? 'max-h-0 overflow-hidden' : 'max-h-[2000px] p-4'}`}>
        <SearchForm 
          isMobile={screenSize?.isMobile}
          isTablet={screenSize?.isTablet}
          onAdvancedToggle={handleAdvancedToggle}
        />
      </div>
    </div>
  );
};

export default ResponsiveSearchContainer;