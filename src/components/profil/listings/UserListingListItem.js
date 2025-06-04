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
      className={`bg-white rounded-sm shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative group ${isFeatured ? 'border-2 border-[#35530A]' : 'border border-gray-200'} flex flex-col sm:flex-row h-auto`}
      onClick={() => {
        console.log('Navigating to listing:', listing.id || listing._id);
        onNavigate && onNavigate(listing.id || listing._id);
      }}
      tabIndex={0}
      role="button"
      style={{ outline: 'none' }}
    >
      {/* Image section - fixed aspect ratio container */}
      <div className="w-full sm:w-[300px] lg:w-[336px] relative overflow-hidden flex-shrink-0 bg-gray-200" 
           style={{ aspectRatio: '3/2' }}>
        <img
          src={getImageUrl(listing.image)}
          alt={listing.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          style={{ 
            objectFit: 'cover', 
            objectPosition: 'center',
            width: '100%',
            height: '100%'
          }}
          loading="lazy"
          onError={e => {
            e.target.onerror = null;
            e.target.src = '/images/auto-788747_1280.jpg';
          }}
        />
        {/* Price badge */}
        <div className="absolute top-2 left-2 bg-[#35530A] text-white px-4 py-2 rounded-sm font-bold text-lg shadow-lg z-10">
          {listing.price?.toLocaleString('pl-PL')} zł
        </div>
        {/* Date added badge - replaces days remaining */}
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-[#35530A] px-3 py-1 rounded-sm font-semibold text-xs flex items-center gap-1 shadow z-10">
          <Calendar className="w-4 h-4" />
          {formatDate(listing.createdAt)}
        </div>
        {/* Favorite button */}
        <button
          onClick={e => {
            e.stopPropagation();
            if (onFavorite) {
              // Toggle local state immediately for better UX
              const newFavoriteState = !isFavorite;
              // Update the element's appearance immediately
              e.currentTarget.querySelector('svg').classList.toggle('fill-red-500');
              e.currentTarget.querySelector('svg').classList.toggle('stroke-red-500');
              e.currentTarget.querySelector('svg').classList.toggle('stroke-gray-400');
              // Call the actual handler
              onFavorite(listing.id || listing._id, newFavoriteState);
            }
          }}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg z-10 hover:scale-110 transition-transform"
          title="Polub"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400'}`}
          />
        </button>
        {/* Green border is enough to show featured status - no text badge needed */}
      </div>

      {/* Main info and actions */}
      <div className="flex flex-col sm:flex-row flex-grow">
        {/* Info section */}
        <div className="flex-grow p-3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-1">{listing.title}</h3>
            <p className="text-sm sm:text-base text-gray-600 line-clamp-1">{listing.subtitle}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <CalendarIcon className="w-4 h-4" />
              <span>Dodano: {formatDate(listing.createdAt)}</span>
            </div>
            {/* Parameters grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Fuel className="w-5 h-5 text-black" />
                <div>
                  <div className="text-xs text-gray-500">Paliwo</div>
                  <div className="text-sm font-medium">{listing.fuel}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Gauge className="w-5 h-5 text-black" />
                <div>
                  <div className="text-xs text-gray-500">Przebieg</div>
                  <div className="text-sm font-medium">{listing.mileage} km</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Box className="w-5 h-5 text-black" />
                <div>
                  <div className="text-xs text-gray-500">Pojemność</div>
                  <div className="text-sm font-medium">{listing.engineCapacity}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-black" />
                <div>
                  <div className="text-xs text-gray-500">Rok</div>
                  <div className="text-sm font-medium">{listing.year}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Power className="w-5 h-5 text-black" />
                <div>
                  <div className="text-xs text-gray-500">Moc</div>
                  <div className="text-sm font-medium">{listing.power}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Car className="w-5 h-5 text-black" />
                <div>
                  <div className="text-xs text-gray-500">Napęd</div>
                  <div className="text-sm font-medium">{listing.drive}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-4 mt-3 border-t border-gray-100 pt-3">
            <div className="flex items-center rounded-full px-4 py-2 shadow bg-white border border-gray-200 text-[#35530A] font-semibold text-base gap-2">
              <Eye className="w-5 h-5" />
              <span className="font-bold">{listing.views || 0}</span>
              <span className="text-xs font-medium text-gray-600">wyświetleń</span>
            </div>
            <div className="flex items-center rounded-full px-4 py-2 shadow bg-white border border-gray-200 text-[#b91c1c] font-semibold text-base gap-2">
              <Heart className="w-5 h-5" />
              <span className="font-bold">{listing.likes || 0}</span>
              <span className="text-xs font-medium text-gray-600">polubień</span>
            </div>
            <div className="flex items-center rounded-full px-4 py-2 shadow bg-white border border-gray-200 text-[#35530A] font-semibold text-base gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-bold">{getDaysRemaining() || 0}</span>
              <span className="text-xs font-medium text-gray-600">dni do końca</span>
            </div>
          </div>
        </div>
        {/* Actions section */}
        <div className="flex flex-col items-stretch justify-center gap-2 p-3 min-w-[120px] bg-gray-50 border-l border-gray-100">
          <button
            onClick={e => { e.stopPropagation(); onEdit && onEdit(listing.id || listing._id); }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
            title="Edytuj"
          >
            <Edit className="w-4 h-4" /> Edytuj
          </button>
          <button
            onClick={e => { e.stopPropagation(); onEnd && onEnd(listing.id || listing._id); }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-sm transition-colors"
            title="Zakończ"
          >
            <Trash className="w-4 h-4" /> Zakończ
          </button>
          <button
            onClick={e => { e.stopPropagation(); onExtend && onExtend(listing.id || listing._id); }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
            title="Przedłuż"
          >
            <RefreshCw className="w-4 h-4" /> Przedłuż
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete && onDelete(listing.id || listing._id); }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
            title="Usuń"
          >
            <Trash className="w-4 h-4" /> Usuń
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
