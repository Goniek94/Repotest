import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';


const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <div className="wrapper py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="section">
      {/* Nagłówek */}
      <header className="mb-6 text-center">
        <h1 className="text-h1 font-bold text-green-800">Twoje Ulubione Ogłoszenia</h1>
        <p className="text-body text-gray-600 mt-2">
          Przeglądaj swoje ulubione ogłoszenia i wróć do nich w dowolnym momencie.
        </p>
      </header>

      {/* Lista ulubionych */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-12">
          <img
            src="/images/empty-favorites.png" // Wstaw ścieżkę do obrazu placeholdera
            alt="Brak ulubionych"
            className="w-64 h-64 object-contain mb-6"
          />
          <p className="text-gray-600 text-body">
            Nie masz jeszcze ulubionych ogłoszeń. Dodaj je, klikając ikonę 🚗 w liście ogłoszeń!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Obrazek */}
              <div className="w-full h-48 bg-gray-200">
                <img
                  src={fav.image || '/images/default-car.jpg'} // Domyślny obraz, jeśli brak
                  alt={fav.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Szczegóły */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 truncate">{fav.title}</h3>
                <p className="text-green-600 text-xl font-semibold mt-1">{fav.price}</p>
                <p className="text-gray-500 text-sm mt-2">{fav.location}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600 text-sm">
                    {fav.mileage ? `${fav.mileage} km` : 'N/A'}
                  </span>
                  <span className="text-gray-600 text-sm">{fav.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default FavoritesPage;
