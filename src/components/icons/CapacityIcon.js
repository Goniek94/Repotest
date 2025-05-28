import React from "react";

const CapacityIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="8" y="6" width="16" height="20" rx="4" stroke="#222" strokeWidth="2" fill="#fff"/>
    <rect x="12" y="18" width="8" height="6" rx="2" fill="#222"/>
    <rect x="12" y="10" width="8" height="6" rx="2" fill="#bbb"/>
  </svg>
);

export default CapacityIcon;
