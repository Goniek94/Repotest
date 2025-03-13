import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaGasPump, FaRoad, FaBolt } from 'react-icons/fa';
import SpecItem from './SpecItem';

const SmallListingCard = ({ listing, showHotOffer = false }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md rounded-[2px] overflow-hidden flex flex-col cursor-pointer" onClick={() => navigate(`/listing/${listing._id}`)}>
      <div className="relative h-40">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover rounded-t-[2px]"
        />
        {showHotOffer && (
          <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-1 rounded-[2px] text-xs font-medium">
            Gorąca oferta
          </div>
        )}
      </div>

      <div className="p-3 flex-1">
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
          {listing.description}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <SpecItem icon={<FaCar />} label="Rok" value={listing.year} />
          <SpecItem icon={<FaGasPump />} label="Paliwo" value={listing.fuelType} />
          <SpecItem icon={<FaRoad />} label="Przebieg" value={`${listing.mileage} km`} />
          <SpecItem icon={<FaBolt />} label="Moc" value={`${listing.power} KM`} />
        </div>
      </div>

      <div className="bg-gray-50 px-3 py-2 flex justify-between items-center">
        <span className="text-sm font-bold text-[#35530A]">
          {listing.price.toLocaleString('pl-PL')} zł
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