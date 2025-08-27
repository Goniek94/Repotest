import React, { memo, useRef, useEffect } from 'react';

/**
 * MessagesList - Lista wiadomości z grupowaniem według dat
 * Obsługuje auto-scroll i separatory dat
 */
const MessagesList = memo(({ 
  messages = [],
  loading = false,
  currentUser,
  locallyDeletedMessages = new Set(),
  onMessageRightClick,
  isMobile = false
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll do najnowszych wiadomości
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Formatowanie daty dla separatora
  const formatDateSeparator = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Sprawdź czy to dzisiaj
    if (date.toDateString() === today.toDateString()) {
      return 'Dzisiaj';
    }
    
    // Sprawdź czy to wczoraj
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Wczoraj';
    }
    
    // Sprawdź czy to w tym tygodniu
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (date > weekAgo) {
      return date.toLocaleDateString('pl-PL', { weekday: 'long' });
    }
    
    // Dla starszych dat
    return date.toLocaleDateString('pl-PL', { 
      day: 'numeric', 
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  // Grupowanie wiadomości według dat
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt || message.timestamp);
      const messageDateString = messageDate.toDateString();

      if (currentDate !== messageDateString) {
        // Zapisz poprzednią grupę jeśli istnieje
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup
          });
        }
        
        // Rozpocznij nową grupę
        currentDate = messageDateString;
        currentGroup = [message];
      } else {
        // Dodaj do bieżącej grupy
        currentGroup.push(message);
      }
    });

    // Dodaj ostatnią grupę
    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup
      });
    }

    return groups;
  };

  // Render separatora daty
  const renderDateSeparator = (dateString) => (
    <div className="flex items-center justify-center my-4 sm:my-6">
      <div className="bg-gray-100 px-3 py-1 rounded-full">
        <span className="text-xs sm:text-sm text-gray-600 font-medium">
          {formatDateSeparator(dateString)}
        </span>
      </div>
    </div>
  );

  // Formatowanie czasu wiadomości
  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Render pojedynczej wiadomości
  const renderMessage = (message) => {
    // Sprawdź czy wiadomość została lokalnie usunięta
    if (locallyDeletedMessages.has(message.id)) {
      return null;
    }
    
    // Ulepszone porównanie sender ID - obsługa różnych formatów
    const currentUserId = currentUser?.id || currentUser?._id;
    const messageSenderId = message.sender;
    
    const isOwn = messageSenderId === currentUserId || 
                  messageSenderId?.toString() === currentUserId?.toString();
    
    // Responsywne szerokości wiadomości - lepsze proporcje
    const messageMaxWidth = isMobile 
      ? 'max-w-[85%]' 
      : 'max-w-[70%] sm:max-w-md lg:max-w-lg';
    
    return (
      <div key={message.id} className={`flex items-start gap-2 mb-3 sm:mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Wiadomość */}
        <div 
          className={`
            ${messageMaxWidth} 
            px-3 sm:px-4 py-2 sm:py-2.5 
            rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow
            ${isOwn 
              ? 'bg-[#35530A] text-white rounded-br-sm' 
              : 'bg-gray-200 text-gray-900 rounded-bl-sm'
            }
          `}
          onContextMenu={(e) => onMessageRightClick(e, message)}
          onClick={(e) => {
            // Na mobile - pojedyncze kliknięcie pokazuje menu
            if (isMobile) {
              onMessageRightClick(e, message);
            }
          }}
        >
          <p className="text-sm sm:text-base leading-relaxed break-words">
            {message.content}
          </p>
          <p className={`text-xs mt-1 ${
            isOwn ? 'text-white/80' : 'text-gray-500'
          }`}>
            {formatMessageTime(message.createdAt || message.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-6 sm:py-8">
        <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#35530A] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 px-4">
        <p className="text-gray-500 text-sm sm:text-base">Brak wiadomości w tej konwersacji</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Napisz pierwszą wiadomość!</p>
      </div>
    );
  }

  // Messages list
  return (
    <div>
      {groupMessagesByDate(messages).map((group, groupIndex) => (
        <div key={`group-${groupIndex}`}>
          {/* Separator daty */}
          {renderDateSeparator(group.date)}
          
          {/* Wiadomości z tej daty */}
          {group.messages.map(renderMessage)}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
});

MessagesList.displayName = 'MessagesList';

export default MessagesList;
