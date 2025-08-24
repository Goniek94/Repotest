import React from 'react';

const SpecItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 min-h-[28px]">
    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5">
      {React.cloneElement(icon, { className: icon.props.className || 'w-3 h-3' })}
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-xs text-gray-500 font-medium truncate leading-tight">{label || 'Info'}</div>
      <div className="text-sm font-semibold text-gray-900 truncate leading-tight">{value || '-'}</div>
    </div>
  </div>
);

export default SpecItem;
