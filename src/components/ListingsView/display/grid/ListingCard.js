import React, { memo } from 'react';
import { 
  Heart, 
  MapPin, 
  User,
  Fuel,
  Calendar,
  Gauge,
  Power,
  Car,
  Box,
  Medal
} from 'lucide-react';
import getImageUrl from '../../../../utils/responsive/getImageUrl';

const ListingCard = memo(({ listing, onNavigate, onFavorite, isFavorite, message }) => {
  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Używamy subtitle z danych, tak jak w widoku listowym
  const subtitle = listing.subtitle || (listing.description 
    ? listing.description.slice(0, 60) + (listing.description.length > 60 ? '...' : '')
    : `${listing.year}, ${listing.mileage || 0} km`);

  return (
    <div
      // Używamy tego samego stylu ramki co w widoku listowym
      className={`relative bg-white shadow-md overflow-hidden flex flex-col h-full cursor-pointer 
                 hover:shadow-lg transition-shadow
                 ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'}
                 rounded-sm sm:rounded-md`}
      onClick={() => onNavigate(listing.id || listing._id)}
    >
      {/* Badge wyróżnionej oferty - używamy tego samego stylu co w widoku listowym */}
      {isFeatured && (
        <div className="absolute top-2 left-2 bg-[#35530A] text-white py-1 px-2 text-xs font-semibold z-10 uppercase rounded-sm flex items-center gap-1.5">
          <Medal className="w-3 h-3" />
          WYRÓŻNIONE
        </div>
      )}

      {/* Zdjęcie */}
      <div className="relative">
        <img
          src={listing.images && listing.images.length > 0 
            ? getImageUrl(typeof listing.mainImageIndex === 'number' && 
               listing.mainImageIndex >= 0 && 
               listing.mainImageIndex < listing.images.length 
                ? listing.images[listing.mainImageIndex] 
                : listing.images[0])
            : listing.image || '/images/auto-788747_1280.jpg'}
          alt={listing.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/auto-788747_1280.jpg';
          }}
        />

        {/* Przycisk ulubionych */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(listing.id || listing._id);
          }}
          className="absolute top-2 right-2 p-1 bg-white rounded-full"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'
            }`}
          />
        </button>
      </div>

      {/* Treść karty */}
      <div className="p-4 flex-grow">
        {/* Tytuł i podtytuł - tak jak w widoku listowym */}
        <div className="mb-2">
          <h3 className="font-bold text-lg text-gray-900 mb-0.5 line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1">
            {subtitle}
          </p>
        </div>

        {/* Parametry w siatce 3x2 - podobnie jak w widoku listowym */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 mb-3">
          {/* Kolumna 1 */}
          <div className="space-y-2">
            {/* Paliwo */}
            <div className="flex items-center gap-1.5 text-gray-700">
              <Fuel className="w-4 h-4 text-black" />
              <div>
                <div className="text-xs text-gray-500">Paliwo</div>
                <div className="text-sm font-medium">{listing.fuel || listing.fuelType || 'Nie podano'}</div>
              </div>
            </div>
            
            {/* Przebieg */}
            <div className="flex items-center gap-1.5 text-gray-700">
              <Gauge className="w-4 h-4 text-black" />
              <div>
                <div className="text-xs text-gray-500">Przebieg</div>
                <div className="text-sm font-medium">{listing.mileage} km</div>
              </div>
            </div>
          </div>

          {/* Kolumna 2 */}
          <div className="space-y-2">
            {/* Pojemność */}
            <div className="flex items-center gap-1.5 text-gray-700">
              <Box className="w-4 h-4 text-black" />
              <div>
                <div className="text-xs text-gray-500">Pojemność</div>
                <div className="text-sm font-medium">{listing.engineCapacity}</div>
              </div>
            </div>

            {/* Rok */}
            <div className="flex items-center gap-1.5 text-gray-700">
              <Calendar className="w-4 h-4 text-black" />
              <div>
                <div className="text-xs text-gray-500">Rok</div>
                <div className="text-sm font-medium">{listing.year}</div>
              </div>
            </div>
          </div>

          {/* Kolumna 3 */}
          <div className="space-y-2">
            {/* Moc */}
            <div className="flex items-center gap-1.5 text-gray-700">
              <Power className="w-4 h-4 text-black" />
              <div>
                <div className="text-xs text-gray-500">Moc</div>
                <div className="text-sm font-medium">{listing.power}</div>
              </div>
            </div>
            
            {/* Napęd */}
            <div className="flex items-center gap-1.5 text-gray-700">
              <Car className="w-4 h-4 text-black" />
              <div>
                <div className="text-xs text-gray-500">Napęd</div>
                <div className="text-sm font-medium">{listing.drive || 'Nie podano'}</div>
              </div>
            </div>
          </div>

          {/* Match score label */}
          {listing.matchLabel && listing.matchLabel !== 'Pozostałe ogłoszenia' && (
            <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-sm mt-2">
              {listing.matchLabel}
            </div>
          )}
          
          {/* Message (e.g. "Added to favorites") */}
          {message && (
            <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-sm mt-2">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Stopka karty - sprzedawca, lokalizacja i cena */}
      <div className="mt-auto">
        {/* Sprzedawca i lokalizacja */}
        <div className="flex justify-between mb-3 px-3">
          {/* Sprzedawca */}
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1 text-gray-700" />
            <div className="text-sm font-medium text-[#35530A]">
              {listing.sellerType === 'prywatny' ? 'Prywatny' : listing.sellerType}
            </div>
          </div>

          {/* Lokalizacja */}
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            <div className="text-sm font-medium">
              {listing.city}
            </div>
          </div>
        </div>

        {/* Cena - w stylu widoku listowego */}
        <div className="bg-[#35530A] py-3 text-center">
          <div className="text-xl font-bold text-white">
            {listing.price.toLocaleString('pl-PL')} zł
          </div>
        </div>
      </div>
    </div>
  );
});

export default ListingCard;
