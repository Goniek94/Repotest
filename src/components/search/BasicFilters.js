import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { bodyTypes } from '../../data/searchFormData';
import { Select, RangeInputs } from './FormElements';

/**
 * Komponent zawierający podstawowe filtry wyszukiwania pojazdów
 * @param {Object} props - Właściwości komponentu
 * @param {Object} props.formData - Dane formularza
 * @param {Function} props.handleInputChange - Funkcja obsługująca zmiany w polach formularza
 * @param {Array} props.availableBrands - Lista dostępnych marek
 * @param {Array} props.availableModels - Lista dostępnych modeli
 * @param {boolean} props.loadingBrands - Czy trwa ładowanie marek
 * @returns {JSX.Element} - Komponent podstawowych filtrów
 */
const BasicFilters = ({ 
  formData, 
  handleInputChange, 
  availableBrands, 
  availableModels, 
  loadingBrands 
}) => {
  // Generuj listę roczników wstecz (np. od 1990)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
  }, []);

  // Opcje paliwa
  const fuelOptions = ['Benzyna', 'Diesel', 'Elektryczny', 'Hybrydowy', 'LPG', 'CNG'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
      {/* Nadwozie */}
      <Select 
        id="bodyType"
        name="bodyType"
        value={formData.bodyType}
        onChange={handleInputChange}
        options={bodyTypes}
        placeholder="Wybierz typ nadwozia"
        label="Nadwozie"
      />

      {/* Marka */}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1" htmlFor="make">
          Marka
        </label>
        <div className="relative">
          <select
            id="make"
            name="make"
            value={formData.make}
            onChange={handleInputChange}
            disabled={loadingBrands}
            className="w-full h-11 text-base px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] disabled:bg-gray-100"
            aria-label="Wybierz markę"
          >
            <option value="">
              {loadingBrands ? 'Ładowanie marek...' : 'Wybierz markę'}
            </option>
            {availableBrands.map((make) => (
              <option key={make} value={make}>
                {make.replace('_', ' ')}
              </option>
            ))}
          </select>
          {loadingBrands && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Model */}
      <Select 
        id="model"
        name="model"
        value={formData.model}
        onChange={handleInputChange}
        options={availableModels}
        placeholder="Wybierz model"
        label="Model"
        className={!formData.make ? 'bg-gray-100' : ''}
        disabled={!formData.make}
      />

      {/* Rocznik */}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">
          Rocznik
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            name="yearFrom"
            value={formData.yearFrom}
            onChange={handleInputChange}
            className="w-full h-11 text-base px-2 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            aria-label="Rocznik od"
          >
            <option value="">Od</option>
            {yearOptions.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
          <select
            name="yearTo"
            value={formData.yearTo}
            onChange={handleInputChange}
            className="w-full h-11 text-base px-2 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            aria-label="Rocznik do"
          >
            <option value="">Do</option>
            {yearOptions.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cena */}
      <RangeInputs
        nameFrom="priceFrom"
        nameTo="priceTo"
        valueFrom={formData.priceFrom}
        valueTo={formData.priceTo}
        onChange={handleInputChange}
        label="Cena"
        min="0"
      />

      {/* Przebieg */}
      <RangeInputs
        nameFrom="mileageFrom"
        nameTo="mileageTo"
        valueFrom={formData.mileageFrom}
        valueTo={formData.mileageTo}
        onChange={handleInputChange}
        label="Przebieg"
        min="0"
      />

      {/* Rodzaj paliwa */}
      <Select 
        id="fuelType"
        name="fuelType"
        value={formData.fuelType}
        onChange={handleInputChange}
        options={fuelOptions}
        placeholder="Wybierz rodzaj paliwa"
        label="Rodzaj paliwa"
      />
    </div>
  );
};

BasicFilters.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  availableBrands: PropTypes.array.isRequired,
  availableModels: PropTypes.array.isRequired,
  loadingBrands: PropTypes.bool
};

export default memo(BasicFilters);
