import React, { memo } from 'react';
import ChatHeader from '../ChatHeader';
import MessageChat from '../MessageChat';
import EmptyChat from '../EmptyChat';
import ReplyField from './ReplyField';

/**
 * Komponent widoku konwersacji (prawa kolumna na desktop)
 */
const ConversationView = memo(({
  selectedConversation,
  chatMessages,
  user,
  loading,
  replyContent,
  setReplyContent,
  attachments,
  setAttachments,
  sendingReply,
  replyToMessage,
  onStar,
  onDelete,
  onArchive,
  onBack,
  onMarkAsRead,
  onDeleteMessage,
  onArchiveMessage,
  onReplyToMessage,
  onSendReply,
  onCancelReply,
  onFileSelect,
  showNotification
}) => {
  if (!selectedConversation) {
    return <EmptyChat />;
  }

  return (
    <>
      {/* Nagłówek konwersacji */}
      <ChatHeader 
        conversation={selectedConversation} 
        onStar={() => onStar(selectedConversation.id)} 
        onDelete={() => onDelete(selectedConversation.id)}
        onArchive={() => onArchive(selectedConversation.id)}
        onBack={onBack}
        onMarkAsRead={() => onMarkAsRead(selectedConversation.id)}
      />
      
      {/* Wiadomości w konwersacji */}
      <MessageChat
        messages={chatMessages}
        currentUser={user}
        loading={loading}
        onDeleteMessage={onDeleteMessage}
        onArchiveMessage={onArchiveMessage}
        onReplyToMessage={onReplyToMessage}
      />
      
      {/* Pole odpowiedzi */}
      <ReplyField
        replyContent={replyContent}
        setReplyContent={setReplyContent}
        attachments={attachments}
        setAttachments={setAttachments}
        sendingReply={sendingReply}
        replyToMessage={replyToMessage}
        onSendReply={onSendReply}
        onCancelReply={onCancelReply}
        onFileSelect={onFileSelect}
        showNotification={showNotification}
      />
    </>
  );
});

ConversationView.displayName = 'ConversationView';

export default ConversationView;
