import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaList, FaHeart, FaUser, FaSignOutAlt, FaPlus } from 'react-icons/fa';

const MobileMenu = ({ 
  isOpen, 
  user, 
  notifications, 
  handleOpenLogin, 
  handleLogout, 
  setIsMobileMenuOpen 
}) => {
  if (!isOpen) return null;
  
  const closeMenu = () => setIsMobileMenuOpen(false);
  
  return (
    <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
      <div className="p-4 pt-16">
        {/* Przycisk zamykania - dodany na górze */}
        <button 
          className="absolute top-4 right-4 text-gray-800" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      
        <div className="flex flex-col">
          <Link 
            to="/"
            className="flex items-center py-4 border-b border-gray-200 text-[#35530A]"
            onClick={closeMenu}
          >
            <FaHome className="mr-3" /> STRONA GŁÓWNA
          </Link>
          
          <Link 
            to="/listings"
            className="flex items-center py-4 border-b border-gray-200 text-[#35530A]"
            onClick={closeMenu}
          >
            <FaList className="mr-3" /> LISTA OGŁOSZEŃ
          </Link>
          
          {user && (
            <Link 
              to="/favorites"
              className="flex items-center py-4 border-b border-gray-200 text-[#35530A]"
              onClick={closeMenu}
            >
              <FaHeart className="mr-3" /> ULUBIONE
            </Link>
          )}
          
          {/* Przycisk Dodaj Ogłoszenie w menu mobilnym - podświetlony na żółto */}
          <Link
            to={user ? '/createlisting' : '#'}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                handleOpenLogin();
              } else {
                closeMenu();
              }
            }}
            className="flex items-center justify-center py-4 my-4 bg-yellow-500 text-white font-semibold px-4 hover:bg-yellow-600"
          >
            <FaPlus className="mr-2" /> DODAJ OGŁOSZENIE
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/profil"
                className="flex items-center justify-between py-4 border-b border-gray-200 text-[#35530A]"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <FaUser className="mr-3" /> MÓJ PROFIL
                </div>
                {(notifications?.messages + notifications?.alerts > 0) && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.messages + notifications.alerts}
                  </span>
                )}
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center py-4 text-left w-full border-b border-gray-200 text-[#35530A]"
              >
                <FaSignOutAlt className="mr-3" /> WYLOGUJ SIĘ
              </button>
            </>
          ) : (
            <button
              onClick={handleOpenLogin}
              className="flex items-center py-4 text-left w-full border-b border-gray-200 text-[#35530A]"
            >
              <FaUser className="mr-3" /> ZALOGUJ SIĘ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;