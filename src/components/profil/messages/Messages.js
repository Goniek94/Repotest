import React, { useState, memo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Bell } from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import { DEFAULT_FOLDER, FOLDER_MAP } from '../../../constants/messageFolders';
import useConversations from './hooks/useConversations';
import MessagesHeader from './MessagesHeader';
import CategoriesPanel from './CategoriesPanel';
import ConversationsPanel from './ConversationsPanel';
import ChatPanel from './ChatPanel';

/**
 * 💬 MESSAGES - Główny komponent panelu wiadomości
 * 
 * 3-panelowy layout w stylu Messenger:
 * 1. Panel kategorii (stały sidebar)
 * 2. Panel konwersacji (slide-in z prawej)
 * 3. Panel chatu (slide-in z prawej)
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
    conversationsData.selectConversation(conversation.id);
    setPanelState('chat'); // Pokaż panel chatu
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
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Nagłówek z tytułem i licznikami - złączony z nawigacją */}
        <div className="mb-5">
          <MessagesHeader 
            unreadCount={unreadCount.messages}
          />
        </div>

        {/* Główny kontener - jeden spójny panel */}
        <div className="flex gap-5 h-[600px]">
          
          {/* Panel kategorii - zawsze widoczny po lewej */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-hidden">
              <CategoriesPanel
                activeTab={activeTab}
                unreadCount={unreadCount}
                onTabChange={handleTabChange}
              />
            </div>
          </div>

          {/* Obszar wysuwanych paneli - po prawej stronie */}
          <div className="flex-1 relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200">
            
            {/* Panel konwersacji - wysuwa się z prawej */}
            <div className={`
              absolute inset-0 transition-transform duration-300 ease-out
              ${panelState === 'conversations' || panelState === 'chat' 
                ? 'transform translate-x-0' 
                : 'transform translate-x-full'
              }
            `}>
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

            {/* Panel chatu - wysuwa się z prawej nad panelem konwersacji */}
            <div className={`
              absolute inset-0 transition-transform duration-300 ease-out
              ${panelState === 'chat' 
                ? 'transform translate-x-0' 
                : 'transform translate-x-full'
              }
            `}>
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
            </div>

            {/* Domyślny widok gdy żaden panel nie jest aktywny */}
            {panelState === 'categories' && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Zarządzaj swoimi wiadomościami
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Kliknij na jedną z kategorii po lewej stronie, aby zobaczyć swoje wiadomości
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
