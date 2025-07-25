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

  // Wyświetlamy wszystkie foldery niezależnie od typu urządzenia
  const folders = UI_FOLDERS.map((id) => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    icon: ICONS[id],
    count: unreadCount[id] || 0,
  }));

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const activeFolder = folders.find(f => f.id === activeTab);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Nagłówek z przyciskiem zwijania */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Ikona aktywnej zakładki */}
          <span className="text-[#35530A]">
            {activeFolder?.icon}
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            {activeFolder?.label || 'Wiadomości'}
          </h2>
          {/* Licznik dla aktywnej zakładki */}
          {activeFolder?.count > 0 && (
            <span className="px-2 py-1 text-xs rounded-full bg-red-600 text-white font-bold animate-pulse">
              {activeFolder.count > 99 ? '99+' : activeFolder.count}
            </span>
          )}
        </div>
        
        {/* Przycisk zwijania */}
        <button
          onClick={toggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isCollapsed ? 'Rozwiń menu' : 'Zwiń menu'}
        >
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Zwijane menu zakładek */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? 'max-h-0' : 'max-h-96'
      }`}>
        <nav className={`flex ${isMobile ? 'flex-wrap' : ''} relative`}>
          {/* Sliding indicator dla aktywnej zakładki */}
          <div 
            className="absolute bottom-0 h-0.5 bg-[#35530A] transition-all duration-300 ease-in-out"
            style={{
              width: `${100 / folders.length}%`,
              left: `${(folders.findIndex(f => f.id === activeTab) * 100) / folders.length}%`
            }}
          />
          
          {folders.map((folder, index) => (
            <button
              key={folder.id}
              onClick={() => onTabChange(folder.id)}
              className={`
                relative flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out
                ${isMobile ? 'flex-1 justify-center min-h-[60px]' : 'hover:bg-gray-50'}
                ${activeTab === folder.id 
                  ? 'text-[#35530A] bg-[#35530A] bg-opacity-5' 
                  : 'text-gray-500 hover:text-[#35530A]'}
                ${isMobile ? 'active:scale-95 active:bg-gray-100' : ''}
              `}
              style={{
                transform: activeTab === folder.id && isMobile ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              {/* Dymek/chmurka nad zakładką "Odebrane" z animacją */}
              {folder.id === 'odebrane' && folder.count > 0 && (
                <span className="absolute -top-2 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-lg z-20 animate-pulse">
                  {folder.count > 99 ? '99+' : folder.count}
                </span>
              )}
              
              {/* Ikona z animacją */}
              <span className={`${!isMobile ? 'mr-2' : 'mb-1'} transition-transform duration-200 ${activeTab === folder.id ? 'scale-110' : 'scale-100'}`}>
                {folder.icon}
              </span>
              
              {/* Label - na mobile pod ikoną, na desktop obok */}
              {isMobile ? (
                <span className="text-xs font-medium truncate">
                  {folder.label}
                </span>
              ) : (
                <span className="font-medium">
                  {folder.label}
                </span>
              )}
              
              {/* Standardowy licznik dla pozostałych zakładek z animacją */}
              {folder.id !== 'odebrane' && folder.count > 0 && (
                <span className={`
                  ${isMobile ? 'absolute -top-1 -right-1' : 'ml-2'} 
                  px-2 py-0.5 text-xs rounded-full bg-[#35530A] text-white 
                  transition-all duration-200 transform hover:scale-110
                  ${folder.count > 0 ? 'animate-bounce' : ''}
                `}>
                  {folder.count > 99 ? '99+' : folder.count}
                </span>
              )}
              
              {/* Ripple effect dla mobile */}
              {isMobile && (
                <span className="absolute inset-0 rounded-lg overflow-hidden">
                  <span className="absolute inset-0 bg-[#35530A] opacity-0 transition-opacity duration-200 hover:opacity-10" />
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Dodatkowy separator dla lepszego wyglądu */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
});

// Dodanie displayName dla lepszego debugowania
MessagesTabs.displayName = 'MessagesTabs';

export default MessagesTabs;
