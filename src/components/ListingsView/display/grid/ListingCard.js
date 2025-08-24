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
import SpecItem from '../../../FeaturedListings/SpecItem';
import getImageUrl from '../../../../utils/responsive/getImageUrl';

const ListingCard = memo(({ listing, onNavigate, onFavorite, isFavorite, message }) => {
  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Tworzenie tytułu z brand/make i model
  const title = `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim();
  
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

  // Dodatkowy opis
  const description = listing.headline || listing.shortDescription || (listing.description ? listing.description.substring(0, 60) + (listing.description.length > 60 ? '...' : '') : '');

  return (
    <div 
      className="bg-white shadow-xl shadow-gray-400/50 hover:shadow-2xl hover:shadow-gray-500/60 rounded-[2px] overflow-hidden flex flex-col cursor-pointer h-full transition-shadow duration-200 w-full relative" 
      onClick={() => onNavigate(listing.id || listing._id)}
    >
      {/* Zdjęcie */}
      <div className="relative h-36">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-t-[2px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/auto-788747_1280.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded-t-[2px]">
            Brak zdjęcia
          </div>
        )}
        
        {/* Badge wyróżnionej oferty */}
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-1 rounded-[2px] text-xs font-medium">
            Wyróżnione
          </div>
        )}

        {/* Przycisk ulubionych */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(listing.id || listing._id);
          }}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'
            }`}
          />
        </button>
      </div>

      {/* Tytuł i opis */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          {description || 'Ogłoszenie: ' + title}
        </p>
        
        {/* Spacer - przesuwa specyfikacje w dół */}
        <div className="flex-1"></div>
        
        {/* Specyfikacje w 2 kolumny - bliżej separatora, mniejsze odstępy */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-1">
          {/* Używamy inline komponentów zamiast SpecItem dla lepszej kontroli */}
          <div className="flex items-center gap-1.5">
            <YearIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Rok</div>
              <div className="text-xs font-medium text-gray-800">{year}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <FuelIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Paliwo</div>
              <div className="text-xs font-medium text-gray-800">{fuelType}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <MileageIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Przebieg</div>
              <div className="text-xs font-medium text-gray-800">{mileage.toLocaleString('pl-PL')} km</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <PowerIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Moc</div>
              <div className="text-xs font-medium text-gray-800">{power}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <CapacityIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Pojemność</div>
              <div className="text-xs font-medium text-gray-800">{capacity} cm³</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <GearboxIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Skrzynia</div>
              <div className="text-xs font-medium text-gray-800">{transmission}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <DriveIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Napęd</div>
              <div className="text-xs font-medium text-gray-800">{drive}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Pochodzenie</div>
              <div className="text-xs font-medium text-gray-800">{countryOfOrigin}</div>
            </div>
          </div>
        </div>

        {/* Match score label */}
        {listing.matchLabel && listing.matchLabel !== 'Pozostałe ogłoszenia' && (
          <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-sm mt-1">
            {listing.matchLabel}
          </div>
        )}
        
        {/* Message (e.g. "Added to favorites") */}
        {message && (
          <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-sm mt-1">
            {message}
          </div>
        )}
      </div>

      {/* Sprzedawca i lokalizacja - białe tło */}
      <div className="bg-white px-3 py-2 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-x-3">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-[#35530A]" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Sprzedawca</div>
              <div className="text-xs font-semibold text-gray-800">{sellerType}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#35530A]" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Lokalizacja</div>
              <div className="text-xs font-semibold text-gray-800">{city}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cena i przycisk - zielone tło */}
      <div className="bg-[#35530A] px-3 py-3 flex justify-between items-center">
        <div className="text-white">
          <div className="text-xs font-medium opacity-80">Cena</div>
          <div className="text-lg font-bold">
            {price.toLocaleString('pl-PL')} zł
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(listing.id || listing._id);
          }}
          className="bg-white text-[#35530A] px-3 py-1.5 rounded-[2px] text-xs font-semibold hover:bg-gray-100 transition-colors shadow-sm"
        >
          Szczegóły
        </button>
      </div>
    </div>
  );
});

export default ListingCard;
