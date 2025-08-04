import React, { memo, useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react';

/**
 * 💬 CHAT PANEL - Panel konwersacji w stylu Messenger
 * 
 * Prosty panel chatu z prawdziwymi wiadomościami
 */
const ChatPanel = memo(({ 
  isVisible,
  conversation,
  messages = [],
  currentUser,
  loading = false,
  onSendMessage,
  onBack,
  showNotification
}) => {
  // ===== REFS =====
  const messagesEndRef = useRef(null);
  
  // ===== STATE =====
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  // ===== EFFECTS =====
  // Auto-scroll do najnowszych wiadomości
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ===== HANDLERS =====
  /**
   * Obsługa wysyłania wiadomości
   */
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    if (!conversation?.id) return;

    setSending(true);
    
    try {
      // Wywołaj onSendMessage z content i attachments (zgodnie z useMessageActions)
      await onSendMessage(messageText.trim(), []);

      // Reset formularza
      setMessageText('');
      
    } catch (error) {
      showNotification?.('Błąd wysyłania wiadomości', 'error');
    } finally {
      setSending(false);
    }
  };

  // Obsługa Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ===== HELPER FUNCTIONS =====
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500',
      'bg-teal-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500'
    ];
    
    if (!name) return colors[0];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // ===== RENDER EMPTY STATE =====
  const renderEmptyState = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Wybierz konwersację
        </h3>
        <p className="text-gray-500 text-sm">
          Kliknij na konwersację z listy aby rozpocząć chat
        </p>
      </div>
    </div>
  );

  // ===== RENDER MESSAGE =====
  const renderMessage = (message) => {
    const isOwn = message.sender === currentUser?.id || message.sender === currentUser?._id;
    
    return (
      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-900'
        }`}>
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatMessageTime(message.createdAt || message.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  // ===== RENDER =====
  if (!conversation) {
    return (
      <div className="flex-1 bg-white h-full flex flex-col overflow-hidden">
        {renderEmptyState()}
      </div>
    );
  }

  const participantName = conversation.userName || 
                          conversation.name || 
                          conversation.otherParticipant?.name || 
                          conversation.participantName || 
                          conversation.user?.name ||
                          'Nieznany użytkownik';

  return (
    <div className="flex-1 bg-white h-full flex flex-col overflow-hidden">
      {/* Header chatu */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Avatar i nazwa */}
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm
          ${getAvatarColor(participantName)}
        `}>
          {getInitials(participantName)}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{participantName}</h3>
          <p className="text-xs text-gray-500">Aktywny</p>
        </div>

        {/* Akcje */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Obszar wiadomości */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Brak wiadomości w tej konwersacji</p>
            <p className="text-sm text-gray-400 mt-1">Napisz pierwszą wiadomość!</p>
          </div>
        ) : (
          <div>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input do pisania wiadomości */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Napisz wiadomość..."
            disabled={sending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sending}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

ChatPanel.displayName = 'ChatPanel';

export default ChatPanel;
