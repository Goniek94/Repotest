import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

const TechnicalDataSection = ({ formData, handleChange, errors }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const FUEL_TYPES = [
    'Benzyna', 
    'Diesel', 
    'Benzyna+LPG', 
    'Benzyna+CNG', 
    'Hybryda', 
    'Hybryda plug-in', 
    'Elektryczny', 
    'Etanol', 
    'Wodór', 
    'Benzyna+Etanol', 
    'Inne'
  ];
  
  const TRANSMISSION_TYPES = [
    'Manualna', 
    'Automatyczna', 
    'Półautomatyczna', 
    'Bezstopniowa CVT', 
    'Automatyczna dwusprzęgłowa', 
    'Sekwencyjna', 
    'Inne'
  ];
  
  const DRIVE_TYPES = [
    'Przedni', 
    'Tylny', 
    'Na cztery koła stały', 
    'Na cztery koła dołączany', 
    'AWD', 
    '4WD', 
    '4x4', 
    'RWD', 
    'FWD', 
    'Inne'
  ];
  
  const COUNTRIES = [
    'Polska', 
    'Niemcy', 
    'Francja', 
    'Włochy', 
    'Hiszpania', 
    'Holandia', 
    'Belgia', 
    'Czechy', 
    'Słowacja', 
    'Austria', 
    'Szwajcaria', 
    'Dania', 
    'Szwecja', 
    'Norwegia', 
    'Finlandia', 
    'Wielka Brytania', 
    'Irlandia', 
    'Portugalia', 
    'Luksemburg', 
    'Słowenia', 
    'Chorwacja', 
    'Węgry', 
    'Rumunia', 
    'Bułgaria', 
    'Litwa', 
    'Łotwa', 
    'Estonia', 
    'USA', 
    'Kanada', 
    'Japonia', 
    'Korea Południowa', 
    'Chiny', 
    'Indie', 
    'Brazylia', 
    'Meksyk', 
    'Australia', 
    'Inne'
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

  // NAPRAWIONA funkcja obsługi liczb - bez dodatkowych warunków
  const handleNumberChange = (name, value) => {
    // Bezpośrednio przekaż wartość bez dodatkowych sprawdzeń
    handleChange(name, value);
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

  const InputField = ({ name, label, value, required, placeholder, type = "text", min, max, unit }) => {
    // Funkcja do formatowania liczb z separatorami tysięcy
    const formatNumber = (value) => {
      if (!value) return '';
      // Usuń wszystkie niealfanumeryczne znaki oprócz cyfr
      const cleanValue = value.toString().replace(/[^\d]/g, '');
      if (!cleanValue) return '';
      // Dodaj spacje jako separatory tysięcy
      return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    // Funkcja do obsługi zmiany wartości w polach liczbowych
    const handleInputChange = (e) => {
      const inputValue = e.target.value;
      
      // Dla pól liczbowych (pojemność, moc, waga, przebieg)
      if (['engineSize', 'power', 'weight', 'mileage', 'lastOfficialMileage'].includes(name)) {
        // Pozwól na wpisywanie cyfr i spacji
        const allowedChars = /^[\d\s]*$/;
        if (allowedChars.test(inputValue) || inputValue === '') {
          // Przekaż surową wartość do handleChange
          handleChange(e);
        }
      } else {
        // Dla innych pól - normalne zachowanie
        handleChange(e);
      }
    };

    return (
      <div className="relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <div className="flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
            {unit && <span className="text-gray-500">({unit})</span>}
          </div>
        </label>
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
        />
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
        <InputField
          name="mileage"
          label="Przebieg"
          value={formData.mileage}
          required={true}
          placeholder="np. 75000"
          type="number"
          min="0"
          max="1000000"
          unit="km"
        />
        <InputField
          name="lastOfficialMileage"
          label="Przebieg CEPiK"
          value={formData.lastOfficialMileage}
          placeholder="np. 70000"
          type="number"
          min="0"
          max="1000000"
          unit="km"
        />
        <SelectField
          name="fuelType"
          label="Paliwo"
          options={FUEL_TYPES}
          value={formData.fuelType}
          required={true}
          placeholder="Wybierz paliwo"
        />
        <InputField
          name="engineSize"
          label="Pojemność"
          value={formData.engineSize}
          required={true}
          placeholder="np. 1600"
          type="number"
          min="0"
          max="10000"
          unit="cm³"
        />
        <InputField
          name="power"
          label="Moc"
          value={formData.power}
          required={true}
          placeholder="np. 150"
          type="number"
          min="0"
          max="2000"
          unit="KM"
        />
        <InputField
          name="weight"
          label="Waga"
          value={formData.weight}
          placeholder="np. 1500"
          type="number"
          min="0"
          max="10000"
          unit="kg"
        />
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
          name="countryOfOrigin"
          label="Kraj pochodzenia"
          options={COUNTRIES}
          value={formData.countryOfOrigin}
          required={false}
          placeholder="Wybierz kraj"
        />
      </div>

      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-md">
        <p className="text-[#35530A] text-sm">
          <strong>Wskazówka:</strong> Dokładne dane techniczne pozwalają kupującym lepiej ocenić wartość pojazdu. 
          Przebieg z CEPiK pomoże zweryfikować historię pojazdu.
        </p>
      </div>
    </div>
  );
};

export default TechnicalDataSection;
