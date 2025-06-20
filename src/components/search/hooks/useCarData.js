import { useState, useEffect, useCallback } from 'react';
import CarDataService from '../../../services/carDataService';
import { carData as staticCarData } from '../SearchFormConstants';
import { generationsData, getGenerationsForModel as getStaticGenerations } from '../GenerationsData';

/**
 * Hook do pobierania danych o markach i modelach samochodów.
 * Najpierw próbuje pobrać dane z backendu, jeśli to się nie uda, używa danych statycznych.
 * 
 * @returns {Object} Object zawierający carData, brands, getModelsForBrand, getGenerationsForModel, loading i error
 */
const useCarData = () => {
  // Stan dla danych o markach i modelach
  const [carData, setCarData] = useState({});
  // Stan dla listy marek
  const [brands, setBrands] = useState([]);
  // Stan ładowania
  const [loading, setLoading] = useState(true);
  // Stan błędu
  const [error, setError] = useState(null);
  // Cache modeli dla marek
  const [modelsCache, setModelsCache] = useState({});
  // Cache generacji dla modeli
  const [generationsCache, setGenerationsCache] = useState({});

  // Funkcja do pobierania modeli dla konkretnej marki
  const getModelsForBrand = useCallback(async (brand) => {
    // Jeśli mamy już modele dla tej marki w cache, zwróć je
    if (modelsCache[brand]) {
      console.log(`Pobieranie modeli dla marki ${brand} z cache`, modelsCache[brand]);
      return modelsCache[brand];
    }

    try {
      // Najpierw próbujemy pobrać modele z backendu
      const response = await CarDataService.getModelsForBrand(brand);
      
      if (response && response.data && Array.isArray(response.data.models)) {
        // Jeśli udało się pobrać modele z backendu, aktualizujemy cache i zwracamy je
        const models = response.data.models.sort();
        setModelsCache(prev => ({
          ...prev,
          [brand]: models
        }));
        console.log(`Pobrano modele dla marki ${brand} z backendu`, models);
        return models;
      }
    } catch (err) {
      console.warn(`Nie udało się pobrać modeli dla marki ${brand} z backendu, używam danych statycznych`, err);
    }

    // Jeśli nie udało się pobrać modeli z backendu, próbujemy użyć danych statycznych
    if (carData[brand]) {
      // Pobieramy modele z danych wczytanych wcześniej
      const models = carData[brand].sort();
      setModelsCache(prev => ({
        ...prev,
        [brand]: models
      }));
      console.log(`Pobrano modele dla marki ${brand} z danych statycznych`, models);
      return models;
    } else if (staticCarData[brand]) {
      // Pobieramy modele z danych statycznych
      const models = staticCarData[brand].sort();
      setModelsCache(prev => ({
        ...prev,
        [brand]: models
      }));
      console.log(`Pobrano modele dla marki ${brand} z danych statycznych (fallback)`, models);
      return models;
    }

    // Jeśli nie ma danych ani w backendzie, ani w danych statycznych, zwracamy pustą tablicę
    console.warn(`Brak modeli dla marki ${brand} w danych statycznych`);
    return [];
  }, [carData, modelsCache]);

  // Funkcja do pobierania generacji dla konkretnej marki i modelu
  const getGenerationsForModel = useCallback((make, model) => {
    // Jeśli brak marki lub modelu, zwróć pustą tablicę
    if (!make || !model) return [];

    // Utwórz klucz cache
    const cacheKey = `${make}-${model}`;

    // Jeśli mamy już generacje dla tej marki i modelu w cache, zwróć je
    if (generationsCache[cacheKey]) {
      console.log(`Pobieranie generacji dla ${make} ${model} z cache`, generationsCache[cacheKey]);
      return generationsCache[cacheKey];
    }

    // Pobierz generacje z danych statycznych
    const generations = getStaticGenerations(make, model);
    
    // Aktualizuj cache i zwróć generacje
    setGenerationsCache(prev => ({
      ...prev,
      [cacheKey]: generations
    }));
    
    console.log(`Pobrano generacje dla ${make} ${model}`, generations);
    return generations;
  }, [generationsCache]);

  // Efekt pobierający dane o markach i modelach przy inicjalizacji
  useEffect(() => {
    let isMounted = true;
    
    const fetchCarData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Sprawdź, czy mamy dane w localStorage
        const cachedData = localStorage.getItem('carData');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData && typeof parsedData === 'object' && Object.keys(parsedData).length > 0) {
            if (isMounted) {
              console.log('Pobrano dane o markach i modelach z localStorage', Object.keys(parsedData).length);
              setCarData(parsedData);
              setBrands(Object.keys(parsedData).sort());
              setLoading(false);
              return;
            }
          }
        }

        // Jeśli nie ma danych w localStorage, pobierz z backendu
        const response = await CarDataService.getAllBrandsAndModels();
        
        if (response && response.data && typeof response.data === 'object') {
          const data = response.data;
          
          if (Object.keys(data).length > 0) {
            // Zapisz dane w localStorage dla przyszłego użycia
            localStorage.setItem('carData', JSON.stringify(data));
            
            if (isMounted) {
              console.log('Pobrano dane o markach i modelach z backendu', Object.keys(data).length);
              setCarData(data);
              setBrands(Object.keys(data).sort());
              setLoading(false);
              return;
            }
          }
        }
        
        // Jeśli dane z backendu są puste lub niepoprawne, użyj danych statycznych
        if (isMounted) {
          console.log('Używam statycznych danych o markach i modelach', Object.keys(staticCarData).length);
          setCarData(staticCarData);
          setBrands(Object.keys(staticCarData).sort());
        }
      } catch (err) {
        console.warn('Błąd podczas pobierania danych o markach i modelach:', err);
        if (isMounted) {
          // Używamy danych statycznych jako fallback, bez komunikatu o błędzie
          setError(null);
          setCarData(staticCarData);
          setBrands(Object.keys(staticCarData).sort());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCarData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    carData,
    brands,
    getModelsForBrand,
    getGenerationsForModel,
    loading,
    error
  };
};

export default useCarData;