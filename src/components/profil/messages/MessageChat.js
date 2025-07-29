import React, { useRef, useEffect, useMemo, useCallback, memo, useState } from 'react';
import { FileText, Image, Check, CheckCircle, Clock, Paperclip, X, Download, Trash2, Archive, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Komponent wyświetlający wiadomości w konwersacji
 * 
 * Odpowiada za prezentację wiadomości, nie zawiera logiki biznesowej,
 * która została przeniesiona do hooka useConversations.
 * 
 * Zoptymalizowany pod kątem wydajności z użyciem React.memo i memoizacji.
 */
const MessageChat = memo(({
  messages,
  currentUser,
  loading,
  onDeleteMessage,
  onArchiveMessage,
  onReplyToMessage
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Stan dla funkcjonalności mobilnych
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Automatyczne przewijanie do najnowszej wiadomości
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Obsługa scroll tracking dla przycisku "scroll to bottom"
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollToBottom(!isNearBottom);
  }, []);

  // Dodanie event listenera dla scroll
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Pull-to-refresh funkcjonalność
  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;
    
    // Pull-to-refresh gdy użytkownik przesuwa w dół na górze listy
    if (isDownSwipe && chatContainerRef.current?.scrollTop === 0) {
      setIsRefreshing(true);
      // Symulacja odświeżania - w prawdziwej aplikacji tutaj byłoby wywołanie API
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  }, [touchStart, touchEnd]);

  // Funkcja scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  // Memoizacja funkcji formatowania czasu - zapobiega niepotrzebnym re-renderom
  const formatMessageTime = useCallback((dateString) => {
    return new Date(dateString).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);
  
  // Memoizacja funkcji formatowania daty nagłówka grupy wiadomości
  const formatMessageDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Dzisiaj';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Wczoraj';
    } else {
      return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }, []);

  // Memoizacja aktualnego ID użytkownika
  const currentUserId = useMemo(() => {
    return currentUser?.id || user?._id;
  }, [currentUser?.id, user?._id]);

  // Memoizacja funkcji sprawdzenia czy wiadomość jest od aktualnego użytkownika
  const isCurrentUserMessage = useCallback((message) => {
    const senderId = typeof message.sender === 'string' ? message.sender : message.sender?.id || message.sender?._id;
    return senderId === currentUserId || senderId === 'currentUser';
  }, [currentUserId]);
  
  // Memoizacja grupowania wiadomości według daty - zapobiega niepotrzebnym obliczeniom
  const groupedMessages = useMemo(() => {
    if (!Array.isArray(messages) || messages.length === 0) return [];
    
    const groups = {};
    
    messages.forEach(message => {
      // Pobierz datę w formacie YYYY-MM-DD - bezpieczne tworzenie daty
      const messageDate = message.timestamp ? new Date(message.timestamp) : new Date();
      const date = messageDate.toISOString().split('T')[0];
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  }, [messages]);
  
  // Memoizacja funkcji formatowania rozmiaru pliku
  const formatFileSize = useCallback((bytes) => {
    if (!bytes || isNaN(bytes)) return '';
    
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }, []);

  // Memoizowane handlery dla akcji - zapobiega tworzeniu nowych funkcji przy każdym renderze
  const handleDeleteMessage = useCallback((messageId) => {
    if (onDeleteMessage) {
      onDeleteMessage(messageId);
    }
  }, [onDeleteMessage]);

  const handleArchiveMessage = useCallback((messageId) => {
    if (onArchiveMessage) {
      onArchiveMessage(messageId);
    }
  }, [onArchiveMessage]);
  
  const handleReplyToMessage = useCallback((message) => {
    if (onReplyToMessage) {
      onReplyToMessage(message);
    }
  }, [onReplyToMessage]);

  // Komponent LoadingSpinner - wyodrębniony dla lepszej czytelności
  const LoadingSpinner = useCallback(() => (
    <div className="flex justify-center items-center h-full bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
    </div>
  ), []);

  // Komponent EmptyState - wyodrębniony dla lepszej czytelności
  const EmptyState = useCallback(() => (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
      <div className="text-[#35530A] bg-[#35530A] bg-opacity-10 rounded-full p-4 mb-4">
        <CheckCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Brak wiadomości</h3>
      <p className="text-gray-500 max-w-md">
        Ta konwersacja nie zawiera jeszcze żadnych wiadomości. Rozpocznij rozmowę, wysyłając pierwszą wiadomość.
      </p>
    </div>
  ), []);

  // Komponent AttachmentItem - wyodrębniony dla lepszej czytelności i wydajności
  const AttachmentItem = memo(({ attachment, messageId, index, isCurrentUser }) => (
    <div 
      className={`flex items-center p-2 rounded ${
        isCurrentUser ? 'bg-[#2A4208]' : 'bg-gray-100'
      }`}
    >
      {(attachment.type?.startsWith('image/') || attachment.mimetype?.startsWith('image/')) ? (
        <Image className={`w-4 h-4 mr-2 ${isCurrentUser ? 'text-white' : 'text-gray-600'}`} />
      ) : (
        <FileText className={`w-4 h-4 mr-2 ${isCurrentUser ? 'text-white' : 'text-gray-600'}`} />
      )}
      <span className={`text-sm truncate flex-1 ${isCurrentUser ? 'text-white' : 'text-gray-700'}`}>
        {attachment.name || 'Załącznik'}
      </span>
      <a
        href={attachment.url || attachment.path}
        download
        target="_blank"
        rel="noopener noreferrer"
        className={`p-1 rounded-full ${
          isCurrentUser ? 'text-white hover:bg-[#35530A]' : 'text-gray-600 hover:bg-gray-200'
        }`}
        aria-label="Pobierz załącznik"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  ));

  // Komponent MessageBubble - wyodrębniony dla lepszej wydajności
  const MessageBubble = memo(({ message, index, groupMessages, groupDate }) => {
    const isCurrentUser = isCurrentUserMessage(message);
    const showSender = index === 0 || 
      isCurrentUserMessage(message) !== isCurrentUserMessage(groupMessages[index - 1]);
    
    return (
      <div className="mb-4">
        {/* Nazwa nadawcy (pokazywana tylko przy zmianie nadawcy) */}
        {showSender && (
          <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-1`}>
            <span className="text-xs text-gray-500">
              {isCurrentUser ? 'Ty' : message.senderName || 'Nieznany użytkownik'}
            </span>
          </div>
        )}
        
        {/* Wiadomość */}
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`relative group max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-2.5 shadow-sm ${
              isCurrentUser
                ? 'bg-[#35530A] text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none'
            }`}
          >
            {/* Przyciski akcji dla wiadomości */}
            <div className={`absolute -top-2 ${isCurrentUser ? 'right-0' : 'left-0'} flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
              {/* Przycisk odpowiedzi - dla wszystkich wiadomości */}
              {onReplyToMessage && (
                <button
                  onClick={() => handleReplyToMessage(message)}
                  className={`p-1 rounded-full ${
                    isCurrentUser 
                      ? 'bg-white bg-opacity-20 hover:bg-opacity-40 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  } transition-all`}
                  aria-label="Odpowiedz na wiadomość"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 17 4 12 9 7"></polyline>
                    <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                  </svg>
                </button>
              )}
              
              {/* Przyciski tylko dla wiadomości użytkownika */}
              {isCurrentUser && (
                <>
                  {onArchiveMessage && (
                    <button
                      onClick={() => handleArchiveMessage(message.id)}
                      className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white transition-all"
                      aria-label="Archiwizuj wiadomość"
                    >
                      <Archive className="w-3 h-3" />
                    </button>
                  )}
                  {onDeleteMessage && (
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white transition-all"
                      aria-label="Usuń wiadomość"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </>
              )}
            </div>
            
            {/* Treść wiadomości */}
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
            
            {/* Załączniki */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, i) => (
                  <AttachmentItem
                    key={attachment.id || `${message.id}-attachment-${i}`}
                    attachment={attachment}
                    messageId={message.id}
                    index={i}
                    isCurrentUser={isCurrentUser}
                  />
                ))}
              </div>
            )}
            
            {/* Czas i status */}
            <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
              isCurrentUser ? 'text-[#D9E8C4]' : 'text-gray-500'
            }`}>
              <span>{formatMessageTime(message.timestamp)}</span>
              {isCurrentUser && (
                <span>
                  {message.isRead ? (
                    <Check className="w-3 h-3 ml-1" />
                  ) : (
                    <Clock className="w-3 h-3 ml-1" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Jeśli ładowanie, wyświetl spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // Jeśli brak wiadomości, wyświetl komunikat
  if (!messages || messages.length === 0) {
    return <EmptyState />;
  }

  // Wyświetlanie wiadomości
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Pull-to-refresh indicator */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-[#35530A] text-white text-center py-2 text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Odświeżanie...
          </div>
        </div>
      )}

      {/* Główny kontener wiadomości - messenger style scrolling */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 scroll-smooth"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          paddingTop: isRefreshing ? '50px' : '16px',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch' // Smooth scrolling na iOS
        }}
      >
        {/* Grupowanie wiadomości według daty */}
        {groupedMessages.map(group => (
          <div key={group.date} className="mb-6">
            {/* Nagłówek daty */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#35530A] bg-opacity-10 text-[#35530A] text-xs font-medium px-3 py-1 rounded-full">
                {formatMessageDate(group.date)}
              </div>
            </div>
            
            {/* Wiadomości z danego dnia */}
            {group.messages.map((message, index) => (
              <MessageBubble
                key={message.id || `${group.date}-${index}`}
                message={message}
                index={index}
                groupMessages={group.messages}
                groupDate={group.date}
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button - tylko na mobile */}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="md:hidden fixed bottom-20 right-4 z-20 bg-[#35530A] text-white p-3 rounded-full shadow-lg hover:bg-[#2A4208] transition-all duration-200 animate-bounce"
          aria-label="Przewiń do najnowszych wiadomości"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

// Dodanie displayName dla lepszego debugowania
MessageChat.displayName = 'MessageChat';

export default MessageChat;
