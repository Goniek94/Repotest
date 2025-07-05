import React from 'react';
import { useNavigate } from 'react-router-dom';
import FuelIcon from '../icons/FuelIcon';
import PowerIcon from '../icons/PowerIcon';
import GearboxIcon from '../icons/GearboxIcon';
import MileageIcon from '../icons/MileageIcon';
import DriveIcon from '../icons/DriveIcon';
import YearIcon from '../icons/YearIcon';
import CapacityIcon from '../icons/CapacityIcon';
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
      className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-[2px] overflow-hidden flex flex-col cursor-pointer h-full" 
      onClick={() => navigate(`/listing/${listing._id}`)}
    >
      {/* Zdjęcie - dostosowane do różnych ekranów */}
      <div className="relative h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px]">
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
        <div className="absolute top-3 left-3 bg-[#35530A] text-white px-2.5 py-1 rounded-[2px] text-sm font-medium shadow-sm">
          Wyróżnione
        </div>
      </div>

      {/* Informacje i specyfikacja */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 line-clamp-1">{title}</h2>
        <p className="text-sm text-gray-700 mb-3 sm:mb-4 line-clamp-2 h-10">{shortDesc}</p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 mt-auto">
          <SpecItem icon={<YearIcon className="w-4 h-4" />} label="Rok" value={year} />
          <SpecItem icon={<FuelIcon className="w-4 h-4" />} label="Paliwo" value={fuelType} />
          <SpecItem icon={<MileageIcon className="w-4 h-4" />} label="Przebieg" value={`${mileage} km`} />
          <SpecItem icon={<PowerIcon className="w-4 h-4" />} label="Moc" value={power} />
          <SpecItem icon={<GearboxIcon className="w-4 h-4" />} label="Skrzynia" value={transmission} />
          <SpecItem icon={<DriveIcon className="w-4 h-4" />} label="Napęd" value={drive} />
        </div>
      </div>

      {/* Pasek ceny i przycisku */}
      <div className="bg-[#35530A] text-white px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center border-t border-[#2A4208]">
        <span className="text-base sm:text-lg font-bold">{price.toLocaleString('pl-PL')} zł</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/listing/${listing._id}`);
          }}
          className="bg-white text-[#35530A] px-3 sm:px-4 py-1 sm:py-1.5 rounded-[2px] text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          Szczegóły
        </button>
      </div>
    </div>
  );
};

export default MainFeatureListing;
