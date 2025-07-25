import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Medal, Image, Star, Upload } from 'lucide-react';
import AdsService from '../../services/ads';
import PaymentModal from '../payment/PaymentModal';
import InfoRow from './preview/InfoRow';
import { useImageUpload } from '../../hooks/useImageUpload';
import ImageGallery from '../listings/details/ImageGallery';
import TechnicalDetails from '../listings/details/TechnicalDetails';
import Description from '../listings/details/Description';
import ContactInfo from '../listings/details/ContactInfo';

const AddListingView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadImages, isUploading, uploadProgress, error: uploadError } = useImageUpload();
  
  // Uproszczona inicjalizacja - pobieramy dane bezpośrednio z location.state
  const [listingData, setListingData] = useState(() => {
    const data = location.state?.listingData || {};
    return data;
  });

  // Jeśli nie ma danych, wróć do formularza
  useEffect(() => {
    if (!location.state?.listingData || Object.keys(location.state.listingData).length === 0) {
      navigate('/create-listing');
    }
  }, [location.state, navigate, listingData]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stany dla ogłoszenia
  const [listingType, setListingType] = useState('standardowe');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [carConditionConfirmed, setCarConditionConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Stany dla płatności
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [adId, setAdId] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // Stan dla aktywnego zdjęcia w galerii
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  
  // Funkcja do zmiany aktywnego zdjęcia
  const handleThumbnailClick = (index) => {
    setActivePhotoIndex(index);
  };
  
  // Funkcja do obsługi płatności
  const handlePaymentComplete = async () => {
    setPaymentCompleted(true);
    setIsPaymentModalOpen(false);
    
    try {
      // Aktualizacja statusu ogłoszenia po płatności
      if (adId) {
        await AdsService.updateStatus(adId, 'active');
      }
      
      setSuccess('Ogłoszenie zostało pomyślnie opublikowane! Za chwilę nastąpi przekierowanie...');
      
      // Przekierowanie po 3 sekundach
      setTimeout(() => {
        if (adId) {
          navigate(`/listing/${adId}`);
        } else {
          navigate('/');
        }
      }, 3000);
    } catch (error) {
      console.error('Błąd podczas aktualizacji statusu ogłoszenia:', error);
      setError(error.response?.data?.message || 'Wystąpił błąd podczas publikacji ogłoszenia.');
      
      // Nawet jeśli aktualizacja statusu się nie powiodła, przekieruj po 3 sekundach
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  // Funkcja mapująca dane z formularza na format backendu
  const mapFormDataToBackend = (formData) => {
    // Funkcja do parsowania liczb ze spacjami
    const parseNumberWithSpaces = (value) => {
      if (!value) return undefined;
      // Usuń wszystkie spacje i inne niealfanumeryczne znaki oprócz cyfr
      const cleanValue = value.toString().replace(/[^\d]/g, '');
      const parsed = parseInt(cleanValue, 10);
      return isNaN(parsed) ? undefined : parsed;
    };

    // Mapowania wartości z frontendu na backend
    const fuelTypeMapping = {
      'Benzyna': 'Benzyna',
      'Diesel': 'Diesel', 
      'Elektryczny': 'Elektryczny',
      'Hybryda': 'Hybryda',
      'Hybrydowy': 'Hybrydowy',
      'Benzyna+LPG': 'Benzyna+LPG',
      'Benzyna+CNG': 'Benzyna+LPG', // mapujemy CNG na LPG jako najbliższe
      'Etanol': 'Inne'
    };

    const transmissionMapping = {
      'Manualna': 'Manualna',
      'Automatyczna': 'Automatyczna',
      'Półautomatyczna': 'Półautomatyczna',
      'Bezstopniowa CVT': 'Automatyczna' // CVT mapujemy na automatyczną
    };

    const conditionMapping = {
      'Nowy': 'Nowy',
      'Używany': 'Używany'
    };

    const booleanMapping = {
      'Tak': 'Tak',
      'Nie': 'Nie',
      'Bezwypadkowy': 'Nie',
      'Powypadkowy': 'Tak',
      'Nieuszkodzony': 'Nie',
      'Uszkodzony': 'Tak'
    };

    return {
      // Podstawowe informacje
      brand: formData.brand || '',
      model: formData.model || '',
      generation: formData.generation || '',
      version: formData.version || '',
      year: parseInt(formData.productionYear || formData.year || '2010'),
      productionYear: parseInt(formData.productionYear || formData.year || '2010'), // Dodajemy też productionYear dla kompatybilności
      price: parseNumberWithSpaces(formData.price) || 10000,
      mileage: parseNumberWithSpaces(formData.mileage) || 100000,
      fuelType: fuelTypeMapping[formData.fuelType] || 'Benzyna',
      transmission: transmissionMapping[formData.transmission] || 'Manualna',
      vin: formData.vin || '',
      registrationNumber: formData.registrationNumber || '',
      headline: formData.headline || `${formData.brand || ''} ${formData.model || ''}`.trim(),
      description: formData.description || 'Brak opisu',
      
      // Opcje zakupu - mapowanie z frontendu na backend
      purchaseOptions: (() => {
        const option = formData.purchaseOption || formData.purchaseOptions;
        const mapping = {
          'sprzedaz': 'Sprzedaż',
          'faktura': 'Faktura VAT', 
          'inne': 'Inne',
          'najem': 'Inne',
          'leasing': 'Inne'
        };
        return mapping[option] || 'Sprzedaż';
      })(),
      rentalPrice: parseNumberWithSpaces(formData.rentalPrice),
      negotiable: formData.negotiable || 'Nie',
      
      // Typ ogłoszenia i sprzedawcy
      listingType,
      sellerType: (() => {
        const sellerTypeMapping = {
          'Prywatny': 'Prywatny',
          'Firma': 'Firma'
        };
        return sellerTypeMapping[formData.sellerType] || 'Prywatny';
      })(),
      
      // Stan pojazdu
      condition: conditionMapping[formData.condition] || 'Używany',
      accidentStatus: booleanMapping[formData.accidentStatus] || 'Nie',
      damageStatus: booleanMapping[formData.damageStatus] || 'Nie',
      tuning: booleanMapping[formData.tuning] || 'Nie',
      imported: booleanMapping[formData.imported] || 'Nie',
      registeredInPL: booleanMapping[formData.registeredInPL] || 'Tak',
      firstOwner: booleanMapping[formData.firstOwner] || 'Nie',
      disabledAdapted: booleanMapping[formData.disabledAdapted] || 'Nie',
      
      // Nadwozie i wygląd
      bodyType: formData.bodyType || '',
      color: formData.color || '',
      doors: formData.doors ? parseInt(formData.doors) : undefined,
      
      // Dane techniczne - używamy parseNumberWithSpaces dla poprawnego parsowania
      lastOfficialMileage: parseNumberWithSpaces(formData.lastOfficialMileage),
      power: parseNumberWithSpaces(formData.power) || 100,
      engineSize: parseNumberWithSpaces(formData.engineSize),
      drive: formData.drive || 'Przedni',
      weight: parseNumberWithSpaces(formData.weight),
      countryOfOrigin: formData.countryOfOrigin || '',
      
      // Lokalizacja
      voivodeship: formData.voivodeship || '',
      city: formData.city || '',
      
      // Zdjęcia - konwersja na array stringów (URL-e z Supabase)
      images: (() => {
        // Priorytet 1: Sprawdź czy mamy już URL-e z Supabase w formData.images
        if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
          // Jeśli to już są stringi (URL-e), zwróć je
          if (typeof formData.images[0] === 'string') {
            return formData.images;
          }
          // Jeśli to obiekty z url, wyciągnij URL-e
          return formData.images.map(img => img.url || img.src || img).filter(Boolean);
        }
        
        // Priorytet 2: Sprawdź photos (base64 - będą przesłane do Supabase później)
        if (formData.photos && Array.isArray(formData.photos) && formData.photos.length > 0) {
          // Zwróć puste - zdjęcia będą przesłane do Supabase po utworzeniu ogłoszenia
          return [];
        }
        
        return [];
      })(),
      mainImage: (() => {
        // Priorytet 1: mainImage jako string (URL z Supabase)
        if (formData.mainImage && typeof formData.mainImage === 'string') {
          return formData.mainImage;
        }
        
        // Priorytet 2: mainImage jako obiekt z url
        if (formData.mainImage && typeof formData.mainImage === 'object') {
          return formData.mainImage.url || formData.mainImage.src || '';
        }
        
        // Priorytet 3: Pierwszy obraz z listy images
        if (formData.images && formData.images.length > 0) {
          const firstImage = formData.images[0];
          if (typeof firstImage === 'string') {
            return firstImage;
          }
          return firstImage.url || firstImage.src || '';
        }
        
        // Priorytet 4: Pierwszy obraz z photos (base64 - tymczasowo)
        if (formData.photos && formData.photos.length > 0) {
          const mainPhotoIndex = formData.mainPhotoIndex || 0;
          const mainPhoto = formData.photos[mainPhotoIndex];
          return mainPhoto?.src || formData.photos[0]?.src || '';
        }
        
        return '';
      })(),
      
      // Status
      status: 'pending'
    };
  };

  // Funkcja wysyłająca ogłoszenie do API
  const publishListing = async () => {
    if (!acceptedTerms || !carConditionConfirmed) {
      setError('Proszę zaznaczyć wymagane zgody (regulamin i stan auta).');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      // Mapowanie danych formularza na format backendu (bez zdjęć)
      const backendData = mapFormDataToBackend(listingData);
      
      // KROK 1: Najpierw utwórz ogłoszenie bez zdjęć
      const response = await AdsService.addListing(backendData);
      const realCarId = response.data._id;
      
      // KROK 2: Jeśli mamy zdjęcia, prześlij je z prawdziwym ID ogłoszenia
      if (listingData.photos && listingData.photos.length > 0) {
        const filesToUpload = listingData.photos
          .filter(photo => photo.file && photo.file instanceof File)
          .map(photo => photo.file);
        
        const mainPhotoIndex = listingData.mainPhotoIndex || 0;
        const mainImageFile = listingData.photos[mainPhotoIndex]?.file;
        
        if (filesToUpload.length > 0) {
          try {
            // Przesyłamy zdjęcia do Supabase z prawdziwym ID ogłoszenia
            const uploadedImages = await uploadImages(filesToUpload, realCarId, mainImageFile);
            
            if (uploadedImages && uploadedImages.length > 0) {
      // KROK 3: Zaktualizuj ogłoszenie z URL-ami zdjęć
              const imageData = {
                images: uploadedImages.map(img => img.url),
                mainImage: uploadedImages.find(img => img.isMain)?.url || uploadedImages[0]?.url
              };
              
              await AdsService.updateListingImages(realCarId, imageData);
              
              // KROK 4: Pobierz świeże dane ogłoszenia z API (z prawdziwymi URL-ami Supabase)
              try {
                const freshAdResponse = await AdsService.getById(realCarId);
                const freshAdData = freshAdResponse.data;
                
                // Zaktualizuj dane w formularzu o prawdziwe URL-e zdjęć
                setListingData(prev => ({
                  ...prev,
                  images: freshAdData.images || [],
                  mainImage: freshAdData.mainImage || '',
                  // Usuń stare photos (base64) i zastąp prawdziwymi URL-ami
                  photos: freshAdData.images ? freshAdData.images.map((url, index) => ({
                    id: Date.now() + index,
                    src: url,
                    name: `Zdjęcie ${index + 1}`,
                    url: url
                  })) : []
                }));
                
                console.log('✅ Zaktualizowano dane ogłoszenia z prawdziwymi URL-ami Supabase:', freshAdData.images);
              } catch (fetchError) {
                console.error('Błąd podczas pobierania świeżych danych ogłoszenia:', fetchError);
              }
            }
          } catch (imageError) {
            console.error('Błąd przesyłania zdjęć:', imageError);
            // Ogłoszenie już zostało utworzone, ale bez zdjęć
            setError(`Ogłoszenie zostało utworzone, ale wystąpił błąd podczas przesyłania zdjęć: ${imageError.message}`);
          }
        }
      }
      
      // Ustawienie ID ogłoszenia i otwarcie modala płatności
      setAdId(realCarId);
      setIsPaymentModalOpen(true);

    } catch (error) {
      console.error('Błąd podczas publikowania ogłoszenia:', error);
      
      // Obsługa różnych typów błędów
      if (error.response) {
        // Błąd z serwera
        const errorMessage = error.response.data?.message || 'Wystąpił błąd podczas publikacji ogłoszenia.';
        setError(errorMessage);
      } else if (error.request) {
        // Brak połączenia z serwerem
        setError('Brak połączenia z serwerem. Sprawdź połączenie internetowe.');
      } else {
        // Inny błąd
        setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sprawdzamy czy mamy wystarczające dane do wyświetlenia podglądu
  const hasMinimalData = listingData && (
    listingData.brand || 
    listingData.model || 
    listingData.price || 
    listingData.description ||
    Object.keys(listingData).length > 5
  );

  // Jeśli nie mamy minimalnych danych, pokazujemy loader przez krótki czas
  // a następnie przekierowujemy do formularza
  if (!hasMinimalData) {
    // Ustawiamy timeout do przekierowania, jeśli dane nie zostaną załadowane
    setTimeout(() => {
      if (!hasMinimalData) {
        navigate('/create-listing');
      }
    }, 2000);

    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35530A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie podglądu ogłoszenia...</p>
          <p className="mt-2 text-sm text-gray-500">Jeśli ładowanie trwa zbyt długo, zostaniesz przekierowany do formularza</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%]">
      {/* Informacja o podglądzie */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700 font-medium">
          Podsumowanie formularza - sprawdź poprawność wprowadzonych danych przed kontynuacją
        </p>
      </div>

      {/* Komunikaty błędów i sukcesu */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      {uploadError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">Błąd przesyłania zdjęć: {uploadError}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700 font-medium">{success}</p>
        </div>
      )}

      {/* Wskaźnik postępu przesyłania zdjęć */}
      {isUploading && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-blue-600 animate-pulse" />
            <div className="flex-1">
              <p className="text-blue-700 font-medium">Przetwarzanie zdjęć...</p>
              <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-blue-600 mt-1">{uploadProgress}% ukończone</p>
            </div>
          </div>
        </div>
      )}


      {/* Główna zawartość - PODGLĄD OGŁOSZENIA w stylu szczegółów */}
      <div className="max-w-7xl mx-auto">
        {/* Etykieta WYRÓŻNIONE - tylko dla premium */}
        {listingType === 'wyróżnione' && (
          <div className="mb-4 flex justify-center">
            <div className="bg-[#35530A] text-white px-4 py-2 text-sm rounded-[2px] font-medium flex items-center gap-2">
              <Medal className="w-4 h-4" />
              PODGLĄD OGŁOSZENIA WYRÓŻNIONEGO
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lewa kolumna: galeria, nagłówek, opis */}
          <div className="w-full lg:w-[60%] space-y-8">
            {/* Galeria zdjęć - używamy komponentu ImageGallery */}
            <ImageGallery 
              images={(() => {
                // Przygotuj tablicę zdjęć dla komponentu ImageGallery
                if (listingData.photos && listingData.photos.length > 0) {
                  return listingData.photos.map(photo => photo.src || photo.url || photo);
                }
                if (listingData.images && listingData.images.length > 0) {
                  return listingData.images.map(img => img.url || img.src || img);
                }
                if (listingData.mainImage) {
                  return [listingData.mainImage];
                }
                return [];
              })()} 
            />

            {/* Nagłówek ogłoszenia - jeśli istnieje */}
            {listingData.headline && (
              <div className="bg-white p-6 shadow-md rounded-sm">
                <h2 className="text-xl font-bold mb-4 text-black">
                  Nagłówek ogłoszenia
                </h2>
                <div className="bg-gray-50 p-4 rounded-md border-l-4 border-[#35530A]">
                  <p className="text-lg font-medium text-gray-800">
                    {listingData.headline}
                  </p>
                </div>
              </div>
            )}
            
            {/* Opis - używamy komponentu Description */}
            <Description description={listingData.description || 'Brak opisu'} />
          </div>
          
          {/* Prawa kolumna: dane techniczne, kontakt */}
          <div className="w-full lg:w-[40%] space-y-8">
            {/* Dane techniczne - używamy komponentu TechnicalDetails */}
            <TechnicalDetails listing={listingData} />
            
            {/* Informacje kontaktowe - używamy komponentu ContactInfo (bez funkcji kontaktu) */}
            <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100">
              <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center border-b border-gray-100 pb-3">
                <span className="bg-gradient-to-r from-green-600 to-green-400 text-white p-2 rounded-full mr-3 shadow-md">
                  <MapPin className="w-5 h-5" />
                </span>
                Lokalizacja
              </h2>
              
              {/* Mapa z lokalizacją */}
              <div className="relative rounded-xl overflow-hidden mb-5 border-2 border-green-100 shadow-md">
                <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-semibold flex items-center border border-gray-100">
                  <MapPin className="w-4 h-4 text-green-600 mr-1.5" />
                  <span>{listingData.city || "Nieznane miasto"}, {listingData.voivodeship || "Nieznany region"}</span>
                </div>
                
                <iframe
                  title="Mapa lokalizacji"
                  width="100%"
                  height="240"
                  loading="lazy"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    (listingData.city || "") + "," + (listingData.voivodeship || "Polska")
                  )}&output=embed`}
                  className="hover:opacity-95 transition-opacity"
                />
              </div>
              
              {/* Informacja o podglądzie */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">To jest podgląd ogłoszenia</span>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Dane kontaktowe będą widoczne po opublikowaniu ogłoszenia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WYBÓR RODZAJU OGŁOSZENIA + CHECKBOXY + PRZYCISK OPUBLIKUJ */}
      <div className="max-w-6xl mx-auto mt-8 bg-white p-4 shadow-md rounded-[2px]">
        <h3 className="text-xl font-semibold mb-4">Rodzaj ogłoszenia i zgody</h3>

        {/* Rodzaj ogłoszenia (standardowe/wyróżnione) */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <label className={`
            flex-1 border p-4 rounded-[2px] cursor-pointer hover:bg-gray-50
            ${listingType === 'standardowe' ? 'ring-2 ring-[#35530A]' : ''}
          `}>
            <div className="flex items-center">
              <input
                type="radio"
                name="listingType"
                value="standardowe"
                checked={listingType === 'standardowe'}
                onChange={(e) => setListingType(e.target.value)}
                className="mr-2 accent-[#35530A]"
              />
              <span className="font-medium">OGŁOSZENIE STANDARDOWE</span>
            </div>
            <div className="text-center mt-2 text-[#35530A]">
              30 zł / 30 dni
            </div>
          </label>

          <label className={`
            flex-1 border p-4 rounded-[2px] cursor-pointer hover:bg-gray-50
            ${listingType === 'wyróżnione' ? 'ring-2 ring-[#35530A]' : ''}
          `}>
            <div className="flex items-center">
              <input
                type="radio"
                name="listingType"
                value="wyróżnione"
                checked={listingType === 'wyróżnione'}
                onChange={(e) => setListingType(e.target.value)}
                className="mr-2 accent-[#35530A]"
              />
              <span className="font-medium">OGŁOSZENIE WYRÓŻNIONE</span>
            </div>
            <div className="text-center mt-2 text-[#35530A]">
              50 zł / 30 dni
            </div>
          </label>
        </div>

        <div className="space-y-3">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 mr-2 accent-[#35530A]"
            />
            <span className="text-sm">
              Oświadczam, że zapoznałem(-am) się z <b>Regulaminem serwisu</b> i akceptuję jego postanowienia.
            </span>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={carConditionConfirmed}
              onChange={(e) => setCarConditionConfirmed(e.target.checked)}
              className="mt-1 mr-2 accent-[#35530A]"
            />
            <span className="text-sm">
              Oświadczam, że stan samochodu jest zgodny z opisem i stanem faktycznym.
            </span>
          </label>
        </div>

        {/* Przyciski Akcji - na dole */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              try {
                // Przygotuj dane do zapisania - usuń problematyczne obiekty
                const tempData = { ...listingData };
                
                // Usuń zdjęcia base64 które powodują przekroczenie limitu localStorage
                if (tempData.photos) {
                  delete tempData.photos;
                }
                
                // Zachowaj tylko podstawowe informacje o zdjęciach
                if (tempData.images && Array.isArray(tempData.images)) {
                  tempData.images = tempData.images.map(img => {
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
                delete tempData.file;
                delete tempData.files;
                
                // Zapisz dane do localStorage
                localStorage.setItem('auto_sell_temp_form', JSON.stringify(tempData));
                
                // Przejdź do formularza
                navigate('/create-listing?from=preview');
              } catch (error) {
                console.error('Błąd podczas zapisywania danych do localStorage:', error);
                
                // Jeśli zapis się nie powiedzie, przejdź bez zapisywania
                alert('Nie udało się zapisać danych formularza. Przejdziesz do pustego formularza.');
                navigate('/create-listing');
              }
            }}
            className="
              bg-gray-100 text-gray-700
              px-6 py-3
              rounded-[2px]
              hover:bg-gray-200
              transition-all
              duration-200
            "
            disabled={isSubmitting || paymentCompleted}
          >
            ← Wróć do edycji
          </button>

          <button
            onClick={publishListing}
            disabled={isSubmitting || paymentCompleted}
            className="
              bg-[#35530A] text-white
              px-6 py-3
              rounded-[2px]
              hover:bg-[#2D4A06]
              transition-all
              duration-200
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? 'Przetwarzanie...' : paymentCompleted ? 'Opublikowano!' : 'Przejdź do płatności →'}
          </button>
        </div>
      </div>

      {/* Modal płatności */}
      {isPaymentModalOpen && adId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={listingType === 'wyróżnione' ? 50 : 30}
          listingType={listingType}
          adId={adId}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default AddListingView;
