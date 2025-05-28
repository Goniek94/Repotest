import React from 'react';
import SearchForm from '../search/SearchForm';
import FeaturedListings from '../FeaturedListings/FeaturedListings';

/**
 * Komponent dla strony głównej
 * Wyświetla formularz wyszukiwania i wyróżnione ogłoszenia
 * 
 * @returns {React.ReactNode} - Komponent strony głównej
 */
const HomePage = () => {
  return (
    <>
      <SearchForm />
      <FeaturedListings />
    </>
  );
};

export default HomePage;
