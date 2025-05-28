import React from "react";

const MileageIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke="#222" strokeWidth="2" fill="#fff"/>
    <path d="M16 16 L16 8" stroke="#222" strokeWidth="2"/>
    <path d="M16 16 L24 16" stroke="#222" strokeWidth="2"/>
    <circle cx="16" cy="16" r="2" fill="#222"/>
  </svg>
);

export default MileageIcon;
