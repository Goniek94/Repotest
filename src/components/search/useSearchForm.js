// useSearchForm.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { carData, bodyTypes, advancedOptions, regions } from './SearchFormConstants';
import AdsService from '../../../../autosellfront/src/services/ads';
import useCarData from './hooks/useCarData';

/**
 * Hook obsługujący logikę formularza wyszukiwania pojazdów
 * @param {Object} initialValues Początkowe wartości formularza
 * @param {Function} onFilterChangeCallback Opcjonalna funkcja callback wywoływana przy zmianie filtrów
 * @returns {Object} Metody i dane formularza
 */
const useSearchForm = (initialValues = {}, onFilterChangeCallback) => {
  const navigate = useNavigate();
  
  // Pobierz dane o markach i modelach z backendu
  const { brands, getModelsForBrand, loading: carDataLoading } = useCarData();

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
    ...initialValues
  }));

  // Stany UI
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [matchingResults, setMatchingResults] = useState(0);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  
  // Dostępne modele dla wybranej marki
  const [availableModels, setAvailableModels] = useState([]);
  
  // Dostępne marki
  const [availableBrands, setAvailableBrands] = useState([]);

  // Pobieranie marek z API
  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoadingBrands(true);
      try {
        // Używamy danych z useCarData zamiast statycznych danych
        setAvailableBrands(brands || Object.keys(carData));
      } catch (error) {
        console.error('Error fetching brands:', error);
        // Fallback do statycznych danych w przypadku błędu
        setAvailableBrands(Object.keys(carData));
      } finally {
        setIsLoadingBrands(false);
      }
    };
    
    fetchBrands();
  }, [brands]);

  // Aktualizacja dostępnych modeli, gdy zmienia się marka
  useEffect(() => {
    const updateModels = async () => {
      if (formData.make) {
        setIsLoadingModels(true);
        try {
          // Próbujemy pobrać modele z API
          const models = await getModelsForBrand(formData.make);
          if (models && models.length > 0) {
            setAvailableModels(models);
          } else if (carData[formData.make]) {
            // Fallback do statycznych danych w przypadku braku modeli z API
            setAvailableModels(carData[formData.make]);
          } else {
            setAvailableModels([]);
          }
        } catch (error) {
          console.error('Error fetching models:', error);
          // Fallback do statycznych danych w przypadku błędu
          if (carData[formData.make]) {
            setAvailableModels(carData[formData.make]);
          } else {
            setAvailableModels([]);
          }
        } finally {
          setIsLoadingModels(false);
        }
      } else {
        setAvailableModels([]);
      }
    };
    
    updateModels();
  }, [formData.make, getModelsForBrand]);

  // Pobieranie liczby pasujących ogłoszeń
  useEffect(() => {
    let ignore = false;
    const fetchCount = async () => {
      try {
        setIsLoading(true);
        const params = { ...formData };
        // Usuwanie pustych wartości
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
        console.error('Error fetching count:', e);
        if (!ignore) setMatchingResults(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCount();
    return () => { ignore = true; };
  }, [formData]);

  // Obsługa zmiany wartości formularza
  const handleInputChange = useCallback((e) => {
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
      
      setFormData((prev) => {
        const newFormData = { ...prev, [name]: finalValue };
        
        // Jeśli zmieniono markę, resetuj model
        if (name === 'make' && value !== prev.make) {
          newFormData.model = '';
        }
        
        // Wywołaj callback jeśli został przekazany
        if (onFilterChangeCallback) {
          onFilterChangeCallback(newFormData);
        }
        
        return newFormData;
      });
    }
  }, [onFilterChangeCallback]);

  // Resetowanie formularza
  const resetForm = useCallback(() => {
    const resetData = {};
    Object.keys(formData).forEach(key => {
      resetData[key] = Array.isArray(formData[key]) ? [] : '';
    });
    
    setFormData(resetData);
    
    // Wywołaj callback jeśli został przekazany
    if (onFilterChangeCallback) {
      onFilterChangeCallback(resetData);
    }
  }, [formData, onFilterChangeCallback]);

  // Przełączanie widoczności zaawansowanych filtrów
  const toggleAdvancedFilters = useCallback(() => {
    setShowAdvanced(prev => !prev);
  }, []);

  // Obsługa przycisku wyszukiwania
  const handleSearch = useCallback(() => {
    if (onFilterChangeCallback) {
      // Jeśli jest callback, wywołaj go
      onFilterChangeCallback(formData);
    } else {
      // W przeciwnym razie przejdź do strony wyników
      const searchParams = new URLSearchParams();
      
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
  }, [formData, navigate, onFilterChangeCallback]);

  return {
    formData,
    matchingResults,
    isLoading,
    availableBrands,
    availableModels,
    showAdvanced,
    isLoadingBrands,
    isLoadingModels,
    handleInputChange,
    toggleAdvancedFilters,
    resetForm,
    handleSearch
  };
};

export default useSearchForm;