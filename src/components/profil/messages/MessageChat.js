import React from 'react';
import { Phone, Video, MoreHorizontal, Send, Paperclip } from 'lucide-react';

const MessageChat = ({ message, chatMessages }) => {
  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat header */}
      <div className="border-b border-gray-200 p-3 flex justify-between items-center bg-gray-50">
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3 flex-shrink-0"
            style={{ backgroundColor: '#EAF2DE' }}
          >
            {message.avatar}
          </div>
          <div>
            <h3 className="font-bold">{message.sender}</h3>
            <p className="text-xs text-gray-500">Ostatnio online: dziś, 15:30</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-gray-700 p-2">
            <Phone className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 p-2">
            <Video className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 p-2">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-grow p-4 overflow-auto bg-gray-50" style={{ height: 'calc(600px - 132px)' }}>
        {chatMessages.map(msg => (
          <div 
            key={msg.id}
            className={`mb-4 flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.isMine && (
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg mr-2 flex-shrink-0 self-end"
                style={{ backgroundColor: '#EAF2DE' }}
              >
                {message.avatar}
              </div>
            )}
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.isMine 
                  ? 'bg-[#35530A] text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.isMine ? 'text-gray-300' : 'text-gray-500'} text-right`}>
                {msg.timestamp.split(', ')[1]}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button className="text-gray-500 hover:text-gray-700 mr-3">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Napisz wiadomość..."
            className="flex-grow border border-gray-300 rounded-l-sm p-2 focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
            style={{ borderRadius: '2px 0 0 2px' }}
          />
          <button 
            className="bg-[#35530A] text-white p-2 rounded-r-sm hover:bg-[#2A4208]"
            style={{ borderRadius: '0 2px 2px 0' }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageChat;
