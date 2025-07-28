import React, { memo } from 'react';

/**
 * Komponent wyświetlający listę załączników z możliwością usuwania
 */
const AttachmentList = memo(({ attachments, onRemoveAttachment }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {attachments.map((attachment, index) => (
        <div 
          key={`${attachment.name}-${index}`} 
          className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center gap-1"
        >
          <span 
            className="truncate max-w-[100px] sm:max-w-[150px]" 
            title={attachment.name}
          >
            {attachment.name}
          </span>
          <button 
            className="text-gray-500 hover:text-red-500 ml-1 transition-colors"
            onClick={() => onRemoveAttachment(index)}
            aria-label={`Usuń załącznik ${attachment.name}`}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
});

AttachmentList.displayName = 'AttachmentList';

export default AttachmentList;
