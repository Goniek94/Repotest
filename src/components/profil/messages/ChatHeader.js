import React, { useState, useRef, useEffect } from 'react';
import { Star, Trash2, ArrowLeft, MoreVertical, Archive, Reply, Flag, Paperclip } from 'lucide-react';

/**
 * Nagłówek czatu z informacjami o konwersacji i opcjami zarządzania
 */
const ChatHeader = ({ 
  conversation, 
  onBack, 
  onStar, 
  onDelete, 
  onReply, 
  onArchive, 
  onReport,
  onMarkAsRead
}) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const menuRef = useRef(null);
  
  // Zamykanie menu przy kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActionMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Jeśli nie ma konwersacji, wyświetl pusty nagłówek
  if (!conversation) {
    return (
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 h-16 bg-white">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="p-1 rounded-full hover:bg-[#35530A] hover:bg-opacity-10 text-gray-500 hover:text-[#35530A] md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-medium text-gray-900 ml-2">Wiadomości</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-[#35530A] text-white shadow-sm">
      <div className="flex items-center">
        {/* Przycisk powrotu/zamknięcia - widoczny na desktop i mobile */}
        <button 
          onClick={onBack} 
          className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 text-white hover:text-white mr-2"
          title="Zamknij konwersację"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Avatar rozmówcy */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-medium">
            {conversation.sender?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          
          {/* Status (online/offline) */}
          {conversation.sender?.status && (
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              conversation.sender.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}></span>
          )}
        </div>
        
        {/* Informacje o rozmówcy */}
        <div className="ml-3">
          <h2 className="text-base font-medium text-white">
            {conversation.sender?.name || 'Nieznany użytkownik'}
          </h2>
          <p className="text-xs text-white text-opacity-80">
            {conversation.sender?.lastSeen 
              ? `Ostatnio online: ${new Date(conversation.sender.lastSeen).toLocaleString('pl-PL', {
                  day: 'numeric', 
                  month: 'short', 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}`
              : 'Status nieznany'}
          </p>
        </div>
      </div>
      
      {/* Przyciski akcji */}
      <div className="flex items-center space-x-1">
        {/* Gwiazdka */}
        <button 
          onClick={() => onStar && onStar(conversation.id)}
          className={`p-1.5 rounded-full hover:bg-white hover:bg-opacity-20 ${
            conversation.isStarred 
              ? 'text-yellow-300' 
              : 'text-white hover:text-white'
          }`}
          title={conversation.isStarred ? 'Usuń z ważnych' : 'Oznacz jako ważne'}
        >
          <Star className="w-5 h-5" />
        </button>
        
        {/* Odpowiedz */}
        <button 
          onClick={() => onReply && onReply(conversation.id)}
          className="p-1.5 rounded-full text-white hover:bg-white hover:bg-opacity-20 hover:text-white"
          title="Odpowiedz"
        >
          <Reply className="w-5 h-5" />
        </button>
        
        {/* Menu akcji */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="p-1.5 rounded-full text-white hover:bg-white hover:bg-opacity-20 hover:text-white"
            title="Więcej opcji"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showActionMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
              {/* Archiwizuj */}
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  onArchive && onArchive(conversation.id);
                  setShowActionMenu(false);
                }}
              >
                <Archive className="w-4 h-4 mr-2" />
                Przenieś do archiwum
              </button>
              
              {/* Oznacz jako ważne */}
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  onStar && onStar(conversation.id);
                  setShowActionMenu(false);
                }}
              >
                <Star className="w-4 h-4 mr-2" />
                {conversation.isStarred ? 'Usuń z ważnych' : 'Oznacz jako ważne'}
              </button>
              
              {/* Oznacz jako przeczytane */}
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  onMarkAsRead && onMarkAsRead(conversation.id);
                  setShowActionMenu(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Oznacz jako przeczytane
              </button>
              
              {/* Zgłoś */}
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  onReport && onReport(conversation.id);
                  setShowActionMenu(false);
                }}
              >
                <Flag className="w-4 h-4 mr-2" />
                Zgłoś wiadomość
              </button>
              
              {/* Usuń */}
              <button 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center"
                onClick={() => {
                  onDelete && onDelete(conversation.id);
                  setShowActionMenu(false);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Usuń konwersację
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
