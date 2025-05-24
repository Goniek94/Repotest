import React from "react";
import { Heart, Eye, Edit, Trash } from "lucide-react";

/**
 * Card for a single listing.
 * Props:
 * - listing: object (listing data)
 * - onFavorite, onEdit, onDelete: function
 * - calculateDaysRemaining: function
 */
const ListingCard = ({ listing, onFavorite, onEdit, onDelete, calculateDaysRemaining }) => (
  <div className="border border-gray-200 rounded-sm overflow-hidden">
    <div className="flex flex-col md:flex-row">
      {/* Image */}
      <div className="relative md:w-64 h-48 bg-gray-100">
        {listing.image ? (
          <img 
            src={listing.image} 
            alt={listing.title}
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.jpg';
              e.target.classList.add('opacity-50');
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Brak zdjęcia</span>
          </div>
        )}
        {listing.featured && (
          <div className="absolute top-2 left-0 bg-yellow-500 text-white px-2 py-1 text-xs flex items-center">
            <span className="mr-1">★</span> Wyróżnione
          </div>
        )}
      </div>
      {/* Info */}
      <div className="flex-grow p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">{listing.title}</h2>
            <div className="inline-block bg-[#35530A] text-white px-2 py-1 mb-3 font-bold">
              {listing.price}
            </div>
            <div className="text-sm text-gray-600">
              {listing.year} • {listing.mileage} • {listing.fuelType} • {listing.power}
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <span className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs mb-2">
              {listing.status}
            </span>
            {listing.status === "Aktywne" && (
              <div className="mt-2 bg-blue-50 px-3 py-2 rounded-sm border border-blue-100">
                <span className="text-sm font-medium text-blue-700">
                  Pozostało <span className="text-lg font-bold">{calculateDaysRemaining(listing.dateAdded)}</span> dni
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Stats & actions */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center text-xs text-gray-500">
            <Eye className="w-4 h-4 mr-1" /> {listing.views} wyświetleń
            <span className="mx-2">•</span>
            Dodano: {listing.dateAdded}
          </div>
          <div className="flex space-x-3">
            <button onClick={() => onFavorite(listing.id)} className="text-yellow-500">
              <Heart className="w-5 h-5" />
            </button>
            <button onClick={() => onEdit(listing.id)} className="text-blue-500">
              <Edit className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(listing.id)} className="text-red-500">
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ListingCard;
