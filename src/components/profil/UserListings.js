import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiBarChart2, FiHeart, FiEye, FiEdit, FiTrash2, FiStar } from 'react-icons/fi';
import Stats from './Stats';
import Favorites from './Favorites';

const Listings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');

  const listings = [
    {
      id: 1,
      title: 'BMW M3 Competition',
      price: 450000,
      description: 'Samochód w idealnym stanie technicznym, pierwszy właściciel',
      status: 'active',
      views: 123,
      publishDate: '2024-01-15',
      image: '/images/auto-788747_1280.jpg',
      year: 2021,
      mileage: 25000,
      fuelType: 'Benzyna',
      power: '625 KM',
      featured: true
    },
    {
      id: 2,
      title: 'Audi RS6 Avant',
      price: 520000,
      description: 'Bezwypadkowy, serwisowany w ASO, gwarancja',
      status: 'pending',
      views: 45,
      publishDate: '2024-01-14',
      image: '/images/car-1880381_640.jpg',
      year: 2022,
      mileage: 15000,
      fuelType: 'Benzyna',
      power: '600 KM',
      featured: false
    }
  ];

  const menuItems = [
    { name: 'Moje ogłoszenia', icon: FiGrid, tab: 'listings' },
    { name: 'Statystyki', icon: FiBarChart2, tab: 'stats' },
    { name: 'Ulubione', icon: FiHeart, tab: 'favorites' }
  ];

  const goToDetails = (id) => {
    navigate(`/ogloszenie/${id}`);
  };

  const toggleFeatured = (e, id) => {
    e.stopPropagation(); // Zapobiega przejściu do szczegółów
    // Tu logika zmiany featured
  };

  const editListing = (e, id) => {
    e.stopPropagation();
    navigate(`/edytuj-ogloszenie/${id}`);
  };

  const deleteListing = (e, id) => {
    e.stopPropagation();
    // Tu logika usuwania
  };

  const renderListing = (listing) => (
    <div 
      key={listing.id} 
      className="bg-white rounded-lg hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
      onClick={() => goToDetails(listing.id)}
    >
      <div className="flex flex-col md:flex-row cursor-pointer">
        {/* Obrazek */}
        <div className="relative md:w-72 h-48 md:h-auto">
          <img 
            src={listing.image} 
            alt={listing.title} 
            className="w-full h-full object-cover"
          />
          {listing.featured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
              <FiStar className="mr-1" />
              Wyróżnione
            </div>
          )}
        </div>

        {/* Treść */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h3>
              <p className="text-2xl font-bold text-green-600">
                {listing.price.toLocaleString()} PLN
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              listing.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {listing.status === 'active' ? 'Aktywne' : 'Oczekujące'}
            </span>
          </div>

          <div className="mt-3 text-gray-600">
            <p>{listing.year} • {listing.mileage.toLocaleString()} km • {listing.fuelType} • {listing.power}</p>
          </div>

          {/* Dolny pasek */}
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <div className="flex items-center">
                <FiEye className="mr-1" />
                <span>{listing.views} wyświetleń</span>
              </div>
              <span>Dodano: {listing.publishDate}</span>
            </div>

            {/* Przyciski akcji */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => toggleFeatured(e, listing.id)}
                className={`p-2 rounded-lg transition-colors ${
                  listing.featured 
                    ? 'text-yellow-500 hover:bg-yellow-50' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
                title={listing.featured ? "Usuń z wyróżnionych" : "Dodaj do wyróżnionych"}
              >
                <FiStar size={20} />
              </button>
              <button 
                onClick={(e) => editListing(e, listing.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Edytuj ogłoszenie"
              >
                <FiEdit size={20} />
              </button>
              <button 
                onClick={(e) => deleteListing(e, listing.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Usuń ogłoszenie"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Menu boczne */}
        <aside className="lg:col-span-3 mb-8 lg:mb-0">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full group flex items-center px-4 py-3 rounded-lg transition-colors
                  ${activeTab === item.tab 
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon className={`mr-3 flex-shrink-0 ${
                  activeTab === item.tab ? 'text-green-500' : 'text-gray-400'
                }`} />
                {item.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Główna zawartość */}
        <main className="lg:col-span-9">
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Moje ogłoszenia</h2>
                <button 
                  onClick={() => navigate('/dodaj-ogloszenie')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <span className="mr-2">+</span>
                  Dodaj ogłoszenie
                </button>
              </div>
              <div className="space-y-4">
                {listings.map(renderListing)}
              </div>
            </div>
          )}

          {activeTab === 'stats' && <Stats />}
          {activeTab === 'favorites' && <Favorites />}
        </main>
      </div>
    </div>
  );
};

export default Listings;