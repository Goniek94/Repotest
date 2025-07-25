import api from './api';

/**
 * Serwis do pobierania danych o markach i modelach samochodów z API
 */
class CarDataService {
  /**
   * Pobiera wszystkie marki samochodów
   * @returns {Promise<Array>} Lista marek samochodów
   */
  static async getAllBrands() {
    try {
      const response = await api.get('/car-brands');
      console.log('Odpowiedź API getAllBrands:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Błąd podczas pobierania marek samochodów:', error);
      return [];
    }
  }

  /**
   * Pobiera wszystkie marki i modele samochodów
   * @returns {Promise<Object>} Obiekt z markami i modelami
   */
  static async getAllBrandsAndModels() {
    try {
      const response = await api.get('/car-brands/all-data');
      console.log('Odpowiedź API getAllBrandsAndModels:', response.data);
      
      // Sprawdź, czy dane są w oczekiwanym formacie
      if (response.data && response.data.data && typeof response.data.data === 'object') {
        return response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        // Jeśli dane są bezpośrednio w response.data
        return response.data;
      }
      
      console.warn('Dane z API nie są w oczekiwanym formacie:', response.data);
      return {};
    } catch (error) {
      console.error('Błąd podczas pobierania marek i modeli samochodów:', error);
      
      // W przypadku błędu, zwróć pusty obiekt
      console.error('Nie udało się pobrać danych o markach i modelach');
      return {};
    }
  }

  /**
   * Pobiera modele dla konkretnej marki
   * @param {string} brand Nazwa marki
   * @returns {Promise<Array>} Lista modeli dla danej marki
   */
  static async getModelsForBrand(brand) {
    if (!brand) return [];
    
    try {
      const response = await api.get(`/car-brands/models?brand=${encodeURIComponent(brand)}`);
      return response.data || [];
    } catch (error) {
      console.error(`Błąd podczas pobierania modeli dla marki ${brand}:`, error);
      return [];
    }
  }

  /**
   * Wyszukuje marki samochodów
   * @param {string} query Zapytanie wyszukiwania
   * @returns {Promise<Array>} Lista pasujących marek
   */
  static async searchBrands(query) {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await api.get(`/car-brands/search?q=${encodeURIComponent(query)}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Błąd podczas wyszukiwania marek:', error);
      return [];
    }
  }

  /**
   * Pobiera generacje dla konkretnej marki i modelu
   * @param {string} brand Nazwa marki
   * @param {string} model Nazwa modelu
   * @returns {Promise<Array>} Lista generacji dla danego modelu
   */
  static async getGenerationsForModel(brand, model) {
    if (!brand || !model) return [];
    
    try {
      const response = await api.get(`/car-brands/${encodeURIComponent(brand)}/${encodeURIComponent(model)}/generations`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Błąd podczas pobierania generacji dla modelu ${model} marki ${brand}:`, error);
      return [];
    }
  }

  /**
   * Wyszukuje modele dla konkretnej marki
   * @param {string} brand Nazwa marki
   * @param {string} query Zapytanie wyszukiwania
   * @returns {Promise<Array>} Lista pasujących modeli
   */
  static async searchModels(brand, query) {
    if (!brand || !query || query.length < 2) return [];
    
    try {
      const response = await api.get(`/car-brands/${encodeURIComponent(brand)}/search?q=${encodeURIComponent(query)}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Błąd podczas wyszukiwania modeli dla marki ${brand}:`, error);
      return [];
    }
  }

  /**
   * Czyści cache danych o samochodach w localStorage
   */
  static clearCache() {
    localStorage.removeItem('carData');
    console.log('Wyczyszczono cache danych o samochodach');
  }
}

export default CarDataService;
