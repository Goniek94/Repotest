import React from 'react';
import { Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import SecurityPanel from './SecurityPanel';
import PrivacyPanel from './PrivacyPanel';
import NotificationsPanel from './NotificationsPanel';
import UserDataPanel from './UserDataPanel';
import SettingsPanel from './SettingsPanel';

/**
 * Komponent zarządzający ustawieniami użytkownika
 * Zawiera podstrony z różnymi kategoriami ustawień
 */
const UserSettings = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Przycisk powrotu do panelu */}
      <div className="flex items-center border-b border-gray-200 pb-4 mb-6">
        <Link 
          to="/profil" 
          className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Powrót do panelu</span>
        </Link>
      </div>
      
      {/* Zakładki nawigacyjne na górze */}
      <nav className="border-b border-gray-200">
        <div className="flex">
          <NavLink 
            to="/profil/settings/user-data" 
            className={({ isActive }) => 
              `px-6 py-3 text-center border-b-2 font-medium text-sm ${isActive 
                ? 'border-green-600 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
            }
          >
            Dane użytkownika
          </NavLink>
          
          <NavLink 
            to="/profil/settings/security" 
            className={({ isActive }) => 
              `px-6 py-3 text-center border-b-2 font-medium text-sm ${isActive 
                ? 'border-green-600 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
            }
          >
            Bezpieczeństwo
          </NavLink>
          
          <NavLink 
            to="/profil/settings/notifications" 
            className={({ isActive }) => 
              `px-6 py-3 text-center border-b-2 font-medium text-sm ${isActive 
                ? 'border-green-600 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
            }
          >
            Powiadomienia
          </NavLink>
          
          <NavLink 
            to="/profil/settings/privacy" 
            className={({ isActive }) => 
              `px-6 py-3 text-center border-b-2 font-medium text-sm ${isActive 
                ? 'border-green-600 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
            }
          >
            Prywatność
          </NavLink>
        </div>
      </nav>
      
      {/* Zawartość wybranej zakładki */}
      <div className="p-6">
        <Routes>
          <Route index element={<Navigate to="/profil/settings/user-data" replace />} />
          <Route path="security" element={<SecurityPanel />} />
          <Route path="privacy" element={<PrivacyPanel />} />
          <Route path="notifications" element={<NotificationsPanel />} />
          <Route path="user-data" element={<UserDataPanel />} />
          <Route path="*" element={<Navigate to="/profil/settings/user-data" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserSettings;