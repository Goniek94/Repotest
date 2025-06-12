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
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Filtry i sortowanie */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          
          {/* Sortowanie */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Sortuj według</label>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#35530A]/20 focus:border-[#35530A] transition-all duration-200 cursor-pointer min-w-[180px]"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="none">Domyślnie</option>
                <option value="price-asc">Cena: od najniższej</option>
                <option value="price-desc">Cena: od najwyższej</option>
                <option value="year-asc">Rok: od najstarszych</option>
                <option value="year-desc">Rok: od najnowszych</option>
                <option value="mileage-asc">Przebieg: od najmniejszego</option>
                <option value="mileage-desc">Przebieg: od największego</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Typ oferty */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Typ oferty</label>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#35530A]/20 focus:border-[#35530A] transition-all duration-200 cursor-pointer min-w-[140px]"
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
              >
                <option value="all">Wszystkie</option>
                <option value="used">Używane</option>
                <option value="new">Nowe</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Checkbox wyróżnione */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Opcje</label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={() => setOnlyFeatured((prev) => !prev)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                  onlyFeatured 
                    ? 'bg-[#35530A] border-[#35530A]' 
                    : 'bg-white border-gray-300 group-hover:border-gray-400'
                }`}>
                  {onlyFeatured && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                Tylko wyróżnione
              </span>
            </label>
          </div>

        </div>

        {/* Przełącznik widoku */}
        {!isMobile && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Widok</label>
            <ViewToggle 
              view={viewMode} 
              onToggleView={setViewMode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingControls;