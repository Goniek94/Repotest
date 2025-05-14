import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

const StatsLayout = ({ children, title }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Nagłówek */}
      <div className="pb-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaChevronLeft size={16} className="mr-1" />
          <span>Powrót</span>
        </button>
      </div>

      {/* Główna zawartość - pełna szerokość */}
      <main className="mt-8 space-y-8">
        {children}
      </main>
    </div>
  );
};

export default StatsLayout;
