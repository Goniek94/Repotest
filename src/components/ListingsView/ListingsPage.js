import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CompactSearch from './search/CompactSearch';
import ListingControls from './controls/ListingControls';
import ListingListView from './display/list/ListingListView';
import ListingCard from './display/grid/ListingCard';
import listingsService from '../../services/listings.service';

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
    
    // Ustaw filtry na podstawie parametrów URL, jeśli są jakieś parametry
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

  // Dane przykładowe dla różnych marek
  const getDefaultDataByMake = (make) => {
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
      }
    };
    
    return defaultData[make] || { 
      fuel: 'Benzyna', 
      power: '150 KM', 
      engineCapacity: '1800 cm³', 
      drive: 'Przedni',
      city: 'Warszawa'
    };
  };

  // Funkcja do pobierania danych z API
  const fetchListings = async () => {
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
        default: break;
      }
      
      // Dodajemy offerType do filtrów
      const requestFilters = { ...filters };
      if (offerType !== 'all') {
        requestFilters.condition = offerType;
      }
      
      if (onlyFeatured) {
        requestFilters.featured = true;
      }
      
      // Wywołanie API
      const response = await listingsService.getListings(
        requestFilters,
        currentPage,
        itemsPerPage,
        sortBy,
        order
      );
      
      console.log("Dane z API:", response.ads);
      
      // Mapowanie danych z API do formatu oczekiwanego przez komponenty
      const mappedListings = (response.ads || []).map(ad => {
        // Pobieramy przykładowe dane dla danej marki
        const defaultData = getDefaultDataByMake(ad.make);
        
        // Ustawiamy specjalny przebieg dla demonstracji
        const mileageValue = ad.make === 'Audi' ? 45000 : (ad.make === 'Ford' ? 75000 : (ad.mileage || 20000));

        return {
          id: ad._id,
          title: `${ad.make} ${ad.model}`,
          subtitle: ad.description ? ad.description.substring(0, 50) + '...' : `${ad.year}, ${mileageValue} km`,
          price: ad.price || 0,
          year: ad.year || 0,
          
          // Używamy danych z API, jeśli istnieją, lub domyślnych z funkcji getDefaultDataByMake
          fuel: ad.fuelType || defaultData.fuel,
          engineCapacity: defaultData.engineCapacity,
          power: defaultData.power,
          mileage: mileageValue,
          drive: defaultData.drive,
          location: 'Polska',
          city: defaultData.city,
          gearbox: ad.transmission || 'Automatyczna',
          sellerType: 'Prywatny',
          image: '/images/auto-788747_1280.jpg',
          featured: ad.listingType === 'wyróżnione' || false,
          condition: 'Używany'
        };
      });

      setListings(mappedListings);
      setTotalPages(response.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Błąd pobierania ogłoszeń:", err);
      setError("Wystąpił błąd podczas ładowania ogłoszeń. Spróbuj odświeżyć stronę.");
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie danych przy pierwszym renderowaniu i zmianach parametrów
  useEffect(() => {
    fetchListings();
  }, [sortType, offerType, onlyFeatured, currentPage, filters]);

  // Obsługa filtrów z CompactSearch
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Resetuj stronę przy zmianie filtrów
  };

  // Obsługa dodawania/usuwania z ulubionych
  const toggleFavorite = async (id) => {
    try {
      // Możesz tu dodać wywołanie API jeśli jest zaimplementowane
      // await listingsService.toggleFavorite(id);
      
      const isFav = favorites.includes(id);
      const msg = isFav ? 'Usunięto z ulubionych' : 'Dodano do ulubionych';
      
      setFavorites(prev => isFav ? prev.filter(x => x !== id) : [...prev, id]);
      setFavMessages(prev => ({ ...prev, [id]: msg }));
      
      setTimeout(() => {
        setFavMessages(prev => ({ ...prev, [id]: null }));
      }, 2000);
    } catch (err) {
      console.error("Błąd dodawania do ulubionych:", err);
    }
  };

  // Obsługa przycisku "Pokaż więcej"
  const handleShowMore = () => {
    setCurrentPage(prev => prev + 1);
  };
  
  const navigateToListing = (id) => navigate(`/listing/${id}`);

  const finalViewMode = isMobile ? 'list' : viewMode;

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
                <p className="mt-2 text-gray-600">Spróbuj zmienić kryteria wyszukiwania.</p>
              </div>
            ) : (
              <div className={
                finalViewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'
                  : 'space-y-4 mt-6'
              }>
                {listings.map(listing => (
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
                ))}
              </div>
            )}

            {/* Przycisk "Pokaż więcej" lub indykator ładowania{/* Przycisk "Pokaż więcej" lub indykator ładowania dla kolejnych stron */}
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

export default ListingsPage;