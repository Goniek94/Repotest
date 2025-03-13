import React from 'react';

const SpecItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-1">
    {React.cloneElement(icon, { className: 'w-3.5 h-3.5' })}
    <div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      <div className="text-xs sm:text-sm font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);

export default SpecItem;
