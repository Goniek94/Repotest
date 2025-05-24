// FeaturedListings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api from '../../services/api';
import MainFeatureListing from './MainFeatureListing';
import SmallListingCard from './SmallListingCard';

const FeaturedListings = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [hotListings, setHotListings] = useState([]);
  const [normalListings, setNormalListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  // Funkcja do losowego mieszania tablicy (algorytm Fisher-Yates)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Sprawdzenie, czy użytkownik właśnie został wylogowany
  useEffect(() => {
    const justLoggedOut = localStorage.getItem('justLoggedOut');
    if (justLoggedOut === 'true') {
      setShowLogoutMessage(true);
      localStorage.removeItem('justLoggedOut');
      
      // Ukryj powiadomienie po 5 sekundach
      const timer = setTimeout(() => {
        setShowLogoutMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        // Pobieranie ogłoszeń z dedykowanego endpointu rotacji
        const response = await fetch(`http://localhost:5000/api/ads/rotated?t=${Date.now()}`);
        const data = await response.json();

        if (!data || !data.featured || !data.hot || !data.regular) {
          throw new Error('Nieprawidłowa odpowiedź API');
        }

        setFeaturedListings(data.featured);
        setHotListings(data.hot);
        setNormalListings(data.regular);
        setError(null);
      } catch (err) {
        console.error('Błąd pobierania danych:', err);
        setError('Nie udało się załadować ogłoszeń');
        
        // Fallback do mockowanych danych w przypadku błędu
        try {
          const mockedData = await api.getListings();
          
          // Tasujemy mockowane dane
          const allMocked = shuffleArray(mockedData);
          const mainFeatured = allMocked.filter(ad => ad.featured).slice(0, 2);
          const hotOffers = allMocked.filter(ad => ad.featured).slice(2, 6);
          const normalOnes = allMocked.filter(ad => !ad.featured).slice(0, 6);

          setFeaturedListings(mainFeatured);
          setHotListings(hotOffers);
          setNormalListings(normalOnes);
        } catch (fallbackErr) {
          console.error('Również błąd z danymi zapasowymi:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Ładowanie ogłoszeń...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4 sm:mb-6 md:mb-8">
          OGŁOSZENIA
          <div className="w-16 sm:w-24 h-0.5 bg-[#35530A] mx-auto mt-2" />
        </h1>

        {/* 2 duże ogłoszenia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {featuredListings.map((listing) => (
            <MainFeatureListing key={listing._id} listing={listing} />
          ))}
        </div>
        
        {/* 4 mniejsze ogłoszenia - "gorące oferty" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {hotListings.map((listing) => (
            <SmallListingCard 
              key={listing._id} 
              listing={listing} 
              showHotOffer={true} 
            />
          ))}
        </div>
        
        {/* Pasek reklamowy */}
        <div className="bg-white shadow-md rounded-[2px] h-48 mb-6 flex items-center justify-center">
          <span className="text-xl text-gray-400">Miejsce na reklamę</span>
        </div>
        
        {/* 6 małych ogłoszeń - standardowe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {normalListings.map((listing) => (
            <SmallListingCard key={listing._id} listing={listing} />
          ))}
        </div>

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
