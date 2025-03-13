import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin, X, ChevronLeft, ChevronRight, Medal
} from 'lucide-react';
import PaymentModal from '../../payment/PaymentModal';
// ZMIANA 1: Poprawiony import - dodano jeden poziom "../"
import api from '../../../services/api';

const AddListingView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { listingData } = location.state || {};

  // Jeśli nie ma danych, wróć do formularza
  useEffect(() => {
    if (!listingData) {
      navigate('/createlisting');
    }
  }, [listingData, navigate]);

  // Podstawowe stany
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nowo dodane stany:
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
      setSuccess('Ogłoszenie zostało pomyślnie opublikowane!');
      setTimeout(() => {
        navigate(`/listing/${adId}`);
      }, 2000);
    } catch (error) {
      console.error('Błąd podczas aktualizacji statusu ogłoszenia:', error);
      setError(error.response?.data?.message || 'Wystąpił błąd podczas publikacji ogłoszenia.');
    }
  };

  // Funkcja wysyłająca ogłoszenie do API - POPRAWIONA
  const publishListing = async () => {
    // Sprawdzenie wymaganych zgód
    if (!acceptedTerms || !carConditionConfirmed) {
      setError('Proszę zaznaczyć wymagane zgody (regulamin i stan auta).');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // Przygotowanie danych do API w formacie FormData
      const formData = new FormData();
      
      // Dodanie pól tekstowych zgodnie z modelem backendu (ad.js)
      formData.append('make', listingData.brand || '');
      formData.append('model', listingData.model || '');
      formData.append('year', listingData.productionYear || '');
      formData.append('price', listingData.price || '0');
      formData.append('mileage', listingData.mileage || '0');
      formData.append('fuelType', listingData.fuelType || 'benzyna');
      formData.append('transmission', listingData.transmission || 'manualna');
      formData.append('vin', listingData.vin || '');
      formData.append('registrationNumber', listingData.registrationNumber || '');
      formData.append('description', listingData.description || '');
      formData.append('listingType', listingType);
      formData.append('purchaseOptions', 'umowa kupna-sprzedaży'); // Zgodnie z modelem backendowym
      formData.append('status', 'w toku'); // Zmieniamy na "w toku" - zostanie zmienione na "opublikowane" po płatności
      
      // Dodanie zdjęć
      if (listingData.photos && listingData.photos.length > 0) {
        // Jeśli mamy pliki zdjęć (a nie tylko URL-e)
        if (listingData.photos[0] instanceof File) {
          listingData.photos.forEach((photo, index) => {
            formData.append('images', photo);
          });
        } else {
          // Jeśli mamy tylko URL-e, przekształcamy je w format akceptowany przez backend
          listingData.photos.forEach((photoUrl, index) => {
            formData.append('images', photoUrl);
          });
        }
      }
      
      // Dodajemy debug loggera - sprawdźmy co wysyłamy
      console.log('Przygotowuję formData:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      // Wysłanie żądania POST do API używając nowego api
      console.log('Wysyłanie żądania do /ads/add');
      const response = await api.addListing(formData);
      
      console.log('Odpowiedź API:', response);
      
      // Zapisujemy ID ogłoszenia i otwieramy modal płatności
      setAdId(response._id);
      setIsPaymentModalOpen(true);
      
    } catch (error) {
      console.error('Błąd podczas publikowania ogłoszenia:', error);
      
      if (error.response) {
        console.error('Status odpowiedzi:', error.response.status);
        console.error('Dane odpowiedzi:', error.response.data);
        setError(error.response.data.message || 'Wystąpił błąd podczas publikowania ogłoszenia.');
      } else if (error.request) {
        console.error('Brak odpowiedzi od serwera:', error.request);
        setError('Brak odpowiedzi od serwera. Sprawdź połączenie z internetem.');
      } else {
        console.error('Błąd konfiguracji żądania:', error.message);
        setError('Wystąpił błąd podczas publikowania ogłoszenia.');
      }
      
      setIsSubmitting(false);
    }
  };

  // Obsługa publikacji (sprawdzenie checkboxów)
  const handlePublish = () => {
    if (!acceptedTerms || !carConditionConfirmed) {
      setError('Proszę zaznaczyć wymagane zgody (regulamin i stan auta).');
      return;
    }
    
    publishListing();
  };

  // Komponent pomocniczy do wyświetlania wiersza info
  const InfoRow = ({ label, value }) => (
    <div className="p-2 bg-gray-50 rounded-sm">
      <div className="text-gray-600 font-medium">{label}</div>
      <div className="font-semibold text-black">{value || 'Nie podano'}</div>
    </div>
  );

  // Jeśli listingData jest wczytywany asynchronicznie, wstaw warunek:
  if (!listingData) {
    return null; // lub loader
  }

  // Render
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
                className="bg-white/90 p-2 hover:bg-white transition-colors rounded-sm"
                title="Poprzednie zdjęcie"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <img
                src={listingData.photos[photoIndex]}
                alt={`Zdjęcie powiększone ${photoIndex + 1}`}
                className="max-h-[85vh] w-auto mx-4 rounded-sm"
              />
              <button
                onClick={nextPhoto}
                className="bg-white/90 p-2 hover:bg-white transition-colors rounded-sm"
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

      {/* Główna zawartość - PODGLĄD OGŁOSZENIA z uwzględnieniem wyróżnienia */}
      <div className="max-w-6xl mx-auto">
        {/* Ogłoszenie z ramką odpowiednią do typu (standardowe/wyróżnione) */}
        <div 
          className={`
            ${listingType === 'wyróżnione' 
              ? 'border-l-4 border-[#35530A]' 
              : 'border border-gray-200'
            } 
            bg-white rounded-sm shadow-md overflow-hidden relative mb-8
          `}
        >
          {/* Etykieta WYRÓŻNIONE - tylko dla premium */}
          {listingType === 'wyróżnione' && (
            <div className="absolute top-3 left-3 bg-[#35530A] text-white px-3 py-1.5 text-sm rounded-sm font-medium flex items-center gap-1.5 z-10">
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
                  src={listingData.photos[selectedImage]}
                  alt={`Główne zdjęcie ${selectedImage + 1}`}
                  className="w-full h-full object-cover rounded-sm cursor-pointer"
                  onClick={() => openPhotoModal(selectedImage)}
                />
                <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="bg-white/80 p-2 hover:bg-white transition-colors rounded-sm"
                    title="Poprzednie"
                  >
                    <ChevronLeft className="w-6 h-6 text-black" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="bg-white/80 p-2 hover:bg-white transition-colors rounded-sm"
                    title="Następne"
                  >
                    <ChevronRight className="w-6 h-6 text-black" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-sm text-sm">
                  {selectedImage + 1} / {listingData.photos.length}
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {listingData.photos.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`
                      relative aspect-video overflow-hidden rounded-sm
                      ${selectedImage === index ? 'ring-2 ring-black' : ''}
                    `}
                  >
                    <img
                      src={img}
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
              <div className="bg-white p-4 shadow-sm rounded-sm mb-4">
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
              <div className="bg-white p-4 shadow-sm rounded-sm mb-4">
                <h2 className="text-lg font-bold mb-3 text-black px-2">
                  Dane techniczne
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <InfoRow label="Stan" value={listingData.condition} />
                  <InfoRow label="Rok produkcji" value={listingData.productionYear} />
                  <InfoRow label="Przebieg" value={`${listingData.mileage} km`} />
                  <InfoRow label="Paliwo" value={listingData.fuelType} />
                  <InfoRow label="Moc" value={`${listingData.power} KM`} />
                  <InfoRow label="Skrzynia biegów" value={listingData.transmission} />
                  <InfoRow label="Napęd" value={listingData.drive} />
                  <InfoRow label="Kraj pochodzenia" value={listingData.countryOfOrigin} />
                  {listingData.vin && (
                    <InfoRow label="VIN" value={listingData.vin} />
                  )}
                </div>
              </div>

              {/* Lokalizacja */}
              <div className="bg-white p-4 shadow-sm rounded-sm">
                <h2 className="text-lg font-bold mb-4 text-black">Lokalizacja</h2>
                <div className="text-gray-700 text-lg flex items-center justify-center gap-2">
                  <MapPin className="w-6 h-6" />
                  <span>
                    {listingData.city}, {listingData.voivodeship}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOWA SEKCJA: WYBÓR RODZAJU OGŁOSZENIA + CHECKBOXY + PRZYCISK OPUBLIKUJ */}
      <div className="max-w-6xl mx-auto mt-8 bg-white p-4 shadow-md rounded-sm">
        <h3 className="text-xl font-semibold mb-4">Rodzaj ogłoszenia i zgody</h3>

        {/* Rodzaj ogłoszenia (standardowe/wyróżnione) */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <label className={`
            flex-1 border p-4 rounded cursor-pointer hover:bg-gray-50
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
            flex-1 border p-4 rounded cursor-pointer hover:bg-gray-50
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
            onClick={() =>
              navigate('/createlisting', { state: { listingData } })
            }
            className="
              bg-gray-100 text-gray-700
              px-6 py-3
              rounded-lg
              hover:bg-gray-200
              transition-all
              duration-200
            "
            disabled={isSubmitting || paymentCompleted}
          >
            ← Wróć do edycji
          </button>

          <button
            onClick={handlePublish}
            disabled={isSubmitting || paymentCompleted}
            className="
              bg-green-600 text-white
              px-6 py-3
              rounded-lg
              hover:bg-green-700
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