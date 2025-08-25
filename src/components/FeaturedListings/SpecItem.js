import React from 'react';

const SpecItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 sm:gap-2 min-h-[36px] sm:min-h-[32px]">
    <div className="flex-shrink-0 w-5 h-5 sm:w-4 sm:h-4 flex items-center justify-center">
      {React.cloneElement(icon, { 
        className: `${icon.props.className || 'w-4 h-4 sm:w-3.5 sm:h-3.5'} font-bold text-gray-800` 
      })}
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-xs text-gray-500 font-medium truncate leading-tight">{label || 'Info'}</div>
      <div className="text-sm sm:text-sm text-gray-900 truncate leading-tight">{value || '-'}</div>
    </div>
  </div>
);

export default SpecItem;
