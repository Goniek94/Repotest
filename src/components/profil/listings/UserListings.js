import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Heart, Eye, Edit, Trash } from "lucide-react";
import ListingTabs from "./ListingTabs";
import ListingList from "./ListingList";
import { ListingsService, FavoritesService } from "../../../services/api";

// Prosta funkcja powiadomień zamiast react-toastify
const showNotification = (message, type = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Można również użyć window.alert() w razie potrzeby
  // alert(`${type.toUpperCase()}: ${message}`);
};

const UserListings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie ogłoszeń użytkownika
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true);
        const listings = await ListingsService.getUserListings();
        
        // Pobieranie ulubionych ogłoszeń użytkownika
        const favorites = await FavoritesService.getAll();
        const favoriteIds = favorites.favorites?.map(fav => fav._id || fav.id) || [];
        
        // Formatowanie ogłoszeń do odpowiedniego formatu
        const formattedListings = listings.map(listing => {
          // Zawsze łączymy markę i model dla tytułu, nawet jeśli headline istnieje
          let title = listing.headline;
          if (listing.brand && listing.model) {
            title = `${listing.brand} ${listing.model}`;
          }
          
          // Prawidłowa obsługa zdjęć - sprawdzamy pełną ścieżkę
          let imageUrl = '/placeholder.jpg';
          if (listing.images && listing.images.length > 0) {
            // Sprawdzamy czy ścieżka zaczyna się od http lub zawiera pełną ścieżkę
            if (listing.images[0].startsWith('http') || listing.images[0].startsWith('/')) {
              imageUrl = listing.images[0];
            } else {
              // Dodajemy bazowy URL do API
              imageUrl = `http://localhost:5000/${listing.images[0]}`;
            }
          }
          
          return {
            id: listing._id,
            title: title,
            price: `${listing.price} PLN`,
            year: listing.year,
            mileage: `${listing.mileage} km`,
            fuelType: listing.fuelType,
            power: `${listing.power} KM`,
            featured: listing.featured || false,
            status: listing.status === 'opublikowane' ? 'Aktywne' : 'Zakończone',
            views: listing.views || 0,
            dateAdded: new Date(listing.createdAt).toLocaleDateString('pl-PL'),
            image: imageUrl,
            favorite: favoriteIds.includes(listing._id)
          };
        });
        
        setAllListings(formattedListings);
        setLoading(false);
      } catch (err) {
        console.error("Błąd podczas pobierania ogłoszeń:", err);
        setError("Nie udało się pobrać ogłoszeń. Spróbuj ponownie później.");
        setLoading(false);
      }
    };

    fetchUserListings();
  }, []);

  // Filter listings based on selected tab
  const getFilteredListings = () => {
    switch (activeTab) {
      case "active":
        return allListings.filter((listing) => listing.status === "Aktywne");
      case "completed":
        return allListings.filter((listing) => listing.status === "Zakończone");
      case "favorites":
        return allListings.filter((listing) => listing.favorite);
      default:
        return allListings;
    }
  };

  const listings = getFilteredListings();

  // Calculate days remaining for listing expiry
  const calculateDaysRemaining = (dateAddedStr) => {
    try {
      // Parse the date (Polish format: DD.MM.YYYY)
      const parts = dateAddedStr.split('.');
      if (parts.length !== 3) return 0;
      
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      
      const dateAdded = new Date(year, month, day);
      const expiryDate = new Date(dateAdded);
      expiryDate.setDate(expiryDate.getDate() + 30);
      
      const today = new Date();
      const diffTime = expiryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error("Błąd podczas obliczania pozostałych dni:", error);
      return 0;
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const listing = allListings.find(l => l.id === id);
      
      if (listing.favorite) {
        await FavoritesService.removeFromFavorites(id);
        showNotification("Usunięto z ulubionych", "success");
      } else {
        await FavoritesService.addToFavorites(id);
        showNotification("Dodano do ulubionych", "success");
      }
      
      // Aktualizacja stanu
      setAllListings(allListings.map(l => 
        l.id === id ? { ...l, favorite: !l.favorite } : l
      ));
    } catch (error) {
      console.error("Błąd podczas aktualizacji ulubionych:", error);
      showNotification("Wystąpił błąd. Spróbuj ponownie później.", "error");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edytuj-ogloszenie/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) {
      try {
        await ListingsService.delete(id);
        setAllListings(allListings.filter(l => l.id !== id));
        showNotification("Ogłoszenie zostało usunięte", "success");
      } catch (error) {
        console.error("Błąd podczas usuwania ogłoszenia:", error);
        showNotification("Nie udało się usunąć ogłoszenia. Spróbuj ponownie później.", "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-8">
        <div className="bg-white p-6 rounded-sm shadow-sm">
          {/* Header with title and add button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">Zarządzanie ogłoszeniami</h1>
            <button
              onClick={() => navigate("/dodaj-ogloszenie")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Dodaj ogłoszenie
            </button>
          </div>
          
          {/* Tabs */}
          <ListingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Listings */}
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
              <p className="mt-2 text-gray-600">Ładowanie ogłoszeń...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
              >
                Odśwież stronę
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>Nie masz żadnych ogłoszeń w tej kategorii.</p>
              <button 
                onClick={() => navigate("/dodaj-ogloszenie")} 
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
              >
                Dodaj pierwsze ogłoszenie
              </button>
            </div>
          ) : (
            <ListingList
              listings={listings}
              onFavorite={toggleFavorite}
              onEdit={handleEdit}
              onDelete={handleDelete}
              calculateDaysRemaining={calculateDaysRemaining}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListings;