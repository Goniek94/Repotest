import React from 'react';
import { NavLink } from 'react-router-dom';

// Stałe dla zakładek w panelu użytkownika
export const TABS = {
  PANEL: 'panel',
  MESSAGES: 'messages',
  LISTINGS: 'listings',
  NOTIFICATIONS: 'notifications',
  TRANSACTIONS: 'transactions',
  CONTACT: 'contact'
};

/**
 * Komponent nawigacji użytkownika
 * Props:
 * - activeTab: string - aktywna zakładka
 * - onTabChange: function - funkcja wywoływana przy zmianie zakładki
 */
const UserNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: TABS.PANEL, label: 'Panel', path: '/profil' },
    { id: TABS.MESSAGES, label: 'Wiadomości', path: '/profil/messages' },
    { id: TABS.LISTINGS, label: 'Moje ogłoszenia', path: '/profil/listings' },
    { id: TABS.NOTIFICATIONS, label: 'Powiadomienia', path: '/profil/notifications' },
    { id: TABS.TRANSACTIONS, label: 'Historia transakcji', path: '/profil/transactions' },
    { id: TABS.CONTACT, label: 'Kontakt', path: '/profil/contact' }
  ];

  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex -mb-px space-x-8">
        {tabs.map(tab => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) => 
              `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                isActive || activeTab === tab.id
                  ? 'border-green-700 text-green-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
            onClick={() => onTabChange && onTabChange(tab.id)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default UserNavigation;