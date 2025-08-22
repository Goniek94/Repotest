import React, { useState, memo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Bell } from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import { DEFAULT_FOLDER, FOLDER_MAP } from '../../../contexts/constants/messageFolders';
import useConversations from './hooks/useConversations';
import MessagesHeader from './MessagesHeader';
import CategoriesPanel from './CategoriesPanel';
import ConversationsPanel from './ConversationsPanel';
import ChatPanel from './ChatPanel';

/**
 * 💬 MESSAGES - Główny komponent panelu wiadomości
 * 
 * 3-panelowy layout w stylu Messenger z pełną responsywnością:
 * 1. Panel kategorii (lewy)
 * 2. Panel konwersacji (środkowy)
 * 3. Panel chatu (prawy)
 */
const Messages = memo(() => {
  // ===== HOOKS =====
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ===== STATE =====
  // Aktywna kategoria wiadomości
  const [activeTab, setActiveTab] = useState(() => {
    const initial = searchParams.get('folder');
    return FOLDER_MAP[initial] ? initial : DEFAULT_FOLDER;
  });
  
  // Stan paneli - kontroluje które panele są widoczne
  const [panelState, setPanelState] = useState('conversations'); // categories, conversations, chat
  
  // Custom hook do zarządzania konwersacjami
  const conversationsData = useConversations(activeTab);

  // ===== EFFECTS =====
  /**
   * Automatycznie otwórz panel konwersacji z wiadomościami odebranymi po załadowaniu
   */
  useEffect(() => {
    // Jeśli nie ma parametru folder w URL, ustaw domyślny i otwórz panel konwersacji
    if (!searchParams.get('folder')) {
      setSearchParams({ folder: DEFAULT_FOLDER });
      setPanelState('conversations');
    }
  }, [searchParams, setSearchParams]);

  // ===== HANDLERS =====
  /**
   * Obsługa zmiany kategorii wiadomości
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ folder: tab });
    setPanelState('conversations'); // Pokaż panel konwersacji
  };

  /**
   * Obsługa wyboru konwersacji
   */
  const handleSelectConversation = (conversation) => {
    console.log('🔄 Messages.js - handleSelectConversation wywołane z:', conversation);
    console.log('🔄 Messages.js - conversation.id:', conversation.id);
    console.log('🔄 Messages.js - conversation.userId:', conversation.userId);
    
    const conversationId = conversation.id || conversation.userId;
    console.log('🔄 Messages.js - używane conversationId:', conversationId);
    
    conversationsData.selectConversation(conversationId);
    setPanelState('chat'); // Pokaż panel chatu
    
    console.log('🔄 Messages.js - setPanelState na chat');
  };

  /**
   * Obsługa powrotu do poprzedniego panelu
   */
  const handleBack = () => {
    if (panelState === 'chat') {
      setPanelState('conversations');
      conversationsData.selectConversation(null);
    } else if (panelState === 'conversations') {
      setPanelState('categories');
    }
  };

  // ===== RENDER =====
  return (
    <div className="bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nagłówek z tytułem i licznikami - połączony z panelami */}
        <div>
          <MessagesHeader 
            unreadCount={unreadCount.messages}
          />
        </div>

        {/* Główny kontener - responsywny 3-panelowy layout - połączony z nagłówkiem */}
        <div className="
          flex flex-col lg:flex-row
          min-h-[calc(100vh-200px)] sm:min-h-[600px] lg:h-[600px]
          bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 overflow-hidden
        ">
          
          {/* Panel kategorii - lewy (mniejszy) */}
          <div className="
            w-full lg:w-64 xl:w-72
            flex-shrink-0 
            border-b lg:border-b-0 lg:border-r border-gray-200
            max-h-[180px] lg:max-h-none
            overflow-y-auto lg:overflow-y-visible
          ">
            <CategoriesPanel
              activeTab={activeTab}
              unreadCount={unreadCount}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Panel konwersacji - środkowy (mniejszy) */}
          <div className="
            w-full lg:w-72 xl:w-80
            flex-shrink-0 
            border-b lg:border-b-0 lg:border-r border-gray-200
            min-h-[280px] lg:min-h-0
          ">
            <ConversationsPanel
              isVisible={true}
              conversations={conversationsData.conversations}
              loading={conversationsData.loading}
              error={conversationsData.error}
              activeConversation={conversationsData.selectedConversation?.id}
              onSelectConversation={handleSelectConversation}
              onStar={conversationsData.toggleStar}
              onDelete={conversationsData.deleteConversation}
              onMove={conversationsData.moveToFolder}
              onBack={handleBack}
              activeTab={activeTab}
            />
          </div>

          {/* Panel chatu - prawy */}
          <div className="
            flex-1 
            relative overflow-hidden
            min-h-[400px] lg:min-h-0
          ">
            {conversationsData.selectedConversation ? (
              <ChatPanel
                isVisible={true}
                conversation={conversationsData.selectedConversation}
                messages={conversationsData.chatMessages}
                currentUser={user}
                loading={conversationsData.loading}
                onSendMessage={conversationsData.sendReply}
                onEditMessage={conversationsData.editMessage}
                onDeleteMessage={conversationsData.deleteMessage}
                onArchiveMessage={conversationsData.archiveMessage}
                onBack={handleBack}
                showNotification={conversationsData.showNotification}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center p-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                    Wybierz konwersację
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Kliknij na użytkownika z listy, aby rozpocząć rozmowę
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Messages.displayName = 'Messages';

export default Messages;
