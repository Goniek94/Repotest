import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaEnvelope, FaCamera, FaHeart } from 'react-icons/fa';

function UserNavigation({ user, handleLogout }) {
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState('');

  const defaultAvatar = '/path/to/default-avatar.png';

  return (
    <div className="hidden md:flex items-center gap-6">
      {/* Przycisk "Dodaj ogłoszenie" */}
      <Link
        to="/createlisting"
        className="bg-yellow-500 text-green-800 font-bold py-4 px-10 rounded-lg hover:bg-yellow-600 transition-transform hover:scale-110 text-base tracking-wide shadow-md mr-4"
      >
        Dodaj ogłoszenie
      </Link>

      {/* Avatar */}
      <div
        className="relative"
        onMouseEnter={() => setIsAvatarHovered(true)}
        onMouseLeave={() => setIsAvatarHovered(false)}
      >
        <img
          src={user.avatar || defaultAvatar}
          alt="Avatar"
          className="w-12 h-12 rounded-full border-2 border-white shadow-md cursor-pointer"
        />
        {isAvatarHovered && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-xs px-2 py-1 rounded shadow-md">
            <FaCamera className="inline-block mr-2" /> Zmień avatar
          </div>
        )}
      </div>

      {/* Ulubione */}
      <div
        className="relative group"
        onMouseEnter={() => setHoveredIcon('Ulubione')}
        onMouseLeave={() => setHoveredIcon('')}
      >
        <Link to="/favorites">
          <FaHeart size={24} className="text-red-500" />
        </Link>
        {hoveredIcon === 'Ulubione' && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md">
            Ulubione
          </div>
        )}
      </div>

      {/* Wiadomości */}
      <div
        className="relative group"
        onMouseEnter={() => setHoveredIcon('Wiadomości')}
        onMouseLeave={() => setHoveredIcon('')}
      >
        <Link to="/messages">
          <FaEnvelope size={24} />
        </Link>
        {hoveredIcon === 'Wiadomości' && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md">
            Wiadomości
          </div>
        )}
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          3
        </span>
      </div>

      {/* Powiadomienia */}
      <div
        className="relative group"
        onMouseEnter={() => setHoveredIcon('Powiadomienia')}
        onMouseLeave={() => setHoveredIcon('')}
      >
        <Link to="/notifications">
          <FaBell size={24} />
        </Link>
        {hoveredIcon === 'Powiadomienia' && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md">
            Powiadomienia
          </div>
        )}
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          5
        </span>
      </div>

      {/* Mój Profil i Wyloguj */}
      <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="hover:text-[#123524] transition-colors uppercase font-semibold text-sm lg:text-base tracking-wider"
        >
          Mój profil
        </Link>
        <button
          onClick={handleLogout}
          className="hover:text-[#123524] transition-colors uppercase font-semibold text-sm lg:text-base tracking-wider"
        >
          Wyloguj się
        </button>
      </div>
    </div>
  );
}

export default UserNavigation;
