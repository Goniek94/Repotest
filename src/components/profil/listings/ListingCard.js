import React from "react";
import { Heart, Eye, Edit, Trash, RefreshCw, AlertTriangle, MapPin, User } from "lucide-react";
import YearIcon from '../../icons/YearIcon';
import FuelIcon from '../../icons/FuelIcon';
import MileageIcon from '../../icons/MileageIcon';
import PowerIcon from '../../icons/PowerIcon';
import GearboxIcon from '../../icons/GearboxIcon';
import CapacityIcon from '../../icons/CapacityIcon';
import getImageUrl from '../../../utils/responsive/getImageUrl';

/**
 * Card for a single listing - układ jak na wzorze BMW Seria 1.
 * Props:
 * - listing: object (listing data)
 * - onFavorite, onEdit, onDelete, onExtend: functions
 * - calculateDaysRemaining: function
 */
const ListingCard = ({ listing, onFavorite, onEdit, onDelete, onExtend, calculateDaysRemaining }) => {
  // Przygotowanie danych
  const title = `${listing.brand || listing.make || ''} ${listing.model || ''}`.trim() || listing.title;
  const price = listing.price || 0;
  const year = listing.year || new Date().getFullYear();
  const mileage = listing.mileage || 0;
  const fuelType = listing.fuelType || listing.fuel || 'Diesel';
  const power = listing.power || '150 KM';
  const engineCapacity = listing.engineCapacity || listing.capacity || 2000;
  const transmission = listing.transmission || listing.gearbox || 'Automatyczna';
  const sellerType = listing.sellerType || 'Prywatny';
  const location = listing.city || listing.location || 'Polska';
  const description = listing.headline || listing.shortDescription || `${title} - sprawdź szczegóły tego ogłoszenia`;

  // Bezpieczny dostęp do obrazu
  const getListingImage = () => {
    if (listing.images && listing.images.length > 0) {
      const mainIndex = typeof listing.mainImageIndex === 'number' && 
                        listing.mainImageIndex >= 0 && 
                        listing.mainImageIndex < listing.images.length 
                          ? listing.mainImageIndex 
                          : 0;
      return getImageUrl(listing.images[mainIndex]);
    }
    if (listing.image) {
      return getImageUrl(listing.image);
    }
    return '/images/auto-788747_1280.jpg';
  };

  const imageUrl = getListingImage();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-80 h-48 bg-gray-100 flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/auto-788747_1280.jpg';
            }}
          />
          {listing.isExpiring && listing.status === "Aktywne" && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs flex items-center rounded">
              <AlertTriangle className="w-3 h-3 mr-1" /> Kończy się za {listing.daysRemaining} dni
            </div>
          )}
          {(listing.featured || listing.listingType === 'wyróżnione') && (
            <div className="absolute top-2 left-2 bg-[#35530A] text-white px-2 py-1 text-xs flex items-center rounded">
              WYRÓŻNIONE
            </div>
          )}
        </div>

        {/* Content - układ jak na wzorze BMW Seria 1 */}
        <div className="flex-grow p-4 flex flex-col">
          {/* Title and description */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
          </div>

          {/* Specifications - układ jak na wzorze BMW Seria 1 */}
          <div className="flex-grow">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
              {/* Paliwo */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                  <FuelIcon className="w-3 h-3 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-medium">Paliwo</div>
                  <div className="text-sm font-bold text-gray-900">{fuelType}</div>
                </div>
              </div>

              {/* Pojemność */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                  <CapacityIcon className="w-3 h-3 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-medium">Pojemność</div>
                  <div className="text-sm font-bold text-gray-900">{engineCapacity} cm³</div>
                </div>
              </div>

              {/* Moc */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                  <PowerIcon className="w-3 h-3 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-medium">Moc</div>
                  <div className="text-sm font-bold text-gray-900">{power}</div>
                </div>
              </div>

              {/* Skrzynia */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                  <GearboxIcon className="w-3 h-3 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-medium">Skrzynia</div>
                  <div className="text-sm font-bold text-gray-900">{transmission === 'Automatyczna' ? 'automatyczna' : 'manualna'}</div>
                </div>
              </div>

              {/* Przebieg */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                  <MileageIcon className="w-3 h-3 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-medium">Przebieg</div>
                  <div className="text-sm font-bold text-gray-900">{Math.round(mileage/1000)} tys. km</div>
                </div>
              </div>

              {/* Rok */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                  <YearIcon className="w-3 h-3 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-medium">Rok</div>
                  <div className="text-sm font-bold text-gray-900">{year}</div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-4"></div>
            
            {/* Sprzedawca i lokalizacja - pod separatorem */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-medium">Sprzedawca</div>
                  <div className="text-sm font-bold text-gray-900">{sellerType}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full flex-shrink-0">
                  <MapPin className="w-3 h-3 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-medium">Lokalizacja</div>
                  <div className="text-sm font-bold text-gray-900 truncate">{location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section - cena i akcje */}
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
            <div className="bg-[#35530A] text-white px-4 py-2 rounded font-bold text-xl">
              {typeof price === 'number' ? price.toLocaleString() : price} zł
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Stats */}
              <div className="flex items-center text-xs text-gray-500">
                <Eye className="w-4 h-4 mr-1" /> {listing.views || 0} wyświetleń
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <button onClick={() => onFavorite(listing.id)} className="text-yellow-500 hover:text-yellow-600">
                  <Heart className="w-5 h-5" />
                </button>
                <button onClick={() => onEdit(listing.id)} className="text-blue-500 hover:text-blue-600">
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onDelete(listing.id)} 
                  disabled={listing.isDeleting}
                  className="text-red-500 hover:text-red-600"
                >
                  {listing.isDeleting ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    <Trash className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
