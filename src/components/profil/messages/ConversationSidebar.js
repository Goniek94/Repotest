import React from 'react';
import { Inbox, Send, Star, Archive, File, Trash2, Search } from 'lucide-react';

/**
 * Komponent paska bocznego konwersacji
 * Wyświetla foldery wiadomości oraz listę wiadomości w wybranym folderze
 */
const ConversationSidebar = ({
  isOpen,
  activeTab,
  setActiveTab,
  messages,
  selectedMessage,
  onMessageClick,
  toggleStar,
  removeMessage,
  loading
}) => {
  // Definicja folderów
  const folders = [
    { id: 'odebrane', label: 'Odebrane', icon: <Inbox className="w-5 h-5" /> },
    { id: 'wyslane', label: 'Wysłane', icon: <Send className="w-5 h-5" /> },
    { id: 'wazne', label: 'Ważne', icon: <Star className="w-5 h-5" /> },
    { id: 'archiwum', label: 'Archiwum', icon: <Archive className="w-5 h-5" /> },
    { id: 'robocze', label: 'Robocze', icon: <File className="w-5 h-5" /> },
    { id: 'kosz', label: 'Kosz', icon: <Trash2 className="w-5 h-5" /> },
  ];

  // Policz nieprzeczytane wiadomości w folderze
  const getUnreadCount = (folderId) => {
    if (folderId !== 'odebrane') return null;
    return messages.filter(m => !m.isRead).length;
  };

  return (
    <div 
      className={`${isOpen ? 'w-full md:w-80 border-r border-gray-200' : 'w-0 md:w-0 border-r-0'} 
                 transition-all duration-300 h-full overflow-hidden flex flex-col bg-gray-50`}
    >
      {/* Foldery */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="space-y-1">
          {folders.map(folder => {
            const unreadCount = getUnreadCount(folder.id);
            
            return (
              <button
                key={folder.id}
                onClick={() => setActiveTab(folder.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors
                          ${activeTab === folder.id 
                            ? 'bg-green-50 text-green-800 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <div className="flex items-center">
                  <span className={`mr-3 ${activeTab === folder.id ? 'text-green-700' : 'text-gray-500'}`}>
                    {folder.icon}
                  </span>
                  <span>{folder.label}</span>
                </div>
                
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Lista wiadomości */}
      <div className="flex-grow overflow-auto bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Inbox className="w-8 h-8 text-gray-400" />
            </div>
            <p>Brak wiadomości w tym folderze</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map(message => (
              <div
                key={message.id}
                onClick={() => onMessageClick(message)}
                className={`p-4 cursor-pointer transition hover:bg-gray-50 flex
                          ${selectedMessage?.id === message.id ? 'bg-green-50' : ''}
                          ${!message.isRead && activeTab === 'odebrane' ? 'bg-gray-50 border-l-4 border-green-700' : ''}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-green-100 to-green-200 text-green-800 flex-shrink-0 border border-green-200">
                  {message.photoUrl ? (
                    <img 
                      src={message.photoUrl} 
                      alt={message.sender} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold">
                      {message.avatar || message.sender.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="min-w-0 flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold text-sm text-gray-900 truncate
                                  ${!message.isRead ? 'font-bold' : ''}`}>
                      {message.sender}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2 flex-shrink-0">
                      {message.time}
                    </span>
                  </div>
                  
                  <h4 className={`text-xs mb-1 truncate text-gray-800
                                ${!message.isRead ? 'font-semibold' : ''}`}>
                    {message.subject}
                  </h4>
                  
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {message.content}
                  </p>
                  
                  <div className="flex justify-end mt-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleStar(message.id, e)}
                      className={`p-1 rounded-full hover:bg-gray-100
                                ${message.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => removeMessage(message.id, e)}
                      className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
