import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaEllipsisV, FaEnvelope } from 'react-icons/fa';
import LoadingSpinner from '../../common/LoadingSpinner';
import EmptyState from '../../common/EmptyState';
import UserAvatar from '../../common/UserAvatar';

/**
 * Komponent listy wiadomości
 * @param {Object} props - Właściwości komponentu
 * @param {Array} props.messages - Lista wiadomości
 * @param {boolean} props.isLoading - Czy trwa ładowanie
 * @param {string} props.activeTab - Aktywna zakładka
 * @param {Object} props.selectedMessage - Aktualnie wybrana wiadomość
 * @param {Function} props.onSelectMessage - Funkcja wywoływana przy wyborze wiadomości
 * @param {Function} props.onToggleStar - Funkcja wywoływana przy oznaczaniu gwiazdką
 * @param {Function} props.onDeleteMessage - Funkcja wywoływana przy usuwaniu wiadomości
 * @param {Function} props.onMarkAsRead - Funkcja wywoływana przy oznaczaniu jako przeczytane
 * @param {number|null} props.showActionsMenu - ID wiadomości z otwartym menu akcji
 * @param {Function} props.onToggleActionsMenu - Funkcja wywoływana przy przełączaniu menu akcji
 * @returns {JSX.Element} - Komponent listy wiadomości
 */
const MessageList = ({
  messages,
  isLoading,
  activeTab,
  selectedMessage,
  onSelectMessage,
  onToggleStar,
  onDeleteMessage,
  onMarkAsRead,
  showActionsMenu,
  onToggleActionsMenu
}) => {
  if (isLoading) {
    return (
      <div className="bg-green-50 rounded-lg border border-gray-200 overflow-hidden p-6 flex justify-center items-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="bg-green-50 rounded-lg border border-gray-200 overflow-hidden p-6">
        <EmptyState 
          title="Brak wiadomości" 
          description={`Nie masz żadnych wiadomości w folderze ${activeTab === 'inbox' ? 'Odebrane' : 
            activeTab === 'sent' ? 'Wysłane' : 
            activeTab === 'starred' ? 'Ważne' : 
            activeTab === 'drafts' ? 'Robocze' : 'Kosz'}`} 
          icon={FaEnvelope}
        />
      </div>
    );
  }

  return (
    <div className="bg-green-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-200 overflow-y-auto max-h-[500px]">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-4 hover:bg-green-50 transition-all duration-200 rounded-md mb-1 cursor-pointer border-l-4 ${
              selectedMessage && selectedMessage._id === msg._id 
                ? 'bg-green-50 border-[#35530A]' 
                : !msg.read && activeTab === 'inbox' 
                  ? 'bg-yellow-50 border-yellow-400 font-semibold' 
                  : 'border-transparent'
            }`}
            onClick={() => onSelectMessage(msg)}
          >
            <div className="flex justify-between">
              <div className="flex items-center">
                <UserAvatar 
                  user={activeTab === 'sent' ? msg.recipient : msg.sender} 
                  size="md" 
                  className="mr-3"
                />
                <div className="flex-grow">
                  <div className="font-medium text-gray-800">
                    {activeTab === 'sent' ? (
                      <span>Do: {msg.recipient?.name || (msg.recipient?.firstName && msg.recipient?.lastName ? `${msg.recipient.firstName} ${msg.recipient.lastName}` : msg.recipient?.email)}</span>
                    ) : (
                      <span>Od: {msg.sender?.name || (msg.sender?.firstName && msg.sender?.lastName ? `${msg.sender.firstName} ${msg.sender.lastName}` : msg.sender?.email)}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(msg._id, msg.starred);
                  }}
                  className={`p-1 rounded-full ${msg.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                  title={msg.starred ? 'Usuń gwiazdkę' : 'Oznacz gwiazdką'}
                >
                  <FaStar size={14} />
                </button>
                <div className="relative message-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleActionsMenu(msg._id === showActionsMenu ? null : msg._id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                    title="Więcej opcji"
                  >
                    <FaEllipsisV size={14} />
                  </button>
                  {showActionsMenu === msg._id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        {!msg.read && activeTab === 'inbox' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(msg._id);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <FaEnvelope className="mr-2" /> Oznacz jako przeczytane
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMessage(msg._id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <FaEnvelope className="mr-2" /> Usuń wiadomość
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-1 cursor-pointer" onClick={() => onSelectMessage(msg)}>
              <div className="text-xs text-gray-500 mb-1">
                {new Date(msg.createdAt).toLocaleDateString()}
              </div>
              <h3 className="font-medium">{msg.subject}</h3>
              <p className="text-sm text-gray-600 truncate">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  activeTab: PropTypes.string.isRequired,
  selectedMessage: PropTypes.object,
  onSelectMessage: PropTypes.func.isRequired,
  onToggleStar: PropTypes.func.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  showActionsMenu: PropTypes.string,
  onToggleActionsMenu: PropTypes.func.isRequired
};

export default MessageList;
