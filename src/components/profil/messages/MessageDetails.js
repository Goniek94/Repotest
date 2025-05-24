import React from 'react';
import { MoreHorizontal, Paperclip } from 'lucide-react';

const MessageDetails = ({ message, onGoToChat }) => {
  return (
    <div className="w-2/3 p-6 overflow-auto" style={{ height: '600px' }}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-4 flex-shrink-0"
            style={{ backgroundColor: '#EAF2DE' }}
          >
            {message.avatar}
          </div>
          <div>
            <h3 className="font-bold text-lg">{message.subject}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span className="font-medium">Od:</span> 
              <span className="ml-1">{message.sender}</span>
              <span className="text-gray-400 mx-2">&#8226;</span>
              <span>{message.date}, {message.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onGoToChat}
            className="bg-[#35530A] text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-[#2A4208]"
            style={{ borderRadius: '2px' }}
          >
            Przejdź do czatu
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-sm mb-6" style={{ borderRadius: '2px' }}>
        <p className="text-gray-800 whitespace-pre-line">
          {message.content}
        </p>
      </div>
      
      <div className="mt-6">
        <textarea 
          placeholder="Napisz odpowiedź..."
          className="w-full border border-gray-300 rounded-sm p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
          style={{ borderRadius: '2px' }}
        ></textarea>
        
        <div className="flex justify-between mt-4">
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:text-gray-700">
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          <button 
            className="bg-[#35530A] text-white px-6 py-2 rounded-sm font-medium hover:bg-[#2A4208]"
            style={{ borderRadius: '2px' }}
          >
            Odpowiedz
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetails;