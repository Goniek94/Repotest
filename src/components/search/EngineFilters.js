import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { advancedOptions } from '../../data/searchFormData';
import { Select, RangeInputs } from './FormElements';

/**
 * Komponent zawierający filtry silnika i napędu
 * @param {Object} props - Właściwości komponentu
 * @param {Object} props.formData - Dane formularza
 * @param {Function} props.handleInputChange - Funkcja obsługująca zmiany w polach formularza
 * @returns {JSX.Element} - Komponent filtrów silnika i napędu
 */
const EngineFilters = ({ formData, handleInputChange }) => {
  return (
    <div id="advanced-filters">
      <h3 className="font-semibold text-gray-700 mb-3 text-lg">Silnik i napęd</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {/* Moc silnika */}
        <RangeInputs
          nameFrom="enginePowerFrom"
          nameTo="enginePowerTo"
          valueFrom={formData.enginePowerFrom}
          valueTo={formData.enginePowerTo}
          onChange={handleInputChange}
          label="Moc silnika (KM)"
          min="0"
        />

        {/* Pojemność silnika */}
        <RangeInputs
          nameFrom="engineCapacityFrom"
          nameTo="engineCapacityTo"
          valueFrom={formData.engineCapacityFrom}
          valueTo={formData.engineCapacityTo}
          onChange={handleInputChange}
          label="Pojemność silnika (cm³)"
          min="0"
        />

        {/* Skrzynia biegów */}
        <Select
          id="transmission"
          name="transmission"
          value={formData.transmission}
          onChange={handleInputChange}
          options={advancedOptions.transmission}
          placeholder="Wybierz skrzynię"
          label="Skrzynia biegów"
        />

        {/* Napęd */}
        <Select
          id="driveType"
          name="driveType"
          value={formData.driveType}
          onChange={handleInputChange}
          options={advancedOptions.driveType}
          placeholder="Wybierz napęd"
          label="Napęd"
        />
      </div>
    </div>
  );
};

EngineFilters.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default memo(EngineFilters);
