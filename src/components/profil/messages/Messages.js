import React, { useState, memo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Bell, Inbox, Send, Star, Archive, Image, Link } from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import { DEFAULT_FOLDER, FOLDER_MAP } from '../../../contexts/constants/messageFolders';
import useConversations from './hooks/useConversations';
import useResponsiveLayout from '../../../hooks/useResponsiveLayout';
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
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();
  
  // ===== STATE =====
  // Aktywna kategoria wiadomości
  const [activeTab, setActiveTab] = useState(() => {
    const initial = searchParams.get('folder');
    return FOLDER_MAP[initial] ? initial : DEFAULT_FOLDER;
  });
  
  // Stan paneli - kontroluje które panele są widoczne
  const [panelState, setPanelState] = useState(() => {
    // Na mobilnych od razu pokazuj konwersacje z domyślną kategorią
    return isMobile ? 'conversations' : 'categories';
  });
  
  // Custom hook do zarządzania konwersacjami z zabezpieczeniem
  const conversationsData = useConversations(activeTab) || {};

  // ===== EFFECTS =====
  /**
   * Automatycznie otwórz panel konwersacji z wiadomościami odebranymi po załadowaniu
   */
  useEffect(() => {
    // Jeśli nie ma parametru folder w URL, ustaw domyślny
    if (!searchParams.get('folder')) {
      setSearchParams({ folder: DEFAULT_FOLDER });
      // Na mobilnych od razu pokaż konwersacje po wybraniu kategorii, na desktop od razu konwersacje
      setPanelState(isMobile ? 'conversations' : 'conversations');
    }
  }, [searchParams, setSearchParams, isMobile]);

  /**
   * Zawsze ustaw domyślną kategorię na "odebrane" przy pierwszym załadowaniu
   */
  useEffect(() => {
    // Jeśli activeTab nie jest ustawiony lub jest nieprawidłowy, ustaw na domyślny
    if (!activeTab || !FOLDER_MAP[activeTab]) {
      setActiveTab(DEFAULT_FOLDER);
      setSearchParams({ folder: DEFAULT_FOLDER });
    }
  }, []);

  // ===== HANDLERS =====
  /**
   * Obsługa zmiany kategorii wiadomości - na mobile zastępuje cały panel
   */
  const handleTabChange = (tab) => {
    // Sprawdź czy kategoria jest obsługiwana
    if (!FOLDER_MAP[tab]) {
      console.warn(`Nieobsługiwana kategoria: ${tab}, przełączam na domyślną`);
      tab = DEFAULT_FOLDER;
    }
    
    setActiveTab(tab);
    setSearchParams({ folder: tab });
    // Na mobile po kliknięciu na kategorię od razu pokazujemy konwersacje na pełnym ekranie
    setPanelState('conversations');
    // Wyczyść wybór konwersacji przy zmianie kategorii
    if (conversationsData.selectConversation) {
      conversationsData.selectConversation(null);
    }
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
    
    if (conversationsData.selectConversation) {
      conversationsData.selectConversation(conversationId);
    }
    setPanelState('chat'); // Pokaż panel chatu
    
    console.log('🔄 Messages.js - setPanelState na chat');
  };

  /**
   * Obsługa powrotu do poprzedniego panelu
   */
  const handleBack = () => {
    console.log('🔄 Messages.js - handleBack wywołane, aktualny panelState:', panelState);
    
    if (panelState === 'chat') {
      console.log('🔄 Messages.js - przechodzę z chat do conversations');
      setPanelState('conversations');
      if (conversationsData.selectConversation) {
        conversationsData.selectConversation(null);
      }
    } else if (panelState === 'conversations') {
      console.log('🔄 Messages.js - przechodzę z conversations do categories');
      setPanelState('categories');
    }
    
    console.log('🔄 Messages.js - nowy panelState będzie ustawiony');
  };

  // ===== RENDER =====
  return (
    <div className={`bg-white overflow-x-hidden ${isMobile ? 'mt-0 pt-0' : ''}`}>
      <div className={`max-w-7xl mx-auto ${isMobile ? 'mt-0 pt-0' : ''}`}>
        {/* Nagłówek z tytułem i licznikami - połączony z panelami */}
        <div className={isMobile ? 'mt-0 pt-0' : ''}>
          <MessagesHeader 
            unreadCount={unreadCount.messages}
          />
        </div>

        {/* Mobile Layout - 6 kategorii wiadomości pod nagłówkiem */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 -mt-1">
            <div className="px-2 py-2">
              <div className="flex justify-center gap-2 relative">
                {/* Lewa kreska separator */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
                {/* Prawa kreska separator */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
                {[
                  { id: 'odebrane', label: 'Odebrane', icon: Inbox, count: unreadCount.messages || 0 },
                  { id: 'wyslane', label: 'Wysłane', icon: Send, count: 0 },
                  { id: 'wazne', label: 'Ważne', icon: Star, count: unreadCount.starred || 0 },
                  { id: 'archiwum', label: 'Archiwum', icon: Archive, count: 0 },
                  { id: 'multimedia', label: 'Multimedia', icon: Image, count: 0 },
                  { id: 'linki', label: 'Linki', icon: Link, count: 0 }
                ].map(category => {
                  const Icon = category.icon;
                  const isActive = activeTab === category.id;
                  const hasCount = category.count > 0;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleTabChange(category.id)}
                      className={`
                        flex items-center justify-center
                        w-12 h-12 rounded-xl
                        transition-all duration-200
                        relative
                        ${isActive 
                          ? 'bg-[#35530A] text-white' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                        }
                      `}
                      title={category.label}
                    >
                      <Icon className="w-5 h-5" />
                      {hasCount && (
                        <div className={`
                          absolute -top-1 -right-1
                          w-5 h-5 
                          rounded-full text-xs font-bold 
                          flex items-center justify-center
                          ${isActive 
                            ? 'bg-white text-[#35530A]' 
                            : 'bg-red-500 text-white'
                          }
                        `}>
                          {category.count > 9 ? '9+' : category.count}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Główny kontener - responsywny layout */}
        <div className={`
          flex flex-col lg:flex-row
          bg-white rounded-b-2xl border border-gray-200 border-t-0
          ${isMobile ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : 'overflow-hidden'}
        `} style={{
          boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.15), -3px 0 6px -1px rgba(0, 0, 0, 0.1), 3px 0 6px -1px rgba(0, 0, 0, 0.1)',
          height: isMobile ? '70vh' : 'calc(100vh - 150px)',
          minHeight: isMobile ? '500px' : '600px',
          maxHeight: isMobile ? '80vh' : '800px'
        }}>
          
          {/* Panel kategorii - tylko desktop */}
          {isDesktop && (
            <div className="
              w-64 xl:w-72
              flex-shrink-0 
              border-r border-gray-200
            ">
              <CategoriesPanel
                activeTab={activeTab}
                unreadCount={unreadCount}
                onTabChange={handleTabChange}
              />
            </div>
          )}

          {/* Panel konwersacji - pełna szerokość na mobile, ograniczona na desktop */}
          {(panelState === 'conversations' || isDesktop) && (
            <div className={`
              ${isMobile 
                ? 'w-full' 
                : 'w-72 xl:w-80 flex-shrink-0 border-r border-gray-200'
              }
              ${panelState === 'chat' && isMobile ? 'hidden' : ''}
              min-h-[280px] lg:min-h-0
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
          )}

          {/* Panel chatu - pełna szerokość na mobile gdy aktywny */}
          {(panelState === 'chat' || isDesktop) && (
            <div className={`
              ${isMobile && panelState === 'chat' 
                ? 'w-full h-full' 
                : 'flex-1'
              }
              relative overflow-hidden
              ${isMobile ? 'h-full' : 'min-h-[400px] lg:min-h-0'}
            `}>
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
                  onRefreshConversation={conversationsData.refreshConversation}
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
          )}
        </div>
      </div>
    </div>
  );
});

Messages.displayName = 'Messages';

export default Messages;
