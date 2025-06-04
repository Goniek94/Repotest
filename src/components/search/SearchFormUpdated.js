// SearchFormUpdated.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicFilters from "./BasicFilters";
import AdvancedFilters from "./AdvancedFilters";
import SearchFormButtons from "./SearchFormButtons";
import { bodyTypes, advancedOptions, regions } from "./SearchFormConstants";
import AdsService from "../../services/ads";
import useCarData from './hooks/useCarData';

/**
 * Zaktualizowany komponent formularza wyszukiwania
 * Używa hooka useCarData do pobierania danych o markach i modelach z backendu
 * 
 * @param {object} props
 * @param {object} props.initialValues - początkowe wartości formularza
 * @param {function} [props.onFilterChange] - callback do przekazania filtrów do rodzica
 */
export default function SearchFormUpdated({ initialValues = {}, onFilterChange }) {
  const navigate = useNavigate();

  // Pozwól na przekazanie 'brand' zamiast 'make' w initialValues
  const sanitizedInitialValues = { ...initialValues };
  if (sanitizedInitialValues.brand && !sanitizedInitialValues.make) {
    sanitizedInitialValues.make = sanitizedInitialValues.brand;
    delete sanitizedInitialValues.brand;
  }
  
  // Pobierz dane o markach i modelach z backendu
  const { carData, brands, getModelsForBrand, loading, error } = useCarData();

  // Stan formularza
  const [formData, setFormData] = useState(() => ({
    make: '',
    model: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    bodyType: '',
    damageStatus: '',
    country: '',
    region: '',
    fuelType: '',
    driveType: '',
    mileageFrom: '',
    mileageTo: '',
    location: '',
    transmission: '',
    enginePowerFrom: '',
    enginePowerTo: '',
    engineCapacityFrom: '',
    engineCapacityTo: '',
    color: '',
    doorCount: '',
    tuning: '',
    vehicleCondition: '',
    sellingForm: '',
    sellerType: '',
    vat: false,
    invoiceOptions: false,
    ...sanitizedInitialValues
  }));

  // Dostępne modele dla wybranej marki
  const [availableModels, setAvailableModels] = useState([]);

  // Pokaż zaawansowane filtry
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Liczba pasujących wyników z backendu
  const [matchingResults, setMatchingResults] = useState(0);

  // Aktualizuj dostępne modele, gdy zmienia się marka
  useEffect(() => {
    const updateModels = async () => {
      if (formData.make) {
        const models = await getModelsForBrand(formData.make);
        setAvailableModels(models);
      } else {
        setAvailableModels([]);
      }
    };
    
    updateModels();
  }, [formData.make, getModelsForBrand]);

  // Pobierz rzeczywistą liczbę wyników z backendu przy zmianie filtrów
  useEffect(() => {
    let ignore = false;
    const fetchCount = async () => {
      try {
        const params = { ...formData };
        // Usuń puste wartości
        Object.keys(params).forEach(
          (key) =>
            (params[key] === '' || params[key] === null || params[key] === undefined) &&
            delete params[key]
        );
        
        // Zmień nazwę pola 'make' na 'brand' dla zgodności z API
        if (params.make) {
          params.brand = params.make;
          delete params.make;
        }
        
        const res = await AdsService.getCount(params);
        if (!ignore) setMatchingResults(res.data.count || 0);
      } catch (e) {
        console.error('Błąd podczas pobierania liczby wyników:', e);
        if (!ignore) setMatchingResults(0);
      }
    };
    
    fetchCount();
    return () => {
      ignore = true;
    };
  }, [formData]);

  // Obsługa zmiany pól formularza
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      let finalValue = value;
      if (
        [
          'priceFrom',
          'priceTo',
          'mileageFrom',
          'mileageTo',
          'enginePowerFrom',
          'enginePowerTo',
          'engineCapacityFrom',
          'engineCapacityTo'
        ].includes(name)
      ) {
        if (Number(value) < 0) finalValue = 0;
      }
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  // Obsługa przycisku wyszukiwania
  const handleSearch = () => {
    if (onFilterChange) {
      // Przekaż filtry do rodzica, zamieniając 'make' na 'brand'
      const filtersForParent = { ...formData };
      if (filtersForParent.make) {
        filtersForParent.brand = filtersForParent.make;
        delete filtersForParent.make;
      }
      onFilterChange(filtersForParent);
    } else {
      // Przejdź do strony wyników wyszukiwania
      const searchParams = new URLSearchParams();
      
      // Przekształć parametry formularza na parametry URL
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          // Zmień nazwę pola 'make' na 'brand' dla zgodności z API
          const paramName = key === 'make' ? 'brand' : key;
          
          if (typeof value === 'boolean') {
            searchParams.append(paramName, value.toString());
          } else {
            searchParams.append(paramName, value);
          }
        }
      });
      
      navigate(`/listings?${searchParams.toString()}`);
    }
  };

  // Generuj opcje lat
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
  };

  return (
    <section className="bg-[#F5F7F9] py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#35530A] text-center mb-5 uppercase">
          Wyszukaj pojazd
        </h2>
        
        {/* Komunikat o ładowaniu */}
        {loading && (
          <div className="bg-blue-50 p-3 mb-4 rounded-md text-blue-700 text-center">
            Ładowanie danych o markach i modelach...
          </div>
        )}
        
        {/* Komunikat o błędzie */}
        {error && (
          <div className="bg-red-50 p-3 mb-4 rounded-md text-red-700 text-center">
            {error}
          </div>
        )}
        
        <div className="bg-white p-5 shadow-md rounded-[2px] mb-4">
          <BasicFilters
            formData={formData}
            handleInputChange={handleInputChange}
            carData={carData}
            bodyTypes={bodyTypes}
            availableModels={availableModels}
            generateYearOptions={generateYearOptions}
            advancedOptions={advancedOptions}
            regions={regions}
          />
          
          {showAdvanced && (
            <AdvancedFilters
              formData={formData}
              handleInputChange={handleInputChange}
              advancedOptions={advancedOptions}
              regions={regions}
            />
          )}
          
          <SearchFormButtons
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            handleSearch={handleSearch}
            matchingResults={matchingResults}
          />
        </div>
      </div>
    </section>
  );
}
