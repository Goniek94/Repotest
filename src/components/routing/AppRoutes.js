import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import { CreateListingWithProvider, AddListingViewWithProvider, EditListingViewWithProvider } from './ListingRoutes';

// Komponenty stron
import ListingsPage from '../ListingsView/ListingsPage';
import ListingDetails from '../listings/details/ListingDetails';
import Register from '../auth/Register';
import ResetPassword from '../auth/ResetPassword';
import Contact from '../Contact';
import FavoritesPage from '../FavoritesPage';
import AboutCompany from '../Aboutcompany';
import FAQ from '../FAQ';

// Komponenty profilu użytkownika
import UserDashboard from '../profil/UserDashboard';
import Messages from '../profil/Messages';
import Notifications from '../profil/Notifications';
import Transactions from '../profil/Transactions';
import Stats from '../profil/Stats';
import UserListings from '../profil/UserListings';
import Settings from '../profil/Settings';

// Komponenty admina
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/dashboard/AdminDashboard';
import AdminUsers from '../admin/users/AdminUsers';
import AdminListings from '../admin/listings/AdminListings';
import AdminComments from '../comments/admin/AdminComments';
import AdminDiscounts from '../discounts/admin/AdminDiscounts';

/**
 * Główny komponent routingu aplikacji
 * Zawiera wszystkie trasy aplikacji
 * 
 * @returns {React.ReactNode} - Komponent routingu
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Strona główna */}
      <Route path="/" element={<HomePage />} />

      {/* Logowanie i resetowanie hasła */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
      
      {/* Szczegóły i edycja ogłoszenia */}
      <Route path="/listing/:id" element={<ListingDetails />} />
      <Route
        path="/edit-listing/:id"
        element={
          <ProtectedRoute>
            <EditListingViewWithProvider />
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

      {/* Panel użytkownika */}
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
          <Navigate to="/profil/listings?view=favorites" replace />
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
  );
};

export default AppRoutes;
