import { useState, useEffect, useCallback } from 'react';
import CarDataService from '../../../services/carDataService';
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
      const models = await CarDataService.getModelsForBrand(brand);
      
      if (models && Array.isArray(models) && models.length > 0) {
        // Jeśli udało się pobrać modele z backendu, aktualizujemy cache i zwracamy je
        const sortedModels = models.sort();
        setModelsCache(prev => ({
          ...prev,
          [brand]: sortedModels
        }));
        console.log(`Pobrano modele dla marki ${brand} z backendu`, sortedModels);
        return sortedModels;
      }
    } catch (err) {
      console.warn(`Nie udało się pobrać modeli dla marki ${brand} z backendu, używam danych statycznych`, err);
    }

    // Jeśli nie udało się pobrać modeli z backendu, próbujemy użyć danych z cache
    if (carData[brand]) {
      // Pobieramy modele z danych wczytanych wcześniej
      const models = carData[brand].sort();
      setModelsCache(prev => ({
        ...prev,
        [brand]: models
      }));
      console.log(`Pobrano modele dla marki ${brand} z danych cache`, models);
      return models;
    }

    // Jeśli nie ma danych, zwracamy pustą tablicę
    console.warn(`Brak modeli dla marki ${brand}`);
    return [];
  }, [carData, modelsCache]);

  // Funkcja do pobierania generacji dla konkretnej marki i modelu
  const getGenerationsForModel = useCallback(async (make, model) => {
    // Jeśli brak marki lub modelu, zwróć pustą tablicę
    if (!make || !model) return [];

    // Utwórz klucz cache
    const cacheKey = `${make}-${model}`;

    // Jeśli mamy już generacje dla tej marki i modelu w cache, zwróć je
    if (generationsCache[cacheKey]) {
      console.log(`Pobieranie generacji dla ${make} ${model} z cache`, generationsCache[cacheKey]);
      return generationsCache[cacheKey];
    }

    try {
      // Najpierw próbujemy pobrać generacje z backendu
      const generations = await CarDataService.getGenerationsForModel(make, model);
      
      if (generations && Array.isArray(generations) && generations.length > 0) {
        // Jeśli udało się pobrać generacje z backendu, aktualizujemy cache i zwracamy je
        setGenerationsCache(prev => ({
          ...prev,
          [cacheKey]: generations
        }));
        console.log(`Pobrano generacje dla ${make} ${model} z backendu`, generations);
        return generations;
      }
    } catch (err) {
      console.warn(`Nie udało się pobrać generacji dla ${make} ${model} z backendu, używam danych statycznych`, err);
    }

    // Jeśli nie udało się pobrać generacji z backendu, użyj danych statycznych
    const generations = getStaticGenerations(make, model);
    
    // Aktualizuj cache i zwróć generacje
    setGenerationsCache(prev => ({
      ...prev,
      [cacheKey]: generations
    }));
    
    console.log(`Pobrano generacje dla ${make} ${model} ze statycznych danych`, generations);
    return generations;
  }, [generationsCache]);

  // Efekt pobierający dane o markach i modelach przy inicjalizacji
  useEffect(() => {
    let isMounted = true;
    
    const fetchCarData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Najpierw wyczyść localStorage, aby wymusić pobieranie z backendu
        localStorage.removeItem('carData');
        console.log('Wyczyszczono cache danych o samochodach');
        
        // Pobierz dane z backendu
        const data = await CarDataService.getAllBrandsAndModels();
        
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          // Zapisz dane w localStorage dla przyszłego użycia
          localStorage.setItem('carData', JSON.stringify(data));
          
          if (isMounted) {
            console.log('Pobrano dane o markach i modelach z backendu', Object.keys(data).length);
            setCarData(data);
            setBrands(Object.keys(data).sort());
            setLoading(false);
            return;
          }
        } else {
          console.warn('Dane z backendu są puste lub niepoprawne');
        }
        
        // Jeśli dane z backendu są puste lub niepoprawne, sprawdź localStorage jako zapasowe źródło
        const cachedData = localStorage.getItem('carData');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData && typeof parsedData === 'object' && Object.keys(parsedData).length > 0) {
            if (isMounted) {
              console.log('Pobrano dane o markach i modelach z localStorage (zapasowo)', Object.keys(parsedData).length);
              setCarData(parsedData);
              setBrands(Object.keys(parsedData).sort());
              setLoading(false);
              return;
            }
          }
        }
        
        // Jeśli nie ma danych ani w backendu, ani w localStorage, użyj danych zapasowych
        if (isMounted) {
          console.log('Używam danych zapasowych');
          
          // Dane zapasowe z pliku car-brands-data.json
          const fallbackData = {
            "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "TT", "R8", "e-tron GT", "RS3", "RS4", "RS5", "RS6", "RS7", "RSQ3", "RSQ8", "S3", "S4", "S5", "S6", "S7", "S8", "SQ2", "SQ5", "SQ7", "SQ8"],
            "Daewoo": ["Espero", "Kalos", "Lacetti", "Lanos", "Leganza", "Matiz", "Nubira", "Tacuma", "Tico", "Polonez"],
            "Honda": ["Civic", "Accord", "Insight", "CR-V", "HR-V", "Passport", "Pilot", "Ridgeline", "Odyssey", "Fit", "NSX", "e"],
            "Mazda": ["Mazda2", "Mazda3", "Mazda6", "MX-5", "CX-3", "CX-30", "CX-5", "CX-9", "CX-50", "MX-30"],
            "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "CLA", "CLS", "E-Class", "G-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "S-Class", "SL", "SLK", "AMG GT", "EQA", "EQB", "EQC", "EQE", "EQS", "EQV", "Maybach S-Class", "Maybach GLS"],
            "Nissan": ["Micra", "Sentra", "Altima", "Maxima", "370Z", "GT-R", "Juke", "Qashqai", "X-Trail", "Murano", "Pathfinder", "Armada", "Titan", "Leaf", "Ariya"],
            "Toyota": ["Yaris", "Corolla", "Camry", "Avalon", "Prius", "C-HR", "RAV4", "Highlander", "4Runner", "Sequoia", "Tacoma", "Tundra", "Sienna", "Land Cruiser", "Supra", "86", "Mirai", "bZ4X"]
          };
          
          // Zapisz dane zapasowe w localStorage
          localStorage.setItem('carData', JSON.stringify(fallbackData));
          
          setCarData(fallbackData);
          setBrands(Object.keys(fallbackData).sort());
        }
      } catch (err) {
        console.warn('Błąd podczas pobierania danych o markach i modelach:', err);
        if (isMounted) {
          // W przypadku błędu, użyj danych zapasowych
          console.log('Używam danych zapasowych po błędzie');
          
          // Dane zapasowe z pliku car-brands-data.json
          const fallbackData = {
            "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "TT", "R8", "e-tron GT", "RS3", "RS4", "RS5", "RS6", "RS7", "RSQ3", "RSQ8", "S3", "S4", "S5", "S6", "S7", "S8", "SQ2", "SQ5", "SQ7", "SQ8"],
            "Daewoo": ["Espero", "Kalos", "Lacetti", "Lanos", "Leganza", "Matiz", "Nubira", "Tacuma", "Tico", "Polonez"],
            "Honda": ["Civic", "Accord", "Insight", "CR-V", "HR-V", "Passport", "Pilot", "Ridgeline", "Odyssey", "Fit", "NSX", "e"],
            "Mazda": ["Mazda2", "Mazda3", "Mazda6", "MX-5", "CX-3", "CX-30", "CX-5", "CX-9", "CX-50", "MX-30"],
            "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "CLA", "CLS", "E-Class", "G-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "S-Class", "SL", "SLK", "AMG GT", "EQA", "EQB", "EQC", "EQE", "EQS", "EQV", "Maybach S-Class", "Maybach GLS"],
            "Nissan": ["Micra", "Sentra", "Altima", "Maxima", "370Z", "GT-R", "Juke", "Qashqai", "X-Trail", "Murano", "Pathfinder", "Armada", "Titan", "Leaf", "Ariya"],
            "Toyota": ["Yaris", "Corolla", "Camry", "Avalon", "Prius", "C-HR", "RAV4", "Highlander", "4Runner", "Sequoia", "Tacoma", "Tundra", "Sienna", "Land Cruiser", "Supra", "86", "Mirai", "bZ4X"]
          };
          
          // Zapisz dane zapasowe w localStorage
          localStorage.setItem('carData', JSON.stringify(fallbackData));
          
          setCarData(fallbackData);
          setBrands(Object.keys(fallbackData).sort());
          setError(null);
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
