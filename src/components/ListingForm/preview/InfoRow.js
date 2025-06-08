import React from 'react';

const InfoRow = ({ label, value }) => (
  <div className="p-2 bg-gray-50 rounded-[2px]">
    <div className="text-gray-600 font-medium">{label}</div>
    <div className="font-semibold text-black">{value || 'Nie podano'}</div>
  </div>
);

export default InfoRow;
