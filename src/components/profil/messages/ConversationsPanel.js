import React, { memo, useState } from 'react';
import { ArrowLeft, Search, MoreVertical, Star, Archive, Trash2 } from 'lucide-react';

/**
 * 💬 CONVERSATIONS PANEL - Panel listy konwersacji jak na screenshocie
 * 
 * Panel z nagłówkiem, wyszukiwaniem i listą użytkowników
 */
const ConversationsPanel = memo(({ 
  isVisible,
  conversations = [],
  loading = false,
  error = null,
  activeConversation,
  onSelectConversation,
  onStar,
  onDelete,
  onMove,
  onBack,
  activeTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // ===== CATEGORY LABELS =====
  const getCategoryLabel = (tab) => {
    const labels = {
      'odebrane': 'Odebrane',
      'wyslane': 'Wysłane', 
      'wazne': 'Ważne',
      'archiwum': 'Archiwum',
      'grupy': 'Grupy'
    };
    return labels[tab] || 'Wiadomości';
  };

  // ===== HELPER FUNCTIONS =====
  // Generowanie inicjałów z imienia i nazwiska
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generowanie koloru tła na podstawie nazwy
  const getAvatarColor = (name) => {
    const colors = [
      'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500',
      'bg-teal-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-gray-500', 'bg-emerald-500'
    ];
    
    if (!name) return colors[0];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Formatowanie czasu
  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('pl-PL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'wczoraj';
    } else if (diffInHours < 168) { // 7 dni
      const days = Math.floor(diffInHours / 24);
      return `${days} dni temu`;
    } else {
      return 'tydzień temu';
    }
  };

  // Przetwarzanie konwersacji z API na format wyświetlania
  const processedConversations = conversations.map(conv => {
    // Pobieranie nazwy użytkownika z różnych możliwych źródeł
    const userName = conv.userName || 
                    conv.otherParticipant?.name || 
                    conv.participantName || 
                    conv.user?.name ||
                    'Nieznany użytkownik';

    // Pobieranie ostatniej wiadomości
    const lastMessageContent = typeof conv.lastMessage === 'string' 
      ? conv.lastMessage 
      : conv.lastMessage?.content || 'Brak wiadomości';

    // Pobieranie czasu ostatniej wiadomości
    const lastMessageTime = conv.lastMessage?.date || 
                           conv.lastMessageAt || 
                           conv.updatedAt ||
                           conv.createdAt;

    return {
      ...conv,
      initials: getInitials(userName),
      bgColor: getAvatarColor(userName),
      name: userName,
      lastMessageText: lastMessageContent,
      time: formatTime(lastMessageTime),
      unread: conv.unreadCount > 0,
      // Dodanie informacji o ogłoszeniu jeśli dostępne
      adTitle: conv.adInfo?.title || null,
      adId: conv.adInfo?.id || null
    };
  });

  // Filtrowanie konwersacji na podstawie wyszukiwania
  const filteredConversations = processedConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.lastMessageText && conv.lastMessageText.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (conv.adTitle && conv.adTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ===== RENDER CONVERSATION ITEM =====
  const renderConversationItem = (conversation) => (
    <div
      key={conversation.id}
      onClick={() => onSelectConversation(conversation)}
      className={`
        flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors
        ${activeConversation === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
      `}
    >
      {/* Avatar z inicjałami */}
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm
        ${conversation.bgColor}
      `}>
        {conversation.initials}
      </div>

      {/* Treść konwersacji */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-gray-900 truncate">
            {conversation.name}
          </h4>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {conversation.time}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {conversation.lastMessageText}
        </p>
        {/* Informacja o ogłoszeniu jeśli dostępna */}
        {conversation.adTitle && (
          <p className="text-xs text-blue-600 truncate mt-1">
            📋 {conversation.adTitle}
          </p>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex flex-col items-center gap-1">
        {conversation.unread && (
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        )}
      </div>
    </div>
  );

  // ===== RENDER =====
  return (
    <div className="w-full bg-white h-full flex flex-col overflow-hidden">
      {/* Header z tytułem i statystykami */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {getCategoryLabel(activeTab)}
            </h2>
            <p className="text-sm text-gray-500">
              {filteredConversations.filter(c => c.unread).length} wiadomości • {filteredConversations.filter(c => c.unread).length} nieprzeczytane
            </p>
          </div>
        </div>

        {/* Pasek wyszukiwania */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj użytkowników lub wiadomości..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista konwersacji */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Brak wyników wyszukiwania' : 'Brak konwersacji'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {filteredConversations.map(renderConversationItem)}
          </div>
        )}
      </div>
    </div>
  );
});

ConversationsPanel.displayName = 'ConversationsPanel';

export default ConversationsPanel;
