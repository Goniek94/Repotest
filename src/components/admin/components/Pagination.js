// src/components/admin/components/Pagination.js
/**
 * Komponent paginacji dla panelu administratora
 * Pagination component for admin panel
 */

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-gray-700">
        Strona <span className="font-medium">{currentPage}</span> z <span className="font-medium">{totalPages}</span>
      </div>
      
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 border rounded-md ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Poprzednia
        </button>
        
        <button
          className={`px-4 py-2 border rounded-md ${
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Następna
        </button>
      </div>
    </div>
  );
};

export default Pagination;
