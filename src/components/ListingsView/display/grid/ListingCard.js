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
  Medal,
  Settings,
  Globe
} from 'lucide-react';
import getImageUrl from '../../../../utils/responsive/getImageUrl';

const ListingCard = memo(({ listing, onNavigate, onFavorite, isFavorite, message }) => {
  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Używamy headline z danych, tak jak w widoku listowym
  const subtitle = listing.headline || `${listing.year}, ${listing.mileage || 0} km`;

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
          src={(() => {
            const originalImageUrl = listing.images && listing.images.length > 0 
              ? (typeof listing.mainImageIndex === 'number' && 
                 listing.mainImageIndex >= 0 && 
                 listing.mainImageIndex < listing.images.length 
                  ? listing.images[listing.mainImageIndex] 
                  : listing.images[0])
              : listing.image || '/images/auto-788747_1280.jpg';
            
            console.log('🖼️ ListingCard - Original image URL:', originalImageUrl);
            const processedUrl = getImageUrl(originalImageUrl);
            console.log('🖼️ ListingCard - Processed image URL:', processedUrl);
            return processedUrl;
          })()}
          alt={listing.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            console.log('❌ ListingCard - Image failed to load:', e.target.src);
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
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Parametry w siatce 2x4 - powiększone ikony */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-3 mb-3 mt-4">
          {/* Paliwo */}
          <div className="flex items-start gap-1.5 text-gray-700">
            <Fuel className="w-5 h-5 text-black mt-1" />
            <div>
              <div className="text-xs text-gray-500">Paliwo</div>
              <div className="text-sm font-medium">{listing.fuel || listing.fuelType || 'N/A'}</div>
            </div>
          </div>
          
          {/* Przebieg */}
          <div className="flex items-start gap-1.5 text-gray-700">
            <Gauge className="w-5 h-5 text-black mt-1" />
            <div>
              <div className="text-xs text-gray-500">Przebieg</div>
              <div className="text-sm font-medium">{listing.mileage} km</div>
            </div>
          </div>

          {/* Pojemność */}
          <div className="flex items-start gap-1.5 text-gray-700">
            <Box className="w-5 h-5 text-black mt-1" />
            <div>
              <div className="text-xs text-gray-500">Pojemność</div>
              <div className="text-sm font-medium">{listing.engineCapacity || 'N/A'}</div>
            </div>
          </div>

          {/* Rok */}
          <div className="flex items-start gap-1.5 text-gray-700">
            <Calendar className="w-5 h-5 text-black mt-1" />
            <div>
              <div className="text-xs text-gray-500">Rok</div>
              <div className="text-sm font-medium">{listing.year}</div>
            </div>
          </div>

          {/* Moc */}
          <div className="flex items-start gap-1.5 text-gray-700">
            <Power className="w-5 h-5 text-black mt-1" />
            <div>
              <div className="text-xs text-gray-500">Moc</div>
              <div className="text-sm font-medium">{listing.power || 'N/A'}</div>
            </div>
          </div>
          
          {/* Napęd */}
          <div className="flex items-start gap-1.5 text-gray-700">
            <Car className="w-5 h-5 text-black mt-1" />
            <div>
              <div className="text-xs text-gray-500">Napęd</div>
              <div className="text-sm font-medium">{listing.drive || 'N/A'}</div>
            </div>
          </div>

          {/* Skrzynia biegów */}
          <div className="flex items-start gap-1.5 text-gray-700">
            <Settings className="w-5 h-5 text-black mt-1" />
            <div>
              <div className="text-xs text-gray-500">Skrzynia</div>
              <div className="text-sm font-medium">{listing.transmission || listing.gearbox || listing.transmissionType || 'N/A'}</div>
            </div>
          </div>

          {/* Kraj pochodzenia */}
          <div className="flex items-start gap-1.5 text-gray-700">
            <Globe className="w-5 h-5 text-black mt-1" />
            <div>
              <div className="text-xs text-gray-500">Pochodzenie</div>
              <div className="text-sm font-medium">
                {listing.countryOfOrigin || 
                 (listing.imported === 'Tak' || listing.imported === 'tak' ? 'Import' : 'Polska')}
              </div>
            </div>
          </div>
        </div>

        {/* Match score label - poza siatką */}
        {listing.matchLabel && listing.matchLabel !== 'Pozostałe ogłoszenia' && (
          <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-sm mt-2">
            {listing.matchLabel}
          </div>
        )}
        
        {/* Message (e.g. "Added to favorites") - poza siatką */}
        {message && (
          <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-sm mt-2">
            {message}
          </div>
        )}
      </div>

      {/* Stopka karty - sprzedawca, lokalizacja i cena */}
      <div className="mt-auto">
        {/* Linia separująca */}
        <div className="border-t border-gray-200"></div>
        
        {/* Sprzedawca i lokalizacja */}
        <div className="flex justify-between items-center mb-4 px-4 pt-4">
          {/* Sprzedawca */}
          <div className="flex items-center flex-1">
            <User className="w-5 h-5 mr-2 text-gray-700" />
            <div className="text-base font-medium text-[#35530A]">
              {listing.sellerType === 'prywatny' ? 'Prywatny' : 'Firma'}
            </div>
          </div>

          {/* Separator */}
          <div className="h-5 w-px bg-gray-300 mx-3"></div>

          {/* Lokalizacja */}
          <div className="flex items-center flex-1">
            <MapPin className="w-5 h-5 mr-2 text-gray-700" />
            <div className="text-base font-medium">
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
