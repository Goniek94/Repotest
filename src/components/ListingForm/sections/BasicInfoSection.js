import React, { useState, useEffect } from 'react';
import FormField from '../components/FormField';
import api from '../../../services/api';
import useCarData from '../../../components/search/hooks/useCarData';
import { carData as staticCarData } from '../../../components/search/SearchFormConstants';

const BasicInfoSection = ({ formData, handleChange, errors, showToast }) => {
  // Używamy hooka useCarData do pobierania rzeczywistych danych z API
  const { carData, brands, getModelsForBrand, loading: loadingCarData } = useCarData();
  
  const [availableModels, setAvailableModels] = useState([]);
  const [availableGenerations, setAvailableGenerations] = useState([]);
  const [isLoadingVin, setIsLoadingVin] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  // Tablica pól, które zostały wypełnione przez dane z VIN i są zablokowane do edycji
  const [lockedFields, setLockedFields] = useState([]);
  
  // Lata produkcji - dynamicznie generowane
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 1; i >= 1900; i--) {
    years.push({ value: i.toString(), label: i.toString() });
  }
  
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
        showToast('Wystąpił problem z pobieraniem modeli. Używam danych lokalnych.', 'warning');
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    fetchModels();
  }, [formData.brand, getModelsForBrand, showToast]);
  
  // Aktualizacja dostępnych generacji na podstawie wybranego modelu
  useEffect(() => {
    // Generacje zostały usunięte z nowej struktury danych
    // W przyszłości można dodać generacje jako osobny serwis
    setAvailableGenerations([]);
  }, [formData.brand, formData.model]);
  
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
      <div className="flex items-center gap-1">
        {label}{required && '*'}
        {isFieldLocked(fieldName) && (
          <span title="Pole zablokowane - dane z CEPiK" className="text-yellow-600 ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
        )}
      </div>
    );
  };
  
  return (
    <div>
      {/* Nagłówek ogłoszenia */}
      <div className="mb-6">
        <h3 className="text-white p-2 rounded-[2px] mb-4 bg-[#35530A]">
          Podstawowe informacje o ogłoszeniu
        </h3>
        
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

      {/* Kto sprzedaje - jako karty wyboru */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Kto sprzedaje?*</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className={`
            flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer
            ${formData.sellerType === 'prywatny' ? 'border-[#35530A] bg-green-50' : 'border-gray-200 hover:border-[#35530A]'}
            transition-all duration-200
          `}>
            <input
              type="radio"
              name="sellerType"
              value="prywatny"
              checked={formData.sellerType === 'prywatny'}
              onChange={(e) => handleFieldChange('sellerType', e.target.value)}
              className="sr-only" // Ukrycie domyślnego radiobuttona
              disabled={isFieldLocked('sellerType')}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-10 h-10 ${formData.sellerType === 'prywatny' ? 'text-[#35530A]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium text-center">Osoba prywatna</span>
          </label>
          
          <label className={`
            flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer
            ${formData.sellerType === 'firma' ? 'border-[#35530A] bg-green-50' : 'border-gray-200 hover:border-[#35530A]'}
            transition-all duration-200
          `}>
            <input
              type="radio"
              name="sellerType"
              value="firma"
              checked={formData.sellerType === 'firma'}
              onChange={(e) => handleFieldChange('sellerType', e.target.value)}
              className="sr-only" // Ukrycie domyślnego radiobuttona
              disabled={isFieldLocked('sellerType')}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-10 h-10 ${formData.sellerType === 'firma' ? 'text-[#35530A]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium text-center">Firma</span>
          </label>
        </div>
        {errors.sellerType && (
          <div className="text-red-500 text-xs mt-1">{errors.sellerType}</div>
        )}
      </div>

      {/* Sekcja VIN */}
      <div className="mb-8 border p-4 rounded-[2px] bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">
          Wyszukaj dane pojazdu po numerze VIN (opcjonalnie)
        </h3>
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <FormField
            type="text"
            name="vin"
            value={formData.vin}
            onChange={(e) => handleFieldChange('vin', e.target.value.toUpperCase())}
            placeholder="Wprowadź numer VIN (17 znaków)"
            maxLength={17}
            error={errors.vin}
            className="flex-1"
          />
          <button
            type="button"
            onClick={fetchVinData}
            disabled={isLoadingVin || !formData.vin || formData.vin.length !== 17}
            className="text-white px-4 py-2 rounded-[2px] flex items-center gap-2 bg-[#35530A] hover:bg-[#2D4A06] disabled:bg-gray-400 transition-colors h-[42px]"
          >
            {isLoadingVin ? 'Pobieranie...' : 'Pobierz Dane z CEPiK'}
          </button>
        </div>
        <div className="text-sm text-gray-600 mt-1">
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

      {/* Marka, model, generacja, wersja */}
      <div className="mb-6">
        <h3 className="text-white p-2 rounded-[2px] mb-4 bg-[#35530A]">
          Dane podstawowe pojazdu
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Komunikat o ładowaniu danych */}
          {loadingCarData && (
            <div className="md:col-span-4 p-2 bg-blue-50 rounded-[2px] text-blue-700 text-sm mb-3">
              Ładowanie danych o markach i modelach...
            </div>
          )}
          
          <FormField
            type="select"
            label={renderFieldLabel('Marka', 'brand', true)}
            name="brand"
            value={formData.brand}
            onChange={(e) => handleFieldChange('brand', e.target.value)}
            error={errors.brand}
            options={brands.map(brand => ({ value: brand, label: brand }))}
            placeholder="Wybierz markę"
            disabled={isFieldLocked('brand') || loadingCarData}
            className={isFieldLocked('brand') ? 'bg-gray-100' : ''}
          />
          
          <FormField
            type="select"
            label={renderFieldLabel('Model', 'model', true)}
            name="model"
            value={formData.model}
            onChange={(e) => handleFieldChange('model', e.target.value)}
            error={errors.model}
            options={availableModels.map(model => ({ value: model, label: model }))}
            placeholder={isLoadingModels ? "Ładowanie modeli..." : "Wybierz model"}
            disabled={!formData.brand || isFieldLocked('model') || isLoadingModels}
            className={isFieldLocked('model') ? 'bg-gray-100' : ''}
          />
          
          <FormField
            type="select"
            label={renderFieldLabel('Generacja', 'generation')}
            name="generation"
            value={formData.generation}
            onChange={(e) => handleFieldChange('generation', e.target.value)}
            options={availableGenerations.map(gen => {
              // Zamiana (2017-obecnie) na 2017+
              const match = typeof gen === 'string' && gen.match(/(\d{4})-obecnie/);
              let label = gen;
              if (match) {
                label = `${match[1]}+`;
              }
              return { value: gen, label };
            })}
            placeholder="Wybierz generację"
            disabled={!formData.model || isFieldLocked('generation')}
            className={isFieldLocked('generation') ? 'bg-gray-100' : ''}
          />
          
          <FormField
            type="text"
            label={renderFieldLabel('Wersja silnika', 'version')}
            name="version"
            value={formData.version}
            onChange={(e) => handleFieldChange('version', e.target.value)}
            placeholder="np. 1.4 TSI"
            disabled={isFieldLocked('version')}
            className={isFieldLocked('version') ? 'bg-gray-100' : ''}
          />
        </div>
      </div>
      
      {/* Rok, numer rejestracyjny */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Rok produkcji jako dropdown */}
        <FormField
          type="select"
          label={renderFieldLabel('Rok produkcji', 'productionYear', true)}
          name="productionYear"
          value={formData.productionYear}
          onChange={(e) => handleFieldChange('productionYear', e.target.value)}
          error={errors.productionYear}
          options={years}
          placeholder="Wybierz rok"
          disabled={isFieldLocked('productionYear')}
          className={isFieldLocked('productionYear') ? 'bg-gray-100' : ''}
        />
        
        <FormField
          type="text"
          label={renderFieldLabel('Numer rejestracyjny', 'registrationNumber')}
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={(e) => handleFieldChange('registrationNumber', e.target.value.toUpperCase())}
          placeholder="np. WA12345"
          maxLength={10}
          info="Wprowadź bez spacji, np. WA12345"
          disabled={isFieldLocked('registrationNumber')}
          className={isFieldLocked('registrationNumber') ? 'bg-gray-100' : ''}
        />
        
        {/* Pusty blok dla zachowania układu */}
        <div className="hidden md:block"></div>
        <div className="hidden md:block"></div>
      </div>
      
      {/* Informacje pomocnicze */}
      <div className="bg-[#F5FAF5] border-l-4 border-[#35530A] p-4 rounded-[2px] mt-4">
        <p className="text-[#35530A] text-sm font-medium">
          Podanie dokładnych i prawdziwych informacji o pojeździe zwiększa zaufanie potencjalnych 
          kupujących. Pamiętaj, że wszystkie dane będą weryfikowane przez kupujących.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoSection;
