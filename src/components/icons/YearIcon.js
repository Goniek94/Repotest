import React from "react";

const YearIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="6" y="10" width="20" height="16" rx="2" stroke="#222" strokeWidth="2" fill="#fff"/>
    <rect x="10" y="6" width="2" height="4" rx="1" fill="#222"/>
    <rect x="20" y="6" width="2" height="4" rx="1" fill="#222"/>
    <rect x="10" y="14" width="12" height="2" rx="1" fill="#222"/>
    <rect x="10" y="18" width="12" height="2" rx="1" fill="#222"/>
    <rect x="10" y="22" width="12" height="2" rx="1" fill="#222"/>
  </svg>
);

export default YearIcon;
