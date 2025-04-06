import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaGasPump, FaRoad, FaBolt, FaCogs, FaTachometerAlt } from 'react-icons/fa';
import SpecItem from './SpecItem';

const MainFeatureListing = ({ listing }) => {
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
  const transmission = listing.transmission || 'Automatyczna';
  const capacity = listing.capacity || 2000;
  
  // Bezpieczny dostęp do obrazu
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : '/images/auto-788747_1280.jpg';

  return (
    <div className="bg-white shadow-md rounded-[2px] overflow-hidden flex flex-col cursor-pointer" onClick={() => navigate(`/listing/${listing._id}`)}>
      <div className="relative h-[240px] md:h-[280px]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-t-[2px]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/auto-788747_1280.jpg';
          }}
        />
        <div className="absolute top-4 left-4 bg-[#35530A] text-white px-3 py-1 rounded-[2px] text-sm font-medium">
          Wyróżnione
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{description}</p>

        <div className="grid grid-cols-2 gap-4">
          <SpecItem icon={<FaCar />} label="Rok" value={year} />
          <SpecItem icon={<FaGasPump />} label="Paliwo" value={fuelType} />
          <SpecItem icon={<FaRoad />} label="Przebieg" value={`${mileage} km`} />
          <SpecItem icon={<FaBolt />} label="Moc" value={power} />
          <SpecItem icon={<FaCogs />} label="Skrzynia" value={transmission} />
          <SpecItem icon={<FaTachometerAlt />} label="Pojemność" value={`${capacity} cm³`} />
        </div>
      </div>

      <div className="bg-[#35530A] text-white px-4 py-3 flex justify-between items-center">
        <span className="text-lg font-bold">{price.toLocaleString('pl-PL')} zł</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/listing/${listing._id}`);
          }}
          className="bg-white text-[#35530A] px-4 py-1.5 rounded-[2px] font-semibold"
        >
          Szczegóły
        </button>
      </div>
    </div>
  );
};

export default MainFeatureListing;