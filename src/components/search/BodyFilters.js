import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { advancedOptions } from '../../data/searchFormData';
import { Select, RadioGroup } from './FormElements';

/**
 * Komponent zawierający filtry nadwozia
 * @param {Object} props - Właściwości komponentu
 * @param {Object} props.formData - Dane formularza
 * @param {Function} props.handleInputChange - Funkcja obsługująca zmiany w polach formularza
 * @returns {JSX.Element} - Komponent filtrów nadwozia
 */
const BodyFilters = ({ formData, handleInputChange }) => {
  // Przygotowanie opcji dla RadioGroup
  const accidentOptions = [
    { value: "Bezwypadkowy", label: "Tak" },
    { value: "Uszkodzony", label: "Nie" }
  ];

  const rightSteeringOptions = [
    { value: "Kierownica po prawej", label: "Tak" },
    { value: "", label: "Nie" }
  ];

  const disabledOptions = [
    { value: "Przystosowany dla niepełnosprawnych", label: "Tak" },
    { value: "", label: "Nie" }
  ];

  const doorOptions = advancedOptions.doorCount.map(count => ({
    value: count,
    label: count
  }));

  const tuningOptions = advancedOptions.tuning.map(option => ({
    value: option,
    label: option
  }));

  return (
    <>
      <h3 className="font-semibold text-gray-700 mt-5 mb-3 text-lg">Nadwozie</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
        {/* Stan uszkodzeń */}
        <Select
          id="damageStatus"
          name="damageStatus"
          value={formData.damageStatus}
          onChange={handleInputChange}
          options={advancedOptions.damageStatus}
          placeholder="Wybierz stan"
          label="Stan uszkodzeń"
        />

        {/* Bezwypadkowy */}
        <RadioGroup
          name="vehicleStatus"
          options={accidentOptions}
          value={formData.vehicleStatus}
          onChange={handleInputChange}
          label="Bezwypadkowy"
        />

        {/* Kierownica po prawej */}
        <RadioGroup
          name="vehicleStatus"
          options={rightSteeringOptions}
          value={formData.vehicleStatus}
          onChange={handleInputChange}
          label="Kierownica po prawej"
        />
        
        {/* Dla niepełnosprawnych */}
        <RadioGroup
          name="vehicleStatus"
          options={disabledOptions}
          value={formData.vehicleStatus}
          onChange={handleInputChange}
          label="Przystosowany dla niepełnosprawnych"
        />
        
        {/* Kolor */}
        <Select
          id="color"
          name="color"
          value={formData.color}
          onChange={handleInputChange}
          options={advancedOptions.color}
          placeholder="Wybierz kolor"
          label="Kolor"
        />

        {/* Liczba drzwi */}
        <RadioGroup
          name="doorCount"
          options={doorOptions}
          value={formData.doorCount}
          onChange={handleInputChange}
          label="Liczba drzwi"
        />
        
        {/* Tuning */}
        <RadioGroup
          name="tuning"
          options={tuningOptions}
          value={formData.tuning}
          onChange={handleInputChange}
          label="Tuning"
        />
      </div>
    </>
  );
};

BodyFilters.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default memo(BodyFilters);
