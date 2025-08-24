import React, { memo } from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * 📋 MESSAGES HEADER - Nagłówek panelu wiadomości w stylu powiadomień
 * 
 * Wyświetla tytuł sekcji z zielonym gradientowym tłem i licznikiem nieprzeczytanych
 */
const MessagesHeader = memo(({ unreadCount = 0 }) => {
  return (
    <div className="bg-[#35530A] rounded-t-2xl shadow-lg p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Wiadomości
          </h1>
          {unreadCount > 0 && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm mt-1">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5 animate-pulse"></div>
              {unreadCount} {unreadCount === 1 ? 'nieprzeczytana' : 'nieprzeczytanych'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MessagesHeader.displayName = 'MessagesHeader';

export default MessagesHeader;
