// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Banner from './components/Banner';
import SearchForm from './components/SearchForm';
import FeaturedListings from './components/FeaturedListings';
import AdBanner from './components/AdBanner';
import ListingsPage from './components/ListingsView/ListingsPage';
import CreateListing from './components/listings/CreateListing';
import AddListingView from './components/listings/AddListingView';
import Register from './components/Register';
import ListingDetails from './components/listings/ListingDetails';
import Contact from './components/Contact';
import Profile from './components/Profile';
import FavoritesPage from './components/FavoritesPage';
import { FavoritesProvider } from './FavoritesContext';
import ScrollToTop from './ScrollToTop';
import UserDataPage from './components/user/UserDataPage';
import UserStats from './components/user/UserStats';
import UserListings from './components/user/UserListings';
import UserFavorites from './components/user/UserFavorites';
import UserInvoices from './components/user/UserInvoices';
import UserSettings from './components/user/UserSettings';

// Wczytujemy nowe komponenty:
import UserMessages from './components/user/UserMessages';              // Wiadomości
import UserNotifications from './components/user/UserNotifications';    // Powiadomienia
import UserHistoryTransactions from './components/user/UserHistoryTransactions'; // Historia płatności

import 'leaflet/dist/leaflet.css';
import DescriptionInput from './components/listings/DescriptionInput';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <FavoritesProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navigation
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            setIsLoggedIn={setIsLoggedIn}
          />

          <main className="flex-grow">
            <Routes>
              {/* Strona główna */}
              <Route
                path="/"
                element={
                  <>
                    <Banner />
                    <SearchForm />
                    <FeaturedListings />
                    <AdBanner />
                  </>
                }
              />

              {/* Ogłoszenia */}
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/listing/:id" element={<ListingDetails />} />
              <Route path="/createlisting" element={<CreateListing />} />
              <Route
                path="/addlistingview"
                element={
                  <>
                    <AddListingView />
                    <DescriptionInput />
                  </>
                }
              />

              {/* Rejestracja, kontakt, profil */}
              <Route
                path="/register"
                element={<Register setIsLoggedIn={setIsLoggedIn} />}
              />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />

              {/* Ulubione */}
              <Route path="/favorites" element={<FavoritesPage />} />

              {/* Sekcja użytkownika */}
              <Route path="/user/data" element={<UserDataPage />} />
              <Route path="/user/payments" element={<UserDataPage />} />

              {/* Wiadomości, powiadomienia, historia płatności */}
              <Route path="/user/messages" element={<UserMessages />} />
              <Route path="/user/notifications" element={<UserNotifications />} />
              <Route
                path="/user/historyTransactions"
                element={<UserHistoryTransactions />}
              />

              {/* Pozostałe sekcje użytkownika */}
              <Route path="/user/stats" element={<UserStats />} />
              <Route path="/user/listings" element={<UserListings />} />
              <Route path="/user/favorites" element={<UserFavorites />} />
              <Route path="/user/invoices" element={<UserInvoices />} />
              <Route path="/user/settings" element={<UserSettings />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
