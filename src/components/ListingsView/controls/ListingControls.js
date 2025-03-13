import React from 'react';
import ViewToggle from './ViewToggle'; 

const ListingControls = ({ 
  sortType, 
  setSortType, 
  offerType, 
  setOfferType,
  onlyFeatured,
  setOnlyFeatured,
  viewMode,
  setViewMode,
  isMobile
}) => {
  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-[2px] shadow-sm space-y-2 sm:space-y-0">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="border border-gray-300 p-2 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="none">Brak sortowania</option>
          <option value="price-asc">Cena: rosnąco</option>
          <option value="price-desc">Cena: malejąco</option>
          <option value="year-asc">Rok: rosnąco</option>
          <option value="year-desc">Rok: malejąco</option>
          <option value="mileage-asc">Przebieg: rosnąco</option>
          <option value="mileage-desc">Przebieg: malejąco</option>
        </select>

        <select
          className="border border-gray-300 p-2 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
          value={offerType}
          onChange={(e) => setOfferType(e.target.value)}
        >
          <option value="all">Wszystkie</option>
          <option value="used">Używane</option>
          <option value="new">Nowe</option>
        </select>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyFeatured}
            onChange={() => setOnlyFeatured((prev) => !prev)}
            className="w-4 h-4 rounded border-[#35530A] text-[#35530A] focus:ring-[#35530A]"
          />
          <span>Tylko wyróżnione</span>
        </label>
      </div>

      {!isMobile && (
        <ViewToggle 
          view={viewMode} 
          onToggleView={setViewMode}
        />
      )}
    </div>
  );
};

export default ListingControls;