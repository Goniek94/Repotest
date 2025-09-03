// src/components/listings/ListingsPage.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import SearchForm from '../search/SearchFormUpdated';
import ListingControls from './controls/ListingControls';
import ListingListItem from './display/list/ListingListItem';
import ListingCard from './display/grid/ListingCard';
import SmallListingCard from '../FeaturedListings/SmallListingCard';

import AdsService from '../../services/ads';
import getImageUrl from '../../utils/responsive/getImageUrl';
import { useAuth } from '../../contexts/AuthContext';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

function ListingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useResponsiveContext();

  // === Stany danych ===
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  // === Stany UI ===
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortType, setSortType] = useState('none');
  const [offerType, setOfferType] = useState('all');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [viewMode, setViewMode] = useState(isMobile ? 'grid' : 'list'); // 'list' | 'grid'
  const [itemsPerPage] = useState(30);
  const [favorites, setFavorites] = useState([]);
  const [favMessages, setFavMessages] = useState({});
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Inicjalizacja z URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilters = {};

    params.forEach((value, key) => {
      if (value === 'true' || value === 'false') urlFilters[key] = value === 'true';
      else if (!isNaN(value) && value !== '') urlFilters[key] = Number(value);
      else urlFilters[key] = value;
    });

    if (Object.keys(urlFilters).length > 0) setFilters(urlFilters);

    const page = parseInt(params.get('page') || '1', 10);
    setCurrentPage(page || 1);
  }, [location.search]);

  // Pobieranie ogłoszeń
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);

      let sortBy = 'createdAt';
      let order = 'desc';

      switch (sortType) {
        case 'price-asc':     sortBy = 'price';   order = 'asc';  break;
        case 'price-desc':    sortBy = 'price';   order = 'desc'; break;
        case 'year-asc':      sortBy = 'year';    order = 'asc';  break;
        case 'year-desc':     sortBy = 'year';    order = 'desc'; break;
        case 'mileage-asc':   sortBy = 'mileage'; order = 'asc';  break;
        case 'mileage-desc':  sortBy = 'mileage'; order = 'desc'; break;
        default: break;
      }

      const requestFilters = { ...filters };
      if (offerType !== 'all') {
        if (offerType === 'private') {
          requestFilters.sellerType = 'Prywatny';
        } else if (offerType === 'dealer') {
          requestFilters.sellerType = 'Firma';
        }
      }
      if (onlyFeatured) requestFilters.listingType = 'wyróżnione';

      const result = await AdsService.search({
        ...requestFilters,
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        order,
      });

      const response = result?.data || {};

      const getMatchLabel = (ad) => {
        if (ad.match_score >= 100) return 'Dopasowanie: 100 pkt (idealne)';
        if (ad.match_score >= 50) return `Dopasowanie: ${ad.match_score} pkt`;
        if (ad.match_score > 0) return `Podobne ogłoszenie (${ad.match_score} pkt)`;
        return null;
      };

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

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Ulubione
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

  // Zmiana filtrów z formularza
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Ulubione toggle
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


  const navigateToListing = useCallback(
    (id) => {
      navigate(`/listing/${id}`);
    },
    [navigate]
  );

  // Na mobilnych również używamy widoku kartowego
  const finalViewMode = useMemo(() => viewMode, [viewMode]);

  // === R E N D E R ===
  return (
    <div className="min-h-screen bg-white">
      <div className="py-4 sm:py-6 md:py-8 lg:py-12 pb-8 sm:pb-12 md:pb-16 lg:pb-20 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Przycisk nad kartą - zoptymalizowany dla mobile */}
        <div className="flex justify-center px-2 sm:px-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-md hover:shadow-lg transition bg-[#35530A] hover:bg-[#44671A] text-sm sm:text-base"
          >
            {searchOpen ? 'Ukryj wyszukiwarkę' : 'Pokaż wyszukiwarkę'}
          </button>
        </div>

        {/* SearchForm - zoptymalizowany padding dla mobile */}
        {searchOpen && (
          <div className="max-w-6xl mx-auto px-2 sm:px-4">
            <SearchForm initialValues={filters} onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Karta z filtrami - bez tła */}
        <div className="max-w-6xl mx-auto mx-2 sm:mx-4 md:mx-auto">
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

        {/* Lista ogłoszeń - zoptymalizowany padding dla mobile */}
        <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 md:px-0">
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
                      // Identyczny układ jak na homepage - standardowe ogłoszenia
                      ? 'grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 sm:mt-6'
                      // Widok listowy - mniejsze odstępy na mobile
                      : 'space-y-3 sm:space-y-4 mt-4 sm:mt-6'
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

              {/* Paginacja */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 sm:mt-8 space-x-2">
                  {/* Poprzednia strona */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Poprzednia
                  </button>

                  {/* Numery stron */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            currentPage === pageNum
                              ? 'bg-[#35530A] text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Następna strona */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Następna
                  </button>
                </div>
              )}

              {/* Informacja o liczbie wyników */}
              {listings.length > 0 && (
                <div className="text-center mt-4 text-sm text-gray-600">
                  Strona {currentPage} z {totalPages} ({listings.length} ogłoszeń na tej stronie)
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
