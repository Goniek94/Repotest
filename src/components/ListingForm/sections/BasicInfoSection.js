import React, { useState, useEffect } from 'react';
import { getVehicleDataByVin } from '../../../services/api';
import useCarData from '../../../components/search/hooks/useCarData';
import { carData as staticCarData } from '../../../components/search/SearchFormConstants';
import DatePicker from '../components/DatePicker';
import vinService from '../../../services/vin/index';

const BasicInfoSection = ({ formData, handleChange, errors, showToast }) => {
  // Używamy hooka useCarData do pobierania rzeczywistych danych z API
  const { carData, brands, getModelsForBrand, getGenerationsForModel, loading: loadingCarData } = useCarData();
  
  const [availableModels, setAvailableModels] = useState([]);
  const [availableGenerations, setAvailableGenerations] = useState([]);
  const [isLoadingVin, setIsLoadingVin] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  // Tablica pól, które zostały wypełnione przez dane z VIN i są zablokowane do edycji
  const [lockedFields, setLockedFields] = useState([]);
  // Stan dla śledzenia otwartych dropdowns
  const [openDropdowns, setOpenDropdowns] = useState({});
  
  // Lata produkcji - dynamicznie generowane
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 1; i >= 1900; i--) {
    years.push(i.toString());
  }
  
  // Opcje dla typu sprzedawcy
  const sellerTypeOptions = [
    { value: 'prywatny', label: 'Osoba Prywatna' },
    { value: 'firma', label: 'Firma' }
  ];

  // Funkcja konwersji dla wyświetlania
  const getSellerTypeDisplay = (value) => {
    if (value === 'prywatny') return 'Prywatny';
    if (value === 'firma') return 'Firma';
    return value;
  };
  
  // Aktualizacja dostępnych modeli na podstawie wybranej marki - pobieramy z API
  useEffect(() => {
    const fetchModels = async () => {
      if (!formData.brand) {
        setAvailableModels([]);
        return;
      }
      
      setIsLoadingModels(true);
      try {
        // Pobieramy modele dla wybranej marki z API
        const models = await getModelsForBrand(formData.brand);
        setAvailableModels(models || []);
      } catch (error) {
        console.error('Błąd podczas pobierania modeli:', error);
        // Fallback do statycznych danych w przypadku błędu
        setAvailableModels(staticCarData[formData.brand] || []);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    fetchModels();
  }, [formData.brand, getModelsForBrand]);
  
  // Aktualizacja dostępnych generacji na podstawie wybranego modelu
  useEffect(() => {
    const fetchGenerations = async () => {
      if (!formData.brand || !formData.model) {
        setAvailableGenerations([]);
        return;
      }
      
      try {
        // Pobieramy generacje dla wybranego modelu - to jest async funkcja!
        const generations = await getGenerationsForModel(formData.brand, formData.model);
        setAvailableGenerations(generations || []);
        console.log(`Pobrano generacje dla ${formData.brand} ${formData.model}:`, generations);
      } catch (error) {
        console.error('Błąd podczas pobierania generacji:', error);
        setAvailableGenerations([]);
      }
    };
    
    fetchGenerations();
  }, [formData.brand, formData.model, getGenerationsForModel]);
  
  // Funkcja pomocnicza do sprawdzania czy pole jest zablokowane
  const isFieldLocked = (fieldName) => {
    return lockedFields.includes(fieldName);
  };
  
  // NAPRAWIONA funkcja obsługi zmiany - bez dodatkowych warunków
  const handleFieldChange = (fieldName, value) => {
    // Jeśli pole jest zablokowane, nie pozwalamy na zmianę
    if (isFieldLocked(fieldName)) {
      showToast(`Pole "${fieldName}" jest zablokowane - dane pochodzą z CEPiK`, 'warning');
      return;
    }
    
    // ZAWSZE wywołaj handleChange - bez dodatkowych warunków!
    handleChange(fieldName, value);
  };
  
  // Obsługa przełączania dropdown
  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  // Obsługa zmiany opcji w dropdown
  const handleOptionChange = (name, option) => {
    // Sprawdzamy czy pole jest zablokowane
    if (isFieldLocked(name)) {
      showToast(`Pole "${name}" jest zablokowane - dane pochodzą z CEPiK`, 'warning');
      return;
    }
    
    // Specjalna obsługa dla pola sellerType - konwertuj z labela na wartość
    let valueToSave = option;
    if (name === 'sellerType') {
      if (option === 'Osoba Prywatna') {
        valueToSave = 'prywatny';
      } else if (option === 'Firma') {
        valueToSave = 'firma';
      }
    }
    
    // W przeciwnym razie pozwalamy na zmianę
    handleChange(name, valueToSave);
    
    // Zamknij dropdown po wyborze opcji
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: false
    }));
  };
  
  // Funkcja resetowania zablokowanych pól
  const resetLockedFields = () => {
    if (lockedFields.length === 0) {
      showToast('Brak zablokowanych pól do odblokowania', 'info');
      return;
    }
    
    setLockedFields([]);
    showToast('Wszystkie pola zostały odblokowane', 'success');
  };
  
  // Funkcja pobierania danych VIN
  const fetchVinData = async () => {
    if (!formData.vinForSearch || formData.vinForSearch.length !== 17) {
      showToast('Wprowadź poprawny numer VIN (17 znaków)', 'error');
      return;
    }
    
    try {
      setIsLoadingVin(true);
      showToast('Pobieranie danych z CEPiK...', 'info');
      
      // Używamy nowego serwisu VIN
      const vinData = await vinService.lookupVin(formData.vinForSearch);
      
      if (vinData) {
        // Lista pól, które zostaną zablokowane po pobraniu danych z VIN
        const fieldsToLock = [];
        
        // Aktualizacja wielu pól jednocześnie
        const updatedFields = {};
        
        // Dla każdego pola z danych VIN, sprawdzamy czy istnieje i dodajemy do aktualizacji
        const vinFields = [
          'brand', 'model', 'generation', 'version', 'productionYear', 
          'fuelType', 'engineSize', 'power', 'transmission', 'drive', 
          'mileage', 'condition', 'accidentStatus', 'damageStatus', 'countryOfOrigin',
          'registrationNumber', 'firstRegistrationDate', 'vin',
          // Dodajemy nowe pola obowiązkowe z VehicleStatusSection
          'imported', 'registeredInPL', 'firstOwner', 'disabledAdapted'
        ];
        
        vinFields.forEach(field => {
          if (vinData[field] !== undefined && vinData[field] !== null) {
            updatedFields[field] = vinData[field];
            fieldsToLock.push(field); // Dodajemy do listy pól do zablokowania
          }
        });
        
        // Jeśli nie ma VIN w odpowiedzi, użyj tego z pola wyszukiwania
        if (!updatedFields.vin) {
          updatedFields.vin = formData.vinForSearch;
          fieldsToLock.push('vin');
        }
        
        // Aktualizacja formData
        Object.keys(updatedFields).forEach(key => {
          handleChange(key, updatedFields[key]);
        });
        
        // Blokowanie pól, które zostały zaktualizowane
        setLockedFields(fieldsToLock);
        
        showToast('Dane pojazdu zostały pobrane z CEPiK. Pola wypełnione danymi z CEPiK zostały zablokowane.', 'success');
      } else {
        showToast('Nie znaleziono danych dla podanego numeru VIN', 'warning');
      }
    } catch (error) {
      console.error('Błąd pobierania danych VIN:', error);
      showToast('Wystąpił błąd podczas pobierania danych', 'error');
    } finally {
      setIsLoadingVin(false);
    }
  };
  
  // Pomocnicza funkcja do renderowania etykiety pola z ikoną blokady
  const renderFieldLabel = (label, fieldName, required = false) => {
    return (
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
        {isFieldLocked(fieldName) && (
          <span title="Pole zablokowane - dane z CEPiK" className="text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
        )}
      </div>
    );
  };

  // PROSTY KOMPONENT SELECT - TAKI SAM STYL JAK W BODY INFO
  const SelectField = ({ name, label, options, value, required, placeholder, disabled }) => {
    return (
      <div className="relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {renderFieldLabel(label, name, required)}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && toggleDropdown(name)}
            disabled={disabled}
            className={`w-full h-9 text-sm px-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between transition-all duration-200 hover:border-gray-400 focus:border-[#35530A] ${
              disabled ? 'cursor-not-allowed bg-gray-50' : ''
            }`}
          >
            <span className={`${value ? 'text-gray-700' : 'text-gray-500'} truncate`}>
              {value || placeholder || 'Wybierz'}
            </span>
            <span className={`text-gray-400 transform transition-transform ${openDropdowns[name] ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {openDropdowns[name] && !disabled && (
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


  // PROSTY INPUT FIELD - bezpośrednie wywołanie handleChange bez dodatkowych warstw
  const InputField = ({ name, label, value, required, placeholder, disabled, maxLength, type = "text" }) => {
    return (
      <div className="relative">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {renderFieldLabel(label, name, required)}
        </label>
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled || isFieldLocked(name)}
          className={`w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A] ${
            disabled || isFieldLocked(name) ? 'cursor-not-allowed bg-gray-50' : ''
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
      {/* Nagłówek ogłoszenia - bezpośrednie pole input */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Nagłówek ogłoszenia <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="headline"
          value={formData.headline || ''}
          onChange={handleChange}
          placeholder="Wpisz krótki nagłówek ogłoszenia (max 120 znaków)"
          maxLength={120}
          disabled={isFieldLocked('headline')}
          className={`w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A] ${
            isFieldLocked('headline') ? 'cursor-not-allowed bg-gray-50' : ''
          }`}
        />
        {errors.headline && (
          <p className="text-red-500 text-sm mt-1">{errors.headline}</p>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {formData.headline ? formData.headline.length : 0}/120 znaków
        </div>
      </div>

      {/* Kto sprzedaje */}
      <SelectField
        name="sellerType"
        label="Kto sprzedaje?"
        options={sellerTypeOptions.map(opt => opt.label)}
        value={formData.sellerType === 'prywatny' ? 'Osoba Prywatna' : formData.sellerType === 'firma' ? 'Firma' : ''}
        required={true}
        placeholder="Wybierz typ sprzedawcy"
        disabled={isFieldLocked('sellerType')}
      />

      {/* Sekcja VIN */}
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h3 className="font-medium mb-3">
          Wyszukaj dane pojazdu po numerze VIN (opcjonalnie)
        </h3>
        
        {/* Pola do wypełnienia przed pobraniem VIN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Numer rejestracyjny
              </label>
              <input
                type="text"
                name="registrationNumberForVin"
                value={formData.registrationNumberForVin || ''}
                onChange={handleChange}
                placeholder="np. WA12345"
                maxLength={10}
                className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Pole B na dowodzie rejestracyjnym
            </div>
          </div>
          
          <div>
            <DatePicker
              name="firstRegistrationDate"
              label="Data pierwszej rejestracji"
              value={formData.firstRegistrationDate}
              onChange={handleChange}
              placeholder="Wybierz datę pierwszej rejestracji"
              disabled={isFieldLocked('firstRegistrationDate')}
              maxDate={new Date().toISOString().split('T')[0]} // Nie można wybrać daty z przyszłości
              error={errors?.firstRegistrationDate}
            />
            <div className="text-xs text-gray-500 mt-1">
              Pole I na dowodzie rejestracyjnym
            </div>
          </div>
          
          <div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Numer VIN
              </label>
              <input
                type="text"
                name="vinForSearch"
                value={formData.vinForSearch || ''}
                onChange={handleChange}
                placeholder="17 znaków"
                maxLength={17}
                className="w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A]"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Pole E na dowodzie rejestracyjnym
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-3">
          <button
            type="button"
            onClick={fetchVinData}
            disabled={isLoadingVin || !formData.vinForSearch || formData.vinForSearch.length !== 17}
            className="text-white px-6 py-2 rounded-md flex items-center gap-2 bg-[#35530A] hover:bg-[#2D4A06] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoadingVin ? 'Pobieranie...' : 'Pobierz dane z CEPiK'}
          </button>
        </div>
        
        <div className="text-sm text-[#35530A] bg-[#F5FAF5] p-4 rounded-md border-l-4 border-[#35530A]">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#35530A] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold mb-1">Automatyczne pobieranie danych z CEPiK</p>
                <p className="text-sm leading-relaxed">
                  Wypełnij powyższe pola danymi z dowodu rejestracyjnego, a następnie kliknij <strong>"Pobierz dane z CEPiK"</strong> 
                  aby automatycznie uzupełnić pozostałe informacje o pojeździe.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[#35530A]/20">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="font-medium text-amber-800 mb-1">Ważne informacje o zabezpieczeniu danych</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Po pobraniu danych z <strong>Centralnej Ewidencji Pojazdów (CEPiK)</strong>, wybrane pola zostaną automatycznie 
                  zablokowane do edycji w celu zapewnienia wiarygodności i zgodności z oficjalnymi danymi pojazdu. 
                  Możesz w każdej chwili odblokować te pola, jeśli zajdzie taka potrzeba.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Przycisk do odblokowania pól */}
        {lockedFields.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="text-sm text-yellow-800">
                <span className="font-medium">Pola zablokowane:</span> {lockedFields.length} 
                <p className="mt-1">Pola pobrane z CEPiK są automatycznie zablokowane do edycji.</p>
              </div>
              <button
                type="button"
                onClick={resetLockedFields}
                className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-700 transition-colors"
              >
                Odblokuj wszystkie pola
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dane pojazdu - 2 PANELE PO 4 POLA */}
      <div className="space-y-6">
        {/* Panel 1 - Podstawowe dane pojazdu */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Marka pojazdu */}
            <SelectField
              name="brand"
              label="Marka"
              options={brands}
              value={formData.brand}
              required={true}
              placeholder="Wybierz markę"
              disabled={isFieldLocked('brand') || loadingCarData}
            />
            
            {/* Model pojazdu */}
            <SelectField
              name="model"
              label="Model"
              options={availableModels}
              value={formData.model}
              required={true}
              placeholder={!formData.brand ? "Najpierw wybierz markę" : isLoadingModels ? "Ładowanie modeli..." : "Wybierz model"}
              disabled={!formData.brand || isFieldLocked('model') || isLoadingModels}
            />
            
            {/* Generacja pojazdu */}
            <SelectField
              name="generation"
              label="Generacja"
              options={availableGenerations}
              value={formData.generation}
              placeholder={!formData.model ? "Najpierw wybierz model" : availableGenerations.length === 0 ? "Brak dostępnych generacji" : "Wybierz generację"}
              disabled={!formData.model || isFieldLocked('generation') || availableGenerations.length === 0}
            />
            
            {/* Rok produkcji */}
            <SelectField
              name="productionYear"
              label="Rok produkcji"
              options={years}
              value={formData.productionYear}
              required={true}
              placeholder="Wybierz rok"
              disabled={isFieldLocked('productionYear')}
            />
          </div>
        </div>

        {/* Panel 2 - Dodatkowe informacje */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Wersja silnika */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                {renderFieldLabel("Wersja silnika", "version", true)}
              </label>
              <input
                type="text"
                name="version"
                value={formData.version || ''}
                onChange={handleChange}
                placeholder="np. 1.4 TSI"
                disabled={isFieldLocked('version')}
                className={`w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A] ${
                  isFieldLocked('version') ? 'cursor-not-allowed bg-gray-50' : ''
                }`}
              />
              {errors && errors.version && (
                <p className="text-red-500 text-sm mt-1">{errors.version}</p>
              )}
            </div>
            
            {/* Numer rejestracyjny */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                {renderFieldLabel("Numer rejestracyjny", "registrationNumber")}
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber || ''}
                onChange={handleChange}
                placeholder="np. WA12345"
                maxLength={10}
                disabled={isFieldLocked('registrationNumber')}
                className={`w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A] ${
                  isFieldLocked('registrationNumber') ? 'cursor-not-allowed bg-gray-50' : ''
                }`}
              />
              {errors && errors.registrationNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>
              )}
            </div>
            
            {/* Data pierwszej rejestracji */}
            <DatePicker
              name="firstRegistrationDate"
              label="Data pierwszej rejestracji"
              value={formData.firstRegistrationDate}
              onChange={handleChange}
              placeholder="Wybierz datę pierwszej rejestracji"
              disabled={isFieldLocked('firstRegistrationDate')}
              maxDate={new Date().toISOString().split('T')[0]} // Nie można wybrać daty z przyszłości
              error={errors?.firstRegistrationDate}
            />
            
            {/* Numer VIN */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                {renderFieldLabel("Numer VIN", "vin")}
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin || ''}
                onChange={handleChange}
                placeholder="17 znaków"
                maxLength={17}
                disabled={isFieldLocked('vin')}
                className={`w-full h-9 text-sm px-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-gray-400 focus:border-[#35530A] ${
                  isFieldLocked('vin') ? 'cursor-not-allowed bg-gray-50' : ''
                }`}
              />
              {errors && errors.vin && (
                <p className="text-red-500 text-sm mt-1">{errors.vin}</p>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <strong>Uwaga:</strong> Pola w tym panelu są opcjonalne przy ręcznym wypełnianiu. 
            Po pobraniu danych z CEPiK zostaną automatycznie uzupełnione i będą wyświetlane w ogłoszeniu.
          </div>
        </div>
      </div>
      
      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-md">
        <p className="text-[#35530A] text-sm">
          <strong>Wskazówka:</strong> Podanie dokładnych i prawdziwych informacji o pojeździe zwiększa zaufanie potencjalnych 
          kupujących. Pamiętaj, że wszystkie dane będą weryfikowane przez kupujących.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoSection;
