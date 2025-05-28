import React from 'react';
import { Inbox, Send, Star, Archive, File } from 'lucide-react';

/**
 * Komponent wyświetlający poziome zakładki folderów wiadomości
 */
const MessagesTabs = ({ activeTab, setActiveTab, messages }) => {
  // Definicja folderów z ikonami i etykietami
  const folders = [
    { id: 'odebrane', label: 'Odebrane', icon: <Inbox className="w-4 h-4" />, badge: messages.filter(m => !m.isRead && m.folder === 'odebrane').length },
    { id: 'wyslane', label: 'Wysłane', icon: <Send className="w-4 h-4" /> },
    { id: 'wazne', label: 'Ważne', icon: <Star className="w-4 h-4" /> },
    { id: 'archiwum', label: 'Archiwum', icon: <Archive className="w-4 h-4" /> },
    { id: 'robocze', label: 'Robocze', icon: <File className="w-4 h-4" /> },
    // Usunięto zakładkę "Kosz"
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex flex-nowrap overflow-x-auto px-2 py-2 no-scrollbar">
        {folders.map(folder => (
          <button
            key={folder.id}
            onClick={() => setActiveTab(folder.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mr-2 whitespace-nowrap
                      ${activeTab === folder.id
                ? 'bg-[#35530A] bg-opacity-10 text-[#35530A]'
                : 'text-gray-600 hover:bg-gray-100 hover:text-[#35530A]'
              }`}
          >
            <span className="mr-2">{folder.icon}</span>
            <span>{folder.label}</span>
            {folder.badge > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                {folder.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MessagesTabs;