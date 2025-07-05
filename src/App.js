import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ListingFormProvider } from './contexts/ListingFormContext';
import { SocketProvider } from './contexts/SocketContext';
import { ToastContainer } from 'react-toastify';
import ToastNotification from './components/notifications/ToastNotification';
import 'react-toastify/dist/ReactToastify.css';
import { safeConsole } from './utils/debug';
// Komponenty główne, które zawsze ładujemy
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer';
import SearchForm from './components/search/SearchFormUpdated';
import FeaturedListings from './components/FeaturedListings/FeaturedListings';
import LoginModal from './components/auth/LoginModal';

import { FavoritesProvider } from './FavoritesContext';
import ScrollToTop from './ScrollToTop';
import { clearAuthData } from './services/api/config';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';

// Komponenty ładowane leniwie dla optymalizacji
const ListingsPage = lazy(() => import('./components/ListingsView/ListingsPage'));
const CreateListingForm = lazy(() => import('./components/ListingForm/CreateListingForm'));
const AddListingView = lazy(() => import('./components/ListingForm/AddListingView'));
const Register = lazy(() => import('./components/auth/Register'));
const Contact = lazy(() => import('./components/Contact'));
const Profile = lazy(() => import('./components/Profile'));
const FavoritesPage = lazy(() => import('./components/FavoritesPage'));
const AboutCompany = lazy(() => import('./components/Aboutcompany'));
const FAQ = lazy(() => import('./components/FAQ'));
const ListingDetails = lazy(() => import('./components/listings/details/ListingDetails'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const UserProfileRoutes = lazy(() => import('./components/profil/UserProfileRoutes'));

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
      safeConsole.log('ProtectedRoute sprawdzanie:', {
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
    safeConsole.log('Przekierowanie do logowania z:', location.pathname);
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
      <SocketProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <SidebarProvider>
          <Router>
            <ScrollToTop />
            <ToastNotification />
            <ErrorBoundary>
              <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-grow">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-t-[#35530A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="mt-4 text-gray-600">Ładowanie...</p>
                    </div>
                  </div>
                }>
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
                </Suspense>
              </main>
              <Footer />
            </div>
            </ErrorBoundary>
          </Router>
            </SidebarProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
