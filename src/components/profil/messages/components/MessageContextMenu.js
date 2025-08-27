import React, { memo } from 'react';
import { Copy, Edit3, RotateCcw, Trash2 } from 'lucide-react';

/**
 * MessageContextMenu - Menu kontekstowe dla wiadomości
 * Wyświetla opcje w zależności od tego czy wiadomość jest własna czy cudza
 */
const MessageContextMenu = memo(({ 
  message,
  isOwn,
  position,
  onCopy,
  onEdit,
  onUnsend,
  onDelete,
  onClose
}) => {
  if (!message) return null;

  const handleCopy = () => {
    onCopy(message);
    onClose();
  };

  const handleEdit = () => {
    onEdit(message);
    onClose();
  };

  const handleUnsend = () => {
    onUnsend(message);
    onClose();
  };

  const handleDelete = () => {
    onDelete(message);
    onClose();
  };

  return (
    <>
      {/* Overlay do zamykania menu */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Menu kontekstowe */}
      <div
        className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px]"
        style={{
          left: Math.min(position.x, window.innerWidth - 180),
          top: Math.min(position.y, window.innerHeight - 200)
        }}
      >
        {/* Kopiuj - zawsze dostępne */}
        <button
          onClick={handleCopy}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Kopiuj
        </button>

        {isOwn ? (
          // Opcje dla własnych wiadomości
          <>
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edytuj
            </button>
            
            <button
              onClick={handleUnsend}
              className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Cofnij
            </button>
            
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Usuń
            </button>
          </>
        ) : (
          // Opcje dla cudzych wiadomości
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Usuń u siebie
          </button>
        )}
      </div>
    </>
  );
});

MessageContextMenu.displayName = 'MessageContextMenu';

export default MessageContextMenu;
