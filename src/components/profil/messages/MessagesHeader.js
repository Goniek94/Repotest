import React from 'react';
import { Search, PlusCircle, MessageSquare } from 'lucide-react';

/**
 * Komponent nagłówka wiadomości
 * Zawiera tytuł i wyszukiwarkę
 */
const MessagesHeader = ({ searchTerm, onSearch, onNewMessage }) => {
  return (
    <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-white sticky top-0 z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <MessageSquare className="w-6 h-6 text-[#35530A] mr-2" />
          Wiadomości
        </h2>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Wyszukiwanie */}
        <div className="relative">
          <input
            type="text"
            placeholder="Szukaj..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent transition"
            value={searchTerm}
            onChange={onSearch}
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
        
        {/* Nowa wiadomość */}
        <button
          className="bg-[#35530A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2A4208] transition flex items-center"
          onClick={onNewMessage}
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Nowa wiadomość
        </button>
      </div>
    </div>
  );
};

export default MessagesHeader;