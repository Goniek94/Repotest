import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfileLayout from './layout/ProfileLayout';
import UserPanel from './dashboard/UserPanel';
import Messages from './messages/Messages';
import UserListings from './listings/UserListings';
import EditListing from './listings/EditListing';
import Notifications from './notifications/Notifications';
import TransactionHistory from './TransactionHistory';
import UserSettings from './settings/UserSettings';
import ViewHistoryPage from './ViewHistoryPage';
import ContactPage from './contact/ContactPage';

/**
 * Komponent obsługujący routing w panelu użytkownika
 * Zawiera wszystkie podstrony dostępne w profilu użytkownika
 */
const UserProfileRoutes = () => {
  return (
    <Routes>
      <Route element={<ProfileLayout />}>
        {/* Domyślna podstrona - dashboard */}
        <Route index element={<UserPanel />} />
        
        {/* Podstrony panelu użytkownika */}
        <Route path="dashboard" element={<UserPanel />} />
        <Route path="messages/*" element={<Messages />} />
        <Route path="listings/*" element={<UserListings />} />
        <Route path="edytuj-ogloszenie/:id" element={<EditListing />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="history" element={<ViewHistoryPage />} />
        <Route path="transactions" element={<TransactionHistory />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="settings/*" element={<UserSettings />} />
        
        {/* Przekierowanie nieznanych ścieżek do dashboardu */}
        <Route path="*" element={<Navigate to="/profil" replace />} />
      </Route>
    </Routes>
  );
};

export default UserProfileRoutes;
