import React, { useState } from 'react';
import { ChevronDown, MapPin, CheckCircle } from 'lucide-react';

const LocationSection = ({ formData, handleChange, errors }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const voivodeships = [
    'Dolnośląskie', 'Kujawsko-pomorskie', 'Lubelskie', 'Lubuskie', 'Łódzkie', 
    'Małopolskie', 'Mazowieckie', 'Opolskie', 'Podkarpackie', 'Podlaskie', 
    'Pomorskie', 'Śląskie', 'Świętokrzyskie', 'Warmińsko-mazurskie', 
    'Wielkopolskie', 'Zachodniopomorskie'
  ];

  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleOptionChange = (name, option) => {
    handleChange(name, option);
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: false
    }));
  };

  const SelectField = ({ name, label, options, value, required, placeholder }) => {
    return (
      <div className="relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <div className="flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </div>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown(name)}
            className={`w-full h-9 text-sm px-3 border rounded-md bg-white text-left flex items-center justify-between transition-all duration-200 ${
              value 
                ? 'border-[#35530A] bg-white' 
                : 'border-gray-300 hover:border-gray-400 focus:border-[#35530A]'
            }`}
          >
            <span className={`${value ? 'text-gray-700' : 'text-gray-500'} truncate`}>
              {value || placeholder}
            </span>
            <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${openDropdowns[name] ? 'rotate-180' : ''} text-gray-400`} />
          </button>
          
          {openDropdowns[name] && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {options.map((option) => (
                <div 
                  key={option} 
                  className={`px-3 py-2 cursor-pointer transition-colors text-sm ${
                    value === option
                      ? 'bg-[#35530A] text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleOptionChange(name, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors && errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  // Funkcja formatowania nazwy miasta
  const formatCityName = (cityName) => {
    if (!cityName) return '';
    
    // Lista słów, które powinny pozostać małe (przedimki, spójniki)
    const smallWords = ['i', 'na', 'nad', 'pod', 'w', 'z', 'ze', 'do', 'od', 'o'];
    
    return cityName
      .toLowerCase()
      .split(/[\s-]/)
      .map((word, index) => {
        // Pierwsza litera zawsze wielka, lub jeśli nie jest małym słowem
        if (index === 0 || !smallWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(cityName.includes('-') ? '-' : ' ');
  };

  // Obsługa zmiany dla pola miasta z formatowaniem
  const handleCityChange = (e) => {
    const formattedCity = formatCityName(e.target.value);
    const syntheticEvent = {
      target: {
        name: 'city',
        value: formattedCity
      }
    };
    handleChange(syntheticEvent);
  };

  const InputField = ({ name, label, value, required, placeholder }) => {
    return (
      <div className="relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <div className="flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </div>
        </label>
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={name === 'city' ? handleCityChange : handleChange}
          placeholder={placeholder}
          className={`w-full h-9 text-sm px-3 border rounded-md transition-all duration-200 ${
            value 
              ? 'border-[#35530A] bg-white' 
              : 'border-gray-300 hover:border-gray-400 focus:border-[#35530A]'
          }`}
        />
        {errors && errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
          
          {/* Kompaktowa siatka pól lokalizacji */}
          <div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                name="voivodeship"
                label="Województwo"
                options={voivodeships}
                value={formData.voivodeship}
                required={true}
                placeholder="Wybierz województwo"
                errors={errors}
              />
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <div className="flex items-center gap-1">
                    <span>Miejscowość</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleCityChange}
                  placeholder="np. Warszawa"
                  className={`w-full h-9 text-sm px-3 border rounded-md transition-all duration-200 ${
                    formData.city 
                      ? 'border-[#35530A] bg-white' 
                      : 'border-gray-300 hover:border-gray-400 focus:border-[#35530A]'
                  }`}
                />
                {errors && errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Podgląd lokalizacji */}
          {(formData.voivodeship || formData.city) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#35530A]" />
                Lokalizacja pojazdu:
              </h4>
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {formData.city && `${formData.city}`}
                  {formData.city && formData.voivodeship && ', '}
                  {formData.voivodeship && `woj. ${formData.voivodeship}`}
                </span>
              </div>
            </div>
          )}

          {/* Informacje pomocnicze */}
          <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-md">
            <p className="text-[#35530A] text-sm">
              <strong>Wskazówka:</strong> Precyzyjne podanie lokalizacji ułatwia kupującym oszacowanie odległości 
              i zaplanowanie oględzin pojazdu. Podaj przynajmniej województwo i miejscowość.
            </p>
    </div>
    </div>
  );
};

export default LocationSection;
