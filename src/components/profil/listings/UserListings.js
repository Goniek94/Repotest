import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiBarChart2, FiHeart } from 'react-icons/fi';
import { Heart, Eye, Edit, Trash } from 'lucide-react';
import ListingsService from '../../../services/api/listingsApi';
import ListingList from './ListingList';

const UserListings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie ogłoszeń użytkownika
  useEffect(() => {
    setLoading(true);
    ListingsService.getUserListings()
      .then((ads) => {
        setAllListings(ads);
        setLoading(false);
      })
      .catch((err) => {
        setError('Błąd podczas pobierania ogłoszeń użytkownika.');
        setLoading(false);
      });
  }, []);

  // Filtrowanie ogłoszeń na podstawie wybranej zakładki
  const getFilteredListings = () => {
    switch(activeTab) {
      case 'active':
        return allListings.filter(listing => listing.status === 'opublikowane');
      case 'completed':
        return allListings.filter(listing => listing.status === 'archiwalne');
      case 'favorites':
        return allListings.filter(listing => listing.isFavorite);
      default:
        return allListings;
    }
  };

  const listings = getFilteredListings();

  // Obliczanie liczby dni pozostałych do wygaśnięcia ogłoszenia
  const calculateDaysRemaining = (createdAt) => {
    if (!createdAt) return 0;
    const dateAdded = new Date(createdAt);
    const expiryDate = new Date(dateAdded);
    expiryDate.setDate(expiryDate.getDate() + 30);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Obsługa ulubionych (na razie tylko frontendowo)
  const toggleFavorite = (id) => {
    setAllListings(prev =>
      prev.map(listing =>
        listing._id === id ? { ...listing, isFavorite: !listing.isFavorite } : listing
      )
    );
  };

  // Przekierowanie do edycji ogłoszenia
  const handleEdit = (id) => {
    navigate(`/edytuj-ogloszenie/${id}`);
  };

  // Przekierowanie do szczegółów ogłoszenia
  const handleNavigate = (id) => {
    navigate(`/ogloszenie/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white p-4 rounded-sm shadow-sm">
        {/* Główne zakładki */}
        <div className="mb-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('active')}
              className={`py-3 px-6 mr-4 font-medium text-base rounded-sm transition-colors ${
                activeTab === 'active' 
                  ? 'bg-[#35530A] text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Aktywne
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`py-3 px-6 mr-4 font-medium text-base rounded-sm transition-colors ${
                activeTab === 'completed' 
                  ? 'bg-[#35530A] text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Zakończone
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`py-3 px-6 font-medium text-base rounded-sm transition-colors flex items-center ${
                activeTab === 'favorites' 
                  ? 'bg-[#35530A] text-white' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-5 h-5 mr-2" /> Ulubione
            </button>
          </div>
        </div>
        
        {/* Lista ogłoszeń */}
        <ListingList
          listings={listings.map(listing => ({
            id: listing._id,
            image: listing.images && listing.images.length > 0 ? listing.images[0] : null,
            featured: listing.listingType === 'wyróżnione' || listing.listingType === 'featured',
            title: listing.headline || `${listing.brand} ${listing.model}`,
            price: listing.price ? `${listing.price} PLN` : 'Brak ceny',
            year: listing.year,
            mileage: listing.mileage ? `${listing.mileage} km` : '',
            fuelType: listing.fuelType,
            power: listing.power ? `${listing.power} KM` : '',
            status: listing.status === 'opublikowane' ? 'Aktywne' : (listing.status === 'archiwalne' ? 'Zakończone' : listing.status),
            views: listing.views || 0,
            likes: listing.likes || 0,
            dateAdded: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('pl-PL') : '',
            favorite: !!listing.isFavorite
          }))}
          onFavorite={toggleFavorite}
          onEdit={handleEdit}
          onDelete={() => {}} // TODO: implement delete
          calculateDaysRemaining={calculateDaysRemaining}
        />
      </div>
    </div>
  );
};

export default UserListings;
