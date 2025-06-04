// BasicFilters.js
import React from "react";

/**
 * BasicFilters component
 * @param {object} props
 * @returns {JSX.Element}
 */
export default function BasicFilters({
  formData,
  handleInputChange,
  carData,
  bodyTypes,
  availableModels,
  generateYearOptions,
  advancedOptions,
  regions,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
      {/* Nadwozie */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Nadwozie
        </label>
        <select
          name="bodyType"
          value={formData.bodyType}
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

      {/* Marka */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Marka
        </label>
        <select
          name="make"
          value={formData.make}
          onChange={handleInputChange}
          className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
        >
          <option value="">Wybierz markę</option>
          {Object.keys(carData).map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Model
        </label>
        <select
          name="model"
          value={formData.model}
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
      </div>

      {/* Generacja (rocznik) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Generacja (rocznik)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            name="yearFrom"
            value={formData.yearFrom}
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
            value={formData.yearTo}
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

      {/* Cena */}
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
            value={formData.priceFrom}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          />
          <input
            type="number"
            name="priceTo"
            placeholder="Do"
            min="0"
            value={formData.priceTo}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          />
        </div>
      </div>

      {/* Rocznik */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Rocznik
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="yearFrom"
            placeholder="Od"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.yearFrom}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          />
          <input
            type="number"
            name="yearTo"
            placeholder="Do"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.yearTo}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          />
        </div>
      </div>

      {/* Przebieg */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Przebieg
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="mileageFrom"
            placeholder="Od"
            min="0"
            value={formData.mileageFrom}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          />
          <input
            type="number"
            name="mileageTo"
            placeholder="Do"
            min="0"
            value={formData.mileageTo}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          />
        </div>
      </div>

      {/* Rodzaj paliwa */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Rodzaj paliwa
        </label>
        <select
          name="fuelType"
          value={formData.fuelType}
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
    </div>
  );
}