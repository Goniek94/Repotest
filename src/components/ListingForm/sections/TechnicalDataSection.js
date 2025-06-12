import React, { useState } from 'react';
import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  DRIVE_TYPES,
  COUNTRIES
} from '../../../constants/vehicleOptions';
import SelectField from '../components/SelectField';

const TechnicalDataSection = ({ formData, handleChange, errors }) => {
  // Stan dla śledzenia otwartych dropdowns
  const [openDropdowns, setOpenDropdowns] = useState({});
  
  // Obsługa przełączania dropdown
  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Obsługa zmiany opcji
  const handleOptionChange = (name, option) => {
    handleChange(name, option);
    // Zamknij dropdown po wyborze opcji
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: false
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Przebieg - jako input numeryczny w ujednoliconym kontenerze */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.mileage ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <label className="block font-semibold mb-3 text-gray-800">
            Przebieg (km){errors.mileage ? <span className="text-red-500 ml-1">*</span> : '*'}
            {errors.mileage && <span className="text-red-500 ml-1 text-sm">({errors.mileage})</span>}
          </label>
          <div className="relative h-10"> {/* Stała wysokość dla dopasowania do SelectField */}
            <input
              type="number"
              name="mileage"
              value={formData.mileage || ''}
              onChange={(e) => handleChange('mileage', e.target.value)}
              min="0"
              max="1000000"
              placeholder="np. 75000"
              className={`w-full h-full text-sm px-3 border ${errors.mileage ? 'border-red-500' : 'border-gray-300'} rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]`}
            />
          </div>
        </div>
        
        {/* Ostatni przebieg CEPiK - jako input numeryczny w ujednoliconym kontenerze */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.lastOfficialMileage ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <label className="block font-semibold mb-3 text-gray-800">
            Ostatni przebieg (CEPiK)
          </label>
          <div className="relative h-10"> {/* Stała wysokość dla dopasowania do SelectField */}
            <input
              type="number"
              name="lastOfficialMileage"
              value={formData.lastOfficialMileage || ''}
              onChange={(e) => handleChange('lastOfficialMileage', e.target.value)}
              min="0"
              max="1000000"
              placeholder="np. 70000"
              className="w-full h-full text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Z ostatniego badania technicznego
          </div>
        </div>
        
        {/* Rodzaj paliwa - jako SelectField */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.fuelType ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <SelectField
            name="fuelType"
            label="Rodzaj paliwa"
            options={FUEL_TYPES}
            value={formData.fuelType || ''}
            onChange={handleOptionChange}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
            required={true}
            error={errors.fuelType}
            placeholder="Wybierz rodzaj paliwa"
          />
        </div>
        
        {/* Skrzynia biegów - jako SelectField */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.transmission ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <SelectField
            name="transmission"
            label="Skrzynia biegów"
            options={TRANSMISSION_TYPES}
            value={formData.transmission || ''}
            onChange={handleOptionChange}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
            required={true}
            error={errors.transmission}
            placeholder="Wybierz typ skrzyni"
          />
        </div>
        
        {/* Napęd - jako SelectField */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.drive ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <SelectField
            name="drive"
            label="Napęd"
            options={DRIVE_TYPES}
            value={formData.drive || ''}
            onChange={handleOptionChange}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
            required={true}
            error={errors.drive}
            placeholder="Wybierz napęd"
          />
        </div>
        
        {/* Kraj pochodzenia - jako SelectField */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.countryOfOrigin ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <SelectField
            name="countryOfOrigin"
            label="Kraj pochodzenia"
            options={COUNTRIES}
            value={formData.countryOfOrigin || ''}
            onChange={handleOptionChange}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
            placeholder="Wybierz kraj"
          />
        </div>
      </div>
      
      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px]">
        <p className="text-[#35530A] text-sm">
          Dokładne dane techniczne pozwolą kupującym lepiej ocenić wartość Twojego pojazdu
          i zdecydować, czy spełnia on ich wymagania.
        </p>
      </div>
    </div>
  );
};

export default TechnicalDataSection;