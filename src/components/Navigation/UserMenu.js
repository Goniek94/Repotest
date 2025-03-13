// UserMenu.js
import { Link } from 'react-router-dom';

const UserMenu = ({ notifications, handleLogout, isUserMenuOpen, setIsUserMenuOpen }) => (
  <div className="relative user-menu">
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsUserMenuOpen(!isUserMenuOpen);
      }}
      className="px-4 py-2 font-bold uppercase rounded-[2px] hover:bg-gray-100 transition-colors relative flex items-center gap-2 text-gray-800 text-sm lg:text-base xl:text-lg"
    >
      Mój Profil
      {(notifications.messages + notifications.alerts > 0) && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {notifications.messages + notifications.alerts}
        </div>
      )}
    </button>

    {isUserMenuOpen && (
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-[2px] shadow-xl z-50 border border-gray-200">
        <div className="py-2">
          <Link to="/profil" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase">
            Mój Profil
          </Link>
          <Link to="/profil/messages" className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase">
            Wiadomości
            {notifications.messages > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.messages}
              </span>
            )}
          </Link>
          <Link to="/profil/notifications" className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase">
            Powiadomienia
            {notifications.alerts > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.alerts}
              </span>
            )}
          </Link>
          <Link to="/profil/transactions" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase">
            Historia Transakcji
          </Link>
          <Link to="/profil/stats" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase">
            Statystyki Konta
          </Link>
          <Link to="/profil/listings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase">
            Moje Ogłoszenia
          </Link>
          <Link to="/profil/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 uppercase">
            Ustawienia konta
          </Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 uppercase">
            Wyloguj się
          </button>
        </div>
      </div>
    )}
  </div>
);

export default UserMenu;