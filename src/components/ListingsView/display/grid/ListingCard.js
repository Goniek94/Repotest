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
      className={`bg-white shadow-sm hover:shadow-md overflow-hidden flex flex-col cursor-pointer h-full min-h-[380px] transition-all duration-200 w-full relative ${
        isFeatured ? 'border-2 border-[#35530A] rounded-[2px]' : 'border border-gray-200 hover:border-gray-300 rounded-[2px]'
      }`}
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
          <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-1 text-xs font-medium" style={{borderRadius: '2px'}}>
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
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {description || 'Ogłoszenie: ' + title}
        </p>
        
        {/* Spacer - przesuwa specyfikacje w dół */}
        <div className="flex-1"></div>
        
        {/* Dodatkowy spacer dla większego przesunięcia w dół */}
        <div className="mt-4"></div>
        
        {/* Specyfikacje w 2 kolumny z odpowiednim odstępem */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-0">
          <SpecItem icon={<YearIcon className="w-3 h-3" />} label="Rok" value={year} />
          <SpecItem icon={<FuelIcon className="w-3 h-3" />} label="Paliwo" value={fuelType} />
          <SpecItem icon={<MileageIcon className="w-3 h-3" />} label="Przebieg" value={`${mileage.toLocaleString('pl-PL')} km`} />
          <SpecItem icon={<PowerIcon className="w-3 h-3" />} label="Moc" value={power} />
          <SpecItem icon={<CapacityIcon className="w-3 h-3" />} label="Pojemność" value={`${capacity} cm³`} />
          <SpecItem icon={<GearboxIcon className="w-3 h-3" />} label="Skrzynia" value={transmission} />
          <SpecItem icon={<DriveIcon className="w-3 h-3" />} label="Napęd" value={drive} />
          <SpecItem icon={<Globe className="w-3 h-3" />} label="Pochodzenie" value={countryOfOrigin} />
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
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-[#35530A]" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Sprzedawca</div>
              <div className="text-xs font-semibold text-gray-800">{sellerType}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-[#35530A]" />
            </div>
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
