import apiClient from './client.js';

/**
 * 🚀 MESSAGES API - Kompletny service dla systemu wiadomości
 * Dopasowany do backendu z pełną funkcjonalnością
 */
class MessagesApi {
  constructor() {
    this.baseUrl = '/api/messages';
  }

  // ========== KONWERSACJE ==========

  /**
   * Pobiera listę konwersacji użytkownika
   * @param {string} folder - Folder (inbox, sent, starred, archived, trash)
   * @param {Object} options - Opcje filtrowania
   */
  async getConversations(folder = 'inbox', options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (folder && folder !== 'inbox') {
        params.append('folder', folder);
      }
      
      if (options.search) {
        params.append('search', options.search);
      }
      
      if (options.unreadOnly) {
        params.append('unreadOnly', 'true');
      }
      
      if (options.starredOnly) {
        params.append('starredOnly', 'true');
      }
      
      if (options.hasAttachments) {
        params.append('hasAttachments', 'true');
      }
      
      if (options.limit) {
        params.append('limit', options.limit);
      }
      
      if (options.offset) {
        params.append('offset', options.offset);
      }

      const url = `${this.baseUrl}/conversations${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get(url);
      
      return this.transformConversationsResponse(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania konwersacji:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Pobiera konwersację z konkretnym użytkownikiem (opcjonalnie dla konkretnego ogłoszenia)
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje paginacji i filtrowania
   */
  async getConversation(userId, options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) {
        params.append('limit', options.limit);
      }
      
      if (options.offset) {
        params.append('offset', options.offset);
      }
      
      if (options.before) {
        params.append('before', options.before);
      }

      // 🔥 NOWE: Dodaj parametr ogłoszenia jeśli jest dostępny
      if (options.adId) {
        params.append('adId', options.adId);
      }

      const url = `${this.baseUrl}/conversation/${userId}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get(url);
      
      return this.transformConversationResponse(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania konwersacji:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Wyszukuje konwersacje
   * @param {string} query - Zapytanie wyszukiwania
   * @param {string} folder - Folder do przeszukania
   */
  async searchConversations(query, folder = 'all') {
    try {
      const params = new URLSearchParams({
        query,
        folder
      });

      const response = await apiClient.get(`${this.baseUrl}/conversations/search?${params.toString()}`);
      return this.transformConversationsResponse(response.data);
    } catch (error) {
      console.error('Błąd podczas wyszukiwania konwersacji:', error);
      throw this.handleError(error);
    }
  }

  // ========== WYSYŁANIE WIADOMOŚCI ==========

  /**
   * Odpowiada w konwersacji z użytkownikiem
   * @param {string} userId - ID użytkownika
   * @param {string} content - Treść wiadomości
   * @param {Array} attachments - Załączniki
   * @param {string} adId - ID ogłoszenia (opcjonalne)
   */
  async replyToConversation(userId, content, attachments = [], adId = null) {
    try {
      const formData = new FormData();
      formData.append('content', content);
      
      // Dodaj adId jeśli jest dostępne
      if (adId && adId !== 'no-ad') {
        formData.append('adId', adId);
      }
      
      // Dodaj załączniki
      attachments.forEach((attachment, index) => {
        if (attachment.file) {
          formData.append('attachments', attachment.file);
        }
      });

      const response = await apiClient.post(`${this.baseUrl}/conversation/${userId}/reply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Błąd podczas odpowiadania w konwersacji:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Wysyła nową wiadomość do użytkownika
   * @param {string} userId - ID użytkownika
   * @param {string} subject - Temat wiadomości
   * @param {string} content - Treść wiadomości
   * @param {Array} attachments - Załączniki
   */
  async sendMessageToUser(userId, subject, content, attachments = []) {
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('content', content);
      
      attachments.forEach((attachment) => {
        if (attachment.file) {
          formData.append('attachments', attachment.file);
        }
      });

      const response = await apiClient.post(`${this.baseUrl}/send-to-user/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości do użytkownika:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Wysyła wiadomość do właściciela ogłoszenia
   * @param {string} adId - ID ogłoszenia
   * @param {string} subject - Temat wiadomości
   * @param {string} content - Treść wiadomości
   * @param {Array} attachments - Załączniki
   */
  async sendMessageToAd(adId, subject, content, attachments = []) {
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('content', content);
      
      attachments.forEach((attachment) => {
        if (attachment.file) {
          formData.append('attachments', attachment.file);
        }
      });

      const response = await apiClient.post(`${this.baseUrl}/send-to-ad/${adId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości do ogłoszenia:', error);
      throw this.handleError(error);
    }
  }

  // ========== ZARZĄDZANIE KONWERSACJAMI ==========

  /**
   * Oznacza konwersację jako przeczytaną
   * @param {string} userId - ID użytkownika
   */
  async markConversationAsRead(userId) {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/conversation/${userId}/read`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas oznaczania konwersacji jako przeczytanej:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Przełącza gwiazdkę konwersacji
   * @param {string} userId - ID użytkownika
   */
  async toggleConversationStar(userId) {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/conversation/${userId}/star`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas przełączania gwiazdki konwersacji:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Archiwizuje konwersację
   * @param {string} userId - ID użytkownika
   */
  async archiveConversation(userId) {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/conversation/${userId}/archive`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas archiwizowania konwersacji:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Przywraca konwersację z archiwum
   * @param {string} userId - ID użytkownika
   */
  async unarchiveConversation(userId) {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/conversation/${userId}/unarchive`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas przywracania konwersacji z archiwum:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Usuwa konwersację
   * @param {string} userId - ID użytkownika
   */
  async deleteConversation(userId) {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/conversation/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas usuwania konwersacji:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Przenosi konwersację do folderu
   * @param {string} userId - ID użytkownika
   * @param {string} folder - Docelowy folder
   */
  async moveConversationToFolder(userId, folder) {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/conversation/${userId}/move`, {
        folder
      });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas przenoszenia konwersacji:', error);
      throw this.handleError(error);
    }
  }

  // ========== ZARZĄDZANIE POJEDYNCZYMI WIADOMOŚCIAMI ==========

  /**
   * Pobiera wiadomości z folderu (dla kompatybilności wstecznej)
   * @param {string} folder - Folder (inbox, sent, starred, archived, trash)
   */
  async getByFolder(folder = 'inbox') {
    return this.getConversations(folder);
  }

  /**
   * Pobiera pojedynczą wiadomość (alias dla getMessage)
   * @param {string} messageId - ID wiadomości
   */
  async getById(messageId) {
    return this.getMessage(messageId);
  }

  /**
   * Wysyła wiadomość (uniwersalna funkcja)
   * @param {Object} data - Dane wiadomości
   */
  async send(data) {
    if (data.adId) {
      return this.sendMessageToAd(data.adId, data.subject, data.content, data.attachments);
    } else if (data.recipient) {
      return this.sendMessageToUser(data.recipient, data.subject, data.content, data.attachments);
    } else {
      throw new Error('Brak odbiorcy wiadomości');
    }
  }

  /**
   * Pobiera pojedynczą wiadomość
   * @param {string} messageId - ID wiadomości
   */
  async getMessage(messageId) {
    try {
      const response = await apiClient.get(`${this.baseUrl}/message/${messageId}`);
      return this.transformMessageResponse(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania wiadomości:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Oznacza wiadomość jako przeczytaną (alias)
   * @param {string} messageId - ID wiadomości
   */
  async markAsRead(messageId) {
    return this.markMessageAsRead(messageId);
  }

  /**
   * Przełącza gwiazdkę wiadomości (alias)
   * @param {string} messageId - ID wiadomości
   */
  async toggleStar(messageId) {
    return this.toggleMessageStar(messageId);
  }

  /**
   * Usuwa wiadomość (alias)
   * @param {string} messageId - ID wiadomości
   */
  async delete(messageId) {
    return this.deleteMessage(messageId);
  }

  /**
   * Oznacza wiadomość jako przeczytaną
   * @param {string} messageId - ID wiadomości
   */
  async markMessageAsRead(messageId) {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/read/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas oznaczania wiadomości jako przeczytanej:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Przełącza gwiazdkę wiadomości
   * @param {string} messageId - ID wiadomości
   */
  async toggleMessageStar(messageId) {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/star/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas przełączania gwiazdki wiadomości:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Archiwizuje wiadomość
   * @param {string} messageId - ID wiadomości
   */
  async archiveMessage(messageId) {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/archive/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas archiwizowania wiadomości:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Edytuje wiadomość
   * @param {string} messageId - ID wiadomości
   * @param {string} content - Nowa treść wiadomości
   */
  async editMessage(messageId, content) {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${messageId}`, {
        content: content
      });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas edycji wiadomości:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Cofnij wiadomość (usuwa dla wszystkich)
   * @param {string} messageId - ID wiadomości
   */
  async unsendMessage(messageId) {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${messageId}/unsend`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas cofania wiadomości:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Usuwa wiadomość
   * @param {string} messageId - ID wiadomości
   */
  async deleteMessage(messageId) {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas usuwania wiadomości:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Usuwa wiele wiadomości
   * @param {Array} messageIds - Tablica ID wiadomości
   */
  async deleteMessages(messageIds) {
    try {
      const promises = messageIds.map(id => this.deleteMessage(id));
      const results = await Promise.all(promises);
      return {
        success: true,
        deletedCount: results.length,
        results
      };
    } catch (error) {
      console.error('Błąd podczas usuwania wiadomości:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Archiwizuje wiele wiadomości
   * @param {Array} messageIds - Tablica ID wiadomości
   */
  async archiveMessages(messageIds) {
    try {
      const promises = messageIds.map(id => this.archiveMessage(id));
      const results = await Promise.all(promises);
      return {
        success: true,
        archivedCount: results.length,
        results
      };
    } catch (error) {
      console.error('Błąd podczas archiwizowania wiadomości:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Oznacza wiele wiadomości gwiazdką
   * @param {Array} messageIds - Tablica ID wiadomości
   */
  async starMessages(messageIds) {
    try {
      const promises = messageIds.map(id => this.toggleMessageStar(id));
      const results = await Promise.all(promises);
      return {
        success: true,
        starredCount: results.length,
        results
      };
    } catch (error) {
      console.error('Błąd podczas oznaczania gwiazdką:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Oznacza wiele wiadomości jako przeczytane
   * @param {Array} messageIds - Tablica ID wiadomości
   */
  async markMessagesAsRead(messageIds) {
    try {
      const promises = messageIds.map(id => this.markMessageAsRead(id));
      const results = await Promise.all(promises);
      return {
        success: true,
        readCount: results.length,
        results
      };
    } catch (error) {
      console.error('Błąd podczas oznaczania jako przeczytane:', error);
      throw this.handleError(error);
    }
  }

  // ========== STATYSTYKI ==========

  /**
   * Pobiera liczbę nieprzeczytanych wiadomości
   */
  async getUnreadCount() {
    try {
      const response = await apiClient.get(`${this.baseUrl}/unread-count`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania liczby nieprzeczytanych wiadomości:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Pobiera sugestie użytkowników do wiadomości
   * @param {string} query - Zapytanie wyszukiwania
   */
  async getUserSuggestions(query = '') {
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : '';
      const response = await apiClient.get(`${this.baseUrl}/users/suggestions${params}`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania sugestii użytkowników:', error);
      throw this.handleError(error);
    }
  }

  // ========== WYSZUKIWANIE ==========

  /**
   * Wyszukuje wiadomości
   * @param {string} query - Zapytanie wyszukiwania
   * @param {Object} filters - Filtry wyszukiwania
   */
  async searchMessages(query, filters = {}) {
    try {
      const params = new URLSearchParams({ query });
      
      if (filters.folder) {
        params.append('folder', filters.folder);
      }
      
      if (filters.sender) {
        params.append('sender', filters.sender);
      }
      
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      
      if (filters.hasAttachments) {
        params.append('hasAttachments', 'true');
      }

      const response = await apiClient.get(`${this.baseUrl}/search?${params.toString()}`);
      return this.transformMessagesResponse(response.data);
    } catch (error) {
      console.error('Błąd podczas wyszukiwania wiadomości:', error);
      throw this.handleError(error);
    }
  }

  // ========== TRANSFORMACJE DANYCH ==========

  /**
   * Transformuje odpowiedź z listą konwersacji
   */
  transformConversationsResponse(data) {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(conversation => {
      // Sprawdź czy mamy dane użytkownika
      const user = conversation.user || {};
      const lastMessage = conversation.lastMessage || {};
      
      // 🔥 NOWE: Użyj ID użytkownika + ogłoszenie jako ID konwersacji
      const userId = user._id || user.id;
      const adId = conversation.adInfo ? 
        (conversation.adInfo._id || conversation.adInfo.id) : 
        'no-ad';
      
      // Unikalny ID konwersacji: użytkownik:ogłoszenie
      const conversationId = `${userId}:${adId}`;
      
      console.log('🔄 messagesApi - transformConversationsResponse - przetwarzam konwersację:', {
        originalConversation: conversation,
        userId: userId,
        adId: adId,
        conversationId: conversationId,
        userName: user.name || user.email
      });
      
      return {
        id: conversationId, // 🔥 NOWE: Unikalny ID konwersacji
        userId: userId, // ID użytkownika do pobierania szczegółów
        adId: adId === 'no-ad' ? null : adId, // ID ogłoszenia (null jeśli brak)
        userName: user.name || user.email || 'Nieznany użytkownik',
        userEmail: user.email || '',
        lastMessage: {
          id: lastMessage._id,
          content: lastMessage.content || lastMessage.subject || '',
          date: lastMessage.createdAt || lastMessage.date || new Date().toISOString(),
          type: this.getMessageType(lastMessage),
          isFromMe: lastMessage.sender && lastMessage.sender._id ? 
            lastMessage.sender._id.toString() === conversation.currentUserId : false,
          isRead: lastMessage.read || false
        },
        unreadCount: conversation.unreadCount || 0,
        isStarred: lastMessage.starred || false,
        isArchived: lastMessage.archived || false,
        isPinned: false, // Backend nie ma tego pola, można dodać później
        isOnline: false, // Backend nie ma tego pola, można dodać później
        hasAttachments: lastMessage.attachments && lastMessage.attachments.length > 0,
        adInfo: conversation.adInfo ? {
          id: conversation.adInfo._id || conversation.adInfo.id,
          headline: conversation.adInfo.headline,
          brand: conversation.adInfo.brand,
          model: conversation.adInfo.model,
          title: conversation.adInfo.headline || `${conversation.adInfo.brand} ${conversation.adInfo.model}`.trim()
        } : null,
        participantCount: 2, // Zawsze 2 w konwersacji 1-na-1
        lastMessageRead: lastMessage.read || false
      };
    });
  }

  /**
   * Transformuje odpowiedź z konwersacją
   */
  transformConversationResponse(data) {
    console.log('🔄 messagesApi - transformConversationResponse - otrzymane dane:', data);
    
    if (!data) {
      console.log('❌ Brak danych konwersacji');
      return {
        messages: [],
        user: null,
        hasMore: false
      };
    }

    // Backend może zwracać różne formaty - obsłuż oba
    let messages = [];
    const otherUser = data.otherUser || null;
    
    if (data.messages && Array.isArray(data.messages)) {
      // Nowy format: { otherUser, messages, totalMessages }
      messages = data.messages;
    } else if (data.conversations) {
      // Stary format: { otherUser, conversations }
      Object.values(data.conversations).forEach(convo => {
        if (convo.messages && Array.isArray(convo.messages)) {
          messages = [...messages, ...convo.messages];
        }
      });
    }
    
    console.log(`✅ Przetwarzam ${messages.length} wiadomości z konwersacji`);
    
    if (messages.length === 0) {
      console.log('⚠️ Brak wiadomości w konwersacji');
      return {
        messages: [],
        user: otherUser,
        hasMore: false
      };
    }

    const transformedMessages = messages.map(msg => {
      const transformedMsg = {
        id: msg._id,
        content: msg.content || '',
        subject: msg.subject || '',
        sender: {
          id: msg.sender?._id || msg.sender,
          name: msg.sender?.name || msg.sender?.email || 'Nieznany użytkownik',
          email: msg.sender?.email || ''
        },
        recipient: {
          id: msg.recipient?._id || msg.recipient,
          name: msg.recipient?.name || msg.recipient?.email || 'Nieznany użytkownik',
          email: msg.recipient?.email || ''
        },
        createdAt: msg.createdAt,
        read: msg.read || false,
        starred: msg.starred || false,
        attachments: msg.attachments || [],
        type: this.getMessageType(msg),
        isFromMe: false, // Zostanie ustawione w komponencie na podstawie currentUser
        relatedAd: msg.relatedAd || null
      };
      
      console.log(`  Wiadomość ${msg._id}: ${msg.content?.substring(0, 50)}...`);
      return transformedMsg;
    });

    const result = {
      messages: transformedMessages,
      user: otherUser,
      hasMore: data.hasMore || false,
      totalMessages: data.totalMessages || messages.length,
      adInfo: data.adInfo || null
    };
    
    console.log('✅ Konwersacja przetworzona pomyślnie:', {
      messagesCount: result.messages.length,
      user: result.user?.name || result.user?.email,
      totalMessages: result.totalMessages
    });
    
    return result;
  }

  /**
   * Transformuje odpowiedź z pojedynczą wiadomością
   */
  transformMessageResponse(data) {
    return {
      id: data._id,
      subject: data.subject,
      content: data.content,
      sender: data.sender,
      recipient: data.recipient,
      createdAt: data.createdAt,
      read: data.read,
      starred: data.starred,
      archived: data.archived,
      attachments: data.attachments || [],
      relatedAd: data.relatedAd,
      type: this.getMessageType(data)
    };
  }

  /**
   * Transformuje odpowiedź z listą wiadomości
   */
  transformMessagesResponse(data) {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(msg => this.transformMessageResponse(msg));
  }

  /**
   * Określa typ wiadomości na podstawie zawartości
   */
  getMessageType(message) {
    if (!message) return 'text';
    
    if (message.attachments && message.attachments.length > 0) {
      const firstAttachment = message.attachments[0];
      if (firstAttachment.mimetype) {
        if (firstAttachment.mimetype.startsWith('image/')) return 'image';
        if (firstAttachment.mimetype.startsWith('audio/')) return 'voice';
        if (firstAttachment.mimetype.startsWith('video/')) return 'video';
        return 'file';
      }
    }
    
    return 'text';
  }

  /**
   * Obsługuje błędy API
   */
  handleError(error) {
    if (error.response) {
      // Błąd z odpowiedzią serwera
      const message = error.response.data?.message || 'Wystąpił błąd serwera';
      const status = error.response.status;
      
      return new Error(`${message} (${status})`);
    } else if (error.request) {
      // Błąd sieci
      return new Error('Brak połączenia z serwerem');
    } else {
      // Inny błąd
      return new Error(error.message || 'Wystąpił nieoczekiwany błąd');
    }
  }
}

// Eksportuj instancję
const messagesApi = new MessagesApi();
export default messagesApi;

// Eksportuj również klasę dla testów
export { MessagesApi };
