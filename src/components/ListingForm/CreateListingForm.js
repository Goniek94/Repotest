import React, { useState } from 'react';
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
  
  // Stan dla śledzenia otwartych sekcji
  const [openSections, setOpenSections] = useState({
    basic: true,
    status: false,
    body: false,
    technical: false,
    location: false,
    photos: false,
    description: false
  });

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

  // Obsługa przełączania sekcji
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Komponent dla nagłówka sekcji
  const SectionHeader = ({ id, title, isOpen, onClick }) => (
    <div 
      className="flex items-center justify-between p-4 border border-gray-200 rounded-[2px] bg-white cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <h2 className="text-lg font-medium">{title}</h2>
      <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[1100px] mx-auto px-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Dodaj nowe ogłoszenie</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sekcja podstawowych informacji */}
          <div>
            <SectionHeader 
              id="section-basic-header" 
              title="1. Podstawowe informacje o pojeździe" 
              isOpen={openSections.basic}
              onClick={() => toggleSection('basic')}
            />
            {openSections.basic && (
              <div className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-[2px]">
                <BasicInfoSection
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                  showToast={showToast}
                />
              </div>
            )}
          </div>
          
          {/* Sekcja stanu pojazdu */}
          <div>
            <SectionHeader 
              id="section-status-header" 
              title="2. Stan pojazdu" 
              isOpen={openSections.status}
              onClick={() => toggleSection('status')}
            />
            {openSections.status && (
              <div className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-[2px]">
                <VehicleStatusSection
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              </div>
            )}
          </div>
          
          {/* Sekcja nadwozia */}
          <div>
            <SectionHeader 
              id="section-body-header" 
              title="3. Nadwozie i kolor" 
              isOpen={openSections.body}
              onClick={() => toggleSection('body')}
            />
            {openSections.body && (
              <div className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-[2px]">
                <BodyInfoSection
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              </div>
            )}
          </div>
          
          {/* Sekcja danych technicznych */}
          <div>
            <SectionHeader 
              id="section-technical-header" 
              title="4. Dane techniczne" 
              isOpen={openSections.technical}
              onClick={() => toggleSection('technical')}
            />
            {openSections.technical && (
              <div className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-[2px]">
                <TechnicalDataSection
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              </div>
            )}
          </div>
          
          {/* Sekcja lokalizacji */}
          <div>
            <SectionHeader 
              id="section-location-header" 
              title="5. Lokalizacja pojazdu" 
              isOpen={openSections.location}
              onClick={() => toggleSection('location')}
            />
            {openSections.location && (
              <div className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-[2px]">
                <LocationSection
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              </div>
            )}
          </div>
          
          {/* Sekcja zdjęć */}
          <div>
            <SectionHeader 
              id="section-photos-header" 
              title="6. Zdjęcia pojazdu" 
              isOpen={openSections.photos}
              onClick={() => toggleSection('photos')}
            />
            {openSections.photos && (
              <div className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-[2px]">
                <PhotoUploadSection
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  showToast={showToast}
                />
              </div>
            )}
          </div>
          
          {/* Sekcja opisu i ceny */}
          <div>
            <SectionHeader 
              id="section-description-header" 
              title="7. Opis i cena" 
              isOpen={openSections.description}
              onClick={() => toggleSection('description')}
            />
            {openSections.description && (
              <div className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-[2px]">
                <DescriptionPriceSection
                  formData={formData}
                  handleChange={handleChange}
                  errors={errors}
                />
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-[2px] shadow-md border border-gray-200 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-[2px] w-full md:w-auto">
                <div className="font-medium mb-1">Przed kontynuacją upewnij się, że:</div>
                <ul className="list-disc list-inside">
                  <li>Wszystkie wymagane pola zostały wypełnione</li>
                  <li>Dodałeś/aś minimum jedno zdjęcie pojazdu</li>
                  <li>Podane informacje są dokładne i zgodne ze stanem faktycznym</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  Backend pobiera tylko podstawowe dane lokalizacyjne: województwo i miasto. 
                  Kod pocztowy, dzielnica i opcje odbioru nie są przechowywane w bazie danych.
                </p>
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
