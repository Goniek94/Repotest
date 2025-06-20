import React from 'react';
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
      {/* Nagłówek główny przeniesiony do komponentu CreateListingForm */}
      
      <div className="mb-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Województwo */}
          <FormField
            type="select"
            label="Województwo*"
            name="voivodeship"
            value={formData.voivodeship}
            onChange={(e) => handleChange('voivodeship', e.target.value)}
            error={errors.voivodeship}
            options={voivodeships.map(voiv => ({ value: voiv, label: voiv }))}
            placeholder="Wybierz województwo"
          />
          
          {/* Miejscowość */}
          <FormField
            type="text"
            label="Miejscowość*"
            name="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            error={errors.city}
            placeholder="np. Warszawa"
          />
          
        </div>
        
      </div>
      
      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px] mt-4">
        <p className="text-[#35530A] text-sm font-medium">
          Precyzyjne podanie lokalizacji ułatwia kupującym oszacowanie odległości 
          i zaplanowanie oględzin pojazdu. Jeśli nie chcesz podawać dokładnego adresu, 
          wypełnij tylko pola obowiązkowe (województwo i miejscowość).
        </p>
      </div>
    </div>
  );
};

export default LocationSection;
