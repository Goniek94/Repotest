// src/components/admin/AdminPanel.js
/**
 * Główny komponent panelu administratora
 * Main admin panel component
 */

import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { FaUsers, FaCarAlt, FaChartBar, FaExclamationTriangle, FaCog } from 'react-icons/fa';

// Sekcje panelu administratora
import UserManagement from './sections/UserManagement';
import ListingsManagement from './sections/ListingsManagement';
import ReportsManagementSection from './sections/ReportsManagementSection';
import Statistics from './sections/Statistics';
import Settings from './sections/Settings';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('users');
  const navigate = useNavigate();

  // Nawigacja do sekcji
  const navigateToSection = (section) => {
    setActiveSection(section);
    navigate(`/admin/${section}`);
  };

  // Elementy menu bocznego
  const sidebarItems = [
    { id: 'users', label: 'Użytkownicy', icon: <FaUsers />, path: '/admin/users' },
    { id: 'listings', label: 'Ogłoszenia', icon: <FaCarAlt />, path: '/admin/listings' },
    { id: 'reports', label: 'Zgłoszenia', icon: <FaExclamationTriangle />, path: '/admin/reports' },
    { id: 'statistics', label: 'Statystyki', icon: <FaChartBar />, path: '/admin/statistics' },
    { id: 'settings', label: 'Ustawienia', icon: <FaCog />, path: '/admin/settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Nagłówek */}
      <header className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white shadow-md">
        <h1 className="text-xl font-semibold">Panel Administratora</h1>
        <div className="flex items-center gap-4">
          <span>Admin</span>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Wyloguj
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Menu boczne */}
        <aside className="w-64 bg-gray-800 text-white">
          <nav>
            <ul>
              {sidebarItems.map((item) => (
                <li 
                  key={item.id} 
                  className={`flex items-center px-6 py-4 cursor-pointer transition-colors ${
                    activeSection === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => navigateToSection(item.id)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Główna zawartość */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/listings" element={<ListingsManagement />} />
            <Route path="/reports" element={<ReportsManagementSection />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<UserManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
