import { useCallback } from 'react';
import MessagesService from '../../../../services/api/messages';

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
    (updatedMessages) => {
      if (!selectedConversation) return;
      const last = updatedMessages[updatedMessages.length - 1];

      setSelectedConversation((prev) =>
        prev && prev.id === selectedConversation.id
          ? {
              ...prev,
              lastMessage: last
                ? { content: last.content, date: last.timestamp, isRead: true }
                : { content: '', date: new Date(), isRead: true }
            }
          : prev
      );

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: last
                  ? { content: last.content, date: last.timestamp, isRead: true }
                  : { content: '', date: new Date(), isRead: true }
              }
            : conv
        )
      );
    },
    [selectedConversation, setSelectedConversation, setConversations]
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      if (!messageId) return;
      try {
        await MessagesService.delete(messageId);
        setChatMessages((prev) => {
          const updated = prev.filter((m) => m.id !== messageId);
          updateConversationAfterRemoval(updated);
          return updated;
        });
        showNotification('Wiadomość usunięta', 'success');
      } catch (err) {
        console.error('Błąd podczas usuwania wiadomości:', err);
        showNotification('Nie udało się usunąć wiadomości', 'error');
      }
    },
    [showNotification, updateConversationAfterRemoval, setChatMessages]
  );

  const archiveMessage = useCallback(
    async (messageId) => {
      if (!messageId) return;
      try {
        await MessagesService.moveToFolder(messageId, 'archived');
        setChatMessages((prev) => {
          const updated = prev.filter((m) => m.id !== messageId);
          updateConversationAfterRemoval(updated);
          return updated;
        });
        showNotification('Wiadomość zarchiwizowana', 'success');
      } catch (err) {
        console.error('Błąd podczas archiwizacji wiadomości:', err);
        showNotification('Nie udało się zarchiwizować wiadomości', 'error');
      }
    },
    [showNotification, updateConversationAfterRemoval, setChatMessages]
  );

  const sendReply = useCallback(
    async (content, attachments = []) => {
      if ((!content || !content.trim()) && (!attachments || attachments.length === 0)) {
        return Promise.reject(new Error('Brak treści wiadomości'));
      }
      if (!selectedConversation || !selectedConversation.userId) {
        return Promise.reject(new Error('Nie wybrano konwersacji'));
      }
      try {
        const formData = new FormData();
        formData.append('content', content);
        attachments.forEach((attachment) => {
          formData.append('attachments', attachment.file || attachment);
        });
        const response = await MessagesService.replyToConversation(
          selectedConversation.userId,
          formData
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
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        setConversations((prevConversations) =>
          prevConversations.map((convo) =>
            convo.id === selectedConversation.id
              ? {
                  ...convo,
                  lastMessage: {
                    content,
                    date: new Date(),
                    isRead: true
                  }
                }
              : convo
          )
        );
        setSelectedConversation((prev) => ({
          ...prev,
          lastMessage: { content, date: new Date(), isRead: true }
        }));
        showNotification('Wiadomość wysłana', 'success');
        return Promise.resolve();
      } catch (err) {
        console.error('Błąd podczas wysyłania:', err);
        showNotification('Nie udało się wysłać wiadomości', 'error');
        return Promise.reject(err);
      }
    },
    [selectedConversation, currentUserId, user, showNotification, setChatMessages, setConversations, setSelectedConversation]
  );

  return { sendReply, deleteMessage, archiveMessage };
};

export default useMessageActions;
