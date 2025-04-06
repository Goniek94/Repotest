import React from 'react';
import { useListingForm } from '../../../contexts/ListingFormContext';
import FormField from '../components/FormField';

const LocationSection = ({ formData, handleChange, errors }) => {
  // Lista województw
  const voivodeships = [
    'Dolnośląskie', 'Kujawsko-pomorskie', 'Lubelskie', 'Lubuskie', 'Łódzkie', 
    'Małopolskie', 'Mazowieckie', 'Opolskie', 'Podkarpackie', 'Podlaskie', 
    'Pomorskie', 'Śląskie', 'Świętokrzyskie', 'Warmińsko-mazurskie', 
    'Wielkopolskie', 'Zachodniopomorskie'
  ];

  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      <h2 className="text-2xl font-bold mb-6">Lokalizacja</h2>
      
      <div className="mb-6">
        <h3 className="text-white p-2 rounded-[2px] mb-2 bg-[#35530A]">
          Lokalizacja:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Województwo */}
          <FormField
            type="select"
            label="Województwo"
            name="voivodeship"
            value={formData.voivodeship}
            onChange={(e) => handleChange('voivodeship', e.target.value)}
            options={voivodeships.map(voiv => ({ value: voiv, label: voiv }))}
            placeholder="Wybierz województwo"
          />
          
          {/* Miejscowość */}
          <FormField
            type="text"
            label="Miejscowość"
            name="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="np. Warszawa"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationSection;