import { useState, useEffect, useCallback } from 'react';
import MessagesService from '../../../../services/api/messages';
import { toast } from 'react-toastify';

/**
 * Hook zarządzający stanem i akcjami konwersacji
 * @param {string} activeTab - aktywna zakładka (folder)
 */
const useConversations = (activeTab) => {
  // Stan
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mapowanie folderów
  const folderMap = {
    'odebrane': 'inbox',
    'wyslane': 'sent',
    'robocze': 'drafts',
    'archiwum': 'archived',
    'wazne': 'starred'
  };

  /**
   * Funkcja wyświetlająca powiadomienia
   */
  const showNotification = useCallback((message, type = 'info') => {
    // Jeśli dostępny jest toast, użyj go
    if (typeof toast === 'function') {
      toast[type]?.(message) || toast(message);
    } else {
      // Fallback do konsoli
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }, []);

  /**
   * Pobieranie konwersacji
   */
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      // Pobieranie listy wszystkich konwersacji
      const response = await MessagesService.getConversationsList();

      let formattedConversations = [];
      const data = response?.conversations || [];
      
      if (Array.isArray(data)) {
        // Filtrowanie konwersacji według aktywnego folderu
        const backendFolder = folderMap[activeTab] || 'inbox';
        
        formattedConversations = data
          .filter(conversation => conversation.folder === backendFolder)
          .map(conversation => ({
            id: conversation._id,
            userId: conversation.user._id,
            userName: conversation.user.name || 'Nieznany użytkownik',
            lastMessage: {
              content: conversation.lastMessage?.content || '',
              date: new Date(conversation.lastMessage?.createdAt || Date.now()),
              isRead: conversation.lastMessage?.read || false,
            },
            unreadCount: conversation.unreadCount || 0,
            isStarred: conversation.starred || false,
            folder: conversation.folder || backendFolder,
          }));
      } else {
        setError('Nie udało się pobrać konwersacji. Spróbuj ponownie później.');
      }

      setConversations(formattedConversations);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      showNotification('Nie udało się pobrać konwersacji', 'error');
      setLoading(false);
    }
  }, [activeTab, folderMap, showNotification]);

  /**
   * Pobieranie wiadomości z konwersacji
   */
  const fetchConversationMessages = useCallback(async () => {
    if (!selectedConversation) return;
    
    try {
      setLoading(true);
      
      const response = await MessagesService.getConversation(selectedConversation.userId);
      
      if (response && response.conversations) {
        // Pobranie wszystkich wiadomości
        let allMessages = [];
        
        // Przetwarzanie wszystkich konwersacji i zbieranie wiadomości
        Object.values(response.conversations).forEach(convo => {
          if (convo.messages && Array.isArray(convo.messages)) {
            allMessages = [...allMessages, ...convo.messages];
          }
        });
        
        // Formatowanie wiadomości
        const formattedChatMessages = allMessages.map(msg => ({
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
        formattedChatMessages.sort((a, b) => a.timestamp - b.timestamp);
        
        setChatMessages(formattedChatMessages);
        
        // Oznaczenie nieprzeczytanych wiadomości jako przeczytane
        if (selectedConversation.unreadCount > 0) {
          markConversationAsRead(selectedConversation.id);
        }
      } else {
        setChatMessages([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversation messages:', err);
      showNotification('Nie udało się pobrać wiadomości z konwersacji', 'error');
      setLoading(false);
    }
  }, [selectedConversation, showNotification]);

  /**
   * Oznaczenie konwersacji jako przeczytanej
   */
  const markConversationAsRead = useCallback(async (conversationId) => {
    try {
      await MessagesService.markConversationAsRead(conversationId);
      
      // Aktualizacja stanu konwersacji
      setConversations(prevConversations => 
        prevConversations.map(convo => 
          convo.id === conversationId 
            ? { ...convo, unreadCount: 0, lastMessage: { ...convo.lastMessage, isRead: true } }
            : convo
        )
      );
      
      // Aktualizacja wybranej konwersacji
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation(prev => ({ 
          ...prev, 
          unreadCount: 0,
          lastMessage: { ...prev.lastMessage, isRead: true }
        }));
      }
    } catch (err) {
      console.error('Error marking conversation as read:', err);
    }
  }, [selectedConversation]);

  /**
   * Funkcja przełączająca gwiazdkę (oznaczenie jako ważne)
   */
  const toggleStar = useCallback(async (conversationId) => {
    try {
      await MessagesService.toggleConversationStar(conversationId);
      
      const conversation = conversations.find(c => c.id === conversationId);
      const isCurrentlyStarred = conversation?.isStarred || false;
      
      setConversations(prevConversations => 
        prevConversations.map(convo => 
          convo.id === conversationId ? { ...convo, isStarred: !convo.isStarred } : convo
        )
      );
      
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation(prev => ({
          ...prev,
          isStarred: !prev.isStarred
        }));
      }
      
      showNotification(
        `Konwersacja ${isCurrentlyStarred ? 'usunięta z' : 'dodana do'} ważnych`, 
        'success'
      );
    } catch (err) {
      console.error('Error toggling star:', err);
      showNotification('Nie udało się zaktualizować statusu konwersacji', 'error');
    }
  }, [conversations, selectedConversation, showNotification]);

  /**
   * Funkcja usuwająca konwersację
   */
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await MessagesService.deleteConversation(conversationId);
      setConversations(prevConversations => 
        prevConversations.filter(convo => convo.id !== conversationId)
      );
      
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation(null);
        setChatMessages([]);
      }
      
      showNotification('Konwersacja została usunięta', 'success');
    } catch (err) {
      console.error('Error deleting conversation:', err);
      showNotification('Nie udało się usunąć konwersacji', 'error');
    }
  }, [selectedConversation, showNotification]);

  /**
   * Funkcja przenosząca konwersację do innego folderu
   */
  const moveToFolder = useCallback(async (conversationId, targetFolder) => {
    try {
      const backendFolder = folderMap[targetFolder];
      if (!backendFolder) return;
      
      // Zapytania API zależne od folderu docelowego
      if (backendFolder === 'archived') {
        await MessagesService.archiveConversation(conversationId);
      } else if (backendFolder === 'trash') {
        await MessagesService.moveConversationToTrash(conversationId);
      } else {
        await MessagesService.moveConversationToFolder(conversationId, backendFolder);
      }
      
      // Aktualizacja listy konwersacji
      if (activeTab !== targetFolder) {
        setConversations(prevConversations => 
          prevConversations.filter(convo => convo.id !== conversationId)
        );
      } else {
        fetchConversations(); // Odświeżenie listy w aktualnym folderze
      }
      
      // Aktualizacja wybranej konwersacji
      if (selectedConversation && selectedConversation.id === conversationId) {
        if (activeTab !== targetFolder) {
          setSelectedConversation(null);
          setChatMessages([]);
        } else {
          setSelectedConversation(prev => ({ ...prev, folder: backendFolder }));
        }
      }
      
      showNotification(`Konwersacja przeniesiona do ${targetFolder}`, 'success');
    } catch (err) {
      console.error(`Error moving conversation to ${targetFolder}:`, err);
      showNotification(`Nie udało się przenieść konwersacji do ${targetFolder}`, 'error');
    }
  }, [activeTab, fetchConversations, folderMap, selectedConversation, showNotification]);

  /**
   * Obsługa wyszukiwania konwersacji
   */
  const handleSearch = useCallback(async (query) => {
    setSearchTerm(query);
    
    if (query.trim().length < 3) {
      // Jeśli zapytanie jest krótkie, pokaż standardową listę konwersacji
      fetchConversations();
      return;
    }
    
    try {
      setLoading(true);
      const backendFolder = folderMap[activeTab] || 'inbox';
      const response = await MessagesService.searchConversations(query, backendFolder);
      
      let searchResults = [];
      const data = Array.isArray(response) ? response : response.data;
      
      if (Array.isArray(data)) {
        searchResults = data.map(conversation => ({
          id: conversation._id,
          userId: conversation.user._id,
          userName: conversation.user.name || 'Nieznany użytkownik',
          lastMessage: {
            content: conversation.lastMessage?.content || '',
            date: new Date(conversation.lastMessage?.createdAt || Date.now()),
            isRead: conversation.lastMessage?.read || false,
          },
          unreadCount: conversation.unreadCount || 0,
          isStarred: conversation.starred || false,
          folder: conversation.folder || backendFolder,
        }));
      }
      
      setConversations(searchResults);
      setLoading(false);
    } catch (err) {
      console.error('Error searching conversations:', err);
      showNotification('Błąd podczas wyszukiwania', 'error');
      setLoading(false);
    }
  }, [activeTab, fetchConversations, folderMap, showNotification]);

  /**
   * Obsługa wysyłania odpowiedzi
   */
  const sendReply = useCallback(async (content, attachments) => {
    if ((!content.trim() && attachments.length === 0) || !selectedConversation) {
      return Promise.reject(new Error('Brak treści wiadomości lub nie wybrano konwersacji'));
    }
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      
      // Dodanie załączników do formularza
      attachments.forEach(attachment => {
        formData.append('attachments', attachment.file);
      });
      
      const response = await MessagesService.replyToConversation(selectedConversation.userId, formData);
      
      // Sprawdzamy czy mamy poprawną odpowiedź z serwera
      const responseData = response && response.data ? response.data : null;
      
      // Optymistyczna aktualizacja UI - dodanie nowej wiadomości do czatu
      const newMessage = {
        id: responseData && responseData._id ? responseData._id : `temp-${Date.now()}`,
        sender: 'currentUser', // Zakładamy, że to aktualne ID użytkownika
        senderName: 'Ja',
        content: content,
        timestamp: new Date(),
        isRead: true,
        isDelivered: true,
        isDelivering: false,
        attachments: attachments.map(attachment => ({
          id: `temp-${attachment.name}`,
          name: attachment.name,
          url: URL.createObjectURL(attachment.file),
          type: attachment.type.startsWith('image/') ? 'image' : 'file'
        }))
      };
      
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      
      showNotification('Wiadomość wysłana', 'success');
      return Promise.resolve();
    } catch (err) {
      console.error('Error sending reply:', err);
      showNotification('Nie udało się wysłać wiadomości', 'error');
      return Promise.reject(err);
    }
  }, [selectedConversation, showNotification]);

  // Wywołanie funkcji pobierającej konwersacje przy zmianie aktywnego folderu
  useEffect(() => {
    fetchConversations();
  }, [activeTab, fetchConversations]);
  
  // Pobieranie wiadomości z konwersacji przy wyborze konwersacji
  useEffect(() => {
    if (selectedConversation) {
      fetchConversationMessages();
    }
  }, [selectedConversation, fetchConversationMessages]);

  // Filtrowanie konwersacji na podstawie wyszukiwania (jeśli nie wykonano pełnego wyszukiwania)
  const filteredConversations = searchTerm.trim().length < 3 
    ? conversations.filter(conversation =>
        conversation.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : conversations;

  // Wybór konwersacji
  const selectConversation = useCallback((conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    setSelectedConversation(conversation);
  }, [conversations]);

  return {
    activeTab,
    conversations: filteredConversations,
    selectedConversation,
    chatMessages,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleSearch,
    selectConversation,
    toggleStar,
    deleteConversation,
    moveToFolder,
    sendReply,
    showNotification
  };
};

export default useConversations;