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

const GridListingCard = memo(({ listing, onFavorite, isFavorite }) => {
  const navigate = useNavigate();
  
  // Check if listing is featured
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Create title from brand/make and model
  const title = `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim();
  
  // Extract listing details with fallbacks
  const price = listing.price || 0;
  const year = listing.year || new Date().getFullYear();
  const mileage = listing.mileage || 0;
  const fuelType = listing.fuelType || 'benzyna';
  const power = listing.power || '150';
  const capacity = listing.capacity || '2000';
  const transmission = listing.transmission || 'manualna';
  const sellerType = listing.sellerType || 'prywatny';
  const location = listing.city || listing.location || 'Polska';
  
  // Handle navigation to listing details
  const handleNavigate = () => {
    navigate(`/listing/${listing._id || listing.id}`);
  };
  
  // Safe image URL handling
  const imageUrl = (listing.images && listing.images.length > 0) 
    ? listing.images[typeof listing.mainImageIndex === 'number' ? listing.mainImageIndex : 0] 
    : listing.image || '/images/auto-788747_1280.jpg';

  return (
    <div 
      className={`relative bg-white shadow-md overflow-hidden flex flex-col cursor-pointer 
                 hover:shadow-lg transition-shadow h-full
                 ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'}
                 rounded-sm sm:rounded-md`}
      onClick={handleNavigate}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-2 left-2 bg-[#35530A] text-white py-1 px-2 text-xs font-semibold z-10 uppercase rounded-sm">
          WYRÓŻNIONE
        </div>
      )}

      {/* Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-36 sm:h-40 md:h-44 object-cover"
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
        {listing.matchLabel && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-sm">
            {listing.matchLabel}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-2 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-0.5 line-clamp-1">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-1.5 line-clamp-1">
          {`Ogłoszenie: ${title}`}
        </p>

        {/* Cena - na górze dla desktopów */}
        <div className="bg-[#35530A] rounded-sm py-1.5 text-center text-xl font-bold text-white mb-1.5">
          {price.toLocaleString()} zł
        </div>

        {/* Seller and location - pod ceną */}
        <div className="flex flex-row justify-between mb-1.5">
          {/* Seller type */}
          <div className="flex items-center">
            <div className="mr-1 text-gray-700">
              <User className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium text-[#35530A]">{sellerType}</div>
          </div>

          {/* Location */}
          <div className="flex items-center">
            <div className="mr-1 text-gray-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">{location}</div>
          </div>
        </div>

        {/* Specifications - arranged in a 3-column grid dla lepszego wykorzystania przestrzeni */}
        <div className="grid grid-cols-3 gap-y-1.5 gap-x-1">
          {/* 1 kolumna */}
          <div className="flex items-center">
            <div className="mr-1 text-gray-700">
              <FuelIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{fuelType}</div>
          </div>

          {/* 2 kolumna */}
          <div className="flex items-center">
            <div className="mr-1 text-gray-700">
              <CapacityIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{capacity} cm³</div>
          </div>

          {/* 3 kolumna */}
          <div className="flex items-center">
            <div className="mr-1 text-gray-700">
              <MileageIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{mileage.toLocaleString()} km</div>
          </div>

          {/* 1 kolumna */}
          <div className="flex items-center">
            <div className="mr-1 text-gray-700">
              <YearIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{year}</div>
          </div>

          {/* 2 kolumna */}
          <div className="flex items-center">
            <div className="mr-1 text-gray-700">
              <PowerIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{power} KM</div>
          </div>

          {/* 3 kolumna */}
          <div className="flex items-center">
            <div className="mr-1 text-gray-700">
              <GearboxIcon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">{transmission}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GridListingCard;