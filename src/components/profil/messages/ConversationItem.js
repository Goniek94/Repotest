import React, { memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Star, MoreHorizontal, Check, CheckCheck } from 'lucide-react';

/**
 * ConversationItem - Pojedynczy element listy konwersacji
 * Wyświetla podgląd konwersacji z avatarem, nazwą, ostatnią wiadomością
 */
const ConversationItem = memo(({ 
  conversation, 
  isActive = false, 
  onClick, 
  onStar, 
  onDelete, 
  onMove 
}) => {
  if (!conversation) return null;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(conversation);
  };

  const handleStar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onStar?.(conversation.id);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(conversation.id);
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString('pl-PL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else {
        return formatDistanceToNow(date, { addSuffix: true, locale: pl });
      }
    } catch {
      return '';
    }
  };

  const getStatusIcon = () => {
    if (!conversation.isOwn) return null;
    
    switch (conversation.status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const userName = conversation.userName || conversation.senderName || 'Nieznany użytkownik';
  const lastMessage = conversation.lastMessage?.content || conversation.content || '';
  const timestamp = conversation.lastMessage?.date || conversation.lastMessageTime || conversation.timestamp;
  const isUnread = conversation.unread || !conversation.isRead || !conversation.lastMessage?.isRead;

  return (
    <div
      className={`
        relative p-4 cursor-pointer transition-all duration-200 border-b border-gray-100
        hover:bg-gray-50 group
        ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
        ${isUnread ? 'bg-blue-25' : ''}
      `}
      onClick={handleClick}
    >
      {/* Główna zawartość */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          
          {/* Status online */}
          {conversation.userStatus === 'online' && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
          
          {/* Badge nieprzeczytanych */}
          {conversation.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[18px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </div>
          )}
        </div>

        {/* Zawartość konwersacji */}
        <div className="flex-1 min-w-0">
          {/* Nagłówek z nazwą i czasem */}
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-medium truncate ${
              isUnread ? 'text-gray-900 font-semibold' : 'text-gray-800'
            }`}>
              {userName}
            </h4>
            
            <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-2">
              {getStatusIcon()}
              <span>{formatTime(timestamp)}</span>
            </div>
          </div>

          {/* Ostatnia wiadomość */}
          <div className="flex items-center justify-between">
            <p className={`text-sm truncate ${
              isUnread ? 'text-gray-700 font-medium' : 'text-gray-600'
            }`}>
              {conversation.isOwn && <span className="text-gray-500">Ty: </span>}
              {lastMessage || 'Brak wiadomości'}
            </p>
          </div>

          {/* Dodatkowe informacje */}
          {conversation.adTitle && (
            <div className="mt-1">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                📋 {conversation.adTitle}
              </span>
            </div>
          )}

          {/* Załączniki */}
          {conversation.hasAttachments && (
            <div className="mt-1">
              <span className="text-xs text-gray-500">📎 Załącznik</span>
            </div>
          )}
        </div>
      </div>

      {/* Akcje - widoczne przy hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        {/* Gwiazdka */}
        <button
          onClick={handleStar}
          className={`p-1.5 rounded-full transition-colors ${
            conversation.isStarred 
              ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title={conversation.isStarred ? 'Usuń z ważnych' : 'Oznacz jako ważne'}
        >
          <Star className={`w-3 h-3 ${conversation.isStarred ? 'fill-current' : ''}`} />
        </button>

        {/* Menu więcej opcji */}
        <button
          className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Więcej opcji"
          onClick={(e) => {
            e.stopPropagation();
            // Tutaj można dodać dropdown menu
          }}
        >
          <MoreHorizontal className="w-3 h-3" />
        </button>
      </div>

      {/* Wskaźnik aktywnej konwersacji */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
      )}

      {/* Wskaźnik nieprzeczytanej wiadomości */}
      {isUnread && !isActive && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
});

ConversationItem.displayName = 'ConversationItem';

export default ConversationItem;
