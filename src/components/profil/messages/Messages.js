import React, { useState, useEffect, useRef } from 'react';
import { Search, PlusCircle, Paperclip, Send } from 'lucide-react';
import MessagesService from '../../../services/api/messages';
import MessageList from './MessageList';
import MessageChat from './MessageChat';
import MessageForm from './MessageForm';
import MessagesTabs from './MessagesTabs';
import EmptyChat from './EmptyChat';
import ChatHeader from './ChatHeader';
import MessagesHeader from './MessagesHeader';
import { toast } from 'react-toastify';

/**
 * Główny komponent wiadomości z pełną integracją z bazą danych
 * Obsługuje pobieranie, wysyłanie, przenoszenie i zarządzanie konwersacjami
 */
const Messages = () => {
  // Stan komponentu
  const [activeTab, setActiveTab] = useState('odebrane');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [sendingReply, setSendingReply] = useState(false);
  const [currentBackendFolder, setCurrentBackendFolder] = useState('inbox'); // Dodana zmienna w stanie
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Mapowanie folderów
  const folderMap = {
    'odebrane': 'inbox',
    'wyslane': 'sent',
    'robocze': 'drafts',
    'archiwum': 'archived',
    'wazne': 'starred'
  };

  // Pobieranie konwersacji przy zmianie folderu i aktualizacja currentBackendFolder
  useEffect(() => {
    const backendFolder = folderMap[activeTab] || 'inbox';
    setCurrentBackendFolder(backendFolder);
    fetchConversations();
  }, [activeTab]);
  
  // Pobieranie wiadomości przy wyborze konwersacji
  useEffect(() => {
    if (selectedConversation) {
      fetchConversationMessages();
    }
  }, [selectedConversation]);
  
  // Przewijanie czatu do najnowszej wiadomości
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  /**
   * Funkcja pobierająca konwersacje z wybranego folderu
   */
  const fetchConversations = async () => {
    try {
      setLoading(true);
      // Używamy zmiennej ze stanu zamiast lokalnej definicji
      
      // Używamy dedykowanej metody API do pobierania konwersacji
      const response = await MessagesService.getConversationsList();
      
      let formattedConversations = [];
      const data = response?.conversations || [];
      
      if (Array.isArray(data)) {
        // Filtrowanie konwersacji według aktywnego folderu
        formattedConversations = data
          .filter(conversation => conversation.folder === currentBackendFolder)
          .map(conversation => ({
            id: conversation._id,
            userId: conversation.user?._id,
            sender: {
              id: conversation.user?._id,
              name: conversation.user?.name || 'Nieznany użytkownik'
            },
            title: conversation.lastMessage?.subject || 'Bez tematu',
            content: conversation.lastMessage?.content || '',
            date: new Date(conversation.lastMessage?.createdAt || Date.now()),
            isRead: conversation.read,
            isStarred: conversation.starred,
            folder: conversation.folder || currentBackendFolder,
            unreadCount: conversation.unreadCount || 0,
            attachments: conversation.lastMessage?.attachments || []
          }));
      } else {
        // Jeśli API konwersacji nie jest dostępne, używamy starej metody grupowania
        const messagesResponse = await MessagesService.getByFolder(currentBackendFolder);
        const messages = Array.isArray(messagesResponse) ? messagesResponse : messagesResponse.data;
        
        if (Array.isArray(messages)) {
          // Grupowanie wiadomości według użytkownika
          const conversationsByUser = {};
          
          messages.forEach(message => {
            // Określenie drugiego użytkownika w konwersacji
            const otherUser = message.sender ? message.sender : message.recipient;
            const otherUserId = otherUser?._id;
            
            if (otherUserId) {
              if (!conversationsByUser[otherUserId]) {
                conversationsByUser[otherUserId] = {
                  id: message._id,
                  userId: otherUserId,
                  sender: {
                    id: otherUser._id,
                    name: otherUser.name || 'Nieznany użytkownik'
                  },
                  title: message.subject || 'Bez tematu',
                  content: message.content,
                  date: new Date(message.createdAt),
                  isRead: message.read,
                  isStarred: message.starred,
                  folder: currentBackendFolder,
                  unreadCount: message.read ? 0 : 1,
                  attachments: message.attachments || []
                };
              } else {
                // Aktualizuj datę i treść, jeśli ta wiadomość jest nowsza
                const messageDate = new Date(message.createdAt);
                if (messageDate > conversationsByUser[otherUserId].date) {
                  conversationsByUser[otherUserId].date = messageDate;
                  conversationsByUser[otherUserId].content = message.content;
                  conversationsByUser[otherUserId].id = message._id;
                  conversationsByUser[otherUserId].isRead = message.read;
                }
                
                // Zwiększ licznik nieprzeczytanych
                if (!message.read) {
                  conversationsByUser[otherUserId].unreadCount += 1;
                }
              }
            }
          });
          
          // Konwersja obiektu na tablicę
          formattedConversations = Object.values(conversationsByUser);
        }
      }

      setConversations(formattedConversations);
      setLoading(false);
    } catch (err) {
      console.error('Błąd pobierania konwersacji:', err);
      showNotification('Nie udało się pobrać konwersacji', 'error');
      setLoading(false);
    }
  };
  
  /**
   * Funkcja pobierająca wiadomości z wybranej konwersacji
   */
  const fetchConversationMessages = async () => {
    if (!selectedConversation) return;
    
    try {
      setLoading(true);
      
      // Używamy dedykowanej metody API do pobierania wiadomości z konwersacji
      const response = await MessagesService.getConversationMessages(selectedConversation.userId);
      
      if (response?.messages && Array.isArray(response.messages)) {
        // Formatowanie wiadomości dla wyświetlenia
        const formattedMessages = response.messages.map(msg => ({
          id: msg._id,
          sender: msg.sender?._id,
          senderName: msg.sender?.name || 'Nieznany użytkownik',
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          isRead: msg.read,
          isDelivered: true,
          isDelivering: false,
          attachments: (msg.attachments || []).map(att => ({
            id: att._id,
            name: att.name || att.originalname,
            url: att.path,
            type: att.mimetype?.startsWith('image/') ? 'image' : 'file'
          }))
        }));
        
        // Sortowanie wiadomości według czasu
        formattedMessages.sort((a, b) => a.timestamp - b.timestamp);
        
        setChatMessages(formattedMessages);
      } else {
        // Jeśli API konwersacji nie jest dostępne, używamy starej metody
        const fallbackResponse = await MessagesService.getById(selectedConversation.id);
        
        // Jeśli mamy jedną wiadomość, wyświetlamy ją jako czat
        setChatMessages([{
          id: selectedConversation.id,
          sender: selectedConversation.sender.id,
          senderName: selectedConversation.sender.name,
          content: selectedConversation.content,
          timestamp: selectedConversation.date,
          isRead: selectedConversation.isRead,
          isDelivered: true,
          isDelivering: false,
          attachments: (selectedConversation.attachments || []).map(att => ({
            id: att._id,
            name: att.originalname || att.name,
            url: att.path,
            type: att.mimetype?.startsWith('image/') ? 'image' : 'file'
          }))
        }]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Błąd pobierania wiadomości konwersacji:', err);
      showNotification('Nie udało się pobrać wiadomości', 'error');
      setLoading(false);
    }
  };
  
  /**
   * Obsługa kliknięcia na konwersację w liście
   */
  const handleConversationClick = async (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    setSelectedConversation(conversation);
    
    // Oznaczenie konwersacji jako przeczytanej
    if (conversation.unreadCount > 0) {
      try {
        // Używamy dedykowanej metody API do oznaczania konwersacji jako przeczytanej
        await MessagesService.markConversationAsRead(conversation.userId);
        
        // Aktualizacja stanu po oznaczeniu jako przeczytane
        setConversations(conversations.map(conv => 
          conv.id === conversationId ? { ...conv, isRead: true, unreadCount: 0 } : conv
        ));
        
        setSelectedConversation(prev => ({ ...prev, isRead: true, unreadCount: 0 }));
      } catch (err) {
        console.error('Błąd oznaczania konwersacji jako przeczytanej:', err);
        // Próba oznaczenia pojedynczych wiadomości jako przeczytane (fallback)
        try {
          await MessagesService.markAsRead(conversation.id);
        } catch (fallbackErr) {
          console.error('Błąd fallback oznaczania wiadomości jako przeczytanej:', fallbackErr);
        }
      }
    }
  };
  
  /**
   * Funkcja przełączająca gwiazdkę (oznaczenie jako ważne)
   */
  const toggleStar = async (conversationId) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;
      
      // Używamy dedykowanej metody API do oznaczania konwersacji gwiazdką
      await MessagesService.toggleConversationStar(conversation.userId);
      
      // Aktualizacja stanu konwersacji
      setConversations(conversations.map(conv => 
        conv.id === conversationId ? { ...conv, isStarred: !conv.isStarred } : conv
      ));
      
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation({
          ...selectedConversation,
          isStarred: !selectedConversation.isStarred
        });
      }
      
      const isStarred = conversations.find(c => c.id === conversationId)?.isStarred;
      showNotification(
        `Konwersacja ${isStarred ? 'usunięta z' : 'dodana do'} ważnych`, 
        'success'
      );
    } catch (err) {
      console.error('Błąd przełączania gwiazdki:', err);
      
      // Fallback do starszego API
      try {
        await MessagesService.toggleStar(conversationId);
        // Aktualizacja stanu
        setConversations(conversations.map(conv => 
          conv.id === conversationId ? { ...conv, isStarred: !conv.isStarred } : conv
        ));
        
        if (selectedConversation && selectedConversation.id === conversationId) {
          setSelectedConversation({
            ...selectedConversation,
            isStarred: !selectedConversation.isStarred
          });
        }
        
        showNotification('Status konwersacji zaktualizowany', 'success');
      } catch (fallbackErr) {
        console.error('Błąd fallback przełączania gwiazdki:', fallbackErr);
        showNotification('Nie udało się zaktualizować statusu konwersacji', 'error');
      }
    }
  };
  
  /**
   * Funkcja usuwająca konwersację
   */
  const deleteConversation = async (conversationId) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;
      
      // Używamy dedykowanej metody API do usuwania konwersacji
      await MessagesService.deleteConversation(conversation.userId);
      
      // Aktualizacja stanu
      setConversations(conversations.filter(conv => conv.id !== conversationId));
      
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation(null);
        setChatMessages([]);
      }
      
      showNotification('Konwersacja została usunięta', 'success');
    } catch (err) {
      console.error('Błąd usuwania konwersacji:', err);
      
      // Fallback do starszego API
      try {
        await MessagesService.delete(conversationId);
        // Aktualizacja stanu
        setConversations(conversations.filter(conv => conv.id !== conversationId));
        
        if (selectedConversation && selectedConversation.id === conversationId) {
          setSelectedConversation(null);
          setChatMessages([]);
        }
        
        showNotification('Konwersacja została usunięta', 'success');
      } catch (fallbackErr) {
        console.error('Błąd fallback usuwania konwersacji:', fallbackErr);
        showNotification('Nie udało się usunąć konwersacji', 'error');
      }
    }
  };
  
  /**
   * Funkcja przenosząca konwersację do innego folderu
   */
  const moveToFolder = async (conversationId, targetFolder) => {
    // Definiujemy zmienną na poziomie funkcji, aby była dostępna we wszystkich blokach
    const targetBackendFolder = folderMap[targetFolder];
    if (!targetBackendFolder) return;
    
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    try {
      // Używamy dedykowanej metody API do przenoszenia konwersacji
      if (targetBackendFolder === 'archived') {
        await MessagesService.archiveConversation(conversation.userId);
      } else if (targetBackendFolder === 'trash') {
        await MessagesService.moveConversationToTrash(conversation.userId);
      } else {
        await MessagesService.moveConversationToFolder(conversation.userId, targetBackendFolder);
      }
      
      // Aktualizacja listy konwersacji
      if (activeTab !== targetFolder) {
        setConversations(conversations.filter(conv => conv.id !== conversationId));
      } else {
        fetchConversations(); // Odświeżenie listy w aktualnym folderze
      }
      
      // Aktualizacja wybranej konwersacji
      if (selectedConversation && selectedConversation.id === conversationId) {
        if (activeTab !== targetFolder) {
          setSelectedConversation(null);
          setChatMessages([]);
        } else {
          setSelectedConversation(prev => ({ ...prev, folder: targetBackendFolder }));
        }
      }
      
      showNotification(`Konwersacja przeniesiona do ${targetFolder}`, 'success');
    } catch (err) {
      console.error(`Błąd przenoszenia konwersacji do ${targetFolder}:`, err);
      
      // Fallback do starszego API
      try {
        if (targetBackendFolder === 'archived') {
          await MessagesService.archive(conversationId);
        } else if (targetBackendFolder === 'trash') {
          await MessagesService.moveToTrash(conversationId);
        } else if (targetBackendFolder === 'starred') {
          await MessagesService.toggleStar(conversationId);
        } else {
          await MessagesService.moveToFolder(conversationId, targetBackendFolder);
        }
        
        // Aktualizacja listy konwersacji
        if (activeTab !== targetFolder) {
          setConversations(conversations.filter(conv => conv.id !== conversationId));
        } else {
          fetchConversations();
        }
        
        // Aktualizacja wybranej konwersacji
        if (selectedConversation && selectedConversation.id === conversationId) {
          if (activeTab !== targetFolder) {
            setSelectedConversation(null);
            setChatMessages([]);
          } else {
            setSelectedConversation(prev => ({ ...prev, folder: targetBackendFolder }));
          }
        }
        
        showNotification(`Konwersacja przeniesiona do ${targetFolder}`, 'success');
      } catch (fallbackErr) {
        console.error(`Błąd fallback przenoszenia konwersacji do ${targetFolder}:`, fallbackErr);
        showNotification(`Nie udało się przenieść konwersacji do ${targetFolder}`, 'error');
      }
    }
  };
  
  /**
   * Funkcja wysyłająca odpowiedź w konwersacji
   */
  const handleSendReply = async () => {
    if ((!replyContent.trim() && attachments.length === 0) || !selectedConversation) return;
    setSendingReply(true);
    
    try {
      const formData = new FormData();
      formData.append('content', replyContent);
      
      // Dodanie załączników do formularza
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
      
      // Używamy dedykowanej metody API do odpowiadania w konwersacji
      const response = await MessagesService.replyToConversation(selectedConversation.userId, formData);
      
      // Optymistyczna aktualizacja UI - dodanie nowej wiadomości do czatu
      const newMessage = {
        id: response?._id || `temp-${Date.now()}`,
        sender: 'currentUser', // ID aktualnego użytkownika
        senderName: 'Ja',
        content: replyContent,
        timestamp: new Date(),
        isRead: true,
        isDelivered: true,
        isDelivering: false,
        attachments: attachments.map(file => ({
          id: `temp-${file.name}`,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'file'
        }))
      };
      
      setChatMessages([...chatMessages, newMessage]);
      
      // Czyszczenie pola odpowiedzi i listy załączników
      setReplyContent('');
      setAttachments([]);
      
      showNotification('Wiadomość wysłana', 'success');
    } catch (err) {
      console.error('Błąd wysyłania odpowiedzi:', err);
      
      // Fallback do starszego API
      try {
        const formData = new FormData();
        formData.append('content', replyContent);
        
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
        
        const response = await MessagesService.replyToMessage(selectedConversation.id, formData);
        
        // Optymistyczna aktualizacja UI
        const newMessage = {
          id: response?.data?._id || `temp-${Date.now()}`,
          sender: 'currentUser',
          senderName: 'Ja',
          content: replyContent,
          timestamp: new Date(),
          isRead: true,
          isDelivered: true,
          isDelivering: false,
          attachments: attachments.map(file => ({
            id: `temp-${file.name}`,
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'file'
          }))
        };
        
        setChatMessages([...chatMessages, newMessage]);
        setReplyContent('');
        setAttachments([]);
        
        showNotification('Wiadomość wysłana', 'success');
      } catch (fallbackErr) {
        console.error('Błąd fallback wysyłania odpowiedzi:', fallbackErr);
        showNotification('Nie udało się wysłać wiadomości', 'error');
      }
    } finally {
      setSendingReply(false);
    }
  };
  
  /**
   * Obsługa wyszukiwania
   */
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    
    if (query.trim().length < 3) {
      // Jeśli zapytanie jest krótkie, pokaż standardową listę konwersacji
      fetchConversations();
      return;
    }
    
    try {
      setLoading(true);
      // Używamy zmiennej ze stanu zamiast lokalnej definicji
      
      // Używamy dedykowanej metody API do wyszukiwania konwersacji
      const response = await MessagesService.searchConversations(query, currentBackendFolder);
      
      let searchResults = [];
      const data = Array.isArray(response) ? response : response.data;
      
      if (Array.isArray(data)) {
        searchResults = data.map(conversation => ({
          id: conversation._id,
          userId: conversation.user?._id,
          sender: {
            id: conversation.user?._id,
            name: conversation.user?.name || 'Nieznany użytkownik'
          },
          title: conversation.lastMessage?.subject || 'Bez tematu',
          content: conversation.lastMessage?.content || '',
          date: new Date(conversation.lastMessage?.createdAt || Date.now()),
          isRead: conversation.read,
          isStarred: conversation.starred,
          folder: conversation.folder || currentBackendFolder,
          unreadCount: conversation.unreadCount || 0,
          attachments: conversation.lastMessage?.attachments || []
        }));
      } else {
        // Fallback do starszego API
        const fallbackResponse = await MessagesService.search(query, currentBackendFolder);
        const fallbackData = Array.isArray(fallbackResponse) ? fallbackResponse : fallbackResponse.data;
        
        if (Array.isArray(fallbackData)) {
          searchResults = fallbackData.map(message => ({
            id: message._id,
            userId: message.sender?._id,
            sender: {
              id: message.sender?._id,
              name: message.sender?.name || 'Nieznany użytkownik'
            },
            title: message.subject || 'Bez tematu',
            content: message.content,
            date: new Date(message.createdAt),
            isRead: message.read,
            isStarred: message.starred,
            folder: currentBackendFolder,
            attachments: message.attachments || []
          }));
        }
      }
      
      setConversations(searchResults);
      setLoading(false);
    } catch (err) {
      console.error('Błąd wyszukiwania konwersacji:', err);
      showNotification('Błąd podczas wyszukiwania', 'error');
      setLoading(false);
    }
  };
  
  /**
   * Obsługa dodawania załączników
   */
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  /**
   * Obsługa wyboru plików
   */
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Ograniczenie liczby załączników
    if (attachments.length + files.length > 5) {
      showNotification('Możesz dodać maksymalnie 5 załączników', 'warning');
      return;
    }
    
    // Ograniczenie rozmiaru plików (10MB)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showNotification('Niektóre pliki są zbyt duże (maksymalny rozmiar to 10MB)', 'warning');
      return;
    }
    
    setAttachments([...attachments, ...files]);
    e.target.value = ''; // Reset input
  };
  
  /**
   * Usuwanie załącznika
   */
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  /**
   * Funkcja wyświetlająca powiadomienia
   */
  const showNotification = (message, type = 'info') => {
    // Jeśli dostępny jest toast, użyj go
    if (typeof toast === 'function') {
      toast[type]?.(message) || toast(message);
    } else {
      // Fallback do konsoli
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  };

  // Filtrowanie konwersacji na podstawie wyszukiwania (jeśli nie wykonano pełnego wyszukiwania)
  const filteredConversations = searchTerm.trim().length < 3 
    ? conversations.filter(conversation =>
        conversation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : conversations;

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 h-[80vh] flex flex-col">
          {/* Nagłówek */}
          <MessagesHeader 
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onNewMessage={() => setShowNewMessage(true)}
          />
          
          {/* Zakładki folderów */}
          <MessagesTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            messages={conversations}
          />
          
          {/* Główna zawartość */}
          <div className="flex flex-1 overflow-hidden">
            {/* Lista konwersacji (lewa kolumna) */}
            <div className="w-full md:w-2/5 border-r border-gray-200 flex flex-col overflow-hidden">
              {loading && conversations.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
                </div>
              ) : (
                <MessageList
                  messages={filteredConversations}
                  activeConversation={selectedConversation?.id}
                  onSelectConversation={handleConversationClick}
                  onStar={toggleStar}
                  onDelete={deleteConversation}
                  onMove={moveToFolder}
                />
              )}
            </div>
            
            {/* Zawartość konwersacji (prawa kolumna) */}
            <div className="hidden md:flex md:w-3/5 flex-col overflow-hidden">
              {selectedConversation ? (
                <>
                  {/* Nagłówek konwersacji */}
                  <ChatHeader 
                    conversation={selectedConversation} 
                    onStar={() => toggleStar(selectedConversation.id)} 
                    onDelete={() => deleteConversation(selectedConversation.id)}
                    onArchive={() => moveToFolder(selectedConversation.id, 'archiwum')}
                    onBack={() => setSelectedConversation(null)}
                  />
                  
                  {/* Wiadomości w konwersacji */}
                  <MessageChat
                    messages={chatMessages}
                    currentUser={{ id: 'currentUser' }} // użytkownik aktualnie zalogowany
                    loading={loading}
                  />
                  
                  {/* Pole odpowiedzi */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {/* Lista załączników */}
                    {attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {attachments.map((file, index) => (
                          <div 
                            key={index}
                            className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center gap-1"
                          >
                            <span className="truncate max-w-[150px]">{file.name}</span>
                            <button 
                              className="text-gray-500 hover:text-red-500"
                              onClick={() => removeAttachment(index)}
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
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent resize-none"
                        placeholder="Napisz wiadomość..."
                        rows="3"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        disabled={sendingReply}
                      />
                      <div className="flex flex-col gap-2">
                        {/* Przycisk załączników */}
                        <button
                          className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          onClick={handleAttachmentClick}
                          disabled={sendingReply}
                          title="Dodaj załącznik"
                        >
                          <Paperclip className="h-6 w-6" />
                        </button>
                        
                        {/* Przycisk wysyłania */}
                        <button
                          className="p-3 rounded-lg bg-[#35530A] text-white hover:bg-[#2A4208] transition-colors"
                          onClick={handleSendReply}
                          disabled={sendingReply || (!replyContent.trim() && attachments.length === 0)}
                          title="Wyślij wiadomość"
                        >
                          {sendingReply ? (
                            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="h-6 w-6" />
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
                </>
              ) : (
                <EmptyChat onNewMessage={() => setShowNewMessage(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal nowej wiadomości */}
      {showNewMessage && (
        <MessageForm
          onClose={() => setShowNewMessage(false)}
          onSend={() => {
            setShowNewMessage(false);
            fetchConversations();
          }}
        />
      )}
      
      {/* Referencja do końca czatu (dla automatycznego przewijania) */}
      <div ref={chatEndRef} />
    </div>
  );
};

export default Messages;