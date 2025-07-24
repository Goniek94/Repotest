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
      
      // W przypadku błędu, spróbuj pobrać dane z pliku car-brands-data.json
      try {
        // Symulacja pobierania danych z pliku
        const fallbackData = {
          "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "TT", "R8", "e-tron GT", "RS3", "RS4", "RS5", "RS6", "RS7", "RSQ3", "RSQ8", "S3", "S4", "S5", "S6", "S7", "S8", "SQ2", "SQ5", "SQ7", "SQ8"],
          "Daewoo": ["Espero", "Kalos", "Lacetti", "Lanos", "Leganza", "Matiz", "Nubira", "Tacuma", "Tico", "Polonez"],
          "Honda": ["Civic", "Accord", "Insight", "CR-V", "HR-V", "Passport", "Pilot", "Ridgeline", "Odyssey", "Fit", "NSX", "e"],
          "Mazda": ["Mazda2", "Mazda3", "Mazda6", "MX-5", "CX-3", "CX-30", "CX-5", "CX-9", "CX-50", "MX-30"],
          "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "CLA", "CLS", "E-Class", "G-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "S-Class", "SL", "SLK", "AMG GT", "EQA", "EQB", "EQC", "EQE", "EQS", "EQV", "Maybach S-Class", "Maybach GLS"],
          "Nissan": ["Micra", "Sentra", "Altima", "Maxima", "370Z", "GT-R", "Juke", "Qashqai", "X-Trail", "Murano", "Pathfinder", "Armada", "Titan", "Leaf", "Ariya"],
          "Toyota": ["Yaris", "Corolla", "Camry", "Avalon", "Prius", "C-HR", "RAV4", "Highlander", "4Runner", "Sequoia", "Tacoma", "Tundra", "Sienna", "Land Cruiser", "Supra", "86", "Mirai", "bZ4X"]
        };
        
        console.log('Używam danych zapasowych z pliku car-brands-data.json');
        return fallbackData;
      } catch (fallbackError) {
        console.error('Nie udało się pobrać danych zapasowych:', fallbackError);
        return {};
      }
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
