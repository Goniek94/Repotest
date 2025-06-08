// context/FavoritesContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteActivities, setFavoriteActivities] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
    const savedActivities = localStorage.getItem('favoriteActivities');
    if (savedActivities) setFavoriteActivities(JSON.parse(savedActivities));
  }, []);

  const addFavorite = (car) => {
    const updated = [...favorites, car];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));

    const activity = {
      id: Date.now(),
      icon: 'star',
      title: car.title || `Ogłoszenie ${car.id}`,
      description: 'Dodano do ulubionych',
      time: new Date().toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      href: `/ogloszenia/${car.id}`,
      actionLabel: 'Zobacz'
    };
    const newActivities = [activity, ...favoriteActivities].slice(0, 5);
    setFavoriteActivities(newActivities);
    localStorage.setItem('favoriteActivities', JSON.stringify(newActivities));
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter(car => car.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, favoriteActivities }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);