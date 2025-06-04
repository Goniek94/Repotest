import React from 'react';
import { Heart, Check, Medal, MapPin, User } from 'lucide-react';

const ResponsiveListingItem = ({ 
  listing, 
  onNavigate, 
  onFavorite, 
  isFavorite, 
  message,
  screenSize 
}) => {
  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Używamy rzeczywistych danych z ogłoszenia
  const brand = listing.brand || '';
  const model = listing.model || '';
  
  // Tworzymy tytuł z marki i modelu, jeśli są dostępne
  const displayTitle = (brand && model) 
    ? `${brand} ${model}` 
    : (listing.title || 'Brak tytułu');
  
  // Określamy, czy jesteśmy na urządzeniu mobilnym
  const isMobile = screenSize?.isMobile;
  const isTablet = screenSize?.isTablet;
  
  // Renderowanie dla urządzeń mobilnych
  if (isMobile) {
    return (
      <div
        onClick={() => onNavigate(listing.id)}
        className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative 
                   ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'}`}
      >
        {/* Zdjęcie na całą szerokość */}
        <div className="w-full h-[180px] relative overflow-hidden">
          <img
            src={listing.image}
            alt={displayTitle}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/auto-788747_1280.jpg';
            }}
          />
          {/* Serduszko na zdjęciu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(listing.id);
            }}
            className="absolute top-2 right-2 p-2 hover:scale-110 transition-transform duration-200 
                     bg-white rounded-full shadow-lg z-10"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'}`}
            />
          </button>
          
          {/* Powiadomienie o dodaniu do ulubionych */}
          {message && (
            <div className="absolute top-2 right-10 bg-white px-2 py-1 rounded-md shadow-lg z-10 flex items-center gap-1 animate-fadeIn">
              <Check className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium">{message}</span>
            </div>
          )}
          {/* Znaczek WYRÓŻNIONE */}
          {isFeatured && (
            <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-1 text-xs rounded-md font-medium flex items-center gap-1 shadow-lg z-20">
              <Medal className="w-3 h-3" />
              <span className="uppercase text-xs">WYRÓŻNIONE</span>
            </div>
          )}
          
          {/* Cena na zdjęciu */}
          <div className="absolute bottom-2 right-2 bg-[#35530A] px-2 py-1 rounded-md shadow-md text-white">
            <div className="text-xs font-medium">Cena</div>
            <div className="text-sm font-bold">
              {listing.price ? `${listing.price.toLocaleString()} zł` : '54 000 zł'}
            </div>
          </div>
        </div>

        {/* Informacje pod zdjęciem */}
        <div className="p-3">
          <h3 className="text-base font-bold mb-1">{displayTitle}</h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {listing.headline || listing.description?.substring(0, 60) || ''}
          </p>
          
          {/* Parametry w jednym rzędzie z zawijaniem */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 text-[#35530A] flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>{listing.year || '2015'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 text-[#35530A] flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>{listing.mileage ? `${listing.mileage} km` : '82685 km'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 text-[#35530A] flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 19.5H19.5M9 7.5V10.5M15 7.5V10.5M6 10.5H18C18.5523 10.5 19 10.0523 19 9.5V6C19 5.44772 18.5523 5 18 5H6C5.44772 5 5 5.44772 5 6V9.5C5 10.0523 5.44772 10.5 6 10.5Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>{listing.fuelType || 'Diesel'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 text-[#35530A] flex-shrink-0">
                <MapPin className="w-3 h-3" />
              </div>
              <span>{listing.city || listing.location || 'Kraków'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderowanie dla tabletów
  if (isTablet) {
    return (
      <div
        onClick={() => onNavigate(listing.id)}
        className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative 
                   ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'}`}
      >
        <div className="flex flex-row h-[180px]">
          {/* Zdjęcie - stała szerokość */}
          <div className="w-[180px] h-full flex-shrink-0 relative overflow-hidden">
            <img
              src={listing.image}
              alt={displayTitle}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/auto-788747_1280.jpg';
              }}
            />
            {/* Serduszko na zdjęciu */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(listing.id);
              }}
              className="absolute top-2 right-2 p-1.5 hover:scale-110 transition-transform duration-200 
                       bg-white rounded-full shadow-lg z-10"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'}`}
              />
            </button>
            
            {/* Powiadomienie o dodaniu do ulubionych */}
            {message && (
              <div className="absolute top-2 right-10 bg-white px-2 py-1 rounded-md shadow-lg z-10 flex items-center gap-1 animate-fadeIn">
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-xs font-medium">{message}</span>
              </div>
            )}
            {/* Znaczek WYRÓŻNIONE */}
            {isFeatured && (
              <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-0.5 text-xs rounded-md font-medium flex items-center gap-1 shadow-lg z-20">
                <Medal className="w-3 h-3" />
                <span className="uppercase text-xs">WYRÓŻNIONE</span>
              </div>
            )}
          </div>

          {/* Główne informacje */}
          <div className="flex-grow p-3 flex flex-col relative">
            <div className="flex justify-between">
              <div className="pr-20">
                <h3 className="text-base font-bold mb-1">{displayTitle}</h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {listing.headline || listing.description?.substring(0, 60) || ''}
                </p>
              </div>
              
              {/* Cena */}
              <div className="absolute top-3 right-3 bg-[#35530A] px-2 py-1 rounded-md shadow-md text-white">
                <div className="text-xs font-medium">Cena</div>
                <div className="text-sm font-bold">
                  {listing.price ? `${listing.price.toLocaleString()} zł` : '54 000 zł'}
                </div>
              </div>
            </div>
            
            {/* Parametry w jednym rzędzie z zawijaniem */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-auto">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 text-[#35530A] flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Rok</div>
                  <div className="text-base font-medium">{listing.year || '2015'}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 text-[#35530A] flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Przebieg</div>
                  <div className="text-base font-medium">{listing.mileage ? `${listing.mileage} km` : '82685 km'}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 text-[#35530A] flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 19.5H19.5M9 7.5V10.5M15 7.5V10.5M6 10.5H18C18.5523 10.5 19 10.0523 19 9.5V6C19 5.44772 18.5523 5 18 5H6C5.44772 5 5 5.44772 5 6V9.5C5 10.0523 5.44772 10.5 6 10.5Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Paliwo</div>
                  <div className="text-base font-medium">{listing.fuelType || 'Diesel'}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 text-[#35530A] flex-shrink-0">
                  <MapPin className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Lokalizacja</div>
                  <div className="text-base font-medium">{listing.city || listing.location || 'Kraków'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderowanie dla desktopów (domyślne)
  return (
    <div
      onClick={() => onNavigate(listing.id)}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative 
                 ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'}`}
    >
      <div className="flex flex-row h-[240px]">
        {/* Zdjęcie - stała szerokość i wysokość */}
        <div className="w-[425px] h-full flex-shrink-0 relative overflow-hidden">
          <img
            src={listing.image}
            alt={displayTitle}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/auto-788747_1280.jpg';
            }}
          />
          {/* Serduszko na zdjęciu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(listing.id);
            }}
            className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform duration-200 
                     bg-white rounded-full shadow-lg z-10"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'}`}
            />
          </button>
          
          {/* Powiadomienie o dodaniu do ulubionych */}
          {message && (
            <div className="absolute top-3 right-14 bg-white px-3 py-1.5 rounded-md shadow-lg z-10 flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
          {/* Znaczek WYRÓŻNIONE */}
          {isFeatured && (
            <div className="absolute top-3 left-3 bg-[#35530A] text-white px-3 py-1 text-xs rounded-md font-medium flex items-center gap-1 shadow-lg z-20">
              <Medal className="w-4 h-4" />
              <span className="uppercase">WYRÓŻNIONE</span>
            </div>
          )}
        </div>

        {/* Główne informacje */}
        <div className="flex-grow p-4 flex flex-col relative">
          <div className="flex justify-between">
            <div className="pr-28">
              <h3 className="text-xl font-bold mb-1">{displayTitle}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {listing.headline || listing.description?.substring(0, 60) || ''}
              </p>
            </div>
            
            {/* Cena z cieniem */}
            <div className="text-white">
              <div className="bg-[#35530A] px-4 py-2 rounded-md shadow-md">
                <div className="text-sm font-medium">Cena</div>
                <div className="text-xl font-bold">
                  {listing.price ? `${listing.price.toLocaleString()} zł` : '54 000 zł'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Parametry - responsywny układ */}
          <div className="mt-4">
            {/* Główne parametry - pierwszy rząd */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              {/* Paliwo */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-[#35530A] flex-shrink-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 19.5H19.5M9 7.5V10.5M15 7.5V10.5M6 10.5H18C18.5523 10.5 19 10.0523 19 9.5V6C19 5.44772 18.5523 5 18 5H6C5.44772 5 5 5.44772 5 6V9.5C5 10.0523 5.44772 10.5 6 10.5Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Paliwo</div>
                  <div className="text-base font-medium">{listing.fuelType || 'Diesel'}</div>
                </div>
              </div>
              
              {/* Pojemność */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-[#35530A] flex-shrink-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 20H18M12 14V17M7 14H17C17.5523 14 18 13.5523 18 13V8C18 7.44772 17.5523 7 17 7H7C6.44772 7 6 7.44772 6 8V13C6 13.5523 6.44772 14 7 14Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Pojemność</div>
                  <div className="text-base font-medium">{listing.engineSize ? `${listing.engineSize} cm³` : '1178 cm³'}</div>
                </div>
              </div>
              
              {/* Moc */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-[#35530A] flex-shrink-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12.5L7.5 17M12 12.5L16.5 17M12 12.5V5M12 5H9M12 5H15" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Moc</div>
                  <div className="text-base font-medium">{listing.power ? `${listing.power} KM` : '149 KM'}</div>
                </div>
              </div>
            </div>
            
            {/* Drugi rząd parametrów */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-3">
              {/* Przebieg */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-[#35530A] flex-shrink-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Przebieg</div>
                  <div className="text-base font-medium">{listing.mileage ? `${listing.mileage} km` : '82685 km'}</div>
                </div>
              </div>
              
              {/* Rok */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-[#35530A] flex-shrink-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.75 3V5.25M17.25 3V5.25M3 18.75V7.5C3 6.25736 4.00736 5.25 5.25 5.25H18.75C19.9926 5.25 21 6.25736 21 7.5V18.75M3 18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75M3 18.75V11.25C3 10.0074 4.00736 9 5.25 9H18.75C19.9926 9 21 10.0074 21 11.25V18.75" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Rok</div>
                  <div className="text-base font-medium">{listing.year || '2015'}</div>
                </div>
              </div>
              
              {/* Skrzynia */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-[#35530A] flex-shrink-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 19.5H19.5M9 7.5V10.5M15 7.5V10.5M6 10.5H18C18.5523 10.5 19 10.0523 19 9.5V6C19 5.44772 18.5523 5 18 5H6C5.44772 5 5 5.44772 5 6V9.5C5 10.0523 5.44772 10.5 6 10.5Z" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Skrzynia</div>
                  <div className="text-base font-medium">{listing.transmission || 'Manualna'}</div>
                </div>
              </div>
            </div>
            
            {/* Trzeci rząd - napęd, sprzedawca i lokalizacja */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-3">
              {/* Napęd */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-[#35530A] flex-shrink-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17L4 12M4 12L9 7M4 12H20" stroke="#35530A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Napęd</div>
                  <div className="text-base font-medium">{listing.drive || 'Napęd tylny'}</div>
                </div>
              </div>
              
              {/* Sprzedawca */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-[#35530A] flex-shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Sprzedawca</div>
                  <div className="text-base font-medium">{listing.sellerType || 'Firma'}</div>
                </div>
              </div>
              
              {/* Lokalizacja */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-[#35530A] flex-shrink-0 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-xs text-gray-500">Lokalizacja</div>
                  <div className="text-base font-medium">
                    {listing.city || listing.location || 'Kraków'}
                    {listing.voivodeship && <span className="
