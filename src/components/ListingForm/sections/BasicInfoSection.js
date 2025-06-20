import React, { useState, useEffect } from 'react';
import FormField from '../components/FormField';
import SelectField from '../components/SelectField';
import api from '../../../services/api';
import useCarData from '../../../components/search/hooks/useCarData';
import { carData as staticCarData } from '../../../components/search/SearchFormConstants';

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
  const sellerTypeOptions = ['prywatny', 'firma'];
  
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
    if (!formData.brand || !formData.model) {
      setAvailableGenerations([]);
      return;
    }
    
    // Pobieramy generacje dla wybranego modelu
    const generations = getGenerationsForModel(formData.brand, formData.model);
    setAvailableGenerations(generations);
    console.log(`Pobrano generacje dla ${formData.brand} ${formData.model}:`, generations);
  }, [formData.brand, formData.model, getGenerationsForModel]);
  
  // Funkcja pomocnicza do sprawdzania czy pole jest zablokowane
  const isFieldLocked = (fieldName) => {
    return lockedFields.includes(fieldName);
  };
  
  // Niestandardowa funkcja obsługi zmiany dla pól zablokowanych
  const handleFieldChange = (fieldName, value) => {
    // Jeśli pole jest zablokowane, nie pozwalamy na zmianę
    if (isFieldLocked(fieldName)) {
      showToast(`Pole "${fieldName}" jest zablokowane - dane pochodzą z CEPiK`, 'warning');
      return;
    }
    
    // W przeciwnym razie pozwalamy na zmianę
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
    
    // W przeciwnym razie pozwalamy na zmianę
    handleChange(name, option);
    
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
    if (!formData.vin || formData.vin.length !== 17) {
      showToast('Wprowadź poprawny numer VIN (17 znaków)', 'error');
      return;
    }
    
    try {
      setIsLoadingVin(true);
      showToast('Pobieranie danych z CEPiK...', 'info');
      
      const vinData = await api.getVehicleDataByVin(formData.vin);
      
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
          'registrationNumber'
        ];
        
        vinFields.forEach(field => {
          if (vinData[field]) {
            updatedFields[field] = vinData[field];
            fieldsToLock.push(field); // Dodajemy do listy pól do zablokowania
          }
        });
        
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
      <div className="flex items-center">
        <span>{label}</span>
        {required && <span className="text-red-500 ml-1 inline-flex items-center">*</span>}
        {isFieldLocked(fieldName) && (
          <span title="Pole zablokowane - dane z CEPiK" className="text-yellow-600 ml-1 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Nagłówek ogłoszenia */}
      <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
        formData.headline ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
      }`}>
        <FormField
          type="text"
          label="Nagłówek ogłoszenia*"
          name="headline"
          value={formData.headline || ''}
          onChange={(e) => {
            if (e.target.value.length <= 120) handleFieldChange('headline', e.target.value);
          }}
          error={errors.headline}
          placeholder="Wpisz krótki nagłówek ogłoszenia (max 120 znaków)"
          maxLength={120}
          disabled={isFieldLocked('headline')}
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.headline ? formData.headline.length : 0}/120 znaków
        </div>
      </div>

      {/* Kto sprzedaje - jako dropdown select */}
      <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
        formData.sellerType ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
      }`}>
        <SelectField
          name="sellerType"
          label="Kto sprzedaje?"
          options={sellerTypeOptions.map(type => type === 'prywatny' ? 'Osoba prywatna' : 'Firma')}
          value={formData.sellerType === 'prywatny' ? 'Osoba prywatna' : formData.sellerType === 'firma' ? 'Firma' : ''}
          onChange={(name, option) => {
            const value = option === 'Osoba prywatna' ? 'prywatny' : 'firma';
            handleOptionChange(name, value);
          }}
          openDropdowns={openDropdowns}
          toggleDropdown={toggleDropdown}
          required={true}
          error={errors.sellerType}
          placeholder="Wybierz typ sprzedawcy"
          disabled={isFieldLocked('sellerType')}
        />
      </div>

      {/* Sekcja VIN */}
      <div className="bg-gray-50 p-4 rounded-[2px] border border-gray-200">
        <h3 className="font-medium mb-3">
          Wyszukaj dane pojazdu po numerze VIN (opcjonalnie)
        </h3>
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <input
            type="text"
            name="vin"
            value={formData.vin || ''}
            onChange={(e) => handleFieldChange('vin', e.target.value.toUpperCase())}
            placeholder="Wprowadź numer VIN (17 znaków)"
            maxLength={17}
            className="flex-1 h-10 text-sm px-3 border border-gray-300 rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A]"
          />
          <button
            type="button"
            onClick={fetchVinData}
            disabled={isLoadingVin || !formData.vin || formData.vin.length !== 17}
            className="text-white px-4 py-2 rounded-[2px] flex items-center gap-2 bg-[#35530A] hover:bg-[#2D4A06] disabled:bg-gray-400 transition-colors h-[40px] whitespace-nowrap"
          >
            {isLoadingVin ? 'Pobieranie...' : 'Pobierz dane z CEPiK'}
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Wprowadź 17-znakowy numer VIN, aby automatycznie pobrać dane pojazdu z bazy CEPiK.
        </div>
        
        {/* Przycisk do odblokowania pól */}
        {lockedFields.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-[2px]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-yellow-800">
                <span className="font-medium">Pola zablokowane:</span> {lockedFields.length} 
                <p className="mt-1">Pola pobrane z CEPiK są automatycznie zablokowane do edycji.</p>
              </div>
              <button
                type="button"
                onClick={resetLockedFields}
                className="bg-yellow-600 text-white px-3 py-1 rounded-[2px] text-sm hover:bg-yellow-700 transition-colors"
              >
                Odblokuj wszystkie pola
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dane pojazdu - siatka w stylu wyszukiwarki */}
      <div className="space-y-4">
        <h3 className="font-medium mb-2">Dane podstawowe pojazdu</h3>
        
        {/* Używamy grid z równymi kolumnami */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Marka pojazdu */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.brand ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <SelectField
              name="brand"
              label={renderFieldLabel('Marka', 'brand', true)}
              options={brands}
              value={formData.brand || ''}
              onChange={handleOptionChange}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              required={true}
              error={errors.brand}
              placeholder="Wybierz markę"
              disabled={isFieldLocked('brand') || loadingCarData}
            />
          </div>
          
          {/* Model pojazdu */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.model ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <SelectField
              name="model"
              label={renderFieldLabel('Model', 'model', true)}
              options={availableModels}
              value={formData.model || ''}
              onChange={handleOptionChange}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              required={true}
              error={errors.model}
              placeholder={!formData.brand ? "Najpierw wybierz markę" : isLoadingModels ? "Ładowanie modeli..." : "Wybierz model"}
              disabled={!formData.brand || isFieldLocked('model') || isLoadingModels}
            />
          </div>
          
          {/* Generacja pojazdu */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.generation ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <SelectField
              name="generation"
              label={renderFieldLabel('Generacja', 'generation', false)}
              options={availableGenerations}
              value={formData.generation || ''}
              onChange={handleOptionChange}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              required={false}
              error={errors.generation}
              placeholder={!formData.model ? "Najpierw wybierz model" : availableGenerations.length === 0 ? "Brak dostępnych generacji" : "Wybierz generację"}
              disabled={!formData.model || isFieldLocked('generation') || availableGenerations.length === 0}
            />
          </div>
          
          {/* Rok produkcji */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.productionYear ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <SelectField
              name="productionYear"
              label={renderFieldLabel('Rok produkcji', 'productionYear', true)}
              options={years}
              value={formData.productionYear || ''}
              onChange={handleOptionChange}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              required={true}
              error={errors.productionYear}
              placeholder="Wybierz rok"
              disabled={isFieldLocked('productionYear')}
            />
          </div>
          
          {/* Wersja silnika - jako input w ujednoliconym kontenerze */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.version ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <label className="block font-semibold mb-3 text-gray-800">
              {renderFieldLabel('Wersja silnika', 'version')}
            </label>
            <div className="relative h-10"> {/* Stała wysokość dla dopasowania do SelectField */}
              <input
                type="text"
                name="version"
                value={formData.version || ''}
                onChange={(e) => handleFieldChange('version', e.target.value)}
                placeholder="np. 1.4 TSI"
                disabled={isFieldLocked('version')}
                className={`w-full h-full text-sm px-3 border ${isFieldLocked('version') ? 'border-gray-200 bg-gray-50' : 'border-gray-300'} rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] ${isFieldLocked('version') ? 'cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
          
          {/* Numer rejestracyjny - jako input w ujednoliconym kontenerze */}
          <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            formData.registrationNumber ? 'border-[#35530A] bg-green-50' : 'border-gray-300'
          }`}>
            <label className="block font-semibold mb-3 text-gray-800">
              {renderFieldLabel('Numer rejestracyjny', 'registrationNumber')}
            </label>
            <div className="relative h-10"> {/* Stała wysokość dla dopasowania do SelectField */}
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber || ''}
                onChange={(e) => handleFieldChange('registrationNumber', e.target.value.toUpperCase())}
                placeholder="np. WA12345"
                maxLength={10}
                disabled={isFieldLocked('registrationNumber')}
                className={`w-full h-full text-sm px-3 border ${isFieldLocked('registrationNumber') ? 'border-gray-200 bg-gray-50' : 'border-gray-300'} rounded-[2px] focus:ring-[#35530A] focus:border-[#35530A] ${isFieldLocked('registrationNumber') ? 'cursor-not-allowed' : ''}`}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Wprowadź bez spacji, np. WA12345
            </div>
          </div>
        </div>
      </div>
      
      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px]">
        <p className="text-[#35530A] text-sm">
          Podanie dokładnych i prawdziwych informacji o pojeździe zwiększa zaufanie potencjalnych 
          kupujących. Pamiętaj, że wszystkie dane będą weryfikowane przez kupujących.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoSection;
