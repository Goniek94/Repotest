import { useState, useEffect, useCallback, useMemo } from 'react';
import MessagesService from '../../../../services/api/messages';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { FOLDER_MAP, DEFAULT_FOLDER } from '../../../../constants/messageFolders';

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
  
  // Pobranie aktualnego użytkownika z kontekstu
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;
  const { decreaseMessageCount } = useNotifications() || {};

  /**
   * Ujednolicona funkcja wyświetlająca powiadomienia
   */
  const showNotification = useCallback((message, type = 'info') => {
    if (typeof toast === 'function') {
      toast[type]?.(message) || toast(message);
    } else {
      debug(`[${type.toUpperCase()}] ${message}`);
    }
  }, []);

  /**
   * Pobieranie konwersacji z aktywnego folderu
   */
  // Pobieranie konwersacji z aktywnego folderu
  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Pobieranie listy konwersacji z określonego folderu
      const backendFolder = FOLDER_MAP[activeTab] || FOLDER_MAP[DEFAULT_FOLDER];
      
      debug(`Pobieranie konwersacji z folderu: ${backendFolder}`);
      
      // Bezpośrednie wywołanie API - zapewnia pobieranie rzeczywistych danych
      let response = await MessagesService.getConversationsList(backendFolder);

      debug('Otrzymana odpowiedź z API:', response);

      // Sprawdź czy odpowiedź jest poprawna
      if (!response || (!Array.isArray(response) && !Array.isArray(response.data))) {
        console.error('Nieprawidłowa odpowiedź z API:', response);
        throw new Error('Nieprawidłowa odpowiedź z API');
      }

      // Normalizacja odpowiedzi - może być bezpośrednio tablica lub w property data
      let data = Array.isArray(response) ? response : (Array.isArray(response.data) ? response.data : []);

      debug('Znormalizowane dane:', data);

      // Jeśli API konwersacji zwróci pustą tablicę, próbujemy fallbacku do zwykłych wiadomości
      if (Array.isArray(data) && data.length === 0) {
        debug('Brak konwersacji z API, próba pobrania wiadomości z folderu.');
        const messagesFallback = await MessagesService.getByFolder(backendFolder);

        if (Array.isArray(messagesFallback) && messagesFallback.length > 0) {
          const convMap = {};
          messagesFallback.forEach(msg => {
            const otherUser = (msg.sender?._id || msg.sender) === currentUserId ? msg.recipient : msg.sender;
            const userId = otherUser?._id || otherUser?.id;
            if (!userId) return;

            if (!convMap[userId]) {
              convMap[userId] = {
                _id: userId,
                user: otherUser,
                lastMessage: msg,
                unreadCount: msg.read ? 0 : 1,
                starred: msg.starred || false,
                folder: msg.folder || backendFolder,
              };
            } else {
              const existing = convMap[userId];
              const msgDate = new Date(msg.createdAt);
              const lastDate = new Date(existing.lastMessage.createdAt);
              if (msgDate > lastDate) {
                existing.lastMessage = msg;
              }
              if (!msg.read) {
                existing.unreadCount += 1;
              }
            }
          });
          data = Object.values(convMap);
          debug('Dane z fallbacku:', data);
        }
      }
      
      // Formatowanie konwersacji do jednolitego formatu
      const formattedConversations = data.map(conversation => {
        const userInfo = conversation.user || conversation.participant || conversation.partner || {};
        const userId =
          userInfo._id ||
          userInfo.id ||
          conversation.userId ||
          conversation.otherUserId ||
          conversation._id;

        return {
          id: conversation._id || userId,
          userId,
          userName: userInfo.name || userInfo.email || 'Nieznany użytkownik',
          lastMessage: {
            content: conversation.lastMessage?.content || '',
            date: new Date(conversation.lastMessage?.createdAt || conversation.lastMessage?.date || Date.now()),
            isRead: conversation.lastMessage?.read || false,
          },
          unreadCount: conversation.unreadCount || 0,
          isStarred: conversation.lastMessage?.starred || conversation.starred || false,
          folder: backendFolder,
          adInfo: conversation.adInfo || null,
        };
      });

      debug('Sformatowane konwersacje:', formattedConversations);
      
      setConversations(formattedConversations);
    } catch (err) {
      console.error('Błąd podczas pobierania konwersacji:', err);
      setError('Nie udało się pobrać konwersacji. Spróbuj ponownie później.');
      showNotification('Nie udało się pobrać konwersacji', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentUserId, FOLDER_MAP, showNotification]);

  /**
   * Pobieranie wiadomości z wybranej konwersacji
   */
  const fetchConversationMessages = useCallback(async () => {
    if (!selectedConversation || !selectedConversation.userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      debug(`Pobieranie wiadomości dla konwersacji z użytkownikiem ${selectedConversation.userId}`);
      
      const response = await MessagesService.getConversation(selectedConversation.userId);
      
      debug('Otrzymana odpowiedź z API dla wiadomości:', response);
      
      if (!response) {
        console.error('Brak odpowiedzi przy pobieraniu wiadomości');
        throw new Error('Nie udało się pobrać wiadomości z konwersacji');
      }
      
      let allMessages = [];
      
      // Obsługa różnych formatów odpowiedzi
      if (response.conversations) {
        // Format z grupowaniem według ogłoszeń
        debug('Format odpowiedzi: grupowanie według ogłoszeń');
        Object.values(response.conversations).forEach(convo => {
          if (convo.messages && Array.isArray(convo.messages)) {
            allMessages = [...allMessages, ...convo.messages];
          }
        });
      } else if (Array.isArray(response)) {
        // Bezpośrednia tablica wiadomości
        debug('Format odpowiedzi: bezpośrednia tablica wiadomości');
        allMessages = response;
      } else if (response.messages && Array.isArray(response.messages)) {
        // Wiadomości w property messages
        debug('Format odpowiedzi: wiadomości w property messages');
        allMessages = response.messages;
      } else if (response.data && Array.isArray(response.data)) {
        // Wiadomości w property data
        debug('Format odpowiedzi: wiadomości w property data');
        allMessages = response.data;
      }
      
      debug('Wszystkie wiadomości przed formatowaniem:', allMessages);
      
      // Formatowanie wiadomości do jednolitego formatu
      const formattedChatMessages = allMessages.map(msg => ({
        id: msg._id,
        sender: msg.sender?._id || msg.sender,
        senderName: msg.sender?.name || 'Nieznany użytkownik',
        content: msg.content || '',
        timestamp: new Date(msg.createdAt || msg.date || Date.now()),
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
      
      setChatMessages(formattedChatMessages);
      
      // Automatyczne oznaczenie jako przeczytane
      if (selectedConversation.unreadCount > 0) {
        markConversationAsRead(selectedConversation.id);
      }
    } catch (err) {
      console.error('Błąd podczas pobierania wiadomości:', err);
      showNotification('Nie udało się pobrać wiadomości z konwersacji', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedConversation, showNotification, conversations, decreaseMessageCount]);

  /**
   * Oznaczenie konwersacji jako przeczytanej
   */
  const markConversationAsRead = useCallback(async (conversationId) => {
    if (!conversationId) return;

    try {
      await MessagesService.markConversationAsRead(conversationId);

      const unreadBefore = conversations.find(c => c.id === conversationId)?.unreadCount || 0;
      if (unreadBefore > 0) {
        decreaseMessageCount(unreadBefore);
      }

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
      console.error('Błąd podczas oznaczania jako przeczytane:', err);
      showNotification('Nie udało się oznaczyć konwersacji jako przeczytanej', 'error');
    }
  }, [selectedConversation, showNotification]);

  /**
   * Oznaczenie konwersacji jako ważnej (gwiazdka)
   */
  const toggleStar = useCallback(async (conversationId) => {
    if (!conversationId) return;
    
    try {
      await MessagesService.toggleConversationStar(conversationId);
      
      const conversation = conversations.find(c => c.id === conversationId);
      const isCurrentlyStarred = conversation?.isStarred || false;
      
      // Aktualizacja stanu konwersacji
      setConversations(prevConversations => 
        prevConversations.map(convo => 
          convo.id === conversationId ? { ...convo, isStarred: !convo.isStarred } : convo
        )
      );
      
      // Aktualizacja wybranej konwersacji
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
      console.error('Błąd podczas aktualizacji statusu:', err);
      showNotification('Nie udało się zaktualizować statusu konwersacji', 'error');
    }
  }, [conversations, selectedConversation, showNotification]);

  /**
   * Usunięcie konwersacji
   */
  const deleteConversation = useCallback(async (conversationId) => {
    if (!conversationId) return;

    try {
      // Zamiast trwałego usuwania przenosimy konwersację do archiwum
      await MessagesService.archiveConversation(conversationId);

      // Usunięcie z listy konwersacji
      setConversations(prevConversations =>
        prevConversations.filter(convo => convo.id !== conversationId)
      );

      // Wyczyszczenie wybranej konwersacji jeśli była przeniesiona
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation(null);
        setChatMessages([]);
      }

      showNotification('Konwersacja przeniesiona do archiwum', 'success');
    } catch (err) {
      console.error('Błąd podczas przenoszenia do archiwum:', err);
      showNotification('Nie udało się przenieść do archiwum', 'error');
    }
  }, [selectedConversation, showNotification]);

  /**
   * Przeniesienie konwersacji do innego folderu
   */
  const moveToFolder = useCallback(async (conversationId, targetFolder) => {
    if (!conversationId || !targetFolder) return;
    
    try {
      const backendFolder = FOLDER_MAP[targetFolder];
      if (!backendFolder) return;
      
      // Wybór odpowiedniej metody API zależnie od folderu docelowego
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
      console.error('Błąd podczas przenoszenia:', err);
      showNotification(`Nie udało się przenieść konwersacji do ${targetFolder}`, 'error');
    }
  }, [activeTab, fetchConversations, FOLDER_MAP, selectedConversation, showNotification]);

  /**
   * Wyszukiwanie konwersacji
   */
  const handleSearch = useCallback(async (query) => {
    setSearchTerm(query);
    
    // Jeśli zapytanie jest krótkie, pokazujemy standardową listę
    if (!query || query.trim().length < 2) {
      fetchConversations();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const backendFolder = FOLDER_MAP[activeTab] || FOLDER_MAP[DEFAULT_FOLDER];
      const response = await MessagesService.searchConversations(query, backendFolder);
      
      // Normalizacja odpowiedzi
      const data = Array.isArray(response) ? response : (response.data || []);
      
      if (Array.isArray(data)) {
        const searchResults = data.map(conversation => ({
          id: conversation._id || conversation.user?._id,
          userId: conversation.user?._id || conversation._id,
          userName: conversation.user?.name || conversation.user?.email || 'Nieznany użytkownik',
          lastMessage: {
            content: conversation.lastMessage?.content || '',
            date: new Date(conversation.lastMessage?.createdAt || conversation.lastMessage?.date || Date.now()),
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
  }, [activeTab, fetchConversations, FOLDER_MAP, showNotification]);

  /**
   * Wysłanie odpowiedzi w konwersacji
   */
  const sendReply = useCallback(async (content, attachments = []) => {
    if ((!content || !content.trim()) && (!attachments || attachments.length === 0)) {
      return Promise.reject(new Error('Brak treści wiadomości'));
    }
    
    if (!selectedConversation || !selectedConversation.userId) {
      return Promise.reject(new Error('Nie wybrano konwersacji'));
    }
    
    try {
      debug('Wysyłanie odpowiedzi do:', selectedConversation.userId);
      debug('Treść:', content);
      debug('Liczba załączników:', attachments.length);
      const formData = new FormData();
      formData.append('content', content);
      
      // Dodanie załączników do formularza
      attachments.forEach(attachment => {
        formData.append('attachments', attachment.file || attachment);
      });
      
      const response = await MessagesService.replyToConversation(selectedConversation.userId, formData);
      
      // Optymistyczna aktualizacja UI - dodanie nowej wiadomości do czatu
      const newMessage = {
        id: response?.data?._id || `temp-${Date.now()}`,
        sender: currentUserId,
        senderName: user?.name || user?.email || 'Ja',
        content: content,
        timestamp: new Date(),
        isRead: true,
        isDelivered: true,
        isDelivering: false,
        attachments: attachments.map(attachment => ({
          id: `temp-${attachment.name}`,
          name: attachment.name,
          url: attachment.file ? URL.createObjectURL(attachment.file) : attachment.url,
          type: (attachment.file ? attachment.file.type : attachment.type) || 'application/octet-stream'
        }))
      };
      
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Aktualizacja ostatniej wiadomości w konwersacji
      setConversations(prevConversations => 
        prevConversations.map(convo => 
          convo.id === selectedConversation.id 
            ? { 
                ...convo, 
                lastMessage: {
                  content: content,
                  date: new Date(),
                  isRead: true
                } 
              }
            : convo
        )
      );
      
      setSelectedConversation(prev => ({
        ...prev,
        lastMessage: {
          content: content,
          date: new Date(),
          isRead: true
        }
      }));
      
      showNotification('Wiadomość wysłana', 'success');
      return Promise.resolve();
    } catch (err) {
      console.error('Błąd podczas wysyłania:', err);
      showNotification('Nie udało się wysłać wiadomości', 'error');
      return Promise.reject(err);
    }
  }, [selectedConversation, currentUserId, user, showNotification]);

  // Pobieranie konwersacji przy zmianie aktywnego folderu lub użytkownika
  // Celowo nie dodajemy fetchConversations do zależności, aby uniknąć
  // zbędnego ponownego tworzenia funkcji i potencjalnej pętli zapytań.
  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentUserId]);
  
  // Pobieranie wiadomości przy wyborze konwersacji
  useEffect(() => {
    if (selectedConversation) {
      fetchConversationMessages();
    }
  }, [selectedConversation, fetchConversationMessages]);

  // Filtrowanie konwersacji na podstawie wyszukiwania
  const filteredConversations = searchTerm.trim().length < 2 
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
