import React, { memo } from 'react';
import { MessageCircle, Search, Filter, SortAsc, RefreshCw } from 'lucide-react';
import ConversationItem from './ConversationItem';

/**
 * MessageList - Lista konwersacji używająca ConversationItem
 */
const MessageList = memo(({ 
  messages, 
  activeConversation, 
  onSelectConversation, 
  onStar, 
  onDelete, 
  onMove 
}) => {
  // Sortowanie konwersacji
  const sortedConversations = [...messages].sort((a, b) => {
    // Przypięte konwersacje na górze
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    // Nieprzeczytane konwersacje na górze
    if ((a.unreadCount > 0) !== (b.unreadCount > 0)) {
      return a.unreadCount > 0 ? -1 : 1;
    }
    // Sortowanie według daty ostatniej wiadomości
    const dateA = new Date(a.lastMessageTime || a.timestamp || 0);
    const dateB = new Date(b.lastMessageTime || b.timestamp || 0);
    return dateB - dateA;
  });

  if (sortedConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center py-10">
        <div className="mb-4 p-4 rounded-full bg-gray-100">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-center font-medium text-lg">Brak wiadomości</p>
        <p className="text-sm mt-2 max-w-xs">Kiedy otrzymasz wiadomości, pojawią się tutaj</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex-1 flex flex-col">
      {/* Nagłówek z wyszukiwaniem */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#35530A]" />
            Konwersacje
            {sortedConversations.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({sortedConversations.length})
              </span>
            )}
          </h2>
          
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-lg text-gray-500 hover:text-[#35530A] hover:bg-[#35530A]/10 transition-all duration-200"
              title="Odśwież"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <button 
              className="p-2 rounded-lg text-gray-500 hover:text-[#35530A] hover:bg-[#35530A]/10 transition-all duration-200"
              title="Sortuj"
            >
              <SortAsc className="w-4 h-4" />
            </button>
            
            <button 
              className="p-2 rounded-lg text-gray-500 hover:text-[#35530A] hover:bg-[#35530A]/10 transition-all duration-200"
              title="Filtry"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Pasek wyszukiwania */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj konwersacji..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent text-sm transition-all duration-200"
          />
        </div>
        
        {/* Szybkie filtry */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <button className="flex-shrink-0 px-3 py-1 text-xs font-medium bg-[#35530A] text-white rounded-full">
            Wszystkie
          </button>
          <button className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            Nieprzeczytane
          </button>
          <button className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            Ważne
          </button>
          <button className="flex-shrink-0 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            Grupy
          </button>
        </div>
      </div>

      {/* Lista konwersacji */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={activeConversation === conversation.id}
            onClick={onSelectConversation}
            onStar={onStar}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;
