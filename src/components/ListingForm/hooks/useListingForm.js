import { useState, useEffect } from 'react';
import FormValidator from '../utils/FormValidator';

const STORAGE_KEY = 'auto_sell_listing_form';

const initialFormData = {
  brand: '',
  model: '',
  generation: '',
  version: '',
  productionYear: '',
  vin: '',
  registrationNumber: '',
  condition: '',
  accidentStatus: '',
  damageStatus: '',
  tuning: 'Nie',
  imported: 'Nie',
  registeredInPL: 'Tak',
  firstOwner: 'Nie',
  disabledAdapted: 'Nie',
  bodyType: '',
  color: '',
  doors: '',
  mileage: '',
  lastOfficialMileage: '',
  countryOfOrigin: '',
  fuelType: '',
  power: '',
  engineSize: '',
  transmission: '',
  drive: '',
  weight: '',
  voivodeship: '',
  city: '',
  photos: [],
  mainPhotoIndex: 0,
  description: '',
  price: '',
  rentalPrice: '',
  purchaseOption: 'sprzedaz',
  sellerType: 'prywatny',
  headline: ''
};

export default function useListingForm() {
  // Próba załadowania danych z localStorage przy inicjalizacji
  const loadFormData = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Odtwarzanie zdjęć - zdjęcia nie mogą być serializowane w localStorage
        // więc musimy je specjalnie obsłużyć - w tym przypadku resetujemy je
        return {
          ...parsedData,
          photos: [] // Resetujemy zdjęcia, ponieważ nie można ich zapisać w localStorage
        };
      }
    } catch (error) {
      console.error('Błąd podczas ładowania danych formularza:', error);
    }
    return initialFormData;
  };

  const [formData, setFormData] = useState(loadFormData);
  const [errors, setErrors] = useState({});

  // Zapisanie danych formularza do localStorage przy każdej zmianie
  useEffect(() => {
    try {
      // Musimy usunąć zdjęcia z obiektu przed zapisem, ponieważ
      // obiekty File nie mogą być serializowane
      const dataToSave = { ...formData };
      delete dataToSave.photos;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Błąd podczas zapisywania danych formularza:', error);
    }
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = FormValidator.validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm,
    resetForm
  };
}
