import React from 'react';
import { useNavigate } from 'react-router-dom';
import YearIcon from '../icons/YearIcon';
import FuelIcon from '../icons/FuelIcon';
import MileageIcon from '../icons/MileageIcon';
import PowerIcon from '../icons/PowerIcon';
import GearboxIcon from '../icons/GearboxIcon';
import CapacityIcon from '../icons/CapacityIcon';
import SpecItem from './SpecItem';
import getImageUrl from '../../utils/responsive/getImageUrl';

const SmallListingCard = ({ listing, showHotOffer = false }) => {
  const navigate = useNavigate();

  // Sprawdzenie czy listing istnieje
  if (!listing) {
    return null;
  }

  // Tworzenie tytułu z brand/make i model
  const title = `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim();
  
  const price = listing.price || 0;
  const year = listing.year || new Date().getFullYear();
  const mileage = listing.mileage || 0;
  const fuelType = listing.fuelType || 'Benzyna';
  const power = listing.power || '150';
  const capacity = listing.capacity || 2000;
  const transmission = listing.transmission || 'manualna';
  
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
      className="bg-white shadow-md rounded-[2px] overflow-hidden flex flex-col cursor-pointer h-full hover:shadow-lg transition-shadow duration-200 min-w-[260px]" 
      onClick={() => navigate(`/listing/${listing._id}`)}
    >
      {/* Zdjęcie */}
      <div className="relative h-48">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/auto-788747_1280.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
            Brak zdjęcia
          </div>
        )}
        {showHotOffer && (
          <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-1 rounded-[2px] text-xs font-medium">
            Gorąca oferta
          </div>
        )}
      </div>

      {/* Tytuł i opis */}
      <div className="p-4 flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {description || 'Ogłoszenie: ' + title}
        </p>
        
        {/* Specyfikacje w 2 kolumny z odpowiednim odstępem */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          <SpecItem icon={<YearIcon className="w-4 h-4" />} label="Rok" value={year} />
          <SpecItem icon={<FuelIcon className="w-4 h-4" />} label="Paliwo" value={fuelType} />
          <SpecItem icon={<MileageIcon className="w-4 h-4" />} label="Przebieg" value={`${mileage.toLocaleString('pl-PL')} km`} />
          <SpecItem icon={<PowerIcon className="w-4 h-4" />} label="Moc" value={power} />
          <SpecItem icon={<CapacityIcon className="w-4 h-4" />} label="Pojemność" value={`${capacity} cm³`} />
          <SpecItem icon={<GearboxIcon className="w-4 h-4" />} label="Skrzynia" value={transmission} />
        </div>
      </div>

      {/* Cena i przycisk */}
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
        <span className="text-base font-bold text-[#35530A]">
          {price.toLocaleString('pl-PL')} zł
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/listing/${listing._id}`);
          }}
          className="bg-[#35530A] text-white px-3 py-1.5 rounded-[2px] text-sm font-semibold hover:bg-[#2A4208] transition-colors"
        >
          Szczegóły
        </button>
      </div>
    </div>
  );
};

export default SmallListingCard;
