import React, { memo, useState } from 'react';
import { Reply, Edit3, Trash2, MoreHorizontal, Check, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

/**
 * 💬 MESSAGE BUBBLE - Bąbelek wiadomości w stylu Messenger
 * 
 * Funkcjonalności:
 * - Hover menu z akcjami (Reply, Edit, Delete)
 * - Status indicators (wysłane, dostarczone, przeczytane)
 * - Reply preview
 * - Edit indicator
 * - Obsługa załączników
 */
const MessageBubble = memo(({ 
  message,
  isOwn = false,
  onReply,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false
}) => {
  // ===== STATE =====
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ===== HELPERS =====
  /**
   * Formatowanie czasu wiadomości
   */
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: pl 
      });
    } catch {
      return 'nieznany czas';
    }
  };

  /**
   * Sprawdzenie czy wiadomość można edytować (15 minut)
   */
  const canEditMessage = () => {
    if (!canEdit) return false;
    const messageTime = new Date(message.createdAt);
    const now = new Date();
    const diffMinutes = (now - messageTime) / (1000 * 60);
    return diffMinutes <= 15;
  };

  /**
   * Renderowanie statusu wiadomości
   */
  const renderMessageStatus = () => {
    if (!isOwn) return null;

    const { status } = message;
    
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  /**
   * Renderowanie reply preview
   */
  const renderReplyPreview = () => {
    if (!message.replyTo) return null;

    return (
      <div className="mb-2 p-2 bg-gray-100 rounded-lg border-l-4 border-blue-500">
        <p className="text-xs text-gray-600 font-medium">
          Odpowiedź na: {message.replyTo.senderName}
        </p>
        <p className="text-sm text-gray-700 truncate">
          {message.replyTo.content}
        </p>
      </div>
    );
  };

  /**
   * Renderowanie załączników
   */
  const renderAttachments = () => {
    if (!message.attachments?.length) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment, index) => (
          <div key={index} className="max-w-xs">
            {attachment.type?.startsWith('image/') ? (
              <div className="relative">
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  onError={() => setImageError(true)}
                  onClick={() => window.open(attachment.url, '_blank')}
                />
                {imageError && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Błąd ładowania obrazu</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {attachment.name?.split('.').pop()?.toUpperCase() || 'FILE'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => window.open(attachment.url, '_blank')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Pobierz
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  /**
   * Renderowanie menu akcji
   */
  const renderActionMenu = () => {
    if (!showActions) return null;

    return (
      <div className={`
        absolute top-0 flex items-center gap-1 bg-white shadow-lg rounded-lg p-1 border
        ${isOwn ? 'right-full mr-2' : 'left-full ml-2'}
      `}>
        {/* Reply */}
        <button
          onClick={onReply}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Odpowiedz"
        >
          <Reply className="w-4 h-4 text-gray-600" />
        </button>

        {/* Edit - tylko własne wiadomości i w ciągu 15 minut */}
        {canEditMessage() && (
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edytuj (do 15 minut)"
          >
            <Edit3 className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Delete */}
        {canDelete && (
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            title="Usuń"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    );
  };

  // ===== RENDER =====
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          relative max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
          ${isOwn 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-900'
          }
        `}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Reply preview */}
        {renderReplyPreview()}

        {/* Treść wiadomości */}
        {message.content && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        {/* Załączniki */}
        {renderAttachments()}

        {/* Czas i status */}
        <div className={`
          flex items-center gap-1 mt-1 text-xs
          ${isOwn ? 'text-blue-100' : 'text-gray-500'}
        `}>
          <span>{formatMessageTime(message.createdAt)}</span>
          
          {/* Indicator edycji */}
          {message.isEdited && (
            <span className="italic">(edytowane)</span>
          )}
          
          {/* Status wiadomości */}
          {renderMessageStatus()}
        </div>

        {/* Menu akcji */}
        {renderActionMenu()}
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
