// context/FavoritesContext.js
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import ActivityLogService from './services/activityLogService';
import FavoritesService from './services/favorites';
import { useAuth } from './contexts/AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteActivities, setFavoriteActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Load favorites from API when user is authenticated
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await FavoritesService.getAll();
      if (response.data.success) {
        setFavorites(response.data.data.favorites || []);
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Błąd podczas ładowania ulubionych');
      // Fallback to localStorage for offline support
      const saved = localStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load activities from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem('favoriteActivities');
    if (savedActivities) setFavoriteActivities(JSON.parse(savedActivities));
  }, []);

  // Load favorites when user authentication status changes
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = async (car) => {
    if (!isAuthenticated) {
      setError('Musisz być zalogowany, aby dodać do ulubionych');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await FavoritesService.addToFavorites(car._id || car.id);
      
      if (response.data.success) {
        // Add to local state
        const updatedFavorites = [...favorites, car];
        setFavorites(updatedFavorites);
        
        // Update localStorage as backup
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        // Add activity log
        const activity = {
          id: Date.now(),
          iconType: 'star',
          title: car.title || car.headline || `Ogłoszenie ${car._id || car.id}`,
          description: 'Dodano do ulubionych',
          time: new Date().toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          href: `/listing/${car._id || car.id}`,
          actionLabel: 'Zobacz',
          isRead: false
        };

        const newActivities = [activity, ...favoriteActivities].slice(0, 5);
        setFavoriteActivities(newActivities);
        localStorage.setItem('favoriteActivities', JSON.stringify(newActivities));
        
        ActivityLogService.addActivity(activity, user?.id);
        return true;
      }
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError(err.response?.data?.message || 'Błąd podczas dodawania do ulubionych');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    if (!isAuthenticated) {
      setError('Musisz być zalogowany');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await FavoritesService.removeFromFavorites(id);
      
      if (response.data.success) {
        // Remove from local state
        const updatedFavorites = favorites.filter(car => (car._id || car.id) !== id);
        setFavorites(updatedFavorites);
        
        // Update localStorage as backup
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        return true;
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err.response?.data?.message || 'Błąd podczas usuwania z ulubionych');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (car) => {
    if (!isAuthenticated) {
      setError('Musisz być zalogowany, aby zarządzać ulubionymi');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await FavoritesService.toggleFavorite(car._id || car.id);
      
      if (response.data.success) {
        const { action } = response.data.data;
        
        if (action === 'added') {
          // Add to favorites
          const updatedFavorites = [...favorites, car];
          setFavorites(updatedFavorites);
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          
          // Add activity
          const activity = {
            id: Date.now(),
            iconType: 'star',
            title: car.title || car.headline || `Ogłoszenie ${car._id || car.id}`,
            description: 'Dodano do ulubionych',
            time: new Date().toLocaleDateString('pl-PL', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            href: `/listing/${car._id || car.id}`,
            actionLabel: 'Zobacz',
            isRead: false
          };

          const newActivities = [activity, ...favoriteActivities].slice(0, 5);
          setFavoriteActivities(newActivities);
          localStorage.setItem('favoriteActivities', JSON.stringify(newActivities));
          ActivityLogService.addActivity(activity, user?.id);
        } else {
          // Remove from favorites
          const updatedFavorites = favorites.filter(fav => (fav._id || fav.id) !== (car._id || car.id));
          setFavorites(updatedFavorites);
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        }
        
        return { success: true, action };
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError(err.response?.data?.message || 'Błąd podczas zmiany statusu ulubionego');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (carId) => {
    return favorites.some(car => (car._id || car.id) === carId);
  };

  const checkIsFavorite = async (carId) => {
    if (!isAuthenticated) return false;
    
    try {
      const response = await FavoritesService.checkIsFavorite(carId);
      return response.data.success ? response.data.data.isFavorite : false;
    } catch (err) {
      console.error('Error checking favorite status:', err);
      return isFavorite(carId); // Fallback to local check
    }
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

  const clearError = () => setError(null);

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addFavorite, 
      removeFavorite,
      toggleFavorite,
      isFavorite,
      checkIsFavorite,
      favoriteActivities,
      markActivityAsRead,
      getUnreadActivitiesCount,
      loading,
      error,
      clearError,
      loadFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
