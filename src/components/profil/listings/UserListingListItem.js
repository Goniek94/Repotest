import React, { memo } from 'react';
import {
  Heart,
  Fuel,
  Calendar,
  Gauge,
  Power,
  Car,
  Box,
  Medal,
  Eye,
  Edit,
  Trash,
  RefreshCw,
  Clock,
  Calendar as CalendarIcon
} from 'lucide-react';
import getImageUrl from '../../../utils/responsive/getImageUrl';

/**
 * User's listing card with full management actions and stats.
 * - All actions are real and connected to backend via props.
 * - Card is fully clickable (navigates to details), except action buttons.
 */
const UserListingListItem = memo(({
  listing,
  onEdit,
  onEditNew,
  onDelete,
  onExtend,
  onEnd,
  onFavorite,
  isFavorite,
  message,
  onNavigate // function to go to details
}) => {
  const isFeatured = listing.featured || listing.listingType === 'wyróżnione';

  // Calculate days remaining (if not provided)
  const getDaysRemaining = () => {
    if (listing.daysRemaining !== undefined) return listing.daysRemaining;
    if (!listing.expiresAt) return null;
    const expiryDate = new Date(listing.expiresAt);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (error) {
      return '';
    }
  };

  return (
    <div
      className={`bg-white rounded-sm shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative group ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'} flex flex-col lg:flex-row h-auto`}
      onClick={() => {
        onNavigate && onNavigate(listing.id || listing._id);
      }}
      tabIndex={0}
      role="button"
      style={{ outline: 'none' }}
    >
      {/* Image section - bardziej kwadratowy na mobile */}
      <div className="w-full lg:w-[300px] xl:w-[336px] relative overflow-hidden flex-shrink-0 bg-gray-200" 
           style={{ aspectRatio: '4/3' }}>
        {/* Renderowanie zdjęcia tylko jeśli jest dostępne */}
        {(() => {
          // Pobierz URL zdjęcia
          let imageUrl = null;
          
          // Sprawdź, czy mamy tablicę zdjęć
          if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
            // Wybierz główne zdjęcie lub pierwsze dostępne
            const mainIndex = typeof listing.mainImageIndex === 'number' && 
                             listing.mainImageIndex >= 0 && 
                             listing.mainImageIndex < listing.images.length 
                              ? listing.mainImageIndex 
                              : 0;
            
            const selectedImage = listing.images[mainIndex];
            
            // Użyj getImageUrl do przetworzenia URL-a
            imageUrl = getImageUrl(selectedImage);
          } 
          // Jeśli nie mamy tablicy zdjęć, sprawdź czy jest pojedyncze zdjęcie
          else if (listing.image) {
            imageUrl = getImageUrl(listing.image);
          }
          
          // Jeśli jest URL zdjęcia, renderuj zdjęcie
          if (imageUrl) {
            return (
              <img
                src={imageUrl}
                alt={listing.title || 'Zdjęcie ogłoszenia'}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                style={{ 
                  objectFit: 'cover', 
                  objectPosition: 'center',
                  width: '100%',
                  height: '100%'
                }}
                loading="lazy"
                onError={e => {
                  // Ustaw domyślne zdjęcie w przypadku błędu
                  e.target.onerror = null;
                  e.target.src = '/images/auto-788747_1280.jpg';
                }}
              />
            );
          } else {
            // Jeśli nie ma URL zdjęcia, renderuj placeholder
            return (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-lg">Brak zdjęcia</span>
              </div>
            );
          }
        })()}
        {/* Price badge */}
        <div className="absolute top-2 left-2 bg-[#35530A] text-white px-4 py-2 rounded-sm font-bold text-lg shadow-lg z-10">
          {listing.price?.toLocaleString('pl-PL')} zł
        </div>
        {/* Date added badge - replaces days remaining */}
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-[#35530A] px-3 py-1 rounded-sm font-semibold text-xs flex items-center gap-1 shadow z-10">
          <Calendar className="w-4 h-4" />
          {formatDate(listing.createdAt)}
        </div>
        {/* Green border is enough to show featured status - no text badge needed */}
      </div>

        {/* Main info and actions - zoptymalizowany layout na mobile */}
        <div className="flex flex-col lg:flex-row flex-grow">
          {/* Info section */}
          <div className="flex-grow p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg lg:text-xl font-bold mb-1 line-clamp-1">{listing.title}</h3>
              <p className="text-sm lg:text-base text-gray-600 line-clamp-1 mb-3">{listing.subtitle}</p>
              
              {/* Parameters grid - bardziej kompaktowy na mobile */}
              <div className="grid grid-cols-3 lg:grid-cols-3 gap-3 mt-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Fuel className="w-4 h-4 lg:w-5 lg:h-5 text-black flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Paliwo</div>
                    <div className="text-sm font-medium truncate">{listing.fuel}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Gauge className="w-4 h-4 lg:w-5 lg:h-5 text-black flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Przebieg</div>
                    <div className="text-sm font-medium truncate">{listing.mileage} km</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-black flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Rok</div>
                    <div className="text-sm font-medium truncate">{listing.year}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Box className="w-4 h-4 lg:w-5 lg:h-5 text-black flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Pojemność</div>
                    <div className="text-sm font-medium truncate">{listing.engineCapacity}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Power className="w-4 h-4 lg:w-5 lg:h-5 text-black flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Moc</div>
                    <div className="text-sm font-medium truncate">{listing.power}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Car className="w-4 h-4 lg:w-5 lg:h-5 text-black flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Napęd</div>
                    <div className="text-sm font-medium truncate">{listing.drive}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats - bardziej kompaktowe na mobile */}
            <div className="flex w-full mt-4 border-t border-gray-100 pt-3">
              <div className="flex items-center flex-1 px-2 lg:px-4 py-2 shadow bg-white border border-gray-200 text-[#35530A] font-semibold text-sm lg:text-base gap-1 lg:gap-2 border-r-0">
                <Eye className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="font-bold">{listing.views || 0}</span>
                <span className="text-xs font-medium text-gray-600 hidden sm:inline">wyświetleń</span>
              </div>
              <div className="flex items-center flex-1 px-2 lg:px-4 py-2 shadow bg-white border border-gray-200 text-[#b91c1c] font-semibold text-sm lg:text-base gap-1 lg:gap-2 border-r-0 border-l-0">
                <Heart className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="font-bold">{listing.likes || 0}</span>
                <span className="text-xs font-medium text-gray-600 hidden sm:inline">polubień</span>
              </div>
              <div className="flex items-center flex-1 px-2 lg:px-4 py-2 shadow bg-white border border-gray-200 text-[#35530A] font-semibold text-sm lg:text-base gap-1 lg:gap-2 border-l-0">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="font-bold">{getDaysRemaining() || 0}</span>
                <span className="text-xs font-medium text-gray-600 hidden sm:inline">dni</span>
              </div>
            </div>
          </div>
          
          {/* Actions section - poziomo na mobile, pionowo na desktop */}
          <div className="flex flex-row lg:flex-col items-stretch justify-start gap-2 p-3 lg:min-w-[120px] bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100">
            <button
              onClick={e => { 
                e.stopPropagation(); 
                if (onEditNew) {
                  onEditNew(listing.id || listing._id);
                } else if (onEdit) {
                  onEdit(listing.id || listing._id);
                }
              }}
              className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded bg-gradient-to-r from-[#6B8E23] to-[#556B2F] hover:from-[#556B2F] hover:to-[#4A5D28] text-white font-semibold text-xs lg:text-sm transition-all duration-300 shadow-md flex-1 lg:flex-none"
              title="Edytuj"
            >
              <Edit className="w-3 h-3 lg:w-4 lg:h-4" /> 
              <span className="hidden sm:inline lg:inline">Edytuj</span>
            </button>
            <button
              onClick={e => { e.stopPropagation(); onEnd && onEnd(listing.id || listing._id); }}
              className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded bg-gradient-to-r from-[#6B8E23] to-[#556B2F] hover:from-[#556B2F] hover:to-[#4A5D28] text-white font-semibold text-xs lg:text-sm transition-all duration-300 shadow-md flex-1 lg:flex-none"
              title="Zakończ"
            >
              <Trash className="w-3 h-3 lg:w-4 lg:h-4" /> 
              <span className="hidden sm:inline lg:inline">Zakończ</span>
            </button>
            <button
              onClick={e => { e.stopPropagation(); onExtend && onExtend(listing.id || listing._id); }}
              className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded bg-gradient-to-r from-[#6B8E23] to-[#556B2F] hover:from-[#556B2F] hover:to-[#4A5D28] text-white font-semibold text-xs lg:text-sm transition-all duration-300 shadow-md flex-1 lg:flex-none"
              title="Przedłuż"
            >
              <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4" /> 
              <span className="hidden sm:inline lg:inline">Przedłuż</span>
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete && onDelete(listing.id || listing._id); }}
              className="flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded bg-gradient-to-r from-[#6B8E23] to-[#556B2F] hover:from-[#556B2F] hover:to-[#4A5D28] text-white font-semibold text-xs lg:text-sm transition-all duration-300 shadow-md flex-1 lg:flex-none"
              title="Usuń"
            >
              <Trash className="w-3 h-3 lg:w-4 lg:h-4" /> 
              <span className="hidden sm:inline lg:inline">Usuń</span>
            </button>
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

export default UserListingListItem;
