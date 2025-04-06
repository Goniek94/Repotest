import React from 'react';

const Description = ({ description }) => {
  return (
    <div className="bg-white p-6 shadow-md rounded-sm">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-black">
        Opis pojazdu
      </h2>
      <div className="leading-relaxed text-gray-700 whitespace-pre-line text-lg">
        {description || 'Brak opisu'}
      </div>
    </div>
  );
};

export default Description;