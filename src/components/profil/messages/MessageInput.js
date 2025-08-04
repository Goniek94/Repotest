import React, { memo, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Image, File } from 'lucide-react';

/**
 * ✏️ MESSAGE INPUT - Input do pisania wiadomości
 * 
 * Funkcjonalności:
 * - Auto-resize textarea
 * - Reply/Edit preview
 * - Załączniki z preview
 * - Keyboard shortcuts (Enter = send, Shift+Enter = new line)
 * - Drag & drop plików
 */
const MessageInput = memo(({ 
  value,
  onChange,
  onSend,
  onFileSelect,
  attachments = [],
  onRemoveAttachment,
  replyingTo,
  editingMessage,
  onCancel,
  sending = false,
  disabled = false
}) => {
  // ===== REFS =====
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // ===== EFFECTS =====
  // Auto-focus i auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  }, [replyingTo, editingMessage]);

  // ===== HANDLERS =====
  /**
   * Auto-resize textarea
   */
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  /**
   * Obsługa zmiany tekstu
   */
  const handleTextChange = (e) => {
    onChange(e.target.value);
    adjustTextareaHeight();
  };

  /**
   * Obsługa klawiatury
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  /**
   * Obsługa wysyłania
   */
  const handleSend = () => {
    if (disabled || sending) return;
    if (!value.trim() && attachments.length === 0) return;
    
    onSend();
  };

  /**
   * Drag & Drop handlers
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Symulujemy event dla onFileSelect
      const fakeEvent = { target: { files } };
      onFileSelect?.(fakeEvent);
    }
  };

  /**
   * Formatowanie rozmiaru pliku
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // ===== RENDER REPLY/EDIT PREVIEW =====
  const renderPreview = () => {
    const preview = replyingTo || editingMessage;
    if (!preview) return null;

    const isReply = !!replyingTo;
    const title = isReply ? 'Odpowiadasz na:' : 'Edytujesz wiadomość:';
    const bgColor = isReply ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200';

    return (
      <div className={`p-3 border-t ${bgColor} border-l-4 ${isReply ? 'border-l-blue-500' : 'border-l-yellow-500'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-sm text-gray-800 truncate">
              {preview.content || 'Załącznik'}
            </p>
            {preview.senderName && (
              <p className="text-xs text-gray-500 mt-1">
                od: {preview.senderName}
              </p>
            )}
          </div>
          <button
            onClick={onCancel}
            className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
            title="Anuluj"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    );
  };

  // ===== RENDER ATTACHMENTS =====
  const renderAttachments = () => {
    if (attachments.length === 0) return null;

    return (
      <div className="p-3 border-t bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="relative bg-white border rounded-lg p-2 flex items-center gap-2 max-w-xs"
            >
              {/* Preview lub ikona */}
              {attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt={attachment.name}
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <File className="w-4 h-4 text-blue-600" />
                </div>
              )}

              {/* Info o pliku */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)}
                </p>
              </div>

              {/* Przycisk usuwania */}
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Usuń załącznik"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ===== RENDER =====
  return (
    <div className="border-t bg-white">
      {/* Reply/Edit preview */}
      {renderPreview()}

      {/* Załączniki */}
      {renderAttachments()}

      {/* Główny input */}
      <div 
        className="p-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-end gap-3">
          {/* Przycisk załączników */}
          <button
            onClick={onFileSelect}
            disabled={disabled}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Dodaj załącznik"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={
                editingMessage 
                  ? "Edytuj wiadomość..." 
                  : replyingTo 
                    ? "Napisz odpowiedź..." 
                    : "Napisz wiadomość..."
              }
              disabled={disabled || sending}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            
            {/* Wskazówka o skrótach */}
            <div className="absolute -bottom-5 left-0 text-xs text-gray-400">
              Enter = wyślij, Shift+Enter = nowa linia
            </div>
          </div>

          {/* Przycisk wysyłania */}
          <button
            onClick={handleSend}
            disabled={disabled || sending || (!value.trim() && attachments.length === 0)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={editingMessage ? "Zapisz zmiany" : "Wyślij wiadomość"}
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;
