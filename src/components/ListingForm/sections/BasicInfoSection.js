import React, { useState, useEffect } from 'react';
import { useListingForm } from '../../../contexts/ListingFormContext';
import carDatabase from '../../../data/carDatabase';
import FormField from '../components/FormField';
import api from '../../../services/api';

const BasicInfoSection = ({ formData, handleChange, errors, showToast }) => {
  const [availableModels, setAvailableModels] = useState([]);
  const [availableGenerations, setAvailableGenerations] = useState([]);
  const [isLoadingVin, setIsLoadingVin] = useState(false);
  
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
        <h3 className="text-lg font-semibold mb-4">Dane podstawowe</h3>
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
            options={availableGenerations.map(gen => ({ value: gen, label: gen }))}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FormField
          type="number"
          label="Rok produkcji*"
          name="productionYear"
          value={formData.productionYear}
          onChange={(e) => handleChange('productionYear', e.target.value)}
          error={errors.productionYear}
          placeholder="np. 2018"
          min="1900"
          max={new Date().getFullYear() + 1}
          info="Dopuszczalny zakres: 1900 - obecnie"
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
      </div>
    </div>
  );
};

export default BasicInfoSection;