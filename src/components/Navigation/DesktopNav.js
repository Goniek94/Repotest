import React from 'react';
import { Link } from 'react-router-dom';

const DesktopNav = ({ user }) => (
  <nav>
    <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8 font-bold uppercase text-base lg:text-lg xl:text-xl">
      <li>
        <Link to="/" className="hover:bg-gray-100 px-3 py-2 rounded-[2px] transition-colors">
          Strona główna
        </Link>
      </li>
      <li>
        <Link to="/listings" className="hover:bg-gray-100 px-3 py-2 rounded-[2px] transition-colors">
          Lista ogłoszeń
        </Link>
      </li>
      {user && (
        <li>
          {/* Ewentualne linki widoczne tylko dla zalogowanych */}
        </li>
      )}
    </ul>
  </nav>
);

export default DesktopNav;
