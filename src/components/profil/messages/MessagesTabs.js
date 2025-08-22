import React from 'react';
import { Inbox, Send, Star, Archive } from 'lucide-react';
import { UI_FOLDERS } from '../../../contexts/constants/messageFolders';

/**
 * Komponent zakładek wiadomości
 * 
 * Na urządzeniach mobilnych wyświetla 4 zakładki: Odebrane, Wysłane, Ważne, Archiwum
 * Na desktopach wyświetla tylko 2 zakładki: Odebrane, Wysłane
 * 
 * @param {string} activeTab - aktywna zakładka
 * @param {Function} onTabChange - funkcja wywoływana przy zmianie zakładki
 * @param {Object} unreadCount - liczba nieprzeczytanych wiadomości w poszczególnych folderach
 */
const MessagesTabs = ({ activeTab, setActiveTab, unreadCount = {} }) => {
  const isMobile = window.innerWidth < 768;
  
  const ICONS = {
    odebrane: <Inbox className="w-5 h-5" />,
    wyslane: <Send className="w-5 h-5" />,
    wazne: <Star className="w-5 h-5" />,
    archiwum: <Archive className="w-5 h-5" />,
  };

  // Wyświetlamy wszystkie foldery niezależnie od typu urządzenia
  const folders = UI_FOLDERS.map((id) => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    icon: ICONS[id],
    count: unreadCount[id] || 0,
  }));

  return (
    <div className="bg-white border-b border-gray-200">
      <nav className={`flex ${isMobile ? 'flex-wrap' : ''}`}>
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setActiveTab(folder.id)}
            className={`
              flex items-center px-4 py-3 text-sm font-medium ${isMobile ? 'flex-1 justify-center' : ''}
              ${activeTab === folder.id 
                ? 'text-[#35530A] border-b-2 border-[#35530A]' 
                : 'text-gray-500 hover:text-[#35530A] hover:border-b-2 hover:border-gray-300'}
            `}
          >
            <span className="mr-2">{folder.icon}</span>
            {!isMobile && folder.label}
            {folder.count > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-[#35530A] text-white">
                {folder.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MessagesTabs;
