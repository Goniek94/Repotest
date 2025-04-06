import React from 'react';
import { useListingForm } from '../../../contexts/ListingFormContext';
import FormField from '../components/FormField';
const BodyInfoSection = ({ formData, handleChange, errors }) => {
  // Opcje dla typu nadwozia
  const bodyTypes = [
    'Hatchback', 'Sedan', 'Kombi', 'SUV', 'Coupe',
    'Cabrio', 'Terenowe', 'Minivan', 'Dostawcze'
  ];
  
  // Opcje dla koloru
  const colors = [
    'Czarny', 'Biały', 'Srebrny', 'Czerwony', 'Niebieski', 
    'Zielony', 'Żółty', 'Brązowy', 'Złoty', 'Szary', 'Inny'
  ];
  
  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      <h2 className="text-2xl font-bold mb-6">Nadwozie</h2>
      
      <div className="mb-6">
        <h3 className="text-white p-2 rounded-[2px] mb-2 bg-[#35530A]">
          Nadwozie
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Typ nadwozia */}
          <div>
            <label className="block mb-1 font-bold">Typ nadwozia</label>
            <div className="grid grid-cols-3 gap-2">
              {bodyTypes.map((type) => (
                <label key={type} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="bodyType"
                    value={type}
                    checked={formData.bodyType === type}
                    onChange={(e) => handleChange('bodyType', e.target.value)}
                    style={{ accentColor: '#35530A' }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Kolor */}
          <FormField
            type="select"
            label="Kolor"
            name="color"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            options={colors.map(color => ({ value: color, label: color }))}
            placeholder="Wybierz kolor"
          />
          
          {/* Liczba drzwi */}
          <FormField
            type="number"
            label="Liczba drzwi"
            name="doors"
            value={formData.doors}
            onChange={(e) => handleChange('doors', e.target.value)}
            min="2"
            max="6"
            placeholder="np. 5"
          />
        </div>
      </div>
    </div>
  );
};

export default BodyInfoSection;