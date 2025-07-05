import React, { useState } from 'react';
import { ChevronDown, Car, CheckCircle } from 'lucide-react';
import useListingForm from '../hooks/useListingForm';

const BodyInfoSection = () => {
  const { formData, handleChange, errors } = useListingForm();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const BODY_TYPES = [
    'Sedan', 'Hatchback', 'Kombi', 'SUV', 'Coupe', 'Cabrio', 'Minivan', 
    'Pickup', 'Kompakt', 'Limuzyna', 'Crossover', 'Roadster'
  ];

  const COLORS = [
    'Biały', 'Czarny', 'Srebrny', 'Szary', 'Czerwony', 'Niebieski', 
    'Zielony', 'Żółty', 'Brązowy', 'Fioletowy', 'Pomarańczowy', 'Złoty', 'Inne'
  ];

  const DOOR_OPTIONS = ['2 drzwi', '3 drzwi', '4 drzwi', '5 drzwi', '6 drzwi'];

  const FINISH_OPTIONS = ['Metalik', 'Matowy', 'Perłowy', 'Standardowy'];

  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleOptionChange = (name, option) => {
    if (name === 'doors') {
      // Wyciągnij liczbę z opcji (np. "2 drzwi" -> "2")
      const doorCount = option.split(' ')[0];
      handleChange(name, doorCount);
    } else {
      handleChange(name, option);
    }
    
    // Zamknij dropdown po wybraniu opcji
    setTimeout(() => {
      setOpenDropdowns(prev => ({
        ...prev,
        [name]: false
      }));
    }, 100);
  };

  // Obliczanie postępu wypełnienia
  const requiredFields = ['bodyType', 'color', 'doors'];
  const filledFields = requiredFields.filter(field => formData[field]).length;
  const progress = Math.round((filledFields / requiredFields.length) * 100);

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
                errors[name] 
                  ? 'border-red-500 bg-red-50' 
                  : value 
                    ? 'border-[#35530A] bg-white' 
                    : 'border-gray-300 hover:border-gray-400 focus:border-[#35530A]'
              }`}
            >
              <span className={`${value ? 'text-gray-700' : 'text-gray-500'} truncate`}>
                {name === 'doors' && value ? `${value} drzwi` : value || placeholder}
              </span>
              <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${openDropdowns[name] ? 'rotate-180' : ''} text-gray-400`} />
            </button>
          
          {openDropdowns[name] && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {options.map((option) => (
                <div 
                  key={option} 
                  className={`px-3 py-2 cursor-pointer transition-colors text-sm ${
                    (name === 'doors' && value === option.split(' ')[0]) || value === option
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
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      
      {/* Jedna główna karta - kompaktowa */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header karty z postępem */}
        <div className="bg-gradient-to-r from-[#35530A] to-[#2D4A06] text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">Nadwozie i kolor</h2>
                <p className="text-green-100 text-sm">Wygląd zewnętrzny pojazdu</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{progress}%</div>
              <div className="text-green-100 text-sm">ukończone</div>
            </div>
          </div>
          
          {/* Pasek postępu */}
          <div className="mt-3 bg-green-900/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Zawartość karty */}
        <div className="p-6 space-y-6">
          
          {/* Kompaktowa siatka wszystkich pól */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#35530A] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-800">Parametry nadwozia</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SelectField
                name="bodyType"
                label="Typ nadwozia"
                options={BODY_TYPES}
                value={formData.bodyType}
                required={true}
                placeholder="Wybierz typ"
              />
              <SelectField
                name="color"
                label="Kolor"
                options={COLORS}
                value={formData.color}
                required={true}
                placeholder="Wybierz kolor"
              />
              <SelectField
                name="doors"
                label="Liczba drzwi"
                options={DOOR_OPTIONS}
                value={formData.doors}
                required={true}
                placeholder="Wybierz ilość"
              />
              <SelectField
                name="finish"
                label="Wykończenie"
                options={FINISH_OPTIONS}
                value={formData.finish}
                placeholder="Wybierz wykończenie"
              />
            </div>
          </div>


          {/* Podgląd wybranych opcji */}
          {(formData.bodyType || formData.color || formData.doors || formData.finish) && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#35530A]" />
                Podgląd pojazdu:
              </h4>
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {formData.bodyType && `${formData.bodyType}`}
                  {formData.color && ` ${formData.color}`}
                  {formData.doors && ` ${formData.doors}-drzwiowy`}
                  {formData.finish && ` (${formData.finish})`}
                </span>
              </div>
            </div>
          )}

          {/* Informacje pomocnicze */}
          <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-md">
            <p className="text-[#35530A] text-sm">
              <strong>Wskazówka:</strong> Dokładne dane dotyczące nadwozia i koloru pomagają potencjalnym kupującym 
              lepiej ocenić pojazd wizualnie przed oględzinami. Dodaj zdjęcia, aby zwiększyć atrakcyjność ogłoszenia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyInfoSection;
