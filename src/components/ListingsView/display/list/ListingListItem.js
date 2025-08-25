import React, { memo } from 'react';
import { 
  MapPin, 
  Heart,
  Fuel,
  Calendar,
  Gauge,
  Power,
  Car,
  Box,
  User,
  Medal,
  Globe,
  Settings
} from 'lucide-react';
import getImageUrl from '../../../../utils/responsive/getImageUrl';

const ListingListItem = memo(({ 
  listing, 
  onNavigate, 
  onFavorite, 
  isFavorite, 
  message 
}) => {
  // Function to truncate title to 120 characters
  const truncateTitle = (title) => {
    if (!title) return '';
    return title.length > 120 ? title.substring(0, 120) + '...' : title;
  };

  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  return (
    <div
      onClick={() => onNavigate(listing.id)}
      className={`bg-white rounded-sm shadow-md overflow-hidden cursor-pointer 
                  hover:shadow-xl transition-all duration-300 relative group
                  ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'}
                  flex flex-col sm:flex-row h-auto sm:h-[216px] lg:h-[216px]`}
    >
      {/* Zdjęcie */}
      <div className="w-full sm:w-[300px] lg:w-[336px] h-48 sm:h-full relative overflow-hidden flex-shrink-0">
        <img
          src={getImageUrl(listing.images && listing.images.length > 0 
            ? (typeof listing.mainImageIndex === 'number' && 
               listing.mainImageIndex >= 0 && 
               listing.mainImageIndex < listing.images.length 
                ? listing.images[listing.mainImageIndex] 
                : listing.images[0])
            : listing.image)}
          alt={listing.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 hover:scale-110 transition-transform duration-200
                     bg-white rounded-full shadow-lg z-10"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'}`}
          />
        </button>
        {isFeatured && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#35530A] text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-2.5 lg:py-1.5 text-xs sm:text-sm lg:text-xs rounded-sm font-medium flex items-center gap-1.5 sm:gap-2 shadow-lg">
            <Medal className="w-3 h-3 sm:w-4 sm:h-4 lg:w-3.5 lg:h-3.5" />
            WYRÓŻNIONE
          </div>
        )}
        {listing.matchLabel && listing.matchLabel !== 'Pozostałe ogłoszenia' && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-sm">
            {listing.matchLabel}
          </div>
        )}
      </div>

      {/* Na urządzeniach mobilnych mamy układ kartowy z opisem pod zdjęciem */}
      <div className="flex flex-col sm:flex-row flex-grow">
        {/* Główne informacje */}
        <div className="flex-grow p-2 sm:p-3 lg:p-3 flex flex-col">
          <div className="mb-1.5 sm:mb-2 lg:mb-2">
            <h3 className="text-fluid-sm font-bold mb-0.5 sm:mb-0.5 lg:mb-0.5 line-clamp-1 leading-fluid-tight" title={listing.title}>{truncateTitle(listing.title)}</h3>
            <p className="text-fluid-xs text-gray-600 line-clamp-2 leading-fluid-normal">{listing.headline || ''}</p>
          </div>

          {/* Parametry w 4 kolumnach po 2 parametry */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-3 sm:gap-x-4 sm:gap-y-4 mt-6 sm:mt-8">
            {/* Kolumna 1 */}
            <div className="space-y-3">
              {/* Paliwo */}
              <div className="flex items-start gap-2.5 text-gray-700">
                <Fuel className="w-4 h-4 sm:w-4 sm:h-4 text-gray-800 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 leading-tight mb-0.5">Paliwo</div>
                  <div className="text-sm font-medium text-gray-900 leading-tight">{listing.fuel}</div>
                </div>
              </div>
              
              {/* Przebieg */}
              <div className="flex items-start gap-2.5 text-gray-700">
                <Gauge className="w-4 h-4 sm:w-4 sm:h-4 text-gray-800 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 leading-tight mb-0.5">Przebieg</div>
                  <div className="text-sm font-medium text-gray-900 leading-tight">{listing.mileage} km</div>
                </div>
              </div>
            </div>

            {/* Kolumna 2 */}
            <div className="space-y-3">
              {/* Pojemność */}
              <div className="flex items-start gap-2.5 text-gray-700">
                <Box className="w-4 h-4 sm:w-4 sm:h-4 text-gray-800 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 leading-tight mb-0.5">Pojemność</div>
                  <div className="text-sm font-medium text-gray-900 leading-tight">{listing.engineCapacity}</div>
                </div>
              </div>

              {/* Rok */}
              <div className="flex items-start gap-2.5 text-gray-700">
                <Calendar className="w-4 h-4 sm:w-4 sm:h-4 text-gray-800 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 leading-tight mb-0.5">Rok</div>
                  <div className="text-sm font-medium text-gray-900 leading-tight">{listing.year}</div>
                </div>
              </div>
            </div>

            {/* Kolumna 3 */}
            <div className="space-y-3">
              {/* Moc */}
              <div className="flex items-start gap-2.5 text-gray-700">
                <Power className="w-4 h-4 sm:w-4 sm:h-4 text-gray-800 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 leading-tight mb-0.5">Moc</div>
                  <div className="text-sm font-medium text-gray-900 leading-tight">{listing.power}</div>
                </div>
              </div>
              
              {/* Napęd */}
              <div className="flex items-start gap-2.5 text-gray-700">
                <Settings className="w-4 h-4 sm:w-4 sm:h-4 text-gray-800 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 leading-tight mb-0.5">Napęd</div>
                  <div className="text-sm font-medium text-gray-900 leading-tight">{listing.drive}</div>
                </div>
              </div>
            </div>

            {/* Kolumna 4 */}
            <div className="space-y-3">
              {/* Skrzynia biegów */}
              <div className="flex items-start gap-2.5 text-gray-700">
                <Car className="w-4 h-4 sm:w-4 sm:h-4 text-gray-800 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 leading-tight mb-0.5">Skrzynia</div>
                  <div className="text-sm font-medium text-gray-900 leading-tight">{listing.transmission || listing.gearbox || listing.transmissionType || 'N/A'}</div>
                </div>
              </div>

              {/* Kraj pochodzenia */}
              <div className="flex items-start gap-2.5 text-gray-700">
                <Globe className="w-4 h-4 sm:w-4 sm:h-4 text-gray-800 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 leading-tight mb-0.5">Pochodzenie</div>
                  <div className="text-sm font-medium text-gray-900 leading-tight">
                    {listing.countryOfOrigin || 
                     (listing.imported === 'Tak' || listing.imported === 'tak' ? 'Import' : 'Polska')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prawa kolumna - na mobile full width, na desktop side panel */}
        <div className="w-full sm:w-[180px] lg:w-[192px] p-2 sm:p-3 lg:p-3 flex flex-col sm:flex-col bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-100">
          {/* Na desktopach najpierw cena, potem sprzedawca/lokalizacja */}
          {/* Cena */}
          <div className="bg-[#35530A] rounded-sm p-1.5 sm:p-2 lg:p-2 shadow-md order-2 sm:order-1 mt-1 sm:mt-0 sm:mb-2 lg:mb-2">
            <div className="text-fluid-lg font-bold text-white tracking-tight text-center leading-fluid-tight">
              {listing.price.toLocaleString('pl-PL')} zł
            </div>
          </div>
          
          {/* Sprzedawca i lokalizacja w jednym wierszu na mobile, w kolumnie na desktop */}
          <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 mb-1 sm:mb-0 order-1 sm:order-2">
            {/* Sprzedawca */}
            <div className="flex-1 sm:w-full">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-[#35530A] flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 leading-tight">Sprzedawca</div>
                  <div className="text-sm font-semibold text-[#35530A] leading-tight">
                    {listing.sellerType === 'prywatny' ? 'Prywatny' : 'Firma'}
                  </div>
                </div>
              </div>
            </div>

            {/* Lokalizacja */}
            <div className="flex-1 sm:w-full mt-0 sm:mt-2">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-[#35530A] flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 leading-tight">Lokalizacja</div>
                  <div className="text-sm font-semibold text-gray-900 leading-tight">
                    {listing.city}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="absolute top-2 right-12 sm:top-3 sm:right-16 bg-black bg-opacity-75 text-white text-xs sm:text-sm px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-sm z-20">
          {message}
        </div>
      )}
    </div>
  );
});

export default ListingListItem;
