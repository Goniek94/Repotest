import React, { memo } from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Komponent nagłówka czatu dla widoku mobilnego
 */
const MobileChatHeader = memo(({ conversation, onBack, onStar, onDelete, onArchive, onMarkAsRead }) => (
  <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack(e);
        }}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Wróć do listy konwersacji"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {conversation.subject || 'Bez tematu'}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {conversation.participants?.map(p => p.name).join(', ') || 'Nieznany nadawca'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStar();
        }}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Oznacz jako ważne"
      >
        <svg className={`h-5 w-5 ${conversation.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMarkAsRead();
        }}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Oznacz jako przeczytane"
      >
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onArchive();
        }}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Archiwizuj"
      >
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4 4-4m0 0L9 4m4 4v12" />
        </svg>
      </button>
    </div>
  </div>
));

MobileChatHeader.displayName = 'MobileChatHeader';

export default MobileChatHeader;
