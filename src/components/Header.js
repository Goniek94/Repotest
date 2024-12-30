import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Jeśli używasz react-router-dom
import { animateScroll as scroll } from 'react-scroll'; // Do płynnego przewijania do góry

function Header({ isLoggedIn }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-bottle-green text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo i nazwa strony */}
        <div className="flex items-center gap-3">
          <div onClick={scrollToTop} className="cursor-pointer flex items-center">
            {/* Logo SVG */}
            <svg viewBox="0 0 48 48" fill="currentColor" className="w-8 h-8">
              {/* Treść SVG */}
            </svg>
            <h2 className="text-2xl font-bold font-poppins uppercase ml-2">AutoSell</h2>
          </div>
        </div>

        {/* Menu desktopowe */}
        <nav className="hidden md:flex items-center gap-6 font-poppins uppercase text-sm">
          {!isLoggedIn ? (
            <>
              <a href="/" className="hover:text-gray-300 transition-colors">Strona Główna</a>
              <a href="/browselisting" className="hover:text-gray-300 transition-colors">Ogłoszenia</a>
              <a href="/createlisting" className="hover:text-gray-300 transition-colors">Dodaj Ogłoszenie</a>
              <a href="/contact" className="hover:text-gray-300 transition-colors">Kontakt</a>
              <div className="ml-auto flex items-center gap-4">
                <a href="/login" className="hover:text-gray-300 transition-colors">Zaloguj się</a>
                <a href="/register" className="hover:text-gray-300 transition-colors">Zarejestruj się</a>
              </div>
            </>
          ) : (
            <>
              <a href="/" className="hover:text-gray-300 transition-colors">Strona Główna</a>
              <a href="/listings" className="hover:text-gray-300 transition-colors">Lista Ogłoszeń</a>
              <a href="/createlisting" className="hover:text-gray-300 transition-colors">Dodaj Ogłoszenie</a>
              <a href="/profile" className="hover:text-gray-300 transition-colors">Profil</a>
              <a href="/contact" className="hover:text-gray-300 transition-colors">Kontakt</a>
            </>
          )}
        </nav>

        {/* Ikona menu mobilnego */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {/* Ikona menu hamburger */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobilne */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-bottle-green text-white font-poppins uppercase text-sm">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {!isLoggedIn ? (
              <>
                <a href="/" className="block hover:text-gray-300">Strona Główna</a>
                <a href="/browselisting" className="block hover:text-gray-300">Ogłoszenia</a>
                <a href="/createlisting" className="block hover:text-gray-300">Dodaj Ogłoszenie</a>
                <a href="/contact" className="block hover:text-gray-300">Kontakt</a>
                <a href="/login" className="block hover:text-gray-300 mt-2">Zaloguj się</a>
                <a href="/register" className="block hover:text-gray-300">Zarejestruj się</a>
              </>
            ) : (
              <>
                <a href="/" className="block hover:text-gray-300">Strona Główna</a>
                <a href="/listings" className="block hover:text-gray-300">Lista Ogłoszeń</a>
                <a href="/createlisting" className="block hover:text-gray-300">Dodaj Ogłoszenie</a>
                <a href="/profile" className="block hover:text-gray-300">Profil</a>
                <a href="/contact" className="block hover:text-gray-300">Kontakt</a>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
