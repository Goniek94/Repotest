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
  
  // Create title from brand/make and model (always on top)
  const brandModel = `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim();
  // Headline from form (displayed under brand and model)
  const headline = listing.headline || '';
  
  // Function to format title for two lines (up to 120 characters)
  const formatTitle = (title) => {
    if (!title) return '';
    // Allow up to 120 characters, will wrap naturally to two lines
    return title.length > 120 ? title.substring(0, 120) + '...' : title;
  };
  
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
      style={{ minHeight: '320px' }} // Jeszcze bardziej zmniejszona wysokość karty
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
          className="w-full h-32 sm:h-36 md:h-40 object-cover" // Jeszcze bardziej zmniejszona wysokość obrazka
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

      {/* Card content - bardziej kompaktowy */}
      <div className="p-2 flex flex-col flex-grow">
        {/* Kompaktowy nagłówek - marka/model + headline */}
        <div className="h-16 mb-0.5">
          {/* Marka i model */}
          <h3 className="font-bold text-sm text-gray-900 mb-0.5 leading-tight">
            {brandModel}
          </h3>
          
          {/* Nagłówek z formularza - dynamiczny rozmiar żeby się zmieścił w 2 liniach */}
          {headline && (
            <h4 
              className="font-medium text-gray-700 leading-tight"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
                hyphens: 'auto',
                minHeight: '2rem',
                lineHeight: '1rem',
                fontSize: headline.length > 60 ? '10px' : headline.length > 40 ? '11px' : '12px'
              }}
              title={headline}
            >
              {headline}
            </h4>
          )}
        </div>

        {/* Specifications - bardziej kompaktowe */}
        <div className="space-y-0.5 mb-0.5">
          {/* Pierwsza linia */}
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full flex-shrink-0">
                <YearIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] text-gray-500 font-medium">Rok</div>
                <div className="text-[10px] font-bold text-gray-900">{year}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full flex-shrink-0">
                <FuelIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] text-gray-500 font-medium">Paliwo</div>
                <div className="text-[10px] font-bold text-gray-900">{fuelType}</div>
              </div>
            </div>
          </div>

          {/* Druga linia */}
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full flex-shrink-0">
                <MileageIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] text-gray-500 font-medium">Przebieg</div>
                <div className="text-[10px] font-bold text-gray-900">{Math.round(mileage/1000)} tys. km</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full flex-shrink-0">
                <PowerIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] text-gray-500 font-medium">Moc</div>
                <div className="text-[10px] font-bold text-gray-900">{power}</div>
              </div>
            </div>
          </div>

          {/* Trzecia linia */}
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full flex-shrink-0">
                <CapacityIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] text-gray-500 font-medium">Pojemność</div>
                <div className="text-[10px] font-bold text-gray-900">{engineCapacity} cm³</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full flex-shrink-0">
                <GearboxIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] text-gray-500 font-medium">Skrzynia</div>
                <div className="text-[10px] font-bold text-gray-900">{transmission === 'Automatyczna' ? 'automatyczna' : 'manualna'}</div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 my-0.5"></div>
          
          {/* Czwarta linia - pod separatorem */}
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full flex-shrink-0">
                <User className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] text-gray-500 font-medium">Sprzedawca</div>
                <div className="text-[10px] font-bold text-gray-900">prywatny</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded-full flex-shrink-0">
                <MapPin className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[8px] text-gray-500 font-medium">Lokalizacja</div>
                <div className="text-[10px] font-bold text-gray-900 truncate">{listing.city || location.split('(')[0].trim()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cena - na dole */}
        <div className="mt-auto">
          <div className="bg-[#35530A] rounded-[2px] py-1 text-center text-sm font-bold text-white">
            {price.toLocaleString()} zł
          </div>
        </div>
      </div>
    </div>
  );
});

export default GridListingCard;
