import React, { useState, useEffect, useCallback } from 'react';
import { Star, StarOff, Trash2, Check, Clock, MoreVertical, Archive, Folder, Paperclip, ChevronRight } from 'lucide-react';

/**
 * Komponent wyświetlający listę konwersacji
 * Grupuje wiadomości według użytkownika
 */
const ConversationList = ({ 
  conversations, 
  activeConversation, 
  onSelectConversation, 
  onStar, 
  onDelete, 
  onMove 
}) => {
  // Stan dla menu akcji (dla każdej konwersacji)
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  
  // Sortowanie konwersacji - nieprzeczytane na górze, następnie według daty
  const sortedConversations = [...conversations].sort((a, b) => {
    // Nieprzeczytane konwersacje na górze
    if ((a.unreadCount > 0) !== (b.unreadCount > 0)) {
      return a.unreadCount > 0 ? -1 : 1;
    }
    // Dalej sortowanie według daty ostatniej wiadomości (od najnowszych)
    return new Date(b.lastMessage.date) - new Date(a.lastMessage.date);
  });

  // Formatowanie daty
  const formatDate = (dateString) => {
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
  };

  // Skracanie tekstu - adaptacyjne dla różnych rozmiarów ekranu
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    // Na małych ekranach krótszy tekst
    const isMobile = window.innerWidth < 640;
    const length = isMobile ? Math.min(maxLength, 50) : maxLength;
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  // Obsługa kliknięcia gwiazdki
  const handleStarClick = (e, conversationId) => {
    e.stopPropagation();
    onStar && onStar(conversationId);
  };

  // Obsługa kliknięcia usunięcia
  const handleDeleteClick = (e, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    if (window.confirm('Czy na pewno chcesz usunąć tę konwersację?')) {
      onDelete && onDelete(conversationId);
    }
  };
  
  // Obsługa przenoszenia konwersacji
  const handleMoveToFolder = (e, conversationId, folder) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    onMove && onMove(conversationId, folder);
  };
  
  // Obsługa kliknięcia menu akcji
  const handleActionMenuClick = (e, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === conversationId ? null : conversationId);
  };
  
  // Zamykanie menu akcji przy kliknięciu poza nim
  const handleOutsideClick = useCallback(() => {
    setOpenActionMenuId(null);
  }, []);
  
  // Dodanie nasłuchiwania kliknięć poza menu
  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div className="overflow-y-auto h-full border-r border-gray-200 bg-white">
      {sortedConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center py-10">
          <div className="text-[#35530A] bg-[#35530A] bg-opacity-10 rounded-full p-3 mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-base sm:text-lg">Brak konwersacji</p>
          <p className="text-sm text-gray-400 mt-1">Kiedy rozpoczniesz konwersację, pojawi się tutaj</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sortedConversations.map((conversation, index) => (
            <React.Fragment key={conversation.id}>
              {/* Separator daty (tylko na większych ekranach) */}
              {index > 0 && window.innerWidth >= 640 && 
                new Date(conversation.lastMessage.date).toLocaleDateString() !== 
                new Date(sortedConversations[index - 1].lastMessage.date).toLocaleDateString() && (
                <li className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center font-medium">
                  {new Date(conversation.lastMessage.date).toLocaleDateString('pl-PL', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </li>
              )}
              
              <li 
                className={`relative ${
                  activeConversation === conversation.id 
                    ? 'bg-[#35530A] bg-opacity-10' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="px-4 py-3 sm:px-6 flex items-start">
                  {/* Avatar */}
                  <div className="flex-shrink-0 mr-3">
                    {conversation.avatar ? (
                      <img 
                        src={conversation.avatar} 
                        alt={conversation.name} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#35530A] text-white flex items-center justify-center font-medium">
                        {conversation.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* Treść */}
                  <div className="flex-1 min-w-0 pr-10">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-semibold ${
                        conversation.unreadCount > 0 ? 'text-[#35530A]' : 'text-gray-900'
                      } truncate`}>
                        {conversation.name}
                        {conversation.isStarred && (
                          <span className="ml-1 text-yellow-500">
                            <Star className="inline-block w-3.5 h-3.5" />
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDate(conversation.lastMessage.date)}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                    } line-clamp-2`}>
                      {conversation.lastMessage.hasAttachments && (
                        <Paperclip className="inline-block w-3.5 h-3.5 mr-1 text-gray-400" />
                      )}
                      {truncateText(conversation.lastMessage.content)}
                    </p>
                  </div>
                  
                  {/* Znacznik nieprzeczytanych i menu akcji */}
                  <div className="absolute right-4 top-4 flex items-center">
                    {conversation.unreadCount > 0 && (
                      <span className="bg-[#35530A] text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center mr-2 px-1">
                        {conversation.unreadCount}
                      </span>
                    )}
                    
                    {/* Przyciski akcji - zawsze widoczne dla lepszej dostępności */}
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => handleStarClick(e, conversation.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          conversation.isStarred 
                            ? 'text-yellow-500 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={conversation.isStarred ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                      >
                        {conversation.isStarred ? (
                          <Star className="w-4 h-4" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => handleActionMenuClick(e, conversation.id)}
                        className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                        title="Więcej opcji"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Menu rozwijane z opcjami */}
                    {openActionMenuId === conversation.id && (
                      <div className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={(e) => handleMoveToFolder(e, conversation.id, 'archive')}
                        >
                          <Archive className="w-4 h-4 mr-2 text-gray-500" />
                          Archiwizuj
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={(e) => handleMoveToFolder(e, conversation.id, 'folder')}
                        >
                          <Folder className="w-4 h-4 mr-2 text-gray-500" />
                          Przenieś do folderu
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                          onClick={(e) => handleDeleteClick(e, conversation.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Usuń
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Wskaźnik aktywnej konwersacji */}
                  {activeConversation === conversation.id && (
                    <div className="absolute right-0 inset-y-0 w-1 bg-[#35530A]"></div>
                  )}
                </div>
              </li>
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;