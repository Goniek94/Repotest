import React, { memo } from 'react';
import { Heart } from 'lucide-react';

const ListingCard = memo(({ listing, onNavigate, onFavorite, isFavorite }) => {
  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Skracamy opis do 60 znaków + "..."
  const shortDescription = listing.description
    ? listing.description.slice(0, 60) + (listing.description.length > 60 ? '...' : '')
    : '(dane z tabelek), (+ krótki opis sprzedającego + nagłówka, max 60 znaków)';

  return (
    <div
      // Dodajemy zieloną ramkę, jeśli featured === true
      className={`relative bg-white shadow-sm rounded-sm overflow-hidden flex flex-col h-full ${
        isFeatured ? 'border-2 border-green-600' : ''
      }`}
    >
      {/* Badge wyróżnionej oferty */}
      {isFeatured && (
        <div className="absolute top-2 left-2 bg-green-600 text-white py-1 px-3 rounded-sm z-10 flex items-center">
          <span className="mr-1">★</span>
          <span className="text-xs font-medium">WYRÓŻNIONE</span>
        </div>
      )}

      {/* Zdjęcie */}
      <div className="relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={onNavigate}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/auto-788747_1280.jpg';
          }}
        />

        {/* Przycisk ulubionych */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(listing.id);
          }}
          className="absolute top-2 right-2 p-1 bg-white rounded-full"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'
            }`}
          />
        </button>
      </div>

      {/* Treść karty */}
      <div className="p-4 flex-grow">
        {/* Tytuł */}
        <h3 className="font-bold text-lg text-gray-900 mb-1">
          {listing.title}
        </h3>

        {/* Podtytuł/opis (maks. 60 znaków) */}
        <p className="text-xs text-gray-500 mb-4">
          {shortDescription}
        </p>

        {/* Parametry w jednym poziomym rzędzie z zawijaniem */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {/* Paliwo */}
          <div className="flex items-start">
            <span className="mr-2 text-lg">⛽</span>
            <div>
              <div className="text-sm sm:text-xs text-gray-500">Paliwo</div>
              <div className="text-base font-medium">{listing.fuel}</div>
            </div>
          </div>

          {/* Przebieg */}
          <div className="flex items-start">
            <span className="mr-2 text-lg">🛣️</span>
            <div>
              <div className="text-sm sm:text-xs text-gray-500">Przebieg</div>
              <div className="text-base font-medium">{listing.mileage} km</div>
            </div>
          </div>

          {/* Rok */}
          <div className="flex items-start">
            <span className="mr-2 text-lg">📅</span>
            <div>
              <div className="text-sm sm:text-xs text-gray-500">Rok</div>
              <div className="text-base font-medium">{listing.year}</div>
            </div>
          </div>

          {/* Moc */}
          <div className="flex items-start">
            <span className="mr-2 text-lg">⚡</span>
            <div>
              <div className="text-sm sm:text-xs text-gray-500">Moc</div>
              <div className="text-base font-medium">{listing.power} KM</div>
            </div>
          </div>

          {/* Napęd */}
          <div className="flex items-start">
            <span className="mr-2 text-lg">🚗</span>
            <div>
              <div className="text-sm sm:text-xs text-gray-500">Napęd</div>
              <div className="text-base font-medium">{listing.drive}</div>
            </div>
          </div>

          {/* Lokalizacja */}
          <div className="flex items-start">
            <span className="mr-2 text-lg">📍</span>
            <div>
              <div className="text-sm sm:text-xs text-gray-500">Lokalizacja</div>
              <div className="text-base font-medium">{listing.city}</div>
              <div className="text-sm sm:text-xs text-gray-500">({listing.region})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stopka karty */}
      <div className="mt-auto p-3 flex justify-between items-center">
        {/* Miasto */}
        <div className="flex items-center">
          <span className="text-red-500 mr-1">📍</span>
          <span className="text-sm text-gray-700">{listing.city}</span>
        </div>

        {/* Cena */}
        <div className="bg-gray-900 text-white px-4 py-1 rounded-sm flex items-center">
          <span className="mr-1">💰</span>
          <span className="text-sm font-bold">
            {listing.price.toLocaleString()} zł
          </span>
        </div>
      </div>
    </div>
  );
});

export default ListingCard;