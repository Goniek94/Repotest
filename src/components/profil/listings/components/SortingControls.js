import React from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

const SortingControls = ({ sortBy, sortOrder, onSortChange, listingsCount }) => {
  const sortOptions = [
    { value: 'createdAt', label: 'Data dodania' },
    { value: 'price', label: 'Cena' },
    { value: 'title', label: 'Nazwa' },
    { value: 'year', label: 'Rok produkcji' },
    { value: 'mileage', label: 'Przebieg' },
    { value: 'views', label: 'Wyświetlenia' },
    { value: 'status', label: 'Status' }
  ];

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle order if same field
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default order for new field
      const defaultOrder = field === 'createdAt' ? 'desc' : 
                          field === 'price' ? 'asc' : 
                          field === 'views' ? 'desc' : 'asc';
      onSortChange(field, defaultOrder);
    }
  };

  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || 'Data dodania';

  return (
    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span className="font-medium">{listingsCount}</span>
        <span>
          {listingsCount === 1 ? 'ogłoszenie' : 
           listingsCount < 5 ? 'ogłoszenia' : 'ogłoszeń'}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 font-medium">Sortuj:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] cursor-pointer"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        
        <button
          onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
          className={`p-1.5 rounded-md border transition-colors ${
            sortOrder === 'desc' 
              ? 'bg-[#35530A] text-white border-[#35530A]' 
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
          }`}
          title={`Sortuj ${sortOrder === 'asc' ? 'malejąco' : 'rosnąco'}`}
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SortingControls;
