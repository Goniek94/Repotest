// src/components/admin/components/SearchFilterBar.js
/**
 * Komponent paska wyszukiwania i filtrowania dla panelu administratora
 * Search and filter bar component for admin panel
 */

import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchFilterBar = ({ 
  title, 
  searchPlaceholder, 
  searchTerm, 
  onSearchChange, 
  filter, 
  onFilterChange,
  filterOptions 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilterBar;
