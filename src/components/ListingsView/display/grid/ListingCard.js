import React, { memo } from 'react';
import { Heart } from 'lucide-react';
import YearIcon from '../../../icons/YearIcon';
import FuelIcon from '../../../icons/FuelIcon';
import MileageIcon from '../../../icons/MileageIcon';
import PowerIcon from '../../../icons/PowerIcon';
import GearboxIcon from '../../../icons/GearboxIcon';
import CapacityIcon from '../../../icons/CapacityIcon';
import DriveIcon from '../../../icons/DriveIcon';
import { MapPin, User, Globe } from 'lucide-react';
import getImageUrl from '../../../../utils/responsive/getImageUrl';

const ListingCard = memo(({ listing, onNavigate, onFavorite, isFavorite, message }) => {
  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Tworzenie tytułu z brand/make i model
  const title = `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim();
  
  // Function to truncate title to 80 characters
  const truncateTitle = (title) => {
    if (!title) return '';
    return title.length > 80 ? title.substring(0, 80) + '...' : title;
  };
  
  const price = listing.price || 0;
  const year = listing.year || new Date().getFullYear();
  const mileage = listing.mileage || 0;
  const fuelType = listing.fuel || listing.fuelType || 'Benzyna';
  const power = listing.power || '150';
  const capacity = listing.engineCapacity ? parseInt(listing.engineCapacity) : 2000;
  const transmission = listing.transmission || listing.gearbox || 'manualna';
  const drive = listing.drive || 'Na przednie koła';
  const sellerType = listing.sellerType || 'Prywatny';
  const city = listing.city || listing.location || 'Polska';
  const countryOfOrigin = listing.countryOfOrigin || (listing.imported === 'Tak' ? 'Import' : 'Polska');
  
  // Bezpieczny dostęp do obrazu
  let imageUrl = null;
  if (listing.images && listing.images.length > 0) {
    const mainIdx = typeof listing.mainImageIndex === 'number' &&
                    listing.mainImageIndex >= 0 &&
                    listing.mainImageIndex < listing.images.length
      ? listing.mainImageIndex
      : 0;
    imageUrl = getImageUrl(listing.images[mainIdx]);
  } else {
    imageUrl = getImageUrl(listing.image || null);
  }

  // Tworzenie opisu technicznego w jednej linii jak na obrazku
  const technicalDescription = `${title} ${year} • ${fuelType} • ${transmission} • ${mileage.toLocaleString('pl-PL')} tys. km • ${power} KM • ${countryOfOrigin}`;

  return (
    <div 
      className={`bg-white shadow-sm hover:shadow-md overflow-hidden flex flex-col cursor-pointer h-full transition-all duration-200 w-full relative ${
        isFeatured ? 'border-2 border-[#35530A] rounded-lg' : 'border border-gray-200 hover:border-gray-300 rounded-lg'
      }`}
      onClick={() => onNavigate(listing.id || listing._id)}
    >
      {/* Zdjęcie */}
      <div className="relative h-48">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/auto-788747_1280.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded-t-lg">
            Brak zdjęcia
          </div>
        )}
        
        {/* Badge wyróżnionej oferty */}
        {isFeatured && (
          <div className="absolute top-3 left-3 bg-[#35530A] text-white px-3 py-1 text-xs font-medium rounded">
            Wyróżnione
          </div>
        )}

        {/* Przycisk ulubionych */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(listing.id || listing._id);
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Treść karty */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Nagłówek - tytuł w jednej linii */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate whitespace-nowrap overflow-hidden text-ellipsis" title={title}>
          {truncateTitle(title)}
        </h3>
        
        {/* Opis techniczny w jednej linii */}
        <p className="text-sm text-gray-600 mb-4 truncate whitespace-nowrap overflow-hidden text-ellipsis" title={technicalDescription}>
          {technicalDescription}
        </p>
        
        {/* Specyfikacje techniczne w układzie 2x4 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 flex-1">
          <div className="flex items-center gap-2">
            <YearIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Rok</div>
              <div className="text-sm font-semibold text-gray-800">{year}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <FuelIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Paliwo</div>
              <div className="text-sm font-semibold text-gray-800">{fuelType}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MileageIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Przebieg</div>
              <div className="text-sm font-semibold text-gray-800">{mileage.toLocaleString('pl-PL')} tys. km</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <PowerIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Moc</div>
              <div className="text-sm font-semibold text-gray-800">{power}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CapacityIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Pojemność</div>
              <div className="text-sm font-semibold text-gray-800">{capacity} cm³</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <GearboxIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Skrzynia</div>
              <div className="text-sm font-semibold text-gray-800">{transmission}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DriveIcon className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Napęd</div>
              <div className="text-sm font-semibold text-gray-800">{drive}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">Pochodzenie</div>
              <div className="text-sm font-semibold text-gray-800">{countryOfOrigin}</div>
            </div>
          </div>
        </div>

        {/* Match score label */}
        {listing.matchLabel && listing.matchLabel !== 'Pozostałe ogłoszenia' && (
          <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded mb-2">
            {listing.matchLabel}
          </div>
        )}
        
        {/* Message (e.g. "Added to favorites") */}
        {message && (
          <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded mb-2">
            {message}
          </div>
        )}
      </div>

      {/* Sprzedawca i lokalizacja */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#35530A]" />
            <div>
              <div className="text-xs text-gray-500">Sprzedawca</div>
              <div className="text-sm font-semibold text-gray-800">{sellerType}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#35530A]" />
            <div>
              <div className="text-xs text-gray-500">Lokalizacja</div>
              <div className="text-sm font-semibold text-gray-800">{city}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cena i przycisk */}
      <div className="bg-[#35530A] px-4 py-3 flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          {price.toLocaleString('pl-PL')} zł
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(listing.id || listing._id);
          }}
          className="bg-white text-[#35530A] px-4 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          Szczegóły
        </button>
      </div>
    </div>
  );
});

export default ListingCard;
