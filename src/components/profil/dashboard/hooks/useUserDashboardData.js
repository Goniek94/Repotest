import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getUserDashboard, getListing } from '../../../../services/api';
import NotificationsService from '../../../../services/api/notificationsApi';
import NotificationContext from '../../../../contexts/NotificationContext';
import ViewHistoryService from '../../../../services/viewHistoryService';
import { useFavorites } from '../../../../contexts/FavoritesContext';
import ActivityLogService from '../../../../services/activityLogService';
import getImageUrl from '../../../../utils/responsive/getImageUrl';

/**
 * Hook do pobierania danych panelu użytkownika
 * @param {number} refreshTrigger - Wartość zmieniająca się przy żądaniu odświeżenia danych
 * @returns {Object} Dane panelu użytkownika, stan ładowania i błędy
 */
const useUserDashboardData = (refreshTrigger = 0) => {
  // Pobieranie kontekstu powiadomień - hooki muszą być wywoływane bezwarunkowo
  const notificationContext = useContext(NotificationContext);
  // Sprawdzenie czy kontekst jest dostępny
  const isNotificationContextAvailable = notificationContext !== undefined && notificationContext !== null;
  
  if (!isNotificationContextAvailable) {
    console.log('NotificationContext nie jest dostępny, używam danych z API');
  }

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
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch dashboard data from backend with retry logic
        const dashboard = await getUserDashboard();
        
        // Check if the dashboard request returned with an error flag
        if (dashboard.error) {
          console.warn("Dashboard API zwróciło błąd, ale kontynuujemy z dostępnymi danymi:", dashboard.error);
        }

        // Set stats from backend (even if partial)
        setUserStats({
          activeListings: dashboard.activeListingsCount || 0, 
          completedTransactions: dashboard.completedTransactionsCount || 0,
          // Jeśli mamy kontekst powiadomień, użyjemy jego licznika
          messages: notificationContext?.unreadCount?.messages || dashboard.unreadMessagesCount || 0
        });

        // Prepare recent ads from backend
        let backendRecentAds = [];
        if (dashboard.recentViewedAds && dashboard.recentViewedAds.length > 0) {
          backendRecentAds = dashboard.recentViewedAds.map(ad => {
            let image = ad.mainImage;
            if (ad.images && ad.images.length > 0) {
              const idx =
                typeof ad.mainImageIndex === 'number' &&
                ad.mainImageIndex >= 0 &&
                ad.mainImageIndex < ad.images.length
                  ? ad.mainImageIndex
                  : 0;
              image = ad.images[idx];
            }

            return {
              id: ad.id,
              title: ad.title || `${ad.brand || ''} ${ad.model || ''}`.trim() || `Ogłoszenie ${ad.id?.slice(-6)}`,
              href: `/listing/${ad.id}`,
              price: ad.price,
              image: getImageUrl(image),
              description: ad.status === 'opublikowane' ? 'Aktywne' : ad.status
            };
          });
        }

        // Pobierz historię z localStorage i spróbuj uzupełnić danymi z API
        const historyIds = ViewHistoryService.getViewHistory();
        const localAds = [];
        for (const id of historyIds) {
          try {
            const ad = await getListing(id);
            let image = ad.mainImage;
            if (ad.images && ad.images.length > 0) {
              const idx =
                typeof ad.mainImageIndex === 'number' &&
                ad.mainImageIndex >= 0 &&
                ad.mainImageIndex < ad.images.length
                  ? ad.mainImageIndex
                  : 0;
              image = ad.images[idx];
            }

            localAds.push({
              id: ad.id || ad._id || id,
              title:
                ad.title || `${ad.brand || ''} ${ad.model || ''}`.trim() || `Ogłoszenie ${String(id).slice(-6)}`,
              href: `/listing/${ad.id || ad._id || id}`,
              price: ad.price,
              image: getImageUrl(image),
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

        // Przygotowanie powiadomień - najpierw próbujemy użyć NotificationContext
        let contextNotifications = [];
        let apiNotifications = [];
        
        // Jeśli kontekst jest dostępny, pobieramy z niego powiadomienia
        if (notificationContext?.notifications && notificationContext.notifications.length > 0) {
          contextNotifications = notificationContext.notifications
            .slice(0, 10) // Limit do 10 najnowszych powiadomień
            .map(notification => {
              let icon = 'bell';
              let actionLabel = "Zobacz";
              
              if (notification.type === 'new_message' || notification.type === 'message_reply') {
                icon = 'mail';
                actionLabel = "Odpowiedz";
              } else if (notification.type === 'listing_liked') {
                icon = 'heart';
              } else if (notification.type === 'listing_expiring') {
                icon = 'clock';
              } else if (notification.type === 'listing_price_change') {
                icon = 'tag';
              } else if (notification.type?.includes('listing')) {
                icon = 'car';
              }
              
              return {
                id: notification.id,
                iconType: icon, // Przechowujemy typ ikony zamiast JSX elementu
                title: notification.message || notification.title || "Nowe powiadomienie",
                description: notification.description || notification.content || "Brak treści",
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
            });
        }
        
        // Jeśli nie mamy powiadomień z kontekstu lub jest ich mało, pobieramy z API
        if (contextNotifications.length < 4) {
          try {
            const notifications = await NotificationsService.getAll({ limit: 5 });
            apiNotifications = notifications.notifications?.map(notification => {
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
                iconType: icon, // Przechowujemy typ ikony zamiast JSX elementu
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
          } catch (error) {
            console.error("Błąd podczas pobierania powiadomień z API:", error);
          }
        }
        
        // Pobieramy aktywności z lokalnego logu
        const localLog = ActivityLogService.getActivities(user.id);
        
        // Łączymy wszystkie źródła aktywności, priorytetyzując kontekst
        const allActivities = [
          ...contextNotifications,
          // Dodajemy powiadomienia z API, których nie ma w kontekście
          ...apiNotifications.filter(api => 
            !contextNotifications.some(ctx => ctx.id === api.id)
          ),
          ...localLog,
          ...favoriteActivities
        ];

        if (!allActivities.length) {
          // Przykładowe różnorodne powiadomienia do wykorzystania gdy brak rzeczywistych danych
          setActivities([
            {
              id: 'sample-1',
              iconType: 'mail', // Przechowujemy typ ikony zamiast JSX elementu
              title: "Nowa wiadomość od użytkownika",
              description: "Odpowiedz, aby kontynuować rozmowę",
              time: "dziś, 10:17",
              href: "#",
              actionLabel: "Odpowiedz",
            },
            {
              id: 'sample-2',
              iconType: 'car', // Przechowujemy typ ikony zamiast JSX elementu
              title: "Dodano nowe ogłoszenie",
              description: "Sprawdź szczegóły swojego ogłoszenia",
              time: "wczoraj, 12:17",
              href: "#",
              actionLabel: "Zobacz",
            },
            {
              id: 'sample-3',
              iconType: 'heart', // Przechowujemy typ ikony zamiast JSX elementu
              title: "Polubiono Twoje ogłoszenie",
              description: "Twoje ogłoszenie BMW X5 zostało dodane do ulubionych",
              time: "wczoraj, 15:42",
              href: "#",
              actionLabel: "Zobacz",
            },
            {
              id: 'sample-4',
              iconType: 'clock', // Przechowujemy typ ikony zamiast JSX elementu
              title: "Ogłoszenie wkrótce wygaśnie",
              description: "Twoje ogłoszenie Audi A4 wygaśnie za 2 dni",
              time: "dziś, 08:30",
              href: "#",
              actionLabel: "Przedłuż",
            },
            {
              id: 'sample-5',
              iconType: 'bell', // Przechowujemy typ ikony zamiast JSX elementu
              title: "Nowe powiadomienie systemowe",
              description: "Ważna aktualizacja regulaminu serwisu",
              time: "14.05.2025",
              href: "#",
              actionLabel: "Zobacz",
            },
            {
              id: 'sample-6',
              iconType: 'tag', // Przechowujemy typ ikony zamiast JSX elementu
              title: "Obniżono cenę ogłoszenia",
              description: "Cena ogłoszenia, które obserwujesz została obniżona o 5000 zł",
              time: "3 dni temu",
              href: "#",
              actionLabel: "Sprawdź",
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
  }, [user, authLoading, favoriteActivities, refreshTrigger, notificationContext]);

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
