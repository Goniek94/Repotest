import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiBarChart2, FiHeart, FiAlertCircle } from 'react-icons/fi';
import { Heart, Eye, Edit, Trash, RefreshCw, AlertTriangle, CheckCircle, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import ListingsService from '../../../services/api/listingsApi';
import ListingListItem from '../../ListingsView/display/list/ListingListItem';
import UserListingListItem from './UserListingListItem';
import ListingTabs from './ListingTabs';

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
    if (window.confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) {
      setDeletingId(id);
      ListingsService.delete(id)
        .then(() => {
          setAllListings(prev => prev.filter(listing => listing._id !== id));
          toast.success('Ogłoszenie zostało usunięte.');
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
    if (window.confirm('Czy na pewno chcesz zakończyć to ogłoszenie? Zostanie ono przeniesione do archiwalnych.')) {
      setEndingId(id);
      
      // Tworzymy FormData z aktualizacją statusu
      const formData = new FormData();
      formData.append('status', 'archiwalne');
      
      ListingsService.update(id, formData)
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
          
          toast.success('Ogłoszenie zostało zakończone i przeniesione do archiwalnych.');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Sekcja powiadomień */}
      {notifications.length > 0 && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 p-4 rounded-sm">
          <div className="flex items-start">
            <AlertTriangle className="text-yellow-500 w-5 h-5 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Uwaga! Masz ogłoszenia, które wkrótce wygasną:</h3>
              <div className="mt-2 space-y-2">
                {notifications.map(ad => (
                  <div key={ad._id} className="flex justify-between items-center bg-white p-3 rounded-sm border border-yellow-100">
                    <div>
                      <span className="font-medium">{ad.headline || `${ad.brand} ${ad.model}`}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        Kończy się za <span className="font-bold text-yellow-600">{calculateDaysRemaining(ad.createdAt)}</span> dni
                      </span>
                    </div>
                    <button
                      onClick={() => handleExtend(ad._id)}
                      disabled={extendingId === ad._id}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-sm text-sm flex items-center"
                    >
                      {extendingId === ad._id ? (
                        <>
                          <span className="animate-spin mr-1">⟳</span> Przedłużanie...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1" /> Przedłuż o 30 dni
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white p-4 sm:p-6 rounded-sm border border-green-100 shadow-sm">
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
          <div className="py-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[#35530A] border-t-transparent rounded-full mb-2"></div>
            <p>Ładowanie ogłoszeń...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>Brak ogłoszeń w tej kategorii.</p>
            {activeTab === 'active' && (
              <button
                onClick={() => navigate('/dodaj-ogloszenie')}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm flex items-center text-sm mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" /> Dodaj pierwsze ogłoszenie
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map(listing => (
              <UserListingListItem
                key={listing._id}
                listing={{
                  id: listing._id,
                  _id: listing._id, // Dodajemy również _id dla pewności
                  // Ensure we pass the best available image, respecting mainImageIndex when available
                  image: (listing.images && listing.images.length > 0) 
                    ? listing.images[typeof listing.mainImageIndex === 'number' && listing.mainImageIndex >= 0 && listing.mainImageIndex < listing.images.length 
                        ? listing.mainImageIndex 
                        : 0] 
                    : listing.image || '/images/auto-788747_1280.jpg',
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
  );
};

export default UserListings;