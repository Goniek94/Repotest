import React, { useState } from 'react';
import { ChevronDown, Shield, CheckCircle, X } from 'lucide-react';

const VehicleStatusSection = ({ formData, handleChange, errors }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const statusOptions = [
    { name: 'condition', label: 'Stan', options: ['Nowy', 'Używany'], required: true },
    { name: 'accidentStatus', label: 'Wypadkowość', options: ['Bezwypadkowy', 'Powypadkowy'], required: false },
    { name: 'damageStatus', label: 'Uszkodzenia', options: ['Nieuszkodzony', 'Uszkodzony'], required: false },
    { name: 'tuning', label: 'Tuning', options: ['Tak', 'Nie'], required: false },
    { name: 'imported', label: 'Importowany', options: ['Tak', 'Nie'], required: false },
    { name: 'registeredInPL', label: 'Zarejestrowany w PL', options: ['Tak', 'Nie'], required: false },
    { name: 'firstOwner', label: 'Pierwszy właściciel', options: ['Tak', 'Nie'], required: false },
    { name: 'disabledAdapted', label: 'Dla niepełnosprawnych', options: ['Tak', 'Nie'], required: false }
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

  // Obliczanie postępu wypełnienia
  const requiredFields = ['condition'];
  const filledFields = requiredFields.filter(field => formData[field]).length;
  const progress = Math.round((filledFields / requiredFields.length) * 100);

  // Sprawdzanie pozytywnych statusów
  const getStatusColor = (name, value) => {
    const positiveValues = {
      condition: 'Nowy',
      accidentStatus: 'Bezwypadkowy',
      damageStatus: 'Nieuszkodzony',
      tuning: 'Nie',
      imported: 'Nie',
      registeredInPL: 'Tak',
      firstOwner: 'Tak',
      disabledAdapted: 'Tak'
    };
    
    if (value === positiveValues[name]) {
      return 'text-green-600 bg-green-50';
    } else if (value && value !== positiveValues[name]) {
      return 'text-orange-600 bg-orange-50';
    }
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusIcon = (name, value) => {
    const positiveValues = {
      condition: 'Nowy',
      accidentStatus: 'Bezwypadkowy',
      damageStatus: 'Nieuszkodzony',
      tuning: 'Nie',
      imported: 'Nie',
      registeredInPL: 'Tak',
      firstOwner: 'Tak',
      disabledAdapted: 'Tak'
    };
    
    if (value === positiveValues[name]) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (value && value !== positiveValues[name]) {
      return <X className="h-4 w-4 text-orange-600" />;
    }
    return null;
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
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
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

  return (
    <div className="space-y-6">
      {/* Kompaktowa siatka wszystkich pól */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#35530A] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
          <h3 className="text-lg font-semibold text-gray-800">Stan i historia pojazdu</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusOptions.map((option) => (
            <SelectField
              key={option.name}
              name={option.name}
              label={option.label}
              options={option.options}
              value={formData[option.name]}
              required={option.required}
              placeholder="Wybierz"
            />
          ))}
        </div>
      </div>

      {/* Podsumowanie statusów */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Podsumowanie stanu:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {statusOptions.map((option) => {
            const value = formData[option.name];
            if (!value) return null;
            
            return (
              <div
                key={option.name}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${getStatusColor(option.name, value)}`}
              >
                {getStatusIcon(option.name, value)}
                <span>{option.label}: {value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-md">
        <p className="text-[#35530A] text-sm">
          <strong>Wskazówka:</strong> Dokładne informacje o stanie pojazdu zwiększają zaufanie do ogłoszenia. 
          Zielone oznaczenia wskazują na pozytywne cechy pojazdu.
        </p>
      </div>
    </div>
  );
};

export default VehicleStatusSection;
