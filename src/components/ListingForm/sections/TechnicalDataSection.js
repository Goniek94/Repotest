import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

const TechnicalDataSection = ({ formData, handleChange, errors }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [showCustomPaintModal, setShowCustomPaintModal] = useState(false);
  const [customPaint, setCustomPaint] = useState('');

  const FUEL_TYPES = [
    'Benzyna', 
    'Diesel', 
    'LPG', 
    'Hybryda', 
    'Hybryda plug-in', 
    'Elektryczny', 
    'CNG', 
    'Wodór'
  ];
  
  const TRANSMISSION_TYPES = [
    'Manualna', 
    'Automatyczna', 
    'Półautomatyczna', 
    'CVT'
  ];
  
  const DRIVE_TYPES = [
    'FWD (przedni)', 
    'RWD (tylny)', 
    'AWD/4x4'
  ];
  
  const PAINT_FINISHES = [
    'Metalik', 
    'Perła', 
    'Mat', 
    'Połysk', 
    'Inne'
  ];

  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleOptionChange = (name, option) => {
    if (name === 'paintFinish' && option === 'Inne') {
      setShowCustomPaintModal(true);
      setOpenDropdowns(prev => ({
        ...prev,
        [name]: false
      }));
    } else {
      handleChange(name, option);
      setOpenDropdowns(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleCustomPaintSubmit = () => {
    if (customPaint.trim()) {
      handleChange('paintFinish', customPaint.trim());
      setShowCustomPaintModal(false);
      setCustomPaint('');
    }
  };

  const handleCustomPaintCancel = () => {
    setShowCustomPaintModal(false);
    setCustomPaint('');
  };

  // Funkcja walidacji wartości liczbowych - tylko czyści input, nie ogranicza wartości
  const validateNumericInput = (name, value) => {
    // Usuń wszystkie niealfanumeryczne znaki oprócz cyfr
    const numericValue = value.replace(/[^\d]/g, '');
    return numericValue;
  };

  // Funkcja sprawdzająca czy wartość jest w realistycznym zakresie - zwraca błąd walidacyjny
  const getValidationError = (name, value) => {
    if (!value) return null;
    
    const num = parseInt(value);
    if (isNaN(num)) return null;
    
    const limits = {
      mileage: { min: 0, max: 1200000, unit: 'km', name: 'Przebieg' },
      lastOfficialMileage: { min: 0, max: 1200000, unit: 'km', name: 'Przebieg CEPiK' },
      engineSize: { min: 50, max: 8500, unit: 'cm³', name: 'Pojemność' },
      power: { min: 10, max: 2000, unit: 'KM', name: 'Moc' },
      weight: { min: 400, max: 4000, unit: 'kg', name: 'Waga' }
    };
    
    const limit = limits[name];
    if (!limit) return null;
    
    if (num < limit.min) {
      return `${limit.name} jest za niska. Minimalna wartość: ${limit.min} ${limit.unit}`;
    }
    if (num > limit.max) {
      return `${limit.name} jest za wysoka. Maksymalna wartość: ${limit.max.toLocaleString()} ${limit.unit}`;
    }
    
    return null;
  };

  // Funkcja obsługi zmiany w polach liczbowych
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateNumericInput(name, value);
    
    // Stwórz nowy event z zwalidowaną wartością
    const syntheticEvent = {
      target: {
        name: name,
        value: validatedValue
      }
    };
    
    handleChange(syntheticEvent);
  };

  const SelectField = ({ name, label, options, value, required, placeholder }) => {
    return (
      <div className="relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <div className="flex items-center gap-1">
            <span>{label}</span>
            {name === 'disabledAdapted' && (
              <div className="relative group">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Adaptacja dla osób z niepełnosprawnością
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
            {required && <span className="text-red-500">*</span>}
          </div>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown(name)}
            className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
          >
            <span className={`${value ? 'text-gray-700' : 'text-gray-500'} truncate`}>
              {value || placeholder}
            </span>
            <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${openDropdowns[name] ? 'rotate-180' : ''} text-gray-400`} />
          </button>
          
          {openDropdowns[name] && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
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
      {/* Grid z polami technicznymi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Przebieg */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            <div className="flex items-center gap-1">
              <span>Przebieg</span>
              <span className="text-red-500">*</span>
              <span className="text-gray-500">(km)</span>
            </div>
          </label>
          <input
            type="text"
            name="mileage"
            value={formData.mileage || ''}
            onChange={handleNumericChange}
            placeholder="np. 75000"
            className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
          />
          {(errors && errors.mileage) || getValidationError('mileage', formData.mileage) ? (
            <p className="text-red-500 text-sm mt-1">
              {errors?.mileage || getValidationError('mileage', formData.mileage)}
            </p>
          ) : null}
        </div>

        {/* Przebieg CEPiK */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            <div className="flex items-center gap-1">
              <span>Przebieg CEPiK</span>
              <span className="text-gray-500">(km)</span>
            </div>
          </label>
          <input
            type="text"
            name="lastOfficialMileage"
            value={formData.lastOfficialMileage || ''}
            onChange={handleNumericChange}
            placeholder="np. 70000"
            className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
          />
          {(errors && errors.lastOfficialMileage) || getValidationError('lastOfficialMileage', formData.lastOfficialMileage) ? (
            <p className="text-red-500 text-sm mt-1">
              {errors?.lastOfficialMileage || getValidationError('lastOfficialMileage', formData.lastOfficialMileage)}
            </p>
          ) : null}
        </div>

        <SelectField
          name="fuelType"
          label="Paliwo"
          options={FUEL_TYPES}
          value={formData.fuelType}
          required={true}
          placeholder="Wybierz paliwo"
        />

        {/* Pojemność */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            <div className="flex items-center gap-1">
              <span>Pojemność</span>
              <span className="text-red-500">*</span>
              <span className="text-gray-500">(cm³)</span>
            </div>
          </label>
          <input
            type="text"
            name="engineSize"
            value={formData.engineSize || ''}
            onChange={handleNumericChange}
            placeholder="np. 1600"
            className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
          />
          {(errors && errors.engineSize) || getValidationError('engineSize', formData.engineSize) ? (
            <p className="text-red-500 text-sm mt-1">
              {errors?.engineSize || getValidationError('engineSize', formData.engineSize)}
            </p>
          ) : null}
        </div>

        {/* Moc */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            <div className="flex items-center gap-1">
              <span>Moc</span>
              <span className="text-red-500">*</span>
              <span className="text-gray-500">(KM)</span>
            </div>
          </label>
          <input
            type="text"
            name="power"
            value={formData.power || ''}
            onChange={handleNumericChange}
            placeholder="np. 150"
            className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
          />
          {(errors && errors.power) || getValidationError('power', formData.power) ? (
            <p className="text-red-500 text-sm mt-1">
              {errors?.power || getValidationError('power', formData.power)}
            </p>
          ) : null}
        </div>

        {/* Waga */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            <div className="flex items-center gap-1">
              <span>Waga</span>
              <span className="text-gray-500">(kg)</span>
            </div>
          </label>
          <input
            type="text"
            name="weight"
            value={formData.weight || ''}
            onChange={handleNumericChange}
            placeholder="np. 1500"
            className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
          />
          {(errors && errors.weight) || getValidationError('weight', formData.weight) ? (
            <p className="text-red-500 text-sm mt-1">
              {errors?.weight || getValidationError('weight', formData.weight)}
            </p>
          ) : null}
        </div>

        <SelectField
          name="transmission"
          label="Skrzynia"
          options={TRANSMISSION_TYPES}
          value={formData.transmission}
          required={true}
          placeholder="Wybierz skrzynię"
        />
        <SelectField
          name="drive"
          label="Napęd"
          options={DRIVE_TYPES}
          value={formData.drive}
          required={true}
          placeholder="Wybierz napęd"
        />
        <SelectField
          name="tuning"
          label="Tuning"
          options={['Tak', 'Nie']}
          value={formData.tuning}
          required={false}
          placeholder="Wybierz"
        />
        <SelectField
          name="paintFinish"
          label="Wykończenie"
          options={PAINT_FINISHES}
          value={formData.paintFinish}
          required={true}
          placeholder="Wybierz wykończenie"
        />
      </div>

      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-md">
        <p className="text-[#35530A] text-sm">
          <strong>Wskazówka:</strong> Dokładne dane techniczne pozwalają kupującym lepiej ocenić wartość pojazdu. 
          Przebieg z CEPiK pomoże zweryfikować historię pojazdu.
        </p>
      </div>

      {/* Modal dla niestandardowego wykończenia lakieru */}
      {showCustomPaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Niestandardowe wykończenie lakieru
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Wprowadź nazwę wykończenia lakieru, która będzie wyświetlana w ogłoszeniu:
            </p>
            <input
              type="text"
              value={customPaint}
              onChange={(e) => setCustomPaint(e.target.value)}
              placeholder="np. Matowy czarny, Perłowy biały..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#35530A] mb-4"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCustomPaintSubmit();
                }
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCustomPaintCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleCustomPaintSubmit}
                disabled={!customPaint.trim()}
                className="px-4 py-2 bg-[#35530A] text-white rounded-md hover:bg-[#2a4208] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Zatwierdź
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TechnicalDataSection;
