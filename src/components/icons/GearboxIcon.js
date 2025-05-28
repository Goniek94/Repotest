import React from "react";

const GearboxIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke="#222" strokeWidth="2" fill="#fff"/>
    <text x="16" y="13" textAnchor="middle" fontSize="7" fill="#222" fontFamily="Arial">R</text>
    <text x="16" y="20" textAnchor="middle" fontSize="7" fill="#222" fontFamily="Arial">1 3 5</text>
    <text x="16" y="27" textAnchor="middle" fontSize="7" fill="#222" fontFamily="Arial">2 4 6</text>
  </svg>
);

export default GearboxIcon;
