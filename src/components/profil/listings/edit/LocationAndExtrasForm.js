import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * Komponent formularza lokalizacji
 * Uproszczony - tylko województwo i miasto
 */
const LocationAndExtrasForm = ({ formData, onChange }) => {
  const voivodeships = [
    'DOLNOŚLĄSKIE', 'KUJAWSKO-POMORSKIE', 'LUBELSKIE', 'LUBUSKIE',
    'ŁÓDZKIE', 'MAŁOPOLSKIE', 'MAZOWIECKIE', 'OPOLSKIE',
    'PODKARPACKIE', 'PODLASKIE', 'POMORSKIE', 'ŚLĄSKIE',
    'ŚWIĘTOKRZYSKIE', 'WARMIŃSKO-MAZURSKIE', 'WIELKOPOLSKIE', 'ZACHODNIOPOMORSKIE'
  ];

  return (
    <div className="p-6 bg-white border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
        <MapPin className="w-5 h-5 mr-2 text-[#35530A]" />
        Lokalizacja
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Miasto */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="city">
            Miasto
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
            placeholder="np. Warszawa"
          />
        </div>

        {/* Województwo */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="voivodeship">
            Województwo
          </label>
          <select
            id="voivodeship"
            name="voivodeship"
            value={formData.voivodeship}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
          >
            <option value="">Wybierz województwo</option>
            {voivodeships.map(voivodeship => (
              <option key={voivodeship} value={voivodeship}>{voivodeship}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LocationAndExtrasForm;
