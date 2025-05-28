// src/components/listings/AddListingView.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { MapPin, X, ChevronLeft, ChevronRight, Medal } from 'lucide-react';
import api from '../../services/api';
import AdsService from '../../services/ads'; // Dodaj import AdsService
import PaymentModal from '../payment/PaymentModal';

const AddListingView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { listingData } = location.state || {};

  // Sprawdzenie, czy użytkownik jest zalogowany (cookie-based)
  useEffect(() => {
    fetch('/api/users/check-auth', { method: 'GET', credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          navigate('/login', { state: { returnUrl: '/create-listing' } });
        }
      })
      .catch(() => {
        navigate('/login', { state: { returnUrl: '/create-listing' } });
      });
  }, [navigate]);

  // Jeśli nie ma danych, wróć do formularza
  useEffect(() => {
    if (!listingData) {
      navigate('/create-listing');
    }
  }, [listingData, navigate]);

  // Podstawowe stany
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Funkcje obsługi zdjęć
  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev > 0 ? prev - 1 : listingData.photos.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev < listingData.photos.length - 1 ? prev + 1 : 0
    );
  };

  const openPhotoModal = (index) => {
    setPhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
  };

  const nextPhoto = () => {
    setPhotoIndex((prev) =>
      prev < listingData.photos.length - 1 ? prev + 1 : 0
    );
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) =>
      prev > 0 ? prev - 1 : listingData.photos.length - 1
    );
  };
  
  // Funkcja do obsługi płatności
  const handlePaymentComplete = async () => {
    setPaymentCompleted(true);
    
    try {
      // Aktualizacja statusu ogłoszenia po płatności
      await api.updateAdStatus(adId, 'opublikowane');
      
      setSuccess('Ogłoszenie zostało pomyślnie opublikowane!');
      setTimeout(() => {
        navigate(`/listing/${adId}`);
      }, 2000);
    } catch (error) {
      console.error('Błąd podczas aktualizacji statusu ogłoszenia:', error);
      setError(error.response?.data?.message || 'Wystąpił błąd podczas publikacji ogłoszenia.');
    }
  };

  // Funkcja wysyłająca ogłoszenie do API
  const publishListing = async () => {
    // Sprawdzenie wymaganych zgód
    if (!acceptedTerms || !carConditionConfirmed) {
      setError('Proszę zaznaczyć wymagane zgody (regulamin i stan auta).');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setUploadProgress(10);
      
      // Tworzymy FormData z optymalizacją przesyłania
      const formData = new FormData();
      
      // Mapowanie paliwa na właściwe wartości (normalizacja)
      let normalizedFuelType = 'benzyna';
      if (listingData.fuelType === 'Benzyna') normalizedFuelType = 'benzyna';
      else if (listingData.fuelType === 'Diesel') normalizedFuelType = 'diesel';
      else if (listingData.fuelType === 'Benzyna+LPG' || listingData.fuelType === 'benzyna+LPG') normalizedFuelType = 'benzyna+LPG';
      else if (listingData.fuelType === 'Elektryczny') normalizedFuelType = 'elektryczny';
      else if (listingData.fuelType === 'Hybryda') normalizedFuelType = 'hybryda';
      else normalizedFuelType = 'inne';
      
      // Mapowanie skrzyni biegów na właściwe wartości (normalizacja)
      let normalizedTransmission = 'manualna';
      if (listingData.transmission === 'Manualna') normalizedTransmission = 'manualna';
      else if (listingData.transmission === 'Automatyczna') normalizedTransmission = 'automatyczna';
      else if (listingData.transmission === 'Półautomatyczna') normalizedTransmission = 'półautomatyczna';
      else normalizedTransmission = 'manualna';
      
      // Mapowanie condition (stanu) na właściwe wartości
      let normalizedCondition = '';
      if (listingData.condition === 'Nowy') normalizedCondition = 'Nowy';
      else if (listingData.condition === 'Używany') normalizedCondition = 'Używany';
      else normalizedCondition = listingData.condition;
      
      // Walidacja ceny przed wysłaniem (zapobieganie błędom)
      const price = parseFloat(listingData.price);
      if (isNaN(price) || price <= 0) {
        setError('Nieprawidłowa cena pojazdu. Podaj poprawną wartość.');
        setIsSubmitting(false);
        setUploadProgress(0);
        return;
      }
      
      // Walidacja przebiegu przed wysłaniem (zapobieganie błędom)
      const mileage = parseInt(listingData.mileage);
      if (isNaN(mileage) || mileage < 0) {
        setError('Nieprawidłowy przebieg pojazdu. Podaj poprawną wartość.');
        setIsSubmitting(false);
        setUploadProgress(0);
        return;
      }
      
      // Walidacja roku produkcji przed wysłaniem
      const year = parseInt(listingData.productionYear);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
        setError('Nieprawidłowy rok produkcji pojazdu. Podaj poprawną wartość.');
        setIsSubmitting(false);
        setUploadProgress(0);
        return;
      }
      
      // Sprawdzenie, czy są zdjęcia
      if (!listingData.photos || listingData.photos.length === 0) {
        setError('Dodaj przynajmniej jedno zdjęcie pojazdu.');
        setIsSubmitting(false);
        setUploadProgress(0);
        return;
      }
      
      // Podstawowe pola (wymagane)
      formData.append('brand', listingData.brand || '');
      formData.append('model', listingData.model || '');
      formData.append('year', year.toString()); // Mapowanie productionYear na year
      formData.append('price', price.toString());
      formData.append('mileage', mileage.toString());
      formData.append('description', listingData.description || '');
      formData.append('fuelType', normalizedFuelType);
      formData.append('transmission', normalizedTransmission);
      formData.append('purchaseOptions', listingData.purchaseOption === 'sprzedaz' ? 'umowa kupna-sprzedaży' : listingData.purchaseOption || 'umowa kupna-sprzedaży');
      formData.append('listingType', listingType);
      formData.append('status', 'w toku');
      
      // Nowe pola
      formData.append('headline', listingData.headline || '');
      
      // Dodanie pola sellerType z walidacją poprawnych wartości
      if (listingData.sellerType) {
        // Upewnij się, że wartość jest zgodna z oczekiwaniami backendu
        let normalizedSellerType = 'prywatny'; // domyślna wartość
        if (listingData.sellerType === 'Prywatny' || listingData.sellerType === 'prywatny') {
          normalizedSellerType = 'prywatny';
        } else if (listingData.sellerType === 'Firma' || listingData.sellerType === 'firma') {
          normalizedSellerType = 'firma';
        }
        formData.append('sellerType', normalizedSellerType);
      }
      
      // Opcjonalne pola (dodaj tylko jeśli są wypełnione)
      if (listingData.generation) formData.append('generation', listingData.generation);
      if (listingData.version) formData.append('version', listingData.version);
      if (listingData.vin) formData.append('vin', listingData.vin);
      if (listingData.registrationNumber) formData.append('registrationNumber', listingData.registrationNumber);
      if (normalizedCondition) formData.append('condition', normalizedCondition);
      if (listingData.accidentStatus) formData.append('accidentStatus', listingData.accidentStatus);
      if (listingData.damageStatus) formData.append('damageStatus', listingData.damageStatus);
      if (listingData.tuning) formData.append('tuning', listingData.tuning);
      if (listingData.imported) formData.append('imported', listingData.imported);
      if (listingData.registeredInPL) formData.append('registeredInPL', listingData.registeredInPL);
      if (listingData.firstOwner) formData.append('firstOwner', listingData.firstOwner);
      if (listingData.disabledAdapted) formData.append('disabledAdapted', listingData.disabledAdapted);
      if (listingData.bodyType) formData.append('bodyType', listingData.bodyType);
      if (listingData.color) formData.append('color', listingData.color);
      
      // Konwersja danych liczbowych
      if (listingData.lastOfficialMileage) {
        const lastOfficialMileage = parseInt(listingData.lastOfficialMileage);
        if (!isNaN(lastOfficialMileage)) {
          formData.append('lastOfficialMileage', lastOfficialMileage.toString());
        }
      }
      
      if (listingData.power) {
        const power = parseInt(listingData.power);
        if (!isNaN(power)) {
          formData.append('power', power.toString());
        }
      }
      
      if (listingData.engineSize) {
        const engineSize = parseInt(listingData.engineSize);
        if (!isNaN(engineSize)) {
          formData.append('engineSize', engineSize.toString());
        }
      }
      
      if (listingData.drive) formData.append('drive', listingData.drive);
      
      if (listingData.doors) {
        const doors = parseInt(listingData.doors);
        if (!isNaN(doors)) {
          formData.append('doors', doors.toString());
        }
      }
      
      if (listingData.weight) {
        const weight = parseInt(listingData.weight);
        if (!isNaN(weight)) {
          formData.append('weight', weight.toString());
        }
      }
      
      if (listingData.voivodeship) formData.append('voivodeship', listingData.voivodeship);
      if (listingData.city) formData.append('city', listingData.city);
      
      // Dodatkowe cechy nadwozia
      if (listingData.hasSunroof === 'Tak') formData.append('hasSunroof', 'Tak');
      if (listingData.hasAlloyWheels === 'Tak') formData.append('hasAlloyWheels', 'Tak');
      if (listingData.hasRoofRails === 'Tak') formData.append('hasRoofRails', 'Tak');
      if (listingData.hasParkingSensors === 'Tak') formData.append('hasParkingSensors', 'Tak');
      
      // Przygotowanie zdjęć
      setUploadProgress(20);
      let processedImages = 0;
      const totalImages = listingData.photos.filter(photo => photo instanceof File).length;
      
      // Zdjęcia (dodaj tylko pliki, które są instancjami File)
      if (totalImages > 0) {
        for (const photo of listingData.photos) {
          if (photo instanceof File) {
            // Dodanie zdjęcia do formData
            formData.append('images', photo);
            
            // Aktualizacja postępu przesyłania (20% - 70%)
            processedImages++;
            const imageProgress = Math.floor(20 + (processedImages / totalImages) * 50);
            setUploadProgress(imageProgress);
            
            // Dodajemy małe opóźnienie, aby użytkownik widział postęp
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
      }
      
      setUploadProgress(70);
      
      // Debugowanie zawartości formData przed wysłaniem
      console.log('Zawartość formData przed wysłaniem:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
      }
      
      // Użycie AdsService zamiast bezpośredniego fetch
      try {
        const response = await AdsService.addListing(formData);
        
        setUploadProgress(100);
        
        // Zapisujemy ID ogłoszenia i otwieramy modal płatności
        setAdId(response.data._id);
        setIsPaymentModalOpen(true);
      } catch (apiError) {
        throw apiError;
      }
      
    } catch (error) {
      console.error('Błąd podczas publikowania ogłoszenia:', error);
      setError(error.response?.data?.message || error.message || 'Wystąpił błąd podczas publikowania ogłoszenia. Spróbuj ponownie później.');
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Komponent pomocniczy do wyświetlania wiersza info
  const InfoRow = ({ label, value }) => (
    <div className="p-2 bg-gray-50 rounded-[2px]">
      <div className="text-gray-600 font-medium">{label}</div>
      <div className="font-semibold text-black">{value || 'Nie podano'}</div>
    </div>
  );

  // Jeśli listingData jest wczytywany asynchronicznie, wstaw loader
  if (!listingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35530A]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%]">
      {/* Informacja o podglądzie */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="text-yellow-700 font-medium">
          Podgląd ogłoszenia - zobacz jak będzie wyglądało Twoje ogłoszenie po publikacji
        </p>
      </div>

      {/* Komunikaty błędów i sukcesu */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700 font-medium">{success}</p>
        </div>
      )}
      
      {/* Pasek postępu przesyłania */}
      {isSubmitting && uploadProgress > 0 && (
        <div className="mb-6">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#35530A] transition-all duration-300 ease-in-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {uploadProgress < 50 
              ? 'Przesyłanie zdjęć...' 
              : uploadProgress < 100 
                ? 'Przesyłanie ogłoszenia...' 
                : 'Zakończono przesyłanie.'}
            {' '}{uploadProgress}%
          </p>
        </div>
      )}

      {/* Modal ze zdjęciami */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={closePhotoModal} />
          <div className="relative text-center max-w-5xl w-full mx-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={closePhotoModal}
              title="Zamknij (Esc)"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={prevPhoto}
                className="bg-white/90 p-2 hover:bg-white transition-colors rounded-[2px]"
                title="Poprzednie zdjęcie"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <img
                src={typeof listingData.photos[photoIndex] === 'string' 
                  ? listingData.photos[photoIndex] 
                  : URL.createObjectURL(listingData.photos[photoIndex])}
                alt={`Zdjęcie powiększone ${photoIndex + 1}`}
                className="max-h-[85vh] w-auto mx-4 rounded-[2px]"
              />
              <button
                onClick={nextPhoto}
                className="bg-white/90 p-2 hover:bg-white transition-colors rounded-[2px]"
                title="Następne zdjęcie"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
            <div className="text-white mt-4 text-sm">
              Zdjęcie {photoIndex + 1} z {listingData.photos.length}
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
              {/* Galeria zdjęć */}
              <div className="relative aspect-video mb-4">
                <img
                  src={typeof listingData.photos[selectedImage] === 'string'
                    ? listingData.photos[selectedImage]
                    : URL.createObjectURL(listingData.photos[selectedImage])}
                  alt={`Główne zdjęcie ${selectedImage + 1}`}
                  className="w-full h-full object-cover rounded-[2px] cursor-pointer"
                  onClick={() => openPhotoModal(selectedImage)}
                />
                <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="bg-white/80 p-2 hover:bg-white transition-colors rounded-[2px]"
                    title="Poprzednie"
                  >
                    <ChevronLeft className="w-6 h-6 text-black" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="bg-white/80 p-2 hover:bg-white transition-colors rounded-[2px]"
                    title="Następne"
                  >
                    <ChevronRight className="w-6 h-6 text-black" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-[2px] text-sm">
                  {selectedImage + 1} / {listingData.photos.length}
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {listingData.photos.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`
                      relative aspect-video overflow-hidden rounded-[2px]
                      ${selectedImage === index ? 'ring-2 ring-black' : ''}
                    `}
                  >
                    <img
                      src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  </button>
                ))}
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
                  {listingData.purchaseOption === 'najem'
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
                  
                  {/* Dodatkowe cechy nadwozia */}
                  {listingData.hasSunroof === 'Tak' && (
                    <InfoRow label="Szyberdach" value="Tak" />
                  )}
                  {listingData.hasAlloyWheels === 'Tak' && (
                    <InfoRow label="Alufelgi" value="Tak" />
                  )}
                  {listingData.hasRoofRails === 'Tak' && (
                    <InfoRow label="Relingi dachowe" value="Tak" />
                  )}
                  {listingData.hasParkingSensors === 'Tak' && (
                    <InfoRow label="Czujniki parkowania" value="Tak" />
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
