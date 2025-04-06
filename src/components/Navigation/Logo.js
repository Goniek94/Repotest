import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center h-12">
      <img
        src="/images/autosell12.svg"
        alt="AUTOSELL"
        className="w-80 h-auto object-contain transition-transform duration-300 hover:scale-[1.03]"
        onError={(e) => {
          e.target.outerHTML = `
            <span class="text-lg font-bold uppercase text-[#35530A]">
              AUTO<span class="text-yellow-500">SELL</span>
            </span>
          `;
        }}
      />
    </Link>
  );
};

export default Logo;
