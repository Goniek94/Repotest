// AdvancedFilters.js
import React from "react";

/**
 * AdvancedFilters component
 * @param {object} props
 * @returns {JSX.Element}
 */
export default function AdvancedFilters({
  formData,
  handleInputChange,
  advancedOptions,
  regions,
}) {
  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-3">Silnik i napęd</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {/* Moc */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Moc
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="enginePowerFrom"
              placeholder="Od"
              min="0"
              value={formData.enginePowerFrom}
              onChange={handleInputChange}
              className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            />
            <input
              type="number"
              name="enginePowerTo"
              placeholder="Do"
              min="0"
              value={formData.enginePowerTo}
              onChange={handleInputChange}
              className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            />
          </div>
        </div>

        {/* Pojemność */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Pojemność
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="engineCapacityFrom"
              placeholder="Od"
              min="0"
              value={formData.engineCapacityFrom}
              onChange={handleInputChange}
              className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            />
            <input
              type="number"
              name="engineCapacityTo"
              placeholder="Do"
              min="0"
              value={formData.engineCapacityTo}
              onChange={handleInputChange}
              className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            />
          </div>
        </div>

        {/* Skrzynia */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Skrzynia
          </label>
          <div className="grid grid-cols-2 gap-1">
            {advancedOptions.transmission.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="radio"
                  id={`transmission-${type}`}
                  name="transmission"
                  value={type}
                  checked={formData.transmission === type}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={`transmission-${type}`} className="text-sm">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Napęd */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Napęd
          </label>
          <div className="grid grid-cols-3 gap-1">
            {advancedOptions.driveType.slice(0, 3).map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="radio"
                  id={`drive-${type}`}
                  name="driveType"
                  value={type}
                  checked={formData.driveType === type}
                  onChange={handleInputChange}
                  className="mr-1"
                />
                <label htmlFor={`drive-${type}`} className="text-xs">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-700 mt-5 mb-3">Forma sprzedaży i lokalizacja</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {/* Kraj pochodzenia */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kraj pochodzenia
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Wybierz kraj</option>
            {advancedOptions.country.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Województwo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Województwo
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Wybierz województwo</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Forma sprzedaży */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Forma sprzedaży
          </label>
          <select
            name="sellingForm"
            value={formData.sellingForm}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Wybierz formę</option>
            {advancedOptions.sellingForm.map((form) => (
              <option key={form} value={form}>
                {form}
              </option>
            ))}
          </select>
        </div>

        {/* Sprzedawca */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Sprzedawca
          </label>
          <div className="grid grid-cols-2 gap-1">
            {advancedOptions.sellerType.map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="radio"
                  id={`seller-${type}`}
                  name="sellerType"
                  value={type}
                  checked={formData.sellerType === type}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={`seller-${type}`} className="text-sm">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 mt-4 rounded-[2px]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="vat"
              name="vat"
              checked={formData.vat}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="vat" className="text-sm font-medium">FV 23%</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="invoiceOptions"
              name="invoiceOptions"
              checked={formData.invoiceOptions}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="invoiceOptions" className="text-sm font-medium">Możliwość faktura/paragon</label>
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-700 mt-5 mb-3">Nadwozie</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {/* Stan uszkodzeń */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Stan uszkodzeń
          </label>
          <select
            name="damageStatus"
            value={formData.damageStatus}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Wybierz stan</option>
            {advancedOptions.damageStatus.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Bezwypadkowy */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Bezwypadkowy
          </label>
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="accident-yes"
                name="vehicleStatus"
                value="Bezwypadkowy"
                checked={formData.vehicleStatus === "Bezwypadkowy"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="accident-yes" className="text-sm">Tak</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="accident-no"
                name="vehicleStatus"
                value="Uszkodzony"
                checked={formData.vehicleStatus === "Uszkodzony"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="accident-no" className="text-sm">Nie</label>
            </div>
          </div>
        </div>

        {/* Kierownica po prawej */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kierownica po prawej
          </label>
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="rightSteering-yes"
                name="vehicleStatus"
                value="Kierownica po prawej"
                checked={formData.vehicleStatus === "Kierownica po prawej"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="rightSteering-yes" className="text-sm">Tak</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="rightSteering-no"
                name="vehicleStatus"
                value=""
                checked={!formData.vehicleStatus || (formData.vehicleStatus !== "Kierownica po prawej")}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="rightSteering-no" className="text-sm">Nie</label>
            </div>
          </div>
        </div>
        
        {/* Dla niepełnosprawnych */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Przystosowany dla niepełnosprawnych
          </label>
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="disabled-yes"
                name="vehicleStatus"
                value="Przystosowany dla niepełnosprawnych"
                checked={formData.vehicleStatus === "Przystosowany dla niepełnosprawnych"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="disabled-yes" className="text-sm">Tak</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="disabled-no"
                name="vehicleStatus"
                value=""
                checked={!formData.vehicleStatus || (formData.vehicleStatus !== "Przystosowany dla niepełnosprawnych")}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="disabled-no" className="text-sm">Nie</label>
            </div>
          </div>
        </div>
        
        {/* Kolor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kolor
          </label>
          <select
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          >
            <option value="">Wybierz kolor</option>
            {advancedOptions.color.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Liczba drzwi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Liczba drzwi
          </label>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {advancedOptions.doorCount.map((count) => (
              <div key={count} className="flex items-center">
                <input
                  type="radio"
                  id={`doors-${count}`}
                  name="doorCount"
                  value={count}
                  checked={formData.doorCount === count}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={`doors-${count}`} className="text-sm">
                  {count}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tuning */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tuning
          </label>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {advancedOptions.tuning.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`tuning-${option}`}
                  name="tuning"
                  value={option}
                  checked={formData.tuning === option}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor={`tuning-${option}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
