import React, { createContext, useContext, useState } from 'react';

// Kontekst ulubionych
const FavoritesContext = createContext();

// Provider kontekstu
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (listing) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === listing.id)
        ? prevFavorites.filter((fav) => fav.id !== listing.id)
        : [...prevFavorites, listing]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook do używania kontekstu
export const useFavorites = () => useContext(FavoritesContext);
