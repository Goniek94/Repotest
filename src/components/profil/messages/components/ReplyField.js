import React, { memo, useRef } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import AttachmentList from './AttachmentList';

/**
 * Komponent pola odpowiedzi na wiadomości
 */
const ReplyField = memo(({
  replyContent,
  setReplyContent,
  attachments,
  setAttachments,
  sendingReply,
  replyToMessage,
  onSendReply,
  onCancelReply,
  onFileSelect,
  showNotification
}) => {
  const fileInputRef = useRef(null);

  const handleAttachmentClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Ograniczenie liczby załączników
    if (attachments.length + files.length > 5) {
      showNotification('Możesz dodać maksymalnie 5 załączników', 'warning');
      e.target.value = ''; // Reset input
      return;
    }
    
    // Ograniczenie rozmiaru plików (10MB)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showNotification('Niektóre pliki są zbyt duże (maksymalny rozmiar to 10MB)', 'warning');
      e.target.value = ''; // Reset input
      return;
    }
    
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = ''; // Reset input
    
    if (onFileSelect) {
      onFileSelect(e);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const isButtonDisabled = sendingReply || (!replyContent.trim() && attachments.length === 0);

  return (
    <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
      {/* Informacja o wiadomości, na którą odpowiadamy */}
      {replyToMessage && (
        <div className="mb-2 bg-gray-100 p-2 rounded-lg border-l-4 border-[#35530A] relative">
          <button 
            className="absolute top-1 right-1 text-gray-500 hover:text-red-500 transition-colors"
            onClick={onCancelReply}
            aria-label="Anuluj odpowiedź"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="text-xs text-gray-500 mb-1">
            Odpowiedź do: {replyToMessage.senderName || 'Nieznany użytkownik'}
          </div>
          <div className="text-sm text-gray-700 truncate">
            {replyToMessage.content.length > 100 
              ? `${replyToMessage.content.substring(0, 100)}...` 
              : replyToMessage.content}
          </div>
        </div>
      )}
      
      {/* Lista załączników */}
      <AttachmentList 
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
      />
      
      {/* Pole tekstowe i przyciski */}
      <div className="flex items-end gap-2">
        <textarea
          className="flex-grow p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-transparent resize-none text-sm sm:text-base"
          placeholder="Napisz wiadomość..."
          rows="2"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          disabled={sendingReply}
        />
        <div className="flex flex-col gap-1 sm:gap-2">
          {/* Przycisk załączników */}
          <button
            className="p-2 sm:p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAttachmentClick}
            disabled={sendingReply}
            title="Dodaj załącznik"
            aria-label="Dodaj załącznik"
          >
            <Paperclip className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          {/* Przycisk wysyłania */}
          <button
            className="p-2 sm:p-3 rounded-lg bg-[#35530A] text-white hover:bg-[#2A4208] transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={onSendReply}
            disabled={isButtonDisabled}
            title="Wyślij wiadomość"
            aria-label="Wyślij wiadomość"
          >
            {sendingReply ? (
              <div className="h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Ukryty input do wyboru plików */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
      />
    </div>
  );
});

ReplyField.displayName = 'ReplyField';

export default ReplyField;
