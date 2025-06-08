import React, { useRef, useEffect } from 'react';
import { FileText, Image, Check, CheckCircle, Clock, Paperclip, X, Download, Trash2, Archive } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Komponent wyświetlający wiadomości w konwersacji
 * 
 * Odpowiada za prezentację wiadomości, nie zawiera logiki biznesowej,
 * która została przeniesiona do hooka useConversations.
 */
const MessageChat = ({
  messages,
  currentUser,
  loading,
  onRemoveMessage,
  onArchiveMessage
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  
  // Przewijanie do najnowszej wiadomości zostało świadomie wyłączone,
  // aby użytkownik zachował pełną kontrolę nad pozycją scrolla.
  
  // Grupowanie wiadomości według daty
  const groupMessagesByDate = (msgs) => {
    if (!Array.isArray(msgs) || msgs.length === 0) return [];
    
    const groups = {};
    
    msgs.forEach(message => {
      // Pobierz datę w formacie YYYY-MM-DD
      const date = new Date(message.timestamp).toISOString().split('T')[0];
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };
  
  // Formatowanie czasu wiadomości (godzina:minuta)
  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Formatowanie daty nagłówka grupy wiadomości
  const formatMessageDate = (dateString) => {
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
  };
  
  // Sprawdzenie czy wiadomość jest od aktualnego użytkownika
  const isCurrentUserMessage = (message) => {
    const senderId = typeof message.sender === 'string' ? message.sender : message.sender?.id || message.sender?._id;
    const currentUserId = currentUser?.id || user?._id;
    
    return senderId === currentUserId || senderId === 'currentUser';
  };
  
  // Formatowanie rozmiaru pliku
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';
    
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Jeśli ładowanie, wyświetl spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
      </div>
    );
  }

  // Jeśli brak wiadomości, wyświetl komunikat
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
        <div className="text-[#35530A] bg-[#35530A] bg-opacity-10 rounded-full p-4 mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Brak wiadomości</h3>
        <p className="text-gray-500 max-w-md">
          Ta konwersacja nie zawiera jeszcze żadnych wiadomości. Rozpocznij rozmowę, wysyłając pierwszą wiadomość.
        </p>
      </div>
    );
  }

  // Wyświetlanie wiadomości
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {/* Grupowanie wiadomości według daty */}
      {groupMessagesByDate(messages).map(group => (
        <div key={group.date} className="mb-6">
          {/* Nagłówek daty */}
          <div className="flex justify-center mb-4">
            <div className="bg-[#35530A] bg-opacity-10 text-[#35530A] text-xs font-medium px-3 py-1 rounded-full">
              {formatMessageDate(group.date)}
            </div>
          </div>
          
          {/* Wiadomości z danego dnia */}
          {group.messages.map((message, index) => {
            const isCurrentUser = isCurrentUserMessage(message);
            const showSender = index === 0 || 
              isCurrentUserMessage(message) !== isCurrentUserMessage(group.messages[index - 1]);
            
            return (
              <div key={message.id || index} className="mb-4">
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
                    {isCurrentUser && (
                      <div className="absolute -top-2 right-0 flex space-x-1 opacity-0 group-hover:opacity-100">
                        {onArchiveMessage && (
                          <button
                            onClick={() => onArchiveMessage(message.id)}
                            className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white"
                          >
                            <Archive className="w-3 h-3" />
                          </button>
                        )}
                        {onRemoveMessage && (
                          <button
                            onClick={() => onRemoveMessage(message.id)}
                            className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                    {/* Treść wiadomości */}
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    
                    {/* Załączniki */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, i) => (
                          <div 
                            key={attachment.id || i} 
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
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
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
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageChat;