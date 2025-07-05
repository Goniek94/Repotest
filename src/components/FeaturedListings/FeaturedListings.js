import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSync } from 'react-icons/fa';
// ✅ POPRAWKA: Używaj naprawionego AdsService
import AdsService from '../../services/ads';
import MainFeatureListing from './MainFeatureListing';
import SmallListingCard from './SmallListingCard';

const FeaturedListings = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [hotListings, setHotListings] = useState([]);
  const [normalListings, setNormalListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sprawdzenie, czy użytkownik właśnie został wylogowany
  useEffect(() => {
    const justLoggedOut = localStorage.getItem('justLoggedOut');
    if (justLoggedOut === 'true') {
      setShowLogoutMessage(true);
      localStorage.removeItem('justLoggedOut');
      
      const timer = setTimeout(() => {
        setShowLogoutMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // ✅ ULEPSZONA funkcja pobierania ogłoszeń z rotacją
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📱 Pobieranie rotowanych ogłoszeń...');
      
      // ✅ Dodajemy timestamp, aby wymusić odświeżenie cache przeglądarki
      const timestamp = new Date().getTime();
      const response = await AdsService.getRotatedListings();
      console.log('📦 Odpowiedź z API:', response);
      
      // ✅ Sprawdź strukturę odpowiedzi i obsługuj różne formaty
      let data = response;
      if (response && response.data) {
        data = response.data;
      }
      
      console.log('📦 Przetworzone dane:', JSON.stringify(data, null, 2));
      console.log('📊 Liczba ogłoszeń w odpowiedzi:', 
        data?.featured?.length || 0, 
        data?.hot?.length || 0, 
        data?.regular?.length || 0
      );

      // ✅ Sprawdzenie czy dane są kompletne
      if (data && data.featured && data.hot && data.regular) {
        console.log('✅ Dane są kompletne!');
        console.log(`Featured: ${data.featured.length}, Hot: ${data.hot.length}, Regular: ${data.regular.length}`);
        
        setFeaturedListings(data.featured || []);
        setHotListings(data.hot || []);
        setNormalListings(data.regular || []);
        setError(null);
      } else {
        console.warn('⚠️ Niepełna odpowiedź API, próbuję fallback...');
        throw new Error('Niepełna odpowiedź API');
      }
    } catch (err) {
      console.error('❌ Błąd pobierania rotowanych ogłoszeń:', err);
      
      // ✅ FALLBACK - pobierz wszystkie ogłoszenia i podziel je
      try {
        console.log('🔄 Fallback: pobieranie wszystkich ogłoszeń...');
        
        const fallbackResponse = await AdsService.getAll({ limit: 50 });
        console.log('📦 Fallback response:', fallbackResponse);
        
        // ✅ Wyciągnij tablicę ogłoszeń
        let allAds = [];
        if (fallbackResponse && fallbackResponse.data) {
          if (Array.isArray(fallbackResponse.data)) {
            allAds = fallbackResponse.data;
          } else if (fallbackResponse.data.ads && Array.isArray(fallbackResponse.data.ads)) {
            allAds = fallbackResponse.data.ads;
          }
        } else if (Array.isArray(fallbackResponse)) {
          allAds = fallbackResponse;
        }

        console.log(`📊 Znaleziono ${allAds.length} ogłoszeń`);

        if (allAds.length > 0) {
          // ✅ Filtruj tylko ważne ogłoszenia
          const validAds = allAds.filter(ad => 
            ad && ad._id && ad.brand && ad.model
          );

          console.log(`✅ ${validAds.length} ważnych ogłoszeń po filtrowaniu`);

          // ✅ Podziel na kategorie według listingType
          const featured = validAds.filter(ad => {
            if (!ad.listingType) return false;
            const type = ad.listingType.toLowerCase();
            return type === 'wyróżnione' || type === 'featured' || type === 'premium';
          }).slice(0, 2);

          const hot = validAds.filter(ad => {
            if (!ad.listingType) return false;
            const type = ad.listingType.toLowerCase();
            return type === 'wyróżnione' || type === 'featured' || type === 'premium';
          }).slice(2, 6);

          const regular = validAds.filter(ad => {
            if (!ad.listingType) return true;
            const type = ad.listingType.toLowerCase();
            return type !== 'wyróżnione' && type !== 'featured' && type !== 'premium';
          }).slice(0, 6);

          console.log(`📊 Podział: Featured(${featured.length}), Hot(${hot.length}), Regular(${regular.length})`);

          setFeaturedListings(featured);
          setHotListings(hot);
          setNormalListings(regular);
          setError(null);
        } else {
          throw new Error('Brak ogłoszeń w bazie danych');
        }
      } catch (fallbackErr) {
        console.error('❌ Fallback też się nie udał:', fallbackErr);
        setError('Nie udało się załadować ogłoszeń');
        
        // ✅ Ustaw puste tablice żeby nie było błędów renderowania
        setFeaturedListings([]);
        setHotListings([]);
        setNormalListings([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Odświeżanie ogłoszeń
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
  };

  // Pobieranie ogłoszeń przy montowaniu komponentu
  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-[#35530A] border-t-transparent rounded-full mb-4"></div>
        <div className="text-xl text-gray-600">Ładowanie ogłoszeń...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button 
            onClick={handleRefresh}
            className="bg-[#35530A] text-white px-4 py-2 rounded hover:bg-[#2A4208] transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Komunikat o wylogowaniu */}
      {showLogoutMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded shadow-lg flex items-center">
          <FaCheckCircle className="text-green-500 mr-2" />
          <span>Zostałeś pomyślnie wylogowany</span>
          <button 
            onClick={() => setShowLogoutMessage(false)}
            className="ml-4 text-green-800 hover:text-green-900 focus:outline-none"
          >
            <FaTimesCircle />
          </button>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 flex-grow">
            OGŁOSZENIA
            <div className="w-16 sm:w-24 h-0.5 bg-[#35530A] mx-auto mt-2" />
          </h1>
          <button 
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="bg-[#35530A] text-white px-3 py-2 rounded-[2px] hover:bg-[#2A4208] transition-colors text-sm font-medium flex items-center"
          >
            <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Odśwież
          </button>
        </div>

        {/* ✅ Sprawdzanie czy są ogłoszenia */}
        {featuredListings.length === 0 && hotListings.length === 0 && normalListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <div className="text-xl text-gray-600 mb-4">Brak ogłoszeń do wyświetlenia</div>
            <p className="text-gray-500">Dodaj pierwsze ogłoszenia lub sprawdź połączenie z bazą danych</p>
          </div>
        ) : (
          <>
            {/* 2 duże ogłoszenia */}
            {featuredListings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                {featuredListings.map((listing) => (
                  <MainFeatureListing key={listing._id} listing={listing} />
                ))}
              </div>
            )}
            
            {/* 4 mniejsze ogłoszenia - "gorące oferty" */}
            {hotListings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                {hotListings.map((listing) => (
                  <SmallListingCard 
                    key={listing._id} 
                    listing={listing} 
                    showHotOffer={true} 
                  />
                ))}
              </div>
            )}
            
            {/* Pasek reklamowy */}
            <div className="bg-white shadow-md rounded-[2px] h-32 sm:h-40 lg:h-48 mb-4 sm:mb-6 lg:mb-8 flex items-center justify-center">
              <span className="text-lg sm:text-xl text-gray-400">Miejsce na reklamę</span>
            </div>
            
            {/* 6 małych ogłoszeń - standardowe */}
            {normalListings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {normalListings.map((listing) => (
                  <SmallListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Przycisk na dole sekcji */}
        <div className="flex justify-center mt-8">
          <Link
            to="/listings"
            className="bg-[#35530A] text-white px-6 py-2.5 rounded-[2px] hover:bg-[#2A4208] transition-colors text-sm font-medium"
          >
            Przejdź do ogłoszeń
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;
