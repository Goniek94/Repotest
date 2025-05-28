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
  
  // Możliwości odbioru
  const pickupOptions = [
    { value: 'osobisty', label: 'Odbiór osobisty' },
    { value: 'transport', label: 'Możliwość transportu' },
    { value: 'wysylka', label: 'Wysyłka' }
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
          
          {/* Kod pocztowy */}
          <FormField
            type="text"
            label="Kod pocztowy"
            name="postalCode"
            value={formData.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            error={errors.postalCode}
            placeholder="np. 00-001"
            maxLength={6}
          />
          
          {/* Dzielnica/część miasta */}
          <FormField
            type="text"
            label="Dzielnica/Osiedle"
            name="district"
            value={formData.district || ''}
            onChange={(e) => handleChange('district', e.target.value)}
            placeholder="np. Mokotów"
          />
        </div>
        
        {/* Opcje odbioru pojazdu */}
        <div className="mt-8">
          <h4 className="font-semibold mb-3">Opcje odbioru pojazdu:</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {pickupOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData[`pickup_${option.value}`] === 'Tak'}
                  onChange={(e) => handleChange(`pickup_${option.value}`, e.target.checked ? 'Tak' : 'Nie')}
                  style={{ accentColor: '#35530A' }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
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
