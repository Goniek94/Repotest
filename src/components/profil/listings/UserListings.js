import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2 } from 'react-icons/fi';
import { Heart, Edit, Trash, RefreshCw, AlertTriangle, CheckCircle, Plus, FileText, Eye, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import ListingsService from '../../../services/api/listingsApi';
import UserListingListItem from './UserListingListItem';
import GridListingCard from '../../listings/GridListingCard';
import useResponsiveLayout from '../../../hooks/useResponsiveLayout';

// Klucze localStorage dla wersji roboczych
const DRAFT_STORAGE_KEY = 'auto_sell_draft_form';

const UserListings = memo(() => {
  // Stany komponentu
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();
  const [activeTab, setActiveTab] = useState('active');
  const [allListings, setAllListings] = useState([]);
  const [localDrafts, setLocalDrafts] = useState([]); // Wersje robocze z localStorage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extendingId, setExtendingId] = useState(null); // ID ogłoszenia, które jest obecnie przedłużana
  const [deletingId, setDeletingId] = useState(null); // ID ogłoszenia, które jest obecnie usuwane
  const [endingId, setEndingId] = useState(null); // ID ogłoszenia, które jest obecnie archiwizowane
  const [notifications, setNotifications] = useState([]); // Powiadomienia o kończących się ogłoszeniach

  // Funkcja do pobierania wersji roboczych z localStorage
  const getLocalDrafts = () => {
    try {
      const drafts = localStorage.getItem(DRAFT_STORAGE_KEY);
      return drafts ? JSON.parse(drafts) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania wersji roboczych:', error);
      return [];
    }
  };

  // Funkcja do usuwania wersji roboczej z localStorage
  const deleteLocalDraft = (draftIndex) => {
    try {
      const drafts = getLocalDrafts();
      const updatedDrafts = drafts.filter((_, index) => index !== draftIndex);
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedDrafts));
      setLocalDrafts(updatedDrafts);
      toast.success('Wersja robocza została usunięta.');
      return true;
    } catch (error) {
      console.error('Błąd podczas usuwania wersji roboczej:', error);
      toast.error('Błąd podczas usuwania wersji roboczej.');
      return false;
    }
  };

  // Funkcja do kontynuowania wersji roboczej - przekierowanie do formularza
  const continueLocalDraft = (draftIndex) => {
    try {
      const drafts = getLocalDrafts();
      if (drafts[draftIndex]) {
        // Zapisz dane wersji roboczej jako tymczasowe dane formularza
        const draftData = { ...drafts[draftIndex] };
        delete draftData.draftName;
        delete draftData.savedAt;
        
        // Zapisz jako tymczasowe dane do załadowania w formularzu
        localStorage.setItem('auto_sell_temp_form', JSON.stringify(draftData));
        
        // Przekieruj do formularza z flagą, że to kontynuacja wersji roboczej
        navigate('/dodaj-ogloszenie?from=draft');
        
        toast.success('Wersja robocza została załadowana do formularza.');
      }
    } catch (error) {
      console.error('Błąd podczas ładowania wersji roboczej:', error);
      toast.error('Błąd podczas ładowania wersji roboczej.');
    }
  };

  // Pobieranie ogłoszeń użytkownika
  const fetchListings = () => {
    setLoading(true);
    setError(null); // Resetowanie błędu przed nowym zapytaniem
    
    ListingsService.getUserListings()
      .then((ads) => {
        // Sprawdzenie, czy dane są poprawne
        if (!ads || !Array.isArray(ads)) {
          setError('Otrzymano nieprawidłowe dane ogłoszeń. Spróbuj odświeżyć stronę.');
          setLoading(false);
          return;
        }
        
        // Przetwarzanie danych ogłoszeń - upewnienie się, że wszystkie pola są poprawne
        const processedAds = ads.map(ad => {
          // Upewnienie się, że images jest tablicą
          if (!ad.images || !Array.isArray(ad.images)) {
            ad.images = [];
          }
          
          // Sprawdzenie mainImageIndex
          if (typeof ad.mainImageIndex !== 'number' || ad.mainImageIndex < 0 || ad.mainImageIndex >= ad.images.length) {
            ad.mainImageIndex = 0;
          }
          
          return ad;
        });
        
        setAllListings(processedAds);

        // Generowanie powiadomień dla ogłoszeń, które wygasają wkrótce (tylko dla użytkownika, nie admina)
        const expiringAds = processedAds.filter(ad => {
          // expiresAt null = ogłoszenie admina, nie wygasa
          if (!ad.expiresAt || ad.status !== 'active') return false;
          const days = calculateDaysRemaining(ad.expiresAt);
          return days > 0 && days <= 3;
        });

        setNotifications(expiringAds);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Błąd podczas pobierania ogłoszeń:', err);
        setError('Błąd podczas pobierania ogłoszeń użytkownika. Spróbuj odświeżyć stronę.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings();
    // Załaduj wersje robocze z localStorage
    setLocalDrafts(getLocalDrafts());
  }, []);

  // Odświeżanie wersji roboczych przy zmianie zakładki na drafts
  useEffect(() => {
    if (activeTab === 'drafts') {
      setLocalDrafts(getLocalDrafts());
    }
  }, [activeTab]);

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
        return allListings.filter(listing => listing.status === 'active');
      case 'drafts':
        return allListings.filter(listing => 
          listing.status === 'pending' || listing.status === 'needs_changes' || listing.isVersionRobocza
        );
      case 'completed':
        return allListings.filter(listing => listing.status === 'archived' || listing.status === 'sold');
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
                return { ...listing, status: 'archived' };
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
    navigate(`/profil/edytuj-ogloszenie/${id}`);
  };
  

  // Przekierowanie do szczegółów ogłoszenia
  const handleNavigate = (id) => {
    navigate(`/listing/${id}`);
  };

  return (
    <div className="bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-0 sm:px-1 lg:px-2 py-0 sm:py-1 lg:py-1">
        {/* Nagłówek - prosty i czytelny jak w Messages */}
        <div className="bg-[#35530A] rounded-t-2xl shadow-lg p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Moje ogłoszenia
              </h1>
            </div>
          </div>
        </div>

        {/* Mobile Layout - 5 kategorii ogłoszeń pod nagłówkiem jak w Messages */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200">
            <div className="px-2 py-2">
              <div className="flex justify-center gap-2 relative">
                {/* Lewa kreska separator */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
                {/* Prawa kreska separator */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
                {[
                  { id: 'active', label: 'Aktywne', icon: CheckCircle, count: allListings.filter(listing => listing.status === 'active').length },
                  { id: 'drafts', label: 'Wersje robocze', icon: FileText, count: allListings.filter(listing => listing.status === 'pending' || listing.status === 'needs_changes' || listing.isVersionRobocza).length + localDrafts.length },
                  { id: 'favorites', label: 'Ulubione', icon: Heart, count: allListings.filter(listing => listing.isFavorite).length },
                  { id: 'completed', label: 'Zakończone', icon: FiBarChart2, count: allListings.filter(listing => listing.status === 'archived' || listing.status === 'sold').length },
                  { id: 'add', label: 'Dodaj', icon: Plus, count: 0 }
                ].map(category => {
                  const Icon = category.icon;
                  const isActive = activeTab === category.id;
                  const hasCount = category.count > 0;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        if (category.id === 'add') {
                          navigate('/dodaj-ogloszenie');
                        } else {
                          setActiveTab(category.id);
                        }
                      }}
                      className={`
                        flex items-center justify-center
                        w-12 h-12 rounded-xl
                        transition-all duration-200
                        relative
                        ${isActive 
                          ? 'bg-[#35530A] text-white' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                        }
                      `}
                      title={category.label}
                    >
                      <Icon className="w-5 h-5" />
                      {hasCount && (
                        <div className={`
                          absolute -top-1 -right-1
                          w-5 h-5 
                          rounded-full text-xs font-bold 
                          flex items-center justify-center
                          ${isActive 
                            ? 'bg-white text-[#35530A]' 
                            : 'bg-red-500 text-white'
                          }
                        `}>
                          {category.count > 9 ? '9+' : category.count}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Główny kontener - identyczny layout jak Messages */}
        <div className="
          flex flex-col lg:flex-row
          min-h-[400px] sm:min-h-[450px] lg:h-[calc(100vh-150px)] max-h-[600px]
          bg-white rounded-b-2xl border border-gray-200 border-t-0 overflow-hidden
        " style={{
          boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.15), -3px 0 6px -1px rgba(0, 0, 0, 0.1), 3px 0 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Lewy panel - kategorie normalnej wielkości */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0 border-r border-gray-200">
            <div className="bg-white h-full">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4">KATEGORIE</h3>
                
                {/* Desktop - pełne przyciski pionowo jak na zdjęciu */}
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === 'active'
                        ? 'bg-[#35530A] text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">Aktywne ogłoszenia</span>
                    {allListings.filter(listing => listing.status === 'active').length > 0 && (
                      <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                        activeTab === 'active' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {allListings.filter(listing => listing.status === 'active').length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('drafts')}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === 'drafts'
                        ? 'bg-[#35530A] text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span className="font-medium">Wersja robocza</span>
                    {(allListings.filter(listing => listing.status === 'pending' || listing.status === 'needs_changes' || listing.isVersionRobocza).length + localDrafts.length) > 0 && (
                      <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                        activeTab === 'drafts' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {allListings.filter(listing => listing.status === 'pending' || listing.status === 'needs_changes' || listing.isVersionRobocza).length + localDrafts.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === 'favorites'
                        ? 'bg-[#35530A] text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    <span className="font-medium">Ulubione</span>
                    {allListings.filter(listing => listing.isFavorite).length > 0 && (
                      <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                        activeTab === 'favorites' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {allListings.filter(listing => listing.isFavorite).length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('completed')}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === 'completed'
                        ? 'bg-[#35530A] text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiBarChart2 className="w-5 h-5 mr-3" />
                    <span className="font-medium">Zakończone</span>
                    {allListings.filter(listing => listing.status === 'archived' || listing.status === 'sold').length > 0 && (
                      <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                        activeTab === 'completed' 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {allListings.filter(listing => listing.status === 'archived' || listing.status === 'sold').length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Informacja na dole panelu */}
              <div className="p-3 bg-[#35530A]/5 border-t border-gray-100">
                <p className="text-xs text-[#35530A] text-center font-medium">
                  Kliknij kategorię aby zobaczyć ogłoszenia
                </p>
              </div>
            </div>
          </div>

          {/* Prawy panel - zawartość z suwakiem */}
          <div className="flex-1 overflow-y-auto p-4">
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

            {/* Status ładowania */}
            {loading ? (
              <div className="py-12 text-center bg-white rounded-2xl shadow-lg">
                <div className="relative inline-block">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full mb-4"></div>
                  <div className="absolute inset-0 animate-ping w-12 h-12 border-4 border-blue-300 rounded-full opacity-20"></div>
                </div>
                <p className="text-slate-600 font-medium">Ładowanie ogłoszeń...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center bg-white rounded-2xl shadow-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 font-medium">{error}</p>
                <button 
                  onClick={() => fetchListings()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Spróbuj ponownie
                </button>
              </div>
            ) : listings.length === 0 && (activeTab !== 'drafts' || localDrafts.length === 0) ? (
              <div className="py-16 text-center bg-white rounded-2xl shadow-lg">
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
              <div>
                {/* Wersje robocze z localStorage - tylko w zakładce drafts */}
                {activeTab === 'drafts' && localDrafts.length > 0 && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#35530A]" />
                        Wersje robocze ({localDrafts.length})
                      </h3>
                      <div className="space-y-4">
                        {localDrafts.map((draft, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-sm shadow-md p-4 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {draft.draftName || `${draft.brand || 'Nieznana marka'} ${draft.model || 'Nieznany model'}`}
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                  <div>
                                    <span className="font-medium">Marka:</span> {draft.brand || 'Nie podano'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Model:</span> {draft.model || 'Nie podano'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Rok:</span> {draft.productionYear || 'Nie podano'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Cena:</span> {draft.price ? `${draft.price} PLN` : 'Nie podano'}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Zapisano: {draft.savedAt ? new Date(draft.savedAt).toLocaleString('pl-PL') : 'Nieznana data'}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => continueLocalDraft(index)}
                                  className="bg-[#35530A] text-white px-4 py-2 rounded-sm text-sm hover:bg-[#2D4A06] transition-colors flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Kontynuuj
                                </button>
                                <button
                                  onClick={() => deleteLocalDraft(index)}
                                  className="bg-red-500 text-white px-4 py-2 rounded-sm text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                  <Trash className="w-4 h-4" />
                                  Usuń
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Separator jeśli są też ogłoszenia z bazy danych */}
                    {listings.length > 0 && (
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Ogłoszenia w trakcie weryfikacji
                        </h3>
                      </div>
                    )}
                  </>
                )}

                {/* Ogłoszenia z bazy danych - zmniejszone odstępy */}
                <div className="space-y-2 lg:space-y-3">
                  {listings.map(listing => (
                    <UserListingListItem
                      key={listing._id}
                      listing={{
                        id: listing._id,
                        _id: listing._id, // Dodajemy również _id dla pewności
                        // Przekazujemy pełną tablicę obrazów i mainImageIndex - uproszczona i bezpieczna logika
                        images: Array.isArray(listing.images) ? listing.images : [],
                        mainImageIndex: typeof listing.mainImageIndex === 'number' && 
                                       listing.mainImageIndex >= 0 && 
                                       Array.isArray(listing.images) && 
                                       listing.mainImageIndex < listing.images.length 
                                          ? listing.mainImageIndex 
                                          : 0,
                        // Dodajemy również pojedyncze zdjęcie jako fallback
                        image: listing.image || (Array.isArray(listing.images) && listing.images.length > 0 ? listing.images[0] : null),
                        featured: listing.listingType === 'wyróżnione' || listing.listingType === 'featured',
                        title: `${listing.brand || ''} ${listing.model || ''}`.trim() || 'Brak tytułu',
                        subtitle: listing.headline || listing.shortDescription || '',
                        price: listing.price || 0,
                        year: listing.year || 'N/A',
                        mileage: listing.mileage || 0,
                        fuel: listing.fuelType || 'N/A',
                        power: listing.power || 'N/A',
                        engineCapacity: listing.engineSize || 'N/A',
                        drive: listing.drive || 'N/A',
                        transmission: listing.transmission || listing.gearbox || 'N/A',
                        countryOrigin: listing.countryOrigin || listing.origin || 'N/A',
                        sellerType: listing.sellerType || 'N/A',
                        city: listing.city || 'N/A',
                        location: listing.voivodeship || 'N/A',
                        status: listing.status || 'N/A',
                        views: listing.views || 0,
                        likes: listing.likes || 0,
                        createdAt: listing.createdAt || new Date().toISOString(),
                        expiresAt: listing.expiresAt,
                        brand: listing.brand || '',
                        model: listing.model || '',
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

UserListings.displayName = 'UserListings';

export default UserListings;
