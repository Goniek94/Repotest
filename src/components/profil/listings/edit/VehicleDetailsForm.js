import React from 'react';
import { Car } from 'lucide-react';

/**
 * Komponent formularza danych technicznych pojazdu
 * Uproszczony - tylko stan i przebieg
 */
const VehicleDetailsForm = ({ formData, onChange }) => {
  const conditions = ['Nowy', 'Używany'];

  return (
    <div className="p-6 bg-white border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
        <Car className="w-5 h-5 mr-2 text-[#35530A]" />
        Dane pojazdu
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stan */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="condition">
            Stan
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
          >
            <option value="">Wybierz stan</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {/* Przebieg */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="mileage">
            Przebieg (km)
          </label>
          <input
            type="number"
            id="mileage"
            name="mileage"
            value={formData.mileage}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
            placeholder="np. 50000"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsForm;
