// FeaturedListings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // używam Link z react-router-dom
import api from '../../services/api';
import MainFeatureListing from './MainFeatureListing';
import SmallListingCard from './SmallListingCard';

const FeaturedListings = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [normalListings, setNormalListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await api.getListings();
        
        // Pobieramy 2 ogłoszenia wyróżnione dla głównych kart
        const mainFeatured = response.filter(ad => ad.featured).slice(0, 2);
        
        // Pobieramy 4 ogłoszenia dla mniejszych kart
        const secondaryFeatured = response.filter(ad => ad.featured).slice(2, 6);
        
        // Pobieramy 6 normalnych ogłoszeń
        const normalOnes = response.filter(ad => !ad.featured).slice(0, 6);

        setFeaturedListings([...mainFeatured, ...secondaryFeatured]);
        setNormalListings(normalOnes);
        setError(null);
      } catch (err) {
        setError('Nie udało się załadować ogłoszeń');
        console.error(err);
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4 sm:mb-6 md:mb-8">
          OGŁOSZENIA
          <div className="w-16 sm:w-24 h-0.5 bg-[#35530A] mx-auto mt-2" />
        </h1>

        {/* 2 duże ogłoszenia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {featuredListings.slice(0, 2).map((listing) => (
            <MainFeatureListing key={listing._id} listing={listing} />
          ))}
        </div>
        
        {/* 4 mniejsze ogłoszenia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {featuredListings.slice(2, 6).map((listing) => (
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
        
        {/* 6 małych ogłoszeń */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {normalListings.map((listing) => (
            <SmallListingCard key={listing._id} listing={listing} />
          ))}
        </div>

        {/* Nowy przycisk na dole sekcji */}
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