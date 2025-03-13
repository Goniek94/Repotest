import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaGasPump, FaRoad, FaBolt, FaCogs, FaTachometerAlt } from 'react-icons/fa';
import SpecItem from './SpecItem';

const MainFeatureListing = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md rounded-[2px] overflow-hidden flex flex-col cursor-pointer" onClick={() => navigate(`/listing/${listing._id}`)}>
      <div className="relative h-[240px] md:h-[280px]">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover rounded-t-[2px]"
        />
        <div className="absolute top-4 left-4 bg-[#35530A] text-white px-3 py-1 rounded-[2px] text-sm font-medium">
          Wyróżnione
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h2>
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{listing.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <SpecItem icon={<FaCar />} label="Rok" value={listing.year} />
          <SpecItem icon={<FaGasPump />} label="Paliwo" value={listing.fuelType} />
          <SpecItem icon={<FaRoad />} label="Przebieg" value={`${listing.mileage} km`} />
          <SpecItem icon={<FaBolt />} label="Moc" value={`${listing.power} KM`} />
          <SpecItem icon={<FaCogs />} label="Skrzynia" value={listing.transmission} />
          <SpecItem icon={<FaTachometerAlt />} label="Pojemność" value={`${listing.capacity} cm³`} />
        </div>
      </div>

      <div className="bg-[#35530A] text-white px-4 py-3 flex justify-between items-center">
        <span className="text-lg font-bold">{listing.price.toLocaleString('pl-PL')} zł</span>
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