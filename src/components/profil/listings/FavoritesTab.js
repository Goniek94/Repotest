import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import AdsService from '../../../services/ads';
import ListingListItem from '../../ListingsView/display/list/ListingListItem';

const FavoritesTab = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie ulubionych ogłoszeń
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AdsService.getFavorites();
      
      if (response.data && response.data.success && response.data.data && response.data.data.favorites) {
        setFavorites(response.data.data.favorites);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error('Błąd podczas pobierania ulubionych:', err);
      setError('Błąd podczas pobierania ulubionych ogłoszeń.');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Usuwanie z ulubionych
  const handleRemoveFromFavorites = async (adId) => {
    try {
      await AdsService.removeFromFavorites(adId);
      
      // Aktualizuj lokalną listę
      setFavorites(prev => prev.filter(ad => ad._id !== adId));
      
      toast.success('Ogłoszenie zostało usunięte z ulubionych');
    } catch (err) {
      console.error('Błąd podczas usuwania z ulubionych:', err);
      toast.error('Błąd podczas usuwania z ulubionych');
    }
  };

  // Przekierowanie do szczegółów ogłoszenia
  const handleNavigate = (id) => {
    navigate(`/listing/${id}`);
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="relative inline-block">
          <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full mb-4"></div>
          <div className="absolute inset-0 animate-ping w-12 h-12 border-4 border-blue-300 rounded-full opacity-20"></div>
        </div>
        <p className="text-slate-600 font-medium">Ładowanie ulubionych ogłoszeń...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={fetchFavorites}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
          <Heart className="w-10 h-10 text-slate-400" />
        </div>
        <p className="text-slate-500 text-lg mb-6">Nie masz jeszcze żadnych ulubionych ogłoszeń.</p>
        <p className="text-slate-400 text-sm mb-6">
          Kliknij w serduszko przy ogłoszeniu, aby dodać je do ulubionych.
        </p>
        <button
          onClick={() => navigate('/listings')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Przeglądaj ogłoszenia
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Ulubione ogłoszenia ({favorites.length})
        </h3>
      </div>

      <div className="space-y-4">
        {favorites.map(listing => (
          <div key={listing._id} className="relative">
            <ListingListItem
              listing={{
                id: listing._id,
                _id: listing._id,
                images: Array.isArray(listing.images) ? listing.images : [],
                mainImage: listing.mainImage || (Array.isArray(listing.images) && listing.images.length > 0 ? listing.images[0] : null),
                featured: listing.listingType === 'wyróżnione' || listing.listingType === 'featured',
                title: listing.title || listing.headline || `${listing.brand || ''} ${listing.model || ''}`.trim() || 'Brak tytułu',
                subtitle: listing.shortDescription || '',
                price: listing.price || 0,
                year: listing.year || 'N/A',
                mileage: listing.mileage || 0,
                fuel: listing.fuelType || 'N/A',
                power: listing.power || 'N/A',
                transmission: listing.transmission || 'N/A',
                city: listing.city || 'N/A',
                location: listing.voivodeship || 'N/A',
                views: listing.views || 0,
                createdAt: listing.createdAt || new Date().toISOString(),
                brand: listing.brand || '',
                model: listing.model || '',
              }}
              onNavigate={handleNavigate}
              showFavoriteButton={true}
              isFavorite={true}
              onFavoriteToggle={() => handleRemoveFromFavorites(listing._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesTab;
