import React, { memo } from 'react';
import { ArrowLeft, Star, Archive, Trash2, MoreHorizontal, Phone, Video, Info } from 'lucide-react';

/**
 * ChatHeader - Nagłówek panelu konwersacji
 * Wyświetla informacje o rozmówcy i opcje zarządzania
 */
const ChatHeader = memo(({ 
  conversation, 
  onStar, 
  onDelete, 
  onArchive, 
  onBack,
  showBackButton = false 
}) => {
  if (!conversation) return null;

  const handleStar = (e) => {
    e.stopPropagation();
    onStar?.();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tę konwersację?')) {
      onDelete?.();
    }
  };

  const handleArchive = (e) => {
    e.stopPropagation();
    onArchive?.();
  };

  const handleBack = (e) => {
    e.stopPropagation();
    onBack?.();
  };

  // Status użytkownika
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Nieobecny';
      case 'busy': return 'Zajęty';
      default: return 'Offline';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Lewa strona - informacje o użytkowniku */}
      <div className="flex items-center gap-3">
        {/* Przycisk powrotu (mobile) */}
        {showBackButton && (
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
            title="Powrót do listy"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Avatar użytkownika */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {conversation.userName?.charAt(0)?.toUpperCase() || 
             conversation.senderName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          
          {/* Status indicator */}
          {conversation.userStatus && (
            <div className={`
              absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
              ${getStatusColor(conversation.userStatus)}
            `}></div>
          )}
        </div>

        {/* Informacje o użytkowniku */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {conversation.userName || conversation.senderName || 'Nieznany użytkownik'}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {/* Status */}
            {conversation.userStatus && (
              <span className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(conversation.userStatus)}`}></div>
                {getStatusText(conversation.userStatus)}
              </span>
            )}
            
            {/* Ostatnia aktywność */}
            {conversation.lastSeen && !conversation.userStatus && (
              <span>
                Ostatnio widziany: {new Date(conversation.lastSeen).toLocaleDateString('pl-PL')}
              </span>
            )}
            
            {/* Informacje o ogłoszeniu */}
            {conversation.adTitle && (
              <span className="text-blue-600 truncate">
                • {conversation.adTitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Prawa strona - akcje */}
      <div className="flex items-center gap-1">
        {/* Akcje komunikacyjne */}
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-800"
          title="Zadzwoń"
          onClick={(e) => {
            e.stopPropagation();
            // Tutaj można dodać funkcjonalność dzwonienia
          }}
        >
          <Phone className="w-5 h-5" />
        </button>

        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-800"
          title="Rozmowa wideo"
          onClick={(e) => {
            e.stopPropagation();
            // Tutaj można dodać funkcjonalność wideo
          }}
        >
          <Video className="w-5 h-5" />
        </button>

        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-800"
          title="Informacje"
          onClick={(e) => {
            e.stopPropagation();
            // Tutaj można dodać panel informacji
          }}
        >
          <Info className="w-5 h-5" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Akcje zarządzania */}
        <button
          onClick={handleStar}
          className={`
            p-2 rounded-full transition-colors
            ${conversation.isStarred 
              ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }
          `}
          title={conversation.isStarred ? 'Usuń z ważnych' : 'Oznacz jako ważne'}
        >
          <Star className={`w-5 h-5 ${conversation.isStarred ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleArchive}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-800"
          title="Archiwizuj"
        >
          <Archive className="w-5 h-5" />
        </button>

        <button
          onClick={handleDelete}
          className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-600 hover:text-red-600"
          title="Usuń konwersację"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Menu więcej opcji */}
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-800"
          title="Więcej opcji"
          onClick={(e) => {
            e.stopPropagation();
            // Tutaj można dodać dropdown menu
          }}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;
