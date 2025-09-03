import React from 'react';
import { useNavigate } from 'react-router-dom';
import YearIcon from '../icons/YearIcon';
import FuelIcon from '../icons/FuelIcon';
import MileageIcon from '../icons/MileageIcon';
import PowerIcon from '../icons/PowerIcon';
import GearboxIcon from '../icons/GearboxIcon';
import CapacityIcon from '../icons/CapacityIcon';
import DriveIcon from '../icons/DriveIcon';
import { MapPin, User, Globe } from 'lucide-react';
import SpecItem from './SpecItem';
import getImageUrl from '../../utils/responsive/getImageUrl';

const SmallListingCard = ({ listing, showHotOffer = false }) => {
  const navigate = useNavigate();

  // Function to format title for two lines (up to 120 characters)
  const formatTitle = (title) => {
    if (!title) return '';
    // Allow up to 120 characters, will wrap naturally to two lines
    return title.length > 120 ? title.substring(0, 120) + '...' : title;
  };

  // Sprawdzenie czy listing istnieje
  if (!listing) {
    return null;
  }

  // Tworzenie tytułu z brand/make i model (zawsze na górze)
  const brandModel = `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim();
  // Nagłówek z formularza (wyświetlany pod marką i modelem)
  const headline = listing.headline || '';
  
  const price = listing.price || 0;
  const year = listing.year || new Date().getFullYear();
  const mileage = listing.mileage || 0;
  const fuelType = listing.fuelType || 'Benzyna';
  const power = listing.power || '150';
  const capacity = listing.engineSize || listing.engineCapacity || listing.capacity || 2000;
  const transmission = listing.transmission || 'manualna';
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

  // Dodatkowy opis (jeśli jest)
  const description = listing.description ? listing.description.substring(0, 60) + (listing.description.length > 60 ? '...' : '') : '';

  return (
    <div 
      className="bg-white shadow-xl shadow-gray-400/50 hover:shadow-2xl hover:shadow-gray-500/60 rounded-[2px] overflow-hidden flex flex-col cursor-pointer h-full transition-shadow duration-200 w-full" 
      onClick={() => navigate(`/listing/${listing._id}`)}
    >
      {/* Zdjęcie - zwiększone na mobilnych */}
      <div className="relative h-48 sm:h-40 md:h-36">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={brandModel}
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
        {showHotOffer && (
          <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-1 text-xs font-medium" style={{borderRadius: '2px'}}>
            Gorąca oferta
          </div>
        )}
      </div>

      {/* Tytuł - zwiększone rozmiary na mobilnych */}
      <div className="p-3 sm:p-3 flex-1 flex flex-col">
        {/* Marka i model - zawsze na górze */}
        <h3 className="text-base sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
          {brandModel}
        </h3>
        
        {/* Nagłówek z formularza - pod marką i modelem */}
        {headline && (
          <h4 
            className="text-xs sm:text-xs font-medium text-gray-700 mb-3 sm:mb-2 leading-relaxed" 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
              hyphens: 'auto',
              minHeight: '2.5rem',
              lineHeight: '1.25rem'
            }}
          >
            {formatTitle(headline)}
          </h4>
        )}
        
        {/* Specyfikacje w 2 kolumny z odpowiednim odstępem - zwiększone ikony na mobilnych */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 sm:gap-y-1.5 mb-2 mt-6 sm:mt-5">
          <SpecItem icon={<YearIcon className="w-4 h-4 sm:w-3 sm:h-3" />} label="Rok" value={year} />
          <SpecItem icon={<FuelIcon className="w-4 h-4 sm:w-3 sm:h-3" />} label="Paliwo" value={fuelType} />
          <SpecItem icon={<MileageIcon className="w-4 h-4 sm:w-3 sm:h-3" />} label="Przebieg" value={`${mileage.toLocaleString('pl-PL')} km`} />
          <SpecItem icon={<PowerIcon className="w-4 h-4 sm:w-3 sm:h-3" />} label="Moc" value={power} />
          <SpecItem icon={<CapacityIcon className="w-4 h-4 sm:w-3 sm:h-3" />} label="Pojemność" value={`${capacity} cm³`} />
          <SpecItem icon={<GearboxIcon className="w-4 h-4 sm:w-3 sm:h-3" />} label="Skrzynia" value={transmission} />
          <SpecItem icon={<DriveIcon className="w-4 h-4 sm:w-3 sm:h-3" />} label="Napęd" value={drive} />
          <SpecItem icon={<Globe className="w-4 h-4 sm:w-3 sm:h-3" />} label="Pochodzenie" value={countryOfOrigin} />
        </div>
        
      </div>

      {/* Sprzedawca i lokalizacja - białe tło - zwiększone na mobilnych */}
      <div className="bg-white px-3 py-2.5 sm:py-2 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-x-3">
          <div className="flex items-center gap-2 sm:gap-1.5">
            <User className="w-4 h-4 sm:w-3 sm:h-3 text-gray-800" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Sprzedawca</div>
              <div className="text-sm sm:text-xs font-semibold text-gray-800">{sellerType}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-1.5">
            <MapPin className="w-4 h-4 sm:w-3 sm:h-3 text-gray-800" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Lokalizacja</div>
              <div className="text-sm sm:text-xs font-semibold text-gray-800">{city}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cena i przycisk - zielone tło - zwiększone na mobilnych */}
      <div className="bg-[#35530A] px-3 py-4 sm:py-3 flex justify-between items-center">
        <div className="text-white">
          <div className="text-sm sm:text-xs font-medium opacity-80">Cena</div>
          <div className="text-xl sm:text-lg font-bold">
            {price.toLocaleString('pl-PL')} zł
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/listing/${listing._id}`);
          }}
          className="bg-white text-[#35530A] px-4 py-2 sm:px-3 sm:py-1.5 rounded-[2px] text-sm sm:text-xs font-semibold hover:bg-gray-100 transition-colors shadow-sm"
        >
          Szczegóły
        </button>
      </div>
    </div>
  );
};

export default SmallListingCard;
