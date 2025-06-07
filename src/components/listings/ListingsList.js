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

  // Tymczasowe logowanie pierwszego ogłoszenia do debugowania
  if (listings && listings.length > 0) {
    // eslint-disable-next-line no-console
    debug('DEBUG: pierwszy listing w liście:', listings[0]);
  }

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
          <div key={listing._id || listing.id}>
            {/* Przekazujemy cały obiekt listing do ListingCard.js, który renderuje zdjęcie i dane */}
            <ListingCard
              listing={listing}
              onFavorite={toggleFavorite}
              onEdit={handleEdit}
              onDelete={handleDelete}
              calculateDaysRemaining={() => 7} // lub inna logika
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsList;
