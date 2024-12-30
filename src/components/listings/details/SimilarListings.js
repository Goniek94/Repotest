// src/components/listings/details/SimilarListings.js
import React from 'react';

const SimilarListings = ({ listings }) => {
  return (
    <div className="mt-12 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Podobne ogłoszenia</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
              <p className="text-green-600 font-bold mb-2">{listing.price}</p>
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
