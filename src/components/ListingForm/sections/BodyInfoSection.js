import React, { useState } from 'react';

const BodyInfoSection = ({ formData, handleChange, errors }) => {
  // Stan do śledzenia otwartych/zamkniętych list rozwijanych
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Opcje dla różnych pól nadwozia
  const BODY_TYPES = [
    'Sedan', 'Hatchback', 'Kombi', 'SUV', 'Coupe', 'Cabrio', 
    'Pickup', 'Van', 'Minivan', 'Limuzyna', 'Roadster', 'Targa'
  ];

  const DOOR_OPTIONS = ['1', '2', '3', '4', '5', '6'];
  const SEAT_OPTIONS = ['2', '3', '4', '5', '6', '7', '8', '9+'];

  const COLORS = [
    'Biały', 'Czarny', 'Srebrny', 'Szary', 'Niebieski', 'Czerwony', 
    'Zielony', 'Żółty', 'Brązowy', 'Złoty', 'Fioletowy', 'Pomarańczowy', 'Inne'
  ];

  // Lista opcji nadwozia i koloru
  const bodyOptions = [
    { name: 'bodyType', label: 'Typ nadwozia', options: BODY_TYPES, required: true },
    { name: 'color', label: 'Kolor', options: COLORS, required: true },
    { name: 'doors', label: 'Liczba drzwi', options: DOOR_OPTIONS, required: true },
    { name: 'seats', label: 'Liczba miejsc', options: SEAT_OPTIONS, required: true }
  ];

  // Obsługa otwierania/zamykania listy rozwijanej
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

  // Komponent pola select (lista rozwijana) - PROSTY STYL JAK NA SCREENIE
  const SelectField = ({ name, label, options, required }) => {
    const currentValue = formData[name] || '';
    
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
            className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
          >
            <span className={`${currentValue ? 'text-gray-700' : 'text-gray-500'} truncate`}>
              {currentValue || 'Wybierz'}
            </span>
            <span className={`text-gray-400 transform transition-transform ${openDropdowns[name] ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {openDropdowns[name] && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {options.map((option) => (
                <div 
                  key={option} 
                  className={`px-3 py-2 cursor-pointer transition-colors text-sm ${
                    currentValue === option
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

  return (
    <div className="space-y-6">
      {/* Grid z polami - 5 pól w jednej linii */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {bodyOptions.map((option) => (
          <SelectField 
            key={option.name}
            name={option.name} 
            label={option.label} 
            options={option.options}
            required={option.required} 
          />
        ))}
      </div>
      
      {/* Informacja pomocnicza */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-md">
        <p className="text-[#35530A] text-sm">
          <strong>Wskazówka:</strong> Dokładne dane dotyczące nadwozia i koloru pomagają potencjalnym kupującym lepiej ocenić pojazd. 
          Wszystkie te informacje będą widoczne w ogłoszeniu.
        </p>
      </div>
    </div>
  );
};

export default BodyInfoSection;
