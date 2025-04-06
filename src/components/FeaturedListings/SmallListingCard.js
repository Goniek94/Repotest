import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaGasPump, FaRoad, FaBolt } from 'react-icons/fa';
import SpecItem from './SpecItem';

const SmallListingCard = ({ listing, showHotOffer = false }) => {
  const navigate = useNavigate();

  // Tworzenie tytułu z pól make i model, jeśli title nie istnieje
  const title = listing.title || `${listing.make || ''} ${listing.model || ''}`;
  
  // Domyślne wartości dla pól, które mogą być undefined
  const description = listing.description || 'Brak opisu';
  const price = listing.price || 0;
  const year = listing.year || new Date().getFullYear();
  const mileage = listing.mileage || 0;
  const fuelType = listing.fuelType || 'Benzyna';
  const power = listing.power || '150 KM';
  
  // Bezpieczny dostęp do obrazu
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : '/images/auto-788747_1280.jpg';

  return (
    <div className="bg-white shadow-md rounded-[2px] overflow-hidden flex flex-col cursor-pointer" onClick={() => navigate(`/listing/${listing._id}`)}>
      <div className="relative h-40">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-t-[2px]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/auto-788747_1280.jpg';
          }}
        />
        {showHotOffer && (
          <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-1 rounded-[2px] text-xs font-medium">
            Gorąca oferta
          </div>
        )}
      </div>

      <div className="p-3 flex-1">
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
          {description}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <SpecItem icon={<FaCar />} label="Rok" value={year} />
          <SpecItem icon={<FaGasPump />} label="Paliwo" value={fuelType} />
          <SpecItem icon={<FaRoad />} label="Przebieg" value={`${mileage} km`} />
          <SpecItem icon={<FaBolt />} label="Moc" value={power} />
        </div>
      </div>

      <div className="bg-gray-50 px-3 py-2 flex justify-between items-center">
        <span className="text-sm font-bold text-[#35530A]">
          {price.toLocaleString('pl-PL')} zł
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/listing/${listing._id}`);
          }}
          className="bg-[#35530A] text-white px-3 py-1 rounded-[2px] text-xs"
        >
          Szczegóły
        </button>
      </div>
    </div>
  );
};

export default SmallListingCard;