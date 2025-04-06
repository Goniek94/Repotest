import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimilarListings = ({ listings = [] }) => {
  const navigate = useNavigate();
  
  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-white rounded-sm shadow-md p-6">
      <h2 className="text-2xl font-bold text-black mb-6">Podobne ogłoszenia</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="border rounded-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/listing/${listing.id}`)}
          >
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
              <p className="text-[#35530A] font-bold mb-2">{listing.price}</p>
              <div className="text-sm text-gray-500">
                <p>{listing.year} • {listing.mileage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarListings;