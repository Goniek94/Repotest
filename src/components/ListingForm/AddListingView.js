// src/components/listings/AddListingView.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Medal, Image, Star, Upload } from 'lucide-react';
import AdsService from '../../services/ads';
import PaymentModal from '../payment/PaymentModal';
import InfoRow from './preview/InfoRow';
import { useImageUpload } from '../../hooks/useImageUpload';

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
    return {
      // Podstawowe informacje
      brand: formData.brand || '',
      model: formData.model || '',
      generation: formData.generation || '',
      version: formData.version || '',
      year: parseInt(formData.productionYear || formData.year || '2010'),
      price: parseFloat(formData.price || '10000'),
      mileage: parseInt(formData.mileage || '100000'),
      fuelType: formData.fuelType || 'Benzyna',
      transmission: formData.transmission || 'Manualna',
      vin: formData.vin || '',
      registrationNumber: formData.registrationNumber || '',
      headline: formData.headline || `${formData.brand || ''} ${formData.model || ''}`.trim(),
      description: formData.description || 'Brak opisu',
      
      // Opcje zakupu
      purchaseOptions: formData.purchaseOption || formData.purchaseOptions || 'sprzedaz',
      rentalPrice: formData.rentalPrice ? parseFloat(formData.rentalPrice) : undefined,
      negotiable: formData.negotiable || 'Nie',
      
      // Typ ogłoszenia i sprzedawcy
      listingType,
      sellerType: formData.sellerType || 'prywatny',
      
      // Stan pojazdu
      condition: formData.condition || 'Używany',
      accidentStatus: formData.accidentStatus || 'Nie',
      damageStatus: formData.damageStatus || 'Nie',
      tuning: formData.tuning || 'Nie',
      imported: formData.imported || 'Nie',
      registeredInPL: formData.registeredInPL || 'Tak',
      firstOwner: formData.firstOwner || 'Nie',
      disabledAdapted: formData.disabledAdapted || 'Nie',
      
      // Nadwozie i wygląd
      bodyType: formData.bodyType || '',
      color: formData.color || '',
      doors: formData.doors ? parseInt(formData.doors) : undefined,
      
      // Dane techniczne
      lastOfficialMileage: formData.lastOfficialMileage ? parseInt(formData.lastOfficialMileage) : undefined,
      power: formData.power ? parseInt(formData.power) : 100,
      engineSize: formData.engineSize ? parseInt(formData.engineSize) : undefined,
      drive: formData.drive || 'Przedni',
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      countryOfOrigin: formData.countryOfOrigin || '',
      
      // Lokalizacja
      voivodeship: formData.voivodeship || '',
      city: formData.city || '',
      
      // Zdjęcia
      images: formData.images || [],
      mainImage: formData.mainImage || (formData.images && formData.images.length > 0 ? formData.images[0] : ''),
      
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
      let finalListingData = { ...listingData };
      
      // Sprawdzamy czy mamy zdjęcia do przesłania
      if (listingData.photos && listingData.photos.length > 0) {
        // Wyciągamy pliki File z photos
        const filesToUpload = listingData.photos
          .filter(photo => photo.file && photo.file instanceof File)
          .map(photo => photo.file);
        
        // Znajdź główne zdjęcie
        const mainPhotoIndex = listingData.mainPhotoIndex || 0;
        const mainImageFile = listingData.photos[mainPhotoIndex]?.file;
        
        if (filesToUpload.length > 0) {
          // Generujemy tymczasowe ID dla ogłoszenia (będzie zastąpione przez prawdziwe ID z API)
          const tempCarId = `temp_${Date.now()}`;
          
          // Przesyłamy zdjęcia do Supabase
          const uploadedImages = await uploadImages(filesToUpload, tempCarId, mainImageFile);
          
          if (uploadedImages && uploadedImages.length > 0) {
            // Aktualizujemy dane ogłoszenia z URL-ami z Supabase
            finalListingData.images = uploadedImages.map(img => img.url);
            finalListingData.mainImage = uploadedImages.find(img => img.isMain)?.url || uploadedImages[0]?.url;
          }
        }
      }
      
      // Mapowanie danych formularza na format backendu
      const backendData = mapFormDataToBackend(finalListingData);
      
      // Wywołanie prawdziwego API
      const response = await AdsService.addListing(backendData);
      
      // Ustawienie ID ogłoszenia i otwarcie modala płatności
      setAdId(response.data._id);
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
              <p className="text-blue-700 font-medium">Przesyłanie zdjęć do Supabase...</p>
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


      {/* Główna zawartość - PODGLĄD OGŁOSZENIA */}
      <div className="max-w-6xl mx-auto">
        {/* Ogłoszenie z ramką odpowiednią do typu (standardowe/wyróżnione) */}
        <div 
          className={`
            ${listingType === 'wyróżnione' 
              ? 'border-l-4 border-[#35530A]' 
              : 'border border-gray-200'
            } 
            bg-white rounded-[2px] shadow-md overflow-hidden relative mb-8
          `}
        >
          {/* Etykieta WYRÓŻNIONE - tylko dla premium */}
          {listingType === 'wyróżnione' && (
            <div className="absolute top-3 left-3 bg-[#35530A] text-white px-3 py-1.5 text-sm rounded-[2px] font-medium flex items-center gap-1.5 z-10">
              <Medal className="w-4 h-4" />
              WYRÓŻNIONE
            </div>
          )}

          <div className="flex flex-col lg:flex-row">
            {/* Lewa strona */}
            <div className="w-full lg:w-[60%] p-4 space-y-6">
              {/* Galeria zdjęć - tylko podgląd */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-black flex items-center gap-2">
                  <Image className="h-5 w-5 text-[#35530A]" />
                  Zdjęcia pojazdu
                </h2>
                
              {/* Główne zdjęcie */}
              <div className="mb-4 bg-gray-900 rounded-lg overflow-hidden">
                {(() => {
                  // Ujednolicona logika wyświetlania zdjęć
                  const getImageData = () => {
                    // Priorytet 1: photos z PhotoUploadSection (base64)
                    if (listingData.photos && listingData.photos.length > 0) {
                      const currentPhoto = listingData.photos[activePhotoIndex] || listingData.photos[0];
                      return {
                        src: currentPhoto?.src,
                        name: currentPhoto?.name || `Zdjęcie ${activePhotoIndex + 1}`,
                        source: 'photos'
                      };
                    }
                    
                    // Priorytet 2: images z API/Supabase
                    if (listingData.images && listingData.images.length > 0) {
                      const currentImage = listingData.images[activePhotoIndex] || listingData.images[0];
                      return {
                        src: currentImage?.url || currentImage,
                        name: `Zdjęcie ${activePhotoIndex + 1}`,
                        source: 'images'
                      };
                    }
                    
                    // Priorytet 3: mainImage fallback
                    if (listingData.mainImage) {
                      return {
                        src: listingData.mainImage,
                        name: 'Główne zdjęcie',
                        source: 'mainImage'
                      };
                    }
                    
                    return null;
                  };

                  const imageData = getImageData();
                  
                  if (!imageData || !imageData.src) {
                    return (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <div className="text-4xl mb-2">📷</div>
                          <p>Brak zdjęcia</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <img 
                      src={imageData.src}
                      alt={`${listingData.brand || ''} ${listingData.model || ''} - ${imageData.name}`}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600/f0f0f0/666666?text=Błąd+ładowania+zdjęcia';
                      }}
                    />
                  );
                })()}
                  
                  {/* Informacja o zdjęciu */}
                  <div className="bg-black/80 p-3">
                    <div className="flex items-center gap-2 text-white">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">
                        {activePhotoIndex === 0 ? 'Zdjęcie główne' : `Zdjęcie ${activePhotoIndex + 1}`}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Miniatury zdjęć */}
                {((listingData.photos && listingData.photos.length > 1) || (listingData.images && listingData.images.length > 1)) && (
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {(listingData.photos || listingData.images || []).map((item, index) => (
                      <div 
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`cursor-pointer border rounded-md overflow-hidden relative ${
                          index === activePhotoIndex ? 'border-[#35530A] ring-2 ring-[#35530A]' : 'border-gray-300'
                        }`}
                      >
                        <img 
                          src={item.src || item.url || item} 
                          alt={`Miniatura ${index + 1}`}
                          className="w-full h-16 object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-0 left-0 bg-[#35530A] text-white px-1 py-0.5 text-xs rounded-br-md">
                            Główne
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Opis */}
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4 text-black">
                  Opis pojazdu
                </h2>
                <div className="leading-relaxed text-gray-700 whitespace-pre-line">
                  {listingData.description}
                </div>
              </div>
            </div>

            {/* Prawa strona */}
            <div className="w-full lg:w-[40%] p-4 bg-gray-50">
              {/* Tytuł i cena */}
              <div className="bg-white p-4 shadow-sm rounded-[2px] mb-4">
                <h1 className="text-2xl font-bold text-black mb-2">
                  {listingData.brand} {listingData.model} {listingData.generation} {listingData.version}
                </h1>
<div className="text-3xl font-black text-[#35530A]">
                  {listingData.purchaseOptions === 'inne' || listingData.purchaseOption === 'najem'
                    ? `${listingData.rentalPrice} PLN/mc`
                    : `${listingData.price} PLN`}
                </div>
              </div>

              {/* Dane techniczne */}
              <div className="bg-white p-4 shadow-sm rounded-[2px] mb-4">
                <h2 className="text-lg font-bold mb-3 text-black px-2">
                  Dane techniczne
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">  
                  <InfoRow label="Stan" value={listingData.condition} />
                  <InfoRow label="Wypadkowość" value={listingData.accidentStatus} />
                  <InfoRow label="Uszkodzenia" value={listingData.damageStatus} />
                  <InfoRow label="Rok produkcji" value={listingData.productionYear} />
                  <InfoRow label="Przebieg" value={`${listingData.mileage} km`} />
                  <InfoRow label="Ostatni przebieg (CEPiK)" value={listingData.lastOfficialMileage ? `${listingData.lastOfficialMileage} km` : 'Nie podano'} />
                  <InfoRow label="Rodzaj paliwa" value={listingData.fuelType} />
                  <InfoRow label="Moc" value={`${listingData.power} KM`} />
                  <InfoRow label="Pojemność silnika" value={listingData.engineSize ? `${listingData.engineSize} cm³` : 'Nie podano'} />
                  <InfoRow label="Skrzynia biegów" value={listingData.transmission} />
                  <InfoRow label="Napęd" value={listingData.drive} />
                  <InfoRow label="Typ nadwozia" value={listingData.bodyType} />
                  <InfoRow label="Kolor" value={listingData.color} />
                  <InfoRow label="Liczba drzwi" value={listingData.doors} />
                  <InfoRow label="Waga" value={listingData.weight ? `${listingData.weight} kg` : 'Nie podano'} />
                  <InfoRow label="Pierwszy właściciel" value={listingData.firstOwner} />
                  <InfoRow label="Zarejestrowany w PL" value={listingData.registeredInPL} />
                  <InfoRow label="Importowany" value={listingData.imported} />
                  <InfoRow label="Tuning" value={listingData.tuning} />
                  <InfoRow label="Dla niepełnosprawnych" value={listingData.disabledAdapted} />
                  <InfoRow label="Kraj pochodzenia" value={listingData.countryOfOrigin} />
                  {listingData.vin && (
                    <InfoRow label="VIN" value={listingData.vin} />
                  )}
                </div>
              </div>

              {/* Lokalizacja */}
              <div className="bg-white p-4 shadow-sm rounded-[2px]">
                <h2 className="text-lg font-bold mb-4 text-black">Lokalizacja</h2>
                <div className="text-gray-700 text-lg flex items-center justify-center gap-2">
                  <MapPin className="w-6 h-6" />
                  <span>
                    {listingData.city ? `${listingData.city}, ` : ''}{listingData.voivodeship || 'Nie podano'}
                  </span>
                </div>
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
            onClick={() => navigate('/create-listing', { state: { listingData } })}
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
