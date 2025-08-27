import React, { memo } from 'react';
import { X, Image, FileText, Plus } from 'lucide-react';

/**
 * AttachmentPreview - Podgląd załączników przed wysłaniem
 * Obsługuje zdjęcia, pliki i drag & drop
 */
const AttachmentPreview = memo(({ 
  attachments = [],
  onRemoveAttachment,
  dragOver = false,
  onDragOver,
  onDragLeave,
  onDrop,
  showAttachmentMenu = false,
  onToggleAttachmentMenu,
  onFileSelect,
  fileInputRef,
  sending = false
}) => {
  
  /**
   * Formatowanie rozmiaru pliku
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Pobieranie ikony dla typu pliku
   */
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type === 'application/pdf') return <FileText className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div 
      className={`relative ${dragOver ? 'bg-blue-50 border-blue-300' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Podgląd załączników */}
      {attachments.length > 0 && (
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 font-medium">
              Załączniki ({attachments.length})
            </span>
            <button
              onClick={() => {
                attachments.forEach(att => {
                  if (att.preview) URL.revokeObjectURL(att.preview);
                });
                // Wywołaj callback do wyczyszczenia załączników w rodzicu
                attachments.forEach(att => onRemoveAttachment(att.id));
              }}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Usuń wszystkie
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {attachments.map(attachment => (
              <div key={attachment.id} className="relative group">
                {attachment.preview ? (
                  // Podgląd obrazu
                  <div className="relative">
                    <img
                      src={attachment.preview}
                      alt={attachment.name}
                      className="w-full h-16 object-cover rounded border"
                    />
                    <button
                      onClick={() => onRemoveAttachment(attachment.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  // Ikona pliku
                  <div className="relative p-2 border rounded bg-white">
                    <div className="flex items-center gap-2">
                      {getFileIcon(attachment.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveAttachment(attachment.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drag & Drop overlay */}
      {dragOver && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <p className="text-blue-700 font-medium">Upuść pliki tutaj</p>
            <p className="text-blue-600 text-sm">Obsługiwane: zdjęcia, PDF, TXT</p>
          </div>
        </div>
      )}

      {/* Przycisk załączników i menu */}
      <div className="relative">
        <button
          onClick={onToggleAttachmentMenu}
          disabled={sending}
          className="
            p-2 sm:p-2.5
            text-gray-600 hover:text-[#35530A] hover:bg-gray-100
            rounded-full transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex-shrink-0
          "
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Menu załączników */}
        {showAttachmentMenu && (
          <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Image className="w-4 h-4" />
                Dodaj zdjęcie
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Dodaj plik
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <div className="px-4 py-2">
                <p className="text-xs text-gray-500">
                  Przeciągnij i upuść pliki lub wklej ze schowka
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Max 10MB • JPG, PNG, GIF, PDF, TXT
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt"
          onChange={onFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
});

AttachmentPreview.displayName = 'AttachmentPreview';

export default AttachmentPreview;
