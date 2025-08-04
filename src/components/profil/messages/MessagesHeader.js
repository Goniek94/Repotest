import React, { memo } from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * 📋 MESSAGES HEADER - Nagłówek panelu wiadomości w stylu powiadomień
 * 
 * Wyświetla tytuł sekcji z zielonym gradientowym tłem i licznikiem nieprzeczytanych
 */
const MessagesHeader = memo(({ unreadCount = 0 }) => {
  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 rounded-2xl shadow-xl p-4 mb-2" style={{background: 'linear-gradient(135deg, #35530A, #4a7c0c, #35530A)'}}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Wiadomości
            </h1>
            {unreadCount > 0 && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                {unreadCount} {unreadCount === 1 ? 'nieprzeczytana' : 'nieprzeczytanych'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MessagesHeader.displayName = 'MessagesHeader';

export default MessagesHeader;
