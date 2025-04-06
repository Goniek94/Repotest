import React, { memo } from 'react';
import { 
  MapPin, 
  Heart,
  Fuel,
  Calendar,
  Gauge,
  Power,
  Car,
  Box,
  Cog,
  User,
  Medal
} from 'lucide-react';

const ListItem = memo(({ 
  listing, 
  onNavigate, 
  onFavorite, 
  isFavorite, 
  message 
}) => {
  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  return (
    <div
      onClick={() => onNavigate(listing.id)}
      className={`bg-white rounded-[2px] shadow-md overflow-hidden cursor-pointer 
                  hover:shadow-xl transition-all duration-300 relative group
                  ${isFeatured ? 'border-l-4 border-[#35530A]' : 'border border-gray-200'}`}
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Zdjęcie */}
        <div className="w-full sm:w-[420px] h-[240px] sm:h-[280px] relative overflow-hidden">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/auto-788747_1280.jpg';
            }}
          />
          {/* Serduszko na zdjęciu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(listing.id);
            }}
            className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform duration-200 
                     bg-white rounded-full shadow-lg z-10"
          >
            <Heart
              className={`w-6 h-6 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'}`}
            />
          </button>
          {isFeatured && (
            <div className="absolute top-3 left-3 bg-[#35530A] text-white px-3 py-1.5 text-sm rounded-[2px] font-medium flex items-center gap-1.5 shadow-lg">
              <Medal className="w-4 h-4" />
              WYRÓŻNIONE
            </div>
          )}
        </div>

        {/* Główne informacje */}
        <div className="flex-grow p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-1">{listing.title}</h3>
            <p className="text-gray-600">{listing.subtitle}</p>
          </div>

          {/* Parametry w grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Fuel className="w-5 h-5 text-[#35530A]" />
                <div>
                  <div className="text-sm text-gray-500">Paliwo</div>
                  <div className="font-medium">{listing.fuel}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <Gauge className="w-5 h-5 text-[#35530A]" />
                <div>
                  <div className="text-sm text-gray-500">Przebieg</div>
                  <div className="font-medium">{listing.mileage}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Box className="w-5 h-5 text-[#35530A]" />
                <div>
                  <div className="text-sm text-gray-500">Pojemność</div>
                  <div className="font-medium">{listing.engineCapacity}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-[#35530A]" />
                <div>
                  <div className="text-sm text-gray-500">Rok</div>
                  <div className="font-medium">{listing.year}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Power className="w-5 h-5 text-[#35530A]" />
                <div>
                  <div className="text-sm text-gray-500">Moc</div>
                  <div className="font-medium">{listing.power}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-[#35530A]" />
                <div>
                  <div className="text-sm text-gray-500">Sprzedawca</div>
                  <div className="font-medium text-[#35530A]">{listing.sellerType}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Car className="w-5 h-5 text-[#35530A]" />
              <div>
                <div className="text-sm text-gray-500">Napęd</div>
                <div className="font-medium">{listing.drive}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prawa kolumna */}
        <div className="w-full sm:w-[220px] p-5 flex flex-col justify-between bg-gray-50">
          {/* Cena */}
          <div className="bg-[#35530A] rounded-[2px] p-5 shadow-md">
            <div className="text-white text-sm mb-2">Cena</div>
            <div className="text-3xl font-bold text-white tracking-tight">
              {listing.price.toLocaleString('pl-PL')} zł
            </div>
          </div>

          {/* Lokalizacja */}
          <div className="flex items-center gap-2 text-gray-700 mt-auto">
            <MapPin className="w-5 h-5 text-[#35530A]" />
            <div>
              <div className="text-sm text-gray-500">Lokalizacja</div>
              <div className="font-medium">
                {listing.city}
                <div className="text-sm text-gray-500">({listing.location})</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white text-sm px-3 py-1.5 rounded-[2px]">
          {message}
        </div>
      )}
    </div>
  );
});

export default ListItem;