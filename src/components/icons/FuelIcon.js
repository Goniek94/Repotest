import React from "react";

const FuelIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="6" y="6" width="12" height="20" rx="2" stroke="#222" strokeWidth="2" fill="#fff"/>
    <rect x="10" y="10" width="4" height="8" rx="1" fill="#222"/>
    <rect x="18" y="8" width="4" height="4" rx="1" fill="#fff" stroke="#222" strokeWidth="2"/>
    <path d="M22 10v8c0 2 2 2 2 0v-6" stroke="#222" strokeWidth="2"/>
  </svg>
);

export default FuelIcon;
