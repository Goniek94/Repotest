import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus } from 'lucide-react';
import UserListingListItem from '../UserListingListItem';

const ListingsGrid = ({ 
  listings, 
  loading, 
  error, 
  activeTab,
  onNavigate,
  onEdit,
  onEnd,
  onDelete,
  onExtend,
  onFavorite,
  onRefresh
}) => {
  const navigate = useNavigate();

  // Status ładowania
  if (loading) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl shadow-lg">
        <div className="relative inline-block">
          <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full mb-4"></div>
          <div className="absolute inset-0 animate-ping w-12 h-12 border-4 border-blue-300 rounded-full opacity-20"></div>
        </div>
        <p className="text-slate-600 font-medium">Ładowanie ogłoszeń...</p>
      </div>
    );
  }

  // Status błędu
  if (error) {
    return (
      <div className="py-12 text-center bg-white rounded-2xl shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={onRefresh}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  // Brak ogłoszeń
  if (listings.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl shadow-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
          <div className="text-4xl">📝</div>
        </div>
        <p className="text-slate-500 text-lg mb-6">Brak ogłoszeń w tej kategorii.</p>
        {activeTab === 'active' && (
          <button
            onClick={() => navigate('/dodaj-ogloszenie')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center text-sm font-medium mx-auto shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" /> Dodaj pierwsze ogłoszenie
          </button>
        )}
      </div>
    );
  }

  // Lista ogłoszeń
  return (
    <div className="space-y-2 lg:space-y-3">
      {listings.map(listing => (
        <UserListingListItem
          key={listing._id}
          listing={{
            id: listing._id,
            _id: listing._id,
            // Przekazujemy pełną tablicę obrazów i mainImageIndex - uproszczona i bezpieczna logika
            images: Array.isArray(listing.images) ? listing.images : [],
            mainImageIndex: typeof listing.mainImageIndex === 'number' && 
                           listing.mainImageIndex >= 0 && 
                           Array.isArray(listing.images) && 
                           listing.mainImageIndex < listing.images.length 
                              ? listing.mainImageIndex 
                              : 0,
            // Dodajemy również pojedyncze zdjęcie jako fallback
            image: listing.image || (Array.isArray(listing.images) && listing.images.length > 0 ? listing.images[0] : null),
            featured: listing.listingType === 'wyróżnione' || listing.listingType === 'featured',
            title: `${listing.brand || ''} ${listing.model || ''}`.trim() || 'Brak tytułu',
            subtitle: listing.headline || listing.shortDescription || '',
            price: listing.price || 0,
            year: listing.year || 'N/A',
            mileage: listing.mileage || 0,
            fuel: listing.fuelType || 'N/A',
            power: listing.power || 'N/A',
            engineCapacity: listing.engineSize || listing.engineCapacity || 'N/A',
            drive: listing.drive || 'N/A',
            transmission: listing.transmission || listing.gearbox || 'N/A',
            countryOrigin: listing.countryOfOrigin || listing.countryOrigin || listing.origin || 'N/A',
            sellerType: listing.sellerType || 'N/A',
            city: listing.city || 'N/A',
            location: listing.voivodeship || 'N/A',
            status: listing.status || 'N/A',
            views: listing.views || 0,
            likes: listing.likes || 0,
            createdAt: listing.createdAt || new Date().toISOString(),
            expiresAt: listing.expiresAt,
            brand: listing.brand || '',
            model: listing.model || '',
          }}
          onNavigate={onNavigate}
          onEdit={onEdit}
          onEnd={onEnd}
          onDelete={onDelete}
          onExtend={onExtend}
          onFavorite={onFavorite}
          isFavorite={!!listing.isFavorite}
          message={
            listing.status === 'wersja robocza'
              ? 'Wersja robocza – dokończ lub opublikuj'
              : undefined
          }
        />
      ))}
    </div>
  );
};

export default ListingsGrid;
