// src/components/ListingsView/ListingsPage.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CompactSearch from './search/CompactSearch';
import ListingControls from './controls/ListingControls';
import ListingListView from './display/list/ListingListView';
import ListingCard from './display/grid/ListingCard';
// ZAMIANA: importujemy AdsService zamiast mongoAdsService
import AdsService from '../../services/ads';

function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Stany dla danych z API
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  
  // Stany UI
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortType, setSortType] = useState('none');
  const [offerType, setOfferType] = useState('all');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [itemsPerPage] = useState(30);
  const [favorites, setFavorites] = useState([]);
  const [favMessages, setFavMessages] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Inicjalizuj filtry z parametrów URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilters = {};
    
    // Pobierz wszystkie parametry z URL
    params.forEach((value, key) => {
      // Konwertuj stringi "true"/"false" na booleany
      if (value === 'true' || value === 'false') {
        urlFilters[key] = value === 'true';
      } 
      // Konwertuj liczby
      else if (!isNaN(value) && value !== '') {
        urlFilters[key] = Number(value);
      }
      // Pozostaw inne wartości jako stringi
      else {
        urlFilters[key] = value;
      }
    });
    
    // Ustaw filtry na podstawie parametrów URL, jeśli są jakieś
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
    
    // Ustaw numer strony
    const page = parseInt(params.get('page')) || 1;
    setCurrentPage(page);
  }, [location.search]);

  // Obsługa responsywności
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dane domyślne dla przypadku braku niektórych pól
  const getDefaultDataByMake = useCallback((make) => {
    const defaultData = {
      'Audi': { 
        fuel: 'Benzyna', 
        power: '190 KM', 
        engineCapacity: '2000 cm³', 
        drive: 'Przedni',
        city: 'Warszawa'
      },
      'Ford': { 
        fuel: 'Diesel', 
        power: '150 KM', 
        engineCapacity: '1800 cm³', 
        drive: 'Przedni',
        city: 'Kraków'  
      },
      'BMW': { 
        fuel: 'Benzyna', 
        power: '245 KM', 
        engineCapacity: '3000 cm³', 
        drive: 'Tylny',
        city: 'Poznań'
      },
      'Mercedes': { 
        fuel: 'Diesel', 
        power: '220 KM', 
        engineCapacity: '2200 cm³', 
        drive: 'Tylny',
        city: 'Gdańsk'
      },
      'Toyota': { 
        fuel: 'Hybryda', 
        power: '180 KM', 
        engineCapacity: '1800 cm³', 
        drive: 'Przedni',
        city: 'Łódź'
      },
      'Volkswagen': {
        fuel: 'Benzyna',
        power: '140 KM',
        engineCapacity: '1400 cm³',
        drive: 'Przedni',
        city: 'Wrocław'
      }
    };
    
    return defaultData[make] || { 
      fuel: 'Benzyna', 
      power: '150 KM', 
      engineCapacity: '1800 cm³', 
      drive: 'Przedni',
      city: 'Warszawa'
    };
  }, []);

  // Funkcja do pobierania danych z MongoDB (poprzez AdsService)
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Mapowanie sortType na format backendu
      let sortBy = 'createdAt';
      let order = 'desc';
      
      switch (sortType) {
        case 'price-asc': 
          sortBy = 'price'; 
          order = 'asc'; 
          break;
        case 'price-desc': 
          sortBy = 'price'; 
          order = 'desc'; 
          break;
        case 'year-asc': 
          sortBy = 'year'; 
          order = 'asc'; 
          break;
        case 'year-desc': 
          sortBy = 'year'; 
          order = 'desc'; 
          break;
        case 'mileage-asc': 
          sortBy = 'mileage'; 
          order = 'asc'; 
          break;
        case 'mileage-desc': 
          sortBy = 'mileage'; 
          order = 'desc'; 
          break;
        default:
          // Domyślnie 'createdAt', 'desc'
          break;
      }
      
      // Dodajemy offerType do filtrów
      const requestFilters = { ...filters };
      if (offerType !== 'all') {
        requestFilters.condition = offerType;
      }
      if (onlyFeatured) {
        requestFilters.listingType = 'wyróżnione';
      }
      
      console.log('Pobieranie danych z MongoDB z filtrami:', requestFilters);

      // Wywołujemy AdsService (ważne, by backend przyjmował takie parametry)
      const result = await AdsService.getAll({
        ...requestFilters,
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        order
      });

      const response = result.data; 
      console.log('Odpowiedź z backendu (AdsService):', response);

      // Załóżmy, że backend zwraca obiekt: { ads: [...], totalPages: number }
      const mappedListings = (response.ads || []).map(ad => {
        const defaultData = getDefaultDataByMake(ad.make);
        
        return {
          id: ad._id,
          title: `${ad.make || ''} ${ad.model || ''}`.trim() || 'Ogłoszenie',
          subtitle: ad.description
            ? ad.description.substring(0, 50) + '...'
            : `${ad.year}, ${ad.mileage || 0} km`,
          price: ad.price || 0,
          year: ad.year || 0,
          fuel: ad.fuelType || defaultData.fuel,
          engineCapacity: ad.capacity
            ? `${ad.capacity} cm³`
            : defaultData.engineCapacity,
          power: ad.power || defaultData.power,
          mileage: ad.mileage || 0,
          drive: ad.drive || defaultData.drive,
          location: 'Polska',
          city: ad.city || defaultData.city,
          gearbox: ad.transmission || 'Automatyczna',
          sellerType: ad.sellerType || (ad.owner ? 'Prywatny' : 'Firma'),
          image:
            ad.images && ad.images.length > 0
              ? ad.images[0]
              : '/images/auto-788747_1280.jpg',
          featured: ad.listingType === 'wyróżnione',
          condition: ad.condition || 'Używany'
        };
      });

      // Sortowanie wyróżnionych na górze, potem według sortBy
      const sortedListings = [...mappedListings].sort((a, b) => {
        // Najpierw wyróżnione
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // Potem wybrane kryterium
        if (sortBy === 'price') {
          return order === 'asc' ? a.price - b.price : b.price - a.price;
        }
        if (sortBy === 'year') {
          return order === 'asc' ? a.year - b.year : b.year - a.year;
        }
        if (sortBy === 'mileage') {
          return order === 'asc'
            ? a.mileage - b.mileage
            : b.mileage - a.mileage;
        }
        // Domyślnie: newest (desc)
        return order === 'asc' ? 1 : -1;
      });

      setListings(sortedListings);
      setTotalPages(response.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Błąd pobierania ogłoszeń:', err);
      setError(
        'Wystąpił błąd podczas ładowania ogłoszeń. Spróbuj odświeżyć stronę.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    sortType,
    offerType,
    onlyFeatured,
    currentPage,
    filters,
    getDefaultDataByMake,
    itemsPerPage
  ]);

  // Pobieranie danych przy pierwszym renderowaniu i zmianach parametrów
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Obsługa filtrów z CompactSearch
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // resetujemy stronę przy zmianie filtrów
  }, []);

  // Obsługa dodawania/usuwania z ulubionych
  const toggleFavorite = useCallback(async (id) => {
    try {
      const isFav = favorites.includes(id);
      
      if (isFav) {
        await AdsService.removeFromFavorites(id);
      } else {
        await AdsService.addToFavorites(id);
      }
      
      const msg = isFav ? 'Usunięto z ulubionych' : 'Dodano do ulubionych';
      
      setFavorites((prev) =>
        isFav ? prev.filter((x) => x !== id) : [...prev, id]
      );
      setFavMessages((prev) => ({ ...prev, [id]: msg }));
      
      setTimeout(() => {
        setFavMessages((prev) => ({ ...prev, [id]: null }));
      }, 2000);
    } catch (err) {
      console.error('Błąd dodawania do ulubionych:', err);
    }
  }, [favorites]);

  // Obsługa przycisku "Pokaż więcej"
  const handleShowMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);
  
  // Przejście do szczegółów ogłoszenia
  const navigateToListing = useCallback(
    (id) => {
      navigate(`/listing/${id}`);
    },
    [navigate]
  );

  // Ostateczny tryb widoku (na mobile zawsze lista)
  const finalViewMode = useMemo(
    () => (isMobile ? 'list' : viewMode),
    [isMobile, viewMode]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Przycisk do pokazywania/ukrywania wyszukiwarki */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white px-6 py-2.5 rounded shadow-md hover:shadow-lg transition-all duration-300 bg-[#35530A] hover:bg-[#44671A]"
          >
            {searchOpen ? 'Ukryj wyszukiwarkę' : 'Pokaż wyszukiwarkę'}
          </button>
        </div>

        {/* Komponent wyszukiwania */}
        {searchOpen && (
          <CompactSearch
            initialFilters={filters}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Kontrolki sortowania i filtrowania */}
        <ListingControls
          sortType={sortType}
          setSortType={setSortType}
          offerType={offerType}
          setOfferType={setOfferType}
          onlyFeatured={onlyFeatured}
          setOnlyFeatured={setOnlyFeatured}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isMobile={isMobile}
        />

        {/* Wyświetlanie informacji o źródle danych */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 my-4 text-yellow-700">
          <p>Źródło danych: MongoDB (prawdziwe dane)</p>
        </div>

        {/* Wyświetlanie stanu ładowania */}
        {loading && currentPage === 1 ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#35530A]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        ) : (
          <>
            {/* Wyświetlanie listy ogłoszeń lub informacji o braku wyników */}
            {listings.length === 0 ? (
              <div className="bg-white shadow-md rounded-md p-8 text-center mt-4">
                <h3 className="text-xl font-semibold">Nie znaleziono ogłoszeń</h3>
                <p className="mt-2 text-gray-600">
                  Spróbuj zmienić kryteria wyszukiwania.
                </p>
              </div>
            ) : (
              <div
                className={
                  finalViewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'
                    : 'space-y-4 mt-6'
                }
              >
                {listings.map((listing) =>
                  finalViewMode === 'grid' ? (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onNavigate={() => navigateToListing(listing.id)}
                      onFavorite={() => toggleFavorite(listing.id)}
                      isFavorite={favorites.includes(listing.id)}
                      message={favMessages[listing.id]}
                    />
                  ) : (
                    <ListingListView
                      key={listing.id}
                      listings={[listing]}
                      onNavigate={() => navigateToListing(listing.id)}
                      onFavorite={() => toggleFavorite(listing.id)}
                      favorites={favorites}
                      favMessages={favMessages}
                    />
                  )
                )}
              </div>
            )}

            {/* Przycisk "Pokaż więcej" lub indykator ładowania dla kolejnych stron */}
            {currentPage < totalPages && (
              <div className="text-center mt-8">
                {loading ? (
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
                ) : (
                  <button
                    onClick={handleShowMore}
                    className="px-8 py-3 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-[#35530A] hover:bg-[#44671A]"
                  >
                    Pokaż więcej
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(ListingsPage);
