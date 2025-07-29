import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MessageList from './MessageList';
import MessageChat from './MessageChat';
import { useNotifications } from '../../../contexts/NotificationContext';
import useConversations from './hooks/useConversations';
import { useAuth } from '../../../contexts/AuthContext';
import { DEFAULT_FOLDER, FOLDER_MAP } from '../../../constants/messageFolders';
import notificationService from '../../../services/notifications';
import MessagesService from '../../../services/api/messages';
import { Inbox, Send, Star, Archive, MessageCircle, ArrowLeft } from 'lucide-react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';

// Import nowych komponentów
import MobileChatHeader from './components/MobileChatHeader';
import ConversationView from './components/ConversationView';
import ReplyField from './components/ReplyField';
import ChatHeader from './ChatHeader';

/**
 * Główny komponent wiadomości
 * 
 * Integruje wszystkie komponenty związane z wiadomościami
 * i zapewnia spójny interfejs użytkownika.
 */
const Messages = memo(() => {
  // Wykrywanie rozmiaru ekranu - używamy tego samego systemu co inne komponenty profilu
  const { isMobileOrTablet } = useBreakpoint();
  
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
  
  // Stan dla wybranej kategorii (zamiast rozwijania)
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const initial = searchParams.get('folder');
    return FOLDER_MAP[initial] ? initial : DEFAULT_FOLDER;
  });

  // Osobny stan dla wybranej konwersacji na desktop
  const [desktopSelectedConversation, setDesktopSelectedConversation] = useState(null);
  const [desktopChatMessages, setDesktopChatMessages] = useState([]);
  const [desktopLoading, setDesktopLoading] = useState(false);

  // Synchronizacja aktywnej zakładki z parametrem w adresie
  useEffect(() => {
    setSearchParams({ folder: activeTab });
  }, [activeTab, setSearchParams]);

  // Upewnij się, że selectedCategory jest zsynchronizowana z activeTab
  useEffect(() => {
    if (activeTab && selectedCategory !== activeTab) {
      setSelectedCategory(activeTab);
    }
  }, [activeTab, selectedCategory]);

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

  // Śledzenie aktywnej konwersacji dla inteligentnych powiadomień
  useEffect(() => {
    if (selectedConversation && notificationService.isConnected()) {
      // Znajdź ID drugiego uczestnika konwersacji
      const otherParticipant = selectedConversation.participants?.find(
        p => p.id !== user?._id && p._id !== user?._id
      );
      
      if (otherParticipant) {
        const participantId = otherParticipant.id || otherParticipant._id;
        console.log(`Wchodzę do konwersacji z ${participantId}`);
        notificationService.enterConversation(participantId, selectedConversation.id);
        
        // Cleanup - wyjście z konwersacji
        return () => {
          console.log(`Wychodzę z konwersacji z ${participantId}`);
          notificationService.leaveConversation(participantId, selectedConversation.id);
        };
      }
    }
  }, [selectedConversation, user?._id]);

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
    setSelectedCategory(tab);
    setSearchParams({ folder: tab });
    
    // Wyczyść wybraną konwersację przy zmianie kategorii
    selectConversation(null);
    setDesktopSelectedConversation(null); // Wyczyść też desktop stan
    setDesktopChatMessages([]); // Wyczyść też wiadomości desktop
    
    // Po zmianie zakładki wróć do listy na mobile
    // Na desktopie zachowujemy układ trzech kolumn
    if (isMobileOrTablet) {
      setMobileView('list');
    }
  }, [setSearchParams, selectConversation, isMobileOrTablet]);

  const handleStar = useCallback((conversationId) => {
    toggleStar(conversationId);
  }, [toggleStar]);

  const handleDelete = useCallback((conversationId) => {
    deleteConversation(conversationId);
    // Po usunięciu wróć do listy na mobile
    if (isMobileOrTablet) {
      setMobileView('list');
    }
  }, [deleteConversation, isMobileOrTablet]);

  const handleMove = useCallback((conversationId, folder) => {
    moveToFolder(conversationId, folder);
  }, [moveToFolder]);

  const handleArchive = useCallback((conversationId) => {
    moveToFolder(conversationId, 'archiwum');
    // Po archiwizacji wróć do listy na mobile
    if (isMobileOrTablet) {
      setMobileView('list');
    }
  }, [moveToFolder, isMobileOrTablet]);

  const handleBack = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    selectConversation(null);
    
    // Przełączanie na widok listy tylko na urządzeniach mobilnych
    // Na desktopie po prostu zamykamy konwersację, zachowując układ trzech kolumn
    if (isMobileOrTablet) {
      setMobileView('list');
    }
  }, [selectConversation, isMobileOrTablet]);

  // Funkcja do ładowania wiadomości dla desktop
  const loadDesktopMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    
    setDesktopLoading(true);
    try {
      // Znajdź konwersację w liście
      const conversation = conversations.find(c => c.id === conversationId || c._id === conversationId);
      if (!conversation) {
        console.error('Nie znaleziono konwersacji:', conversationId);
        return;
      }

      // Użyj tego samego API co hook useConversations
      const response = await MessagesService.getConversation(conversation.userId);
      
      console.log('Otrzymana odpowiedź z API dla desktop wiadomości:', response);
      
      if (!response) {
        console.error('Brak odpowiedzi przy pobieraniu wiadomości');
        throw new Error('Nie udało się pobrać wiadomości z konwersacji');
      }
      
      let allMessages = [];
      
      // Obsługa różnych formatów odpowiedzi - taka sama jak w useConversations
      if (response.conversations) {
        console.log('Format odpowiedzi: grupowanie według ogłoszeń');
        Object.values(response.conversations).forEach(convo => {
          if (convo.messages && Array.isArray(convo.messages)) {
            allMessages = [...allMessages, ...convo.messages];
          }
        });
      } else if (Array.isArray(response)) {
        console.log('Format odpowiedzi: bezpośrednia tablica wiadomości');
        allMessages = response;
      } else if (response.messages && Array.isArray(response.messages)) {
        console.log('Format odpowiedzi: wiadomości w property messages');
        allMessages = response.messages;
      } else if (response.data && Array.isArray(response.data)) {
        console.log('Format odpowiedzi: wiadomości w property data');
        allMessages = response.data;
      }
      
      console.log('Wszystkie wiadomości przed formatowaniem (desktop):', allMessages);
      
      // Formatowanie wiadomości do jednolitego formatu - zgodne z MessageChat
      const formattedChatMessages = allMessages.map(msg => ({
        id: msg._id,
        sender: msg.sender?._id || msg.sender,
        senderName: msg.sender?.name || 'Nieznany użytkownik',
        content: msg.content || '',
        timestamp: msg.createdAt || msg.date 
          ? new Date(msg.createdAt || msg.date)
          : new Date(),
        isRead: msg.read || false,
        isDelivered: true,
        isDelivering: false,
        attachments: (msg.attachments || []).map(att => ({
          id: att._id,
          name: att.name || att.originalname || 'Załącznik',
          url: att.path || att.url,
          type: att.mimetype || att.type || 'application/octet-stream'
        }))
      }));
      
      // Sortowanie wiadomości według czasu
      formattedChatMessages.sort((a, b) => a.timestamp - b.timestamp);
      
      setDesktopChatMessages(formattedChatMessages);
    } catch (error) {
      console.error('Błąd podczas ładowania wiadomości:', error);
      showNotification('Nie udało się załadować wiadomości', 'error');
    } finally {
      setDesktopLoading(false);
    }
  }, [conversations, showNotification]);

  // Obsługa wyboru konwersacji z automatycznym przejściem do czatu na mobile
  const handleSelectConversation = useCallback((conversation) => {
    if (!conversation) return;
    
    // selectConversation oczekuje ID, nie całego obiektu
    const conversationId = conversation.id || conversation._id;
    
    if (isMobileOrTablet) {
      // Na mobile używamy normalnego stanu
      selectConversation(conversationId);
      setMobileView('chat');
    } else {
      // Na desktop używamy osobnego stanu
      setDesktopSelectedConversation(conversation);
      loadDesktopMessages(conversationId);
    }
  }, [selectConversation, isMobileOrTablet, loadDesktopMessages]);

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

  // Funkcja do przekierowania na stronę logowania
  const handleLoginRedirect = useCallback(() => {
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/login';
  }, []);

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
        activeConversation={isMobileOrTablet ? selectedConversation?.id : (desktopSelectedConversation?.id || desktopSelectedConversation?._id)}
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
    desktopSelectedConversation?.id,
    desktopSelectedConversation?._id,
    isMobileOrTablet,
    handleSelectConversation,
    handleStar,
    handleDelete,
    handleMove,
    handleLoginRedirect
  ]);

  // Definicja kategorii wiadomości
  const messageCategories = [
    {
      id: 'odebrane',
      label: 'Odebrane',
      icon: <Inbox className="w-5 h-5" />,
      count: unreadCountMemo.odebrane
    },
    {
      id: 'wyslane', 
      label: 'Wysłane',
      icon: <Send className="w-5 h-5" />,
      count: unreadCountMemo.wyslane
    },
    {
      id: 'wazne',
      label: 'Ważne', 
      icon: <Star className="w-5 h-5" />,
      count: unreadCountMemo.wazne
    },
    {
      id: 'archiwum',
      label: 'Archiwum',
      icon: <Archive className="w-5 h-5" />,
      count: unreadCountMemo.archiwum
    }
  ];

  // Obliczanie całkowitej liczby nieprzeczytanych wiadomości
  const totalUnreadCount = useMemo(() => {
    return messageCategories.reduce((sum, category) => sum + category.count, 0);
  }, [messageCategories]);

  // Rendering komponentu
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Główna zawartość */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* MOBILE - Kompaktowy widok */}
          <div className="lg:hidden">
            {mobileView === 'list' ? (
              <>
                {/* Zielony nagłówek na mobile */}
                <div className="bg-[#35530A] text-white p-4 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6" />
                    <div>
                      <h1 className="text-xl font-bold">Wiadomości</h1>
                      {totalUnreadCount > 0 && (
                        <p className="text-sm opacity-90">
                          <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                            {totalUnreadCount} nieprzeczytanych
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kategorie na mobile - tylko ikony */}
                <div className="p-4 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-3">
                    {messageCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleTabChange(category.id)}
                        className={`
                          relative flex items-center justify-center p-4 rounded-lg transition-all duration-200
                          ${activeTab === category.id 
                            ? 'bg-[#35530A] bg-opacity-10 border border-[#35530A] border-opacity-30' 
                            : 'hover:bg-gray-50 border border-transparent'}
                        `}
                        title={category.label} // Tooltip z nazwą kategorii
                      >
                        <span className={`
                          ${activeTab === category.id ? 'text-[#35530A]' : 'text-gray-400'}
                          transition-colors duration-200
                        `}>
                          {category.icon}
                        </span>
                        {category.count > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                            {category.count > 99 ? '99+' : category.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lista konwersacji na mobile */}
                <div className="flex-1">
                  {/* Nagłówek listy konwersacji */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-800">
                      {messageCategories.find(c => c.id === activeTab)?.label || 'Konwersacje'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {conversations.length} {conversations.length === 1 ? 'konwersacja' : 'konwersacji'}
                    </p>
                  </div>
                  
                  {/* Lista konwersacji */}
                  <div className="flex-1">
                    {leftColumnContent}
                  </div>
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
                    <div className="flex justify-center items-center h-full text-gray-500">
                      <p>Wybierz konwersację</p>
                    </div>
                  )}
                </div>
                
                {/* Pole odpowiedzi */}
                {selectedConversation && (
                  <ReplyField
                    replyContent={replyContent}
                    setReplyContent={setReplyContent}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    sendingReply={sendingReply}
                    replyToMessage={replyToMessage}
                    onSendReply={handleSendReply}
                    onCancelReply={handleCancelReply}
                    showNotification={showNotification}
                  />
                )}
              </>
            )}
          </div>

          {/* DESKTOP - Układ z bocznym panelem */}
          <div className="hidden lg:flex bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
            {/* Zielony nagłówek na pełną szerokość */}
            <div className="absolute top-0 left-0 right-0 bg-[#35530A] text-white p-4 z-10">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <div>
                  <h1 className="text-xl font-bold">Wiadomości</h1>
                  {totalUnreadCount > 0 && (
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium ml-2">
                      {totalUnreadCount} nieprzeczytanych
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Główna zawartość - 3 kolumny: Kategorie | Lista konwersacji | Czat */}
            <div className="flex w-full" style={{ marginTop: '80px', height: 'calc(100% - 80px)' }}>
              {/* Lewy panel kategorii - zawsze widoczny */}
              <div className="w-64 flex flex-col bg-gray-50 border-r border-gray-200">
                <div className="p-4 overflow-y-auto">
                  <div className="space-y-1">
                    {messageCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleTabChange(category.id)}
                        className={`
                          w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left
                          ${selectedCategory === category.id 
                            ? 'bg-[#35530A] text-white shadow-md' 
                            : 'text-gray-700 hover:bg-white hover:shadow-sm'}
                        `}
                      >
                        <span className={selectedCategory === category.id ? 'text-white' : 'text-gray-400'}>
                          {category.icon}
                        </span>
                        <span className="flex-1 font-medium text-sm">{category.label}</span>
                        {category.count > 0 && (
                          <span className={`
                            text-xs px-2 py-1 rounded-full font-bold
                            ${selectedCategory === category.id 
                              ? 'bg-white bg-opacity-20 text-white' 
                              : 'bg-red-100 text-red-600'}
                          `}>
                            {category.count > 99 ? '99+' : category.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Środkowy panel - Lista konwersacji */}
              <div className="w-80 flex flex-col bg-white border-r border-gray-200">
                {/* Nagłówek listy konwersacji */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-800">
                    {messageCategories.find(c => c.id === selectedCategory)?.label || 'Konwersacje'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {conversations.length} {conversations.length === 1 ? 'konwersacja' : 'konwersacji'}
                  </p>
                </div>

                {/* Lista konwersacji */}
                <div className="flex-1 overflow-y-auto">
                  {leftColumnContent}
                </div>
              </div>

              {/* Prawy panel - Zajebisty widok konwersacji */}
              <div className="flex-1 bg-white flex flex-col">
                {desktopSelectedConversation ? (
                  // Widok aktywnej konwersacji
                  <>
                    {/* Stylowy nagłówek konwersacji */}
                    <div className="bg-gradient-to-r from-[#35530A] to-[#4a7c0c] text-white p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Avatar użytkownika */}
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                              {desktopSelectedConversation.participants?.find(p => p.id !== user?._id && p._id !== user?._id)?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-lg">
                              {desktopSelectedConversation.participants?.find(p => p.id !== user?._id && p._id !== user?._id)?.name || 'Użytkownik'}
                            </h3>
                            <p className="text-sm opacity-90">
                              {desktopSelectedConversation.lastMessage?.createdAt 
                                ? `Ostatnia wiadomość: ${new Date(desktopSelectedConversation.lastMessage.createdAt).toLocaleDateString('pl-PL')}`
                                : 'Brak wiadomości'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {/* Akcje konwersacji */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStar(desktopSelectedConversation.id || desktopSelectedConversation._id)}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                            title="Oznacz jako ważne"
                          >
                            <Star className={`w-5 h-5 ${desktopSelectedConversation.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
                          </button>
                          
                          <button
                            onClick={() => handleArchive(desktopSelectedConversation.id || desktopSelectedConversation._id)}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                            title="Archiwizuj"
                          >
                            <Archive className="w-5 h-5 text-white" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(desktopSelectedConversation.id || desktopSelectedConversation._id)}
                            className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all duration-200"
                            title="Usuń konwersację"
                          >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Obszar wiadomości - ZAJEBISTY CZAT NA DESKTOP! */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                      {desktopLoading ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
                        </div>
                      ) : (
                        <MessageChat
                          messages={desktopChatMessages}
                          currentUser={user}
                          loading={desktopLoading}
                          onDeleteMessage={(messageId) => {
                            // Usuń wiadomość z desktop stanu
                            setDesktopChatMessages(prev => prev.filter(msg => msg.id !== messageId));
                            showNotification('Wiadomość została usunięta', 'success');
                          }}
                          onArchiveMessage={(messageId) => {
                            // Archiwizuj wiadomość
                            showNotification('Wiadomość została zarchiwizowana', 'success');
                          }}
                          onReplyToMessage={handleReplyToMessage}
                        />
                      )}
                    </div>
                    
                    {/* ZAJEBISTE POLE ODPOWIEDZI NA DESKTOP! */}
                    <div className="border-t border-gray-200 bg-white">
                      <ReplyField
                        replyContent={replyContent}
                        setReplyContent={setReplyContent}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        sendingReply={sendingReply}
                        replyToMessage={replyToMessage}
                        onSendReply={async (e) => {
                          if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                          
                          if ((!replyContent.trim() && attachments.length === 0) || !desktopSelectedConversation) return;
                          
                          setSendingReply(true);
                          try {
                            // Dodaj nową wiadomość do desktop czatu
                            const newMessage = {
                              id: Date.now().toString(),
                              content: replyContent,
                              sender: { id: user?._id, name: user?.name },
                              createdAt: new Date().toISOString(),
                              isRead: true
                            };
                            
                            setDesktopChatMessages(prev => [...prev, newMessage]);
                            setReplyContent('');
                            setAttachments([]);
                            setReplyToMessage(null);
                            showNotification('Wiadomość została wysłana!', 'success');
                          } catch (error) {
                            console.error('Błąd podczas wysyłania wiadomości:', error);
                            showNotification('Nie udało się wysłać wiadomości', 'error');
                          } finally {
                            setSendingReply(false);
                          }
                        }}
                        onCancelReply={handleCancelReply}
                        showNotification={showNotification}
                      />
                    </div>
                  </>
                ) : (
                  // Zajebisty pusty stan - wybierz konwersację
                  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 via-white to-blue-50">
                    <div className="text-center max-w-md">
                      {/* Animowana ikona */}
                      <div className="relative mb-8">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#35530A] to-[#4a7c0c] rounded-full flex items-center justify-center shadow-xl">
                          <MessageCircle className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white text-xs font-bold">💬</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        Wybierz konwersację
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Kliknij na konwersację z listy po lewej stronie, aby rozpocząć czat i zobaczyć wszystkie wiadomości.
                      </p>
                      
                      {/* Wskazówki */}
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-800 mb-3">💡 Wskazówki:</h4>
                        <ul className="text-sm text-gray-600 space-y-2 text-left">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#35530A] rounded-full"></span>
                            Użyj kategorii po lewej, aby filtrować wiadomości
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Oznaczaj ważne konwersacje gwiazdką
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Archiwizuj stare rozmowy, aby utrzymać porządek
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
