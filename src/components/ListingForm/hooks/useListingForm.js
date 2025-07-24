import { useState, useEffect, useCallback } from 'react';
import FormValidator from '../utils/FormValidator';

const TEMP_STORAGE_KEY = 'auto_sell_temp_form'; // Tymczasowe dane tylko przy cofaniu z podglądu
const DRAFT_STORAGE_KEY = 'auto_sell_draft_form'; // Wersje robocze
const TEMP_DRAFT_KEY = 'auto_sell_temp_form'; // Tymczasowe dane wersji roboczej do załadowania

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
 images: [],
 mainImage: '',
 description: '',
 price: '',
 rentalPrice: '',
 purchaseOption: 'sprzedaz',
 sellerType: 'Prywatny',
 headline: '',
 listingType: 'standardowe',
 negotiable: 'Tak'
};

export default function useListingForm(isReturningFromPreview = false) {
 // Funkcja ładowania danych - obsługuje powrót z podglądu i ładowanie wersji roboczej
 const loadFormData = () => {
   // Sprawdź czy to powrót z podglądu
   if (isReturningFromPreview) {
     try {
       const tempData = localStorage.getItem(TEMP_STORAGE_KEY);
       if (tempData) {
         const parsedData = JSON.parse(tempData);
         // Usuń tymczasowe dane po załadowaniu
         localStorage.removeItem(TEMP_STORAGE_KEY);
         return {
           ...parsedData,
           photos: [] // Resetujemy zdjęcia, ponieważ nie można ich zapisać w localStorage
         };
       }
     } catch (error) {
       console.error('Błąd podczas ładowania tymczasowych danych formularza:', error);
     }
   }
   
   // Sprawdź czy to ładowanie wersji roboczej (z UserListings) - używamy tego samego klucza co TEMP_STORAGE_KEY
   if (!isReturningFromPreview) {
     try {
       const draftData = localStorage.getItem(TEMP_STORAGE_KEY);
       if (draftData) {
         const parsedData = JSON.parse(draftData);
         // Usuń tymczasowe dane wersji roboczej po załadowaniu
         localStorage.removeItem(TEMP_STORAGE_KEY);
         return {
           ...parsedData,
           photos: [] // Resetujemy zdjęcia, ponieważ nie można ich zapisać w localStorage
         };
       }
     } catch (error) {
       console.error('Błąd podczas ładowania wersji roboczej:', error);
     }
   }
   
   // Zawsze zwracaj czysty formularz, jeśli nie ma danych do załadowania
   return initialFormData;
 };

 const [formData, setFormData] = useState(loadFormData);
 const [errors, setErrors] = useState({});

 // Funkcja do zapisywania tymczasowych danych (tylko przy przejściu do podglądu)
 const saveTemporaryData = (data) => {
   try {
     const dataToSave = { ...data };
     
     // Usuń zdjęcia base64 które powodują przekroczenie limitu localStorage
     if (dataToSave.photos) {
       delete dataToSave.photos;
     }
     
     // Zachowaj tylko podstawowe informacje o zdjęciach
     if (dataToSave.images && Array.isArray(dataToSave.images)) {
       dataToSave.images = dataToSave.images.map(img => {
         if (typeof img === 'string') {
           return img; // URL string
         }
         if (img && typeof img === 'object') {
           return {
             url: img.url || img.src || '',
             name: img.name || ''
           };
         }
         return img;
       });
     }
     
     // Usuń inne potencjalnie problematyczne pola
     delete dataToSave.file;
     delete dataToSave.files;
     
     // Sprawdź rozmiar danych przed zapisem
     const dataString = JSON.stringify(dataToSave);
     const dataSize = new Blob([dataString]).size;
     
     // Jeśli dane są większe niż 4MB, usuń dodatkowe pola
     if (dataSize > 4 * 1024 * 1024) {
       console.warn('Dane formularza są zbyt duże dla localStorage, usuwam dodatkowe pola');
       delete dataToSave.mainImage;
       if (dataToSave.images) {
         dataToSave.images = dataToSave.images.slice(0, 5); // Zachowaj tylko pierwsze 5 URL-i
       }
     }
     
     localStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(dataToSave));
   } catch (error) {
     console.error('Błąd podczas zapisywania tymczasowych danych formularza:', error);
     
     // Jeśli nadal nie można zapisać, spróbuj z minimalnymi danymi
     try {
       const minimalData = {
         brand: data.brand || '',
         model: data.model || '',
         generation: data.generation || '',
         version: data.version || '',
         productionYear: data.productionYear || '',
         price: data.price || '',
         mileage: data.mileage || '',
         fuelType: data.fuelType || '',
         transmission: data.transmission || '',
         drive: data.drive || '',
         condition: data.condition || '',
         accidentStatus: data.accidentStatus || '',
         damageStatus: data.damageStatus || '',
         voivodeship: data.voivodeship || '',
         city: data.city || '',
         description: data.description || '',
         headline: data.headline || '',
         sellerType: data.sellerType || ''
       };
       
       localStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(minimalData));
       console.log('Zapisano minimalne dane formularza');
     } catch (minimalError) {
       console.error('Nie udało się zapisać nawet minimalnych danych:', minimalError);
     }
   }
 };

 // Funkcja do zapisywania wersji roboczej
 const saveDraft = (data, draftName) => {
   try {
     const dataToSave = { 
       ...data,
       draftName: draftName || `Wersja robocza ${new Date().toLocaleString()}`,
       savedAt: new Date().toISOString()
     };
     
     // Usuwamy obiekty File z tablicy images
     if (dataToSave.images && Array.isArray(dataToSave.images)) {
       dataToSave.images = dataToSave.images.map(img => {
         if (img && typeof img === 'object') {
           return { url: img.url || '' };
         }
         return img;
       });
     }
     
     // Pobierz istniejące drafty
     const existingDrafts = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '[]');
     
     // Dodaj nowy draft
     const newDrafts = [...existingDrafts, dataToSave];
     
     // Zachowaj maksymalnie 5 ostatnich draftów
     const limitedDrafts = newDrafts.slice(-5);
     
     localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(limitedDrafts));
     
     return true;
   } catch (error) {
     console.error('Błąd podczas zapisywania wersji roboczej:', error);
     return false;
   }
 };

 // Funkcja do pobierania wersji roboczych
 const getDrafts = () => {
   try {
     const drafts = localStorage.getItem(DRAFT_STORAGE_KEY);
     return drafts ? JSON.parse(drafts) : [];
   } catch (error) {
     console.error('Błąd podczas pobierania wersji roboczych:', error);
     return [];
   }
 };

 // Funkcja do ładowania wersji roboczej
 const loadDraft = (draftIndex) => {
   try {
     const drafts = getDrafts();
     if (drafts[draftIndex]) {
       const draftData = { ...drafts[draftIndex] };
       delete draftData.draftName;
       delete draftData.savedAt;
       setFormData(draftData);
       return true;
     }
   } catch (error) {
     console.error('Błąd podczas ładowania wersji roboczej:', error);
   }
   return false;
 };

 // Funkcja do usuwania wersji roboczej
 const deleteDraft = (draftIndex) => {
   try {
     const drafts = getDrafts();
     const updatedDrafts = drafts.filter((_, index) => index !== draftIndex);
     localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedDrafts));
     return true;
   } catch (error) {
     console.error('Błąd podczas usuwania wersji roboczej:', error);
     return false;
   }
 };

 const handleChange = useCallback((fieldOrEvent, value) => {
   let field, val;
   
   // Sprawdź czy to event object czy bezpośrednie wartości
   if (fieldOrEvent && fieldOrEvent.target) {
     // To jest event object z input/select
     field = fieldOrEvent.target.name;
     val = fieldOrEvent.target.value;
   } else {
     // To są bezpośrednie wartości z custom dropdown
     field = fieldOrEvent;
     val = value;
   }
   
   setFormData(prev => ({
     ...prev,
     [field]: val
   }));

   setErrors(prev => {
     if (prev[field]) {
       const newErrors = { ...prev };
       delete newErrors[field];
       return newErrors;
     }
     return prev;
   });
 }, []);

 const validateForm = () => {
   const newErrors = FormValidator.validateForm(formData);
   setErrors(newErrors);
   
   return Object.keys(newErrors).length === 0;
 };

 const resetForm = () => {
   localStorage.removeItem(TEMP_STORAGE_KEY);
   localStorage.removeItem(DRAFT_STORAGE_KEY);
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
   resetForm,
   saveTemporaryData,
   saveDraft,
   getDrafts,
   loadDraft,
   deleteDraft
 };
}
