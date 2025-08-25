import React, { memo } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import YearIcon from '../icons/YearIcon';
import FuelIcon from '../icons/FuelIcon';
import MileageIcon from '../icons/MileageIcon';
import PowerIcon from '../icons/PowerIcon';
import GearboxIcon from '../icons/GearboxIcon';
import CapacityIcon from '../icons/CapacityIcon';
import { MapPin, User } from 'lucide-react';
import getImageUrl from '../../utils/responsive/getImageUrl';

const GridListingCard = memo(({ listing, onFavorite, isFavorite }) => {
  const navigate = useNavigate();
  
  // Check if listing is featured
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Create title from brand/make and model
  const title = `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim();
  
  // Używamy danych bezpośrednio z API bez statycznych wartości domyślnych
  const price = listing.price || 0;
  const year = listing.year || new Date().getFullYear();
  const mileage = listing.mileage || 0;
  const fuelType = listing.fuelType || listing.fuel || 'Nie podano';
  const power = listing.power || 'Nie podano';
  const engineCapacity = listing.engineCapacity || 'Nie podano';
  const transmission = listing.transmission || listing.gearbox || 'Nie podano';
  const sellerType = listing.sellerType || 'Nie podano';
  const location = listing.city || listing.location || 'Polska';
  
  // Przygotowanie danych do wyświetlenia
  
  // Handle navigation to listing details
  const handleNavigate = () => {
    navigate(`/listing/${listing._id || listing.id}`);
  };
  
  // Safe image URL handling with proper backend URL prefix
  const getListingImage = () => {
    if (listing.images && listing.images.length > 0) {
      const mainIndex = typeof listing.mainImageIndex === 'number' && 
                        listing.mainImageIndex >= 0 && 
                        listing.mainImageIndex < listing.images.length 
                          ? listing.mainImageIndex 
                          : 0;
      
      const selectedImage = listing.images[mainIndex];
      return getImageUrl(selectedImage);
    }
    
    // Fallback do statycznego obrazka
    return '/images/auto-788747_1280.jpg';
  };
  
  const imageUrl = getListingImage();

  return (
    <div 
      className={`relative bg-white shadow-md overflow-hidden flex flex-col cursor-pointer 
                 hover:shadow-lg transition-shadow h-full
                 ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'}
                 rounded-[2px]`}
      onClick={handleNavigate}
      style={{ minHeight: '360px' }} // Zmniejszona wysokość karty
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-2 left-2 bg-[#35530A] text-white py-1 px-2 text-xs font-semibold z-10 uppercase rounded-[2px]">
          WYRÓŻNIONE
        </div>
      )}

      {/* Image - większy */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-40 sm:h-44 md:h-48 object-cover" // Zmniejszona wysokość obrazka
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/auto-788747_1280.jpg';
          }}
        />

        {/* Favorites button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onFavorite) onFavorite(listing._id || listing.id);
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Match score label */}
        {listing.matchLabel && listing.matchLabel !== 'Pozostałe ogłoszenia' && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-[2px]">
            {listing.matchLabel}
          </div>
        )}
      </div>

      {/* Card content - układ jak na wzorze BMW Seria 1 */}
      <div className="p-2.5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>
        
        <p className="text-[10px] text-gray-600 mb-2 line-clamp-2 leading-tight">
          {listing.headline || listing.shortDescription || `${title} - sprawdź szczegóły tego ogłoszenia`}
        </p>

        {/* Specifications - układ jak na wzorze BMW Seria 1 */}
        <div className="space-y-1.5 mb-2">
          {/* Pierwsza linia */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <YearIcon className="w-3 h-3 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Rok</div>
                <div className="text-[11px] font-bold text-gray-900">{year}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <FuelIcon className="w-3 h-3 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Paliwo</div>
                <div className="text-[11px] font-bold text-gray-900">{fuelType}</div>
              </div>
            </div>
          </div>

          {/* Druga linia */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <MileageIcon className="w-3 h-3 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Przebieg</div>
                <div className="text-[11px] font-bold text-gray-900">{Math.round(mileage/1000)} tys. km</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <PowerIcon className="w-3 h-3 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Moc</div>
                <div className="text-[11px] font-bold text-gray-900">{power}</div>
              </div>
            </div>
          </div>

          {/* Trzecia linia */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <CapacityIcon className="w-3 h-3 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Pojemność</div>
                <div className="text-[11px] font-bold text-gray-900">{engineCapacity} cm³</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <GearboxIcon className="w-3 h-3 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Skrzynia</div>
                <div className="text-[11px] font-bold text-gray-900">{transmission === 'Automatyczna' ? 'automatyczna' : 'manualna'}</div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 my-2"></div>
          
          {/* Czwarta linia - pod separatorem */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <User className="w-3 h-3 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Sprzedawca</div>
                <div className="text-[11px] font-bold text-gray-900">prywatny</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <MapPin className="w-3 h-3 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Lokalizacja</div>
                <div className="text-[11px] font-bold text-gray-900 truncate">{listing.city || location.split('(')[0].trim()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cena - na dole */}
        <div className="mt-auto">
          <div className="bg-[#35530A] rounded-[2px] py-1.5 text-center text-base font-bold text-white">
            {price.toLocaleString()} zł
          </div>
        </div>
      </div>
    </div>
  );
});

export default GridListingCard;
