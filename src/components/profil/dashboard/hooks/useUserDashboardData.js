import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getUserDashboard, ListingsService } from '../../../../services/api';
import NotificationsService from '../../../../services/api/notificationsApi';
import ViewHistoryService from '../../../../services/viewHistoryService';
import { useFavorites } from '../../../../FavoritesContext';

/**
 * Hook do pobierania danych panelu użytkownika
 * @returns {Object} Dane panelu użytkownika, stan ładowania i błędy
 */
const useUserDashboardData = () => {
  // Stan dla danych użytkownika
  const [userStats, setUserStats] = useState({
    activeListings: 0,
    completedTransactions: 0
  });
  const [recentAds, setRecentAds] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isLoading: authLoading } = useAuth();
  const { favoriteActivities } = useFavorites();

  // Pobieranie danych użytkownika
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch dashboard data from backend
        const dashboard = await getUserDashboard();

        // Set stats from backend
        setUserStats({
          activeListings: dashboard.activeListingsCount || 0,
          completedTransactions: dashboard.completedTransactionsCount || 0
        });

        // Prepare recent ads from backend
        let backendRecentAds = [];
        if (dashboard.recentViewedAds && dashboard.recentViewedAds.length > 0) {
          backendRecentAds = dashboard.recentViewedAds.map(ad => ({
            id: ad.id,
            title: ad.title || `Ogłoszenie ${ad.id?.slice(-6)}`,
            href: `/ogloszenia/${ad.id}`,
            price: ad.price,
            image: ad.mainImage,
            description: ad.status === 'opublikowane' ? 'Aktywne' : ad.status
          }));
        }

        // Pobierz historię z localStorage i spróbuj uzupełnić danymi z API
        const historyIds = ViewHistoryService.getViewHistory();
        const localAds = [];
        for (const id of historyIds) {
          try {
            const ad = await ListingsService.getById(id);
            localAds.push({
              id: ad.id || ad._id || id,
              title: ad.title || `Ogłoszenie ${String(id).slice(-6)}`,
              href: `/ogloszenia/${ad.id || ad._id || id}`,
              price: ad.price,
              image: ad.mainImage,
              description: ad.status === 'opublikowane' ? 'Aktywne' : ad.status
            });
          } catch (e) {
            // jeśli nie ma danych w API, pomijamy
          }
        }

        const combinedAds = [
          ...localAds,
          ...backendRecentAds.filter(ad => !localAds.some(l => l.id === ad.id))
        ];
        setRecentAds(combinedAds);

        // Fetch notifications/activities as before
        const notifications = await NotificationsService.getAll({ limit: 3 });
        const mappedActivities = notifications.notifications?.map(notification => {
          let icon = 'bell';
          let actionLabel = "Zobacz";
          if (notification.type?.includes('message')) {
            icon = 'mail';
            actionLabel = "Odpowiedz";
          } else if (notification.type?.includes('listing')) {
            icon = 'car';
          } else if (notification.type?.includes('system')) {
            icon = 'alert-circle';
          }
          return {
            id: notification._id,
            icon,
            title: notification.title || "Nowe powiadomienie",
            description: notification.content || "Brak treści",
            time: new Date(notification.createdAt).toLocaleDateString('pl-PL', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            href: notification.link || "#",
            actionLabel
          };
        }) || [];
        
        const allActivities = [
          ...favoriteActivities,
          ...mappedActivities
        ];

        if (!allActivities.length) {
          setActivities([
            {
              icon: 'mail',
              title: "Nowa wiadomość od użytkownika",
              description: "Odpowiedz, aby kontynuować rozmowę",
              time: "dziś, 10:17",
              href: "#",
              actionLabel: "Odpowiedz",
            },
            {
              icon: 'car',
              title: "Dodano nowe ogłoszenie",
              description: "Sprawdź szczegóły swojego ogłoszenia",
              time: "wczoraj, 12:17",
              href: "#",
              actionLabel: "Zobacz",
            },
            {
              icon: 'bell',
              title: "Nowe powiadomienie systemowe",
              description: "Ważna aktualizacja regulaminu serwisu",
              time: "14.05.2025",
              href: "#",
              actionLabel: "Zobacz",
            }
          ]);
        } else {
          setActivities(allActivities);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchUserData();
    }
  }, [user, authLoading, favoriteActivities]);

  return {
    userStats,
    recentAds,
    activities,
    isLoading: isLoading || authLoading,
    error,
    user
  };
};

export default useUserDashboardData;
