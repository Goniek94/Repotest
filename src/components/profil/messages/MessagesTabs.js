import React, { memo, useState } from 'react';
import { Inbox, Send, Star, Archive, ChevronUp, ChevronDown } from 'lucide-react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';
import { UI_FOLDERS } from '../../../constants/messageFolders';

/**
 * Komponent zakładek wiadomości z funkcją zwijania
 * 
 * Wyświetla 4 zakładki: Odebrane, Wysłane, Ważne, Archiwum
 * Można zwijać/rozwijać menu za pomocą przycisku toggle
 * 
 * @param {string} activeTab - aktywna zakładka
 * @param {Function} onTabChange - funkcja wywoływana przy zmianie zakładki
 * @param {Object} unreadCount - liczba nieprzeczytanych wiadomości w poszczególnych folderach
 */
const MessagesTabs = memo(({ activeTab, onTabChange, unreadCount = {} }) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const ICONS = {
    odebrane: <Inbox className="w-5 h-5" />,
    wyslane: <Send className="w-5 h-5" />,
    wazne: <Star className="w-5 h-5" />,
    archiwum: <Archive className="w-5 h-5" />,
  };

  // Mapowanie nazw folderów na ładne etykiety
  const FOLDER_LABELS = {
    odebrane: 'Odebrane',
    wyslane: 'Wysłane', 
    wazne: 'Ważne',
    archiwum: 'Archiwum'
  };

  // Wyświetlamy wszystkie foldery niezależnie od typu urządzenia
  const folders = UI_FOLDERS.map((id) => ({
    id,
    label: FOLDER_LABELS[id] || id.charAt(0).toUpperCase() + id.slice(1),
    icon: ICONS[id],
    count: unreadCount[id] || 0,
  }));

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const activeFolder = folders.find(f => f.id === activeTab);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* MOBILE - Kompaktowy pasek z ikonkami */}
      <div className="md:hidden flex items-center justify-center px-2 py-3">
        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onTabChange(folder.id)}
              className={`
                relative flex items-center justify-center p-3 rounded-md transition-all duration-200 ease-in-out group
                ${activeTab === folder.id 
                  ? 'bg-[#35530A] text-white shadow-md' 
                  : 'text-gray-500 hover:text-[#35530A] hover:bg-white'}
              `}
              title={folder.label} // Tooltip na mobile
            >
              {/* Licznik dla nieprzeczytanych wiadomości */}
              {folder.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg z-10 animate-pulse">
                  {folder.count > 99 ? '99+' : folder.count}
                </span>
              )}
              
              {/* Ikona */}
              <span className={`transition-transform duration-200 ${activeTab === folder.id ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                {folder.icon}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP - Pasek zakładek jak w powiadomieniach */}
      <div className="hidden md:block">
        <nav className="flex relative">
          {/* Sliding indicator dla aktywnej zakładki */}
          <div 
            className="absolute bottom-0 h-0.5 bg-[#35530A] transition-all duration-300 ease-in-out"
            style={{
              width: `${100 / folders.length}%`,
              left: `${(folders.findIndex(f => f.id === activeTab) * 100) / folders.length}%`
            }}
          />
          
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onTabChange(folder.id)}
              className={`
                relative flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-gray-50
                ${activeTab === folder.id 
                  ? 'text-[#35530A] bg-[#35530A] bg-opacity-5' 
                  : 'text-gray-500 hover:text-[#35530A]'}
              `}
            >
              {/* Licznik dla nieprzeczytanych wiadomości */}
              {folder.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-lg z-10 animate-pulse">
                  {folder.count > 99 ? '99+' : folder.count}
                </span>
              )}
              
              {/* Ikona */}
              <span className={`mr-2 transition-transform duration-200 ${activeTab === folder.id ? 'scale-110' : 'scale-100'}`}>
                {folder.icon}
              </span>
              
              {/* Label */}
              <span className="font-medium">
                {folder.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
});

// Dodanie displayName dla lepszego debugowania
MessagesTabs.displayName = 'MessagesTabs';

export default MessagesTabs;
