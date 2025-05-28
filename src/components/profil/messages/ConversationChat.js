import React, { useState, useEffect, useRef } from 'react';
import { FileText, Image, CheckCircle, CheckCircle2, Clock, Paperclip, Send, X, Download } from 'lucide-react';

/**
 * Komponent wyświetlający wiadomości z konwersacji i umożliwiający odpowiadanie
 */
const ConversationChat = ({ 
  messages, 
  currentUser,
  onSendReply,
  loading 
}) => {
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Przewijanie do najnowszej wiadomości
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Grupowanie wiadomości według daty
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    
    msgs.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString('pl-PL');
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
  
  // Formatowanie czasu wiadomości
  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Formatowanie daty wiadomości
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
  
  // Czy wiadomość jest wysłana przez aktualnego użytkownika
  const isCurrentUserMessage = (message) => {
    return message.sender === currentUser.id;
  };
  
  // Obsługa dodawania załączników
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  // Obsługa wyboru plików
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // Ograniczenie liczby załączników
      if (attachments.length + files.length > 5) {
        alert('Możesz dodać maksymalnie 5 załączników');
        return;
      }
      
      // Ograniczenie rozmiaru plików (10MB)
      const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        alert('Niektóre pliki są zbyt duże (maksymalny rozmiar to 10MB)');
        return;
      }
      
      const newAttachments = files.map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type
      }));
      
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    
    // Reset input value
    e.target.value = '';
  };
  
  // Usuwanie załącznika
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Formatowanie rozmiaru pliku
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Wysyłanie odpowiedzi
  const handleSendReply = async () => {
    if (!replyText.trim() && attachments.length === 0) return;
    
    setSending(true);
    
    try {
      await onSendReply(replyText, attachments);
      
      // Czyszczenie pola odpowiedzi i załączników
      setReplyText('');
      setAttachments([]);
    } catch (error) {
      console.error('Błąd podczas wysyłania odpowiedzi:', error);
      alert('Wystąpił błąd podczas wysyłania odpowiedzi. Spróbuj ponownie.');
    } finally {
      setSending(false);
    }
  };
  
  // Obsługa klawisza Enter w polu odpowiedzi
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };
  
  // Jeśli nie ma wiadomości, wyświetl komunikat
  if (messages.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
        <p className="text-gray-500">Brak wiadomości w tej konwersacji.</p>
        <p className="text-gray-500">Rozpocznij rozmowę, wysyłając pierwszą wiadomość poniżej.</p>
      </div>
    );
  }

  // Wyświetlanie wiadomości
  return (
    <div className="flex flex-col h-full">
      {/* Obszar wiadomości */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
          </div>
        ) : (
          // Grupowanie wiadomości według daty
          groupMessagesByDate(messages).map(group => (
            <div key={group.date} className="mb-6">
              {/* Nagłówek daty */}
              <div className="flex justify-center mb-4">
                <div className="bg-[#35530A] bg-opacity-10 text-[#35530A] text-xs font-medium px-3 py-1 rounded-full">
                  {formatMessageDate(group.messages[0].timestamp)}
                </div>
              </div>
              
              {/* Wiadomości z danego dnia */}
              {group.messages.map((message, index) => {
                const isCurrentUser = isCurrentUserMessage(message);
                const showSender = index === 0 || 
                  isCurrentUserMessage(message) !== isCurrentUserMessage(group.messages[index - 1]);
                
                return (
                  <div key={message.id} className="mb-4">
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
                        className={`max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-2.5 shadow-sm ${
                          isCurrentUser 
                            ? 'bg-[#35530A] text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {/* Treść wiadomości */}
                        <div className="whitespace-pre-wrap break-words">{message.content}</div>
                        
                        {/* Załączniki */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, i) => (
                              <div 
                                key={i} 
                                className={`flex items-center p-2 rounded ${
                                  isCurrentUser ? 'bg-[#2A4208]' : 'bg-gray-100'
                                }`}
                              >
                                {attachment.type?.startsWith('image/') ? (
                                  <Image className={`w-4 h-4 mr-2 ${isCurrentUser ? 'text-white' : 'text-gray-600'}`} />
                                ) : (
                                  <FileText className={`w-4 h-4 mr-2 ${isCurrentUser ? 'text-white' : 'text-gray-600'}`} />
                                )}
                                <span className={`text-sm truncate flex-1 ${isCurrentUser ? 'text-white' : 'text-gray-700'}`}>
                                  {attachment.name}
                                </span>
                                <a
                                  href={attachment.url}
                                  download
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
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Obszar odpowiedzi */}
      <div className="border-t border-gray-200 bg-white p-3">
        {/* Wybrane załączniki */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 max-h-24 overflow-y-auto p-1">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                {attachment.type.startsWith('image/') ? (
                  <Image className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
                ) : (
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
                )}
                <span className="text-xs text-gray-700 truncate max-w-[120px]">
                  {attachment.name}
                </span>
                <span className="text-xs text-gray-500 mx-1">
                  ({formatFileSize(attachment.size)})
                </span>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Formularz odpowiedzi */}
        <div className="flex items-end space-x-2">
          {/* Przycisk załącznika */}
          <button 
            onClick={handleAttachmentClick}
            className="p-2 rounded-full text-gray-500 hover:bg-[#35530A] hover:bg-opacity-10 hover:text-[#35530A]"
            disabled={sending}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
          
          {/* Pole tekstowe */}
          <div className="flex-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#35530A] focus-within:border-[#35530A]">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Napisz wiadomość..."
              className="w-full rounded-lg border-0 focus:ring-0 px-3 py-2 text-gray-900 placeholder:text-gray-500 resize-none min-h-[80px] max-h-32"
              disabled={sending}
            />
          </div>
          
          {/* Przycisk wysyłania */}
          <button 
            onClick={handleSendReply}
            className={`p-2 rounded-full ${
              (replyText.trim() || attachments.length > 0) && !sending
                ? 'bg-[#35530A] text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={(!replyText.trim() && attachments.length === 0) || sending}
          >
            {sending ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationChat;