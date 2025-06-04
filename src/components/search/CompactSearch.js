import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchForm from './useSearchForm';
import { bodyTypes, advancedOptions, generateYearOptions } from './SearchFormConstants';

/**
 * Komponent kompaktowej wyszukiwarki pojazdów do umieszczenia na stronie głównej
 * @param {Object} props
 * @param {Object} props.initialFilters - Początkowe wartości filtrów
 * @param {Function} props.onFilterChange - Funkcja wywoływana przy zmianie filtrów
 */
const CompactSearch = ({ initialFilters = {}, onFilterChange }) => {
  const navigate = useNavigate();
  
  const {
    formData,
    matchingResults,
    isLoading,
    availableBrands,
    availableModels,
    showAdvanced,
    isLoadingBrands,
    isLoadingModels,
    handleInputChange,
    toggleAdvancedFilters,
    resetForm,
    handleSearch
  } = useSearchForm(initialFilters);

  // Jeśli komponent ma funkcję zwrotną onFilterChange, wywołaj ją przy zmianie formData
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(formData);
    }
  }, [formData, onFilterChange]);

  return (
    <section className="bg-white py-4 px-3 sm:px-4 shadow-md rounded-md mb-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-xl font-bold text-[#35530A] mb-4">
          Szybkie wyszukiwanie
        </h3>

        {/* PODSTAWOWE FILTRY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
          {/* RZĄD 1 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nadwozie
            </label>
            <select
              name="bodyType"
              value={formData.bodyType || ''}
              onChange={handleInputChange}
              className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            >
              <option value="">Wybierz typ nadwozia</option>
              {bodyTypes.map((body) => (
                <option key={body} value={body}>
                  {body}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Marka
            </label>
            {isLoadingBrands ? (
              <div className="w-full h-10 flex items-center justify-center bg-gray-50 border border-gray-300 rounded-[2px]">
                <span className="text-sm text-gray-500">Ładowanie marek...</span>
              </div>
            ) : (
              <select
                name="make"
                value={formData.make || ''}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Wybierz markę</option>
                {availableBrands.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Model
            </label>
            {isLoadingModels ? (
              <div className="w-full h-10 flex items-center justify-center bg-gray-50 border border-gray-300 rounded-[2px]">
                <span className="text-sm text-gray-500">Ładowanie modeli...</span>
              </div>
            ) : (
              <select
                name="model"
                value={formData.model || ''}
                disabled={!formData.make}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] disabled:bg-gray-100"
              >
                <option value="">Wybierz model</option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cena
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="priceFrom"
                placeholder="Od"
                min="0"
                value={formData.priceFrom || ''}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
              />
              <input
                type="number"
                name="priceTo"
                placeholder="Do"
                min="0"
                value={formData.priceTo || ''}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
              />
            </div>
          </div>
        </div>

        {/* DODATKOWE FILTRY */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Rocznik
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                name="yearFrom"
                value={formData.yearFrom || ''}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-2 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Od</option>
                {generateYearOptions().map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <select
                name="yearTo"
                value={formData.yearTo || ''}
                onChange={handleInputChange}
                className="w-full h-10 text-sm px-2 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="">Do</option>
                {generateYearOptions().map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Rodzaj paliwa
            </label>
            <select
              name="fuelType"
              value={formData.fuelType || ''}
              onChange={handleInputChange}
              className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            >
              <option value="">Wybierz rodzaj paliwa</option>
              {advancedOptions.fuelType.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Skrzynia
            </label>
            <select
              name="transmission"
              value={formData.transmission || ''}
              onChange={handleInputChange}
              className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            >
              <option value="">Wybierz skrzynię</option>
              <option value="Automatyczna">Automatyczna</option>
              <option value="Manualna">Manualna</option>
              <option value="Półautomatyczna">Półautomatyczna</option>
              <option value="Dwusprzęgłowa">Dwusprzęgłowa</option>
              <option value="CVT">CVT</option>
              <option value="SMG">SMG</option>
            </select>
          </div>
        </div>

        {/* PRZYCISKI */}
        <div className="mt-5 flex flex-wrap justify-between items-center gap-4">
          <div>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium text-[#35530A] bg-gray-100 rounded hover:bg-gray-200 transition"
            >
              Wyczyść filtry
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSearch}
              className="px-6 py-2.5 text-white rounded shadow-md hover:shadow-lg bg-[#35530A] hover:bg-[#44671A] transition-all duration-300 flex items-center"
            >
              <span>Wyszukaj</span>
              {isLoading ? (
                <div className="ml-3 inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <span className="ml-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded">
                  {matchingResults}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactSearch;