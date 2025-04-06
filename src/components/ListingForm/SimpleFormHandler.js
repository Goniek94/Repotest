// SimpleFormHandler.js
import axios from 'axios';

// Funkcja do prostego wysłania formularza
export const submitSimpleForm = async (listingData, onSuccess, onError) => {
  try {
    // Tworzymy prostą instancję axios
    const axiosSimple = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Tworzymy proste FormData
    const formData = new FormData();
    
    // Dokładnie te pola wymagane przez backend
    formData.append('make', listingData.brand);
    formData.append('model', listingData.model);
    formData.append('year', listingData.productionYear);
    formData.append('price', listingData.price || 1000);
    formData.append('mileage', listingData.mileage || 0);
    formData.append('description', listingData.description || 'Opis auta');
    formData.append('fuelType', 'benzyna');
    formData.append('transmission', 'manualna');
    
    // Zdjęcia
    if (listingData.photos && listingData.photos.length > 0) {
      // Jeśli są to pliki
      if (listingData.photos[0] instanceof File) {
        listingData.photos.forEach(photo => {
          formData.append('images', photo);
        });
      }
    }
    
    // Bezpośrednie wysłanie na endpoint /ads/add
    const response = await axiosSimple.post('/ads/add', formData);
    
    if (onSuccess) onSuccess(response.data);
    return response.data;
    
  } catch (error) {
    console.error('Błąd w SimpleFormHandler:', error);
    if (onError) onError(error);
    throw error;
  }
};