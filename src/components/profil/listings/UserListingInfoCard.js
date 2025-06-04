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
  User,
  Medal,
  Edit,
  Trash,
  RefreshCw,
  Eye,
  Clock
} from 'lucide-react';

/**
 * User's listing card in a compact format for profile section
 * Similar to ListingListItem but with additional user actions
 */
const UserListingInfoCard = memo(({ 
  listing, 
  onNavigate, 
  onEdit,
  onDelete,
  onExtend,
  onEnd,
  onFavorite, 
  isFavorite, 
  message 
}) => {
  // Sprawdzamy, czy ogłoszenie jest wyróżnione
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';
  
  // Obliczanie pozostałych dni ważności ogłoszenia
  const getDaysRemaining = () => {
    if (listing.daysRemaining !== undefined) return listing.daysRemaining;
    if (!listing.expiresAt) return null;
    const expiryDate = new Date(listing.expiresAt);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div
      className={`bg-white rounded-sm shadow-md overflow-hidden cursor-pointer 
                  hover:shadow-xl transition-all duration-300 relative group
                  ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'}
                  flex flex-col sm:flex-row h-auto sm:h-[216px] lg:h-[216px]`}
    >
      {/* Zdjęcie */}
      <div className="w-full sm:w-[300px] lg:w-[336px] h-48 sm:h-full relative overflow-hidden flex-shrink-0"
           onClick={() => onNavigate(listing.id)}>
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 hover:scale-110 transition-transform duration-200 
                     bg-white rounded-full shadow-lg z-10"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'}`}
          />
        </button>
        {isFeatured && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#35530A] text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-2.5 lg:py-1.5 text-xs sm:text-sm lg:text-xs rounded-sm font-medium flex items-center gap-1.5 sm:gap-2 shadow-lg">
            <Medal className="w-3 h-3 sm:w-4 sm:h-4 lg:w-3.5 lg:h-3.5" />
            WYRÓŻNIONE
          </div>
        )}
        
        {/* Licznik wyświetleń */}
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-sm text-xs flex items-center gap-1 shadow">
          <Eye className="w-3.5 h-3.5" />
          <span>{listing.views || 0} wyświetleń</span>
        </div>
        
        {/* Licznik dni do końca */}
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-sm text-xs flex items-center gap-1 shadow">
          <Clock className="w-3.5 h-3.5" />
          <span>{getDaysRemaining() || 0} dni do końca</span>
        </div>
      </div>

      {/* Na urządzeniach mobilnych mamy układ kartowy z opisem pod zdjęciem */}
      <div className="flex flex-col sm:flex-row flex-grow">
        {/* Główne informacje */}
        <div className="flex-grow p-2 sm:p-3 lg:p-3 flex flex-col"
             onClick={() => onNavigate(listing.id)}>
          <div className="mb-2 sm:mb-2.5 lg:mb-3">
            <h3 className="text-lg sm:text-xl lg:text-xl font-bold mb-0.5 sm:mb-1 lg:mb-1 line-clamp-1">{listing.title}</h3>
            <p className="text-sm sm:text-base lg:text-base text-gray-600 line-clamp-1">{listing.subtitle}</p>
          </div>

          {/* Parametry w grid - przesunięte wyżej */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 lg:gap-2">
            {/* Paliwo */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2 text-gray-700">
              <Fuel className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" />
              <div>
                <div className="text-xs sm:text-xs lg:text-sm text-gray-500">Paliwo</div>
                <div className="text-sm sm:text-base lg:text-base font-medium">{listing.fuel}</div>
              </div>
            </div>
            
            {/* Przebieg */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2 text-gray-700">
              <Gauge className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" />
              <div>
                <div className="text-xs sm:text-xs lg:text-sm text-gray-500">Przebieg</div>
                <div className="text-sm sm:text-base lg:text-base font-medium">{listing.mileage} km</div>
              </div>
            </div>

            {/* Pojemność */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2 text-gray-700">
              <Box className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" />
              <div>
                <div className="text-xs sm:text-xs lg:text-sm text-gray-500">Pojemność</div>
                <div className="text-sm sm:text-base lg:text-base font-medium">{listing.engineCapacity}</div>
              </div>
            </div>

            {/* Rok */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2 text-gray-700">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" />
              <div>
                <div className="text-xs sm:text-xs lg:text-sm text-gray-500">Rok</div>
                <div className="text-sm sm:text-base lg:text-base font-medium">{listing.year}</div>
              </div>
            </div>

            {/* Moc */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2 text-gray-700">
              <Power className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" />
              <div>
                <div className="text-xs sm:text-xs lg:text-sm text-gray-500">Moc</div>
                <div className="text-sm sm:text-base lg:text-base font-medium">{listing.power}</div>
              </div>
            </div>
            
            {/* Napęd */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2 text-gray-700">
              <Car className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" />
              <div>
                <div className="text-xs sm:text-xs lg:text-sm text-gray-500">Napęd</div>
                <div className="text-sm sm:text-base lg:text-base font-medium">{listing.drive}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prawa kolumna - na mobile full width, na desktop side panel */}
        <div className="w-full sm:w-[180px] lg:w-[192px] p-2 sm:p-3 lg:p-3 flex flex-col sm:flex-col bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-100">
          {/* Na desktopach najpierw cena, potem sprzedawca/lokalizacja */}
          {/* Cena */}
          <div className="bg-[#35530A] rounded-sm p-2 sm:p-3 lg:p-3 shadow-md order-2 sm:order-1 mt-1 sm:mt-0 sm:mb-3 lg:mb-4">
            <div className="text-xl sm:text-2xl lg:text-2xl font-bold text-white tracking-tight text-center">
              {listing.price.toLocaleString('pl-PL')} zł
            </div>
          </div>
          
          {/* Przyciski akcji */}
          <div className="flex flex-col gap-2 mt-3">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit && onEdit(listing.id); }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors"
            >
              <Edit className="w-4 h-4" /> Edytuj
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); onExtend && onExtend(listing.id); }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Przedłuż
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); onEnd && onEnd(listing.id); }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-yellow-500 hover:bg-yellow-600 text-white font-medium text-sm transition-colors"
            >
              <Clock className="w-4 h-4" /> Zakończ
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(listing.id); }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors"
            >
              <Trash className="w-4 h-4" /> Usuń
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="absolute top-2 right-12 sm:top-3 sm:right-16 bg-black bg-opacity-75 text-white text-xs sm:text-sm px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-sm z-20">
          {message}
        </div>
      )}
    </div>
  );
});

export default UserListingInfoCard;
