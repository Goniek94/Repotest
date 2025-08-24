import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import messagesApi from '../../../../services/api/messagesApi';
import useMessageActions from './useMessageActions';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { FOLDER_MAP, DEFAULT_FOLDER } from '../../../../contexts/constants/messageFolders';

/**
 * Hook zarządzający stanem i akcjami konwersacji
 * 
 * Zoptymalizowany i uproszczony hook do obsługi modelu konwersacji,
 * który jest preferowanym sposobem zarządzania wiadomościami.
 * 
 * @param {string} activeTab - aktywna zakładka (folder)
 * @returns {Object} - interfejs do zarządzania konwersacjami
 */
const useConversations = (activeTab) => {
  // Stan konwersacji
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeoutRef = useRef(null);
  
  // Pobranie aktualnego użytkownika z kontekstu
  const { user } = useAuth();
  
  // Memoize currentUserId to prevent unnecessary re-renders
  const currentUserId = useMemo(() => {
    const userId = user?._id || user?.id;
    console.log('🔄 useConversations - currentUserId:', userId);
    console.log('🔄 useConversations - user object:', user);
    return userId;
  }, [user?._id, user?.id]);
  
  const notificationContext = useNotifications();
  const decreaseMessageCount = notificationContext?.decreaseMessageCount;

  /**
   * Ujednolicona funkcja wyświetlająca powiadomienia
   * Memoized to prevent recreation on every render
   */
  const showNotification = useCallback((message, type = 'info') => {
    if (typeof toast === 'function') {
      toast[type]?.(message) || toast(message);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }, []);

  // Memoize backend folder to prevent recalculation
  const backendFolder = useMemo(() => 
    FOLDER_MAP[activeTab] || FOLDER_MAP[DEFAULT_FOLDER], 
    [activeTab]
  );

  /**
   * Pobieranie konwersacji z aktywnego folderu - PRAWDZIWE API
   */
  const fetchConversations = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 fetchConversations - Pobieranie konwersacji z folderu: ${backendFolder}`);
      console.log(`🔄 fetchConversations - currentUserId: ${currentUserId}`);
      
      // Wywołanie prawdziwego API
      const response = await messagesApi.getConversations(backendFolder, { signal });
      
      console.log('✅ fetchConversations - Otrzymana odpowiedź z API:', response);
      console.log('✅ fetchConversations - Typ odpowiedzi:', typeof response);
      console.log('✅ fetchConversations - Czy jest tablicą:', Array.isArray(response));
      console.log('✅ fetchConversations - Długość:', response?.length);
      
      // API już zwraca sformatowane dane
      if (Array.isArray(response)) {
        console.log('✅ fetchConversations - Ustawianie konwersacji:', response);
        setConversations(response);
      } else {
        console.log('❌ fetchConversations - Odpowiedź nie jest tablicą, ustawianie pustej tablicy');
        setConversations([]);
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('⏹️ fetchConversations - Request was aborted');
        return;
      }
      console.error('❌ fetchConversations - Błąd podczas pobierania konwersacji:', err);
      setError('Nie udało się pobrać konwersacji. Spróbuj ponownie później.');
      showNotification('Nie udało się pobrać konwersacji', 'error');
    } finally {
      setLoading(false);
    }
  }, [backendFolder, showNotification, currentUserId]);

  /**
   * Oznaczenie konwersacji jako przeczytanej
   */
  const markConversationAsRead = useCallback(async (conversationId) => {
    if (!conversationId) return;

    try {
      await messagesApi.markConversationAsRead(conversationId);

      setConversations(prev => {
        const unreadBefore = prev.find(c => c.id === conversationId)?.unreadCount || 0;
        if (unreadBefore > 0 && decreaseMessageCount) {
          decreaseMessageCount(unreadBefore);
        }
        return prev.map(convo =>
          convo.id === conversationId
            ? { ...convo, unreadCount: 0, lastMessage: { ...convo.lastMessage, isRead: true } }
            : convo
        );
      });

      setSelectedConversation(prev => {
        if (prev && prev.id === conversationId) {
          return { ...prev, unreadCount: 0, lastMessage: { ...prev.lastMessage, isRead: true } };
        }
        return prev;
      });
    } catch (err) {
      console.error('Błąd podczas oznaczania jako przeczytane:', err);
      showNotification('Nie udało się oznaczyć konwersacji jako przeczytanej', 'error');
    }
  }, [decreaseMessageCount, showNotification]);

  /**
   * Pobieranie wiadomości z wybranej konwersacji
   */
  const fetchConversationMessages = useCallback(async (conversation, signal) => {
    if (!conversation || !conversation.userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Pobieranie wiadomości dla konwersacji z użytkownikiem ${conversation.userId}`);
      
      const response = await messagesApi.getConversation(conversation.userId, { signal });
      
      console.log('Otrzymana odpowiedź z API dla wiadomości:', response);
      
      if (!response) {
        console.error('Brak odpowiedzi przy pobieraniu wiadomości');
        throw new Error('Nie udało się pobrać wiadomości z konwersacji');
      }
      
      let allMessages = [];
      
      // Obsługa różnych formatów odpowiedzi
      if (response.conversations) {
        // Format z grupowaniem według ogłoszeń
        console.log('Format odpowiedzi: grupowanie według ogłoszeń');
        Object.values(response.conversations).forEach(convo => {
          if (convo.messages && Array.isArray(convo.messages)) {
            allMessages = [...allMessages, ...convo.messages];
          }
        });
      } else if (Array.isArray(response)) {
        // Bezpośrednia tablica wiadomości
        console.log('Format odpowiedzi: bezpośrednia tablica wiadomości');
        allMessages = response;
      } else if (response.messages && Array.isArray(response.messages)) {
        // Wiadomości w property messages
        console.log('Format odpowiedzi: wiadomości w property messages');
        allMessages = response.messages;
      } else if (response.data && Array.isArray(response.data)) {
        // Wiadomości w property data
        console.log('Format odpowiedzi: wiadomości w property data');
        allMessages = response.data;
      }
      
      console.log('Wszystkie wiadomości przed formatowaniem:', allMessages);
      
        // Sprawdź czy dane są już znormalizowane (z messagesApi.transformConversationResponse)
        const isAlreadyNormalized = allMessages.length > 0 && 
          typeof allMessages[0].id === 'string' && 
          typeof allMessages[0].sender?.id === 'string';

        console.log('🔍 Sprawdzanie formatu danych:');
        console.log('🔍 isAlreadyNormalized:', isAlreadyNormalized);
        if (allMessages.length > 0) {
          console.log('🔍 Przykład pierwszej wiadomości:', allMessages[0]);
          console.log('🔍 typeof msg.id:', typeof allMessages[0].id);
          console.log('🔍 typeof msg.sender?.id:', typeof allMessages[0].sender?.id);
        }

        // Formatowanie wiadomości do jednolitego formatu
        const formattedChatMessages = allMessages.map(msg => {
          if (isAlreadyNormalized) {
            // Dane już znormalizowane przez messagesApi - używaj bezpośrednio
            return {
              id: msg.id,
              sender: msg.sender.id, // To już jest string ID
              senderName: msg.sender.name || 'Nieznany użytkownik',
              content: msg.content || '',
              createdAt: msg.createdAt,
              timestamp: new Date(msg.createdAt),
              isRead: msg.read || false,
              isDelivered: true,
              isDelivering: false,
              attachments: (msg.attachments || []).map(att => ({
                id: att.id || att._id,
                name: att.name || att.originalname || 'Załącznik',
                url: att.path || att.url,
                type: att.mimetype || att.type || 'application/octet-stream'
              }))
            };
          } else {
            // Surowe dane z bazy - formatuj jak wcześniej
            return {
              id: msg._id,
              sender: msg.sender?._id || msg.sender,
              senderName: msg.sender?.name || 'Nieznany użytkownik',
              content: msg.content || '',
              createdAt: msg.createdAt || msg.date,
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
            };
          }
        });
      
      // Sortowanie wiadomości według czasu
      formattedChatMessages.sort((a, b) => a.timestamp - b.timestamp);
      
      setChatMessages(formattedChatMessages);
      
      // Usunięto automatyczne oznaczanie jako przeczytane
      // Teraz wiadomości będą oznaczane jako przeczytane dopiero po jawnym działaniu użytkownika
      // if (conversation.unreadCount > 0) {
      //   markConversationAsRead(conversation.id);
      // }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      console.error('Błąd podczas pobierania wiadomości:', err);
      showNotification('Nie udało się pobrać wiadomości z konwersacji', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  /**
   * Oznaczenie konwersacji jako ważnej (gwiazdka)
   */
  const toggleStar = useCallback(async (conversationId) => {
    if (!conversationId) return;
    
    try {
      await messagesApi.toggleConversationStar(conversationId);
      
      const conversation = conversations.find(c => c.id === conversationId);
      const isCurrentlyStarred = conversation?.isStarred || false;
      
      // Aktualizacja stanu konwersacji
      setConversations(prevConversations => 
        prevConversations.map(convo => 
          convo.id === conversationId ? { ...convo, isStarred: !convo.isStarred } : convo
        )
      );
      
      // Aktualizacja wybranej konwersacji
      setSelectedConversation(prev => {
        if (prev && prev.id === conversationId) {
          return { ...prev, isStarred: !prev.isStarred };
        }
        return prev;
      });
      
      showNotification(
        `Konwersacja ${isCurrentlyStarred ? 'usunięta z' : 'dodana do'} ważnych`, 
        'success'
      );
    } catch (err) {
      console.error('Błąd podczas aktualizacji statusu:', err);
      showNotification('Nie udało się zaktualizować statusu konwersacji', 'error');
    }
  }, [conversations, showNotification]);

  /**
   * Usunięcie konwersacji
   */
  const deleteConversation = useCallback(async (conversationId) => {
    if (!conversationId) return;

    try {
      // Usuwamy konwersację, przenosząc ją do kosza
      await messagesApi.deleteConversation(conversationId);

      // Usunięcie z listy konwersacji
      setConversations(prevConversations =>
        prevConversations.filter(convo => convo.id !== conversationId)
      );

      // Wyczyszczenie wybranej konwersacji jeśli była przeniesiona
      setSelectedConversation(prev => {
        if (prev && prev.id === conversationId) {
          setChatMessages([]);
          return null;
        }
        return prev;
      });

      showNotification('Konwersacja usunięta', 'success');
    } catch (err) {
      console.error('Błąd podczas usuwania konwersacji:', err);
      showNotification('Nie udało się usunąć konwersacji', 'error');
    }
  }, [showNotification]);

  /**
   * Przeniesienie konwersacji do innego folderu
   */
  const moveToFolder = useCallback(async (conversationId, targetFolder) => {
    if (!conversationId || !targetFolder) return;
    
    try {
      const targetBackendFolder = FOLDER_MAP[targetFolder];
      if (!targetBackendFolder) return;
      
      // Wybór odpowiedniej metody API zależnie od folderu docelowego
      if (targetBackendFolder === 'archived') {
        await messagesApi.archiveConversation(conversationId);
      } else if (targetBackendFolder === 'trash') {
        await messagesApi.deleteConversation(conversationId);
      } else {
        await messagesApi.moveConversationToFolder(conversationId, targetBackendFolder);
      }
      
      // Aktualizacja listy konwersacji
      if (activeTab !== targetFolder) {
        // Remove from current list if moving to different folder
        setConversations(prevConversations =>
          prevConversations.filter(convo => convo.id !== conversationId)
        );
      } else {
        setConversations(prevConversations =>
          prevConversations.map(convo =>
            convo.id === conversationId
              ? { ...convo, folder: targetBackendFolder }
              : convo
          )
        );
      }
      
      // Aktualizacja wybranej konwersacji
      setSelectedConversation(prev => {
        if (prev && prev.id === conversationId) {
          if (activeTab !== targetFolder) {
            setChatMessages([]);
            return null;
          } else {
            return { ...prev, folder: targetBackendFolder };
          }
        }
        return prev;
      });
      
      showNotification(`Konwersacja przeniesiona do ${targetFolder}`, 'success');
    } catch (err) {
      console.error('Błąd podczas przenoszenia:', err);
      showNotification(`Nie udało się przenieść konwersacji do ${targetFolder}`, 'error');
    }
  }, [activeTab, showNotification]);

  /**
   * Wyszukiwanie konwersacji
   */
  const handleSearch = useCallback((query) => {
    setSearchTerm(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      // Jeśli zapytanie jest krótkie, pokazujemy standardową listę
      if (!query || query.trim().length < 2) {
        const controller = new AbortController();
        fetchConversations(controller.signal);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await messagesApi.searchMessages(query, { folder: backendFolder });

        // Normalizacja odpowiedzi
        const data = Array.isArray(response) ? response : (response.data || []);

        if (Array.isArray(data)) {
          const searchResults = data.map(conversation => ({
            id: conversation._id || conversation.user?._id,
            userId: conversation.user?._id || conversation._id,
            userName: conversation.user?.name || conversation.user?.email || 'Nieznany użytkownik',
            lastMessage: {
              content: conversation.lastMessage?.content || '',
              date: conversation.lastMessage?.createdAt || conversation.lastMessage?.date 
                ? new Date(conversation.lastMessage.createdAt || conversation.lastMessage.date)
                : new Date(),
              isRead: conversation.lastMessage?.read || false,
            },
            unreadCount: conversation.unreadCount || 0,
            isStarred: conversation.starred || conversation.lastMessage?.starred || false,
            folder: conversation.folder || backendFolder,
            adInfo: conversation.adInfo || null,
          }));

          setConversations(searchResults);
        }
      } catch (err) {
        console.error('Błąd podczas wyszukiwania:', err);
        showNotification('Błąd podczas wyszukiwania', 'error');
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [backendFolder, showNotification, fetchConversations]);

  // Memoize filtered conversations to prevent unnecessary recalculations
  const filteredConversations = useMemo(() => {
    if (searchTerm.trim().length >= 2) {
      return conversations; // Search results are already filtered by the API
    }
    
    if (!searchTerm.trim()) {
      return conversations;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return conversations.filter(conversation =>
      conversation.userName?.toLowerCase().includes(lowerSearchTerm) ||
      conversation.lastMessage?.content?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [conversations, searchTerm]);

  // Wybór konwersacji
  const selectConversation = useCallback((conversationId) => {
    console.log('🔄 selectConversation wywołane z ID:', conversationId);
    const conversation = conversations.find(c => c.id === conversationId || c.userId === conversationId);
    if (!conversation) {
      console.log('❌ Nie znaleziono konwersacji o ID:', conversationId);
      return;
    }
    
    console.log('✅ Znaleziono konwersację:', conversation);
    setSelectedConversation(conversation);
  }, [conversations]);

  // Stałe zależności dla useMessageActions
  const messageActionsConfig = useMemo(() => ({
    selectedConversation,
    setSelectedConversation,
    setConversations,
    setChatMessages,
    currentUserId,
    user,
    showNotification
  }), [selectedConversation, currentUserId, user, showNotification]);

  const { sendReply, editMessage, deleteMessage, archiveMessage } = useMessageActions(messageActionsConfig);

  // Czyszczenie oczekującego timeoutu wyszukiwania przy odmontowaniu
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Pobieranie konwersacji przy zmianie aktywnego folderu lub użytkownika
  useEffect(() => {
    const controller = new AbortController();
    
    // Użyj istniejącej funkcji fetchConversations zamiast duplikowania logiki
    fetchConversations(controller.signal);
    
    // Reset search when changing tabs
    setSearchTerm('');
    
    return () => {
      controller.abort();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [activeTab, backendFolder, fetchConversations]);
  
  // Pobieranie wiadomości przy wyborze konwersacji
  // Fixed: Proper dependency management and AbortController usage
  useEffect(() => {
    console.log('🔄 useEffect dla selectedConversation:', selectedConversation);
    
    if (!selectedConversation?.id && !selectedConversation?.userId) {
      console.log('❌ Brak selectedConversation - czyszczenie wiadomości');
      setChatMessages([]);
      return;
    }
    
    const controller = new AbortController();
    
    const loadMessages = async () => {
      // Użyj userId lub id jako fallback
      const userIdToUse = selectedConversation.userId || selectedConversation.id;
      
      if (!userIdToUse) {
        console.log('❌ Brak userId do pobrania wiadomości');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔄 Pobieranie wiadomości dla konwersacji z użytkownikiem ${userIdToUse}`);
        console.log('📋 Pełny obiekt selectedConversation:', selectedConversation);
        
        const response = await messagesApi.getConversation(userIdToUse, { signal: controller.signal });
        
        console.log('✅ Otrzymana odpowiedź z API dla wiadomości:', response);
        
        if (!response) {
          console.error('❌ Brak odpowiedzi przy pobieraniu wiadomości');
          throw new Error('Nie udało się pobrać wiadomości z konwersacji');
        }
        
        let allMessages = [];
        
        // Obsługa różnych formatów odpowiedzi
        if (response.conversations) {
          // Format z grupowaniem według ogłoszeń
          console.log('📁 Format odpowiedzi: grupowanie według ogłoszeń');
          Object.values(response.conversations).forEach(convo => {
            if (convo.messages && Array.isArray(convo.messages)) {
              allMessages = [...allMessages, ...convo.messages];
            }
          });
        } else if (Array.isArray(response)) {
          // Bezpośrednia tablica wiadomości
          console.log('📁 Format odpowiedzi: bezpośrednia tablica wiadomości');
          allMessages = response;
        } else if (response.messages && Array.isArray(response.messages)) {
          // Wiadomości w property messages
          console.log('📁 Format odpowiedzi: wiadomości w property messages');
          allMessages = response.messages;
        } else if (response.data && Array.isArray(response.data)) {
          // Wiadomości w property data
          console.log('📁 Format odpowiedzi: wiadomości w property data');
          allMessages = response.data;
        }
        
        console.log(`📨 Znaleziono ${allMessages.length} wiadomości przed formatowaniem:`, allMessages);
        
        if (allMessages.length === 0) {
          console.log('⚠️ Brak wiadomości w odpowiedzi API');
          setChatMessages([]);
          return;
        }
        
        // Sprawdź czy dane są już znormalizowane (z messagesApi.transformConversationResponse)
        const isAlreadyNormalized = allMessages.length > 0 && 
          typeof allMessages[0].id === 'string' && 
          typeof allMessages[0].sender?.id === 'string';

        // Formatowanie wiadomości do jednolitego formatu
        const formattedChatMessages = allMessages.map(msg => {
          if (isAlreadyNormalized) {
            // Dane już znormalizowane przez messagesApi - używaj bezpośrednio
            return {
              id: msg.id,
              sender: msg.sender.id,
              senderName: msg.sender.name || 'Nieznany użytkownik',
              content: msg.content || '',
              createdAt: msg.createdAt,
              timestamp: new Date(msg.createdAt),
              isRead: msg.read || false,
              isDelivered: true,
              isDelivering: false,
              attachments: (msg.attachments || []).map(att => ({
                id: att.id || att._id,
                name: att.name || att.originalname || 'Załącznik',
                url: att.path || att.url,
                type: att.mimetype || att.type || 'application/octet-stream'
              }))
            };
          } else {
            // Surowe dane z bazy - formatuj jak wcześniej
            return {
              id: msg._id,
              sender: msg.sender?._id || msg.sender,
              senderName: msg.sender?.name || 'Nieznany użytkownik',
              content: msg.content || '',
              createdAt: msg.createdAt || msg.date,
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
            };
          }
        });
        
        // Sortowanie wiadomości według czasu
        formattedChatMessages.sort((a, b) => a.timestamp - b.timestamp);
        
        console.log(`✅ Sformatowano ${formattedChatMessages.length} wiadomości:`, formattedChatMessages);
        
        setChatMessages(formattedChatMessages);
        
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('⏹️ Request was aborted');
          return;
        }
        console.error('💥 Błąd podczas pobierania wiadomości:', err);
        showNotification('Nie udało się pobrać wiadomości z konwersacji', 'error');
        setChatMessages([]); // Wyczyść wiadomości w przypadku błędu
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
    
    return () => {
      controller.abort();
    };
  }, [selectedConversation?.id, selectedConversation?.userId, showNotification]);

  // Memoize the return object to prevent unnecessary re-renders of consuming components
  return useMemo(() => ({
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
    editMessage,
    deleteMessage,
    archiveMessage,
    sendReply,
    showNotification,
    markConversationAsRead
  }), [
    activeTab,
    filteredConversations,
    selectedConversation,
    chatMessages,
    loading,
    error,
    searchTerm,
    handleSearch,
    selectConversation,
    toggleStar,
    deleteConversation,
    moveToFolder,
    editMessage,
    deleteMessage,
    archiveMessage,
    sendReply,
    showNotification,
    markConversationAsRead
  ]);
};

export default useConversations;
