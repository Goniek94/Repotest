import React from 'react';
import { FileText } from 'lucide-react';

const DescriptionSection = ({ formData, handleChange, errors }) => {
  // Maksymalna długość opisu
  const maxDescriptionLength = 2000;

  // Handle paste event to clean and format pasted text
  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get pasted text from clipboard
    const pastedText = e.clipboardData.getData('text/plain');
    
    if (!pastedText) return;
    
    // Clean the pasted text
    let cleanText = pastedText
      .replace(/\r\n/g, '\n')  // Windows line breaks
      .replace(/\r/g, '\n')    // Mac line breaks
      .replace(/\t/g, ' ')     // Replace tabs with spaces
      .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
      .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple newlines with double newlines
      .trim();
    
    // Limit text length
    if (cleanText.length > maxDescriptionLength) {
      cleanText = cleanText.substring(0, maxDescriptionLength);
    }
    
    // Get current cursor position
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Get current value
    const currentValue = formData.description || '';
    
    // Create new value with pasted text
    const newValue = currentValue.substring(0, start) + cleanText + currentValue.substring(end);
    
    // Limit total length
    const finalValue = newValue.length > maxDescriptionLength 
      ? newValue.substring(0, maxDescriptionLength)
      : newValue;
    
    // Create synthetic event for handleChange
    const syntheticEvent = {
      target: {
        name: 'description',
        value: finalValue
      }
    };
    
    // Call handleChange with cleaned text
    handleChange(syntheticEvent);
    
    // Set cursor position after paste
    setTimeout(() => {
      const newCursorPosition = start + cleanText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      {/* Jedna główna karta - kompaktowa */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header karty */}
        <div className="bg-gradient-to-r from-[#35530A] to-[#2D4A06] text-white p-4">
          <div className="flex items-center">
            <FileText className="h-6 w-6 mr-3" />
            <div>
              <h2 className="text-xl font-bold">Opis pojazdu</h2>
              <p className="text-green-100 text-sm">Szczegółowy opis pojazdu</p>
            </div>
          </div>
        </div>

        {/* Zawartość karty */}
        <div className="p-6">
          {/* Pole opisu - zwiększone */}
          <div className={`relative ${errors.description ? 'mb-1' : 'mb-0'}`}>
            <textarea
              name="description"
              rows="20"
              maxLength={maxDescriptionLength}
              value={formData.description || ''}
              onChange={handleChange}
              onPaste={handlePaste}
              placeholder="Wpisz opis pojazdu..."
              className={`
                w-full border rounded-[2px] p-6 text-gray-700 text-base
                focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]
                ${errors.description ? 'border-red-500' : 'border-gray-300'}
              `}
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word', minHeight: '400px', fontSize: '16px', lineHeight: '1.6' }}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <div className="mt-2 text-sm text-gray-500 text-right">
              {formData.description ? formData.description.length : 0}/{maxDescriptionLength} znaków
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionSection;
