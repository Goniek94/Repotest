import { useState, useEffect } from 'react';
import CarDataService from '../../../services/carDataService';
import { carData as staticCarData } from '../SearchFormConstants';

/**
 * Hook do pobierania i zarządzania danymi o markach i modelach samochodów
 * Najpierw próbuje pobrać dane z backendu, a jeśli to się nie uda, używa statycznych danych
 * 
 * @returns {Object} Obiekt zawierający dane o markach i modelach oraz funkcje pomocnicze
 */
const useCarData = () => {
  // Stan przechowujący dane o markach i modelach
  const [carData, setCarData] = useState(staticCarData);
  
  // Stan przechowujący dostępne marki
  const [brands, setBrands] = useState(Object.keys(staticCarData));
  
  // Stan przechowujący modele dla wybranej marki
  const [modelsForBrand, setModelsForBrand] = useState({});
  
  // Stan ładowania
  const [loading, setLoading] = useState(true);
  
  // Stan błędu
  const [error, setError] = useState(null);

  // Pobierz dane o markach i modelach z backendu
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const data = await CarDataService.getCarData();
        
        // Jeśli otrzymaliśmy dane z backendu, zaktualizuj stan
        if (data && Object.keys(data).length > 0) {
          setCarData(data);
          setBrands(Object.keys(data).sort());
        }
        
        setError(null);
      } catch (err) {
        console.error('Błąd podczas pobierania danych o markach i modelach:', err);
        setError('Nie udało się pobrać danych o markach i modelach. Używam danych statycznych.');
        // W przypadku błędu, używamy statycznych danych
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarData();
  }, []);

  /**
   * Pobierz modele dla danej marki
   * @param {string} brand - Nazwa marki
   * @returns {Promise<void>}
   */
  const getModelsForBrand = async (brand) => {
    if (!brand) {
      setModelsForBrand({});
      return [];
    }
    
    // Jeśli już mamy modele dla tej marki w cache, zwróć je
    if (modelsForBrand[brand]) {
      return modelsForBrand[brand];
    }
    
    try {
      // Pobierz modele z backendu
      const models = await CarDataService.getModelsForBrand(brand);
      
      // Zaktualizuj cache
      setModelsForBrand(prev => ({
        ...prev,
        [brand]: models
      }));
      
      return models;
    } catch (err) {
      console.error(`Błąd podczas pobierania modeli dla marki ${brand}:`, err);
      
      // W przypadku błędu, użyj statycznych danych
      const staticModels = carData[brand] || [];
      
      // Zaktualizuj cache
      setModelsForBrand(prev => ({
        ...prev,
        [brand]: staticModels
      }));
      
      return staticModels;
    }
  };

  /**
   * Wyczyść cache danych
   */
  const clearCache = () => {
    CarDataService.clearCache();
    setModelsForBrand({});
  };

  return {
    carData,
    brands,
    getModelsForBrand,
    clearCache,
    loading,
    error
  };
};

export default useCarData;
