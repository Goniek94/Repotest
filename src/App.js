import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ListingFormProvider } from './contexts/ListingFormContext';
import { ToastContainer } from 'react-toastify';
import ToastNotification from './components/notifications/ToastNotification';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer';
import SearchForm from './components/search/SearchFormUpdated';
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
import { clearAuthData } from './services/api/config';

// Komponenty admina
import AdminPanel from './components/admin/AdminPanel';

// Komponenty profilu użytkownika
import UserProfileRoutes from './components/profil/UserProfileRoutes';
import { useAuth } from './contexts/AuthContext';

// Ulepszony komponent dla tras chronionych z ograniczeniem zapętlenia
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
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
      debug('ProtectedRoute sprawdzanie:', {
      isAuthenticated,
      user: !!user,
      path: location.pathname
    });
  }

  if (isLoading) {
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
    debug('Przekierowanie do logowania z:', location.pathname);
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
    <SearchForm compact={true} />
    <FeaturedListings />
  </>
);

// Komponent strony logowania wyświetlany na tle strony głównej
const LoginPage = () => {
  return (
    <>
      <HomePageContent />
      <LoginModal isOpen={true} />
    </>
  );
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
  // Usunięto efekt automatycznie wylogowujący użytkownika przy każdym
  // odświeżeniu strony, dzięki czemu stan logowania jest zachowywany
  // między odświeżeniami aplikacji.

  return (
    <AuthProvider>
      <NotificationProvider>
        <FavoritesProvider>
          <Router>
            <ScrollToTop />
            <ToastNotification />
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
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />

                {/* Panel użytkownika i wszystkie jego podstrony */}
                <Route
                  path="/profil/*"
                  element={
                    <ProtectedRoute>
                      <UserProfileRoutes />
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
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
