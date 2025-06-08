// context/FavoritesContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import ActivityLogService from './services/activityLogService';
import { useAuth } from './contexts/AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteActivities, setFavoriteActivities] = useState([]);
  const { user } = useAuth();

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
      href: `/listing/${car.id}`,
      actionLabel: 'Zobacz',
      isRead: false
    };

    const newActivities = [activity, ...favoriteActivities].slice(0, 5);
    setFavoriteActivities(newActivities);
    localStorage.setItem('favoriteActivities', JSON.stringify(newActivities));
    
    // Przekaż userId jeśli użytkownik jest zalogowany
    ActivityLogService.addActivity(activity, user?.id);
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter(car => car.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const markActivityAsRead = (activityId) => {
    const updatedActivities = favoriteActivities.map(activity => 
      activity.id === activityId 
        ? { ...activity, isRead: true }
        : activity
    );
    setFavoriteActivities(updatedActivities);
    localStorage.setItem('favoriteActivities', JSON.stringify(updatedActivities));
  };

  const getUnreadActivitiesCount = () => {
    return favoriteActivities.filter(activity => !activity.isRead).length;
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addFavorite, 
      removeFavorite, 
      favoriteActivities,
      markActivityAsRead,
      getUnreadActivitiesCount
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);