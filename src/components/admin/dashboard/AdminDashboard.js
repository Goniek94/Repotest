import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUsers, FaCarAlt, FaComments, FaPercent, FaCog } from 'react-icons/fa';

const AdminPanel = ({ handleLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Komponent Sidebar z nawigacją
  const Sidebar = () => (
    <div className={`fixed top-0 left-0 h-full bg-[#35530A] text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
      {/* Logo i nazwa */}
      <div className="flex items-center gap-3 p-4 border-b border-[#2D4A06]">
        <div className="w-10 h-10 bg-white text-[#35530A] flex items-center justify-center rounded-[2px] font-bold">
          LOGO
        </div>
        <h2 className="font-bold uppercase">AutoSell.PL</h2>
      </div>

      {/* Menu nawigacyjne */}
      <nav className="mt-4">
        {/* Sekcja administracyjna */}
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase">Panel Administratora</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/admin" className="flex items-center gap-3 px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                <FaCog />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center gap-3 px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                <FaUsers />
                Użytkownicy
              </Link>
            </li>
            <li>
              <Link to="/admin/listings" className="flex items-center gap-3 px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                <FaCarAlt />
                Ogłoszenia
              </Link>
            </li>
            <li>
              <Link to="/admin/comments" className="flex items-center gap-3 px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                <FaComments />
                Komentarze
              </Link>
            </li>
            <li>
              <Link to="/admin/discounts" className="flex items-center gap-3 px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                <FaPercent />
                Zniżki
              </Link>
            </li>
          </ul>
        </div>

        {/* Główna nawigacja strony */}
        <div className="px-4 py-2 mt-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase">Nawigacja Strony</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/" className="flex items-center px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                Strona główna
              </Link>
            </li>
            <li>
              <Link to="/listings" className="flex items-center px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                Lista ogłoszeń
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="flex items-center px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                Ulubione
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        {/* Opcje użytkownika */}
        <div className="px-4 py-2 mt-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase">Moje Konto</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/user" className="flex items-center px-4 py-2 hover:bg-[#2D4A06] rounded-[2px] transition-colors">
                Mój Profil
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#2D4A06] rounded-[2px] transition-colors"
              >
                Wyloguj się
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );

  // Top Bar
  const TopBar = () => (
    <div className="fixed top-0 left-0 right-0 bg-white h-16 shadow-md z-20 flex items-center justify-between px-4">
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="text-[#35530A] p-2 hover:bg-gray-100 rounded-[2px] transition-colors"
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div className="flex items-center gap-4">
        <Link
          to="/createlisting"
          className="bg-yellow-500 px-4 py-2 rounded-[2px] shadow-md font-bold uppercase text-green-800 hover:opacity-90 transition-opacity"
        >
          Dodaj ogłoszenie
        </Link>
      </div>
    </div>
  );

  // Dashboard ze statystykami
  const Dashboard = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Użytkownicy</h3>
          <p className="text-3xl font-bold">120</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Ogłoszenia</h3>
          <p className="text-3xl font-bold">450</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Komentarze</h3>
          <p className="text-3xl font-bold">89</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Aktywne zniżki</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>

      {/* Najnowsze aktywności */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Najnowsze Aktywności</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <p className="text-sm text-gray-600">Nowe ogłoszenie: BMW M3 2020</p>
            <p className="text-xs text-gray-400">2 minuty temu</p>
          </div>
          <div className="p-4 border-b">
            <p className="text-sm text-gray-600">Nowy użytkownik: Jan Kowalski</p>
            <p className="text-xs text-gray-400">15 minut temu</p>
          </div>
          <div className="p-4 border-b">
            <p className="text-sm text-gray-600">Zaktualizowane ogłoszenie: Audi A4</p>
            <p className="text-xs text-gray-400">1 godzinę temu</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600">Nowy komentarz do ogłoszenia: Mercedes C-Class</p>
            <p className="text-xs text-gray-400">2 godziny temu</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <TopBar />
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} pt-16`}>
        <Dashboard />
      </main>
    </div>
  );
};

export default AdminPanel;