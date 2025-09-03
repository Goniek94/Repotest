// src/components/listings/controls/ListingControls.jsx
import React from 'react';
import { LayoutList, Grid2x2, ChevronDown } from 'lucide-react';

const baseSelect =
  'w-full h-9 rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-[#35530A]/30 focus:border-[#35530A]';

const IconButton = ({ active, title, onClick, children, className = '' }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    className={
      'h-9 w-9 rounded-md grid place-items-center border transition ' +
      (active
        ? 'bg-[#35530A] text-white border-[#35530A]'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50') +
      (className ? ` ${className}` : '')
    }
  >
    {children}
  </button>
);

const ListingControls = ({
  sortType,
  setSortType,
  offerType,
  setOfferType,
  onlyFeatured,
  setOnlyFeatured,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 px-4 py-3 sm:py-4">
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 sm:gap-4">
        {/* Lewy blok: Sort / Typ / Opcje */}
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Sortuj według */}
          <div className="flex flex-col">
            <label className="text-xs sm:text-sm text-gray-600 mb-1">Sortuj według</label>
            <div className="relative">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className={baseSelect}
              >
                <option value="none">Domyślnie</option>
                <option value="price-asc">Cena: rosnąco</option>
                <option value="price-desc">Cena: malejąco</option>
                <option value="year-desc">Rok: nowsze</option>
                <option value="year-asc">Rok: starsze</option>
                <option value="mileage-asc">Przebieg: rosnąco</option>
                <option value="mileage-desc">Przebieg: malejąco</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                ⌄
              </span>
            </div>
          </div>

          {/* Typ oferty */}
          <div className="flex flex-col">
            <label className="text-xs sm:text-sm text-gray-600 mb-1">Typ oferty</label>
            <div className="relative">
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                className={baseSelect}
              >
                <option value="all">Wszystkie</option>
                <option value="private">Prywatne</option>
                <option value="dealer">Firma</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                ⌄
              </span>
            </div>
          </div>

          {/* Opcje */}
          <div className="flex flex-col">
            <label className="text-xs sm:text-sm text-gray-600 mb-1">Opcje</label>
            <label htmlFor="onlyFeatured" className="flex items-center h-9 select-none cursor-pointer">
              <input
                id="onlyFeatured"
                type="checkbox"
                checked={onlyFeatured}
                onChange={(e) => setOnlyFeatured(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-[#35530A] focus:ring-[#35530A]"
              />
              <span className="text-sm text-gray-800">Tylko wyróżnione</span>
            </label>
          </div>
        </div>

        {/* Prawy blok: przełącznik widoku (ukryty na mobile dla kompaktu) */}
        <div className="md:col-span-3">
          <div className="hidden md:flex items-center justify-end gap-2">
            <span className="text-sm text-gray-600 mr-1">Widok</span>
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="h-9 px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              {viewMode === 'list' ? <LayoutList className="w-4 h-4" /> : <Grid2x2 className="w-4 h-4" />}
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingControls;
