import React from 'react';
import { Inbox, Send, Star, Archive } from 'lucide-react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';

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
const MessagesTabs = ({ activeTab, onTabChange, unreadCount = {} }) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  
  // Podstawowe foldery (dostępne zawsze)
  const baseFolders = [
    { 
      id: 'odebrane', 
      label: 'Odebrane', 
      icon: <Inbox className="w-5 h-5" />, 
      count: unreadCount.odebrane || 0 
    },
    { 
      id: 'wyslane', 
      label: 'Wysłane', 
      icon: <Send className="w-5 h-5" />, 
      count: unreadCount.wyslane || 0 
    }
  ];
  
  // Dodatkowe foldery (tylko na mobile)
  const mobileFolders = [
    { 
      id: 'wazne', 
      label: 'Ważne', 
      icon: <Star className="w-5 h-5" />, 
      count: unreadCount.wazne || 0 
    },
    { 
      id: 'archiwum', 
      label: 'Archiwum', 
      icon: <Archive className="w-5 h-5" />, 
      count: unreadCount.archiwum || 0 
    }
  ];
  
  // Wybór folderów w zależności od urządzenia
  const folders = isMobile ? [...baseFolders, ...mobileFolders] : baseFolders;

  return (
    <div className="bg-white border-b border-gray-200">
      <nav className={`flex ${isMobile ? 'flex-wrap' : ''}`}>
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onTabChange(folder.id)}
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