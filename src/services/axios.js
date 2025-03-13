import axios from 'axios';

const mockListings = [
  // ... Twoje istniejące dane mockListings ...
];

// Tworzymy instancję axios z podstawową konfiguracją
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api' // Adres Twojego backendu
});

// Interceptor do dodawania tokenu i obsługi FormData
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Kluczowa zmiana - prawidłowa obsługa FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Rozszerzamy dotychczasowe API o nowe funkcje
const api = {
  // Oryginalna funkcja do pobierania mockowanych ogłoszeń
  getListings: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockListings;
  },
  
  // Nowa funkcja do dodawania ogłoszenia
  addListing: async (formData) => {
    try {
      const response = await axiosInstance.post('/ads/add', formData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas dodawania ogłoszenia:', error);
      throw error;
    }
  },
  
  // Nowa funkcja do aktualizacji statusu ogłoszenia
  updateAdStatus: async (adId, status) => {
    try {
      const response = await axiosInstance.put(`/ads/${adId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas aktualizacji statusu ogłoszenia:', error);
      throw error;
    }
  }
};

export default api;