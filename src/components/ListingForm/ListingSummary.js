import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronLeft, ChevronRight, Medal, Image, Star } from 'lucide-react';

const InfoRow = ({ label, value, required = false }) => (
  <div className={`p-2 rounded-[2px] ${required ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
    <div className={`font-medium flex items-center gap-1 ${required ? 'text-green-700' : 'text-gray-600'}`}>
      {label}
      {required && <span className="text-red-500">*</span>}
    </div>
    <div className="font-semibold text-black">{value || 'Nie podano'}</div>
  </div>
);

const ListingSummary = ({ listingData, onBack, onContinue }) => {
  const navigate = useNavigate();
  const [activePhotoIndex, setActivePhotoIndex] = React.useState(0);

  // Funkcja do zmiany aktywnego zdjęcia
  const handleThumbnailClick = (index) => {
    setActivePhotoIndex(index);
  };

  if (!listingData || Object.keys(listingData).length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#35530A]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] py-8 px-4 lg:px-[15%]">
      {/* Informacja o podsumowaniu */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700 font-medium">
          Podsumowanie formularza - sprawdź poprawność wprowadzonych danych przed kontynuacją
        </p>
      </div>

      {/* Główna zawartość - PODSUMOWANIE FORMULARZA */}
      <div className="max-w-6xl mx-auto">
        <div className="border border-gray-200 bg-white rounded-[2px] shadow-md overflow-hidden relative mb-8">
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
                  {listingData.photos && listingData.photos.length > 0 ? (
                    <img 
                      src={listingData.photos[activePhotoIndex]?.src || 'https://via.placeholder.com/800x600?text=Brak+zdjęcia'}
                      alt={`${listingData.brand} ${listingData.model}`}
                      className="w-full h-64 object-cover"
                    />
                  ) : listingData.images && listingData.images.length > 0 ? (
                    <img 
                      src={listingData.images[activePhotoIndex]?.url || listingData.images[activePhotoIndex] || listingData.mainImage || 'https://via.placeholder.com/800x600?text=Brak+zdjęcia'}
                      alt={`${listingData.brand} ${listingData.model}`}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <img 
                      src={listingData.mainImage || 'https://via.placeholder.com/800x600?text=Brak+zdjęcia'}
                      alt={`${listingData.brand} ${listingData.model}`}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  
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
                {listingData.photos && listingData.photos.length > 1 ? (
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {listingData.photos.map((photo, index) => (
                      <div 
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`cursor-pointer border rounded-md overflow-hidden ${
                          index === activePhotoIndex ? 'border-[#35530A] ring-2 ring-[#35530A]' : 'border-gray-300'
                        }`}
                      >
                        <img 
                          src={photo.src} 
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
                ) : listingData.images && listingData.images.length > 1 ? (
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {listingData.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`cursor-pointer border rounded-md overflow-hidden ${
                          index === activePhotoIndex ? 'border-[#35530A] ring-2 ring-[#35530A]' : 'border-gray-300'
                        }`}
                      >
                        <img 
                          src={image.url || image} 
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
                ) : null}
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
                  {listingData.brand} {listingData.model} {listingData.version}
                </h1>
                <div className="text-3xl font-black text-[#35530A]">
                  {listingData.purchaseOptions === 'inne' || listingData.purchaseOption === 'najem'
                    ? `${listingData.rentalPrice} PLN/mc`
                    : `${listingData.price} PLN`}
                </div>
              </div>

              {/* Dane pojazdu - podzielone na 2 kolumny */}
              <div className="bg-white p-4 shadow-sm rounded-[2px] mb-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* KOLUMNA 1 - PODSTAWOWE DANE */}
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Marka" value={listingData.brand} required={true} />
                    <InfoRow label="Model" value={listingData.model} required={true} />
                    <InfoRow label="Generacja" value={listingData.generation} />
                    <InfoRow label="Wersja silnika" value={listingData.version} required={true} />
                    <InfoRow label="Rok produkcji" value={listingData.productionYear} required={true} />
                    <InfoRow label="Stan" value={listingData.condition} required={true} />
                    <InfoRow label="Wypadkowość" value={listingData.accidentStatus} required={true} />
                    <InfoRow label="Uszkodzenia" value={listingData.damageStatus} required={true} />
                    <InfoRow label="Tuning" value={listingData.tuning} />
                    <InfoRow label="Importowany" value={listingData.imported} required={true} />
                    <InfoRow label="Zarejestrowany w PL" value={listingData.registeredInPL} required={true} />
                    <InfoRow label="Adaptacja medyczna" value={listingData.disabledAdapted} />
                    <InfoRow label="Pierwszy właściciel" value={listingData.firstOwner} required={true} />
                  </div>

                  {/* KOLUMNA 2 - DANE TECHNICZNE */}
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Ostatni przebieg (CEPiK)" value={listingData.lastOfficialMileage ? `${listingData.lastOfficialMileage} km` : 'Nie podano'} />
                    <InfoRow label="Przebieg" value={listingData.mileage ? `${listingData.mileage} km` : 'Nie podano'} />
                    <InfoRow label="Rodzaj paliwa" value={listingData.fuelType} />
                    <InfoRow label="Pojemność silnika" value={listingData.engineSize ? `${listingData.engineSize} cm³` : 'Nie podano'} />
                    <InfoRow label="Moc" value={listingData.power ? `${listingData.power} KM` : 'Nie podano'} />
                    <InfoRow label="Skrzynia biegów" value={listingData.transmission} />
                    <InfoRow label="Napęd" value={listingData.drive} />
                    <InfoRow label="Kraj pochodzenia" value={listingData.countryOfOrigin} />
                    <InfoRow label="Typ nadwozia" value={listingData.bodyType} />
                    <InfoRow label="Kolor" value={listingData.color} />
                    <InfoRow label="Wykończenie lakieru" value={listingData.paintFinish} />
                    <InfoRow label="Liczba drzwi" value={listingData.doors} />
                    <InfoRow label="Liczba miejsc" value={listingData.seats} />
                    <InfoRow label="Data pierwszej rejestracji" value={listingData.firstRegistrationDate} />
                    <InfoRow label="Waga" value={listingData.weight ? `${listingData.weight} kg` : 'Nie podano'} />
                    <InfoRow label="Opcja zakupu" value={listingData.purchaseOptions || (listingData.purchaseOption === 'sprzedaz' ? 'Sprzedaż' : listingData.purchaseOption === 'najem' ? 'Najem' : 'Inne')} />
                    <InfoRow label="Cena do negocjacji" value={listingData.negotiable} />
                    {(listingData.purchaseOptions === 'inne' || listingData.purchaseOption === 'najem') && listingData.rentalPrice && (
                      <InfoRow label="Cena najmu" value={`${listingData.rentalPrice} PLN/miesiąc`} />
                    )}
                  </div>
                </div>
                
                {/* VIN osobno jeśli istnieje */}
                {listingData.vin && (
                  <div className="mt-4 pt-4 border-t">
                    <InfoRow label="VIN" value={listingData.vin} />
                  </div>
                )}
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

      {/* Przyciski Akcji - na dole */}
      <div className="max-w-6xl mx-auto mt-8 bg-white p-4 shadow-md rounded-[2px]">
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onBack}
            className="
              bg-gray-100 text-gray-700
              px-6 py-3
              rounded-[2px]
              hover:bg-gray-200
              transition-all
              duration-200
            "
          >
            ← Wróć do edycji
          </button>

          <button
            onClick={onContinue}
            className="
              bg-[#35530A] text-white
              px-6 py-3
              rounded-[2px]
              hover:bg-[#2D4A06]
              transition-all
              duration-200
            "
          >
            Przejdź do płatności →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingSummary;
