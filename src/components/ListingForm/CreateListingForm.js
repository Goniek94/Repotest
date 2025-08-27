import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BasicInfoSection from './sections/BasicInfoSection';
import VehicleStatusSection from './sections/VehicleStatusSection';
import BodyInfoSection from './sections/BodyInfoSection';
import TechnicalDataSection from './sections/TechnicalDataSection';
import LocationSection from './sections/LocationSection';
import PhotoUploadSection from './sections/PhotoUploadSection';
import DescriptionSection from './sections/DescriptionSection';
import PriceSection from './sections/PriceSection';
import Toast from './components/Toast';
import useListingForm from './hooks/useListingForm';
import useToast from './hooks/useToast';

const CreateListingForm = () => {
const navigate = useNavigate();
const location = useLocation();

// Sprawdź czy użytkownik wraca z podglądu lub ładuje wersję roboczą
const isReturningFromPreview = location.search.includes('from=preview');
const isLoadingFromDraft = location.search.includes('from=draft');

// Stan do śledzenia czy formularz powinien być auto-zapisywany
const [shouldAutoSave, setShouldAutoSave] = useState(isReturningFromPreview);
const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'

const {
  formData,
  setFormData,
  errors,
  handleChange,
  validateForm,
  saveTemporaryData,
  saveDraft,
  getDrafts,
  loadDraft,
  deleteDraft
} = useListingForm(isReturningFromPreview);
const { toast, showToast, hideToast } = useToast();

// Efekt do obsługi powrotu z podglądu i ładowania wersji roboczej
useEffect(() => {
  if (isReturningFromPreview) {
    showToast('Powrócono z podglądu - dane zostały przywrócone', 'info');
    // Usuń parametr z URL
    navigate('/create-listing', { replace: true });
  } else if (isLoadingFromDraft) {
    showToast('Wersja robocza została załadowana do formularza', 'success');
    // Usuń parametr z URL
    navigate('/create-listing', { replace: true });
  }
}, [isReturningFromPreview, isLoadingFromDraft, navigate, showToast]);

// Auto-save tylko gdy wracamy z podglądu
useEffect(() => {
  if (!shouldAutoSave) return;

  const autoSaveInterval = setInterval(async () => {
    // Sprawdź czy formularz ma jakieś dane do zapisania
    const hasData = Object.values(formData).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    });

    if (hasData) {
      setAutoSaveStatus('saving');
      try {
        saveTemporaryData(formData);
        setAutoSaveStatus('saved');
        console.log('Auto-save: Dane formularza zostały zapisane');
        
        // Ukryj status po 2 sekundach
        setTimeout(() => {
          setAutoSaveStatus('');
        }, 2000);
      } catch (error) {
        console.error('Auto-save: Błąd podczas zapisywania:', error);
        setAutoSaveStatus('error');
        
        // Ukryj status błędu po 3 sekundach
        setTimeout(() => {
          setAutoSaveStatus('');
        }, 3000);
      }
    }
  }, 30000); // Auto-save co 30 sekund

  // Cleanup
  return () => {
    clearInterval(autoSaveInterval);
  };
}, [shouldAutoSave, formData, saveTemporaryData]);

// Efekt do wyłączenia auto-save po opuszczeniu strony
useEffect(() => {
  const handleBeforeUnload = () => {
    // Wyłącz auto-save gdy użytkownik opuszcza stronę
    setShouldAutoSave(false);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);

  // Stan dla śledzenia otwartych sekcji
  const [openSections, setOpenSections] = useState({
    basic: true,
    status: false,
    body: false,
    technical: false,
    location: false,
    photos: false,
    description: false,
    price: false
  });


// Obsługa submitu formularza
const handleSubmit = (e) => {
  e.preventDefault();

  if (validateForm()) {
    // Zapisz tymczasowe dane przed przejściem do podglądu
    saveTemporaryData(formData);
    
    // Przekierowanie bezpośrednio do AddListingView z danymi formularza
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

// Funkcja zapisywania wersji roboczej
const handleSaveDraft = () => {
  const draftName = prompt('Podaj nazwę wersji roboczej:', `Wersja robocza ${new Date().toLocaleDateString()}`);
  if (draftName) {
    const success = saveDraft(formData, draftName);
    if (success) {
      showToast('Wersja robocza została zapisana', 'success');
    } else {
      showToast('Błąd podczas zapisywania wersji roboczej', 'error');
    }
  }
};

// Stan dla zarządzania wersji roboczych
const [showDrafts, setShowDrafts] = useState(false);
const [drafts, setDrafts] = useState([]);

// Funkcja do odświeżania listy wersji roboczych
const refreshDrafts = () => {
  setDrafts(getDrafts());
};

// Funkcja ładowania wersji roboczej
const handleLoadDraft = (index) => {
  const success = loadDraft(index);
  if (success) {
    showToast('Wersja robocza została załadowana', 'success');
    setShowDrafts(false);
  } else {
    showToast('Błąd podczas ładowania wersji roboczej', 'error');
  }
};

// Funkcja usuwania wersji roboczej
const handleDeleteDraft = (index) => {
  if (window.confirm('Czy na pewno chcesz usunąć tę wersję roboczą?')) {
    const success = deleteDraft(index);
    if (success) {
      showToast('Wersja robocza została usunięta', 'success');
      refreshDrafts();
    } else {
      showToast('Błąd podczas usuwania wersji roboczej', 'error');
    }
  }
};


// Obsługa przełączania sekcji
const toggleSection = (section) => {
  console.log('toggleSection called with:', section);
  console.log('Current openSections:', openSections);
  setOpenSections(prev => {
    const newState = {
      ...prev,
      [section]: !prev[section]
    };
    console.log('New openSections state:', newState);
    return newState;
  });
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

// Usunięto renderowanie komponentu ListingSummary

return (
  <div className="min-h-screen bg-gray-50 py-6">
    <div className="max-w-[1100px] mx-auto px-6">
      <div className="flex items-center justify-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dodaj nowe ogłoszenie</h1>
        
        {/* Wskaźnik auto-save - tylko gdy jest aktywny */}
        {shouldAutoSave && (
          <div className="flex items-center gap-2 text-sm">
            {autoSaveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Zapisywanie...</span>
              </div>
            )}
            {autoSaveStatus === 'saved' && (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Zapisano</span>
              </div>
            )}
            {autoSaveStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Błąd zapisu</span>
              </div>
            )}
            {autoSaveStatus === '' && (
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Auto-zapis aktywny</span>
              </div>
            )}
          </div>
        )}
      </div>
      
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
        
        {/* Sekcja opisu pojazdu */}
        <div>
          <SectionHeader 
            id="section-description-header" 
            title="7. Opis pojazdu" 
            isOpen={openSections.description}
            onClick={() => toggleSection('description')}
          />
          {openSections.description && (
            <div className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-[2px]">
              <DescriptionSection
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            </div>
          )}
        </div>
        
        {/* Sekcja ceny i opcji zakupu */}
        <div>
          <SectionHeader 
            id="section-price-header" 
            title="8. Cena i opcje zakupu" 
            isOpen={openSections.price}
            onClick={() => toggleSection('price')}
          />
          {openSections.price && (
            <div className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-[2px]">
              <PriceSection
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            </div>
          )}
        </div>
        
        {/* Sekcja finalizacji */}
        <div className="bg-white p-6 rounded-[2px] shadow-md border border-gray-200 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[#35530A] bg-[#F5FAF5] border-l-4 border-[#35530A] p-3 rounded-[2px] w-full md:w-auto">
              <div className="font-medium mb-1">Przed kontynuacją upewnij się, że:</div>
              <ul className="list-disc list-inside">
                <li>Wszystkie wymagane pola zostały wypełnione</li>
                <li><strong>Dodałeś/aś minimum 5 zdjęć pojazdu</strong></li>
                <li>Podane informacje są dokładne i zgodne ze stanem faktycznym</li>
              </ul>
              <p className="text-xs text-[#35530A] opacity-80 mt-2">
                Backend pobiera tylko podstawowe dane lokalizacyjne: województwo i miasto. 
                Kod pocztowy, dzielnica i opcje odbioru nie są przechowywane w bazie danych.
              </p>
            </div>
            <button
              type="submit"
              className="bg-[#35530A] text-white px-8 py-4 rounded-sm hover:bg-[#2D4A06] transition-colors w-full md:w-auto flex justify-center items-center gap-2"
            >
              Przejdź do podglądu
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Mniejsze przyciski wersji roboczych pod głównym przyciskiem */}
          <div className="flex flex-wrap gap-2 justify-center mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="bg-blue-500 text-white px-3 py-1 rounded-sm hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Zapisz wersję roboczą
            </button>
            
            <button
              type="button"
              onClick={() => {
                refreshDrafts();
                setShowDrafts(!showDrafts);
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded-sm hover:bg-gray-600 transition-colors text-sm flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {showDrafts ? 'Ukryj' : 'Pokaż'} wersje robocze ({getDrafts().length})
            </button>
          </div>

          {/* Lista wersji roboczych */}
          {showDrafts && (
            <div className="border-t pt-4 mt-4">
              {drafts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Brak zapisanych wersji roboczych</p>
              ) : (
                <div className="space-y-2">
                  {drafts.map((draft, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-[2px]">
                      <div>
                        <div className="font-medium">{draft.draftName}</div>
                        <div className="text-sm text-gray-500">
                          Zapisano: {new Date(draft.savedAt).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {draft.brand} {draft.model} {draft.generation}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleLoadDraft(index)}
                          className="bg-green-600 text-white px-3 py-1 rounded-[2px] hover:bg-green-700 transition-colors text-sm"
                        >
                          Załaduj
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDraft(index)}
                          className="bg-red-600 text-white px-3 py-1 rounded-[2px] hover:bg-red-700 transition-colors text-sm"
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
