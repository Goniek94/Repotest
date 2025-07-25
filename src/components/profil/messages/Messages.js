import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Paperclip, Send, ArrowLeft, X } from 'lucide-react';
import MessagesTabs from './MessagesTabs';
import MessageList from './MessageList';
import MessageChat from './MessageChat';
import EmptyChat from './EmptyChat';
import ChatHeader from './ChatHeader';
import { useNotifications } from '../../../contexts/NotificationContext';
import useConversations from './hooks/useConversations';
import { useAuth } from '../../../contexts/AuthContext';
import { DEFAULT_FOLDER, FOLDER_MAP } from '../../../constants/messageFolders';

/**
 * Główny komponent wiadomości
 * 
 * Integruje wszystkie komponenty związane z wiadomościami
 * i zapewnia spójny interfejs użytkownika.
 */
const Messages = memo(() => {
  // Kontekst powiadomień i autoryzacji
  const { unreadCount } = useNotifications();
  const { isAuthenticated, user } = useAuth();
  
  // Stan lokalny komponentu
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const initial = searchParams.get('folder');
    return FOLDER_MAP[initial] ? initial : DEFAULT_FOLDER;
  });
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [sendingReply, setSendingReply] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  
  // Stan dla widoku mobilnego
  const [mobileView, setMobileView] = useState('list'); // 'list' lub 'chat'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  // Referencja do inputa plików
  const fileInputRef = useRef(null);

  // Synchronizacja aktywnej zakładki z parametrem w adresie
  useEffect(() => {
    setSearchParams({ folder: activeTab });
  }, [activeTab, setSearchParams]);

  // Hook useConversations zarządzający stanem i operacjami na konwersacjach
  const { 
    conversations,
    selectedConversation,
    chatMessages,
    loading,
    error,
    selectConversation,
    toggleStar,
    deleteConversation,
    moveToFolder,
    deleteMessage,
    archiveMessage,
    sendReply,
    showNotification,
    markConversationAsRead
  } = useConversations(activeTab);

  // Memoizacja danych unread count dla MessagesTabs
  const unreadCountMemo = useMemo(() => ({
    odebrane: unreadCount.messages || 0,
    wyslane: 0,
    wazne: 0,
    archiwum: 0
  }), [unreadCount.messages]);

  // Memoizowane handlery

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearchParams({ folder: tab });
    // Po zmianie zakładki wróć do listy na mobile
    if (window.innerWidth < 768) {
      setMobileView('list');
    }
  }, [setSearchParams]);

  const handleStar = useCallback((conversationId) => {
    toggleStar(conversationId);
  }, [toggleStar]);

  const handleDelete = useCallback((conversationId) => {
    deleteConversation(conversationId);
    // Po usunięciu wróć do listy na mobile
    if (window.innerWidth < 768) {
      setMobileView('list');
    }
  }, [deleteConversation]);

  const handleMove = useCallback((conversationId, folder) => {
    moveToFolder(conversationId, folder);
  }, [moveToFolder]);

  const handleArchive = useCallback((conversationId) => {
    moveToFolder(conversationId, 'archiwum');
    // Po archiwizacji wróć do listy na mobile
    if (window.innerWidth < 768) {
      setMobileView('list');
    }
  }, [moveToFolder]);

  const handleBack = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    selectConversation(null);
    setMobileView('list');
  }, [selectConversation]);

  // Obsługa wyboru konwersacji z automatycznym przejściem do czatu na mobile
  const handleSelectConversation = useCallback((conversation) => {
    if (!conversation) return;
    
    selectConversation(conversation);
    if (window.innerWidth < 768) {
      setMobileView('chat');
    }
  }, [selectConversation]);

  // Obsługa odpowiadania na konkretną wiadomość
  const handleReplyToMessage = useCallback((message) => {
    setReplyToMessage(message);
    // Automatycznie dodaj cytowanie do pola tekstowego
    setReplyContent(`> ${message.content.split('\n').join('\n> ')}\n\n`);
  }, []);
  
  // Anulowanie odpowiedzi na konkretną wiadomość
  const handleCancelReply = useCallback(() => {
    setReplyToMessage(null);
    setReplyContent('');
  }, []);
  
  // Obsługa wysyłania odpowiedzi
  const handleSendReply = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if ((!replyContent.trim() && attachments.length === 0) || !selectedConversation) return;
    
    setSendingReply(true);
    try {
      // Dodaj informację o wiadomości, na którą odpowiadamy
      const replyMetadata = replyToMessage ? { replyTo: replyToMessage.id } : undefined;
      await sendReply(replyContent, attachments, replyMetadata);
      setReplyContent('');
      setAttachments([]);
      setReplyToMessage(null);
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      showNotification('Nie udało się wysłać wiadomości', 'error');
    } finally {
      setSendingReply(false);
    }
  }, [replyContent, attachments, selectedConversation, sendReply, showNotification, replyToMessage]);

  // Obsługa dodawania załączników
  const handleAttachmentClick = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    fileInputRef.current?.click();
  }, []);

  // Obsługa wyboru plików
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Ograniczenie liczby załączników
    if (attachments.length + files.length > 5) {
      showNotification('Możesz dodać maksymalnie 5 załączników', 'warning');
      e.target.value = ''; // Reset input
      return;
    }
    
    // Ograniczenie rozmiaru plików (10MB)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showNotification('Niektóre pliki są zbyt duże (maksymalny rozmiar to 10MB)', 'warning');
      e.target.value = ''; // Reset input
      return;
    }
    
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = ''; // Reset input
  }, [attachments.length, showNotification]);

  // Usuwanie załącznika
  const removeAttachment = useCallback((index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Funkcja do przekierowania na stronę logowania
  const handleLoginRedirect = useCallback(() => {
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/login';
  }, []);


  // Memoizacja warunków renderowania
  const isButtonDisabled = useMemo(() => {
    return sendingReply || (!replyContent.trim() && attachments.length === 0) || !selectedConversation;
  }, [sendingReply, replyContent, attachments.length, selectedConversation]);

  // Komponent mobilnego nagłówka czatu
  const MobileChatHeader = memo(({ conversation, onBack, onStar, onDelete, onArchive, onMarkAsRead }) => (
    <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBack(e);
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Wróć do listy konwersacji"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {conversation.subject || 'Bez tematu'}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {conversation.participants?.map(p => p.name).join(', ') || 'Nieznany nadawca'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onStar();
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Oznacz jako ważne"
        >
          <svg className={`h-5 w-5 ${conversation.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMarkAsRead();
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Oznacz jako przeczytane"
        >
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onArchive();
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Archiwizuj"
        >
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4 4-4m0 0L9 4m4 4v12" />
          </svg>
        </button>
      </div>
    </div>
  ));

  // Komponent pola odpowiedzi (wspólny dla desktop i mobile)
  const ReplyField = useMemo(() => (
    <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
      {/* Informacja o wiadomości, na którą odpowiadamy */}
      {replyToMessage && (
        <div className="mb-2 bg-gray-100 p-2 rounded-lg border-l-4 border-[#35530A] relative">
          <button 
            className="absolute top-1 right-1 text-gray-500 hover:text-red-500"
            onClick={handleCancelReply}
            aria-label="Anuluj odpowiedź"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="text-xs text-gray-500 mb-1">
            Odpowiedź do: {replyToMessage.senderName || 'Nieznany użytkownik'}
          </div>
          <div className="text-sm text-gray-700 truncate">
            {replyToMessage.content.length > 100 
              ? `${replyToMessage.content.substring(0, 100)}...` 
              : replyToMessage.content}
          </div>
        </div>
      )}
      
      {/* Lista załączników */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((attachment, index) => (
            <div key={`${attachment.name}-${index}`} className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center gap-1">
              <span className="truncate max-w-[100px] sm:max-w-[150px]" title={attachment.name}>
                {attachment.name}
              </span>
              <button 
                className="text-gray-500 hover:text-red-500 ml-1"
                onClick={() => removeAttachment(index)}
                aria-label={`Usuń załącznik ${attachment.name}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Pole tekstowe i przyciski */}
      <div className="flex items-end gap-2">
        <textarea
          className="flex-grow p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent resize-none text-sm sm:text-base"
          placeholder="Napisz wiadomość..."
          rows="2"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          disabled={sendingReply}
        />
        <div className="flex flex-col gap-1 sm:gap-2">
          {/* Przycisk załączników */}
          <button
            className="p-2 sm:p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAttachmentClick(e);
            }}
            disabled={sendingReply}
            title="Dodaj załącznik"
            aria-label="Dodaj załącznik"
          >
            <Paperclip className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          {/* Przycisk wysyłania */}
          <button
            className="p-2 sm:p-3 rounded-lg bg-[#35530A] text-white hover:bg-[#2A4208] transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSendReply(e);
            }}
            disabled={isButtonDisabled}
            title="Wyślij wiadomość"
            aria-label="Wyślij wiadomość"
          >
            {sendingReply ? (
              <div className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Ukryty input do wyboru plików */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
      />
    </div>
  ), [attachments, replyContent, sendingReply, isButtonDisabled, handleAttachmentClick, handleSendReply, removeAttachment, handleFileSelect]);

  // Memoizacja zawartości lewej kolumny
  const leftColumnContent = useMemo(() => {
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col justify-center items-center h-64 p-4">
          <div className="text-red-500 mb-4">
            <p className="text-center font-medium text-lg">Twoja sesja wygasła. Zaloguj się ponownie, aby kontynuować.</p>
          </div>
          <button 
            className="px-4 py-2 bg-[#35530A] text-white rounded-md hover:bg-[#2A4208] transition-colors"
            onClick={handleLoginRedirect}
          >
            Zaloguj się
          </button>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex justify-center items-center h-64 p-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      );
    }
    
    if (loading && conversations.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
        </div>
      );
    }
    
    if (conversations.length === 0) {
      return (
        <div className="flex justify-center items-center h-64 p-4 text-center text-gray-500">
          <p>Nie znaleziono wiadomości w tym folderze.</p>
        </div>
      );
    }
    
    return (
      <MessageList
        messages={conversations}
        activeConversation={selectedConversation?.id}
        onSelectConversation={handleSelectConversation}
        onStar={handleStar}
        onDelete={handleDelete}
        onMove={handleMove}
      />
    );
  }, [
    isAuthenticated,
    error,
    loading,
    conversations,
    selectedConversation?.id,
    handleSelectConversation,
    handleStar,
    handleDelete,
    handleMove,
    handleLoginRedirect
  ]);

  // Rendering komponentu
  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 h-[calc(100vh-2rem)] sm:h-[80vh] flex flex-col">
          
          {/* Zakładki folderów - dostosowane do urządzeń */}
          <MessagesTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            unreadCount={unreadCountMemo}
          />
          
          {/* Główna zawartość */}
          <div className="flex flex-1 overflow-hidden">
            {/* WIDOK DESKTOPOWY - podział na dwie kolumny */}
            <div className="hidden md:flex md:flex-1 md:overflow-hidden">
              {/* Lista konwersacji (lewa kolumna) */}
              <div className="w-2/5 border-r border-gray-200 flex flex-col overflow-hidden">
                {leftColumnContent}
              </div>
              
              {/* Zawartość konwersacji (prawa kolumna) */}
              <div className="w-3/5 flex flex-col overflow-hidden">
                {selectedConversation ? (
                  <>
                    {/* Nagłówek konwersacji */}
                    <ChatHeader 
                      conversation={selectedConversation} 
                      onStar={() => handleStar(selectedConversation.id)} 
                      onDelete={() => handleDelete(selectedConversation.id)}
                      onArchive={() => handleArchive(selectedConversation.id)}
                      onBack={handleBack}
                      onMarkAsRead={() => markConversationAsRead(selectedConversation.id)}
                    />
                    
                    {/* Wiadomości w konwersacji */}
                    <MessageChat
                      messages={chatMessages}
                      currentUser={user}
                      loading={loading}
                      onDeleteMessage={deleteMessage}
                      onArchiveMessage={archiveMessage}
                      onReplyToMessage={handleReplyToMessage}
                    />
                    
                    {/* Pole odpowiedzi */}
                    {ReplyField}
                  </>
                ) : (
                  <EmptyChat />
                )}
              </div>
            </div>
            
            {/* WIDOK MOBILNY - przełączanie między listą a czatem */}
            <div className="md:hidden flex flex-col flex-1 overflow-hidden">
              {mobileView === 'list' ? (
                <>
                  {/* Mobilny nagłówek */}
                  <div className="bg-white border-b border-gray-200 p-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Wiadomości
                    </h2>
                  </div>
                  
                  {/* Lista konwersacji */}
                  <div className="flex-1 overflow-hidden">
                    {leftColumnContent}
                  </div>
                </>
              ) : (
                <>
                  {/* Mobilny nagłówek czatu */}
                  {selectedConversation && (
                    <MobileChatHeader
                      conversation={selectedConversation}
                      onBack={handleBack}
                      onStar={() => handleStar(selectedConversation.id)}
                      onDelete={() => handleDelete(selectedConversation.id)}
                      onArchive={() => handleArchive(selectedConversation.id)}
                      onMarkAsRead={() => markConversationAsRead(selectedConversation.id)}
                    />
                  )}
                  
                  {/* Wiadomości w konwersacji */}
                  <div className="flex-1 overflow-hidden">
                    {selectedConversation ? (
                      <MessageChat
                        messages={chatMessages}
                        currentUser={user}
                        loading={loading}
                        onDeleteMessage={deleteMessage}
                        onArchiveMessage={archiveMessage}
                        onReplyToMessage={handleReplyToMessage}
                      />
                    ) : (
                      <EmptyChat />
                    )}
                  </div>
                  
                  {/* Pole odpowiedzi */}
                  {selectedConversation && ReplyField}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
});

// Dodanie displayName dla lepszego debugowania
Messages.displayName = 'Messages';

export default Messages;
