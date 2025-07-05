import React, { useState } from 'react';
import { ChevronDown, Settings, CheckCircle } from 'lucide-react';

const TechnicalDataSection = ({ formData, handleChange, errors }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const FUEL_TYPES = ['Benzyna', 'Diesel', 'Benzyna+LPG', 'Benzyna+CNG', 'Hybryda', 'Elektryczny', 'Etanol'];
  const TRANSMISSION_TYPES = ['Manualna', 'Automatyczna', 'Półautomatyczna', 'Bezstopniowa CVT'];
  const DRIVE_TYPES = ['Przedni', 'Tylny', 'Na cztery koła'];
  const COUNTRIES = ['Polska', 'Niemcy', 'Francja', 'Włochy', 'Hiszpania', 'Holandia', 'Belgia', 'Czechy', 'Słowacja', 'Inne'];

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

  const InputField = ({ name, label, value, required, placeholder, type = "text", min, max, unit }) => {
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
          type={type}
          value={value || ''}
          onChange={(e) => handleChange(name, e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
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
    <div className="max-w-6xl mx-auto p-4 bg-white">
      
      {/* Jedna główna karta - kompaktowa */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header karty bez postępu */}
        <div className="bg-gradient-to-r from-[#35530A] to-[#2D4A06] text-white p-4">
          <div className="flex items-center">
            <Settings className="h-6 w-6 mr-3" />
            <div>
              <h2 className="text-xl font-bold">Dane techniczne</h2>
              <p className="text-green-100 text-sm">Parametry techniczne pojazdu</p>
            </div>
          </div>
        </div>

        {/* Zawartość karty */}
        <div className="p-6 space-y-6">
          
          {/* Kompaktowa siatka wszystkich pól */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#35530A] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-800">Wszystkie dane techniczne</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                errors={errors}
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
                errors={errors}
              />
              <SelectField
                name="fuelType"
                label="Paliwo"
                options={FUEL_TYPES}
                value={formData.fuelType}
                required={true}
                placeholder="Wybierz paliwo"
                errors={errors}
              />
              <InputField
                name="engineSize"
                label="Pojemność"
                value={formData.engineSize}
                placeholder="np. 1600"
                type="number"
                min="0"
                max="10000"
                unit="cm³"
                errors={errors}
              />
              <InputField
                name="power"
                label="Moc"
                value={formData.power}
                placeholder="np. 150"
                type="number"
                min="0"
                max="2000"
                unit="KM"
                errors={errors}
              />
              <SelectField
                name="transmission"
                label="Skrzynia"
                options={TRANSMISSION_TYPES}
                value={formData.transmission}
                required={true}
                placeholder="Wybierz skrzynię"
                errors={errors}
              />
              <SelectField
                name="drive"
                label="Napęd"
                options={DRIVE_TYPES}
                value={formData.drive}
                required={true}
                placeholder="Wybierz napęd"
                errors={errors}
              />
              <SelectField
                name="countryOfOrigin"
                label="Kraj pochodzenia"
                options={COUNTRIES}
                value={formData.countryOfOrigin}
                placeholder="Wybierz kraj"
                errors={errors}
              />
            </div>
          </div>

          {/* Informacje pomocnicze */}
          <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-md">
            <p className="text-[#35530A] text-sm">
              <strong>Wskazówka:</strong> Dokładne dane techniczne pozwalają kupującym lepiej ocenić wartość pojazdu. 
              Przebieg z CEPiK pomoże zweryfikować historię pojazdu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDataSection;
