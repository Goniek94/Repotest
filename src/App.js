import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ListingFormProvider } from './contexts/ListingFormContext';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import FeaturedListings from './components/FeaturedListings/FeaturedListings';
import ListingsPage from './components/ListingsView/ListingsPage';
import CreateListingForm from './components/ListingForm/CreateListingForm';
import AddListingView from './components/ListingForm/AddListingView';
import Register from './components/auth/Register';
import LoginModal from './components/auth/LoginModal';
import Contact from './components/Contact';
import Profile from './components/Profile';
import FavoritesPage from './components/FavoritesPage';
import AboutCompany from './components/Aboutcompany';
import FAQ from './components/FAQ';
import { FavoritesProvider } from './FavoritesContext';
import ScrollToTop from './ScrollToTop';
import ListingDetails from './components/listings/details/ListingDetails';

// Komponenty admina
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/dashboard/AdminDashboard';
import AdminUsers from './components/admin/users/AdminUsers';
import AdminListings from './components/admin/listings/AdminListings';
import AdminComments from './components/comments/admin/AdminComments';
import AdminDiscounts from './components/discounts/admin/AdminDiscounts';

// Komponenty profilu użytkownika
import UserPanel from './components/UserPanel';
import Messages from './components/profil/messages/Messages';
import UserListings from './components/profil/listings/UserListings';
import UserSettings from './components/profil/settings/UserSettings';
import EditListing from './components/profil/listings/EditListing';
import TransactionHistory from './components/profil/TransactionHistory';
import Notifications from './components/profil/notifications/Notifications';
import { useAuth } from './contexts/AuthContext';

// Ulepszony komponent dla tras chronionych z ograniczeniem zapętlenia
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Używamy useRef zamiast stanu, aby przechować informację o ostatnim sprawdzeniu
  // bez powodowania ponownego renderowania
  const lastCheckRef = React.useRef({
    isAuthenticated: null,
    userId: null,
    path: null
  });
  
  // Sprawdzamy, czy status uwierzytelnienia się zmienił
  const hasAuthChanged = 
    lastCheckRef.current.isAuthenticated !== isAuthenticated ||
    lastCheckRef.current.userId !== (user?.userId || null) ||
    lastCheckRef.current.path !== location.pathname;
  
  // Aktualizujemy referencję tylko gdy autentykacja się zmieniła
  if (hasAuthChanged) {
    lastCheckRef.current = {
      isAuthenticated,
      userId: user?.userId || null,
      path: location.pathname
    };
    
    // Logowanie tylko gdy faktycznie zmieniła się autentykacja lub ścieżka
    console.log('ProtectedRoute sprawdzanie:', { 
      isAuthenticated, 
      user: !!user,
      path: location.pathname,
      token: localStorage.getItem('token') ? 'Istnieje' : 'Brak'
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#35530A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('Przekierowanie do logowania z:', location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Zawartość strony głównej
const HomePageContent = () => (
  <>
    <SearchForm />
    <FeaturedListings />
  </>
);

// Komponent dla logowania 
const LoginPage = () => {
  return <LoginModal isOpen={true} />;
};

// Komponent opakowania dla formularza ogłoszenia
const CreateListingWithProvider = () => (
  <ListingFormProvider>
    <CreateListingForm />
  </ListingFormProvider>
);

// Komponent opakowania dla podglądu ogłoszenia
const AddListingViewWithProvider = () => (
  <ListingFormProvider>
    <AddListingView />
  </ListingFormProvider>
);

const App = () => {
  React.useEffect(() => {
    // Automatyczne wylogowanie przy wejściu na stronę (czyści cookie)
    fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
  }, []);

  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <Routes>
                {/* Strona główna */}
                <Route path="/" element={<HomePageContent />} />

                {/* Logowanie */}
                <Route path="/login" element={<LoginPage />} />

                {/* Ogłoszenia */}
                <Route path="/listings" element={<ListingsPage />} />
                <Route
                  path="/create-listing"
                  element={
                    <ProtectedRoute>
                      <CreateListingWithProvider />
                    </ProtectedRoute>
                  }
                />
                {/* Poprawiona ścieżka i komponent opakowania dla AddListingView */}
                <Route
                  path="/add-listing-view"
                  element={
                    <ProtectedRoute>
                      <AddListingViewWithProvider />
                    </ProtectedRoute>
                  }
                />
                
                {/* Zachowanie starej ścieżki dla kompatybilności */}
                <Route
                  path="/createlisting"
                  element={<Navigate to="/create-listing" replace />}
                />
                <Route
                  path="/addlistingview"
                  element={<Navigate to="/add-listing-view" replace />}
                />
                
                {/* Szczegóły ogłoszenia */}
                <Route path="/listing/:id" element={<ListingDetails />} />

                {/* Konto użytkownika */}
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Ulubione */}
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about-company" element={<AboutCompany />} />

                {/* Panel Admina */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="listings" element={<AdminListings />} />
                  <Route path="comments" element={<AdminComments />} />
                  <Route path="discounts" element={<AdminDiscounts />} />
                </Route>

                {/* Panel użytkownika */}
                <Route
                  path="/profil"
                  element={
                    <ProtectedRoute>
                      <UserPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profil/messages"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profil/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profil/messages"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profil/transactions"
                  element={
                    <ProtectedRoute>
                      <TransactionHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profil/listings"
                  element={
                    <ProtectedRoute>
                      <UserListings />
                    </ProtectedRoute>
                  }
                />
<Route
  path="/profil/settings"
  element={
    <ProtectedRoute>
      <UserSettings />
    </ProtectedRoute>
  }
/>
                <Route
                  path="/edytuj-ogloszenie/:id"
                  element={
                    <ProtectedRoute>
                      <EditListing />
                    </ProtectedRoute>
                  }
                />

                {/* Stara ścieżka "/profile" przekierowuje do "/profil" */}
                <Route 
                  path="/profile" 
                  element={<Navigate to="/profil" replace />} 
                />

                {/* Stare ścieżki "/user/*" przekierowują do "/profil/*" */}
                <Route 
                  path="/user" 
                  element={<Navigate to="/profil" replace />} 
                />
                <Route 
                  path="/user/:subpage" 
                  element={<Navigate to="/profil/:subpage" replace />} 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
