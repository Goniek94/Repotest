import { useCallback } from 'react';
import messagesApi from '../../../../services/api/messagesApi';

/**
 * Hook providing actions for sending, deleting and archiving messages.
 * Separated from useConversations to keep that hook smaller.
 */
const useMessageActions = ({
  selectedConversation,
  setSelectedConversation,
  setConversations,
  setChatMessages,
  currentUserId,
  user,
  showNotification
}) => {
  // Update conversation after removing a message
  const updateConversationAfterRemoval = useCallback(
    (updatedMessages, conversationId) => {
      if (!conversationId) return;
      
      const lastMessage = updatedMessages[updatedMessages.length - 1];
      const lastMessageData = lastMessage
        ? { content: lastMessage.content, date: lastMessage.timestamp, isRead: true }
        : { content: '', date: new Date(), isRead: true };

      // Use functional updates to avoid stale closure issues
      setSelectedConversation((prev) =>
        prev && prev.id === conversationId
          ? { ...prev, lastMessage: lastMessageData }
          : prev
      );

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, lastMessage: lastMessageData }
            : conv
        )
      );
    },
    [setSelectedConversation, setConversations]
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      if (!messageId || !selectedConversation?.id) return;
      
      const conversationId = selectedConversation.id;
      
      try {
        await messagesApi.deleteMessage(messageId);
        
        setChatMessages((prev) => {
          const updated = prev.filter((m) => m.id !== messageId);
          // Call update function with the conversationId to avoid stale closure
          updateConversationAfterRemoval(updated, conversationId);
          return updated;
        });
        
        showNotification('Wiadomość usunięta', 'success');
      } catch (err) {
        console.error('Błąd podczas usuwania wiadomości:', err);
        showNotification('Nie udało się usunąć wiadomości', 'error');
      }
    },
    [selectedConversation?.id, showNotification, updateConversationAfterRemoval, setChatMessages]
  );

  const archiveMessage = useCallback(
    async (messageId) => {
      if (!messageId || !selectedConversation?.id) return;
      
      const conversationId = selectedConversation.id;
      
      try {
        await messagesApi.archiveMessage(messageId);
        
        setChatMessages((prev) => {
          const updated = prev.filter((m) => m.id !== messageId);
          // Call update function with the conversationId to avoid stale closure
          updateConversationAfterRemoval(updated, conversationId);
          return updated;
        });
        
        showNotification('Wiadomość zarchiwizowana', 'success');
      } catch (err) {
        console.error('Błąd podczas archiwizacji wiadomości:', err);
        showNotification('Nie udało się zarchiwizować wiadomości', 'error');
      }
    },
    [selectedConversation?.id, showNotification, updateConversationAfterRemoval, setChatMessages]
  );

  const sendReply = useCallback(
    async (content, attachments = []) => {
      if ((!content || !content.trim()) && (!attachments || attachments.length === 0)) {
        return Promise.reject(new Error('Brak treści wiadomości'));
      }
      
      if (!selectedConversation?.userId) {
        return Promise.reject(new Error('Nie wybrano konwersacji'));
      }

      const conversationId = selectedConversation.id;
      const recipientUserId = selectedConversation.userId;
      
      try {
        const response = await messagesApi.replyToConversation(
          recipientUserId,
          content,
          attachments
        );
        
        const newMessage = {
          id: response?.data?._id || `temp-${Date.now()}`,
          sender: currentUserId,
          senderName: user?.name || user?.email || 'Ja',
          content,
          timestamp: new Date(),
          isRead: true,
          isDelivered: true,
          isDelivering: false,
          attachments: attachments.map((attachment) => ({
            id: `temp-${attachment.name}`,
            name: attachment.name,
            url: attachment.file ? URL.createObjectURL(attachment.file) : attachment.url,
            type: (attachment.file ? attachment.file.type : attachment.type) || 'application/octet-stream'
          }))
        };

        const lastMessageData = {
          content,
          date: new Date(),
          isRead: true
        };
        
        // Update chat messages
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        
        // Update conversations list
        setConversations((prevConversations) =>
          prevConversations.map((convo) =>
            convo.id === conversationId
              ? { ...convo, lastMessage: lastMessageData }
              : convo
          )
        );
        
        // Update selected conversation
        setSelectedConversation((prev) => 
          prev && prev.id === conversationId
            ? { ...prev, lastMessage: lastMessageData }
            : prev
        );
        
        showNotification('Wiadomość wysłana', 'success');
        return Promise.resolve();
      } catch (err) {
        console.error('Błąd podczas wysyłania:', err);
        showNotification('Nie udało się wysłać wiadomości', 'error');
        return Promise.reject(err);
      }
    },
    [
      selectedConversation?.id,
      selectedConversation?.userId,
      currentUserId,
      user?.name,
      user?.email,
      showNotification,
      setChatMessages,
      setConversations,
      setSelectedConversation
    ]
  );

  const editMessage = useCallback(
    async (messageId, messageData) => {
      if (!messageId || !messageData?.content?.trim()) {
        return Promise.reject(new Error('Brak treści wiadomości'));
      }
      
      if (!selectedConversation?.id) {
        return Promise.reject(new Error('Nie wybrano konwersacji'));
      }

      try {
        const response = await messagesApi.editMessage(messageId, {
          content: messageData.content,
          attachments: messageData.attachments || []
        });
        
        // Update message in chat
        setChatMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: messageData.content,
                  isEdited: true,
                  attachments: messageData.attachments || msg.attachments || []
                }
              : msg
          )
        );
        
        showNotification('Wiadomość została zaktualizowana', 'success');
        return Promise.resolve();
      } catch (err) {
        console.error('Błąd podczas edycji wiadomości:', err);
        showNotification('Nie udało się zaktualizować wiadomości', 'error');
        return Promise.reject(err);
      }
    },
    [selectedConversation?.id, showNotification, setChatMessages]
  );

  return { sendReply, editMessage, deleteMessage, archiveMessage };
};

export default useMessageActions;
