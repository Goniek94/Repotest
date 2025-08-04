import React, { useState } from 'react';
import { FaMapMarkedAlt, FaGlobe, FaSave, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AddressCard = ({ formData, handleChange, handleSubmit, isSaving }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const getAddressPreview = () => {
    const parts = [];
    if (formData.street) parts.push(formData.street);
    if (formData.city) parts.push(formData.city);
    if (formData.postalCode) parts.push(formData.postalCode);
    if (formData.country) parts.push(formData.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Nie podano adresu';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header - kliknięty rozwija/zwija */}
      <div 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleToggle}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaMapMarkedAlt className="text-2xl mr-4" />
              <div>
                <h3 className="text-xl font-bold">Adres zamieszkania</h3>
                <p className="text-blue-100 mt-1">Możesz edytować te informacje</p>
              </div>
            </div>
            <div className="text-white">
              {isExpanded ? <FaChevronUp className="w-5 h-5" /> : <FaChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>
        
        {/* Preview adresu gdy zwinięte */}
        {!isExpanded && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Aktualny adres:</p>
            <p className="text-gray-900 font-medium">{getAddressPreview()}</p>
          </div>
        )}
      </div>

      {/* Expanded Content - formularz */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ulica - pełna szerokość */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaMapMarkedAlt className="mr-2 text-blue-500" />
                  Ulica i numer domu
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street || ''}
                  onChange={handleChange}
                  placeholder="np. ul. Główna 123"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                />
              </div>

              {/* Miasto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaMapMarkedAlt className="mr-2 text-blue-500" />
                  Miasto
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  placeholder="np. Warszawa"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                />
              </div>

              {/* Kod pocztowy */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaMapMarkedAlt className="mr-2 text-blue-500" />
                  Kod pocztowy
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode || ''}
                  onChange={handleChange}
                  placeholder="np. 00-001"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                />
              </div>

              {/* Kraj */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaGlobe className="mr-2 text-blue-500" />
                  Kraj
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country || 'Polska'}
                  onChange={handleChange}
                  placeholder="np. Polska"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Przycisk zapisu */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`inline-flex items-center px-8 py-4 border border-transparent rounded-xl shadow-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 
                  ${isSaving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-500/25'
                  } 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-3" />
                    Zapisz zmiany adresu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
