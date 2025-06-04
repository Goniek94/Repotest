import React, { useState, useCallback, memo } from 'react';
import { Star, Trash2, MoreVertical, Paperclip, Archive } from 'lucide-react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';

/**
 * Komponent wyświetlający listę konwersacji
 * Dostosowany do współpracy z hookiem useConversations
 */
const MessageList = memo(({ 
  messages, 
  activeConversation, 
  onSelectConversation, 
  onStar, 
  onDelete, 
  onMove 
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  
  // Stan dla menu akcji
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  
  // Sortowanie konwersacji - nieprzeczytane na górze, następnie według daty
  const sortedConversations = [...messages].sort((a, b) => {
    // Nieprzeczytane konwersacje na górze
    if ((a.unreadCount > 0) !== (b.unreadCount > 0)) {
      return a.unreadCount > 0 ? -1 : 1;
    }
    // Dalej sortowanie według daty ostatniej wiadomości (od najnowszych)
    return new Date(b.lastMessage.date) - new Date(a.lastMessage.date);
  });

  // Formatowanie daty - zoptymalizowane z użyciem useCallback
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Dzisiaj - tylko godzina
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    } 
    // Wczoraj
    else if (date.toDateString() === yesterday.toDateString()) {
      return 'Wczoraj';
    } 
    // W tym roku - dzień i miesiąc
    else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
    } 
    // Dawniej - pełna data
    else {
      return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }, []);

  // Skracanie tekstu
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Obsługa akcji - zoptymalizowane z useCallback
  const handleStarClick = useCallback((e, conversationId) => {
    e.stopPropagation();
    onStar && onStar(conversationId);
  }, [onStar]);

  const handleDeleteClick = useCallback((e, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    onDelete && onDelete(conversationId);
  }, [onDelete]);
  
  const handleArchiveClick = useCallback((e, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    onMove && onMove(conversationId, 'archiwum');
  }, [onMove]);
  
  const handleMoveToFolder = useCallback((e, conversationId, folder) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    onMove && onMove(conversationId, folder);
  }, [onMove]);
  
  const handleActionMenuClick = useCallback((e, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === conversationId ? null : conversationId);
  }, [openActionMenuId]);
  
  const handleOutsideClick = useCallback(() => {
    if (openActionMenuId) {
      setOpenActionMenuId(null);
    }
  }, [openActionMenuId]);
  
  // Dodanie nasłuchiwania kliknięć poza menu
  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div className="overflow-y-auto h-full bg-white flex-1">
      {sortedConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center py-10">
          <p className="text-center font-medium">Brak wiadomości</p>
          <p className="text-sm">Kiedy otrzymasz wiadomości, pojawią się tutaj</p>
        </div>
      ) : (
        <ul className={`divide-y divide-gray-200 ${isMobile ? 'text-sm' : ''}`}>
          {sortedConversations.map((conversation) => (
            <li 
              key={conversation.id}
              onClick={() => onSelectConversation && onSelectConversation(conversation.id)}
              className={`relative cursor-pointer p-3 ${
                activeConversation === conversation.id 
                  ? 'bg-[#35530A] bg-opacity-10' 
                  : conversation.unreadCount > 0 
                    ? 'bg-[#35530A] bg-opacity-5 hover:bg-[#35530A] hover:bg-opacity-10' 
                    : 'hover:bg-gray-50'
              }`}
            >
              <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-medium text-white
                  ${activeConversation === conversation.id ? 'bg-[#35530A]' : 'bg-[#5A7834]'}`}
                >
                  {conversation.userName?.charAt(0).toUpperCase() || '?'}
                </div>
                
                {/* Informacje o konwersacji */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm ${conversation.unreadCount > 0 ? 'font-bold text-[#35530A]' : 'font-normal text-gray-700'}`}>
                      {conversation.userName || 'Nieznany użytkownik'}
                    </p>
                    <span className={`text-xs ${conversation.unreadCount > 0 ? 'font-medium text-gray-700' : 'text-gray-500'}`}>
                      {formatDate(conversation.lastMessage.date)}
                    </span>
                  </div>
                  
                  {/* Wyświetlanie informacji o ogłoszeniu, jeśli istnieje */}
                  {conversation.adInfo && (
                    <p className={`text-xs mt-1 ${conversation.unreadCount > 0 ? 'font-medium text-[#35530A]' : 'text-gray-600'}`}>
                      {conversation.adInfo.headline || 
                        (conversation.adInfo.brand && conversation.adInfo.model && 
                          `${conversation.adInfo.brand} ${conversation.adInfo.model}`) || 
                        'Ogłoszenie'}
                    </p>
                  )}
                  
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} truncate mt-1 ${conversation.unreadCount > 0 ? 'text-gray-600' : 'text-gray-500'}`}>
                    {truncateText(conversation.lastMessage.content)}
                  </p>
                  
                  {/* Licznik nieprzeczytanych wiadomości */}
                  {conversation.unreadCount > 0 && (
                    <div className="bg-[#35530A] text-white text-xs font-medium rounded-full px-2 py-0.5 inline-block mt-1">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>

              {/* Akcje - gwiazdka i menu */}
              <div className={`flex items-center justify-end ${isMobile ? 'mt-1' : 'mt-2'} space-x-2`}>
                {/* Gwiazdka */}
                <button 
                  className={`p-1 rounded-full ${conversation.isStarred ? 'text-[#35530A]' : 'text-gray-400 hover:text-[#35530A]'}`}
                  onClick={(e) => handleStarClick(e, conversation.id)}
                  aria-label={conversation.isStarred ? 'Usuń z ważnych' : 'Oznacz jako ważne'}
                >
                  <Star className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                </button>
                
                {/* Menu akcji */}
                <div className="relative">
                  <button 
                    className="p-1 rounded-full text-gray-400 hover:text-[#35530A]"
                    onClick={(e) => handleActionMenuClick(e, conversation.id)}
                    aria-label="Więcej opcji"
                  >
                    <MoreVertical className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                  </button>
                  
                  {/* Menu rozwijane */}
                  {openActionMenuId === conversation.id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
                      {/* Archiwizuj */}
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={(e) => handleArchiveClick(e, conversation.id)}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archiwizuj
                      </button>
                      
                      {/* Oznacz jako ważne */}
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={(e) => handleStarClick(e, conversation.id)}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {conversation.isStarred ? 'Usuń z ważnych' : 'Oznacz jako ważne'}
                      </button>
                      
                      {/* Usuń */}
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center"
                        onClick={(e) => handleDeleteClick(e, conversation.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Usuń konwersację
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default MessageList;