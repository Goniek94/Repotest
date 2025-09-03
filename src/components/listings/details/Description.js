import React from 'react';

const Description = ({ description }) => {
  // Function to format description text properly
  const formatDescription = (text) => {
    if (!text || typeof text !== 'string') {
      return null;
    }

    // Clean the text and handle different line break formats
    let cleanText = text.trim();
    
    // Replace various line break formats with \n
    cleanText = cleanText
      .replace(/\r\n/g, '\n')  // Windows line breaks
      .replace(/\r/g, '\n')    // Mac line breaks
      .replace(/\\n/g, '\n')   // Escaped newlines
      .replace(/\n\s*\n/g, '\n\n'); // Multiple newlines with spaces
    
    // Split by newlines and filter out empty paragraphs
    const paragraphs = cleanText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    // If no proper paragraphs found, treat as single paragraph
    if (paragraphs.length === 0) {
      return [cleanText];
    }
    
    return paragraphs;
  };

  const formattedParagraphs = formatDescription(description);

  return (
    <div className="bg-white p-6 shadow-md rounded-sm">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-black">
        Opis pojazdu
      </h2>
      <div className="leading-relaxed text-gray-700 text-lg">
        {formattedParagraphs && formattedParagraphs.length > 0 ? (
          formattedParagraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-gray-500 italic">Brak opisu</p>
        )}
      </div>
    </div>
  );
};

export default Description;
