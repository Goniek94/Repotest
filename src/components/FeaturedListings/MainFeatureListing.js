import React from 'react';
import { useNavigate } from 'react-router-dom';
import FuelIcon from '../icons/FuelIcon';
import PowerIcon from '../icons/PowerIcon';
import GearboxIcon from '../icons/GearboxIcon';
import MileageIcon from '../icons/MileageIcon';
import DriveIcon from '../icons/DriveIcon';
import YearIcon from '../icons/YearIcon';
import CapacityIcon from '../icons/CapacityIcon';
import { MapPin, User, Globe, Store } from 'lucide-react';
import SpecItem from './SpecItem';
import getImageUrl from '../../utils/responsive/getImageUrl';

const MainFeatureListing = ({ listing }) => {
  const navigate = useNavigate();

  // Sprawdzenie czy listing istnieje
  if (!listing) {
    return null;
  }

  // Tworzenie tytułu z brand/make i model
  const title = `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim();
  
  // Opis z headline lub shortDescription
  const shortDesc = listing.headline || listing.shortDescription || '';
  const price = listing.price || 0;
  const year = listing.year || new Date().getFullYear();
  const mileage = listing.mileage || 0;
  const fuelType = listing.fuelType || 'Benzyna';
  const power = listing.power || '150 KM';
  const transmission = listing.transmission || 'Automatyczna';
  const capacity = listing.capacity || 2000;
  const drive = listing.drive || 'Na przednie koła';
  const sellerType = listing.sellerType || 'Prywatny';
  const city = listing.city || listing.location || 'Polska';
  const countryOfOrigin = listing.countryOfOrigin || (listing.imported === 'Tak' ? 'Import' : 'Polska');

  // Bezpieczny dostęp do obrazu (główne zdjęcie ustawione przez użytkownika)
  let imageUrl = null;

  if (listing.images && listing.images.length > 0) {
    const mainIdx = typeof listing.mainImageIndex === 'number' &&
                    listing.mainImageIndex >= 0 &&
                    listing.mainImageIndex < listing.images.length
      ? listing.mainImageIndex
      : 0;
    imageUrl = getImageUrl(listing.images[mainIdx]);
  } else {
    imageUrl = getImageUrl(null);
  }

  return (
    <div 
      className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-[2px] overflow-hidden flex flex-col cursor-pointer h-full max-w-sm md:max-w-none mx-auto md:mx-0 md:shadow-xl md:shadow-gray-400/50 md:hover:shadow-2xl md:hover:shadow-gray-500/60" 
      onClick={() => navigate(`/listing/${listing._id}`)}
    >
      {/* Zdjęcie - zwiększone na desktopach dla lepszej widoczności */}
      <div className="relative h-40 md:h-[280px] lg:h-[320px]">
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
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-[2px] text-gray-400 text-xl">
            Brak zdjęcia
          </div>
        )}
        <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-1 rounded-[2px] text-xs font-medium shadow-sm md:top-3 md:left-3 md:px-2.5 md:text-sm">
          Wyróżnione
        </div>
      </div>

      {/* Main content section - zmniejszone paddingi */}
      <div className="p-3 md:p-4 lg:p-4 flex-1 flex flex-col bg-white">
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 line-clamp-1">{title}</h2>
        <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2 leading-relaxed">{shortDesc}</p>

        {/* Mobile: Kompaktowy układ - zmniejszone odstępy */}
        <div className="md:hidden space-y-2 mb-3">
          {/* Pierwsza linia */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <YearIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Rok</div>
                <div className="text-[11px] font-bold text-gray-900">{year}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <FuelIcon className="w-2.5 h-2.5 text-gray-600" />
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
                <MileageIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Przebieg</div>
                <div className="text-[11px] font-bold text-gray-900">{Math.round(mileage/1000)} tys. km</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <PowerIcon className="w-2.5 h-2.5 text-gray-600" />
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
                <CapacityIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Pojemność</div>
                <div className="text-[11px] font-bold text-gray-900">{capacity} cm³</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <GearboxIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Skrzynia</div>
                <div className="text-[11px] font-bold text-gray-900">{transmission === 'Automatyczna' ? 'automatyczna' : 'manualna'}</div>
              </div>
            </div>
          </div>

          {/* Czwarta linia */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <DriveIcon className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Napęd</div>
                <div className="text-[11px] font-bold text-gray-900">Tylny</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <Globe className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Pochodzenie</div>
                <div className="text-[11px] font-bold text-gray-900">{countryOfOrigin}</div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 my-2"></div>
          
          {/* Piąta linia - pod separatorem */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <User className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Sprzedawca</div>
                <div className="text-[11px] font-bold text-gray-900">prywatny</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-full flex-shrink-0">
                <MapPin className="w-2.5 h-2.5 text-gray-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500 font-medium">Lokalizacja</div>
                <div className="text-[11px] font-bold text-gray-900 truncate">{city}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Oryginalny układ specyfikacji */}
        <div className="hidden md:block space-y-2 mt-auto mb-0">
          <div className="grid grid-cols-2 gap-x-3">
            <SpecItem icon={<YearIcon className="w-5 h-5" />} label="Rok" value={year} />
            <SpecItem icon={<FuelIcon className="w-5 h-5" />} label="Paliwo" value={fuelType} />
          </div>
          <div className="grid grid-cols-2 gap-x-3">
            <SpecItem icon={<MileageIcon className="w-5 h-5" />} label="Przebieg" value={`${mileage.toLocaleString('pl-PL')} km`} />
            <SpecItem icon={<PowerIcon className="w-5 h-5" />} label="Moc" value={power} />
          </div>
          <div className="grid grid-cols-2 gap-x-3">
            <SpecItem icon={<GearboxIcon className="w-5 h-5" />} label="Skrzynia" value={transmission} />
            <SpecItem icon={<DriveIcon className="w-5 h-5" />} label="Napęd" value={drive} />
          </div>
          <div className="grid grid-cols-2 gap-x-3">
            <SpecItem icon={<CapacityIcon className="w-5 h-5" />} label="Pojemność" value={`${capacity} cm³`} />
            <SpecItem icon={<Globe className="w-5 h-5" />} label="Kraj pochodzenia" value={countryOfOrigin} />
          </div>
        </div>
      </div>

      {/* Location and Seller section - hidden on mobile, visible on desktop */}
      <div className="hidden md:block px-3 sm:px-4 md:px-4 py-2 sm:py-3 bg-white border-t border-gray-100">
        <div className="grid grid-cols-2 gap-x-4">
          <SpecItem icon={<MapPin className="w-5 h-5" />} label="Lokalizacja" value={city} />
          <SpecItem icon={<User className="w-5 h-5" />} label="Sprzedawca" value={sellerType} />
        </div>
      </div>

      {/* Price section - zmniejszony */}
      <div className="bg-[#35530A] text-white px-3 py-2.5 md:px-4 lg:px-4 md:py-2.5 lg:py-3 flex justify-between items-center border-t border-[#2A4208] md:border-t">
        <span className="text-base md:text-lg lg:text-xl font-bold">{price.toLocaleString('pl-PL')} zł</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/listing/${listing._id}`);
          }}
          className="bg-white text-[#35530A] px-3 py-1.5 md:px-3 lg:px-4 md:py-1 lg:py-1.5 rounded-[2px] text-xs md:text-sm font-medium md:font-semibold hover:bg-gray-100 transition-colors"
        >
          Szczegóły
        </button>
      </div>
    </div>
  );
};

export default MainFeatureListing;
