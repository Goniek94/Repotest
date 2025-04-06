import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInfoSection from './sections/BasicInfoSection';
import VehicleStatusSection from './sections/VehicleStatusSection';
import BodyInfoSection from './sections/BodyInfoSection';
import TechnicalDataSection from './sections/TechnicalDataSection';
import LocationSection from './sections/LocationSection';
import PhotoUploadSection from './sections/PhotoUploadSection';
import DescriptionPriceSection from './sections/DescriptionPriceSection';
import Toast from './components/Toast';
import FormValidator from './utils/FormValidator';

const CreateListingForm = () => {
  const navigate = useNavigate();

  // Stan formularza ze wszystkimi polami
  const [formData, setFormData] = useState({
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
    tuning: 'Nie',
    imported: 'Nie',
    registeredInPL: 'Tak',
    firstOwner: 'Nie',
    disabledAdapted: 'Nie',
    
    // Typ nadwozia i kolor
    bodyType: '',
    color: '',
    doors: '',
    
    // Dane techniczne
    mileage: '',
    lastOfficialMileage: '',
    countryOfOrigin: '',
    fuelType: '',
    power: '',
    engineSize: '',
    transmission: '',
    drive: '',
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
  });
  
  // Stan błędów
  const [errors, setErrors] = useState({});
  
  // Stan powiadomień
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info'
  });
  
  // Sprawdzenie, czy użytkownik jest zalogowany
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('token');
    if (!isAuthenticated) {
      showToast('Musisz być zalogowany, aby dodać ogłoszenie', 'error');
      setTimeout(() => {
        navigate('/login', { state: { returnUrl: '/create-listing' } });
      }, 2000);
    }
  }, [navigate]);
  
  // Handler zmiany pola
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Resetowanie błędów po zmianie pola
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Funkcja wyświetlania powiadomień
  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 5000);
  };
  
  // Ukrywanie powiadomienia
  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };
  
  // Walidacja formularza
  const validateForm = () => {
    const newErrors = FormValidator.validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Obsługa submitu formularza
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Przekierowanie do podglądu z danymi
      navigate('/add-listing-view', { state: { listingData: formData } });
    } else {
      // Pokazanie komunikatu o błędach
      showToast('Proszę poprawić błędy w formularzu', 'error');
      
      // Przewinięcie do pierwszego błędu
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[90%] mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Dodaj nowe ogłoszenie</h1>
        
        {/* Check lista wymaganych pól - stała widoczna na górze */}
        <div className="sticky top-0 z-10 mb-6 p-4 bg-white shadow-md rounded-[2px] border-l-4 border-[#35530A]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`flex items-center gap-2 ${formData.brand && formData.model && formData.productionYear ? 'text-green-600' : 'text-gray-500'}`}>
              <span className="w-5 h-5 inline-flex items-center justify-center rounded-full border border-current">
                {formData.brand && formData.model && formData.productionYear ? '✓' : '1'}
              </span>
              <span>Dane pojazdu</span>
            </div>
            <div className={`flex items-center gap-2 ${formData.mileage && formData.fuelType && formData.power ? 'text-green-600' : 'text-gray-500'}`}>
              <span className="w-5 h-5 inline-flex items-center justify-center rounded-full border border-current">
                {formData.mileage && formData.fuelType && formData.power ? '✓' : '2'}
              </span>
              <span>Parametry techniczne</span>
            </div>
            <div className={`flex items-center gap-2 ${formData.photos && formData.photos.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              <span className="w-5 h-5 inline-flex items-center justify-center rounded-full border border-current">
                {formData.photos && formData.photos.length > 0 ? '✓' : '3'}
              </span>
              <span>Zdjęcia</span>
            </div>
            <div className={`flex items-center gap-2 ${formData.description && formData.price ? 'text-green-600' : 'text-gray-500'}`}>
              <span className="w-5 h-5 inline-flex items-center justify-center rounded-full border border-current">
                {formData.description && formData.price ? '✓' : '4'}
              </span>
              <span>Opis i cena</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sekcja 1: Podstawowe informacje o pojeździe */}
          <div id="section-basic" className="bg-white p-6 rounded-[2px] shadow-md">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">1. Podstawowe informacje o pojeździe</h2>
            <BasicInfoSection 
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              showToast={showToast}
            />
          </div>
          
          {/* Sekcja 2: Stan pojazdu */}
          <div id="section-status" className="bg-white p-6 rounded-[2px] shadow-md">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">2. Stan pojazdu</h2>
            <VehicleStatusSection 
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          
          {/* Sekcja 3: Nadwozie */}
          <div id="section-body" className="bg-white p-6 rounded-[2px] shadow-md">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">3. Nadwozie i kolor</h2>
            <BodyInfoSection 
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          
          {/* Sekcja 4: Dane techniczne */}
          <div id="section-technical" className="bg-white p-6 rounded-[2px] shadow-md">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">4. Dane techniczne</h2>
            <TechnicalDataSection 
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          
          {/* Sekcja 5: Lokalizacja */}
          <div id="section-location" className="bg-white p-6 rounded-[2px] shadow-md">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">5. Lokalizacja pojazdu</h2>
            <LocationSection 
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          
          {/* Sekcja 6: Zdjęcia */}
          <div id="section-photos" className="bg-white p-6 rounded-[2px] shadow-md">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">6. Zdjęcia pojazdu</h2>
            <PhotoUploadSection 
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              showToast={showToast}
            />
          </div>
          
          {/* Sekcja 7: Opis i cena */}
          <div id="section-description" className="bg-white p-6 rounded-[2px] shadow-md">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">7. Opis i cena</h2>
            <DescriptionPriceSection 
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          
          {/* Przycisk wysyłania - stały na dole */}
          <div className="bg-white p-6 rounded-[2px] shadow-md sticky bottom-4 z-10 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-[2px] w-full md:w-auto">
                <div className="font-medium mb-1">Przed kontynuacją upewnij się, że:</div>
                <ul className="list-disc list-inside">
                  <li>Wszystkie wymagane pola zostały wypełnione</li>
                  <li>Dodałeś/aś minimum jedno zdjęcie pojazdu</li>
                  <li>Podane informacje są dokładne i zgodne ze stanem faktycznym</li>
                </ul>
              </div>
              <button
                type="submit"
                className="bg-[#35530A] text-white px-8 py-4 rounded-[2px] hover:bg-[#2D4A06] transition-colors w-full md:w-auto flex justify-center items-center gap-2"
              >
                Przejdź do podglądu
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </form>
        
        {/* Toast z powiadomieniami */}
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    </div>
  );
};

export default CreateListingForm;