import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import { CreateListingWithProvider, AddListingViewWithProvider } from './ListingRoutes';
import EditListing from '../profil/listings/EditListing';
import EditListingView from '../ListingForm/EditListingView';

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
import UserDashboard from '../profil/dashboard/UserDashboard';
import Messages from '../profil/messages/Messages';
import Notifications from '../profil/notifications/Notifications';
import Transactions from '../profil/transactions/TransactionTable';
import UserListings from '../profil/listings/UserListings';

import ProfileLayout from '../profil/layout/ProfileLayout';

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
            <EditListingView />
          </ProtectedRoute>
        }
      />
      {/* Przeniesiono do zagnieżdżonej ścieżki w /profil/* */}

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

      {/* Panel użytkownika - jeden layout dla wszystkich sekcji profilu */}
      <Route
        path="/profil/*"
        element={
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="messages" element={<Messages />} />
        <Route path="listings" element={<UserListings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="contact" element={<Contact />} />
        <Route path="edytuj-ogloszenie/:id" element={<EditListing />} />
      </Route>

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
