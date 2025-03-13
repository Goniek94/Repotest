// src/services/messages.service.js
import api from './axios';

class MessagesService {
  // Pobieranie wiadomości dla danego folderu (inbox, sent, drafts, etc.)
  async getMessages(folder, page = 1, limit = 20) {
    try {
      const response = await api.get(`/messages/${folder}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd pobierania wiadomości';
    }
  }

  // Pobieranie pojedynczej wiadomości
  async getMessage(id) {
    try {
      const response = await api.get(`/messages/message/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd pobierania wiadomości';
    }
  }

  // Wysyłanie nowej wiadomości
  async sendMessage(messageData) {
    try {
      const formData = new FormData();
      
      // Dodajemy podstawowe dane
      formData.append('recipient', messageData.to);
      formData.append('subject', messageData.subject);
      formData.append('content', messageData.content);
      
      // Dodajemy załączniki, jeśli są
      if (messageData.attachments && messageData.attachments.length > 0) {
        messageData.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      const response = await api.post('/messages/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd wysyłania wiadomości';
    }
  }

  // Zapisywanie wiadomości jako robocza
  async saveDraft(messageData) {
    try {
      const formData = new FormData();
      
      // Dodajemy dane
      if (messageData.to) formData.append('recipient', messageData.to);
      if (messageData.subject) formData.append('subject', messageData.subject);
      if (messageData.content) formData.append('content', messageData.content);
      
      // Dodajemy załączniki, jeśli są
      if (messageData.attachments && messageData.attachments.length > 0) {
        messageData.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      // Przekazujemy ID roboczej wiadomości, jeśli istnieje (aktualizacja istniejącego szkicu)
      if (messageData.id) {
        formData.append('draftId', messageData.id);
      }
      
      const response = await api.post('/messages/draft', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd zapisywania wiadomości roboczej';
    }
  }

  // Oznaczanie wiadomości jako przeczytana
  async markAsRead(id) {
    try {
      const response = await api.patch(`/messages/read/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd oznaczania wiadomości jako przeczytana';
    }
  }

  // Oznaczanie wiadomości gwiazdką
  async toggleStar(id) {
    try {
      const response = await api.patch(`/messages/star/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd oznaczania wiadomości gwiazdką';
    }
  }

  // Usuwanie wiadomości
  async deleteMessage(id) {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd usuwania wiadomości';
    }
  }

  // Wyszukiwanie wiadomości
  async searchMessages(query, folder = 'all') {
    try {
      const response = await api.get('/messages/search', {
        params: { query, folder }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd wyszukiwania wiadomości';
    }
  }

  // Pobieranie listy użytkowników (dla funkcji autouzupełniania przy wysyłaniu)
  async getUserSuggestions(query) {
    try {
      const response = await api.get('/users/suggestions', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Błąd pobierania sugestii użytkowników';
    }
  }
}

export default new MessagesService();