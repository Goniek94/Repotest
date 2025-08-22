import React, { memo, useState } from 'react';
import { ArrowLeft, MoreVertical, Star, Archive, Trash2, Check, CheckSquare, Square } from 'lucide-react';

/**
 * 💬 CONVERSATIONS PANEL - Panel listy konwersacji
 * 
 * Panel z nagłówkiem, opcjami zaznaczania i listą konwersacji
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
  const [selectedConversations, setSelectedConversations] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

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
      name: userName,
      lastMessageText: lastMessageContent,
      time: formatTime(lastMessageTime),
      unread: conv.unreadCount > 0,
      // Dodanie informacji o ogłoszeniu jeśli dostępne
      adTitle: conv.adInfo?.title || null,
      adId: conv.adInfo?.id || null
    };
  });

  // ===== SELECTION HANDLERS =====
  const handleConversationClick = (conversation, e) => {
    console.log('🔄 ConversationsPanel - handleConversationClick wywołane z:', conversation);
    console.log('🔄 ConversationsPanel - isSelectionMode:', isSelectionMode);
    
    if (isSelectionMode) {
      e.preventDefault();
      toggleConversationSelection(conversation.id);
    } else {
      console.log('🔄 ConversationsPanel - wywołuję onSelectConversation z:', conversation);
      onSelectConversation(conversation);
    }
  };

  const toggleConversationSelection = (conversationId) => {
    setSelectedConversations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conversationId)) {
        newSet.delete(conversationId);
      } else {
        newSet.add(conversationId);
      }
      return newSet;
    });
  };

  const selectAllConversations = () => {
    setSelectedConversations(new Set(processedConversations.map(c => c.id)));
  };

  const deselectAllConversations = () => {
    setSelectedConversations(new Set());
  };

  const markAllAsRead = async () => {
    try {
      // Oznacz wszystkie konwersacje jako przeczytane
      const promises = processedConversations
        .filter(conv => conv.unread)
        .map(conv => onMove && onMove(conv.id, 'read'));
      
      await Promise.all(promises);
      console.log('Wszystkie konwersacje oznaczone jako przeczytane');
    } catch (error) {
      console.error('Błąd podczas oznaczania jako przeczytane:', error);
    }
    setShowOptionsMenu(false);
  };

  const deleteSelectedConversations = async () => {
    if (selectedConversations.size === 0) return;
    
    try {
      // Usuń zaznaczone konwersacje
      const promises = Array.from(selectedConversations).map(conversationId => 
        onDelete && onDelete(conversationId)
      );
      
      await Promise.all(promises);
      console.log('Zaznaczone konwersacje usunięte:', Array.from(selectedConversations));
    } catch (error) {
      console.error('Błąd podczas usuwania konwersacji:', error);
    }
    
    setSelectedConversations(new Set());
    setIsSelectionMode(false);
    setShowOptionsMenu(false);
  };

  const moveSelectedToImportant = async () => {
    if (selectedConversations.size === 0) return;
    
    try {
      // Przenieś zaznaczone konwersacje do ważnych
      const promises = Array.from(selectedConversations).map(conversationId => 
        onStar && onStar(conversationId)
      );
      
      await Promise.all(promises);
      console.log('Zaznaczone konwersacje przeniesione do ważnych:', Array.from(selectedConversations));
    } catch (error) {
      console.error('Błąd podczas przenoszenia do ważnych:', error);
    }
    
    setSelectedConversations(new Set());
    setIsSelectionMode(false);
    setShowOptionsMenu(false);
  };

  const moveSelectedToArchive = async () => {
    if (selectedConversations.size === 0) return;
    
    try {
      // Przenieś zaznaczone konwersacje do archiwum
      const promises = Array.from(selectedConversations).map(conversationId => 
        onMove && onMove(conversationId, 'archiwum')
      );
      
      await Promise.all(promises);
      console.log('Zaznaczone konwersacje przeniesione do archiwum:', Array.from(selectedConversations));
    } catch (error) {
      console.error('Błąd podczas przenoszenia do archiwum:', error);
    }
    
    setSelectedConversations(new Set());
    setIsSelectionMode(false);
    setShowOptionsMenu(false);
  };

  // ===== STAR HANDLER =====
  const handleStarClick = (e, conversationId) => {
    e.stopPropagation(); // Zapobiega otwieraniu konwersacji
    if (onStar) {
      onStar(conversationId);
    }
  };

  // ===== RENDER CONVERSATION ITEM =====
  const renderConversationItem = (conversation) => (
    <div
      key={conversation.id}
      onClick={(e) => handleConversationClick(conversation, e)}
      className={`
        flex items-start gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100
        ${activeConversation === conversation.id ? 'bg-[#35530A]/10 border-r-2 border-[#35530A]' : ''}
        ${selectedConversations.has(conversation.id) ? 'bg-[#35530A]/10' : ''}
      `}
    >
      {/* Checkbox w trybie zaznaczania */}
      {isSelectionMode && (
        <div className="flex items-center mt-1 flex-shrink-0">
          {selectedConversations.has(conversation.id) ? (
            <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#35530A]" />
          ) : (
            <Square className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          )}
        </div>
      )}

      {/* Treść konwersacji - bez awatara */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
            {conversation.name}
          </h4>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Gwiazdka - ukryta na bardzo małych ekranach */}
            {!isSelectionMode && (
              <button
                onClick={(e) => handleStarClick(e, conversation.id)}
                className="hidden sm:block p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <Star 
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    conversation.isStarred 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-400 hover:text-yellow-500'
                  }`} 
                />
              </button>
            )}
            <span className="text-xs text-gray-500">
              {conversation.time}
            </span>
          </div>
        </div>
        
        {/* Informacja o ogłoszeniu nad wiadomością */}
        {conversation.adTitle && (
          <p className="text-xs text-[#35530A] truncate mb-1 flex items-center gap-1">
            <span className="text-[#35530A]">📋</span>
            <span className="truncate">{conversation.adTitle}</span>
          </p>
        )}
        
        <p className="text-xs sm:text-sm text-gray-600 truncate">
          {conversation.lastMessageText}
        </p>
      </div>

      {/* Status indicator */}
      {!isSelectionMode && (
        <div className="flex flex-col items-center gap-1 mt-1 flex-shrink-0">
          {conversation.unread && (
            <div className="w-2 h-2 bg-[#35530A] rounded-full"></div>
          )}
        </div>
      )}
    </div>
  );

  // ===== RENDER =====
  return (
    <div className="w-full bg-white h-full flex flex-col overflow-hidden">
      {/* Header z tytułem i opcjami - wyrównany z ChatPanel */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0 min-h-[64px]">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 bg-[#35530A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-[#35530A] rounded-sm"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-gray-900 truncate leading-tight">
                {getCategoryLabel(activeTab)}
              </h2>
              <p className="text-xs text-gray-500 truncate leading-tight">
                {processedConversations.length} wiadomości • {processedConversations.filter(c => c.unread).length} nieprzeczytane
              </p>
            </div>
          </div>

          {/* Menu opcji */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown menu */}
            {showOptionsMenu && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsSelectionMode(!isSelectionMode);
                      setSelectedConversations(new Set());
                      setShowOptionsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    {isSelectionMode ? 'Anuluj zaznaczanie' : 'Zaznacz wiadomości'}
                  </button>
                  
                  {isSelectionMode && (
                    <>
                      <button
                        onClick={() => {
                          selectAllConversations();
                          setShowOptionsMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Zaznacz wszystkie
                      </button>
                      
                      <button
                        onClick={() => {
                          deselectAllConversations();
                          setShowOptionsMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Square className="w-4 h-4" />
                        Odznacz wszystkie
                      </button>

                      {selectedConversations.size > 0 && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          
                          <button
                            onClick={moveSelectedToImportant}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            Przenieś do ważnych ({selectedConversations.size})
                          </button>
                          
                          <button
                            onClick={moveSelectedToArchive}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" />
                            Przenieś do archiwum ({selectedConversations.size})
                          </button>
                          
                          <button
                            onClick={deleteSelectedConversations}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Usuń zaznaczone ({selectedConversations.size})
                          </button>
                        </>
                      )}
                    </>
                  )}
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={markAllAsRead}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Zaznacz wszystkie jako przeczytane
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informacja o trybie zaznaczania */}
        {isSelectionMode && (
          <div className="mt-3 p-2 bg-[#35530A]/10 rounded-lg">
            <p className="text-sm text-[#35530A]">
              Tryb zaznaczania aktywny • Zaznaczono: {selectedConversations.size}
            </p>
          </div>
        )}
      </div>

      {/* Lista konwersacji */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-[#35530A] border-t-transparent rounded-full"></div>
          </div>
        ) : processedConversations.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 text-gray-400 mx-auto mb-2">💬</div>
              <p className="text-gray-500 text-sm">Brak konwersacji</p>
            </div>
          </div>
        ) : (
          <div>
            {processedConversations.map(renderConversationItem)}
          </div>
        )}
      </div>

      {/* Kliknij poza menu, aby je zamknąć */}
      {showOptionsMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowOptionsMenu(false)}
        />
      )}
    </div>
  );
});

ConversationsPanel.displayName = 'ConversationsPanel';

export default ConversationsPanel;
