import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaBell, FaEnvelope } from 'react-icons/fa';

const Navigation = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Klik poza menu -> zamyka user menu
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Wylogowanie
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  /**
   * Komponent ikony z licznikiem.
   * - `icon` – ikona z react-icons (np. FaEnvelope, FaBell),
   * - `count` – liczba (np. nieprzeczytane wiadomości),
   * - `linkTo` – dokąd ma prowadzić kliknięcie,
   * - `label` – tytuł (tooltip).
   */
  const IconButton = ({ icon: Icon, count, linkTo, label }) => (
    <Link
      to={linkTo}
      className="relative inline-block p-2 text-white hover:bg-green-700 
                 transition-colors duration-300 rounded-full"
      title={label}
    >
      <Icon size={24} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                         w-5 h-5 flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </Link>
  );

  // Menu rozwijane użytkownika
  const UserMenu = () => (
    <div className="relative user-menu">
      {/* Przyciskiem otwieramy menu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsUserMenuOpen(!isUserMenuOpen);
        }}
        className="px-4 py-2 text-white text-lg font-bold uppercase"
      >
        Mój Profil
      </button>

      {isUserMenuOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-56 bg-white
                     rounded-[2px] shadow-xl z-50"
        >
          <div className="py-2">
            <Link
              to="/user/data"
              className="block px-4 py-2 text-gray-800 hover:bg-green-50 uppercase"
            >
              Dane użytkownika
            </Link>
            <Link
              to="/user/messages"
              className="block px-4 py-2 text-gray-800 hover:bg-green-50 uppercase"
            >
              Wiadomości
            </Link>
            <Link
              to="/user/notifications"
              className="block px-4 py-2 text-gray-800 hover:bg-green-50 uppercase"
            >
              Powiadomienia
            </Link>
            <Link
              to="/user/UserHistoryTransactions"
              className="block px-4 py-2 text-gray-800 hover:bg-green-50 uppercase"
            >
              Historia Transakcji
            </Link>
            <Link
              to="/user/stats"
              className="block px-4 py-2 text-gray-800 hover:bg-green-50 uppercase"
            >
              Statystyki konta
            </Link>
            <Link
              to="/user/listings"
              className="block px-4 py-2 text-gray-800 hover:bg-green-50 uppercase"
            >
              Moje ogłoszenia
            </Link>
            <Link
              to="/user/favorites"
              className="block px-4 py-2 text-gray-800 hover:bg-green-50 uppercase"
            >
              Ulubione ogłoszenia
            </Link>
            <Link
              to="/user/invoices"
              className="block px-4 py-2 text-gray-800 hover:bg-green-50 uppercase"
            >
              Ustawienia konta
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 uppercase"
            >
              Wyloguj się
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Modal logowania
  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-[2px] shadow-lg max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold uppercase">Zaloguj się</h2>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsLoggedIn(true);
            setIsLoginModalOpen(false);
          }}
        >
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1 uppercase"
              htmlFor="email"
            >
              Email lub Numer Telefonu
            </label>
            <input
              type="text"
              id="email"
              className="w-full border border-gray-300 rounded-[2px] p-2"
              placeholder="Podaj swój email lub telefon"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1 uppercase"
              htmlFor="password"
            >
              Hasło
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded-[2px] p-2"
              placeholder="Podaj hasło"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-[2px] uppercase text-base"
          >
            Zaloguj się
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a href="#reset" className="text-green-600 hover:underline uppercase">
            Odzyskaj hasło
          </a>
          <br />
          <span className="uppercase">Nie masz konta?</span>{' '}
          <Link
            to="/register"
            className="text-green-600 hover:underline uppercase"
          >
            Zarejestruj się
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <header className="bg-[#35530A] text-white sticky top-0 z-50 shadow-md rounded-[2px]">
      <div className="w-full flex items-center justify-between px-8 py-4">
        {/* Logo + nazwa */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white text-gray-800 flex items-center justify-center rounded-[2px] font-bold">
            LOGO
          </div>
          <h2 className="text-2xl font-extrabold uppercase tracking-wider">
            <Link to="/">AutoSell.PL</Link>
          </h2>
        </div>

        {/* Menu środkowe */}
        <nav
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:flex md:flex-grow md:justify-center items-center`}
        >
          <ul className="flex flex-col md:flex-row items-center gap-6 text-lg font-bold tracking-wide uppercase">
            <li>
              <Link to="/" className="px-4 py-2">
                Strona główna
              </Link>
            </li>
            <li>
              <Link to="/listings" className="px-4 py-2">
                Lista ogłoszeń
              </Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/about-company" className="px-4 py-2">
                    O Firmie
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="px-4 py-2">
                    Kontakt
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/favorites" className="px-4 py-2">
                    Ulubione
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="px-4 py-2">
                    Kontakt
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Prawa część */}
        <div className="flex items-center gap-6">
          {/* Przycisk Dodaj ogłoszenie */}
          <Link
            to={isLoggedIn ? '/createlisting' : '#'}
            onClick={(e) =>
              !isLoggedIn && (e.preventDefault() || setIsLoginModalOpen(true))
            }
            className="bg-yellow-500 px-6 py-3 rounded-[2px] shadow-lg text-lg font-bold text-green-800"
          >
            Dodaj ogłoszenie
          </Link>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-6">
              {/* Ikonki wiadomości i powiadomień */}
              <IconButton
                icon={FaEnvelope}
                count={3}
                linkTo="/user/messages"
                label="Wiadomości"
              />
              <IconButton
                icon={FaBell}
                count={5}
                linkTo="/user/notifications"
                label="Powiadomienia"
              />

              <UserMenu />
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-3 text-lg font-bold uppercase"
              >
                Zaloguj się
              </button>
              <Link
                to="/register"
                className="px-5 py-3 text-lg font-bold uppercase"
              >
                Zarejestruj się
              </Link>
            </>
          )}
        </div>

        {/* Hamburger icon (mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Modal logowania */}
      {isLoginModalOpen && <LoginModal />}
    </header>
  );
};

export default Navigation;
