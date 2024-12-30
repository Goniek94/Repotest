// src/components/AdBanner.js
import React from 'react';

function AdBanner() {
  return (
    <div
      className="relative bg-center bg-cover text-white text-center py-8 text-lg font-semibold rounded-md shadow-lg"
      style={{
        backgroundImage: "url('/images/automobile-1834278_1920.jpg')", // Ścieżka do przykładowego obrazu
      }}
    >
      {/* Nakładka dla przyciemnienia tła */}
      <div className="absolute inset-0 bg-black opacity-50 rounded-md"></div>

      {/* Tekst banera */}
      <div className="relative z-10">
        Twoje miejsce na reklamę - Skontaktuj się z nami, aby dowiedzieć się więcej!
      </div>
    </div>
  );
}

export default AdBanner;
