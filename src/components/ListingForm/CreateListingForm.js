import React from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInfoSection from './sections/BasicInfoSection';
import VehicleStatusSection from './sections/VehicleStatusSection';
import BodyInfoSection from './sections/BodyInfoSection';
import TechnicalDataSection from './sections/TechnicalDataSection';
import LocationSection from './sections/LocationSection';
import PhotoUploadSection from './sections/PhotoUploadSection';
import DescriptionPriceSection from './sections/DescriptionPriceSection';
import Toast from './components/Toast';
import useListingForm from './hooks/useListingForm';
import useToast from './hooks/useToast';

const CreateListingForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm
  } = useListingForm();
  const { toast, showToast, hideToast } = useToast();

  // Obsługa submitu formularza
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      navigate('/add-listing-view', { state: { listingData: formData } });
    } else {
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
      <div className="max-w-[1100px] mx-auto px-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Dodaj nowe ogłoszenie</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div id="section-basic" className="bg-[#f7f8fa] p-6 rounded-[2px] shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">1. Podstawowe informacje o pojeździe</h2>
            <BasicInfoSection
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              showToast={showToast}
            />
          </div>
          <div id="section-status" className="bg-[#f7f8fa] p-6 rounded-[2px] shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">2. Stan pojazdu</h2>
            <VehicleStatusSection
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          <div id="section-body" className="bg-[#f7f8fa] p-6 rounded-[2px] shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">3. Nadwozie i kolor</h2>
            <BodyInfoSection
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          <div id="section-technical" className="bg-[#f7f8fa] p-6 rounded-[2px] shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">4. Dane techniczne</h2>
            <TechnicalDataSection
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          <div id="section-location" className="bg-[#f7f8fa] p-6 rounded-[2px] shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">5. Lokalizacja pojazdu</h2>
            <LocationSection
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          <div id="section-photos" className="bg-[#f7f8fa] p-6 rounded-[2px] shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">6. Zdjęcia pojazdu</h2>
            <PhotoUploadSection
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              showToast={showToast}
            />
          </div>
          <div id="section-description" className="bg-[#f7f8fa] p-6 rounded-[2px] shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">7. Opis i cena</h2>
            <DescriptionPriceSection
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
          <div className="bg-[#f7f8fa] p-6 rounded-[2px] shadow-md sticky bottom-4 z-10 border-t border-gray-200">
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
