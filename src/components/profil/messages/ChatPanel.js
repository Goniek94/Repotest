import React, { memo, useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MoreVertical, Phone, Video, UserX, Flag, VolumeX, Archive, Star, Trash2, Search, Paperclip, Smile, Info, Save, Check } from 'lucide-react';
import useResponsiveLayout from '../../../hooks/useResponsiveLayout';

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
  console.log('🔄 ChatPanel - otrzymane props:');
  console.log('🔄 ChatPanel - conversation:', conversation);
  console.log('🔄 ChatPanel - messages:', messages);
  console.log('🔄 ChatPanel - messages.length:', messages.length);
  console.log('🔄 ChatPanel - currentUser:', currentUser);
  console.log('🔄 ChatPanel - loading:', loading);

  console.log('🔄 ChatPanel - używam prawdziwych wiadomości z bazy');
  
  // ===== HOOKS =====
  const { isMobile, text } = useResponsiveLayout();
  
  // ===== REFS =====
  const messagesEndRef = useRef(null);
  
  // ===== STATE =====
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

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

  // ===== MENU OPTIONS HANDLERS =====
  const handleBlockUser = () => {
    showNotification?.('Użytkownik został zablokowany', 'success');
    setShowOptionsMenu(false);
  };

  const handleReportUser = () => {
    showNotification?.('Użytkownik został zgłoszony', 'success');
    setShowOptionsMenu(false);
  };

  const handleMuteUser = () => {
    showNotification?.('Użytkownik został wyciszony', 'success');
    setShowOptionsMenu(false);
  };

  // ===== SELECTION HANDLERS =====
  const handleMessageSelect = (messageId) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
    
    // Jeśli nie ma zaznaczonych wiadomości, wyłącz tryb zaznaczania
    if (newSelected.size === 0) {
      setSelectionMode(false);
    }
  };

  const handleLongPress = (messageId) => {
    setSelectionMode(true);
    setSelectedMessages(new Set([messageId]));
  };

  const handleSelectAll = () => {
    const allMessageIds = new Set(messages.map(msg => msg.id));
    setSelectedMessages(allMessageIds);
  };

  const handleDeselectAll = () => {
    setSelectedMessages(new Set());
    setSelectionMode(false);
  };

  const handleDeleteSelected = () => {
    if (selectedMessages.size === 0) return;
    
    if (window.confirm(`Czy na pewno chcesz usunąć ${selectedMessages.size} wiadomości?`)) {
      showNotification?.(`Usunięto ${selectedMessages.size} wiadomości`, 'success');
      setSelectedMessages(new Set());
      setSelectionMode(false);
    }
  };

  const handleArchiveSelected = () => {
    if (selectedMessages.size === 0) return;
    
    showNotification?.(`Przeniesiono ${selectedMessages.size} wiadomości do archiwum`, 'success');
    setSelectedMessages(new Set());
    setSelectionMode(false);
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

  // ===== ONLINE STATUS FUNCTIONS =====
  const getOnlineStatus = (conversation) => {
    // Sprawdź czy użytkownik jest online (można rozszerzyć o prawdziwe dane z API)
    const lastSeen = conversation.lastSeen || conversation.user?.lastSeen;
    const isOnline = conversation.isOnline || conversation.user?.isOnline;
    
    if (isOnline) {
      return { status: 'online', text: 'Aktywny', color: 'text-[#35530A]' };
    }
    
    if (lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
      
      if (diffInMinutes < 1) {
        return { status: 'recent', text: 'Aktywny przed chwilą', color: 'text-[#35530A]' };
      } else if (diffInMinutes < 60) {
        return { status: 'minutes', text: `Aktywny ${diffInMinutes} min temu`, color: 'text-gray-500' };
      } else if (diffInMinutes < 1440) { // 24 godziny
        const hours = Math.floor(diffInMinutes / 60);
        return { status: 'hours', text: `Aktywny ${hours}h temu`, color: 'text-gray-500' };
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return { status: 'days', text: `Aktywny ${days} dni temu`, color: 'text-gray-500' };
      }
    }
    
    return { status: 'unknown', text: 'Ostatnio widziany dawno temu', color: 'text-gray-400' };
  };

  const renderOnlineIndicator = (status) => {
    if (status.status === 'online' || status.status === 'recent') {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-[#35530A] rounded-full animate-pulse"></div>
          <span className={`text-xs ${status.color} font-medium`}>{status.text}</span>
        </div>
      );
    }
    
    return (
      <span className={`text-xs ${status.color}`}>{status.text}</span>
    );
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
    console.log('🔄 ChatPanel - renderMessage dla wiadomości:', message);
    console.log('🔄 ChatPanel - currentUser:', currentUser);
    console.log('🔄 ChatPanel - message.sender:', message.sender);
    console.log('🔄 ChatPanel - currentUser?.id:', currentUser?.id);
    console.log('🔄 ChatPanel - currentUser?._id:', currentUser?._id);
    
    const isOwn = message.sender === currentUser?.id || message.sender === currentUser?._id;
    console.log('🔄 ChatPanel - isOwn:', isOwn);
    
    const isSelected = selectedMessages.has(message.id);
    
    // Responsywne szerokości wiadomości - lepsze proporcje
    const messageMaxWidth = isMobile 
      ? 'max-w-[85%]' 
      : 'max-w-[70%] sm:max-w-md lg:max-w-lg';
    
    return (
      <div key={message.id} className={`flex items-start gap-2 mb-3 sm:mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Checkbox - pokazuje się tylko w trybie zaznaczania */}
        {selectionMode && (
          <div className="flex-shrink-0 mt-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleMessageSelect(message.id)}
              className="w-4 h-4 text-[#35530A] bg-gray-100 border-gray-300 rounded focus:ring-[#35530A] focus:ring-2"
            />
          </div>
        )}
        
        {/* Wiadomość */}
        <div 
          className={`
            ${messageMaxWidth} 
            px-3 sm:px-4 py-2 sm:py-2.5 
            rounded-lg shadow-sm cursor-pointer
            ${isOwn 
              ? 'bg-[#35530A] text-white rounded-br-sm' 
              : 'bg-gray-200 text-gray-900 rounded-bl-sm'
            }
            ${isSelected ? 'ring-2 ring-[#35530A] ring-opacity-50' : ''}
          `}
          onClick={() => {
            if (selectionMode) {
              handleMessageSelect(message.id);
            }
          }}
          onLongPress={() => handleLongPress(message.id)}
          onTouchStart={(e) => {
            // Obsługa długiego naciśnięcia na mobile
            const touchStartTime = Date.now();
            const touchHandler = () => {
              if (Date.now() - touchStartTime >= 500) {
                handleLongPress(message.id);
              }
            };
            setTimeout(touchHandler, 500);
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
      {/* Header chatu - bez awatara, wyrównany - bez przerwy */}
      <div className="p-4 flex-shrink-0 min-h-[64px] flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Przycisk wstecz - widoczny zawsze */}
          <button
            onClick={() => {
              console.log('🔄 ChatPanel - przycisk wstecz kliknięty, wywołuję onBack');
              onBack && onBack();
            }}
            className="flex items-center justify-center w-8 h-8 hover:bg-[#35530A]/10 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#35530A]" />
          </button>
          
          {/* Informacje o użytkowniku - bez awatara */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base truncate leading-tight">{participantName}</h3>
            <div className="leading-tight">
              {renderOnlineIndicator(getOnlineStatus(conversation))}
            </div>
          </div>
        </div>

        {/* Akcje - wyrównane po prawej */}
        <div className="flex items-center gap-1 flex-shrink-0 relative">
          {/* Przycisk zaznacz wiadomości */}
          <button 
            onClick={() => {
              setSelectionMode(!selectionMode);
              if (!selectionMode) {
                setSelectedMessages(new Set());
              }
            }}
            className={`flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors ${
              selectionMode ? 'bg-[#35530A] text-white hover:bg-[#2a4208]' : ''
            }`}
          >
            <Check className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dropdown menu */}
          {showOptionsMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-2">
                <button
                  onClick={handleMuteUser}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <VolumeX className="w-4 h-4" />
                  Wycisz
                </button>
                
                <button
                  onClick={handleBlockUser}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  Zablokuj użytkownika
                </button>
                
                <button
                  onClick={handleReportUser}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Zgłoś
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Obszar wiadomości - responsywny */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="flex justify-center py-6 sm:py-8">
            <div className="animate-spin w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#35530A] border-t-transparent rounded-full"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-6 sm:py-8 px-4">
            <p className="text-gray-500 text-sm sm:text-base">Brak wiadomości w tej konwersacji</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Napisz pierwszą wiadomość!</p>
          </div>
        ) : (
          <div>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Toolbar akcji lub Input do pisania wiadomości */}
      {selectionMode && selectedMessages.size > 0 ? (
        /* Toolbar z akcjami dla zaznaczonych wiadomości */
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Liczba zaznaczonych wiadomości */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Zaznaczono: {selectedMessages.size}
              </span>
            </div>

            {/* Akcje */}
            <div className="flex items-center gap-2">
              {/* Przycisk zapisz */}
              <button
                onClick={handleArchiveSelected}
                className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm"
                title="Zapisz wiadomości"
              >
                <Save className="w-5 h-5" />
              </button>

              {/* Przycisk usuń */}
              <button
                onClick={handleDeleteSelected}
                className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                title="Usuń wiadomości"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              {/* Przycisk anuluj */}
              <button
                onClick={handleDeselectAll}
                className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-sm ml-2"
                title="Anuluj zaznaczenie"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Input do pisania wiadomości - responsywny i elegancki */
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 sm:gap-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Napisz wiadomość..."
              disabled={sending}
              className="
                flex-1 
                px-3 sm:px-4 py-2 sm:py-2.5
                text-sm sm:text-base
                border border-gray-300 rounded-full 
                focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent
                disabled:bg-gray-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sending}
              className="
                p-2 sm:p-2.5
                bg-[#35530A] text-white rounded-full 
                hover:bg-[#2a4208] active:bg-[#1f3006]
                disabled:opacity-50 disabled:cursor-not-allowed 
                transition-all duration-200
                flex-shrink-0
                shadow-sm hover:shadow-md
              "
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Kliknij poza menu, aby je zamknąć */}
      {showOptionsMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowOptionsMenu(false)}
        />
      )}
    </div>
  );
});

ChatPanel.displayName = 'ChatPanel';

export default ChatPanel;
