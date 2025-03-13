import axios from 'axios';

const API_URL = '/api/ads';

const listingsService = {
  // Pobieranie ogłoszeń z filtrowaniem i sortowaniem
  getListings: async (filters = {}, page = 1, limit = 20, sortBy = 'createdAt', order = 'desc') => {
    try {
      const params = new URLSearchParams();
      
      // Dodaj parametry paginacji i sortowania
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      params.append('sortBy', sortBy);
      params.append('order', order);
      
      // Dodaj filtry
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          // Konwertuj filtry według nazw parametrów na backendzie
          switch (key) {
            case 'priceFrom':
              params.append('minPrice', value.toString());
              break;
            case 'priceTo':
              params.append('maxPrice', value.toString());
              break;
            case 'yearFrom':
              params.append('minYear', value.toString());
              break;
            case 'yearTo':
              params.append('maxYear', value.toString());
              break;
            case 'mileageFrom':
              params.append('minMileage', value.toString());
              break;
            case 'mileageTo':
              params.append('maxMileage', value.toString());
              break;
            default:
              params.append(key, value.toString());
              break;
          }
        }
      });
      
      const response = await axios.get(`${API_URL}/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },
  
  // Pobieranie pojedynczego ogłoszenia
  getListing: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  },
  
  // Dodawanie ogłoszenia do ulubionych
  addToFavorites: async (adId) => {
    try {
      const response = await axios.post('/api/favorites', { adId });
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },
  
  // Usuwanie ogłoszenia z ulubionych
  removeFromFavorites: async (adId) => {
    try {
      const response = await axios.delete(`/api/favorites/${adId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },
  
  // Pobieranie dostępnych marek
  getAvailableMakes: async () => {
    try {
      const response = await axios.get(`${API_URL}/makes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching makes:', error);
      throw error;
    }
  },
  
  // Pobieranie modeli dla danej marki
  getModelsForMake: async (make) => {
    try {
      const response = await axios.get(`${API_URL}/models?make=${make}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }
};

export default listingsService;