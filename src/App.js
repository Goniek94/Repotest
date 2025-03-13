import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import FeaturedListings from './components/FeaturedListings/FeaturedListings';
import ListingsPage from './components/ListingsView/ListingsPage';
import CreateListing from './components/ListingsView/createlisting/CreateListing';
import AddListingView from './components/ListingsView/createlisting/AddListingView';
import ListingDetails from './components/ListingsView/createlisting/ListingDetails';
import Register from './components/auth/Register';
import LoginModal from './components/auth/LoginModal';
import Contact from './components/Contact';
import Profile from './components/Profile';
import FavoritesPage from './components/FavoritesPage';
import AboutCompany from './components/Aboutcompany';
import FAQ from './components/FAQ';
import { FavoritesProvider } from './FavoritesContext';
import ScrollToTop from './ScrollToTop';

// Komponenty admina
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/dashboard/AdminDashboard';
import AdminUsers from './components/admin/users/AdminUsers';
import AdminListings from './components/admin/listings/AdminListings';
import AdminComments from './components/comments/admin/AdminComments';
import AdminDiscounts from './components/discounts/admin/AdminDiscounts';

// Komponenty profilu użytkownika
import UserDashboard from './components/profil/UserDashboard';
import Messages from './components/profil/Messages';
import Notifications from './components/profil/Notifications';
import Transactions from './components/profil/Transactions';
import Stats from './components/profil/Stats';
import UserListings from './components/profil/UserListings';
import UserFavorites from './components/profil/Favorites';
import Settings from './components/profil/Settings';
import { useAuth } from './contexts/AuthContext';

// Ulepszony komponent dla tras chronionych
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Logowanie dla debugowania
  console.log('ProtectedRoute sprawdzanie:', { 
    isAuthenticated, 
    user: !!user,
    path: location.pathname,
    token: localStorage.getItem('token') ? 'Istnieje' : 'Brak'
  });

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

const App = () => {
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
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route
                  path="/createlisting"
                  element={
                    <ProtectedRoute>
                      <CreateListing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addlistingview"
                  element={
                    <ProtectedRoute>
                      <AddListingView />
                    </ProtectedRoute>
                  }
                />

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

                {/* Panel użytkownika - zmieniona ścieżka z "/user" na "/profil" */}
                <Route
                  path="/profil"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
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
                  path="/profil/transactions"
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profil/stats"
                  element={
                    <ProtectedRoute>
                      <Stats />
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
                  path="/profil/favorites"
                  element={
                    <ProtectedRoute>
                      <UserFavorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profil/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
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