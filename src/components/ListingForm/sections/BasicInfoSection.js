import React, { useState, useEffect } from 'react';
import carDatabase from '../../../data/carDatabase';
import FormField from '../components/FormField';
import api from '../../../services/api';

const BasicInfoSection = ({ formData, handleChange, errors, showToast }) => {
  const [availableModels, setAvailableModels] = useState([]);
  const [availableGenerations, setAvailableGenerations] = useState([]);
  const [isLoadingVin, setIsLoadingVin] = useState(false);
  
  // Lata produkcji - dynamicznie generowane
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear + 1; i >= 1900; i--) {
    years.push({ value: i.toString(), label: i.toString() });
  }
  
  // Aktualizacja dostępnych modeli na podstawie wybranej marki
  useEffect(() => {
    if (formData.brand && carDatabase[formData.brand]) {
      setAvailableModels(Object.keys(carDatabase[formData.brand]));
    } else {
      setAvailableModels([]);
    }
  }, [formData.brand]);
  
  // Aktualizacja dostępnych generacji na podstawie wybranego modelu
  useEffect(() => {
    if (formData.brand && formData.model && carDatabase[formData.brand] && carDatabase[formData.brand][formData.model]) {
      setAvailableGenerations(carDatabase[formData.brand][formData.model]);
    } else {
      setAvailableGenerations([]);
    }
  }, [formData.brand, formData.model]);
  
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
        // Aktualizacja wielu pól jednocześnie
        const updatedFields = {
          brand: vinData.brand || formData.brand,
          model: vinData.model || formData.model,
          generation: vinData.generation || formData.generation,
          version: vinData.version || formData.version,
          productionYear: vinData.productionYear || formData.productionYear,
          fuelType: vinData.fuelType || formData.fuelType,
          engineSize: vinData.engineSize || formData.engineSize,
          power: vinData.power || formData.power,
          transmission: vinData.transmission || formData.transmission,
          drive: vinData.drive || formData.drive,
          mileage: vinData.mileage || formData.mileage,
          condition: vinData.condition || formData.condition,
          accidentStatus: vinData.accidentStatus || formData.accidentStatus,
          damageStatus: vinData.damageStatus || formData.damageStatus,
          countryOfOrigin: vinData.countryOfOrigin || formData.countryOfOrigin
        };
        
        // Aktualizacja formData z wykorzystaniem destrukturyzacji
        Object.keys(updatedFields).forEach(key => {
          handleChange(key, updatedFields[key]);
        });
        
        showToast('Dane pojazdu zostały pobrane z CEPiK', 'success');
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
            if (e.target.value.length <= 120) handleChange('headline', e.target.value);
          }}
          error={errors.headline}
          placeholder="Wpisz krótki nagłówek ogłoszenia (max 120 znaków)"
          maxLength={120}
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
              onChange={(e) => handleChange('sellerType', e.target.value)}
              className="sr-only" // Ukrycie domyślnego radiobuttona
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
              onChange={(e) => handleChange('sellerType', e.target.value)}
              className="sr-only" // Ukrycie domyślnego radiobuttona
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
            onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
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
      </div>

      {/* Marka, model, generacja, wersja */}
      <div className="mb-6">
        <h3 className="text-white p-2 rounded-[2px] mb-4 bg-[#35530A]">
          Dane podstawowe pojazdu
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <FormField
            type="select"
            label="Marka*"
            name="brand"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            error={errors.brand}
            options={Object.keys(carDatabase).sort().map(brand => ({ value: brand, label: brand }))}
            placeholder="Wybierz markę"
          />
          
          <FormField
            type="select"
            label="Model*"
            name="model"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            error={errors.model}
            options={availableModels.map(model => ({ value: model, label: model }))}
            placeholder="Wybierz model"
            disabled={!formData.brand}
          />
          
          <FormField
            type="select"
            label="Generacja"
            name="generation"
            value={formData.generation}
            onChange={(e) => handleChange('generation', e.target.value)}
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
            disabled={!formData.model}
          />
          
          <FormField
            type="text"
            label="Wersja silnika"
            name="version"
            value={formData.version}
            onChange={(e) => handleChange('version', e.target.value)}
            placeholder="np. 1.4 TSI"
          />
        </div>
      </div>
      
      {/* Rok, numer rejestracyjny */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Rok produkcji jako dropdown */}
        <FormField
          type="select"
          label="Rok produkcji*"
          name="productionYear"
          value={formData.productionYear}
          onChange={(e) => handleChange('productionYear', e.target.value)}
          error={errors.productionYear}
          options={years}
          placeholder="Wybierz rok"
        />
        
        <FormField
          type="text"
          label="Numer rejestracyjny"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
          placeholder="np. WA12345"
          maxLength={10}
          info="Wprowadź bez spacji, np. WA12345"
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
