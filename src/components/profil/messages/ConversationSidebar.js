import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ConversationList from './ConversationList';

/**
 * Komponent paska bocznego konwersacji - NAPRAWIONY
 * Wyświetla wyszukiwanie oraz listę konwersacji w wybranym folderze
 */
const ConversationSidebar = ({
  conversations,
  selectedConversation,
  loading,
  onSelectConversation,
  onStar,
  onDelete,
  onMove,
  onSearch,
  searchQuery,
  activeTab,
  collapsed
}) => {
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');

  // Handler dla wyszukiwania
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  // Wyczyść wyszukiwanie
  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  if (collapsed) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Wyszukiwanie */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Szukaj konwersacji..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Lista konwersacji */}
      <div className="flex-1 overflow-auto">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          loading={loading}
          onSelectConversation={onSelectConversation}
          onStar={onStar}
          onDelete={onDelete}
          onMove={onMove}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default ConversationSidebar;
