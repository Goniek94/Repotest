// src/components/listings/ListingsPage.js
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// ✅ poprawne ścieżki względem tego pliku
import SearchForm from '../search/SearchFormUpdated';
import ListingControls from './controls/ListingControls';
import ListingListItem from './display/list/ListingListItem';
import ListingCard from './display/grid/ListingCard';

import AdsService from '../../services/ads';
import getImageUrl from '../../utils/responsive/getImageUrl';
import { useAuth } from '../../contexts/AuthContext';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Inicjalizacja filtrów z URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilters = {};

    params.forEach((value, key) => {
      if (value === 'true' || value === 'false') {
        urlFilters[key] = value === 'true';
      } else if (!isNaN(value) && value !== '') {
        urlFilters[key] = Number(value);
      } else {
        urlFilters[key] = value;
      }
    });

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }

    const page = parseInt(params.get('page') || '1', 10);
    setCurrentPage(page || 1);
  }, [location.search]);

  const { isMobile } = useResponsiveContext();

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);

      let sortBy = 'createdAt';
      let order = 'desc';

      switch (sortType) {
        case 'price-asc': sortBy = 'price'; order = 'asc'; break;
        case 'price-desc': sortBy = 'price'; order = 'desc'; break;
        case 'year-asc': sortBy = 'year'; order = 'asc'; break;
        case 'year-desc': sortBy = 'year'; order = 'desc'; break;
        case 'mileage-asc': sortBy = 'mileage'; order = 'asc'; break;
        case 'mileage-desc': sortBy = 'mileage'; order = 'desc'; break;
        default: break;
      }

      const requestFilters = { ...filters };
      if (offerType !== 'all') requestFilters.condition = offerType;
      if (onlyFeatured) requestFilters.listingType = 'wyróżnione';

      const result = await AdsService.search({
        ...requestFilters,
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        order,
      });

      const response = result?.data || {};

      function getMatchLabel(ad) {
        if (ad.match_score >= 100) return 'Dopasowanie: 100 pkt (idealne)';
        if (ad.match_score >= 50) return `Dopasowanie: ${ad.match_score} pkt`;
        if (ad.match_score > 0) return `Podobne ogłoszenie (${ad.match_score} pkt)`;
        return null;
        }

      const mappedListings = (response.ads || []).map((ad) => {
        const brand = ad.brand || ad.make || '';

        return {
          _id: ad._id,
          id: String(ad._id),
          brand,
          make: brand,
          model: ad.model || '',
          headline:
            ad.headline ||
            (ad.description ? ad.description.substring(0, 50) + '...' : `${ad.year}, ${ad.mileage || 0} km`),
          shortDescription:
            ad.shortDescription ||
            (ad.description ? ad.description.substring(0, 50) + '...' : `${ad.year}, ${ad.mileage || 0} km`),
          title: `${brand} ${ad.model || ''}`.trim() || 'Ogłoszenie',
          subtitle:
            ad.shortDescription ||
            (ad.description ? (ad.description || '').substring(0, 50) + '...' : `${ad.year}, ${ad.mileage || 0} km`),
          price: ad.price || 0,
          year: ad.year || 0,
          fuelType: ad.fuelType || 'Nie podano',
          fuel: ad.fuelType || 'Nie podano',
          engineCapacity: ad.engineSize
            ? `${ad.engineSize} cm³`
            : ad.capacity
            ? `${ad.capacity} cm³`
            : 'Nie podano',
          power: ad.power ? `${ad.power} KM` : 'Nie podano',
          mileage: ad.mileage || 0,
          drive: ad.drive || 'Nie podano',
          location: ad.voivodeship || 'Polska',
          city: ad.city || 'Nie podano',
          transmission: ad.transmission || 'Nie podano',
          gearbox: ad.transmission || 'Nie podano',
          sellerType: ad.sellerType || 'Prywatny',
          images: ad.images || [],
          mainImageIndex: typeof ad.mainImageIndex === 'number' ? ad.mainImageIndex : 0,
          image:
            ad.images && ad.images.length > 0
              ? getImageUrl(
                  typeof ad.mainImageIndex === 'number' &&
                    ad.mainImageIndex >= 0 &&
                    ad.mainImageIndex < ad.images.length
                    ? ad.images[ad.mainImageIndex]
                    : ad.images[0]
                )
              : '/images/auto-788747_1280.jpg',
          featured: ad.listingType === 'wyróżnione',
          listingType: ad.listingType,
          condition: ad.condition || 'Używany',
          match_score: ad.match_score || 0,
          is_featured: ad.is_featured || 0,
          matchLabel: getMatchLabel(ad),
        };
      });

      const exact = [];
      const similar = [];
      const remaining = [];
      mappedListings.forEach((ad) => {
        if (ad.match_score >= 50) exact.push(ad);
        else if (ad.match_score > 0) similar.push(ad);
        else remaining.push(ad);
      });

      const finalListings = [...exact, ...similar, ...remaining];

      setListings(finalListings);
      setTotalPages(response.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Błąd podczas pobierania ogłoszeń:', err);
      setError('Wystąpił błąd podczas ładowania ogłoszeń. Spróbuj odświeżyć stronę.');
    } finally {
      setLoading(false);
    }
  }, [sortType, offerType, onlyFeatured, currentPage, filters, itemsPerPage]);

  // Pobierz ogłoszenia
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Pobranie ulubionych użytkownika
  const fetchUserFavorites = useCallback(async () => {
    if (!user) return;
    try {
      setFavoritesLoading(true);
      const response = await AdsService.getFavorites();
      if (response?.data?.success && response?.data?.data?.favorites) {
        const favoriteIds = response.data.data.favorites.map((fav) => String(fav._id));
        setFavorites(favoriteIds);
      }
    } catch (err) {
      console.error('Błąd podczas pobierania ulubionych:', err);
    } finally {
      setFavoritesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserFavorites();
  }, [fetchUserFavorites]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const toggleFavorite = useCallback(
    async (id) => {
      if (!user) {
        toast.error('Musisz być zalogowany, aby dodać ogłoszenie do ulubionych');
        return;
      }
      try {
        const adId = String(id);
        const isFav = favorites.includes(adId);

        if (isFav) {
          await AdsService.removeFromFavorites(adId);
          toast.success('Usunięto z ulubionych');
        } else {
          await AdsService.addToFavorites(adId);
          toast.success('Dodano do ulubionych');
        }

        const msg = isFav ? 'Usunięto z ulubionych' : 'Dodano do ulubionych';

        setFavorites((prev) => (isFav ? prev.filter((x) => x !== adId) : [...prev, adId]));
        setFavMessages((prev) => ({ ...prev, [adId]: msg }));

        setTimeout(() => {
          setFavMessages((prev) => ({ ...prev, [adId]: null }));
        }, 2000);
      } catch (err) {
        console.error('Błąd przy aktualizacji ulubionych:', err);
        toast.error('Wystąpił błąd podczas aktualizacji ulubionych');
      }
    },
    [favorites, user]
  );

  const handleShowMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const navigateToListing = useCallback(
    (id) => {
      navigate(`/listing/${id}`);
    },
    [navigate]
  );

  const finalViewMode = useMemo(() => (isMobile ? 'list' : viewMode), [isMobile, viewMode]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="wrapper py-8 sm:py-10 md:py-12 lg:py-16 space-y-6">
        <div className="section">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white px-6 py-2.5 rounded shadow-md hover:shadow-lg transition-all duration-300 bg-[#35530A] hover:bg-[#44671A]"
            >
              {searchOpen ? 'Ukryj wyszukiwarkę' : 'Pokaż wyszukiwarkę'}
            </button>
          </div>

          {searchOpen && (
            <SearchForm initialValues={filters} onFilterChange={handleFilterChange} />
          )}

          <ListingControls
            sortType={sortType}
            setSortType={setSortType}
            offerType={offerType}
            setOfferType={setOfferType}
            onlyFeatured={onlyFeatured}
            setOnlyFeatured={setOnlyFeatured}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        <div className="section">
          {loading && currentPage === 1 ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#35530A]" />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mt-4">
              {error}
            </div>
          ) : (
            <>
              {listings.length === 0 ? (
                <div className="bg-white shadow-md rounded-md p-8 text-center mt-4">
                  <h3 className="text-xl font-semibold">Nie znaleziono ogłoszeń</h3>
                  <p className="mt-2 text-gray-600">Spróbuj zmienić kryteria wyszukiwania.</p>
                </div>
              ) : (
                <div
                  className={
                    finalViewMode === 'grid'
                      ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6'
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
                        isFavorite={favorites.includes(String(listing.id))}
                        message={favMessages[listing.id]}
                      />
                    ) : (
                      <ListingListItem
                        key={listing.id}
                        listing={listing}
                        onNavigate={() => navigateToListing(listing.id)}
                        onFavorite={() => toggleFavorite(listing.id)}
                        isFavorite={favorites.includes(String(listing.id))}
                        message={favMessages[listing.id]}
                      />
                    )
                  )}
                </div>
              )}

              {currentPage < totalPages && (
                <div className="text-center mt-8">
                  {loading ? (
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]" />
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
    </div>
  );
}

export default React.memo(ListingsPage);
