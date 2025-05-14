import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaStar, FaTrash, FaReply } from 'react-icons/fa';
import LoadingSpinner from '../../common/LoadingSpinner';
import Button from '../../common/Button';
import UserAvatar from '../../common/UserAvatar';
import EmptyState from '../../common/EmptyState';

/**
 * Komponent szczegółów wiadomości i konwersacji
 * @param {Object} props - Właściwości komponentu
 * @param {Object} props.selectedMessage - Wybrana wiadomość
 * @param {Array} props.conversationHistory - Historia konwersacji
 * @param {boolean} props.isLoadingConversation - Czy trwa ładowanie konwersacji
 * @param {string} props.activeTab - Aktywna zakładka
 * @param {string} props.replyContent - Treść odpowiedzi
 * @param {boolean} props.isSending - Czy trwa wysyłanie odpowiedzi
 * @param {Function} props.onReplyContentChange - Funkcja wywoływana przy zmianie treści odpowiedzi
 * @param {Function} props.onReplySubmit - Funkcja wywoływana przy wysyłaniu odpowiedzi
 * @param {Function} props.onCloseMessage - Funkcja wywoływana przy zamykaniu wiadomości
 * @param {Function} props.onToggleStar - Funkcja wywoływana przy oznaczaniu gwiazdką
 * @param {Function} props.onDeleteMessage - Funkcja wywoływana przy usuwaniu wiadomości
 * @param {Object} props.user - Zalogowany użytkownik
 * @returns {JSX.Element} - Komponent szczegółów wiadomości
 */
const MessageDetail = ({
  selectedMessage,
  conversationHistory,
  isLoadingConversation,
  activeTab,
  replyContent,
  isSending,
  onReplyContentChange,
  onReplySubmit,
  onCloseMessage,
  onToggleStar,
  onDeleteMessage,
  user
}) => {
  if (!selectedMessage) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState 
          title="Wybierz wiadomość" 
          description="Wybierz wiadomość z listy, aby zobaczyć jej szczegóły" 
          icon={FaReply}
        />
      </div>
    );
  }

  // Renderowanie wiadomości w stylu czatu
  const renderChatMessage = (message) => {
    const isCurrentUser = message.sender?._id === user?.id;
    const messageDate = new Date(message.createdAt).toLocaleString();
    
    return (
      <div 
        key={message._id} 
        className={`mb-4 ${isCurrentUser ? 'text-right' : 'text-left'}`}
      >
        <div className="flex items-start">
          {!isCurrentUser && (
            <UserAvatar 
              user={message.sender} 
              size="sm" 
              className="mr-2"
            />
          )}
          <div 
            className={`inline-block max-w-3/4 p-4 rounded-lg shadow-sm ${
              isCurrentUser 
                ? 'bg-[#35530A] bg-opacity-10 text-[#35530A] border-[#35530A] border-opacity-20 border' 
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
          >
            <div className="text-xs text-gray-500 mb-2 font-medium">
              {isCurrentUser ? 'Ty' : message.sender?.name || (message.sender?.firstName && message.sender?.lastName ? `${message.sender.firstName} ${message.sender.lastName}` : message.sender?.email)}
              <span className="mx-1">•</span>
              <span className="font-normal">{messageDate}</span>
            </div>
            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
          </div>
          {isCurrentUser && (
            <UserAvatar 
              user={user} 
              size="sm" 
              className="ml-2"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Nagłówek konwersacji */}
      <div className="border-b border-green-100 pb-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#35530A]">{selectedMessage.subject}</h2>
          <button
            type="button"
            onClick={onCloseMessage}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-600">
            {activeTab === 'sent' ? (
              <span>Do: <span className="font-medium">{selectedMessage.recipient?.name || (selectedMessage.recipient?.firstName && selectedMessage.recipient?.lastName ? `${selectedMessage.recipient.firstName} ${selectedMessage.recipient.lastName}` : selectedMessage.recipient?.email)}</span></span>
            ) : (
              <span>Od: <span className="font-medium">{selectedMessage.sender?.name || (selectedMessage.sender?.firstName && selectedMessage.sender?.lastName ? `${selectedMessage.sender.firstName} ${selectedMessage.sender.lastName}` : selectedMessage.sender?.email)}</span></span>
            )}
            <span className="mx-2">•</span>
            <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleStar(selectedMessage._id, selectedMessage.starred)}
              className={`text-sm flex items-center transition-colors px-2 py-1 rounded-md ${
                selectedMessage.starred 
                  ? 'text-yellow-500 bg-yellow-50' 
                  : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              title={selectedMessage.starred ? 'Usuń gwiazdkę' : 'Oznacz gwiazdką'}
            >
              <FaStar className="mr-1" size={14} />
              {selectedMessage.starred ? 'Oznaczone' : 'Oznacz'}
            </button>
            <button
              onClick={() => onDeleteMessage(selectedMessage._id)}
              className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors px-2 py-1 rounded-md flex items-center"
              title="Usuń wiadomość"
            >
              <FaTrash className="mr-1" size={14} />
              Usuń
            </button>
          </div>
        </div>
      </div>
      
      {/* Historia konwersacji */}
      <div className="flex-grow overflow-y-auto mb-3 max-h-[350px]">
        {isLoadingConversation ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner size="md" />
          </div>
        ) : conversationHistory.length > 0 ? (
          <div className="space-y-4">
            {conversationHistory.map(renderChatMessage)}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>Brak wcześniejszych wiadomości</p>
          </div>
        )}
      </div>
      
      {/* Formularz odpowiedzi */}
      <div className="border-t border-green-100 pt-4">
        <form onSubmit={onReplySubmit}>
          <div className="mb-3 relative">
            <textarea
              value={replyContent}
              onChange={(e) => onReplyContentChange(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 focus:border-[#35530A] focus:ring focus:ring-green-100 rounded-lg shadow-sm transition-all duration-200"
              placeholder="Napisz odpowiedź..."
              required
              disabled={isSending}
            />
            <div className="absolute top-2 right-2 text-xs text-gray-400">
              {replyContent.length > 0 ? `${replyContent.length} znaków` : ''}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Naciśnij Enter, aby wysłać
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={isSending}
              icon={FaReply}
            >
              {isSending ? 'Wysyłanie...' : 'Odpowiedz'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

MessageDetail.propTypes = {
  selectedMessage: PropTypes.object,
  conversationHistory: PropTypes.array.isRequired,
  isLoadingConversation: PropTypes.bool,
  activeTab: PropTypes.string.isRequired,
  replyContent: PropTypes.string.isRequired,
  isSending: PropTypes.bool,
  onReplyContentChange: PropTypes.func.isRequired,
  onReplySubmit: PropTypes.func.isRequired,
  onCloseMessage: PropTypes.func.isRequired,
  onToggleStar: PropTypes.func.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default MessageDetail;
