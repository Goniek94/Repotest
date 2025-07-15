import apiClient from './api/client';

// Cache dla danych
let carDataCache = null;
let lastFetchTime = null;
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 godziny

const CarDataService = {
  /**
   * Pobiera pełną strukturę marek i modeli z backendu
   * @returns {Promise<Object>} Obiekt z markami jako kluczami i tablicami modeli jako wartościami
   */
  getCarData: async () => {
    const now = new Date();
    
    // Jeśli mamy dane w cache i nie są przeterminowane, zwróć je
    if (carDataCache && lastFetchTime && (now - lastFetchTime < CACHE_EXPIRY)) {
      return carDataCache;
    }
    
    try {
      // Pobierz dane z backendu
      const response = await apiClient.get('/api/ads/car-data');
      carDataCache = response.data;
      lastFetchTime = now;
      return carDataCache;
    } catch (error) {
      console.error('Błąd podczas pobierania danych o markach i modelach:', error);
      // W przypadku błędu, zwróć pusty obiekt
      return {};
    }
  },
  
  /**
   * Pobiera listę wszystkich dostępnych marek
   * @returns {Promise<Array>} Tablica marek
   */
  getAllBrands: async () => {
    const carData = await CarDataService.getCarData();
    return Object.keys(carData).sort();
  },
  
  /**
   * Pobiera modele dla danej marki
   * @param {string} brand Nazwa marki
   * @returns {Promise<Array>} Tablica modeli dla danej marki
   */
  getModelsForBrand: async (brand) => {
    const carData = await CarDataService.getCarData();
    return (carData[brand] || []).sort();
  },
  
  /**
   * Pobiera wszystkie marki i modele w jednym zapytaniu
   * @returns {Promise<Object>} Obiekt z markami jako kluczami i tablicami modeli jako wartościami
   */
  getAllBrandsAndModels: async () => {
    return await CarDataService.getCarData();
  },

  /**
   * Wyczyść cache (np. po dodaniu nowego ogłoszenia)
   */
  clearCache: () => {
    carDataCache = null;
    lastFetchTime = null;
    // Wyczyść również localStorage
    localStorage.removeItem('carData');
  }
};

export default CarDataService;
