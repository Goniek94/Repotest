import React from 'react';
import SearchFormUpdated from '../components/search/SearchFormUpdated';
import FeaturedListings from '../components/FeaturedListings/FeaturedListings';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Title and Featured Listings */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Znajdź swój wymarzony samochód
            </h1>
            <p className="text-xl text-gray-600">
              Tysiące ofert samochodów używanych i nowych w jednym miejscu
            </p>
          </div>
        </div>
        
        {/* Featured Listings - moved higher */}
        <div className="container mx-auto px-4 pt-0 pb-4">
          <FeaturedListings />
        </div>
      </div>

      {/* Search Form - moved down */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <SearchFormUpdated />
          </div>
        </div>
      </div>

      {/* Additional Content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sprawdzone oferty</h3>
              <p className="text-gray-600">Wszystkie ogłoszenia są weryfikowane przez nasz zespół</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Najlepsze ceny</h3>
              <p className="text-gray-600">Konkurencyjne ceny i możliwość negocjacji</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Łatwe wyszukiwanie</h3>
              <p className="text-gray-600">Zaawansowane filtry pomogą znaleźć idealny samochód</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
