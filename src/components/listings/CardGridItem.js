import React from "react";
import { Heart } from "lucide-react";

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
      className={`bg-white shadow-sm rounded-sm overflow-hidden flex flex-col max-h-[450px] cursor-pointer
                  ${isFeatured ? 'border-l-4 border-[#35530A]' : 'border border-gray-200'}`}
      onClick={onNavigate}
    >
      {/* Zdjęcie */}
      <div className="relative">
        <img
          src={listing.image}
          alt={listing.title || `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim()}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.jpg';
            e.target.classList.add('opacity-50');
          }}
        />
        
        {/* Badge wyróżnionej oferty */}
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-[#35530A] text-white py-1 px-2 text-xs flex items-center">
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
      <div className="p-3">
        <h3 className="font-bold text-lg sm:text-base text-gray-900 mb-1">
          {listing.title || `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim()}
        </h3>
        
        <div className="text-sm sm:text-xs text-gray-600 mb-3">
          {[
            listing.year, 
            listing.mileage && `${listing.mileage} km`, 
            listing.fuelType || listing.fuel,
            listing.power
          ].filter(Boolean).join(' • ')}
        </div>
        
        {/* Parametry w dwóch kolumnach */}
        <div className="grid grid-cols-2 gap-y-2 mb-4">
          {/* Paliwo */}
          {(listing.fuelType || listing.fuel) && (
            <div className="flex items-start">
              <span className="mr-1.5 text-sm">⛽</span>
              <div>
                <div className="text-sm text-gray-500">Paliwo</div>
                <div className="font-medium text-sm">{listing.fuelType || listing.fuel}</div>
              </div>
            </div>
          )}
          
          {/* Przebieg */}
          {listing.mileage && (
            <div className="flex items-start">
              <span className="mr-1.5 text-sm">🛣️</span>
              <div>
                <div className="text-sm text-gray-500">Przebieg</div>
                <div className="font-medium text-sm">{listing.mileage} km</div>
              </div>
            </div>
          )}
          
          {/* Rok produkcji */}
          {listing.year && (
            <div className="flex items-start">
              <span className="mr-1.5 text-sm">📅</span>
              <div>
                <div className="text-sm text-gray-500">Rok</div>
                <div className="font-medium text-sm">{listing.year}</div>
              </div>
            </div>
          )}
          
          {/* Moc */}
          {listing.power && (
            <div className="flex items-start">
              <span className="mr-1.5 text-sm">⚡</span>
              <div>
                <div className="text-sm text-gray-500">Moc</div>
                <div className="font-medium text-sm">{listing.power}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Stopka karty */}
      <div className="px-3 py-2 mt-auto flex justify-between items-center border-t border-gray-100">
        {/* Lokalizacja - tylko miasto bez województwa */}
        <div className="flex items-center">
          <span className="text-[#35530A] mr-1 text-sm">📍</span>
          <span className="text-sm text-gray-700">{listing.city || (listing.location ? listing.location.split('(')[0].trim() : '')}</span>
        </div>
        
        {/* Cena */}
        <div className="bg-[#35530A] text-white px-3 py-1 rounded-sm text-base sm:text-sm font-bold">
          {formattedPrice}
        </div>
      </div>
    </div>
  );
};

export default CardGridItem;
