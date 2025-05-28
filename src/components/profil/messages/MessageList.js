import React, { useState } from 'react';
import { Star, StarOff, Trash2, Check, Clock, MoreVertical, Archive, Folder, Paperclip } from 'lucide-react';

/**
 * Komponent wyświetlający listę wiadomości
 * z możliwością przenoszenia wiadomości między folderami
 */
const MessageList = ({ messages, activeConversation, onSelectConversation, onStar, onDelete, onMove }) => {
  // Stan dla menu akcji (dla każdej wiadomości)
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  
  // Sortowanie wiadomości - nieprzeczytane na górze, następnie według daty
  const sortedMessages = [...messages].sort((a, b) => {
    // Nieprzeczytane wiadomości na górze
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    // Dalej sortowanie według daty (od najnowszych)
    return new Date(b.date) - new Date(a.date);
  });

  // Formatowanie daty
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Dzisiaj - tylko godzina
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    } 
    // Wczoraj
    else if (date.toDateString() === yesterday.toDateString()) {
      return 'Wczoraj';
    } 
    // W tym roku - dzień i miesiąc
    else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
    } 
    // Dawniej - pełna data
    else {
      return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  // Skracanie tekstu
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Obsługa kliknięcia gwiazdki
  const handleStarClick = (e, messageId) => {
    e.stopPropagation();
    onStar && onStar(messageId);
  };

  // Obsługa kliknięcia usunięcia
  const handleDeleteClick = (e, messageId) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    onDelete && onDelete(messageId);
  };
  
  // Obsługa przenoszenia wiadomości
  const handleMoveToFolder = (e, messageId, folder) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    onMove && onMove(messageId, folder);
  };
  
  // Obsługa kliknięcia menu akcji
  const handleActionMenuClick = (e, messageId) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === messageId ? null : messageId);
  };
  
  // Zamykanie menu akcji przy kliknięciu poza nim
  const handleOutsideClick = () => {
    if (openActionMenuId) {
      setOpenActionMenuId(null);
    }
  };
  
  // Dodanie nasłuchiwania kliknięć poza menu
  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [openActionMenuId]);

  return (
    <div className="overflow-y-auto h-full border-r border-gray-200 bg-white">
      {sortedMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center py-10">
          <div className="text-[#35530A] bg-[#35530A] bg-opacity-10 rounded-full p-3 mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <p>Brak wiadomości</p>
          <p className="text-sm">Kiedy otrzymasz wiadomości, pojawią się tutaj</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sortedMessages.map((message, index) => (
            <React.Fragment key={message.id}>
              {/* Separator daty (jeśli zmienia się data) */}
              {index > 0 && 
                new Date(message.date).toLocaleDateString() !== 
                new Date(sortedMessages[index - 1].date).toLocaleDateString() && (
                <li className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center font-medium">
                  {new Date(message.date).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </li>
              )}
              
              {/* Element wiadomości */}
              <li 
                onClick={() => onSelectConversation && onSelectConversation(message.id)}
                className={`relative cursor-pointer transition-colors p-3 border-l-4 group
                  ${activeConversation === message.id 
                    ? 'bg-[#35530A] bg-opacity-10 border-l-[#35530A]'
                    : message.isRead 
                      ? 'hover:bg-gray-50 border-l-transparent' 
                      : 'bg-[#35530A] bg-opacity-5 hover:bg-[#35530A] hover:bg-opacity-10 border-l-[#35530A]'
                  }`}
              >
                <div className="flex items-start">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-medium text-white
                    ${activeConversation === message.id ? 'bg-[#35530A]' : 'bg-[#35530A] bg-opacity-85'}`}
                  >
                    {message.sender?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  
                  {/* Informacje o wiadomości */}
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm truncate ${message.isRead ? 'font-normal text-gray-700' : 'font-bold text-[#35530A]'}`}>
                        {message.sender?.name || 'Nieznany użytkownik'}
                      </p>
                      <span className={`text-xs whitespace-nowrap ml-2 ${message.isRead ? 'text-gray-500' : 'font-medium text-gray-700'}`}>
                        {formatDate(message.date)}
                      </span>
                    </div>
                    
                    <p className={`text-sm truncate ${message.isRead ? 'font-normal text-gray-600' : 'font-semibold text-gray-700'}`}>
                      {message.title || 'Brak tematu'}
                    </p>
                    
                    <p className={`text-sm truncate mt-1 ${message.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                      {truncateText(message.content)}
                    </p>
                    
                    {/* Załączniki (jeśli istnieją) */}
                    {message.attachments?.length > 0 && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Paperclip className="w-3.5 h-3.5 mr-1" />
                        {message.attachments.length} załącznik(ów)
                      </div>
                    )}
                  </div>
                </div>

                {/* Dodatkowe informacje i akcje */}
                <div className="flex items-center justify-between mt-2">
                  {/* Status wiadomości lub licznik nieprzeczytanych */}
                  <div className="flex items-center">
                    {message.unreadCount > 0 ? (
                      <span className="flex items-center bg-[#35530A] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        {message.unreadCount}
                      </span>
                    ) : message.isRead ? (
                      <span className="flex items-center text-[#35530A] text-xs">
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Przeczytane
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Nieprzeczytane
                      </span>
                    )}
                  </div>
                  
                  {/* Przyciski akcji */}
                  <div className="flex space-x-1">
                    {/* Gwiazdka */}
                    <button 
                      className={`p-1 rounded-full ${message.isStarred ? 'text-[#35530A]' : 'text-gray-400 hover:text-[#35530A]'}`}
                      onClick={(e) => handleStarClick(e, message.id)}
                      title={message.isStarred ? 'Usuń oznaczenie jako ważne' : 'Oznacz jako ważne'}
                    >
                      {message.isStarred ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    
                    {/* Menu akcji */}
                    <div className="relative">
                      <button 
                        className="p-1 rounded-full text-gray-400 hover:text-[#35530A]"
                        onClick={(e) => handleActionMenuClick(e, message.id)}
                        title="Więcej opcji"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Menu rozwijane */}
                      {openActionMenuId === message.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
                          {/* Przenieś do archiwum */}
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#35530A] hover:bg-opacity-10 hover:text-[#35530A] flex items-center"
                            onClick={(e) => handleMoveToFolder(e, message.id, 'archiwum')}
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            Przenieś do archiwum
                          </button>
                          
                          {/* Przenieś do ważnych */}
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#35530A] hover:bg-opacity-10 hover:text-[#35530A] flex items-center"
                            onClick={(e) => handleStarClick(e, message.id)}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            {message.isStarred ? 'Usuń z ważnych' : 'Dodaj do ważnych'}
                          </button>
                          
                          {/* Usuń wiadomość */}
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center"
                            onClick={(e) => handleDeleteClick(e, message.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Usuń wiadomość
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Bezpośredni przycisk usuwania (widoczny na małych ekranach) */}
                    <button 
                      className="md:hidden p-1 rounded-full text-gray-400 hover:text-red-500"
                      onClick={(e) => handleDeleteClick(e, message.id)}
                      title="Usuń wiadomość"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Separator - linia dolna */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-100"></div>
              </li>
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageList;