import React, { useState } from 'react';
import {
  FaMapMarker,
  FaHeart,
  FaTh,
  FaThList,
} from 'react-icons/fa';
import CompactSearch from './CompactSearch';

function generateSampleListings() {
  const listings = [];
  for (let i = 1; i <= 60; i++) {
    listings.push({
      id: i,
      title: `VW Golf 7 1.${i} TSI`,
      subtitle: '(dane z tabelek), (+ krótki opis sprzedającego + nagłówka, max 60 znaków)',
      price: (Math.floor(Math.random() * 50) + 10) * 1000,
      fuel: ['Benzyna', 'Diesel', 'Elektryczny', 'Hybrydowy'][i % 4],
      engineCapacity: `${1000 + Math.floor(Math.random() * 1500)} cm³`,
      power: `${50 + Math.floor(Math.random() * 150)} KM`,
      mileage: `${5000 + Math.floor(Math.random() * 200000)} km`,
      year: 1990 + Math.floor(Math.random() * 35),
      drive: ['Napęd przedni', 'Napęd tylny', '4x4'][i % 3],
      location: 'Mazowieckie',
      city: ['Warszawa', 'Kraków', 'Poznań', 'Gdańsk', 'Wrocław'][i % 5],
      image: i % 2 === 0 ? '/images/auto-788747_1280.jpg' : '/images/car-1880381_640.jpg',
      featured: i <= 5,
    });
  }
  return listings;
}

export default function ListingsPage() {
  const [listings] = useState(() => generateSampleListings());
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortType, setSortType] = useState('none');
  const [viewMode, setViewMode] = useState('list');
  const [itemsToShow, setItemsToShow] = useState(30);
  const [favorites, setFavorites] = useState([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const featuredList = listings.filter((item) => item.featured);
  const normalList = listings.filter((item) => !item.featured);

  const parseNum = (val) => parseInt(String(val).replace(/\D/g, ''), 10) || 0;

  let sortedFeatured = [...featuredList];
  let sortedNormal = [...normalList];

  switch (sortType) {
    case 'price-asc':
      sortedFeatured.sort((a, b) => parseNum(a.price) - parseNum(b.price));
      sortedNormal.sort((a, b) => parseNum(a.price) - parseNum(a.price));
      break;
    case 'price-desc':
      sortedFeatured.sort((a, b) => parseNum(b.price) - parseNum(a.price));
      sortedNormal.sort((a, b) => parseNum(b.price) - parseNum(a.price));
      break;
    case 'year-asc':
      sortedFeatured.sort((a, b) => a.year - b.year);
      sortedNormal.sort((a, b) => a.year - b.year);
      break;
    case 'year-desc':
      sortedFeatured.sort((a, b) => b.year - a.year);
      sortedNormal.sort((a, b) => b.year - a.year);
      break;
    default:
      break;
  }

  let finalListings = showFeaturedOnly
    ? sortedFeatured
    : [...sortedFeatured, ...sortedNormal];

  const visibleListings = finalListings.slice(0, itemsToShow);

  const toggleFavorite = (id) => {
    const isFav = favorites.includes(id);
    if (isFav) {
      setFavorites((prev) => prev.filter((x) => x !== id));
      setToastMessage('Usunięto z ulubionych');
    } else {
      setFavorites((prev) => [...prev, id]);
      setToastMessage('Dodano do ulubionych');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const navigateToListing = (id) => {
    alert(`Przejdź do szczegółów: ID = ${id}`);
  };

  const handleShowMore = () => {
    setItemsToShow((prev) => prev + 30);
  };

  const handleFilter = () => {
    setShowFeaturedOnly((prev) => !prev);
  };

  // Komponent dla widoku kafelkowego
  const GridItem = ({ listing }) => (
    <div
      onClick={() => navigateToListing(listing.id)}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 relative flex flex-col h-full ${
        listing.featured ? 'border-2 border-green-600' : ''
      }`}
    >
      {/* Kontener na zdjęcie - stała wysokość */}
      <div className="relative w-full h-48">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        {listing.featured && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs rounded">
            WYRÓŻNIONE
          </div>
        )}
        {/* Przycisk ulubione - na zdjęciu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(listing.id);
          }}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100"
          title={favorites.includes(listing.id) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
        >
          <FaHeart
            className={`text-xl ${
              favorites.includes(listing.id) ? 'text-red-500' : 'text-gray-300'
            }`}
          />
        </button>
      </div>

      {/* Zawartość karty */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Tytuł i cena */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold line-clamp-2">{listing.title}</h3>
          <p className="text-xl font-bold text-gray-900 mt-2">
            {listing.price.toLocaleString('pl-PL')} zł
          </p>
        </div>

        {/* Opis */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{listing.subtitle}</p>

        {/* Parametry w formie siatki */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
          <div>{listing.fuel}</div>
          <div>{listing.engineCapacity}</div>
          <div>{listing.power}</div>
          <div>{listing.mileage}</div>
          <div>{listing.year}</div>
          <div>{listing.drive}</div>
        </div>

        {/* Lokalizacja na dole */}
        <div className="mt-auto pt-3 border-t flex items-center text-sm text-gray-700">
          <FaMapMarker className="text-pink-500 mr-1" />
          <span>
            {listing.city}, {listing.location}
          </span>
        </div>
      </div>
    </div>
  );

  // Komponent dla widoku listy (bez zmian)
  const ListItem = ({ listing }) => (
    <div
      onClick={() => navigateToListing(listing.id)}
      className={`bg-white rounded shadow-md overflow-hidden cursor-pointer hover:bg-gray-50 relative flex flex-row
        ${listing.featured ? 'border-2 border-green-600' : ''}`}
    >
      <div className="w-48 h-32 flex-shrink-0 relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        {listing.featured && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs rounded">
            WYRÓŻNIONE
          </div>
        )}
      </div>

      <div className="flex-grow px-4 py-3">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        <p className="text-base text-gray-600 mt-1">{listing.subtitle}</p>
        <div className="flex flex-wrap items-center mt-4 text-sm text-gray-700 space-x-2">
          <span>{listing.fuel}</span>
          <span className="border-l border-gray-300 px-2">{listing.engineCapacity}</span>
          <span className="border-l border-gray-300 px-2">{listing.power}</span>
          <span className="border-l border-gray-300 px-2">{listing.mileage}</span>
          <span className="border-l border-gray-300 px-2">{listing.year}</span>
          <span className="border-l border-gray-300 px-2">{listing.drive}</span>
        </div>
      </div>

      <div className="border-l px-4 flex flex-col items-center justify-center">
        <div className="text-sm text-gray-700 mb-2 flex items-center space-x-1">
          <FaMapMarker className="text-pink-500" />
          <span>
            {listing.city}, {listing.location}
          </span>
        </div>
        <div className="flex items-center border-t pt-2 space-x-2">
          <span className="text-xl font-bold text-gray-900">
            {listing.price.toLocaleString('pl-PL')} zł
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(listing.id);
            }}
            title={favorites.includes(listing.id) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          >
            <FaHeart
              className={`text-2xl ${
                favorites.includes(listing.id) ? 'text-red-500' : 'text-gray-300'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {showToast && (
        <div className="fixed top-16 right-4 bg-black text-white bg-opacity-80 px-3 py-2 rounded z-50">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white px-4 py-2 rounded"
            style={{
              backgroundColor: '#35530A',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#44671A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#35530A';
            }}
          >
            {searchOpen ? 'Ukryj wyszukiwarkę' : 'Pokaż wyszukiwarkę'}
          </button>
        </div>

        {searchOpen && <CompactSearch />}

        <div className="mt-4 flex items-center justify-between border bg-white p-3 rounded">
          <div className="flex space-x-2 items-center">
            <select
              className="border border-green-500 p-2 rounded focus:outline-none focus:border-green-700"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="none">Brak sortowania</option>
              <option value="price-asc">Cena: rosnąco</option>
              <option value="price-desc">Cena: malejąco</option>
              <option value="year-asc">Rok: rosnąco</option>
              <option value="year-desc">Rok: malejąco</option>
            </select>
            <button
              onClick={handleFilter}
              className={`border rounded p-2 ${showFeaturedOnly ? 'bg-green-200' : ''}`}
            >
              {showFeaturedOnly ? 'Pokaż wszystkie' : 'Tylko wyróżnione'}
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border rounded ${
                viewMode === 'list' ? 'bg-gray-100 text-green-600' : 'text-gray-600'
              }`}
            >
              <FaThList size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 border rounded ${
                viewMode === 'grid' ? 'bg-gray-100 text-green-600' : 'text-gray-600'
              }`}
            >
              <FaTh size={20} />
            </button>
          </div>
        </div>

        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'
              : 'space-y-4 mt-6'
          }
        >
          {visibleListings.map((listing) =>
            viewMode === 'grid' ? (
              <GridItem key={listing.id} listing={listing} />
            ) : (
              <ListItem key={listing.id} listing={listing} />
            )
          )}
        </div>

        {itemsToShow < finalListings.length && (
          <div className="text-center mt-6">
            <button
              onClick={handleShowMore}
              className="px-6 py-2 text-white rounded hover:bg-green-700"
              style={{ backgroundColor: '#35530A' }}
            >
              Pokaż więcej
            </button>
          </div>
        )}
      </div>
    </div>
  );
}