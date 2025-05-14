import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { advancedOptions, regions } from '../../data/searchFormData';
import { Select, RadioGroup, Checkbox } from './FormElements';

/**
 * Komponent zawierający filtry formy sprzedaży i lokalizacji
 * @param {Object} props - Właściwości komponentu
 * @param {Object} props.formData - Dane formularza
 * @param {Function} props.handleInputChange - Funkcja obsługująca zmiany w polach formularza
 * @returns {JSX.Element} - Komponent filtrów formy sprzedaży i lokalizacji
 */
const SaleFilters = ({ formData, handleInputChange }) => {
  // Przygotowanie opcji dla RadioGroup
  const sellerOptions = advancedOptions.sellerType.map(type => ({
    value: type,
    label: type
  }));

  return (
    <>
      <h3 className="font-semibold text-gray-700 mt-5 mb-3 text-lg">Forma sprzedaży i lokalizacja</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {/* Kraj pochodzenia */}
        <Select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          options={advancedOptions.country}
          placeholder="Wybierz kraj"
          label="Kraj pochodzenia"
        />

        {/* Województwo */}
        <Select
          id="region"
          name="region"
          value={formData.region}
          onChange={handleInputChange}
          options={regions}
          placeholder="Wybierz województwo"
          label="Województwo"
        />

        {/* Forma sprzedaży */}
        <Select
          id="sellingForm"
          name="sellingForm"
          value={formData.sellingForm}
          onChange={handleInputChange}
          options={advancedOptions.sellingForm}
          placeholder="Wybierz formę"
          label="Forma sprzedaży"
        />

        {/* Sprzedawca */}
        <RadioGroup
          name="sellerType"
          options={sellerOptions}
          value={formData.sellerType}
          onChange={handleInputChange}
          label="Sprzedawca"
        />
      </div>

      {/* Opcje faktury */}
      <div className="bg-gray-50 p-3 mt-4 rounded-[2px]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Checkbox
            id="vat"
            name="vat"
            checked={formData.vat}
            onChange={handleInputChange}
            label="FV 23%"
          />
          <Checkbox
            id="invoiceOptions"
            name="invoiceOptions"
            checked={formData.invoiceOptions}
            onChange={handleInputChange}
            label="Możliwość faktura/paragon"
          />
        </div>
      </div>
    </>
  );
};

SaleFilters.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default memo(SaleFilters);
