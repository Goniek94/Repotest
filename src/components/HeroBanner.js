// src/components/HeroBanner.js
import React from 'react';

function HeroBanner() {
  return (
    <div
      className="relative w-full h-48 lg:h-64 bg-cover bg-center text-white flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/road-3186188_1920 (1).jpg')", // Ustaw ścieżkę do twojego obrazu
      }}
    >
      {/* Nakładka przyciemniająca */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Tekst na banerze */}
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-bold">Znajdź wymarzony samochód już dziś!</h2>
        <p className="text-lg mt-2">Najlepsze oferty i okazje w jednym miejscu</p>
      </div>
    </div>
  );
}

export default HeroBanner;
