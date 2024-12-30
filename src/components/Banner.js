import React from 'react';

function Banner() {
  return (
    <div className="relative w-full min-h-[250px] max-h-[400px] bg-gray-300">
      {/* Szary placeholder zamiast docelowego obrazu */}
      <div className="absolute inset-0 bg-gray-400/30" />

      {/* Gradient na dole (opcjonalnie) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* Wyśrodkowany napis */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white font-semibold text-center">
        <p>TU BĘDZIE HERO-IMAGE W FINALNEJ WERSJI</p>
        <p className="text-sm mt-2">250×400 px</p>
      </div>
    </div>
  );
}

export default Banner;
