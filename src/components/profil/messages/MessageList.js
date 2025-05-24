import React from 'react';
import { Star, StarOff, Trash2 } from 'lucide-react';

const MessageList = ({ 
  messages, 
  selectedMessage, 
  onMessageClick, 
  toggleStar, 
  deleteMessage 
}) => {
  return (
    <div className="overflow-auto" style={{ height: 'calc(600px - 46px)' }}>
      {messages.map(message => (
        <div 
          key={message.id}
          className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
            selectedMessage?.id === message.id ? 'bg-gray-100' : message.isRead ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => onMessageClick(message)}
        >
          <div className="flex items-start">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg mr-3 flex-shrink-0"
              style={{ backgroundColor: '#EAF2DE' }}
            >
              {message.avatar}
            </div>
            <div className="min-w-0 flex-grow">
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-bold text-gray-900 truncate ${!message.isRead ? 'font-extrabold' : ''}`}>
                  {message.sender}
                </h3>
                <div className="flex items-center space-x-1 ml-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">{message.date}</span>
                  <div className="flex space-x-1">
                    <button 
                      onClick={(e) => toggleStar(message.id, e)}
                      className={`text-gray-300 hover:text-yellow-500 ${message.isStarred ? 'text-yellow-500' : ''}`}
                    >
                      {message.isStarred ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={(e) => deleteMessage(message.id, e)}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <h4 className={`text-sm mb-1 truncate ${!message.isRead ? 'font-bold' : ''}`}>
                {message.subject}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2">
                {message.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;