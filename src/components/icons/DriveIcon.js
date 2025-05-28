import React from "react";

const DriveIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="8" y="14" width="16" height="4" rx="2" fill="#222"/>
    <rect x="6" y="10" width="4" height="12" rx="2" fill="#222"/>
    <rect x="22" y="10" width="4" height="12" rx="2" fill="#222"/>
    <rect x="14" y="6" width="4" height="4" rx="2" fill="#222"/>
    <rect x="14" y="22" width="4" height="4" rx="2" fill="#222"/>
  </svg>
);

export default DriveIcon;
