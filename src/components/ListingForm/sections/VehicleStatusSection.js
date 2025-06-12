import React, { useState } from 'react';

const VehicleStatusSection = ({ formData, handleChange, errors }) => {
  // Stan do śledzenia otwartych/zamkniętych list rozwijanych
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Lista opcji stanu pojazdu z możliwością wyboru wielu
  const statusOptions = [
    { name: 'condition', label: 'Stan', options: ['Nowy', 'Używany'], required: true },
    { name: 'accidentStatus', label: 'Wypadkowość', options: ['Bezwypadkowy', 'Powypadkowy'] },
    { name: 'damageStatus', label: 'Uszkodzenia', options: ['Nieuszkodzony', 'Uszkodzony'] },
    { name: 'tuning', label: 'Tuning', options: ['Tak', 'Nie'] },
    { name: 'imported', label: 'Importowany', options: ['Tak', 'Nie'] },
    { name: 'registeredInPL', label: 'Zarejestrowany w PL', options: ['Tak', 'Nie'] },
    { name: 'firstOwner', label: 'Pierwszy właściciel', options: ['Tak', 'Nie'] },
    { name: 'disabledAdapted', label: 'Dla niepełnosprawnych', options: ['Tak', 'Nie'] }
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

  // Komponent pola select (lista rozwijana)
  const SelectField = ({ name, label, options, required }) => {
    const currentValue = formData[name] || '';
    
    return (
      <div className="relative">
        <label className="block font-semibold mb-3 text-gray-800">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {errors[name] && <span className="text-red-500 ml-1 text-sm">({errors[name]})</span>}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown(name)}
            className="w-full h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] bg-white text-left flex items-center justify-between"
          >
            <span className={`${currentValue ? 'text-gray-700' : 'text-gray-500'}`}>
              {currentValue || 'Wybierz'}
            </span>
            <span className={`transform transition-transform ${openDropdowns[name] ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {openDropdowns[name] && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[2px] shadow-lg overflow-y-auto">
              {options.map((option) => (
                <div 
                  key={option} 
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleOptionChange(name, option)}
                >
                  <span className={`text-sm ${currentValue === option ? 'font-semibold text-[#35530A]' : ''}`}>
                    {option}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-[2px] shadow-md">
      {/* Nagłówek przeniesiony do nadrzędnego komponentu CreateListingForm */}
      
      <div className="mb-6">
        {/* Grid z opcjami stanu pojazdu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statusOptions.slice(0, 4).map((option) => (
            <div 
              key={option.name} 
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                formData[option.name] === 'Tak' || 
                (option.name === 'condition' && formData[option.name]) ||
                (option.name === 'accidentStatus' && formData[option.name] === 'Bezwypadkowy') ||
                (option.name === 'damageStatus' && formData[option.name] === 'Nieuszkodzony')
                  ? 'border-[#35530A] bg-green-50' 
                  : 'border-gray-300'
              }`}
            >
              <SelectField 
                name={option.name} 
                label={option.label} 
                options={option.options}
                required={option.required} 
              />
            </div>
          ))}
        </div>
        
        {/* Drugi rząd opcji */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusOptions.slice(4).map((option) => (
            <div 
              key={option.name} 
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                formData[option.name] === 'Tak' ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
              }`}
            >
              <SelectField 
                name={option.name} 
                label={option.label}
                options={option.options}
                required={option.required} 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Informacja pomocnicza */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px]">
        <p className="text-[#35530A] text-sm">
          Dokładne informacje o stanie pojazdu zwiększają zaufanie do Twojego ogłoszenia. 
          Zaznacz wszystkie opcje, które opisują Twój pojazd.
        </p>
      </div>
    </div>
  );
};

export default VehicleStatusSection;