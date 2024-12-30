import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../FavoritesContext'; // Import kontekstu ulubionych

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites(); // Użyj kontekstu ulubionych

  // Sprawdzenie, czy ogłoszenie jest w ulubionych
  const isFavorite = favorites.some((fav) => fav.id === listing.id);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Sekcja zdjęcia */}
      <div className="relative">
        <img
          src={listing.imgSrc || '/images/default-car.jpg'}
          alt={listing.title}
          className="w-full h-48 object-cover bg-gray-200"
        />
        {/* Ikona samochodu */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Zatrzymanie propagacji kliknięcia
            toggleFavorite(listing); // Dodanie/usunięcie z ulubionych
          }}
          className={`absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1 text-gray-600 hover:text-green-500 hover:bg-opacity-100 transition-colors ${
            isFavorite ? 'text-green-500' : ''
          }`}
        >
          🚗
        </button>
      </div>

      {/* Informacje o ofercie */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{listing.title}</h3>
        <p className="text-green-600 text-xl font-semibold mt-1">{listing.price} zł</p>
        <p className="text-gray-500 text-sm mt-2">{listing.location}</p>
      </div>

      {/* Przycisk przekierowania */}
      <div className="p-4 pt-0">
        <button
          onClick={() => navigate(`/listing/${listing.id}`)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
        >
          Pokaż szczegóły
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
