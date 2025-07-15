import React, { useState, useEffect } from 'react';
import { ChevronDown, Lock, Upload, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { carData } from '../../search/SearchFormConstants';
import { getGenerationsForModel } from '../../search/GenerationsData';

const BasicInfoSection = ({ formData, handleChange, errors }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [lockedFields, setLockedFields] = useState([]);
  const [isLoadingVin, setIsLoadingVin] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableGenerations, setAvailableGenerations] = useState([]);

  // Używamy statycznych danych z SearchFormConstants
  const brands = Object.keys(carData).sort();
  const years = Array.from({length: 30}, (_, i) => (2024 - i).toString());

  // Funkcja do pobierania modeli dla marki
  const getModelsForBrand = (brand) => {
    return carData[brand] || [];
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleOptionChange = (name, option) => {
    if (lockedFields.includes(name)) {
      return;
    }
    handleChange(name, option);
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: false
    }));
  };

  const isFieldLocked = (fieldName) => {
    return lockedFields.includes(fieldName);
  };

  const mockFetchVinData = () => {
    setIsLoadingVin(true);
    setTimeout(() => {
      handleChange('brand', 'Audi');
      handleChange('model', 'A4');
      handleChange('productionYear', '2019');
      // Blokujemy pola po pobraniu danych z CEPiK
      setLockedFields(['brand', 'model', 'productionYear']);
      setIsLoadingVin(false);
    }, 2000);
  };

  // Efekt do ładowania modeli gdy zmieni się marka
  useEffect(() => {
    if (formData.brand && !isFieldLocked('model')) {
      const models = getModelsForBrand(formData.brand);
      setAvailableModels(models);
      
      // Jeśli aktualnie wybrany model nie jest dostępny dla nowej marki, wyczyść go
      if (formData.model && !models.includes(formData.model)) {
        handleChange('model', '');
        handleChange('generation', '');
        setAvailableGenerations([]);
      }
    } else {
      setAvailableModels([]);
      if (!isFieldLocked('model')) {
        handleChange('model', '');
        handleChange('generation', '');
        setAvailableGenerations([]);
      }
    }
  }, [formData.brand]);

  // Efekt do ładowania generacji gdy zmieni się model
  useEffect(() => {
    if (formData.brand && formData.model && !isFieldLocked('generation')) {
      const generations = getGenerationsForModel(formData.brand, formData.model);
      setAvailableGenerations(generations);
      
      // Jeśli aktualnie wybrana generacja nie jest dostępna dla nowego modelu, wyczyść ją
      if (formData.generation && !generations.includes(formData.generation)) {
        handleChange('generation', '');
      }
    } else {
      setAvailableGenerations([]);
      if (!isFieldLocked('generation')) {
        handleChange('generation', '');
      }
    }
  }, [formData.brand, formData.model]);

  // Efekt odblokowujący pola, gdy użytkownik usunie numer VIN
  useEffect(() => {
    // Jeśli VIN jest pusty lub ma mniej niż 17 znaków, a pola są zablokowane
    if ((!formData.vin || formData.vin.length < 17) && lockedFields.length > 0) {
      // Odblokuj pola
      setLockedFields([]);
    }
  }, [formData.vin, lockedFields]);

  const SelectField = ({ name, label, options, value, required, placeholder, disabled }) => {
    const isLocked = isFieldLocked(name);
    
    return (
      <div className="relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <div className="flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
            {isLocked && <Lock className="h-3 w-3 text-yellow-600" />}
          </div>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && !isLocked && toggleDropdown(name)}
            disabled={disabled || isLocked}
            className={`w-full h-9 text-sm px-3 border rounded-md bg-white text-left flex items-center justify-between transition-all duration-200 ${
              isLocked 
                ? 'border-yellow-300 bg-yellow-50' 
                : value 
                  ? 'border-[#35530A] bg-white' 
                  : 'border-gray-300 hover:border-gray-400 focus:border-[#35530A]'
            }`}
          >
            <span className={`${value ? 'text-gray-700' : 'text-gray-500'} truncate`}>
              {value || placeholder}
            </span>
            <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${openDropdowns[name] ? 'rotate-180' : ''} ${isLocked ? 'text-yellow-600' : 'text-gray-400'}`} />
          </button>
          
          {openDropdowns[name] && !isLocked && options && options.length > 0 && (
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

  const InputField = ({ name, label, value, required, placeholder, maxLength, type = "text" }) => {
    const isLocked = isFieldLocked(name);
    
    return (
      <div className="relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <div className="flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
            {isLocked && <Lock className="h-3 w-3 text-yellow-600" />}
          </div>
        </label>
        <input
          type={type}
          value={value || ''}
          onChange={(e) => !isLocked && handleChange(name, e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={isLocked}
          className={`w-full h-9 text-sm px-3 border rounded-md transition-all duration-200 ${
            isLocked 
              ? 'border-yellow-300 bg-yellow-50' 
              : value 
                ? 'border-[#35530A] bg-white' 
                : 'border-gray-300 hover:border-gray-400 focus:border-[#35530A]'
          }`}
        />
        {maxLength && (
          <div className="text-xs text-gray-500 mt-1">
            {(value || '').length || 0}/{maxLength}
          </div>
        )}
        {errors && errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
          
          {/* Sekcja 1: Nagłówek i typ sprzedawcy */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#35530A] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-800">Podstawowe dane ogłoszenia</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="headline"
                label="Nagłówek ogłoszenia"
                value={formData.headline}
                required={true}
                placeholder="np. Audi A4 2019, bezwypadkowy"
                maxLength={120}
              />
              <SelectField
                name="sellerType"
                label="Typ sprzedawcy"
                options={['Prywatny', 'Firma']}
                value={formData.sellerType}
                required={true}
                placeholder="Wybierz typ"
              />
            </div>
          </div>

          {/* Sekcja 2: VIN - zmieniony kolor na główny kolor aplikacji */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#35530A] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <h3 className="text-lg font-semibold text-gray-800">Pobierz dane z CEPiK</h3>
            </div>
            
            <div className="bg-[#F5FAF5] border border-[#35530A]/20 rounded-lg p-4">
              <div className="text-sm text-[#35530A] mb-2">
                <strong>Uwaga:</strong> Po wpisaniu numeru VIN i pobraniu danych, kluczowe parametry identyfikacyjne pojazdu nie będą mogły być edytowane, ponieważ są pobierane automatycznie z Centralnej Ewidencji Pojazdów i Kierowców.
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={formData.vin || ''}
                  onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
                  placeholder="Wprowadź numer VIN (17 znaków)"
                  maxLength={17}
                  className="flex-1 h-9 text-sm px-3 border border-[#35530A]/30 rounded-md focus:ring-2 focus:ring-[#35530A]/20 focus:border-[#35530A]"
                />
                <button
                  type="button"
                  onClick={mockFetchVinData}
                  disabled={isLoadingVin || !formData.vin || formData.vin.length !== 17}
                  className="px-4 py-2 bg-[#35530A] text-white rounded-md hover:bg-[#2D4A06] disabled:bg-gray-400 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                >
                  {isLoadingVin ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Pobieranie...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Pobierz dane
                    </>
                  )}
                </button>
              </div>
              
              {lockedFields.length > 0 && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-yellow-800">
                    <Lock className="h-4 w-4" />
                    <span>Zablokowane pola: {lockedFields.length} (dane z CEPiK)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sekcja 3: Dane pojazdu */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#35530A] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <h3 className="text-lg font-semibold text-gray-800">Dane pojazdu</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SelectField
                name="brand"
                label="Marka"
                options={brands}
                value={formData.brand}
                required={true}
                placeholder="Wybierz markę"
              />
              <SelectField
                name="model"
                label="Model"
                options={availableModels}
                value={formData.model}
                required={true}
                placeholder="Wybierz model"
                disabled={!formData.brand}
              />
              <SelectField
                name="generation"
                label="Generacja"
                options={availableGenerations}
                value={formData.generation}
                placeholder="Wybierz generację"
                disabled={!formData.model}
              />
              <SelectField
                name="productionYear"
                label="Rok produkcji"
                options={years}
                value={formData.productionYear}
                required={true}
                placeholder="Wybierz rok"
              />
              <InputField
                name="version"
                label="Wersja silnika"
                value={formData.version}
                placeholder="np. 1.4 TSI"
              />
              <InputField
                name="registrationNumber"
                label="Nr rejestracyjny"
                value={formData.registrationNumber}
                placeholder="np. WA12345"
                maxLength={10}
              />
            </div>
          </div>

          {/* Informacje pomocnicze */}
          <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-md">
            <p className="text-[#35530A] text-sm">
              <strong>Wskazówka:</strong> Podanie dokładnych informacji zwiększa zaufanie kupujących. 
              Wszystkie dane będą weryfikowane podczas oględzin pojazdu.
            </p>
          </div>
    </div>
  );
};

export default BasicInfoSection;
