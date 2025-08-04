import React, { useEffect, useRef, memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Check, CheckCheck, Clock, MoreHorizontal } from 'lucide-react';

/**
 * MessageChat - Panel konwersacji w stylu Messenger
 * Wyświetla bąbelki wiadomości z animacjami i statusami
 */
const MessageChat = memo(({ 
  messages = [], 
  currentUser, 
  loading = false,
  onDeleteMessage,
  onArchiveMessage 
}) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll do najnowszej wiadomości
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Komponent pojedynczej wiadomości
  const MessageBubble = memo(({ message, isOwn, showAvatar, showTime }) => {
    const formatTime = (timestamp) => {
      try {
        const date = new Date(timestamp);
        return formatDistanceToNow(date, { addSuffix: true, locale: pl });
      } catch {
        return 'Teraz';
      }
    };

    const getStatusIcon = () => {
      if (!isOwn) return null;
      
      switch (message.status) {
        case 'sent':
          return <Check className="w-3 h-3 text-gray-400" />;
        case 'delivered':
          return <CheckCheck className="w-3 h-3 text-gray-400" />;
        case 'read':
          return <CheckCheck className="w-3 h-3 text-blue-500" />;
        default:
          return <Clock className="w-3 h-3 text-gray-300" />;
      }
    };

    return (
      <div className={`flex items-end gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar - tylko dla wiadomości od innych */}
        {!isOwn && showAvatar && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {message.senderName?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        
        {/* Spacer gdy nie ma avatara */}
        {!isOwn && !showAvatar && <div className="w-8" />}

        {/* Bąbelek wiadomości */}
        <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
          {/* Nazwa nadawcy (tylko dla wiadomości od innych) */}
          {!isOwn && showAvatar && (
            <div className="text-xs text-gray-500 mb-1 px-3">
              {message.senderName || 'Nieznany użytkownik'}
            </div>
          )}

          {/* Treść wiadomości */}
          <div
            className={`
              relative px-4 py-3 rounded-2xl shadow-sm
              ${isOwn 
                ? 'bg-gradient-to-r from-[#35530A] to-[#5A7834] text-white rounded-br-md' 
                : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
              }
              transition-all duration-200 hover:shadow-md
            `}
          >
            {/* Treść */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </div>

            {/* Załączniki */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs opacity-75">
                    <span>📎</span>
                    <span className="truncate">{attachment.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Czas i status */}
            <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
              isOwn ? 'text-white/70' : 'text-gray-500'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {getStatusIcon()}
            </div>

            {/* Menu opcji */}
            <button
              className={`
                absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100
                transition-opacity duration-200 hover:bg-black/10
                ${isOwn ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-gray-600'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                // Tutaj można dodać menu z opcjami
              }}
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  });

  // Grupowanie wiadomości według dnia
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentGroup = null;
    let lastSender = null;
    let lastTime = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.timestamp);
      const dateKey = messageDate.toDateString();
      
      // Nowa grupa dla nowego dnia
      if (!currentGroup || currentGroup.date !== dateKey) {
        currentGroup = {
          date: dateKey,
          displayDate: formatDistanceToNow(messageDate, { locale: pl }),
          messages: []
        };
        groups.push(currentGroup);
        lastSender = null;
      }

      // Sprawdź czy pokazać avatar (nowy nadawca lub długa przerwa)
      const showAvatar = message.senderId !== lastSender || 
        (lastTime && messageDate - lastTime > 5 * 60 * 1000); // 5 minut
      
      const showTime = index === 0 || 
        (lastTime && messageDate - lastTime > 60 * 60 * 1000); // 1 godzina

      currentGroup.messages.push({
        ...message,
        showAvatar,
        showTime,
        isOwn: message.senderId === currentUser?.id
      });

      lastSender = message.senderId;
      lastTime = messageDate;
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A] mx-auto mb-4"></div>
          <p className="text-gray-500">Ładowanie wiadomości...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-lg font-medium mb-2">Brak wiadomości</p>
          <p className="text-sm">Rozpocznij konwersację wysyłając pierwszą wiadomość</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 bg-gray-50"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messageGroups.map((group, groupIndex) => (
        <div key={group.date} className="mb-6">
          {/* Separator daty */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
              <span className="text-xs text-gray-500 font-medium">
                {group.displayDate}
              </span>
            </div>
          </div>

          {/* Wiadomości w grupie */}
          <div className="space-y-1">
            {group.messages.map((message, messageIndex) => (
              <div key={message.id || messageIndex} className="group">
                <MessageBubble
                  message={message}
                  isOwn={message.isOwn}
                  showAvatar={message.showAvatar}
                  showTime={message.showTime}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Wskaźnik pisania */}
      {loading && messages.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Anchor do auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
});

MessageChat.displayName = 'MessageChat';

export default MessageChat;
