import React, { useState, useEffect, useCallback } from 'react';
import { Star, StarOff, Trash2, Check, Clock, MoreVertical, Archive, Folder, Paperclip } from 'lucide-react';

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

  // Skracanie tekstu
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
    onDelete && onDelete(conversationId);
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
          <p>Brak konwersacji</p>
          <p className="text-sm">Kiedy rozpoczniesz konwersację, pojawi się tutaj</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sortedConversations.map((conversation, index) => (
            <React.Fragment key={conversation.id}>
              {/* Separator daty (jeśli zmienia się data) */}
              {index > 0 && 
                new Date(conversation.lastMessage.date).toLocaleDateString() !== 
                new Date(sortedConversations[index - 1].lastMessage.date).toLocaleDateString() && (
                <li className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center font-medium">
                  {new Date(conversation.lastMessage.date).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </li>
              )}
              
              {/* Element konwersacji */}
              <li 
                onClick={() => onSelectConversation && onSelectConversation(conversation.id)}
                className={`relative cursor-pointer transition-colors p-3 border-l-4 group
                  ${activeConversation === conversation.id 
                    ? 'bg-[#35530A] bg-opacity-10 border-l-[#35530A]'
                    : conversation.unreadCount > 0 
                      ? 'bg-[#35530A] bg-opacity-5 hover:bg-[#35530A] hover:bg-opacity-10 border-l-[#35530A]' 
                      : 'hover:bg-gray-50 border-l-transparent'
                  }`}
              >
                <div className="flex items-start">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-medium text-white
                    ${activeConversation === conversation.id ? 'bg-[#35530A]' : 'bg-[#35530A] bg-opacity-85'}`}
                  >
                    {conversation.userName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  
                  {/* Informacje o konwersacji */}
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-bold text-[#35530A]' : 'font-normal text-gray-700'}`}>
                        {conversation.userName || 'Nieznany użytkownik'}
                      </p>
                      <span className={`text-xs whitespace-nowrap ml-2 ${conversation.unreadCount > 0 ? 'font-medium text-gray-700' : 'text-gray-500'}`}>
                        {formatDate(conversation.lastMessage.date)}
                      </span>
                    </div>
                    
                    <p className={`text-sm truncate mt-1 ${conversation.unreadCount > 0 ? 'text-gray-600' : 'text-gray-500'}`}>
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

                {/* Dodatkowe informacje i akcje */}
                <div className="flex items-center justify-between mt-2">
                  {/* Status konwersacji */}
                  <div className="flex items-center">
                    {conversation.unreadCount === 0 ? (
                      <span className="flex items-center text-[#35530A] text-xs">
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Przeczytane
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Nieprzeczytane
                      </span>
                    )}
                  </div>
                  
                  {/* Przyciski akcji */}
                  <div className="flex space-x-1">
                    {/* Gwiazdka */}
                    <button 
                      className={`p-1 rounded-full ${conversation.isStarred ? 'text-[#35530A]' : 'text-gray-400 hover:text-[#35530A]'}`}
                      onClick={(e) => handleStarClick(e, conversation.id)}
                      title={conversation.isStarred ? 'Usuń oznaczenie jako ważne' : 'Oznacz jako ważne'}
                    >
                      {conversation.isStarred ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    
                    {/* Menu akcji */}
                    <div className="relative">
                      <button 
                        className="p-1 rounded-full text-gray-400 hover:text-[#35530A]"
                        onClick={(e) => handleActionMenuClick(e, conversation.id)}
                        title="Więcej opcji"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Menu rozwijane */}
                      {openActionMenuId === conversation.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
                          {/* Przenieś do archiwum */}
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#35530A] hover:bg-opacity-10 hover:text-[#35530A] flex items-center"
                            onClick={(e) => handleMoveToFolder(e, conversation.id, 'archiwum')}
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            Przenieś do archiwum
                          </button>
                          
                          {/* Przenieś do ważnych */}
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#35530A] hover:bg-opacity-10 hover:text-[#35530A] flex items-center"
                            onClick={(e) => handleStarClick(e, conversation.id)}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            {conversation.isStarred ? 'Usuń z ważnych' : 'Dodaj do ważnych'}
                          </button>
                          
                          {/* Usuń konwersację */}
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
                    
                    {/* Bezpośredni przycisk usuwania (widoczny na małych ekranach) */}
                    <button 
                      className="md:hidden p-1 rounded-full text-gray-400 hover:text-red-500"
                      onClick={(e) => handleDeleteClick(e, conversation.id)}
                      title="Usuń konwersację"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Separator - linia dolna */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-100"></div>
              </li>
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;