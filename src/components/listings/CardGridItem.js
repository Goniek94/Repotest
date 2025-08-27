import React from "react";
import { Heart } from "lucide-react";
import { formatVehicleTitle } from '../../utils/formatters';

/**
 * CardGridItem - komponent karty dla widoku siatki, bazujący na ListingCard
 * Props:
 * - listing: object (dane ogłoszenia)
 * - onNavigate: function (nawigacja do szczegółów)
 * - onFavorite: function (dodawanie/usuwanie z ulubionych)
 * - isFavorite: boolean (czy jest w ulubionych)
 */
const CardGridItem = ({ listing, onNavigate, onFavorite, isFavorite }) => {
  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Formatowanie ceny
  const formattedPrice = typeof listing.price === 'number'
    ? listing.price.toLocaleString('pl-PL') + ' zł'
    : listing.price;

  return (
    <div 
      className={`bg-white shadow-sm rounded-[2px] overflow-hidden flex flex-col max-h-[380px] cursor-pointer
                  ${isFeatured ? 'border-l-4 border-[#35530A]' : 'border border-gray-200'}`}
      onClick={onNavigate}
    >
      {/* Zdjęcie */}
      <div className="relative">
        <img
          src={listing.image}
          alt={listing.title || formatVehicleTitle(listing)}
          className="w-full h-40 object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.jpg';
            e.target.classList.add('opacity-50');
          }}
        />
        
        {/* Badge wyróżnionej oferty */}
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-[#35530A] text-white py-1 px-2 text-xs flex items-center rounded-[2px]">
            <span className="mr-1">★</span>
            <span className="font-medium">WYRÓŻNIONE</span>
          </div>
        )}
        
        {/* Przycisk ulubionych */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(listing._id || listing.id);
          }}
          className="absolute top-2 right-2 p-1 bg-white rounded-full"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'
            }`}
          />
        </button>
      </div>
      
      {/* Treść karty */}
      <div className="p-2.5">
        <h3 className="font-bold text-base sm:text-sm text-gray-900 mb-1">
          {listing.title || formatVehicleTitle(listing)}
        </h3>
        
        <div className="text-xs text-gray-600 mb-2.5">
          {[
            listing.year, 
            listing.mileage && `${listing.mileage} km`, 
            listing.fuelType || listing.fuel,
            listing.power
          ].filter(Boolean).join(' • ')}
        </div>
        
        {/* Parametry w dwóch kolumnach */}
        <div className="grid grid-cols-2 gap-y-1.5 mb-3">
          {/* Paliwo */}
          {(listing.fuelType || listing.fuel) && (
            <div className="flex items-start">
              <span className="mr-1 text-xs">⛽</span>
              <div>
                <div className="text-xs text-gray-500">Paliwo</div>
                <div className="font-medium text-xs">{listing.fuelType || listing.fuel}</div>
              </div>
            </div>
          )}
          
          {/* Przebieg */}
          {listing.mileage && (
            <div className="flex items-start">
              <span className="mr-1 text-xs">🛣️</span>
              <div>
                <div className="text-xs text-gray-500">Przebieg</div>
                <div className="font-medium text-xs">{listing.mileage} km</div>
              </div>
            </div>
          )}
          
          {/* Rok produkcji */}
          {listing.year && (
            <div className="flex items-start">
              <span className="mr-1 text-xs">📅</span>
              <div>
                <div className="text-xs text-gray-500">Rok</div>
                <div className="font-medium text-xs">{listing.year}</div>
              </div>
            </div>
          )}
          
          {/* Moc */}
          {listing.power && (
            <div className="flex items-start">
              <span className="mr-1 text-xs">⚡</span>
              <div>
                <div className="text-xs text-gray-500">Moc</div>
                <div className="font-medium text-xs">{listing.power}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Stopka karty */}
      <div className="px-2.5 py-1.5 mt-auto flex justify-between items-center border-t border-gray-100">
        {/* Lokalizacja - tylko miasto bez województwa */}
        <div className="flex items-center">
          <span className="text-[#35530A] mr-1 text-xs">📍</span>
          <span className="text-xs text-gray-700">{listing.city || (listing.location ? listing.location.split('(')[0].trim() : '')}</span>
        </div>
        
        {/* Cena */}
        <div className="bg-[#35530A] text-white px-2.5 py-1 rounded-[2px] text-sm font-bold">
          {formattedPrice}
        </div>
      </div>
    </div>
  );
};

export default CardGridItem;
