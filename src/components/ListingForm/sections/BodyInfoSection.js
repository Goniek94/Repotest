import React, { useState } from 'react';
import { BODY_TYPES, COLORS } from '../../../constants/vehicleOptions';
import SelectField from '../components/SelectField';

const BodyInfoSection = ({ formData, handleChange, errors }) => {
  // Stan dla śledzenia otwartych dropdown
  const [openDropdowns, setOpenDropdowns] = useState({});
  
  // Opcje dla liczby drzwi
  const doorOptions = [
    '2 drzwi',
    '3 drzwi',
    '4 drzwi',
    '5 drzwi',
    '6 drzwi'
  ];
  
  // Opcje dla wykończenia
  const finishOptions = [
    'Metalik',
    'Matowy',
    'Perłowy',
    'Standardowy'
  ];

  // Opcje tak/nie dla checkboxów
  const booleanOptions = ['Tak', 'Nie'];
  
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
        {/* Typ nadwozia - jako dropdown select */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.bodyType ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <SelectField
            name="bodyType"
            label="Typ nadwozia"
            options={BODY_TYPES}
            value={formData.bodyType || ''}
            onChange={handleOptionChange}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
            required={true}
            error={errors.bodyType}
            placeholder="Wybierz typ nadwozia"
          />
        </div>
        
        {/* Kolor - jako dropdown select */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.color ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <SelectField
            name="color"
            label="Kolor"
            options={COLORS}
            value={formData.color || ''}
            onChange={handleOptionChange}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
            required={true}
            error={errors.color}
            placeholder="Wybierz kolor"
          />
        </div>
        
        {/* Liczba drzwi - jako dropdown select */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.doors ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <SelectField
            name="doors"
            label="Liczba drzwi"
            options={doorOptions}
            value={formData.doors ? `${formData.doors} drzwi` : ''}
            onChange={(name, option) => {
              // Wyciągnij liczbę z opcji (np. "2 drzwi" -> "2")
              const doorCount = option.split(' ')[0];
              handleOptionChange(name, doorCount);
            }}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
            required={true}
            error={errors.doors}
            placeholder="Wybierz ilość drzwi"
          />
        </div>
        
        {/* Wykończenie - jako dropdown select */}
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          formData.finish ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
        }`}>
          <SelectField
            name="finish"
            label="Wykończenie"
            options={finishOptions}
            value={formData.finish || ''}
            onChange={handleOptionChange}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
            placeholder="Wybierz wykończenie"
          />
        </div>
      </div>
      
      {/* Dodatkowe cechy nadwozia - teraz jako dropdown selects */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Dodatkowe cechy nadwozia:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Szyberdach */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.hasSunroof === 'Tak' ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <SelectField
              name="hasSunroof"
              label="Szyberdach"
              options={booleanOptions}
              value={formData.hasSunroof || ''}
              onChange={handleOptionChange}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              placeholder="Wybierz"
            />
          </div>
          
          {/* Alufelgi */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.hasAlloyWheels === 'Tak' ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <SelectField
              name="hasAlloyWheels"
              label="Alufelgi"
              options={booleanOptions}
              value={formData.hasAlloyWheels || ''}
              onChange={handleOptionChange}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              placeholder="Wybierz"
            />
          </div>
          
          {/* Relingi dachowe */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.hasRoofRails === 'Tak' ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <SelectField
              name="hasRoofRails"
              label="Relingi dachowe"
              options={booleanOptions}
              value={formData.hasRoofRails || ''}
              onChange={handleOptionChange}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              placeholder="Wybierz"
            />
          </div>
          
          {/* Czujniki parkowania */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.hasParkingSensors === 'Tak' ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <SelectField
              name="hasParkingSensors"
              label="Czujniki parkowania"
              options={booleanOptions}
              value={formData.hasParkingSensors || ''}
              onChange={handleOptionChange}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              placeholder="Wybierz"
            />
          </div>
        </div>
      </div>
      
      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px]">
        <p className="text-[#35530A] text-sm">
          Dokładne dane dotyczące nadwozia i koloru pomagają potencjalnym kupującym 
          lepiej ocenić pojazd.
        </p>
      </div>
    </div>
  );
};

export default BodyInfoSection;