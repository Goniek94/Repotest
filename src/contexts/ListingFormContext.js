import React, { createContext, useContext, useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

// Tworzenie kontekstu
const ListingFormContext = createContext();

// Początkowy stan formularza
const initialState = {
  // Podstawowe informacje
  brand: '',
  model: '',
  generation: '',
  version: '',
  productionYear: '',
  vin: '',
  registrationNumber: '',
  
  // Stan pojazdu
  condition: '',
  accidentStatus: '',
  damageStatus: '',
  tuning: '',
  imported: '',
  registeredInPL: '',
  firstOwner: '',
  disabledAdapted: '',
  
  // Typ nadwozia i kolor
  bodyType: '',
  color: '',
  
  // Dane techniczne
  mileage: '',
  lastOfficialMileage: '',
  countryOfOrigin: '',
  fuelType: '',
  power: '',
  engineSize: '',
  transmission: '',
  drive: '',
  doors: '',
  weight: '',
  
  // Lokalizacja
  voivodeship: '',
  city: '',
  
  // Zdjęcia
  photos: [],
  mainPhotoIndex: 0,
  
  // Opis i cena
  description: '',
  price: '',
  rentalPrice: '',
  purchaseOption: 'sprzedaz'
};

// Reducer do obsługi zmian w formularzu
function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'UPDATE_MULTIPLE_FIELDS':
      return {
        ...state,
        ...action.fields
      };
    case 'SET_PHOTOS':
      return {
        ...state,
        photos: action.photos
      };
    case 'SET_MAIN_PHOTO':
      return {
        ...state,
        mainPhotoIndex: action.index
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

// Definicja dostawcy kontekstu
export function ListingFormProvider({ children }) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [isVinDataFetched, setIsVinDataFetched] = useState(false);
  
  const totalSteps = 5; // Liczba kroków w formularzu
  
  // Aktualizacja pojedynczego pola
  const updateField = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
    
    // Automatyczne usuwanie błędu po wprowadzeniu wartości
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Aktualizacja wielu pól jednocześnie
  const updateFormData = (fields) => {
    dispatch({ type: 'UPDATE_MULTIPLE_FIELDS', fields });
    
    // Automatyczne usuwanie błędów po wprowadzeniu wartości
    const updatedFields = Object.keys(fields);
    if (updatedFields.some(field => errors[field])) {
      setErrors(prev => {
        const newErrors = {...prev};
        updatedFields.forEach(field => {
          if (fields[field] && newErrors[field]) {
            delete newErrors[field];
          }
        });
        return newErrors;
      });
    }
  };
  
  // Ustawienie zdjęć
  const setPhotos = (photos) => {
    dispatch({ type: 'SET_PHOTOS', photos });
  };
  
  // Ustawienie głównego zdjęcia
  const setMainPhoto = (index) => {
    dispatch({ type: 'SET_MAIN_PHOTO', index });
  };
  
  // Resetowanie formularza
  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
    setCurrentStep(1);
    setErrors({});
  };
  
  // Walidacja obecnego kroku
  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1: // Informacje podstawowe
        if (!state.brand) newErrors.brand = 'Marka jest wymagana';
        if (!state.model) newErrors.model = 'Model jest wymagany';
        if (!state.productionYear) {
          newErrors.productionYear = 'Rok produkcji jest wymagany';
        } else if (state.productionYear < 1900 || state.productionYear > new Date().getFullYear()) {
          newErrors.productionYear = 'Podaj prawidłowy rok produkcji';
        }
        if (state.vin && state.vin.length !== 17) {
          newErrors.vin = 'VIN musi mieć 17 znaków';
        }
        break;
      
      case 2: // Stan pojazdu
        if (!state.condition) newErrors.condition = 'Stan pojazdu jest wymagany';
        break;
      
      case 3: // Dane techniczne
        if (!state.mileage) {
          newErrors.mileage = 'Przebieg jest wymagany';
        } else if (state.mileage < 0) {
          newErrors.mileage = 'Przebieg nie może być ujemny';
        }
        
        if (!state.fuelType) newErrors.fuelType = 'Rodzaj paliwa jest wymagany';
        if (!state.transmission) newErrors.transmission = 'Skrzynia biegów jest wymagana';
        if (!state.power) newErrors.power = 'Moc silnika jest wymagana';
        break;
      
      case 4: // Zdjęcia
        if (state.photos.length === 0) {
          newErrors.photos = 'Dodaj przynajmniej jedno zdjęcie';
        }
        break;
      
      case 5: // Opis i cena
        if (!state.description) {
          newErrors.description = 'Opis jest wymagany';
        } else if (state.description.length < 10) {
          newErrors.description = 'Opis musi zawierać co najmniej 10 znaków';
        }
        
        if (state.purchaseOption !== 'najem') {
          if (!state.price) {
            newErrors.price = 'Cena jest wymagana';
          } else if (state.price <= 0) {
            newErrors.price = 'Cena musi być większa od 0';
          }
        } else {
          if (!state.rentalPrice) {
            newErrors.rentalPrice = 'Cena najmu jest wymagana';
          } else if (state.rentalPrice <= 0) {
            newErrors.rentalPrice = 'Cena najmu musi być większa od 0';
          }
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Przejście do następnego kroku
  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Przejście do widoku podglądu
        navigate('/AddListingView', { state: { listingData: state } });
      }
    } else {
      // Pokazanie komunikatu o błędach
      showToast('Proszę poprawić błędy w formularzu', 'error');
    }
  };
  
  // Powrót do poprzedniego kroku
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Obsługa danych pobranych przez VIN
  const handleVinData = (data) => {
    if (data) {
      updateFormData(data);
      setIsVinDataFetched(true);
    }
  };
  
  // Wyświetlanie powiadomień
  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    
    // Automatyczne ukrywanie powiadomienia po czasie
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 5000);
  };
  
  // Ukrywanie powiadomienia
  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };
  
  // Wartości udostępniane przez kontekst
  const contextValue = {
    formData: state,
    updateField,
    updateFormData,
    setPhotos,
    setMainPhoto,
    resetForm,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    errors,
    toast,
    showToast,
    hideToast,
    handleVinData,
    isVinDataFetched
  };
  
  return (
    <ListingFormContext.Provider value={contextValue}>
      {children}
    </ListingFormContext.Provider>
  );
}

// Hook do używania kontekstu
export function useListingForm() {
  const context = useContext(ListingFormContext);
  if (!context) {
    throw new Error('useListingForm must be used within a ListingFormProvider');
  }
  return context;
}