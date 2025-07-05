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
                 rounded-sm sm:rounded-md`}
      onClick={handleNavigate}
      style={{ minHeight: '420px' }} // Zwiększona wysokość karty
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-2 left-2 bg-[#35530A] text-white py-1 px-2 text-xs font-semibold z-10 uppercase rounded-sm">
          WYRÓŻNIONE
        </div>
      )}

      {/* Image - większy */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 sm:h-52 md:h-56 object-cover" // Zwiększona wysokość obrazka
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
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-sm">
            {listing.matchLabel}
          </div>
        )}
      </div>

      {/* Card content - więcej paddingu i spacingu */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">
          {`Ogłoszenie: ${title}`}
        </p>

        {/* Seller and location - większy spacing */}
        <div className="flex flex-row justify-between mb-4">
          {/* Seller type */}
          <div className="flex items-center">
            <div className="mr-2 text-gray-700">
              <User className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium text-[#35530A]">{sellerType}</div>
          </div>

          {/* Location - tylko miasto bez województwa */}
          <div className="flex items-center">
            <div className="mr-2 text-gray-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">{listing.city || location.split('(')[0].trim()}</div>
          </div>
        </div>

        {/* Specifications - większy spacing między wierszami */}
        <div className="grid grid-cols-3 gap-y-3 gap-x-2 mb-4">
          {/* 1 kolumna */}
          <div className="flex items-center">
            <div className="mr-2 text-gray-700">
              <FuelIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{fuelType}</div>
          </div>

          {/* 2 kolumna */}
          <div className="flex items-center">
            <div className="mr-2 text-gray-700">
              <CapacityIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{engineCapacity}</div>
          </div>

          {/* 3 kolumna */}
          <div className="flex items-center">
            <div className="mr-2 text-gray-700">
              <MileageIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{mileage.toLocaleString()} km</div>
          </div>

          {/* 1 kolumna */}
          <div className="flex items-center">
            <div className="mr-2 text-gray-700">
              <YearIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{year}</div>
          </div>

          {/* 2 kolumna */}
          <div className="flex items-center">
            <div className="mr-2 text-gray-700">
              <PowerIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{power}</div>
          </div>

          {/* 3 kolumna */}
          <div className="flex items-center">
            <div className="mr-2 text-gray-700">
              <GearboxIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{transmission}</div>
          </div>
        </div>

        {/* Cena - PRZENIESIONA NA DÓŁ - większa i bardziej wyróżniona */}
        <div className="mt-auto">
          <div className="bg-[#35530A] rounded-md py-3 text-center text-2xl font-bold text-white">
            {price.toLocaleString()} zł
          </div>
        </div>
      </div>
    </div>
  );
});

export default GridListingCard;
