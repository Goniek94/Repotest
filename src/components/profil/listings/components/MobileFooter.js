import React from 'react';

const MobileFooter = ({ 
  allListings, 
  activeTab 
}) => {
  const getTabLabel = () => {
    switch(activeTab) {
      case 'active': return 'Aktywne';
      case 'drafts': return 'Wersje robocze';
      case 'favorites': return 'Ulubione';
      case 'completed': return 'Zakończone';
      default: return '';
    }
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-3">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {allListings.length > 0 
            ? `${allListings.length} ${allListings.length === 1 ? 'ogłoszenie' : 'ogłoszeń'}`
            : 'Brak ogłoszeń'
          }
        </span>
        <span className="text-[#35530A] font-medium">
          {getTabLabel()}
        </span>
      </div>
    </div>
  );
};

export default MobileFooter;
