import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ListingFormProvider } from './contexts/ListingFormContext';
import { SocketProvider } from './contexts/SocketContext';
import { MobileMenuProvider } from './contexts/MobileMenuContext';
import { ResponsiveProvider } from './contexts/ResponsiveContext';
import ToastNotification from './components/notifications/ToastNotification';
import 'react-toastify/dist/ReactToastify.css';

// Komponenty główne, które zawsze ładujemy
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer';
import SearchFormUpdated from './components/search/SearchFormUpdated';
import FeaturedListings from './components/FeaturedListings/FeaturedListings';
import LoginModal from './components/auth/LoginModal';
import LoadingSpinner from './components/LoadingSpinner';
import PWAInstallButton from './components/PWAInstallButton';

import { FavoritesProvider } from './contexts/FavoritesContext';
import ScrollToTop from './ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
// Import nowego ProtectedRoute
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';

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


// Zawartość strony głównej
const HomePageContent = () => (
  <div className="wrapper space-y-6">
    <div className="section">
      <SearchFormUpdated />
    </div>
    <div className="section">
      <FeaturedListings />
    </div>
  </div>
);

// Komponent strony logowania wyświetlany na tle strony głównej
const LoginPage = () => {
  const navigate = useNavigate();
  
  const handleCloseModal = () => {
    navigate('/');
  };

  return (
    <>
      <HomePageContent />
      <LoginModal isOpen={true} onClose={handleCloseModal} />
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
              <MobileMenuProvider>
                <ResponsiveProvider>
          <Router>
            <ScrollToTop />
            <ToastNotification />
            <ErrorBoundary>
              <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner message="Ładowanie strony..." />}>
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
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
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
              
              {/* PWA Install Button */}
              <PWAInstallButton />
            </div>
            </ErrorBoundary>
          </Router>
                </ResponsiveProvider>
              </MobileMenuProvider>
            </SidebarProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
