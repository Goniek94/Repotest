import React, { useRef } from 'react';
import ConversationList from './ConversationList';
import ConversationChat from './ConversationChat';
import EmptyChat from './EmptyChat';
import ChatHeader from './ChatHeader';
import MessagesTabs from './MessagesTabs';
import MessagesHeader from './MessagesHeader';

/**
 * Komponent odpowiedzialny za układ strony wiadomości
 */
const MessagesLayout = ({
  conversations,
  activeTab,
  setActiveTab,
  selectedConversation,
  chatMessages,
  loading,
  onSelectConversation,
  onStar,
  onDelete,
  onMove,
  onSendReply,
  onSearch,
  searchTerm,
  onNewMessage,
  currentUser
}) => {
  const chatEndRef = useRef(null);

  // Filtrowanie konwersacji na podstawie wyszukiwania
  const filteredConversations = searchTerm.trim().length < 3 
    ? conversations.filter(conversation =>
        conversation.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : conversations;

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 h-[80vh] flex flex-col">
          {/* Nagłówek */}
          <MessagesHeader 
            searchTerm={searchTerm}
            onSearch={onSearch}
            onNewMessage={onNewMessage}
          />
          
          {/* Zakładki folderów */}
          <MessagesTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            conversations={conversations}
          />
          
          {/* Główna zawartość */}
          <div className="flex flex-1 overflow-hidden">
            {/* Lista konwersacji (lewa kolumna) */}
            <div className="w-full md:w-2/5 border-r border-gray-200 flex flex-col overflow-hidden">
              {loading && conversations.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#35530A]"></div>
                </div>
              ) : (
                <ConversationList
                  conversations={filteredConversations}
                  activeConversation={selectedConversation?.id}
                  onSelectConversation={onSelectConversation}
                  onStar={onStar}
                  onDelete={onDelete}
                  onMove={onMove}
                />
              )}
            </div>
            
            {/* Zawartość konwersacji (prawa kolumna) */}
            <div className="hidden md:flex md:w-3/5 flex-col overflow-hidden">
              {selectedConversation ? (
                <>
                  {/* Nagłówek konwersacji */}
                  <ChatHeader 
                    conversation={selectedConversation} 
                    onStar={() => onStar(selectedConversation.id)} 
                    onDelete={() => onDelete(selectedConversation.id)}
                    onArchive={() => onMove(selectedConversation.id, 'archiwum')}
                    onBack={() => onSelectConversation(null)}
                  />
                  
                  {/* Wiadomości w konwersacji */}
                  <ConversationChat
                    messages={chatMessages}
                    currentUser={currentUser}
                    onSendReply={onSendReply}
                    loading={loading}
                  />
                </>
              ) : (
                <EmptyChat onNewMessage={onNewMessage} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Referencja do końca czatu (dla automatycznego przewijania) */}
      <div ref={chatEndRef} />
    </div>
  );
};

export default MessagesLayout;