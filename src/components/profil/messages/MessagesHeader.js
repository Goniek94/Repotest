import React from 'react';
import { Search, MessageSquare } from 'lucide-react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';

/**
 * Nagłówek sekcji wiadomości
 * Responsywny - dostosowany do urządzeń mobilnych i desktopowych
 */
const MessagesHeader = ({ searchTerm, onSearch, onNewMessage, unreadCount = 0 }) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  
  const handleSearchChange = (e) => {
    onSearch && onSearch(e.target.value);
  };

  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
        {/* Nagłówek */}
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 text-[#35530A] mr-2" />
          <h1 className="text-xl font-bold text-gray-800">Wiadomości</h1>
        </div>
        
        {/* Wyszukiwarka */}
        <div className={`relative ${isMobile ? 'w-full' : 'w-64'}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Szukaj..."
            className="pl-10 pr-4 py-2 w-full text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#35530A] focus:border-[#35530A]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagesHeader;