import React, { useState } from 'react';
import { Star, StarOff, Trash2, Clock, MoreVertical, Archive, Folder } from 'lucide-react';

/**
 * Komponent listy konwersacji
 * Wyświetla listę konwersacji z użytkownikami
 */
const ConversationList = ({ 
  conversations = [], 
  activeConversation, 
  onSelectConversation, 
  onStar, 
  onDelete, 
  onMove 
}) => {
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  
  // Bezpieczne sortowanie konwersacji
  const sortedConversations = React.useMemo(() => {
    if (!Array.isArray(conversations)) {
      console.warn('ConversationList: conversations nie jest tablicą:', conversations);
      return [];
    }
    
    return [...conversations].sort((a, b) => {
      try {
        // Nieprzeczytane konwersacje na górze
        const aUnread = (a.unreadCount || 0) > 0;
        const bUnread = (b.unreadCount || 0) > 0;
        
        if (aUnread !== bUnread) {
          return aUnread ? -1 : 1;
        }
        
        // Sortowanie według daty ostatniej wiadomości
        const aDate = a.lastMessage?.date || new Date(0);
        const bDate = b.lastMessage?.date || new Date(0);
        
        return new Date(bDate) - new Date(aDate);
      } catch (error) {
        console.error('Błąd podczas sortowania konwersacji:', error);
        return 0;
      }
    });
  }, [conversations]);

  // Formatowanie daty
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Wczoraj';
      } else if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
      } else {
        return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch (error) {
      console.error('Błąd podczas formatowania daty:', error);
      return '';
    }
  };

  // Skracanie tekstu
  const truncateText = (text, maxLength = 50) => {
    if (!text || typeof text !== 'string') return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Bezpieczne pobieranie pierwszej litery
  const getInitial = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleActionClick = (e, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === conversationId ? null : conversationId);
  };

  const handleAction = (e, action, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    
    switch (action) {
      case 'star':
        onStar?.(conversationId);
        break;
      case 'delete':
        onDelete?.(conversationId);
        break;
      case 'archive':
        onMove?.(conversationId, 'archiwum');
        break;
      default:
        break;
    }
  };

  if (sortedConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Folder className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-center">Brak konwersacji</p>
        <p className="text-sm text-center mt-1">Rozpocznij nową konwersację, aby zobaczyć ją tutaj</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {sortedConversations.map((conversation) => {
          const isActive = activeConversation === conversation.id;
          const hasUnread = (conversation.unreadCount || 0) > 0;
          
          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation?.(conversation)}
              className={`relative p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                isActive ? 'bg-blue-50 border-r-4 border-blue-500' : ''
              } ${hasUnread ? 'bg-green-50' : ''}`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[#35530A] text-white flex items-center justify-center font-medium">
                    {getInitial(conversation.userName)}
                  </div>
                </div>

                {/* Zawartość konwersacji */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium text-gray-900 truncate ${
                      hasUnread ? 'font-bold' : ''
                    }`}>
                      {conversation.userName || 'Nieznany użytkownik'}
                    </h3>
                    
                    <div className="flex items-center space-x-2">
                      {/* Data */}
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(conversation.lastMessage?.date)}
                      </span>
                      
                      {/* Menu akcji */}
                      <div className="relative">
                        <button
                          onClick={(e) => handleActionClick(e, conversation.id)}
                          className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        
                        {openActionMenuId === conversation.id && (
                          <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={(e) => handleAction(e, 'star', conversation.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {conversation.isStarred ? (
                                <>
                                  <StarOff className="w-4 h-4 mr-3" />
                                  Usuń z ważnych
                                </>
                              ) : (
                                <>
                                  <Star className="w-4 h-4 mr-3" />
                                  Dodaj do ważnych
                                </>
                              )}
                            </button>
                            <button
                              onClick={(e) => handleAction(e, 'archive', conversation.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Archive className="w-4 h-4 mr-3" />
                              Archiwizuj
                            </button>
                            <button
                              onClick={(e) => handleAction(e, 'delete', conversation.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Usuń
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ostatnia wiadomość */}
                  <div className="mt-1">
                    <p className={`text-sm text-gray-600 truncate ${
                      hasUnread ? 'font-semibold text-gray-900' : ''
                    }`}>
                      {truncateText(conversation.lastMessage?.content)}
                    </p>
                  </div>

                  {/* Wskaźniki */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      {/* Gwiazdka */}
                      {conversation.isStarred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      
                      {/* Status przeczytania */}
                      {!conversation.lastMessage?.isRead && (
                        <Clock className="w-4 h-4 text-blue-500" />
                      )}
                    </div>

                    {/* Liczba nieprzeczytanych */}
                    {hasUnread && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
