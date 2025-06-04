import React from 'react';
import FeaturedListings from '../FeaturedListings/FeaturedListings';

/**
 * Komponent dla strony głównej
 * Wyświetla wyróżnione ogłoszenia (zawierające formularz wyszukiwania)
 * 
 * @returns {React.ReactNode} - Komponent strony głównej
 */
const HomePage = () => {
  return (
    <>
      <FeaturedListings />
    </>
  );
};

export default HomePage;
