import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiBarChart2, FiHeart, FiAlertCircle } from 'react-icons/fi';
import { Heart, Eye, Edit, Trash, RefreshCw, AlertTriangle, CheckCircle, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import ListingsService from '../../../services/api/listingsApi';
import ListingListItem from '../../ListingsView/display/list/ListingListItem';
import UserListingListItem from './UserListingListItem';
import ListingTabs from './ListingTabs';
import getImageUrl from '../../../utils/responsive/getImageUrl';

const UserListings = () => {
  // Stany komponentu
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extendingId, setExtendingId] = useState(null); // ID ogłoszenia, które jest obecnie przedłużane
  const [deletingId, setDeletingId] = useState(null); // ID ogłoszenia, które jest obecnie usuwane
  const [endingId, setEndingId] = useState(null); // ID ogłoszenia, które jest obecnie archiwizowane
  const [notifications, setNotifications] = useState([]); // Powiadomienia o kończących się ogłoszeniach

  // Pobieranie ogłoszeń użytkownika
  const fetchListings = () => {
    setLoading(true);
    ListingsService.getUserListings()
      .then((ads) => {
        setAllListings(ads);

        // Generowanie powiadomień dla ogłoszeń, które wygasają wkrótce (tylko dla użytkownika, nie admina)
        const expiringAds = ads.filter(ad => {
          // expiresAt null = ogłoszenie admina, nie wygasa
          if (!ad.expiresAt || ad.status !== 'opublikowane') return false;
          const days = calculateDaysRemaining(ad.expiresAt);
          return days > 0 && days <= 3;
        });

        setNotifications(expiringAds);
        setLoading(false);
      })
      .catch((err) => {
        setError('Błąd podczas pobierania ogłoszeń użytkownika.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Wyświetlanie powiadomień o kończących się ogłoszeniach
  useEffect(() => {
    notifications.forEach(ad => {
      const days = calculateDaysRemaining(ad.createdAt);
      toast.warning(
        <div>
          <p className="font-bold">Ogłoszenie kończy się za {days} dni!</p>
          <p className="text-sm">{ad.headline || `${ad.brand} ${ad.model}`}</p>
          <button 
            onClick={() => handleExtend(ad._id)}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-sm text-xs"
          >
            Przedłuż teraz
          </button>
        </div>,
        { autoClose: false }
      );
    });
  }, [notifications]);

  // Filtrowanie ogłoszeń na podstawie wybranej zakładki
  const getFilteredListings = () => {
    switch(activeTab) {
      case 'active':
        return allListings.filter(listing => listing.status === 'opublikowane');
      case 'drafts':
        return allListings.filter(listing => 
          listing.status === 'wersja robocza' || listing.isVersionRobocza
        );
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
  const calculateDaysRemaining = (expiresAt) => {
    if (!expiresAt) return null; // ogłoszenie admina, nie wygasa
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Obsługa ulubionych
  const toggleFavorite = (id) => {
    setAllListings(prev =>
      prev.map(listing =>
        listing._id === id ? { ...listing, isFavorite: !listing.isFavorite } : listing
      )
    );
  };

  // Przedłużenie ogłoszenia o kolejne 30 dni
  const handleExtend = (id) => {
    setExtendingId(id);
    ListingsService.extendListing(id)
      .then(response => {
        // Aktualizacja listy ogłoszeń po przedłużeniu
        setAllListings(prev =>
          prev.map(listing => {
            if (listing._id === id) {
              // Aktualizacja daty utworzenia na dzisiejszą (resetowanie licznika 30 dni)
              const updatedListing = { 
                ...listing, 
                createdAt: new Date().toISOString()
              };
              return updatedListing;
            }
            return listing;
          })
        );
        
        // Usunięcie tego ogłoszenia z powiadomień
        setNotifications(prev => prev.filter(ad => ad._id !== id));
        
        toast.success('Ogłoszenie zostało przedłużone o 30 dni!');
        setExtendingId(null);
      })
      .catch(err => {
        toast.error('Błąd podczas przedłużania ogłoszenia.');
        setExtendingId(null);
      });
  };

  // Usunięcie ogłoszenia
  const handleDelete = (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna!')) {
      setDeletingId(id);
      ListingsService.delete(id, true) // Przekazujemy confirmed=true
        .then(() => {
          setAllListings(prev => prev.filter(listing => listing._id !== id));
          toast.success('Ogłoszenie zostało trwale usunięte.');
          setDeletingId(null);
        })
        .catch(err => {
          toast.error('Błąd podczas usuwania ogłoszenia.');
          setDeletingId(null);
        });
    }
  };

  // Zakończenie ogłoszenia (zmiana statusu na archiwalny)
  const handleEnd = (id) => {
    if (window.confirm('Czy na pewno chcesz zakończyć to ogłoszenie? Zostanie ono przeniesione do archiwalnych. Możesz je przywrócić w ciągu 30 dni za opłatą.')) {
      setEndingId(id);
      
      ListingsService.finishListing(id)
        .then(() => {
          // Aktualizacja lokalnej listy ogłoszeń
          setAllListings(prev =>
            prev.map(listing => {
              if (listing._id === id) {
                return { ...listing, status: 'archiwalne' };
              }
              return listing;
            })
          );
          
          toast.success('Ogłoszenie zostało zakończone i przeniesione do archiwalnych. Możesz je przywrócić w ciągu 30 dni za opłatą.');
          setEndingId(null);
        })
        .catch(err => {
          toast.error('Błąd podczas kończenia ogłoszenia.');
          setEndingId(null);
        });
    }
  };

  // Przekierowanie do edycji ogłoszenia
  const handleEdit = (id) => {
    console.log(`Navigating to edit listing with ID: ${id}`);
    navigate(`/profil/edytuj-ogloszenie/${id}`);
  };
  

  // Przekierowanie do szczegółów ogłoszenia
  const handleNavigate = (id) => {
    navigate(`/listing/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sekcja powiadomień */}
        {notifications.length > 0 && (
          <div className="mb-6 relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-sm"></div>
            
            <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50/60 backdrop-blur-sm border border-amber-200/60 p-6 rounded-2xl shadow-xl shadow-amber-200/25">
              <div className="flex items-start">
                <AlertTriangle className="text-amber-500 w-6 h-6 mr-3 mt-1 drop-shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 text-lg mb-3">
                    Uwaga! Masz ogłoszenia, które wkrótce wygasną:
                  </h3>
                  <div className="space-y-3">
                    {notifications.map(ad => (
                      <div key={ad._id} className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-amber-100/80 shadow-md">
                        <div>
                          <span className="font-medium text-gray-900">{ad.headline || `${ad.brand} ${ad.model}`}</span>
                          <span className="ml-3 text-sm text-gray-600">
                            Kończy się za <span className="font-bold text-amber-600">{calculateDaysRemaining(ad.createdAt)}</span> dni
                          </span>
                        </div>
                        <button
                          onClick={() => handleExtend(ad._id)}
                          disabled={extendingId === ad._id}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          {extendingId === ad._id ? (
                            <>
                              <span className="animate-spin mr-2">⟳</span> Przedłużanie...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" /> Przedłuż o 30 dni
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Główny kontener */}
        <div className="bg-white border border-slate-200" style={{ 
          borderRadius: '2px', 
          boxShadow: '0 10px 25px -3px rgba(53, 83, 10, 0.1), 0 4px 6px -2px rgba(53, 83, 10, 0.05)' 
        }}>
          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Główne zakładki - użycie komponentu ListingTabs */}
            <ListingTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              counts={{
                active: allListings.filter(listing => listing.status === 'opublikowane').length,
                drafts: allListings.filter(listing => listing.status === 'wersja robocza' || listing.isVersionRobocza).length,
                completed: allListings.filter(listing => listing.status === 'archiwalne').length,
                favorites: allListings.filter(listing => listing.isFavorite).length
              }}
            />
            
            {/* Status ładowania */}
            {loading ? (
              <div className="py-12 text-center">
                <div className="relative inline-block">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full mb-4"></div>
                  <div className="absolute inset-0 animate-ping w-12 h-12 border-4 border-blue-300 rounded-full opacity-20"></div>
                </div>
                <p className="text-slate-600 font-medium">Ładowanie ogłoszeń...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="py-16 text-center">
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
            ) : (
              <div className="space-y-6 mt-8">
                {listings.map(listing => (
                  <UserListingListItem
                    key={listing._id}
                    listing={{
                      id: listing._id,
                      _id: listing._id, // Dodajemy również _id dla pewności
                      // Przekazujemy pełną tablicę obrazów i mainImageIndex
                      images: listing.images || [],
                      mainImageIndex: typeof listing.mainImageIndex === 'number' ? listing.mainImageIndex : 0,
                      image: (listing.images && listing.images.length > 0) 
                        ? getImageUrl(listing.images[typeof listing.mainImageIndex === 'number' && listing.mainImageIndex >= 0 && listing.mainImageIndex < listing.images.length 
                            ? listing.mainImageIndex 
                            : 0])
                        : listing.image ? getImageUrl(listing.image) : '/images/auto-788747_1280.jpg',
                      featured: listing.listingType === 'wyróżnione' || listing.listingType === 'featured',
                      title: `${listing.brand} ${listing.model}`,
                      subtitle: listing.headline || listing.shortDescription || '',
                      price: listing.price || 0,
                      year: listing.year,
                      mileage: listing.mileage,
                      fuel: listing.fuelType,
                      power: listing.power,
                      engineCapacity: listing.engineSize,
                      drive: listing.drive,
                      sellerType: listing.sellerType,
                      city: listing.city,
                      location: listing.voivodeship,
                      status: listing.status,
                      views: listing.views || 0,
                      likes: listing.likes || 0,
                      createdAt: listing.createdAt,
                      expiresAt: listing.expiresAt,
                      brand: listing.brand,
                      model: listing.model,
                    }}
                    onNavigate={handleNavigate}
                    onEdit={handleEdit}
                    onEnd={handleEnd}
                    onDelete={handleDelete}
                    onExtend={handleExtend}
                    onFavorite={toggleFavorite}
                    isFavorite={!!listing.isFavorite}
                    message={
                      listing.status === 'wersja robocza'
                        ? 'Wersja robocza – dokończ lub opublikuj'
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListings;
