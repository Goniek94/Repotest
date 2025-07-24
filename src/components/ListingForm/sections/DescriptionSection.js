import React from 'react';
import { FileText } from 'lucide-react';

const DescriptionSection = ({ formData, handleChange, errors }) => {
  // Maksymalna długość opisu
  const maxDescriptionLength = 2000;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      {/* Jedna główna karta - kompaktowa */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header karty */}
        <div className="bg-gradient-to-r from-[#35530A] to-[#2D4A06] text-white p-4">
          <div className="flex items-center">
            <FileText className="h-6 w-6 mr-3" />
            <div>
              <h2 className="text-xl font-bold">Opis pojazdu</h2>
              <p className="text-green-100 text-sm">Szczegółowy opis pojazdu</p>
            </div>
          </div>
        </div>

        {/* Zawartość karty */}
        <div className="p-6">
          {/* Pole opisu - zwiększone */}
          <div className={`relative ${errors.description ? 'mb-1' : 'mb-0'}`}>
            <textarea
              name="description"
              rows="20"
              maxLength={maxDescriptionLength}
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Wpisz opis pojazdu..."
              className={`
                w-full border rounded-[2px] p-6 text-gray-700 text-base
                focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]
                ${errors.description ? 'border-red-500' : 'border-gray-300'}
              `}
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word', minHeight: '400px', fontSize: '16px', lineHeight: '1.6' }}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <div className="mt-2 text-sm text-gray-500 text-right">
              {formData.description ? formData.description.length : 0}/{maxDescriptionLength} znaków
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionSection;
