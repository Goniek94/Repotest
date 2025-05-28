import React from 'react';

const SpecItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
      {React.cloneElement(icon, { className: icon.props.className || 'w-4 h-4' })}
    </div>
    <div className="min-w-0">
      <div className="text-xs text-gray-500 font-medium truncate">{label || 'Info'}</div>
      <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{value || '-'}</div>
    </div>
  </div>
);

export default SpecItem;