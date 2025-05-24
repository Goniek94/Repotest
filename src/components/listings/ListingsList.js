import React, { useState, useEffect } from 'react';
import { Heart, Eye, Edit, Trash, Plus } from 'lucide-react';
import { getListings } from '../../services/api';
import getImageUrl from '../../utils/responsive/getImageUrl';

// Główny kolor
const PRIMARY_COLOR = '#35530A';
const SUCCESS_COLOR = '#25a244';

const ListingsList = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getListings();
        // Backend zwraca ads, totalPages, currentPage, totalAds
        setListings(data.ads || []);
      } catch (err) {
        setError('Błąd podczas pobierania ogłoszeń');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const toggleFavorite = (id) => {
    // Logika dodawania/usuwania z ulubionych
  };

  const handleEdit = (id) => {
    // Logika edycji ogłoszenia
  };

  const handleDelete = (id) => {
    // Logika usuwania ogłoszenia
  };

  return (
    <div className="bg-white p-6 rounded-sm shadow-sm">
      {/* Nagłówek z tytułem i przyciskiem */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Zarządzanie ogłoszeniami</h1>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm flex items-center text-sm">
          <Plus className="w-4 h-4 mr-2" /> Dodaj ogłoszenie
        </button>
      </div>

      {/* Zakładki */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex">
          <button
            className={`py-2 px-0 mr-8 font-medium text-sm border-b-2 ${activeTab === 'listings' ? 'text-[#35530A] border-[#35530A]' : 'text-gray-600 border-transparent'}`}
            onClick={() => setActiveTab('listings')}
          >
            Moje ogłoszenia
          </button>
          <button
            className={`py-2 px-0 font-medium text-sm border-b-2 ${activeTab === 'stats' ? 'text-[#35530A] border-[#35530A]' : 'text-gray-600 border-transparent'}`}
            onClick={() => setActiveTab('stats')}
          >
            Statystyki
          </button>
        </div>
      </div>

      {/* Submenu z filtrami */}
      <div className="mb-6">
        <div className="flex">
          <button
            className={`py-2 px-0 mr-6 font-medium text-sm ${activeTab === 'listings' ? 'text-[#35530A]' : 'text-gray-600'}`}
          >
            Moje ogłoszenia
          </button>
          <button
            className="py-2 px-0 font-medium text-sm text-gray-600 flex items-center"
          >
            <Heart className="w-4 h-4 mr-1" /> Ulubione
          </button>
        </div>
      </div>

      {/* Obsługa ładowania i błędów */}
      {loading && <div>Ładowanie ogłoszeń...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Lista ogłoszeń */}
      <div className="space-y-6">
        {!loading && !error && listings.length === 0 && (
          <div className="text-gray-500">Brak ogłoszeń do wyświetlenia.</div>
        )}
        {listings.map(listing => (
          <div key={listing._id || listing.id} className="border border-gray-200 rounded-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Zdjęcie z etykietą */}
              <div className="relative md:w-64 h-48 bg-gray-100">
                {/* Placeholder lub zdjęcie */}
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[listing.mainImageIndex || 0]}
                    alt={listing.headline || listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Zdjęcie pojazdu</span>
                  </div>
                )}

                {listing.listingType === 'wyróżnione' && (
                  <div className="absolute top-2 left-0 bg-yellow-500 text-white px-2 py-1 text-xs flex items-center">
                    <span className="mr-1">★</span> Wyróżnione
                  </div>
                )}
              </div>

              {/* Informacje o ogłoszeniu */}
              <div className="flex-grow p-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h2 className="text-lg font-bold mb-2">{listing.headline || listing.title}</h2>
                    <div className="inline-block bg-[#35530A] text-white px-2 py-1 mb-3 font-bold">
                      {listing.price} PLN
                    </div>

                    <div className="text-sm text-gray-600">
                      {listing.year} • {listing.mileage} km • {listing.fuelType} • {listing.power} KM
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <span className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs">
                      {listing.status || 'Aktywne'}
                    </span>
                  </div>
                </div>

                {/* Statystyki i akcje */}
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center text-xs text-gray-500">
                    <Eye className="w-4 h-4 mr-1" /> {listing.views || 0} wyświetleń
                    <span className="mx-2">•</span>
                    {listing.createdAt ? `Dodano: ${new Date(listing.createdAt).toLocaleDateString()}` : null}
                  </div>

                  <div className="flex space-x-3">
                    <button onClick={() => toggleFavorite(listing._id || listing.id)} className="text-yellow-500">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleEdit(listing._id || listing.id)} className="text-blue-500">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(listing._id || listing.id)} className="text-red-500">
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsList;
