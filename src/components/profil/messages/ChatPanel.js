import React, { memo, useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MoreVertical, Phone, Video, UserX, Flag, VolumeX, Archive, Star, Trash2, Search, Paperclip, Smile, Info, Save, Check, Edit3, Copy, RotateCcw, X, Image, FileText, Link, Plus, Reply } from 'lucide-react';
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
  onRefreshConversation,
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
  const fileInputRef = useRef(null);
  
  // ===== STATE =====
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState({ show: false, messageId: null, x: 0, y: 0, message: null });
  const [editingMessage, setEditingMessage] = useState({ id: null, content: '', originalContent: '' });
  const [locallyDeletedMessages, setLocallyDeletedMessages] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null); // { id, content, senderName }
  
  // ===== ATTACHMENTS STATE =====
  const [attachments, setAttachments] = useState([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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
    if (!messageText.trim() && attachments.length === 0) return;
    if (!conversation?.id) return;

    setSending(true);
    
    try {
      // Przygotuj dane wiadomości
      let messageData = {
        content: messageText.trim(),
        attachments: attachments
      };

      // Jeśli odpowiadamy na wiadomość, dodaj informację o reply
      if (replyingTo) {
        messageData.replyTo = {
          messageId: replyingTo.id,
          content: replyingTo.content,
          senderName: replyingTo.senderName
        };
      }

      // Wywołaj onSendMessage z rozszerzonymi danymi
      await onSendMessage(messageData.content, messageData.attachments, messageData.replyTo);

      // Reset formularza
      setMessageText('');
      setReplyingTo(null); // Wyczyść reply
      
      // Wyczyść załączniki i zwolnij URL-e
      attachments.forEach(att => {
        if (att.preview) {
          URL.revokeObjectURL(att.preview);
        }
      });
      setAttachments([]);
      
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

  // ===== MESSAGE CONTEXT MENU HANDLERS =====
  const handleMessageRightClick = (e, message) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔄 ChatPanel - handleMessageRightClick wywołane dla wiadomości:', message);
    console.log('🔄 ChatPanel - pozycja kliknięcia:', { x: e.clientX, y: e.clientY });
    console.log('🔄 ChatPanel - event type:', e.type);
    
    // Zamknij istniejące menu jeśli jest otwarte
    if (contextMenu.show) {
      setContextMenu({ show: false, messageId: null, x: 0, y: 0, message: null });
      return;
    }
    
    setContextMenu({
      show: true,
      messageId: message.id,
      message: message,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handler dla zwykłego kliknięcia - mobile i desktop fallback
  const handleMessageClick = (e, message) => {
    e.stopPropagation();
    
    console.log('🔄 ChatPanel - handleMessageClick wywołane dla wiadomości:', message);
    console.log('🔄 ChatPanel - isMobile:', isMobile);
    console.log('🔄 ChatPanel - event type:', e.type);
    console.log('🔄 ChatPanel - ctrlKey:', e.ctrlKey);
    console.log('🔄 ChatPanel - metaKey:', e.metaKey);
    
    // Na mobile lub Ctrl+Click na desktop pokazuj menu
    if (isMobile || e.ctrlKey || e.metaKey) {
      // Zamknij istniejące menu jeśli jest otwarte
      if (contextMenu.show) {
        setContextMenu({ show: false, messageId: null, x: 0, y: 0, message: null });
        return;
      }
      
      setContextMenu({
        show: true,
        messageId: message.id,
        message: message,
        x: e.clientX || window.innerWidth / 2,
        y: e.clientY || window.innerHeight / 2
      });
    }
  };

  // Handler dla długiego przytrzymania (touch events)
  const [longPressTimer, setLongPressTimer] = useState(null);
  
  const handleTouchStart = (e, message) => {
    const timer = setTimeout(() => {
      console.log('🔄 ChatPanel - długie przytrzymanie wykryte dla wiadomości:', message);
      
      // Wibracja jeśli dostępna
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      const touch = e.touches[0];
      setContextMenu({
        show: true,
        messageId: message.id,
        message: message,
        x: touch.clientX,
        y: touch.clientY
      });
    }, 500); // 500ms długie przytrzymanie
    
    setLongPressTimer(timer);
  };
  
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ show: false, messageId: null, x: 0, y: 0, message: null });
  };

  // Edycja wiadomości
  const handleEditMessage = (message) => {
    setEditingMessage({
      id: message.id,
      content: message.content,
      originalContent: message.content
    });
    handleCloseContextMenu();
  };

  const handleSaveEdit = async () => {
    if (!editingMessage.content.trim()) return;
    
    try {
      // Import messagesApi dynamically to avoid circular imports
      const { default: messagesApi } = await import('../../../services/api/messagesApi.js');
      
      await messagesApi.editMessage(editingMessage.id, editingMessage.content.trim());
      
      showNotification?.('Wiadomość została zaktualizowana', 'success');
      
      // Odśwież konwersację po edycji
      if (onRefreshConversation) {
        onRefreshConversation();
      }
      
      setEditingMessage({ id: null, content: '', originalContent: '' });
    } catch (error) {
      console.error('Błąd podczas edycji wiadomości:', error);
      showNotification?.('Błąd podczas edycji wiadomości', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage({ id: null, content: '', originalContent: '' });
  };

  // Usunięcie wiadomości (własnej - z API, cudzej - lokalnie)
  const handleDeleteMessage = async (message) => {
    const currentUserId = currentUser?.id || currentUser?._id;
    const messageSenderId = message.sender;
    const isOwn = messageSenderId === currentUserId || 
                  messageSenderId?.toString() === currentUserId?.toString();

    if (isOwn) {
      // Własna wiadomość - usuń z API
      if (window.confirm('Czy na pewno chcesz usunąć tę wiadomość?')) {
        try {
          const { default: messagesApi } = await import('../../../services/api/messagesApi.js');
          await messagesApi.deleteMessages([message.id]);
          
          showNotification?.('Wiadomość została usunięta', 'success');
          
          if (onRefreshConversation) {
            onRefreshConversation();
          }
        } catch (error) {
          console.error('Błąd podczas usuwania wiadomości:', error);
          showNotification?.('Błąd podczas usuwania wiadomości', 'error');
        }
      }
    } else {
      // Cudza wiadomość - usuń lokalnie
      if (window.confirm('Czy chcesz usunąć tę wiadomość tylko u siebie?')) {
        setLocallyDeletedMessages(prev => new Set([...prev, message.id]));
        showNotification?.('Wiadomość została usunięta lokalnie', 'success');
      }
    }
    
    handleCloseContextMenu();
  };

  // Cofnij wiadomość (tylko własne)
  const handleUnsendMessage = async (message) => {
    if (window.confirm('Czy na pewno chcesz cofnąć tę wiadomość? Zostanie usunięta dla wszystkich.')) {
      try {
        const { default: messagesApi } = await import('../../../services/api/messagesApi.js');
        await messagesApi.unsendMessage(message.id);
        
        showNotification?.('Wiadomość została cofnięta', 'success');
        
        if (onRefreshConversation) {
          onRefreshConversation();
        }
      } catch (error) {
        console.error('Błąd podczas cofania wiadomości:', error);
        showNotification?.('Błąd podczas cofania wiadomości', 'error');
      }
    }
    
    handleCloseContextMenu();
  };

  // Kopiuj wiadomość
  const handleCopyMessage = (message) => {
    navigator.clipboard.writeText(message.content).then(() => {
      showNotification?.('Wiadomość została skopiowana', 'success');
    }).catch(() => {
      showNotification?.('Błąd podczas kopiowania', 'error');
    });
    
    handleCloseContextMenu();
  };

  // Odpowiedz na wiadomość
  const handleReplyToMessage = (message) => {
    const currentUserId = currentUser?.id || currentUser?._id;
    const messageSenderId = message.sender;
    const isOwn = messageSenderId === currentUserId || 
                  messageSenderId?.toString() === currentUserId?.toString();
    
    // Pobierz nazwę nadawcy
    const senderName = isOwn ? 'Ty' : (conversation.userName || conversation.name || 'Nieznany użytkownik');
    
    // Ustaw wiadomość do odpowiedzi
    setReplyingTo({
      id: message.id,
      content: message.content,
      senderName: senderName
    });
    
    handleCloseContextMenu();
    showNotification?.(`Odpowiadasz na wiadomość od: ${senderName}`, 'info');
  };

  // Anuluj odpowiedź
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // ===== ATTACHMENT HANDLERS =====
  
  /**
   * Obsługa wyboru plików
   */
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newAttachments = files.map(file => {
      // Sprawdź rozmiar pliku (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showNotification?.(`Plik ${file.name} jest za duży (max 10MB)`, 'error');
        return null;
      }

      // Sprawdź typ pliku
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        showNotification?.(`Nieobsługiwany typ pliku: ${file.name}`, 'error');
        return null;
      }

      return {
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      };
    }).filter(Boolean);

    setAttachments(prev => [...prev, ...newAttachments]);
    setShowAttachmentMenu(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Usunięcie załącznika
   */
  const removeAttachment = (attachmentId) => {
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== attachmentId);
      // Zwolnij URL dla podglądu obrazów
      const removed = prev.find(att => att.id === attachmentId);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  /**
   * Obsługa drag & drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Symuluj wybór plików
      const fakeEvent = { target: { files } };
      handleFileSelect(fakeEvent);
    }
  };

  /**
   * Obsługa wklejania z schowka
   */
  const handlePaste = async (e) => {
    const items = Array.from(e.clipboardData.items);
    const files = [];
    
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    
    if (files.length > 0) {
      const fakeEvent = { target: { files } };
      handleFileSelect(fakeEvent);
    }
  };

  /**
   * Formatowanie rozmiaru pliku
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Pobieranie ikony dla typu pliku
   */
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type === 'application/pdf') return <FileText className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
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
    
    // Sprawdź czy wiadomość została lokalnie usunięta
    if (locallyDeletedMessages.has(message.id)) {
      return null;
    }
    
    // Ulepszone porównanie sender ID - obsługa różnych formatów
    const currentUserId = currentUser?.id || currentUser?._id;
    const messageSenderId = message.sender;
    
    const isOwn = messageSenderId === currentUserId || 
                  messageSenderId?.toString() === currentUserId?.toString();
    
    console.log('🔄 ChatPanel - currentUserId:', currentUserId);
    console.log('🔄 ChatPanel - messageSenderId:', messageSenderId);
    console.log('🔄 ChatPanel - isOwn:', isOwn);
    
    // Sprawdź czy wiadomość jest edytowana
    const isEditing = editingMessage.id === message.id;
    
    // Responsywne szerokości wiadomości - lepsze proporcje i lepsze dopasowanie
    const messageMaxWidth = isMobile 
      ? 'max-w-[80%]' 
      : 'max-w-[75%] sm:max-w-md lg:max-w-lg xl:max-w-xl';
    
    return (
      <div key={message.id} className={`flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Wiadomość */}
        <div 
          className={`
            ${messageMaxWidth} 
            px-3 sm:px-4 py-2.5 sm:py-3
            rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-200
            ${isOwn 
              ? 'bg-[#35530A] text-white rounded-br-md' 
              : 'bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200'
            }
            ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
            ${isMobile ? 'active:scale-[0.98]' : 'hover:scale-[1.02]'}
          `}
          onContextMenu={(e) => handleMessageRightClick(e, message)}
          onClick={(e) => handleMessageClick(e, message)}
          onTouchStart={(e) => handleTouchStart(e, message)}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          {isEditing ? (
            // Tryb edycji - lepszy design
            <div className="space-y-3">
              <textarea
                value={editingMessage.content}
                onChange={(e) => setEditingMessage(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-3 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                autoFocus
                placeholder="Edytuj wiadomość..."
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Zapisz
                </button>
              </div>
            </div>
          ) : (
            // Normalna wiadomość - lepszy spacing
            <>
              <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  isOwn ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {formatMessageTime(message.createdAt || message.timestamp)}
                </p>
                
                {/* Status indicators dla własnych wiadomości */}
                {isOwn && (
                  <div className="flex items-center gap-1">
                    {message.isEdited && (
                      <span className="text-xs text-white/60 italic">edytowane</span>
                    )}
                    {/* Można dodać status dostarczenia/przeczytania */}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ===== RENDER CONTEXT MENU =====
  const renderContextMenu = () => {
    if (!contextMenu.show || !contextMenu.message) return null;

    const message = contextMenu.message;
    const currentUserId = currentUser?.id || currentUser?._id;
    const messageSenderId = message.sender;
    const isOwn = messageSenderId === currentUserId || 
                  messageSenderId?.toString() === currentUserId?.toString();

    return (
      <>
        {/* Overlay do zamykania menu */}
        <div
          className="fixed inset-0 z-40"
          onClick={handleCloseContextMenu}
        />
        
        {/* Menu kontekstowe - responsywne i ładne */}
        <div
          className={`
            fixed z-50 bg-white border border-gray-200 rounded-xl shadow-xl py-2 min-w-[180px]
            ${isMobile ? 'min-w-[200px]' : 'min-w-[180px]'}
          `}
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - (isMobile ? 220 : 200)),
            top: Math.min(contextMenu.y, window.innerHeight - 250)
          }}
        >
          {/* Nagłówek menu */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 font-medium">
              {isOwn ? 'Twoja wiadomość' : 'Wiadomość użytkownika'}
            </p>
          </div>

          {/* Odpowiedz - zawsze dostępne */}
          <button
            onClick={() => handleReplyToMessage(message)}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
          >
            <Reply className="w-4 h-4 text-blue-600" />
            <span>Odpowiedz</span>
          </button>

          {/* Kopiuj - zawsze dostępne */}
          <button
            onClick={() => handleCopyMessage(message)}
            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-600" />
            <span>Kopiuj tekst</span>
          </button>

          {/* Separator */}
          <div className="border-t border-gray-100 my-1"></div>

          {isOwn ? (
            // Opcje dla własnych wiadomości
            <>
              {/* Edytuj - tylko własne wiadomości */}
              <button
                onClick={() => handleEditMessage(message)}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-yellow-50 flex items-center gap-3 transition-colors"
              >
                <Edit3 className="w-4 h-4 text-yellow-600" />
                <span>Edytuj wiadomość</span>
              </button>
              
              {/* Cofnij - tylko własne wiadomości */}
              <button
                onClick={() => handleUnsendMessage(message)}
                className="w-full px-4 py-3 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-3 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Cofnij dla wszystkich</span>
              </button>
              
              {/* Usuń - własne wiadomości */}
              <button
                onClick={() => handleDeleteMessage(message)}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Usuń wiadomość</span>
              </button>
            </>
          ) : (
            // Opcje dla cudzych wiadomości - tylko usunięcie lokalne
            <>
              <button
                onClick={() => handleDeleteMessage(message)}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Usuń tylko u siebie</span>
              </button>
              
              {/* Info o ograniczeniach */}
              <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
                Możesz usunąć tę wiadomość tylko u siebie
              </div>
            </>
          )}
        </div>
      </>
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
        )}
      </div>

      {/* Input do pisania wiadomości - responsywny i elegancki */}
      <div 
        className={`p-3 sm:p-4 border-t border-gray-200 bg-white ${dragOver ? 'bg-blue-50 border-blue-300' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        {/* Reply preview - pokazuje się gdy odpowiadamy na wiadomość */}
        {replyingTo && (
          <div className="mb-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Reply className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-blue-800">
                    Odpowiadasz na wiadomość od: {replyingTo.senderName}
                  </span>
                </div>
                <p className="text-sm text-blue-700 truncate bg-white/50 px-2 py-1 rounded">
                  {replyingTo.content.length > 100 
                    ? `${replyingTo.content.substring(0, 100)}...` 
                    : replyingTo.content
                  }
                </p>
              </div>
              <button
                onClick={handleCancelReply}
                className="flex-shrink-0 p-1 hover:bg-blue-200 rounded-full transition-colors"
                title="Anuluj odpowiedź"
              >
                <X className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
        )}
        {/* Podgląd załączników */}
        {attachments.length > 0 && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600 font-medium">
                Załączniki ({attachments.length})
              </span>
              <button
                onClick={() => {
                  attachments.forEach(att => {
                    if (att.preview) URL.revokeObjectURL(att.preview);
                  });
                  setAttachments([]);
                }}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Usuń wszystkie
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {attachments.map(attachment => (
                <div key={attachment.id} className="relative group">
                  {attachment.preview ? (
                    // Podgląd obrazu
                    <div className="relative">
                      <img
                        src={attachment.preview}
                        alt={attachment.name}
                        className="w-full h-16 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    // Ikona pliku
                    <div className="relative p-2 border rounded bg-white">
                      <div className="flex items-center gap-2">
                        {getFileIcon(attachment.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drag & Drop overlay */}
        {dragOver && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <p className="text-blue-700 font-medium">Upuść pliki tutaj</p>
              <p className="text-blue-600 text-sm">Obsługiwane: zdjęcia, PDF, TXT</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Przycisk załączników */}
          <div className="relative">
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              disabled={sending}
              className="
                p-2 sm:p-2.5
                text-gray-600 hover:text-[#35530A] hover:bg-gray-100
                rounded-full transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex-shrink-0
              "
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Menu załączników */}
            {showAttachmentMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="py-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Image className="w-4 h-4" />
                    Dodaj zdjęcie
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Dodaj plik
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-500">
                      Przeciągnij i upuść pliki lub wklej ze schowka
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Max 10MB • JPG, PNG, GIF, PDF, TXT
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

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
            disabled={(!messageText.trim() && attachments.length === 0) || sending}
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

      {/* Kliknij poza menu, aby je zamknąć */}
      {showOptionsMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowOptionsMenu(false)}
        />
      )}

      {/* Menu kontekstowe dla wiadomości */}
      {renderContextMenu()}
    </div>
  );
});

ChatPanel.displayName = 'ChatPanel';

export default ChatPanel;
